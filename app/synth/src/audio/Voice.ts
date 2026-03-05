// Pure TypeScript Web Audio Voice — no framework imports

import { midiToFreq, oscMixerLookup } from './lookup';
import type { VoiceTriggerParams, SynthData } from '../types/synth';

export default class Voice {
  private ctx: AudioContext;
  readonly index: number;
  private noiseBuffer: AudioBuffer;
  private onStatusChange: () => void;

  isActive: boolean;
  private releaseTimeoutId: ReturnType<typeof setTimeout> | null;
  lastTriggerTime: number;
  releaseStartTime: number;
  isInRelease: boolean;
  private lastPitch: number | null;
  private lastFilterFreq: number | null;

  // Oscillators
  private osc1!: OscillatorNode;
  private osc1Gain!: GainNode;
  private osc2!: OscillatorNode;
  private osc2Gain!: GainNode;
  private subOsc!: OscillatorNode;
  private subGain!: GainNode;

  // Noise chain
  private noiseSource!: AudioBufferSourceNode;
  private noiseBandpass!: BiquadFilterNode;
  private noiseEnvelope!: GainNode;
  private noiseLevelGain!: GainNode;

  // Filter chain
  private filterDrive!: GainNode;
  private filterSaturation!: WaveShaperNode;
  private filter!: BiquadFilterNode;
  private envelopeGain!: GainNode;

  // Distortion chain
  private distortionDrive!: GainNode;
  private distortionShaper!: WaveShaperNode;

  // Output routing
  private dryGain!: GainNode;
  private delaySendGain!: GainNode;
  private reverbSendGain!: GainNode;
  output!: GainNode;

  // Cached synthData needed during release
  private currentSynthData: SynthData | null = null;

  constructor(
    ctx: AudioContext,
    voiceIndex: number,
    noiseBuffer: AudioBuffer,
    onStatusChange: () => void,
  ) {
    this.ctx = ctx;
    this.index = voiceIndex;
    this.noiseBuffer = noiseBuffer;
    this.onStatusChange = onStatusChange;

    this.isActive = false;
    this.releaseTimeoutId = null;
    this.lastTriggerTime = 0;
    this.releaseStartTime = 0;
    this.isInRelease = false;
    this.lastPitch = null;
    this.lastFilterFreq = null;

    this.createNodes();
  }

  private createNodes(): void {
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // --- Oscillator 1 ---
    this.osc1 = ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.value = 440;
    this.osc1Gain = ctx.createGain();
    this.osc1Gain.gain.value = 0;
    this.osc1.connect(this.osc1Gain);
    this.osc1.start(now);

    // --- Oscillator 2 ---
    this.osc2 = ctx.createOscillator();
    this.osc2.type = 'sawtooth';
    this.osc2.frequency.value = 440;
    this.osc2Gain = ctx.createGain();
    this.osc2Gain.gain.value = 0;
    this.osc2.connect(this.osc2Gain);
    this.osc2.start(now);

    // --- Sub Oscillator ---
    this.subOsc = ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.value = 220;
    this.subGain = ctx.createGain();
    this.subGain.gain.value = 0;
    this.subOsc.connect(this.subGain);
    this.subOsc.start(now);

    // --- Noise chain ---
    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = this.noiseBuffer;
    this.noiseSource.loop = true;
    this.noiseBandpass = ctx.createBiquadFilter();
    this.noiseBandpass.type = 'bandpass';
    this.noiseBandpass.frequency.value = 1000;
    this.noiseBandpass.Q.value = 5;
    this.noiseEnvelope = ctx.createGain();
    this.noiseEnvelope.gain.value = 0;
    this.noiseLevelGain = ctx.createGain();
    this.noiseLevelGain.gain.value = 0;
    this.noiseSource.connect(this.noiseBandpass);
    this.noiseBandpass.connect(this.noiseEnvelope);
    this.noiseEnvelope.connect(this.noiseLevelGain);
    this.noiseSource.start(now);

    // --- Filter chain ---
    this.filterDrive = ctx.createGain();
    this.filterDrive.gain.value = 1.3;
    this.filterSaturation = ctx.createWaveShaper();
    this.filterSaturation.curve = this.createFilterSaturationCurve(2048);
    this.filterSaturation.oversample = '2x';
    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 5000;
    this.filter.Q.value = 1;
    this.envelopeGain = ctx.createGain();
    this.envelopeGain.gain.value = 0;

    // Mix sources into filterDrive
    this.osc1Gain.connect(this.filterDrive);
    this.osc2Gain.connect(this.filterDrive);
    this.subGain.connect(this.filterDrive);
    this.noiseLevelGain.connect(this.filterDrive);

    // Filter signal path
    this.filterDrive.connect(this.filterSaturation);
    this.filterSaturation.connect(this.filter);
    this.filter.connect(this.envelopeGain);

    // --- Distortion chain ---
    this.distortionDrive = ctx.createGain();
    this.distortionDrive.gain.value = 1.0;
    this.distortionShaper = ctx.createWaveShaper();
    this.distortionShaper.curve = this.createDistortionCurve(4096);
    this.distortionShaper.oversample = '4x';

    // Output routing
    this.dryGain = ctx.createGain();
    this.dryGain.gain.value = 1.0;
    this.delaySendGain = ctx.createGain();
    this.delaySendGain.gain.value = 0;
    this.reverbSendGain = ctx.createGain();
    this.reverbSendGain.gain.value = 0;

    this.envelopeGain.connect(this.distortionDrive);
    this.distortionDrive.connect(this.distortionShaper);
    this.distortionShaper.connect(this.dryGain);
    this.distortionShaper.connect(this.delaySendGain);
    this.distortionShaper.connect(this.reverbSendGain);

    this.output = this.dryGain;
  }

  private createDistortionCurve(samples: number): Float32Array {
    const curve = new Float32Array(samples);
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = Math.tanh(x * 4) / Math.tanh(4);
    }
    return curve;
  }

  private createFilterSaturationCurve(samples: number): Float32Array {
    const curve = new Float32Array(samples);
    const amount = 1.5;
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = Math.tanh(x * amount) / Math.tanh(amount);
    }
    return curve;
  }

  trigger(params: VoiceTriggerParams, synthData: SynthData): void {
    // --- Validate and create safeParams ---
    const safeParams: VoiceTriggerParams = {
      pitch: isFinite(params.pitch) ? params.pitch : 60,
      oscMixer: isFinite(params.oscMixer) ? params.oscMixer : 0,
      filterFrequency: isFinite(params.filterFrequency) && params.filterFrequency > 0
        ? params.filterFrequency
        : 1000,
      filterResonance: isFinite(params.filterResonance) && params.filterResonance >= 0
        ? params.filterResonance
        : 1,
      attackTime: isFinite(params.attackTime) && params.attackTime >= 0
        ? params.attackTime
        : 0.01,
      decayTime: isFinite(params.decayTime) && params.decayTime >= 0
        ? params.decayTime
        : 0.1,
      sustainLevel: isFinite(params.sustainLevel) && params.sustainLevel >= 0
        ? Math.min(params.sustainLevel, 1)
        : 0.7,
      duration: isFinite(params.duration) && params.duration > 0
        ? params.duration
        : 0.5,
      useSlide: params.useSlide === true,
      lastFreq: params.lastFreq !== null && isFinite(params.lastFreq) && params.lastFreq > 0
        ? params.lastFreq
        : null,
      portamentoTime: isFinite(params.portamentoTime) && params.portamentoTime >= 0
        ? params.portamentoTime
        : 0,
      portamentoCurve: isFinite(params.portamentoCurve)
        ? params.portamentoCurve
        : 0,
      noiseAttackTime: isFinite(params.noiseAttackTime) && params.noiseAttackTime >= 0
        ? params.noiseAttackTime
        : 0.01,
      noiseDecayTime: isFinite(params.noiseDecayTime) && params.noiseDecayTime >= 0
        ? params.noiseDecayTime
        : 0.1,
      noiseSustainLevel: isFinite(params.noiseSustainLevel) && params.noiseSustainLevel >= 0
        ? Math.min(params.noiseSustainLevel, 1)
        : 0,
      delaySend: isFinite(params.delaySend) && params.delaySend >= 0
        ? Math.min(params.delaySend, 1)
        : 0,
      reverbSend: isFinite(params.reverbSend) && params.reverbSend >= 0
        ? Math.min(params.reverbSend, 1)
        : 0,
      distortion: isFinite(params.distortion) && params.distortion >= 0
        ? Math.min(params.distortion, 1)
        : 0,
      fadeIn: params.fadeIn === true,
    };

    // If currently active, release first
    if (this.isActive) {
      this.release();
    }

    this.isActive = true;
    this.isInRelease = false;
    this.lastTriggerTime = this.ctx.currentTime;
    this.currentSynthData = synthData;

    this.onStatusChange();

    const now = this.ctx.currentTime;
    const fadeIn = safeParams.fadeIn;
    const fadeInTime = fadeIn ? 0.005 : 0;

    // Base frequency from MIDI pitch + global pitch offset
    const globalPitchSemitones = isFinite(synthData.osc1.globalPitch) ? synthData.osc1.globalPitch : 0;
    const midiNote = safeParams.pitch + globalPitchSemitones;
    const baseFreq = midiToFreq(midiNote);
    this.lastPitch = safeParams.pitch;

    // --- Frequency: portamento/slide vs immediate ---
    if (safeParams.useSlide && safeParams.lastFreq !== null && safeParams.portamentoTime > 0) {
      this.applyPortamento(
        safeParams.lastFreq,
        baseFreq,
        now,
        safeParams.portamentoTime,
        safeParams.portamentoCurve,
      );
    } else {
      this.setFrequencies(baseFreq, now, synthData);
    }

    // --- Oscillator mixer gains ---
    const mixGains = oscMixerLookup.getGains(safeParams.oscMixer);
    const rampTime = now + 0.005;
    this.osc1Gain.gain.cancelScheduledValues(now);
    this.osc1Gain.gain.setValueAtTime(this.osc1Gain.gain.value, now);
    this.osc1Gain.gain.linearRampToValueAtTime(mixGains.osc1, rampTime);

    this.osc2Gain.gain.cancelScheduledValues(now);
    this.osc2Gain.gain.setValueAtTime(this.osc2Gain.gain.value, now);
    this.osc2Gain.gain.linearRampToValueAtTime(mixGains.osc2, rampTime);

    // --- Sub oscillator level ---
    const subLevel = isFinite(synthData.sub.level) ? Math.max(0, Math.min(1, synthData.sub.level)) : 0;
    this.subGain.gain.cancelScheduledValues(now);
    this.subGain.gain.setValueAtTime(this.subGain.gain.value, now);
    this.subGain.gain.linearRampToValueAtTime(subLevel * 0.4, rampTime);

    // --- Noise level ---
    const noiseLevel = isFinite(synthData.noise.level) ? Math.max(0, Math.min(1, synthData.noise.level)) : 0;
    this.noiseLevelGain.gain.cancelScheduledValues(now);
    this.noiseLevelGain.gain.setValueAtTime(this.noiseLevelGain.gain.value, now);
    this.noiseLevelGain.gain.linearRampToValueAtTime(noiseLevel, now + 0.005);

    // --- Noise bandpass key tracking ---
    if (synthData.noise.bandpass.keyTracking) {
      const trackedFreq = baseFreq;
      if (trackedFreq !== this.lastFilterFreq) {
        this.noiseBandpass.frequency.cancelScheduledValues(now);
        this.noiseBandpass.frequency.setValueAtTime(this.noiseBandpass.frequency.value, now);
        this.noiseBandpass.frequency.linearRampToValueAtTime(trackedFreq, now + 0.005);
      }
    } else {
      const bpFreq = isFinite(synthData.noise.bandpass.frequency) && synthData.noise.bandpass.frequency > 0
        ? synthData.noise.bandpass.frequency
        : 1000;
      this.noiseBandpass.frequency.cancelScheduledValues(now);
      this.noiseBandpass.frequency.setValueAtTime(this.noiseBandpass.frequency.value, now);
      this.noiseBandpass.frequency.linearRampToValueAtTime(bpFreq, now + 0.005);
    }
    const bpQ = isFinite(synthData.noise.bandpass.q) && synthData.noise.bandpass.q > 0
      ? synthData.noise.bandpass.q
      : 5;
    this.noiseBandpass.Q.setValueAtTime(bpQ, now);

    // --- Noise ADSR envelope ---
    const noiseAttack = safeParams.noiseAttackTime;
    const noiseDecay = safeParams.noiseDecayTime;
    const noiseSustain = safeParams.noiseSustainLevel;
    const noiseRelease = isFinite(synthData.noise.adsr.release) && synthData.noise.adsr.release >= 0
      ? synthData.noise.adsr.release
      : 0.1;

    this.noiseEnvelope.gain.cancelScheduledValues(now);
    this.noiseEnvelope.gain.setValueAtTime(0, now);
    if (noiseAttack > 0.001) {
      this.noiseEnvelope.gain.linearRampToValueAtTime(1, now + fadeInTime + noiseAttack);
    } else {
      this.noiseEnvelope.gain.setValueAtTime(1, now + fadeInTime);
    }
    const noiseDecayEnd = now + fadeInTime + noiseAttack + noiseDecay;
    const noiseSustainClamped = Math.max(0.0001, noiseSustain);
    this.noiseEnvelope.gain.exponentialRampToValueAtTime(noiseSustainClamped, noiseDecayEnd);

    // --- Main amplitude ADSR envelope ---
    const attack = safeParams.attackTime;
    const decay = safeParams.decayTime;
    const sustain = safeParams.sustainLevel;

    this.envelopeGain.gain.cancelScheduledValues(now);
    this.envelopeGain.gain.setValueAtTime(0, now);
    if (attack > 0.001) {
      this.envelopeGain.gain.linearRampToValueAtTime(1, now + fadeInTime + attack);
    } else {
      this.envelopeGain.gain.setValueAtTime(1, now + fadeInTime);
    }
    const decayEnd = now + fadeInTime + attack + decay;
    const sustainClamped = Math.max(0.0001, sustain);
    this.envelopeGain.gain.exponentialRampToValueAtTime(sustainClamped, decayEnd);

    // --- Filter frequency + envelope modulation ---
    const filterFreqBase = isFinite(safeParams.filterFrequency) && safeParams.filterFrequency > 0
      ? safeParams.filterFrequency
      : 1000;
    const filterRes = isFinite(safeParams.filterResonance) && safeParams.filterResonance >= 0
      ? safeParams.filterResonance
      : 1;

    // Filter key tracking
    let finalFilterFreq = filterFreqBase;
    if (synthData.filter.keyTracking) {
      const keyTrackedFreq = baseFreq;
      if (keyTrackedFreq !== this.lastFilterFreq) {
        finalFilterFreq = keyTrackedFreq;
        this.lastFilterFreq = keyTrackedFreq;
      }
    } else {
      this.lastFilterFreq = filterFreqBase;
    }

    const filterEnvAmount = isFinite(synthData.filterEnvelope.amount)
      ? synthData.filterEnvelope.amount
      : 0;
    const filterEnvAttack = isFinite(synthData.filterEnvelope.attack) && synthData.filterEnvelope.attack >= 0
      ? synthData.filterEnvelope.attack
      : 0.01;
    const filterEnvDecay = isFinite(synthData.filterEnvelope.decay) && synthData.filterEnvelope.decay >= 0
      ? synthData.filterEnvelope.decay
      : 0.1;
    const filterEnvSustain = isFinite(synthData.filterEnvelope.sustain)
      ? Math.max(0, Math.min(1, synthData.filterEnvelope.sustain))
      : 0.5;

    // Calculate filter frequency modulation
    const filterFreqPeak = Math.min(
      20000,
      finalFilterFreq + filterEnvAmount * (20000 - finalFilterFreq),
    );
    const filterFreqSustainVal = Math.min(
      20000,
      finalFilterFreq + filterEnvAmount * filterEnvSustain * (20000 - finalFilterFreq),
    );

    this.filter.frequency.cancelScheduledValues(now);
    this.filter.frequency.setValueAtTime(finalFilterFreq, now);
    this.filter.Q.setValueAtTime(Math.max(0.0001, filterRes), now);

    if (filterEnvAmount > 0 || filterEnvAmount < 0) {
      const filterPeakClamped = Math.max(20, Math.min(20000, filterFreqPeak));
      const filterSustainClamped = Math.max(20, Math.min(20000, filterFreqSustainVal));

      if (filterEnvAttack > 0.001) {
        this.filter.frequency.linearRampToValueAtTime(
          filterPeakClamped,
          now + fadeInTime + filterEnvAttack,
        );
      } else {
        this.filter.frequency.setValueAtTime(filterPeakClamped, now + fadeInTime);
      }
      const filterDecayEnd = now + fadeInTime + filterEnvAttack + filterEnvDecay;
      this.filter.frequency.linearRampToValueAtTime(filterSustainClamped, filterDecayEnd);
    } else {
      this.filter.frequency.setValueAtTime(Math.max(20, Math.min(20000, finalFilterFreq)), now);
    }

    // --- Oscillator types from synthData ---
    const osc1Type = this.getOscType(synthData.osc1.waveform);
    const osc2Type = this.getOscType(synthData.osc2.waveform);
    const subType = this.getOscType(synthData.sub.waveform);
    if (this.osc1.type !== osc1Type) this.osc1.type = osc1Type;
    if (this.osc2.type !== osc2Type) this.osc2.type = osc2Type;
    if (this.subOsc.type !== subType) this.subOsc.type = subType;

    // --- Distortion drive ---
    const distAmount = isFinite(safeParams.distortion) ? Math.max(0, Math.min(1, safeParams.distortion)) : 0;
    const driveValue = 1 + distAmount * 19;
    this.distortionDrive.gain.cancelScheduledValues(now);
    this.distortionDrive.gain.setValueAtTime(this.distortionDrive.gain.value, now);
    this.distortionDrive.gain.linearRampToValueAtTime(driveValue, now + 0.005);

    // --- Delay / Reverb send gains ---
    this.delaySendGain.gain.cancelScheduledValues(now);
    this.delaySendGain.gain.setValueAtTime(this.delaySendGain.gain.value, now);
    this.delaySendGain.gain.linearRampToValueAtTime(safeParams.delaySend, now + 0.005);

    this.reverbSendGain.gain.cancelScheduledValues(now);
    this.reverbSendGain.gain.setValueAtTime(this.reverbSendGain.gain.value, now);
    this.reverbSendGain.gain.linearRampToValueAtTime(safeParams.reverbSend, now + 0.005);

    // --- Schedule release after duration ---
    if (this.releaseTimeoutId !== null) {
      clearTimeout(this.releaseTimeoutId);
      this.releaseTimeoutId = null;
    }
    const releaseDuration = safeParams.duration * 1000;
    this.releaseTimeoutId = setTimeout(() => {
      this.releaseTimeoutId = null;
      if (this.isActive && !this.isInRelease) {
        this.release();
      }
    }, releaseDuration);
  }

  release(): void {
    if (!this.isActive) return;

    this.isInRelease = true;
    this.releaseStartTime = this.ctx.currentTime;
    const now = this.releaseStartTime;

    const synthData = this.currentSynthData;
    const releaseTime = synthData && isFinite(synthData.adsr?.release) && synthData.adsr.release >= 0
      ? synthData.adsr.release / 1000
      : 0.3;
    const noiseReleaseTime = synthData && isFinite(synthData.noise?.adsr?.release) && synthData.noise.adsr.release >= 0
      ? synthData.noise.adsr.release / 1000
      : 0.1;
    const filterEnvRelease = synthData && isFinite(synthData.filterEnvelope?.release) && synthData.filterEnvelope.release >= 0
      ? synthData.filterEnvelope.release / 1000
      : 0.3;

    // Amplitude envelope release
    this.envelopeGain.gain.cancelScheduledValues(now);
    this.envelopeGain.gain.setValueAtTime(Math.max(0.0001, this.envelopeGain.gain.value), now);
    this.envelopeGain.gain.linearRampToValueAtTime(0, now + releaseTime);

    // Noise envelope release
    this.noiseEnvelope.gain.cancelScheduledValues(now);
    this.noiseEnvelope.gain.setValueAtTime(Math.max(0.0001, this.noiseEnvelope.gain.value), now);
    this.noiseEnvelope.gain.linearRampToValueAtTime(0, now + noiseReleaseTime);

    // Filter envelope release
    if (synthData && this.lastFilterFreq !== null) {
      const filterReleaseTo = Math.max(20, Math.min(20000, this.lastFilterFreq));
      this.filter.frequency.cancelScheduledValues(now);
      this.filter.frequency.setValueAtTime(this.filter.frequency.value, now);
      this.filter.frequency.linearRampToValueAtTime(filterReleaseTo, now + filterEnvRelease);
    }

    const longestRelease = Math.max(releaseTime, noiseReleaseTime);

    if (this.releaseTimeoutId !== null) {
      clearTimeout(this.releaseTimeoutId);
      this.releaseTimeoutId = null;
    }

    this.releaseTimeoutId = setTimeout(() => {
      this.releaseTimeoutId = null;
      this.isActive = false;
      this.isInRelease = false;
      this.onStatusChange();
    }, (longestRelease + 0.05) * 1000);
  }

  quickRelease(): void {
    if (!this.isActive) return;

    const now = this.ctx.currentTime;
    const fastRelease = 0.05;

    this.envelopeGain.gain.cancelScheduledValues(now);
    this.envelopeGain.gain.setValueAtTime(Math.max(0.0001, this.envelopeGain.gain.value), now);
    this.envelopeGain.gain.linearRampToValueAtTime(0, now + fastRelease);

    this.noiseEnvelope.gain.cancelScheduledValues(now);
    this.noiseEnvelope.gain.setValueAtTime(Math.max(0.0001, this.noiseEnvelope.gain.value), now);
    this.noiseEnvelope.gain.linearRampToValueAtTime(0, now + fastRelease);

    this.isInRelease = true;
    this.releaseStartTime = now;

    if (this.releaseTimeoutId !== null) {
      clearTimeout(this.releaseTimeoutId);
      this.releaseTimeoutId = null;
    }

    this.releaseTimeoutId = setTimeout(() => {
      this.releaseTimeoutId = null;
      this.isActive = false;
      this.isInRelease = false;
      this.onStatusChange();
    }, (fastRelease + 0.02) * 1000);
  }

  setFrequencies(freq: number, time: number, synthData?: SynthData): void {
    if (!isFinite(freq) || freq <= 0) return;

    this.osc1.frequency.setValueAtTime(freq, time);

    // Osc2 offset in semitones
    const osc2OffsetSemitones = synthData && isFinite(synthData.osc2.offset) ? synthData.osc2.offset : 0;
    const osc2Freq = freq * Math.pow(2, osc2OffsetSemitones / 12);
    this.osc2.frequency.setValueAtTime(isFinite(osc2Freq) ? osc2Freq : freq, time);

    // Sub oscillator: one octave below by default, considering sub.octave offset
    const subOctave = synthData && isFinite(synthData.sub.octave) ? synthData.sub.octave : -1;
    const subFreq = freq * Math.pow(2, subOctave);
    this.subOsc.frequency.setValueAtTime(isFinite(subFreq) && subFreq > 0 ? subFreq : freq / 2, time);
  }

  applyPortamento(
    fromFreq: number,
    toFreq: number,
    startTime: number,
    duration: number,
    curve: number,
  ): void {
    if (!isFinite(fromFreq) || fromFreq <= 0) return;
    if (!isFinite(toFreq) || toFreq <= 0) return;
    if (!isFinite(duration) || duration <= 0) return;

    const endTime = startTime + duration;

    this.osc1.frequency.cancelScheduledValues(startTime);
    this.osc1.frequency.setValueAtTime(fromFreq, startTime);

    this.osc2.frequency.cancelScheduledValues(startTime);
    this.osc2.frequency.setValueAtTime(fromFreq, startTime);

    this.subOsc.frequency.cancelScheduledValues(startTime);
    this.subOsc.frequency.setValueAtTime(fromFreq / 2, startTime);

    if (curve > 0.5) {
      // Exponential glide
      const toFreqSafe = Math.max(0.0001, toFreq);
      this.osc1.frequency.exponentialRampToValueAtTime(toFreqSafe, endTime);
      this.osc2.frequency.exponentialRampToValueAtTime(toFreqSafe, endTime);
      this.subOsc.frequency.exponentialRampToValueAtTime(Math.max(0.0001, toFreqSafe / 2), endTime);
    } else {
      // Linear glide
      this.osc1.frequency.linearRampToValueAtTime(toFreq, endTime);
      this.osc2.frequency.linearRampToValueAtTime(toFreq, endTime);
      this.subOsc.frequency.linearRampToValueAtTime(toFreq / 2, endTime);
    }
  }

  connectToMaster(
    masterGain: GainNode,
    delayInput: AudioNode,
    reverbInput: AudioNode,
  ): void {
    this.dryGain.connect(masterGain);
    this.delaySendGain.connect(delayInput);
    this.reverbSendGain.connect(reverbInput);
  }

  private getOscType(value: number): OscillatorType {
    if (!isFinite(value)) return 'sawtooth';
    if (value < 33) return 'sine';
    if (value < 67) return 'triangle';
    return 'sawtooth';
  }
}

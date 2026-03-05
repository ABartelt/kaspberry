<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAudioEngine } from './composables/useAudioEngine'
import { useVoicePool } from './composables/useVoicePool'
import { useSynthParams } from './composables/useSynthParams'
import { useSequencer } from './composables/useSequencer'
import { useChaos } from './composables/useChaos'
import { useStupidModes } from './composables/useStupidModes'
import { useRhythm } from './composables/useRhythm'
import { useScales } from './composables/useScales'
import { usePresets } from './composables/usePresets'
import { useRandomizer } from './composables/useRandomizer'
import { midiToFreq } from './audio/lookup'
import type { VoiceTriggerParams } from './types/synth'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import HeaderBar from './components/HeaderBar.vue'
import ModeSection from './components/ModeSection.vue'
import ScaleRhythmSection from './components/ScaleRhythmSection.vue'
import OscillatorsSection from './components/OscillatorsSection.vue'
import NoiseSection from './components/NoiseSection.vue'
import EnvelopeSection from './components/EnvelopeSection.vue'
import FilterSection from './components/FilterSection.vue'
import EffectsSection from './components/EffectsSection.vue'
import PresetsSection from './components/PresetsSection.vue'
import RandomizeSection from './components/RandomizeSection.vue'
import RealtimeDisplay from './components/RealtimeDisplay.vue'
import SequencerTable from './components/SequencerTable.vue'

// ---------------------------------------------------------------------------
// Composables
// ---------------------------------------------------------------------------
const audioEngine = useAudioEngine()
const voicePool = useVoicePool()
const synthParams = useSynthParams()
const sequencer = useSequencer()
const chaos = useChaos()
const stupidModes = useStupidModes()
const rhythm = useRhythm()
const scales = useScales()
const presets = usePresets()
const randomizer = useRandomizer()

const { synthData } = synthParams
const { sequencerData } = sequencer

const stereoWidenerMix = ref(0)
let lastTriggeredFreq: number | null = null

// Apply default rhythm on init
rhythm.applyRhythm(rhythm.activeRhythm.value, sequencerData)

const synthTabs = [
  { id: 'oscillators', label: 'OSC' },
  { id: 'noise', label: 'NOISE' },
  { id: 'envelope', label: 'ENV' },
  { id: 'filter', label: 'FILTER' },
  { id: 'effects', label: 'FX' },
]

// ---------------------------------------------------------------------------
// Audio initialisation (requires user gesture)
// ---------------------------------------------------------------------------
const audioInitialized = ref(false)

async function ensureAudio() {
  if (audioInitialized.value) return
  await audioEngine.initAudio()
  const ctx = audioEngine.getAudioContext()!
  const noiseBuffer = audioEngine.getNoiseBuffer()!
  const masterGain = audioEngine.getMasterGain()!
  const delayNode = audioEngine.getDelayNode()!
  const reverbNode = audioEngine.getReverbNode()!
  voicePool.initVoices(ctx, noiseBuffer, masterGain, delayNode, reverbNode)
  audioEngine.updateReverbImpulse(synthData)
  audioInitialized.value = true
}

// ---------------------------------------------------------------------------
// STUPID mode callback wiring
// ---------------------------------------------------------------------------
stupidModes.registerCallbacks({
  randomizeSynth: () => randomizer.randomizeSynth(synthData, chaos.getChaosValue),
  randomizeSequencer: () =>
    randomizer.randomizeSequencer(
      sequencerData,
      scales.getNoteInScale,
      (key: string) => chaos.getChaosValueForSequencer(key, synthData),
      rhythm.isCellLocked,
    ),
  resetFX: () => randomizer.resetFX(synthData),
  randomizeFX: () => randomizer.randomizeFX(synthData, chaos.getChaosValue),
  slowRandomize: () =>
    randomizer.randomizeSequencer(
      sequencerData,
      scales.getNoteInScale,
      (key: string) => chaos.getChaosValueForSequencer(key, synthData),
      rhythm.isCellLocked,
    ),
  getBPM: () => sequencerData.bpm,
  isPlaying: () => sequencerData.isPlaying,
})

// ---------------------------------------------------------------------------
// Sequencer step callback
// ---------------------------------------------------------------------------
sequencer.registerStepCallback((stepIndex: number) => {
  const step = sequencerData.steps[stepIndex]

  // Release voices from previous step
  voicePool.releaseCurrentStepVoices(false)

  if (step.volume > 0) {
    const stepDurationSec = 60 / sequencerData.bpm / 4

    const triggerParams: VoiceTriggerParams = {
      pitch: step.pitch,
      oscMixer: step.oscMixer + synthData.oscMixer,
      filterFrequency: synthData.filter.frequency + step.filterFreq,
      filterResonance: synthData.filter.resonance + step.filterRes * 0.159,
      attackTime: (synthData.adsr.attack + step.attack * 3.33) / 1000,
      decayTime: synthData.adsr.decay / 1000,
      sustainLevel: synthData.adsr.sustain / 100,
      duration: stepDurationSec,
      useSlide: step.slide,
      lastFreq: lastTriggeredFreq,
      portamentoTime: synthData.portamento.time / 1000,
      portamentoCurve: synthData.portamento.curve,
      noiseAttackTime: synthData.noise.adsr.attack / 1000,
      noiseDecayTime: synthData.noise.adsr.decay / 1000,
      noiseSustainLevel: synthData.noise.adsr.sustain / 100,
      delaySend: step.delaySend / 100,
      reverbSend: step.reverbSend / 100,
      distortion: step.distortion,
      fadeIn: false,
    }

    const voice = voicePool.getFreeVoice()
    if (voice) {
      voice.trigger(triggerParams, synthData)
      voicePool.trackStepVoice(voice)
      lastTriggeredFreq = midiToFreq(step.pitch + synthData.osc1.globalPitch)
    }
  }

  stupidModes.onSequencerStep()
})

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------
function onTogglePlay() {
  if (sequencerData.isPlaying) {
    sequencer.stopSequence()
    voicePool.stopAllVoices()
  } else {
    ensureAudio().then(() => sequencer.startSequence())
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.code === 'Space' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement)) {
    e.preventDefault()
    onTogglePlay()
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))

function onStereoWidenerChange(value: number) {
  stereoWidenerMix.value = value
  audioEngine.updateStereoWidener(value)
}

function onSetDelayType(typeIndex: number) {
  synthData.delay.type = typeIndex
  audioEngine.setDelayType(typeIndex, synthData)
}

function onLoadPreset(n: number) {
  presets.loadPreset(n, synthData, sequencerData, {
    setDelayType: (t: number) => audioEngine.setDelayType(t, synthData),
    updateReverbImpulse: () => audioEngine.updateReverbImpulse(synthData),
    applyRhythm: (id: number) => rhythm.applyRhythm(id, sequencerData),
    activeRhythm: rhythm.activeRhythm.value,
    isCellLocked: rhythm.isCellLocked,
    delayNode: audioEngine.getDelayNode(),
    delayFeedback: audioEngine.getDelayFeedback(),
  })
}

function onSetRhythm(id: number) {
  if (id === 0) {
    rhythm.clearRhythm()
  } else {
    rhythm.applyRhythm(id, sequencerData)
  }
}

function onRandomizeSynth() {
  randomizer.randomizeSynth(synthData, chaos.getChaosValue)
}
function onResetSynth() {
  randomizer.resetSynthDefaults(synthData)
}
function onRandomizeSequencer() {
  randomizer.randomizeSequencer(
    sequencerData, scales.getNoteInScale,
    (k: string) => chaos.getChaosValueForSequencer(k, synthData),
    rhythm.isCellLocked,
  )
}
function onResetSequencer() {
  randomizer.resetSequencer(sequencerData, rhythm.isCellLocked)
}
function onRandomizeFX() {
  randomizer.randomizeFX(synthData, chaos.getChaosValue)
}
function onResetFX() {
  randomizer.resetFX(synthData)
}

function onUpdateStepValue(step: number, param: string, value: number) {
  sequencer.updateStepValue(step, param, value)
}
function onRandomizeStep(stepIndex: number) {
  randomizer.randomizeStep(
    stepIndex, sequencerData, scales.getNoteInScale,
    (k: string) => chaos.getChaosValueForSequencer(k, synthData),
    rhythm.isCellLocked,
  )
}
function onRandomizeParameter(key: string) {
  randomizer.randomizeParameter(
    key, sequencerData, scales.getNoteInScale,
    (k: string) => chaos.getChaosValueForSequencer(k, synthData),
    rhythm.isCellLocked,
  )
}
function onResetParameter(key: string) {
  randomizer.resetParameter(key, sequencerData, rhythm.isCellLocked)
}
function onMaxParameter(key: string) {
  randomizer.maxParameter(key, sequencerData, rhythm.isCellLocked)
}
</script>

<template>
  <div class="container" @click="ensureAudio" @touchstart.passive="ensureAudio">
    <HeaderBar
      :is-playing="sequencerData.isPlaying"
      :bpm="sequencerData.bpm"
      :voice-statuses="voicePool.voiceStatuses.value"
      :chaos-level="chaos.chaosLevel.value"
      @toggle-play="onTogglePlay"
      @update-bpm="sequencer.updateBPM"
      @update-chaos-level="chaos.updateChaosLevel"
    />

    <!-- === BEFORE SEQUENCER TABLE (no accordion) === -->

    <ModeSection
      :fast-enabled="stupidModes.fastEnabled.value"
      :slow-enabled="stupidModes.slowEnabled.value"
      :slower-stupid-amount="stupidModes.slowerStupidAmount.value"
      @toggle-fast="stupidModes.toggleFastStupid"
      @toggle-slow="stupidModes.toggleSlowStupid"
      @update-slower-stupid="stupidModes.updateSlowerStupid"
    />

    <ScaleRhythmSection
      :current-scale-index="scales.currentScaleIndex.value"
      :active-rhythm="rhythm.activeRhythm.value"
      :loop-length="sequencerData.loopLength"
      :stereo-widener-mix="stereoWidenerMix"
      @set-scale="scales.setScale"
      @set-rhythm="onSetRhythm"
      @set-loop-length="sequencer.setLoopLength"
      @update-stereo-widener="onStereoWidenerChange"
    />

    <div class="presets-randomize-row">
      <PresetsSection @load-preset="onLoadPreset" />
      <RandomizeSection
        @randomize-synth="onRandomizeSynth"
        @reset-synth="onResetSynth"
        @randomize-sequencer="onRandomizeSequencer"
        @reset-sequencer="onResetSequencer"
        @randomizeFX="onRandomizeFX"
        @resetFX="onResetFX"
      />
    </div>

    <!-- === SYNTH PARAMETER TABS === -->

    <Tabs default-value="oscillators" class="mb-1.5 border border-border-panel rounded-[var(--radius-panel)] overflow-hidden bg-bg-darker">
      <TabsList>
        <TabsTrigger v-for="tab in synthTabs" :key="tab.id" :value="tab.id">{{ tab.label }}</TabsTrigger>
      </TabsList>
      <TabsContent value="oscillators">
        <OscillatorsSection :synth-data="synthData" />
      </TabsContent>
      <TabsContent value="noise">
        <NoiseSection :synth-data="synthData" />
      </TabsContent>
      <TabsContent value="envelope">
        <EnvelopeSection :synth-data="synthData" />
      </TabsContent>
      <TabsContent value="filter">
        <FilterSection :synth-data="synthData" />
      </TabsContent>
      <TabsContent value="effects">
        <EffectsSection :synth-data="synthData" @set-delay-type="onSetDelayType" />
      </TabsContent>
    </Tabs>

    <RealtimeDisplay
      :current-step="sequencerData.currentStep"
      :steps="sequencerData.steps"
      :global-pitch="synthData.osc1.globalPitch"
    />

    <!-- === SEQUENCER TABLE === -->

    <SequencerTable
      :steps="sequencerData.steps"
      :current-step="sequencerData.currentStep"
      :loop-length="sequencerData.loopLength"
      :locked-cells="rhythm.lockedCells.value"
      :global-pitch="synthData.osc1.globalPitch"
      @update-step-value="onUpdateStepValue"
      @toggle-slide="sequencer.toggleSlide"
      @randomize-step="onRandomizeStep"
      @randomize-parameter="onRandomizeParameter"
      @reset-parameter="onResetParameter"
      @max-parameter="onMaxParameter"
    />

    <p v-if="!audioInitialized" class="audio-prompt">
      Tap anywhere to initialize audio
    </p>
  </div>
</template>

<style scoped>
.presets-randomize-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 6px;
}

.audio-prompt {
  text-align: center;
  padding: 2rem;
  opacity: 0.6;
  font-size: 1.2rem;
}
</style>

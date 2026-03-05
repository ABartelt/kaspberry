# Kasparry — Raspberry Pi Kiosk Synthesizer

## What This Is

A browser-based acid synthesizer ("Love Hate Sabotage - Machine VIII") running on a Raspberry Pi 3B+ in kiosk mode. The Pi boots directly into fullscreen Chromium showing the synth app. All interaction is touch-only on a 1920x1080 USB touchscreen.

## Hardware

- Raspberry Pi 3 Model B+ (1 GB RAM, quad-core 1.4 GHz, ARMv7)
- 1920x1080 USB touchscreen (touch-only, no mouse/keyboard in production)
- Audio output via headphone jack (PulseAudio)
- Connected to dev Mac via USB-C ethernet adapter for deployment

## Project Structure

```
kasparry/
├── CLAUDE.md              # This file
├── setup.sh               # Pi provisioning script (run once on fresh OS)
├── configs/               # systemd units, ALSA config
├── scripts/
│   ├── kiosk.sh           # Main kiosk launcher (starts X11)
│   └── kiosk-x.sh         # X11 client script (launches Chromium) ← ON PI ONLY
└── app/
    └── synth/             # Vue 3 synthesizer app
        ├── vite.config.ts
        ├── components.json    # shadcn-vue config
        ├── src/
        │   ├── main.ts
        │   ├── App.vue        # Root: tabs, sequencer, header, all wiring
        │   ├── styles/
        │   │   ├── tailwind.css   # Tailwind theme + shadcn tokens
        │   │   ├── variables.css  # CSS custom properties (amber palette)
        │   │   └── global.css     # Sequencer table styles, layout
        │   ├── components/
        │   │   ├── ui/            # shadcn-vue components (customized)
        │   │   │   ├── accordion/
        │   │   │   ├── button/    # 12 CVA variants (play, stop, random, etc.)
        │   │   │   ├── select/
        │   │   │   ├── slider/    # Amber-themed track + thumb
        │   │   │   ├── tabs/      # force-mount for Web Audio safety
        │   │   │   └── toggle/    # cyan + orange variants
        │   │   ├── HeaderBar.vue          # Play/stop, BPM, chaos mode, voice dots
        │   │   ├── ModeSection.vue        # FAST/SLOW STUPID toggles
        │   │   ├── ScaleRhythmSection.vue # Scale, rhythm, loop length, stereo
        │   │   ├── OscillatorsSection.vue # 5 oscillator modules
        │   │   ├── NoiseSection.vue       # Noise generator params
        │   │   ├── EnvelopeSection.vue    # ADSR envelope
        │   │   ├── FilterSection.vue      # Filter cutoff, resonance, env
        │   │   ├── EffectsSection.vue     # Delay, reverb, distortion
        │   │   ├── PresetsSection.vue     # 20 presets in paginated carousel
        │   │   ├── RandomizeSection.vue   # Randomize/reset buttons
        │   │   ├── SequencerTable.vue     # Step sequencer (NOT shadcn-migrated)
        │   │   ├── SequencerRow.vue       # Single sequencer parameter row
        │   │   ├── SlideRow.vue           # Slide toggle row
        │   │   ├── SynthSlider.vue        # Reusable labeled slider
        │   │   ├── RealtimeDisplay.vue    # Current step display
        │   │   └── VoiceStatusDots.vue    # Polyphony voice indicators
        │   ├── composables/
        │   │   ├── useAudioEngine.ts  # Web Audio API initialization
        │   │   ├── useVoicePool.ts    # Polyphonic voice management
        │   │   ├── useSynthParams.ts  # All synth parameter state
        │   │   ├── useSequencer.ts    # Step sequencer logic + timing
        │   │   ├── useChaos.ts        # Love/Hate/Sabotage modes
        │   │   ├── useStupidModes.ts  # FAST/SLOW STUPID random mutation
        │   │   ├── useRhythm.ts       # Rhythm pattern locking
        │   │   ├── useScales.ts       # Musical scale management
        │   │   ├── usePresets.ts      # Preset save/load
        │   │   └── useRandomizer.ts   # Randomize synth/sequencer/FX
        │   ├── audio/
        │   │   ├── AudioEngine.ts     # Core Web Audio graph
        │   │   ├── Voice.ts           # Single synth voice (osc + filter + env)
        │   │   └── lookup.ts          # MIDI-to-frequency tables
        │   ├── constants/             # Scales, rhythms, presets, chaos, delays
        │   ├── types/synth.ts         # TypeScript interfaces
        │   └── lib/utils.ts           # cn() utility (clsx + tailwind-merge)
        └── dist/                      # Build output (not in git)
```

## Tech Stack

- **Framework**: Vue 3 Composition API (`<script setup lang="ts">`)
- **Build**: Vite 7 with `base: './'` for relative paths
- **Styling**: Tailwind CSS v4 + shadcn-vue (New York style) + custom CSS
- **Audio**: Web Audio API (custom engine, not a library)
- **UI primitives**: Reka UI (via shadcn-vue)

## Design System

Amber-on-dark color scheme defined in `variables.css`:
- Primary: `--amber: #eda000` (text, controls, active states)
- Background: `--bg-darkest: #050505` through `--bg-darker: #0a0a05`
- Accents: cyan (`#00bcd4`), green (`#00d870`), red (`#d83030`), orange (`#e08020`)
- All colors mapped to Tailwind tokens in `tailwind.css` via `@theme inline`

## Critical Constraints

1. **Touch targets**: All interactive elements must be min 44px. The Pi has no keyboard/mouse.
2. **Web Audio safety**: Tabs use `force-mount` so tab content stays in DOM. Never use `v-if` on audio-connected components — it destroys Web Audio nodes and causes audio dropouts.
3. **Sequencer table**: `SequencerTable.vue`, `SequencerRow.vue`, `SlideRow.vue` use direct DOM manipulation for performance. Do NOT migrate these to shadcn or reactive patterns.
4. **Step sliders**: The vertical range inputs in the sequencer use `appearance: none` with custom amber thumb styling in `global.css`. Tailwind's preflight resets inputs, so the `.step-slider` rules must come after Tailwind's base layer.
5. **ES modules + CORS**: Chromium blocks `<script type="module">` on `file://`. The Pi runs a local Python HTTP server (`app-server.service`) on port 8080 to serve the app.
6. **Bundle size**: Pi has limited RAM. Build produces ~290KB JS + ~46KB CSS (gzipped ~97KB total).

## Build & Deploy

### Prerequisites
- Pi connected to Mac via USB-C ethernet adapter
- dnsmasq DHCP server running on Mac (see deploy steps)
- SSH access: user `pi`, password `raspberry`

### Quick Deploy (app changes only)

```bash
# 1. Build
cd app/synth
npx vite build

# 2. Connect to Pi (if not already)
#    Set Mac static IP on USB ethernet adapter:
sudo networksetup -setmanual "AX88179B" 192.168.100.1 255.255.255.0
#    Start DHCP server (keep running in separate terminal):
sudo /opt/homebrew/opt/dnsmasq/sbin/dnsmasq --no-daemon --interface=en13 \
  --dhcp-range=192.168.100.50,192.168.100.150,255.255.255.0,12h \
  --dhcp-option=option:router,192.168.100.1 --bind-interfaces --log-dhcp
#    Wait for Pi to get IP (appears in dnsmasq output, usually 192.168.100.99)

# 3. Deploy
sshpass -p 'raspberry' ssh pi@192.168.100.99 "rm -rf /tmp/synth-new && mkdir -p /tmp/synth-new"
sshpass -p 'raspberry' scp -r dist/* pi@192.168.100.99:/tmp/synth-new/
sshpass -p 'raspberry' ssh pi@192.168.100.99 "sudo rm -rf /home/kiosk/app/assets && \
  sudo cp -r /tmp/synth-new/* /home/kiosk/app/ && \
  sudo chown -R kiosk:kiosk /home/kiosk/app"

# 4. Restart
sshpass -p 'raspberry' ssh pi@192.168.100.99 "sudo reboot"
```

### Pi Services

| Service | Description | Config |
|---------|-------------|--------|
| `kiosk.service` | X11 + Chromium kiosk | `/etc/systemd/system/kiosk.service` |
| `app-server.service` | Python HTTP server on :8080 | `/etc/systemd/system/app-server.service` |

- Kiosk script: `/home/kiosk/scripts/kiosk-x.sh` (the actual Chromium launcher)
- App files: `/home/kiosk/app/` (index.html + assets/)
- Kiosk URL: `http://127.0.0.1:8080/index.html`

### Chromium Flags (on Pi)

Key flags in `kiosk-x.sh`:
- `--kiosk --allow-file-access-from-files` — fullscreen, no UI chrome
- `--disable-translate --disable-features=TranslateUI,Translate --lang=de` — no translate bar
- `--autoplay-policy=no-user-gesture-required` — audio starts without tap
- `--disable-gpu-compositing --disable-gpu --in-process-gpu` — Pi GPU workarounds
- `--remote-debugging-port=9222` — CDP debugging (tunnel via SSH)
- `--touch-events=enabled --disable-pinch` — touch mode

### Debugging on Pi

```bash
# SSH tunnel for Chrome DevTools
ssh -L 9223:localhost:9222 pi@192.168.100.99
# Then open chrome://inspect in local Chrome, or use CDP at ws://localhost:9223

# Check kiosk logs
ssh pi@192.168.100.99 "sudo journalctl -u kiosk -n 50"

# Check app server
ssh pi@192.168.100.99 "sudo systemctl status app-server"
ssh pi@192.168.100.99 "curl -s http://127.0.0.1:8080/index.html | head -5"
```

### Vite Config Notes

- `base: './'` — relative asset paths (works with both file:// and http://)
- `stripCrossorigin` plugin — removes `crossorigin` attribute from HTML output (breaks file://)
- `drop_console: true` — removes console.log in production
- `target: 'es2020'` — compatible with Pi's Chromium

## First-Time Pi Setup

1. Flash Raspberry Pi OS Lite to SD card
2. Boot Pi, SSH in
3. Clone this repo: `git clone https://github.com/ABartelt/kaspberry.git`
4. Run `sudo bash setup.sh`
5. Reboot

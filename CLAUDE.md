# Kasparry — Raspberry Pi Kiosk

Raspberry Pi 3 Model B+ kiosk setup. Boots directly into fullscreen Chromium showing a local HTML file. No desktop environment — bare X11 + Chromium.

## Project Structure

- `setup.sh` — Main setup script, run on a fresh Raspberry Pi OS Lite install
- `configs/` — systemd and ALSA configuration files
- `scripts/` — Kiosk launcher and lockdown scripts
- `app/` — Web content served locally (user replaces `index.html`)

## Usage

1. Flash Raspberry Pi OS Lite to SD card
2. Boot Pi, SSH in
3. Clone this repo to the Pi
4. Run `sudo bash setup.sh`
5. Reboot

## Hardware

- Raspberry Pi 3 Model B+ (1 GB RAM, quad-core 1.4 GHz)
- 1920x1080 USB touchscreen
- Audio output (HDMI or USB)
- 8 GB+ SD card (16 GB recommended)

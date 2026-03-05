#!/bin/bash
# Kiosk launcher — starts X11 and Chromium in kiosk mode
# Run by the kiosk.service systemd unit

set -e

KIOSK_URL="file:///home/kiosk/app/index.html"

# Clean up Chromium crash flags to prevent "restore session" prompts
CHROMIUM_DIR="/home/kiosk/.config/chromium"
mkdir -p "$CHROMIUM_DIR/Default"
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' "$CHROMIUM_DIR/Default/Preferences" 2>/dev/null || true
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' "$CHROMIUM_DIR/Default/Preferences" 2>/dev/null || true

# Start X server on VT1
export DISPLAY=:0

# xinit runs the following as its client script
xinit /bin/bash -c "
    # Start PulseAudio and route to headphone jack
    pulseaudio --start --daemonize 2>/dev/null
    pactl set-default-sink alsa_output.platform-3f00b840.mailbox.stereo-fallback.2 2>/dev/null
    pactl set-sink-volume @DEFAULT_SINK@ 100% 2>/dev/null

    # Disable screen blanking and power management
    xset s off
    xset s noblank
    xset -dpms

    # Hide mouse cursor after 0.5s idle
    unclutter -idle 0.5 -root &

    # Launch Chromium in kiosk mode
    chromium-browser \
        --kiosk \
        --allow-file-access-from-files \
        --noerrdialogs \
        --disable-infobars \
        --disable-translate \
        --disable-features=TranslateUI,Translate \
        --lang=de \
        --autoplay-policy=no-user-gesture-required \
        --check-for-update-interval=31536000 \
        --touch-events=enabled \
        --disable-pinch \
        --overscroll-history-navigation=0 \
        --disable-session-crashed-bubble \
        --disable-component-update \
        --no-first-run \
        --start-fullscreen \
        --window-size=1920,1080 \
        --window-position=0,0 \
        --disable-gpu-compositing \
        --disable-gpu \
        --in-process-gpu \
        '$KIOSK_URL'
" -- -nocursor vt1 2>/dev/null

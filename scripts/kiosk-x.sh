#!/bin/bash
# X11 client launcher — started by xinit from kiosk.sh.
# Installed to /home/kiosk/scripts/kiosk-x.sh by setup.sh.

# Force 1920x1080 (display may default to 2048x1152)
xrandr --output HDMI-1 --mode 1920x1080 --rate 60 2>/dev/null
sleep 1

# Audio: ALSA-direct to bcm2835 Headphones (by NAME — index shifts between Pi 3B+ and Pi 4).
# PulseAudio is not installed in our setup; kill any leftover just in case.
pulseaudio -k 2>/dev/null || true
amixer -c Headphones sset PCM 100% unmute 2>/dev/null || true

xset s off
xset s noblank
xset -dpms

# Cursor: visible during USB-mouse use, hidden after 5 s touch-idle
unclutter -idle 5 -root &

CHROMIUM_DIR="/home/kiosk/.config/chromium"
mkdir -p "$CHROMIUM_DIR/Default"
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' "$CHROMIUM_DIR/Default/Preferences" 2>/dev/null || true
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' "$CHROMIUM_DIR/Default/Preferences" 2>/dev/null || true

exec chromium \
    --kiosk \
    --noerrdialogs \
    --disable-infobars \
    --disable-translate \
    --disable-features=TranslateUI,Translate,AudioServiceSandbox \
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
    --ignore-gpu-blocklist \
    --enable-gpu-rasterization \
    --enable-zero-copy \
    --js-flags="--max-old-space-size=512" \
    --alsa-output-device=hw:CARD=Headphones,DEV=0 \
    --remote-debugging-port=9222 \
    http://127.0.0.1:8080/index.html

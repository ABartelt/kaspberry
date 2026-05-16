#!/bin/bash
# Kasparry Kiosk Setup Script — Raspberry Pi 4 Model B / Pi OS Lite Bookworm (arm64)
# Run on a freshly imaged Pi:
#   sudo bash setup.sh
#
# Prerequisites:
#   - Pi 4 booted from a fresh Raspberry Pi OS Lite arm64 SD card
#   - Internet connection (for apt + git)
#   - This repo cloned to the Pi (e.g. /home/pi/kaspberry)
#   - micro-HDMI + 5.1 V / 3 A USB-C PSU (no Pi 3 micro-USB PSU)

set -euo pipefail

KIOSK_USER="kiosk"
KIOSK_HOME="/home/$KIOSK_USER"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ "$(id -u)" -ne 0 ]; then
    echo "Error: Run this script as root (sudo bash setup.sh)"
    exit 1
fi

echo "=== Kasparry Kiosk Setup (Pi 4) ==="

# --- 1. Packages ---

echo "[1/9] Installing packages..."
apt-get update -qq
apt-get install -y --no-install-recommends \
    xserver-xorg \
    x11-xserver-utils \
    xinit \
    chromium-browser \
    alsa-utils \
    unclutter \
    kbd \
    python3 \
    git

# Make sure pulseaudio is NOT pulled in — we go ALSA-direct.
apt-get purge -y pulseaudio pulseaudio-utils 2>/dev/null || true

# --- 2. GPU + Display (config.txt) ---

echo "[2/9] Configuring GPU + display..."
CONFIG_TXT="/boot/firmware/config.txt"
[ -f "$CONFIG_TXT" ] || CONFIG_TXT="/boot/config.txt"

set_or_replace() {
    local key="$1" val="$2"
    if grep -qE "^${key}=" "$CONFIG_TXT"; then
        sed -i "s|^${key}=.*|${key}=${val}|" "$CONFIG_TXT"
    else
        echo "${key}=${val}" >> "$CONFIG_TXT"
    fi
}

# Pi 4 uses full KMS driver (VideoCore VI). Force-set in case the image varies.
if grep -qE "^dtoverlay=vc4-fkms-v3d" "$CONFIG_TXT"; then
    sed -i 's|^dtoverlay=vc4-fkms-v3d|dtoverlay=vc4-kms-v3d|' "$CONFIG_TXT"
fi
grep -qE "^dtoverlay=vc4-kms-v3d" "$CONFIG_TXT" || echo "dtoverlay=vc4-kms-v3d" >> "$CONFIG_TXT"

set_or_replace gpu_mem 320
set_or_replace gpu_freq 600
set_or_replace hdmi_force_hotplug 1
set_or_replace hdmi_group 1
set_or_replace hdmi_mode 16

# --- 3. Kiosk user ---

echo "[3/9] Creating kiosk user..."
if id "$KIOSK_USER" &>/dev/null; then
    echo "  user '$KIOSK_USER' already exists"
else
    useradd -m -s /bin/bash "$KIOSK_USER"
fi
usermod -aG audio,video,input,tty,render "$KIOSK_USER" 2>/dev/null || true
deluser "$KIOSK_USER" sudo 2>/dev/null || true

# --- 4. Files ---

echo "[4/9] Installing kiosk files..."
mkdir -p "$KIOSK_HOME/scripts" "$KIOSK_HOME/app"
install -m 755 "$SCRIPT_DIR/scripts/kiosk.sh"   "$KIOSK_HOME/scripts/kiosk.sh"
install -m 755 "$SCRIPT_DIR/scripts/kiosk-x.sh" "$KIOSK_HOME/scripts/kiosk-x.sh"

# Drum-computer HTML is the live app. setup.sh always overwrites it so a
# fresh install gives a known-good state; manual deploys later happen via scp.
install -m 644 "$SCRIPT_DIR/xi-drum.html" "$KIOSK_HOME/app/index.html"
chown -R "$KIOSK_USER:$KIOSK_USER" "$KIOSK_HOME"

# --- 5. Auto-login on tty1 ---

echo "[5/9] Configuring auto-login..."
mkdir -p /etc/systemd/system/getty@tty1.service.d
install -m 644 "$SCRIPT_DIR/configs/autologin.conf" \
    /etc/systemd/system/getty@tty1.service.d/autologin.conf

# --- 6. systemd units ---

echo "[6/9] Installing systemd units..."
install -m 644 "$SCRIPT_DIR/configs/kiosk.service"      /etc/systemd/system/kiosk.service
install -m 644 "$SCRIPT_DIR/configs/app-server.service" /etc/systemd/system/app-server.service

# Patch kiosk.service XDG_RUNTIME_DIR to match the actual kiosk UID
KIOSK_UID=$(id -u "$KIOSK_USER")
sed -i "s|XDG_RUNTIME_DIR=/run/user/1001|XDG_RUNTIME_DIR=/run/user/$KIOSK_UID|" /etc/systemd/system/kiosk.service

systemctl daemon-reload
systemctl enable kiosk.service app-server.service

# --- 7. ALSA + lockdown ---

echo "[7/9] ALSA config + console lockdown..."
install -m 644 "$SCRIPT_DIR/configs/asound.conf" /etc/asound.conf

if [ -x "$SCRIPT_DIR/scripts/disable-shortcuts.sh" ]; then
    bash "$SCRIPT_DIR/scripts/disable-shortcuts.sh"
fi

# --- 8. Console / boot tuning (cmdline.txt) ---

echo "[8/9] Boot cmdline tuning..."
CMDLINE="/boot/firmware/cmdline.txt"
[ -f "$CMDLINE" ] || CMDLINE="/boot/cmdline.txt"
for param in "consoleblank=0" "vt.global_cursor_default=0"; do
    grep -q "$param" "$CMDLINE" || sed -i "s/$/ $param/" "$CMDLINE"
done

# --- 9. OS hardening (services off, swap off, journald volatile) ---

echo "[9/9] OS hardening..."
for s in bluetooth ModemManager triggerhappy cups cups-browsed unattended-upgrades; do
    systemctl disable --now "$s" 2>/dev/null || true
done
for t in apt-daily.timer apt-daily-upgrade.timer; do
    systemctl disable --now "$t" 2>/dev/null || true
done
systemctl disable --now dphys-swapfile 2>/dev/null || true
swapoff -a 2>/dev/null || true

# journald → RAM with size cap (less SD wear, fewer I/O spikes)
JCONF=/etc/systemd/journald.conf
sed -i 's/^#*Storage=.*/Storage=volatile/;
        s/^#*SystemMaxUse=.*/SystemMaxUse=50M/;
        s/^#*RuntimeMaxUse=.*/RuntimeMaxUse=50M/' "$JCONF"
grep -q '^Storage='        "$JCONF" || echo 'Storage=volatile'   >> "$JCONF"
grep -q '^SystemMaxUse='   "$JCONF" || echo 'SystemMaxUse=50M'   >> "$JCONF"
grep -q '^RuntimeMaxUse='  "$JCONF" || echo 'RuntimeMaxUse=50M'  >> "$JCONF"

echo ""
echo "=== Setup Complete ==="
echo "Reboot to start the kiosk:  sudo reboot"
echo "Status after reboot:        systemctl status kiosk app-server"
echo "App is served at:           http://127.0.0.1:8080/index.html"

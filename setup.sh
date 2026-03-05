#!/bin/bash
# Kasparry Kiosk Setup Script
# Run on a fresh Raspberry Pi OS Lite installation:
#   sudo bash setup.sh
#
# Prerequisites:
#   - Raspberry Pi 3 Model B+ with Raspberry Pi OS Lite
#   - Internet connection (for package installation)
#   - This repo cloned to the Pi

set -euo pipefail

KIOSK_USER="kiosk"
KIOSK_HOME="/home/$KIOSK_USER"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# --- Checks ---

if [ "$(id -u)" -ne 0 ]; then
    echo "Error: Run this script as root (sudo bash setup.sh)"
    exit 1
fi

if [ ! -f /etc/os-release ] || ! grep -q "Raspbian\|Debian" /etc/os-release; then
    echo "Warning: This script is designed for Raspberry Pi OS (Debian-based)."
    echo "Proceeding anyway..."
fi

echo "=== Kasparry Kiosk Setup ==="
echo ""

# --- 1. System Update & Package Installation ---

echo "[1/8] Installing packages..."
apt-get update -qq
apt-get install -y --no-install-recommends \
    xserver-xorg \
    x11-xserver-utils \
    xinit \
    chromium-browser \
    pulseaudio \
    alsa-utils \
    unclutter \
    kbd

echo ""

# --- 2. GPU Memory Split ---

echo "[2/8] Configuring GPU memory..."
CONFIG_TXT="/boot/config.txt"
# On newer Pi OS, config may be at /boot/firmware/config.txt
if [ -f /boot/firmware/config.txt ]; then
    CONFIG_TXT="/boot/firmware/config.txt"
fi

if grep -q "^gpu_mem=" "$CONFIG_TXT"; then
    sed -i 's/^gpu_mem=.*/gpu_mem=128/' "$CONFIG_TXT"
else
    echo "gpu_mem=128" >> "$CONFIG_TXT"
fi

# Force HDMI output and set 1920x1080 resolution
if ! grep -q "^hdmi_force_hotplug=" "$CONFIG_TXT"; then
    echo "hdmi_force_hotplug=1" >> "$CONFIG_TXT"
fi
if ! grep -q "^hdmi_group=" "$CONFIG_TXT"; then
    echo "hdmi_group=1" >> "$CONFIG_TXT"
fi
if ! grep -q "^hdmi_mode=" "$CONFIG_TXT"; then
    echo "hdmi_mode=16" >> "$CONFIG_TXT"
fi

# Use fake KMS driver (vc4-fkms-v3d) — full KMS has display issues on Pi 3
if grep -q "^dtoverlay=vc4-kms-v3d" "$CONFIG_TXT"; then
    sed -i 's/^dtoverlay=vc4-kms-v3d/dtoverlay=vc4-fkms-v3d/' "$CONFIG_TXT"
fi
# Disable fw_kms_setup so firmware manages HDMI properly
if grep -q "^disable_fw_kms_setup=" "$CONFIG_TXT"; then
    sed -i 's/^disable_fw_kms_setup=.*/#disable_fw_kms_setup=1/' "$CONFIG_TXT"
fi

echo ""

# --- 3. Create Kiosk User ---

echo "[3/8] Creating kiosk user..."
if id "$KIOSK_USER" &>/dev/null; then
    echo "  User '$KIOSK_USER' already exists, skipping creation."
else
    useradd -m -s /bin/bash "$KIOSK_USER"
    echo "  Created user '$KIOSK_USER'."
fi

# Add to required groups for audio, video, input, and tty access
usermod -aG audio,video,input,tty,render "$KIOSK_USER" 2>/dev/null || true

# Remove sudo access (ensure kiosk user is NOT in sudo group)
deluser "$KIOSK_USER" sudo 2>/dev/null || true

echo ""

# --- 4. Copy Files ---

echo "[4/8] Installing kiosk files..."

# Scripts
mkdir -p "$KIOSK_HOME/scripts"
cp "$SCRIPT_DIR/scripts/kiosk.sh" "$KIOSK_HOME/scripts/"
chmod +x "$KIOSK_HOME/scripts/kiosk.sh"

# App content
mkdir -p "$KIOSK_HOME/app"
if [ ! -f "$KIOSK_HOME/app/index.html" ]; then
    cp "$SCRIPT_DIR/app/index.html" "$KIOSK_HOME/app/"
    echo "  Installed placeholder index.html"
else
    echo "  index.html already exists, not overwriting."
fi

# Set ownership
chown -R "$KIOSK_USER:$KIOSK_USER" "$KIOSK_HOME"

echo ""

# --- 5. Configure Auto-Login ---

echo "[5/8] Configuring auto-login..."
mkdir -p /etc/systemd/system/getty@tty1.service.d
cp "$SCRIPT_DIR/configs/autologin.conf" /etc/systemd/system/getty@tty1.service.d/autologin.conf
systemctl daemon-reload

echo ""

# --- 6. Install Kiosk Service ---

echo "[6/8] Installing kiosk systemd service..."
cp "$SCRIPT_DIR/configs/kiosk.service" /etc/systemd/system/kiosk.service

# Determine the kiosk user's UID for XDG_RUNTIME_DIR
KIOSK_UID=$(id -u "$KIOSK_USER")
sed -i "s|XDG_RUNTIME_DIR=/run/user/1001|XDG_RUNTIME_DIR=/run/user/$KIOSK_UID|" /etc/systemd/system/kiosk.service

systemctl daemon-reload
systemctl enable kiosk.service

echo ""

# --- 7. Lockdown ---

echo "[7/8] Applying lockdown..."
bash "$SCRIPT_DIR/scripts/disable-shortcuts.sh"

# ALSA config (only if not already present)
if [ ! -f /etc/asound.conf ]; then
    cp "$SCRIPT_DIR/configs/asound.conf" /etc/asound.conf
    echo "  Installed ALSA config."
fi

echo ""

# --- 8. Disable Screen Blanking ---

echo "[8/8] Disabling screen blanking..."

# Add kernel cmdline parameters for no blanking
CMDLINE="/boot/cmdline.txt"
if [ -f /boot/firmware/cmdline.txt ]; then
    CMDLINE="/boot/firmware/cmdline.txt"
fi

# Disable console cursor blink and blanking via kernel params
for param in "consoleblank=0" "vt.global_cursor_default=0"; do
    if ! grep -q "$param" "$CMDLINE"; then
        sed -i "s/$/ $param/" "$CMDLINE"
    fi
done

echo ""

# --- Done ---

echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Place your web content in $KIOSK_HOME/app/"
echo "  2. Reboot: sudo reboot"
echo "  3. The Pi will boot into fullscreen Chromium showing index.html"
echo ""
echo "To check kiosk status after reboot:"
echo "  sudo systemctl status kiosk"
echo "  sudo journalctl -u kiosk -f"

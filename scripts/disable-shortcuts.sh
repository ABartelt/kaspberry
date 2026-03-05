#!/bin/bash
# Disable keyboard shortcuts and TTY switching for kiosk lockdown
# Run as root during setup

set -e

echo "Disabling TTY switching and keyboard shortcuts..."

# Disable Ctrl+Alt+Fn TTY switching via kernel cmdline
CMDLINE="/boot/cmdline.txt"
if ! grep -q "consoleblank=0" "$CMDLINE"; then
    # Add consoleblank=0 to disable console blanking
    sed -i 's/$/ consoleblank=0/' "$CMDLINE"
fi

# Disable Ctrl+Alt+Del reboot
systemctl mask ctrl-alt-del.target

# Disable SysRq key (magic key combinations)
echo "kernel.sysrq = 0" > /etc/sysctl.d/90-disable-sysrq.conf
sysctl -w kernel.sysrq=0

# Disable Alt+Fn VT switching by removing the keymaps
# This prevents switching away from the X session
cat > /etc/systemd/system/disable-vt-switch.service << 'EOF'
[Unit]
Description=Disable VT switching
After=multi-user.target

[Service]
Type=oneshot
ExecStart=/usr/bin/kbd_mode -s
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable disable-vt-switch.service

echo "Keyboard lockdown configured."

#!/bin/bash
# Outer kiosk launcher — started by kiosk.service on the kiosk user's tty1.
# Spawns Xorg via xinit and runs kiosk-x.sh as the X11 client.
# Installed to /home/kiosk/scripts/kiosk.sh by setup.sh.

set -e

# Make sure no stale DISPLAY leaks in from the tty session
unset DISPLAY

# xinit:
#   client: /home/kiosk/scripts/kiosk-x.sh   (runs xrandr + amixer + chromium)
#   server: Xorg on :0, attached to vt1, no native cursor (touch + unclutter handle that)
exec xinit /home/kiosk/scripts/kiosk-x.sh -- :0 vt1 -nocursor

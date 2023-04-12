export SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Create the service
TMP_PATH=$SCRIPT_DIR/services/lanflix-monitor.service.tmp
service=$(envsubst <$SCRIPT_DIR/services/lanflix-monitor.service > $TMP_PATH)

SERVICE_PATH=/etc/systemd/system/lanflix-monitor.service

if [[ "$EUID" = 0 ]]; then
    echo "(1) already root"
else
    sudo -k
    if ! sudo true; then
        exit 1
    fi
fi

sudo mv $TMP_PATH $SERVICE_PATH

# Start the service
echo Starting the service...
sudo systemctl enable --now lanflix-monitor
echo LanFlix Notifier service started!

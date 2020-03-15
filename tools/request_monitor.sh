parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

python3 $parent_path/../notifier/monitor_requests.py -v

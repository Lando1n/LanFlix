parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

node $parent_path/../src/notifier/monitor-requests.js -v

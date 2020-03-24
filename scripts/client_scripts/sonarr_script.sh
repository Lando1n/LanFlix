#!/bin/bash
if [[ "$sonarr_release_episodenumbers" != *"," ]]; then
  echo Episode Notification
  node $HOME/dev/LanFlix/src/notifier/notifier-script.js "$sonarr_series_title.S01E01." >> $HOME/Downloads/log
else
  echo Season Notification
  node $HOME/dev/LanFlix/src/notifier/notifier-script.js "$sonarr_series_title.S01." >> $HOME/Downloads/log
fi

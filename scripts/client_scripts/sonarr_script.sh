#!/bin/bash
if [[ "$sonarr_episodefile_episodecount" == "1" ]]; then
  echo Episode Notification
  node $HOME/dev/LanFlix/src/notifier/notifier-script.js "$sonarr_series_title.S${sonarr_episodefile_seasonnumber}E${sonarr_episodefile_episodenumbers}"
else
  echo Season Notification
  node $HOME/dev/LanFlix/src/notifier/notifier-script.js "$sonarr_series_title.S${sonarr_episodefile_seasonnumber}"
fi

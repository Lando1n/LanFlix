function getEventType() {
  return process.env.sonarr_eventtype || process.env.radarr_eventtype;
}

module.exports = () => {
  let media;
  const eventType = getEventType();
  switch (eventType) {
    case "Download":
      if (process.env.sonarr_series_title) {
        media = {
          type: "show",
          name: process.env.sonarr_series_title,
        };
      } else if (process.env.radarr_movie_title) {
        media = {
          type: "movie",
          name: process.env.radarr_movie_title,
        };
      } else {
        throw Error(
          `No 'Download' event type handling configured for this context.`
        );
      }
      break;
    case "Test":
      if (process.env.sonarr_eventtype) {
        process.env.sonarr_series_tvmazeid = 45563;
        media = {
          type: "test-show",
          name: "Dave",
        };
      } else if (process.env.radarr_eventtype) {
        process.env.radarr_movie_tmdbid = 562;
        media = {
          type: "test-movie",
          name: "Die Hard",
        };
      } else {
        throw Error(
          `No 'Test' event type handling configured for this context.`
        );
      }
      break;
    default:
      throw Error(`No event type handling for ${eventType}`);
  }
  return media;
};

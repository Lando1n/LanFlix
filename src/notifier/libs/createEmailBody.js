function createShowEmailBody(name) {
  return `Hey there,</br>
<p>
The show '${name}' has just been added to the Plex Server.</br>
From my understanding, you asked to be notified about this.</br>
<p>
It should be ready any moment to be streamed!
<p>
Don't want this notification? Toggle your subscription on LanFlix.`;
}

function createMovieEmailBody(name) {
  return `Hey there,</br>
<p>
The movie '${name}' has just been added to the Plex Server.</br>
From my understanding, you asked to be notified about this.</br>
<p>
It should be ready any moment to be streamed!
<p>
Don't want this notification? Toggle your subscription on LanFlix.`;
}

function createNewShowEmailBody(name) {
  return `'${name}' appears to be a new show on the server, would you like to subscribe?</br>
<p>
If so, continue to LanFlix (lanflix.firebaseapp.com) and toggle the subscription!`;
}

function createRequestEmailBody(name, { mediaType, which, user, id }) {
  const lines = [
    `Media Type: ${mediaType.toUpperCase()}`,
    `${mediaType.toUpperCase()} Name: ${name}`,
    `Requested by: ${user}`,
  ];

  switch (mediaType) {
    case "show":
      lines.push(`Which: ${which}`);
      lines.push("");
      lines.push(`https://www.themoviedb.org/tv/${id}`);
      break;
    case "movie":
      lines.push("");
      lines.push(`https://www.themoviedb.org/movie/${id}`);
      break;
    default:
      break;
  }
  return lines.join("</br>");
}

module.exports = {
  createShowEmailBody,
  createMovieEmailBody,
  createNewShowEmailBody,
  createRequestEmailBody,
};

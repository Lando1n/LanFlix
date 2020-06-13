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

function createRequestEmailBody(name, { mediaType, which, id, poster_path }) {
  const imageUri =
    mediaType === "show"
      ? `https://www.themoviedb.org/tv/${id}`
      : `https://www.themoviedb.org/movie/${id}`;
  const lines = [
    `<a href='${imageUri}'><h3>${name}</h3></a>`,
    `<img src="https://image.tmdb.org/t/p/original${poster_path}" style='width:200px;height:300px;'/><br>`,
  ];

  if (mediaType === "show") {
    lines.push(`Which: ${which}`);
  }

  return lines.join("</br>");
}

module.exports = {
  createShowEmailBody,
  createMovieEmailBody,
  createNewShowEmailBody,
  createRequestEmailBody,
};

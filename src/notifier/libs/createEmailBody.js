function createShowEmailBody(name) {
  return `Hey there,

The show '${name}' has just been added to the Plex Server.
From my understanding, you asked to be notified about this.

It should be ready any moment to be streamed! 

Don't want this notification? Toggle your subscription on Lanflix.`;
}

function createMovieEmailBody(name) {
  return `Hey there,

The movie '${name}' has just been added to the Plex Server.
From my understanding, you asked to be notified about this.

It should be ready any moment to be streamed!

Don't want this notification? Too bad, there isn't functionality to not subscribe to movies yet :)`;
}

function createNewShowEmailBody(name) {
  return `'${name}' appears to be a new show on the server, would you like to subscribe?"

If so, continue to LanFlix (lanflix.firebaseapp.com) and toggle the subscription!`
}

function createRequestEmailBody(name, type, requester) {
  return `Media Type: ${type.toUpperCase()}
${type.toUpperCase()} Name: ${name}
Requested by: ${requester}`
}

module.exports = {
  createShowEmailBody,
  createMovieEmailBody,
  createNewShowEmailBody,
  createRequestEmailBody,
};

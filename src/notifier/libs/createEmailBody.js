function createShowEmailBody(name) {
  const body = `Hey there,

${name} has just been added to the Plex Server.
It should be ready any moment to be streamed!

Don't want this notification? Toggle your subscription on Lanflix.
`
  return body;
}

function createMovieEmailBody(name) {
  "Hey there!\n\n"
                "Just thought I'd let you know {0} has been download"
                " to the Plex Server. Any minute now it should be ready "
                "to be absorbed through your face cameras.\n"
                "Access your content on the Plex app for mobile, or at "
                "plex.tv/web on your computer. If you experience any "
                "inconveniences, please contact your local administrator."
                "\n\n"
                "Enjoy your {1}!\n\n"
                "- Your friendly neighbourhood robot."
  return body;
}

function createNewShowEmailBody(name) {
  "'{0}' appears to be a new show on the server,"
                           " would you like to subscribe?\n\n"
                           "If so, continue to "
                           "LanFlix (lanflix.firebaseapp.com)"
                           " and toggle the subscription!\n"
  return body;
}

function createRequestEmailBody(name, type) {
  "Media Type: Movie\n"
            "Movie Name: {0}\n"
            "Requested by: {1}"
  return body;
}

module.exports = {
  createShowEmailBody,
  createMovieEmailBody,
  createNewShowEmailBody,
  createRequestEmailBody,
};

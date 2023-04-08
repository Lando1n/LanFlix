const fs = require("fs");
const path = require("path");

const tmdb = require("../posters/TMDB");
const tvmaze = require("../posters/TVMaze");

function getAlertEmail(header, body, footer) {
  const template = path.join(__dirname, "./templates/alert.html");
  const html = fs.readFileSync(template, { encoding: "utf8", flag: "r" });
  return html
    .replace("${header}", header)
    .replace("${body}", body)
    .replace("${footer}", footer);
}

async function createShowEmailBody(
  name,
  { tvmazeId = process.env.sonarr_series_tvmazeid } = {}
) {
  const header = `Show Alert: "${name}"`;
  const body = tvmazeId
    ? `<img src="${await tvmaze.getTvPosterUri(tvmazeId)}"/>`
    : "";
  const footer = `Don't want this notification? Go to <a href='https://lanflix.firebaseapp.com'>LanFlix</a> and toggle the subscription!`;
  return getAlertEmail(header, body, footer);
}

async function createMovieEmailBody(
  name,
  { tmdbId = process.env.radarr_movie_tmdbid } = {}
) {
  const header = `Movie Alert: "${name}"`;
  const body = tmdbId
    ? `<img src="${await tmdb.getMoviePosterUri(tmdbId)}"/>`
    : "";
  const footer = `Don't want this notification? Go to <a href='https://lanflix.firebaseapp.com'>LanFlix</a> and toggle the subscription!`;
  return getAlertEmail(header, body, footer);
}

async function createNewShowEmailBody(
  name,
  { tvmazeId = process.env.sonarr_series_tvmazeid } = {}
) {
  const header = `LanFlix New Show Alert: ${name}`;
  const body = `
  <br>
    <b>${name}</b> appears to be a new show on the server, would you like to subscribe? Go to <a href='https://lanflix.firebaseapp.com'>LanFlix</a> and toggle the subscription!
    ${tvmazeId ? `<img src="${await tvmaze.getTvPosterUri(tvmazeId)}"/>` : ""}
  </br>`;
  const footer = "";
  return getAlertEmail(header, body, footer);
}

async function createRequestEmailBody(
  name,
  { mediaType, which, id, poster_path }
) {
  let footer;
  let imageUri;

  if (mediaType === "show") {
    footer = `Which: ${which}`;
    imageUri = await tmdb.getTvUri(id);
  } else {
    footer = "";
    imageUri = await tmdb.getMovieUri(id);
  }

  const header = `New Request: <a href='${imageUri}'>${name}</a>`;
  const body = `<img src="https://image.tmdb.org/t/p/original${poster_path}" style='width:200px;height:300px;'/><br>`;

  return getAlertEmail(header, body, footer);
}

module.exports = {
  createShowEmailBody,
  createMovieEmailBody,
  createNewShowEmailBody,
  createRequestEmailBody,
};

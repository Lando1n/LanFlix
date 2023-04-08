const fetch = require("node-fetch");

const baseUri = "https://api.tvmaze.com";

async function getTvPosterUri(id, quality = "original") {
  const response = await fetch(`${baseUri}/shows/${id}/images`, {
    method: "GET",
  });
  const images = await response.json();
  return images[0].resolutions[quality].url;
}

module.exports = {
  getTvPosterUri,
};

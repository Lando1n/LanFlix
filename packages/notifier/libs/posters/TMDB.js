const fetch = require("node-fetch");

const baseUri = "https://api.themoviedb.org/3";
const baseWwwUri = "https://www.themoviedb.org";
const apiKey = "0a2f7317616d7c1426d3a93c19babc97";

async function getMoviePosterUri(id) {
  const uri = `${baseUri}/movie/${id}/images?api_key=${apiKey}`;
  const response = await fetch(uri, { method: "GET" });
  const images = await response.json();
  return `${baseWwwUri}/t/p/original${images.posters[0].file_path}`;
}

function getMovieUri(id) {  
  return `${baseUri}/movie/${id}`;
}

function getTvUri(id) {
  return `${baseUri}/tv/${id}`;
}

module.exports = {
  getMoviePosterUri,
  getMovieUri,
  getTvUri,
};

// eslint-disable-next-line no-unused-vars
class TheMovieDB {
  constructor() {
    this.apiKey = "0a2f7317616d7c1426d3a93c19babc97";
    this.base_uri = "https://api.themoviedb.org/3";
    this.images_uri = "https://image.tmdb.org/t/p/original";
    this.language = "en-US";
  }

  getTvSearchUri(searchString) {
    return `${this.base_uri}/search/tv?api_key=${this.apiKey}&query=${encodeURI(
      searchString
    )}`;
  }

  getMovieSearchUri(searchString) {
    return `${this.base_uri}/search/movie?api_key=${
      this.apiKey
    }&query=${encodeURI(searchString)}`;
  }

  getImageUri(posterPath) {
    return `${this.images_uri}${posterPath}`;
  }
}

module.exports = TheMovieDB;

// eslint-disable-next-line no-unused-vars
function makeRequest(request) {
  if (!request.mediaType || !['show', 'movie'].includes(request.mediaType)) {
    throw new Error('Request needs to be either a movie or a show');
  }
  request.user = firebase.auth().currentUser.email;

  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1; //Months are zero based
  var curr_year = d.getFullYear();
  request.timestamp = `${curr_date}/${curr_month}/${curr_year}`;

  const db = firebase.firestore();
  console.log(request);
  db.collection('requests').doc(request.name).set(request);
}

async function requestShowDialog() {
  const {value: searchString } = await Swal.fire({
    title: 'Which TV show would you like to request?',
    width: '400px',
    input: 'text',
    inputPlaceholder: 'Specify the show name here.',
    showCancelButton: true,
    inputValidator: (showName) => {
      if (!showName) {
        return 'You need to write something!';
      } else if (doesShowExist(showName)) {
        return 'Show already exists on database!';
      }
      return;
    }
  });

  let searchOptions = {};

  theMovieDb.search.getTv({query: encodeURI(searchString)},
    // Search succeeded
    async (response) => {
      const rawResults = JSON.parse(response).results;

      const searchResults = rawResults.length < 3 ? rawResults : rawResults.slice(0, 3);

      if (searchResults.length === 0) {
        await Swal.fire('Search Failed', 'The search did not return any results', 'error');
        return requestShowDialog();
      }

      searchResults.forEach((show) => {
        const showString = `${show.name}: ${show.first_air_date}`;
        searchOptions[showString] = showString;
      });

      const {value: showName } = await Swal.fire({
        title: 'Search Results',
        input: 'radio',
        inputOptions: searchOptions,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to choose something!'
          }
        }
      });
    
    
      if (!showName) {
        return Swal.fire('Failed to request', 'The show name was not specified', 'error');
      }
    
      const {value: downloadType } = await Swal.fire({
        title: 'Options',
        input: 'radio',
        inputOptions: {
          all: 'All Episodes',
          future: 'Only Future Episodes'
        },
        inputValidator: (value) => {
          if (!value) {
            return 'You need to choose something!'
          }
        }
      });

      const request = {
        name: showName,
        mediaType: 'show',
        which: downloadType,
      };
    
      if (!downloadType) {
        Swal.fire('Failed to request', 'The download type was not specified', 'error');
      } else {
        makeRequest(request);
        Swal.fire('Requested', 'The show has been requested!', 'success');
      }
    },
    // Search Failed
    (response) => {
      console.error(response);
      throw new Error('Failed to find results from The Movie Database');
    }
  );
}

async function requestMovieDialog() {
  const {value: searchString } = await Swal.fire({
    title: 'Which movie would you like to request?',
    width: '400px',
    input: 'text',
    inputPlaceholder: 'Specify the movie name here.',
    showCancelButton: true,
    inputValidator: (movieName) => {
      if (!movieName) {
        return 'You need to write something!';
      }
      return;
    }
  });

  let searchOptions = {};

  theMovieDb.search.getMovie({query: encodeURI(searchString)},
    // Search succeeded
    async (response) => {
      const rawResults = JSON.parse(response).results;

      const searchResults = rawResults.length < 3 ? rawResults : rawResults.slice(0, 3);

      if (searchResults.length === 0) {
        await Swal.fire('Search Failed', 'The search did not return any results', 'error');
        return requestMovieDialog();
      }
      console.log(searchResults);
      searchResults.forEach((movie) => {
        const movieString = `${movie.title}: ${movie.release_date}`;
        searchOptions[movieString] = movieString;
      });

      const {value: movieName } = await Swal.fire({
        title: 'Search Results',
        input: 'radio',
        inputOptions: searchOptions,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to choose something!'
          }
        }
      });
    
    
      if (!movieName) {
        return Swal.fire('Failed to request', 'The movie name was not specified', 'error');
      }

      const request = {
        name: movieName,
        mediaType: 'show',
      };
      makeRequest(request);
      Swal.fire('Requested', 'The movie has been requested!', 'success');
    },
    // Search Failed
    (response) => {
      console.error(response);
      return Swal.fire('Failed to search', 'Failed to find results from The Movie Database', 'error');
    }
  );
}

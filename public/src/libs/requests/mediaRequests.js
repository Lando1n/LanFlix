// eslint-disable-next-line no-unused-vars
function makeRequest(name, mediaType, download = 'all') {
  if (!['show', 'movie'].includes(mediaType)) {
    throw new Error('Request needs to be either a movie or a show');
  }
  const user = firebase.auth().currentUser.email;
  const db = firebase.firestore();

  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1; //Months are zero based
  var curr_year = d.getFullYear();
  const timestamp = `${curr_date}/${curr_month}/${curr_year}`;

  db.collection('requests').doc(name).set({type: mediaType, user, timestamp, download});
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
        const showString = `${show.name}, ${show.first_air_date}`;
        searchOptions[show.name] = showString;
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
    
      if (!downloadType) {
        Swal.fire('Failed to request', 'The download type was not specified', 'error');
      } else {
        makeRequest(showName, 'show', downloadType);
        Swal.fire('Requested', 'The show has been requested!', 'success');
      }
    },
    // Search Failed
    (response) => {
      console.error(response);
      throw new Errror('Failed to find results from The Movie Database');
    }
  );
}

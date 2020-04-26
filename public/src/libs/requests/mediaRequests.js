// eslint-disable-next-line no-unused-vars
function makeRequest(request) {
  if (!request.mediaType || !["show", "movie"].includes(request.mediaType)) {
    throw new Error("Request needs to be either a movie or a show");
  }
  request.user = firebase.auth().currentUser.email;

  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1; //Months are zero based
  var curr_year = d.getFullYear();
  request.timestamp = `${curr_date}/${curr_month}/${curr_year}`;

  const db = firebase.firestore();
  console.log(request);
  db.collection("requests").doc(request.name).set(request);
}

// eslint-disable-next-line no-unused-vars
function requestShowDialog() {
  let results;

  Swal.mixin({
    input: "text",
    confirmButtonText: "Next &rarr;",
    showCancelButton: true,
    progressSteps: ["1", "2", "3"],
  })
    .queue([
      {
        title: "Which TV show would you like to request?",
        input: "text",
        inputPlaceholder: "Specify the show name here.",
        showCancelButton: true,
        inputValidator: (showName) => {
          if (!showName) {
            return "You need to write something!";
          } else if (doesShowExist(showName)) {
            return "Show already exists on database!";
          }
          return;
        },
        preConfirm: (searchString) => {
          const tmdb = new TheMovieDB();
          const uri = tmdb.getTvSearchUri(searchString);
          console.log(uri);
          return fetch(uri)
            .then((response) => {
              if (!response.ok) {
                throw new Error(response.statusText);
              }
              return response.json();
            })
            .then(async (response) => {
              let resultsTable = `
              <table class='table table-dark table-striped table-bordered'>
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Name</th>
                    <th>Release Date</th>
                  </tr>
                </thead>
                <tbody>`;

              results =
                response.total_results < 3
                  ? response.results
                  : response.results.slice(0, 3);
              console.log(results);

              let optionNum = 1;
              results.forEach((result) => {
                resultsTable += `
                <tr>
                  <td>${optionNum}</td>
                  <td>${result.name}</td>
                  <td>${result.first_air_date}</td>
                </tr>`;
                optionNum += 1;
              });
              resultsTable += `</tbody></table>`;

              // The user has to choose which search results
              await Swal.insertQueueStep({
                title: "Search Results",
                input: "radio",
                html: resultsTable,
                inputOptions: {
                  "1": 1,
                  "2": 2,
                  "3": 3,
                },
                inputValidator: (value) => {
                  if (!value) {
                    return "You need to choose something!";
                  }
                },
              });

              // The user must select the download type
              await Swal.insertQueueStep({
                title: "Which Episodes?",
                input: "select",
                inputOptions: {
                  all: "All",
                  future: "Just Upcoming Episodes",
                },
                inputValidator: (value) => {
                  if (!value) {
                    return "You need to choose something!";
                  }
                },
              });
            });
        },
      },
    ])
    .then((responses) => {
      if (!responses.value || responses.value.length !== 3) {
        return;
      }

      const selection = responses.value[1];
      const which = responses.value[2];

      const request = {
        mediaType: "show",
        which,
        ...results[selection],
      };
      console.log(request);
      //makeRequest(request);
      Swal.fire("Requested", "The show has been requested!", "success");
    })
    .catch((err) => {
      Swal.fire("Failed to request", `${err}`, "error");
    });
}

// eslint-disable-next-line no-unused-vars
async function requestMovieDialog() {
  const { value: searchString } = await Swal.fire({
    title: "Which movie would you like to request?",
    input: "text",
    inputPlaceholder: "Specify the movie name here.",
    showLoaderOnConfirm: true,
    showCancelButton: true,
    inputValidator: (movieName) => {
      if (!movieName) {
        return "You need to write something!";
      }
      return;
    },
  });

  if (!searchString) {
    return;
  }

  let searchOptions = {};

  theMovieDb.search.getMovie(
    { query: encodeURI(searchString) },
    // Search succeeded
    async (response) => {
      const rawResults = JSON.parse(response).results;

      const searchResults =
        rawResults.length < 3 ? rawResults : rawResults.slice(0, 3);

      if (searchResults.length === 0) {
        await Swal.fire(
          "Search Failed",
          "The search did not return any results",
          "error"
        );
        return requestMovieDialog();
      }
      console.log(searchResults);
      searchResults.forEach((movie) => {
        const movieString = `${movie.title}: ${movie.release_date}`;
        searchOptions[movieString] = movieString;
      });

      const { value: movieName } = await Swal.fire({
        title: "Search Results",
        input: "radio",
        inputOptions: searchOptions,
        inputValidator: (value) => {
          if (!value) {
            return "You need to choose something!";
          }
        },
      });

      if (!movieName) {
        return Swal.fire(
          "Failed to request",
          "The movie name was not specified",
          "error"
        );
      }

      const request = {
        name: movieName,
        mediaType: "movie",
      };
      makeRequest(request);
      Swal.fire("Requested", "The movie has been requested!", "success");
    },
    // Search Failed
    (response) => {
      console.error(response);
      return Swal.fire(
        "Failed to search",
        "Failed to find results from The Movie Database",
        "error"
      );
    }
  );
}

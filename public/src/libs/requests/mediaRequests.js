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
  console.debug(request);
  db.collection("requests").doc(request.name).set(request);
}

function getRequestResultRow(result, optionNum) {
  const tmdb = new TheMovieDB();
  const imageUrl = tmdb.getImageUri(result.poster_path);
  return `
          <tr>
            <td>${optionNum}</td>
            <td>
              <img src="${imageUrl}"
                  alt="${result.name || result.title}"
                  style="width:80px;height:120px;"
              >
            </td>
            <td>
              <h6>
              <br>
              ${result.name || result.title}
              <br><br>
              ${result.first_air_date || result.release_date}
              </h6>
            </td>
          </tr>`;
}

function createResultsTable(response) {
  const resultsToShow = 3;
  let resultsTable = `
    <table id='request-table' class='table table-dark table-striped table-bordered'>
      <thead>
        <tr>
          <th>Option</th>
          <th>Poster</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>`;

  const results =
    response.total_results < resultsToShow
      ? response.results
      : response.results.slice(0, resultsToShow);

  let optionNum = 1;
  results.forEach((result) => {
    resultsTable += getRequestResultRow(result, optionNum);
    optionNum += 1;
  });
  resultsTable += `</tbody></table>`;
  return resultsTable;
}

async function pickResult(response) {
  const resultsTable = createResultsTable(response);

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
}

async function chooseEpisodesType() {
  // The user must select the download type
  await Swal.insertQueueStep({
    title: "Which Episodes?",
    input: "select",
    inputOptions: {
      all: "All",
      future: "Upcoming Episodes",
      last: "Most Recent Season",
      first: "First Season",
    },
    inputValidator: (value) => {
      if (!value) {
        return "You need to choose something!";
      }
    },
  });
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

          return fetch(uri)
            .then((response) => {
              if (!response.ok) {
                throw new Error(response.statusText);
              }
              return response.json();
            })
            .then(async (response) => {
              await pickResult(response);

              await chooseEpisodesType();
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
        ...results[selection - 1],
      };
      makeRequest(request);
      Swal.fire("Requested", "The show has been requested!", "success");
    })
    .catch((err) => {
      Swal.fire("Failed to request", `${err}`, "error");
    });
}

// eslint-disable-next-line no-unused-vars
async function requestMovieDialog() {
  let results;

  Swal.mixin({
    input: "text",
    confirmButtonText: "Next &rarr;",
    showCancelButton: true,
    progressSteps: ["1", "2"],
  })
    .queue([
      {
        title: "Which Movie would you like to request?",
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
          const uri = tmdb.getMovieSearchUri(searchString);

          return fetch(uri)
            .then((response) => {
              if (!response.ok) {
                throw new Error(response.statusText);
              }
              return response.json();
            })
            .then(async (response) => {
              pickResult(response);
            });
        },
      },
    ])
    .then((responses) => {
      if (!responses.value || responses.value.length !== 2) {
        return;
      }

      const selection = responses.value[1];
      const name = results[selection - 1].title;

      const request = {
        name,
        mediaType: "movie",
        ...results[selection - 1],
      };
      makeRequest(request);
      Swal.fire("Requested", "The movie has been requested!", "success");
    })
    .catch((err) => {
      Swal.fire("Failed to request", `${err}`, "error");
    });
}

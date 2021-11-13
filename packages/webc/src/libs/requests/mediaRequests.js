const { getFirestore } = require("firebase/firestore");
const Swal = require("sweetalert2");

const { TheMovieDB } = require("./TheMovieDB");

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
  request.status = "Pending";

  const db = getFirestore();
  console.debug(request);
  db.collection("requests").doc(request.name).set(request);
}

function getNameDOM(option) {
  return `<h6>
  ${option.name || option.title}
  </h6>`;
}

function getInfoDOM(option) {
  return `<h6>
  ${option.first_air_date || option.release_date}
  </h6>`;
}

function getImageDOM(option) {
  const tmdb = new TheMovieDB();
  const imageUrl = tmdb.getImageUri(option.poster_path);
  return `<img src="${imageUrl}"
  alt="${option.name || option.title}"
  style="width:80px;height:120px;">`;
}

function shortenSearchResults(response, resultsToShow = 3) {
  if (response.total_results === 0) {
    Swal.fire("Failed to request", `No results found for search`, "error");
  }
  return response.total_results < resultsToShow
    ? response.results
    : response.results.slice(0, resultsToShow);
}

function createResultsTable(searchOptions) {
  let titleCols = "";
  let imageCols = "";
  let infoCols = "";

  searchOptions.forEach((option) => {
    titleCols += `<th>${getNameDOM(option)}</th>`;
    imageCols += `<td>${getImageDOM(option)}</td>`;
    infoCols += `<td>${getInfoDOM(option)}</td>`;
  });

  return `
      <table id='request-table' class='table table-dark table-bordered' style='table-layout: fixed;'>
        <thead class='thead-dark'>
          <tr>
            ${titleCols}
          </tr>
        </thead>
        <tbody>
          <tr>
            ${imageCols}
          </tr>
          <tr>
            ${infoCols}
          </tr>
        </tbody>
      </table>`;
}

async function pickResult(response) {
  const resultsTable = createResultsTable(response);

  // The user has to choose which search results
  await Swal.insertQueueStep({
    title: "Search Results",
    input: "radio",
    html: resultsTable,
    inputOptions: {
      1: "1",
      2: "2",
      3: "3",
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
    inputOptions: settings.tv_request_options,
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
              results = shortenSearchResults(response);
              await pickResult(results);

              await chooseEpisodesType();
            });
        },
      },
    ])
    .then(async (responses) => {
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
      // Prevent people from requesting a show that already is registered
      if (doesShowExist(request.name)) {
        const confirmResult = await Swal.fire({
          title: "Are you sure?",
          icon: "warning",
          text:
            "The show already has been registered. Please confirm that you have checked that what you want isn't already available.",
          showCancelButton: true,
          confirmButtonText: `Confirm and Continue`,
        });
        if (!confirmResult.isConfirmed) {
          // witty dialog
          const regretResult = await Swal.fire({
            title: "Show was not requested",
            icon: "info",
            text:
              "You have regretted your actions and decided not to request anything. Your admin applauds you.",
            confirmButtonText: `I admit, I messed up.`,
            showCancelButton: true,
            cancelButtonText: "Pfft, I did nothing wrong.",
          });
          const toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 2000,
            onOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          toast.fire({
            title: regretResult.isConfirmed
              ? "Your honesty is admired."
              : "Alright, you keep thinking that.",
          });
          return;
        }
      }
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
              results = shortenSearchResults(response);
              await pickResult(results);
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

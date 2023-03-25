const { getAuth } = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const Swal = require("sweetalert2");
const { getSettings } = require("../firebaseFunctions");
const { doesShowExist } = require("../datatableFunctions");
const fetch = require("node-fetch");

const TheMovieDB = require("./TheMovieDB");

const buttonColor = "#212529";

async function makeRequest(request) {
  if (!request.mediaType || !["show", "movie"].includes(request.mediaType)) {
    throw new Error("Request needs to be either a movie or a show");
  }
  const auth = getAuth();
  request.user = auth.currentUser.email;

  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1; //Months are zero based
  var curr_year = d.getFullYear();
  request.timestamp = `${curr_date}/${curr_month}/${curr_year}`;
  request.status = "Pending";

  const db = getFirestore();

  await setDoc(doc(db, "requests", request.name), request);
}

function getNameDOM(option) {
  return `<h6><b>
  ${option.name || option.title}
  </b></h6>`;
}

function getInfoDOM(option) {
  return `<h6><b>${option.first_air_date || option.release_date}</b></h6>`;
}

function getImageDOM(option) {
  const tmdb = new TheMovieDB();
  const imageUrl = tmdb.getImageUri(option.poster_path);
  return `<img src="${imageUrl}"
  alt="${option.name || option.title}"
  title="${option.overview}"
  class="request-image">`;
}

function getButtonDOM(option) {
  return `
  <td style="vertical-align:middle">${getNameDOM(option)}</td>
  <td>${getImageDOM(option)}</td>
  <td style="vertical-align:middle">${getInfoDOM(option)}</td>
  `;
}

function shortenSearchResults(response, resultsToShow = 3) {
  if (response.total_results === 0) {
    Swal.fire("Failed to request", `No results found for search`, "error");
  }
  return response.total_results < resultsToShow
    ? response.results
    : response.results.slice(0, resultsToShow);
}

async function pickResultDialog(options) {
  if (options.length < 1) {
    await Swal.fire("Search Results", "No results found!", "error");
    return -1;
  }

  // The user has to choose which search results
  const result = await Swal.fire({
    title: "Search Results",
    focusConfirm: false,
    showConfirmButton: options.length > 0,
    confirmButtonText: getButtonDOM(options[0]),
    confirmButtonColor: buttonColor,
    showDenyButton: options.length > 1,
    denyButtonText: options.length > 1 ? getButtonDOM(options[1]) : '',
    denyButtonColor: buttonColor,
    showCancelButton: options.length > 2,
    cancelButtonText: options.length > 2 ? getButtonDOM(options[2]) : '',
    cancelButtonColor: buttonColor,
    inputValidator: (value) => {
      if (!value) {
        return "You need to choose something!";
      }
    },
  });

  let selection;
  if (result.isConfirmed) {
    selection = 1;
  } else if (result.isDenied) {
    selection = 2;
  } else if (result.isCancelled) {
    selection = 3;
  } else if (result.isDismissed) {
    selection = -1;
  }
  return selection;
}

async function chooseEpisodesTypeDialog() {
  // The user must select the download type
  const settings = await getSettings();
  return Swal.fire({
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

async function requestShowDialog() {
  const searchResults = await Swal.fire({
    input: "text",
    confirmButtonText: "Next &rarr;",
    confirmButtonColor: buttonColor,
    showCancelButton: true,
    title: "Which TV show would you like to request?",
    input: "text",
    inputPlaceholder: "Specify the show name here.",
    showCancelButton: true,
    inputValidator: (showName) => {
      if (!showName) {
        return "You need to write something!";
      }
    },
    // Search the tvdb for results
    preConfirm: (searchString) => {
      const tmdb = new TheMovieDB();
      const uri = tmdb.getTvSearchUri(searchString);

      return fetch(uri).then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      });
    },
  });
  if (searchResults.isDismissed) {
    return;
  }
  // limit the results and ask the user to pick one
  const results = shortenSearchResults(searchResults.value);
  const selection = await pickResultDialog(results);
  if (selection === -1) {
    return;
  }
  // Ask which episodes they'd like
  const which = await chooseEpisodesTypeDialog();
  if (which.isDismissed) {
    return;
  }
  const request = {
    mediaType: "show",
    which: which.value,
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
      confirmButtonColor: buttonColor,
      confirmButtonText: `Confirm and Continue`,
    });
    if (!confirmResult.isConfirmed) {
      // witty dialog
      const regretResult = await Swal.fire({
        title: "Show was not requested",
        icon: "info",
        confirmButtonColor: buttonColor,
        text:
          "You have regretted your actions and decided not to request anything. Your admin applauds you.",
        confirmButtonText: `I admit, I messed up.`,
        showCancelButton: true,
        cancelButtonText: "Pfft, I did nothing wrong.",
      });
      Swal.fire({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 2000,
        title: regretResult.isConfirmed
          ? "Your honesty is admired."
          : "Alright, you keep thinking that.",
      });
      return;
    }
  }
  await makeRequest(request);
  Swal.fire("Requested", "The show has been requested!", "success");
}

async function requestMovieDialog() {
  const searchResults = await Swal.fire({
    input: "text",
    confirmButtonColor: buttonColor,
    confirmButtonText: "Next &rarr;",
    showCancelButton: true,
    title: "Which movie would you like to request?",
    input: "text",
    inputPlaceholder: "Specify the show name here.",
    showCancelButton: true,
    inputValidator: (showName) => {
      if (!showName) {
        return "You need to write something!";
      }
    },
    // Search the movie db for results
    preConfirm: (searchString) => {
      const tmdb = new TheMovieDB();
      const uri = tmdb.getMovieSearchUri(searchString);

      return fetch(uri).then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      });
    },
  });
  if (searchResults.isDismissed) {
    return;
  }
  // limit the results and ask the user to pick one
  const results = shortenSearchResults(searchResults.value);
  const selection = await pickResultDialog(results);
  if (selection === -1) {
    return;
  }

  const request = {
    name: results[selection - 1].title,
    mediaType: "movie",
    ...results[selection - 1],
  };

  await makeRequest(request);
  Swal.fire("Requested", "The movie has been requested!", "success");
}

async function requestDialog() {
  const result = await Swal.fire({
    title: "What would you like to request?",
    confirmButtonText: "Movie",
    confirmButtonColor: buttonColor,
    focusConfirm: false,
    showCancelButton: true,
    cancelButtonText: "TV Series",
    cancelButtonColor: buttonColor,
    icon: "question",
  });

  if (result.isConfirmed) {
    await requestMovieDialog();
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    await requestShowDialog();
  }
}

module.exports = {
  requestMovieDialog,
  requestShowDialog,
  requestDialog,
};

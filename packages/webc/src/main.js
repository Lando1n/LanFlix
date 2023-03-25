const { initializeApp } = require("firebase/app");
const { getAuth, onAuthStateChanged, signOut } = require("firebase/auth");

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCDDQXk9E6-t55GgFQhSkvx3hX_j1wKOkE",
  authDomain: "lanflix.firebaseapp.com",
  databaseURL: "https://lanflix.firebaseio.com",
  projectId: "lanflix",
  storageBucket: "lanflix.appspot.com",
  messagingSenderId: "208193875375",
  appId: "1:208193875375:web:8eb09f6978f36258c6135a",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize bootstrap
require("bootstrap");
require("datatables.net-bs5");

const {
  destroyTable,
  populateRequestsTable,
  populateSubTable,
} = require("./libs/datatableFunctions");
const { selectPage } = require("./libs/nav/topbar");
const { getAllUsers, getSettings } = require("./libs/firebaseFunctions");
const { setupRequestsListener } = require("./libs/requests/listener");

require("./libs/jquery/loginPage");
require("./libs/jquery/moviesTab");
require("./libs/jquery/topbar");
require("./libs/jquery/showsTab");

const auth = getAuth();

let unsubscribeRequestsListener;

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    $("#logged-in-username").text(user.email);
    $("#login-modal").hide();
    $("#banner").show();
    $("#topbar").show();
    $("#main").show();

    selectPage(null, "shows-page");
    // Check if the user exists yet, add it to list if not.
    const users = await getAllUsers();
    const settings = await getSettings();
    console.debug(settings);

    if (!users.includes(user.email)) {
      await initializeUser();
    }
    console.debug(`Successfully loggged in as ${JSON.stringify(user.email)}`);

    await populateSubTable("#movies-tbl", "movies");
    await populateSubTable("#shows-tbl", "shows");
    await populateRequestsTable();
    unsubscribeRequestsListener = setupRequestsListener();
  } else if (user) {
    if (unsubscribeRequestsListener) {
      unsubscribeRequestsListener();
    }
    window.location = "index.html";
    signOut(auth);
  } else {
    if (unsubscribeRequestsListener) {
      unsubscribeRequestsListener();
    }
    destroyTable("#movies-tbl");
    destroyTable("#shows-tbl");
    destroyTable("#requests-tbl");
    window.location = "index.html";
  }
});

const defaultOptions = {
  iDisplayLength: 15,
  lengthChange: false,
  bFilter: false,
  language: { search: "", searchPlaceholder: "Search..." },
  searching: true,
};

$("#shows-tbl").DataTable({
  order: [[0, "asc"]],
  columns: [
    {
      data: "name",
      title: "Show Name",
    },
    {
      data: "subscribers",
      title: "Total Subscribers",
      searchable: false,
    },
    {
      data: "logo",
      title: "Subbed",
      className: "dt-right",
      searchable: false,
    },
    {
      data: "subbed",
      title: "Subbed",
      visible: false,
    },
  ],
  ...defaultOptions,
});

$("#movies-tbl").DataTable({
  order: [[0, "asc"]],
  columns: [
    {
      data: "name",
      title: "Type",
    },
    {
      data: "subscribers",
      title: "Total Subscribers",
      searchable: false,
    },
    {
      data: "logo",
      title: "Subbed",
      className: "dt-right",
      searchable: false,
    },
    {
      data: "subbed",
      visible: false,
    },
  ],
  ...defaultOptions,
});

$("#requests-tbl").DataTable({
  order: [[3, "desc"]],
  columns: [
    {
      data: "name",
      title: "Request",
      searchable: true,
    },
    {
      data: "type",
      title: "Type",
      searchable: true,
    },
    {
      data: "timestamp",
      title: "Date Requested",
      searchable: false,
    },
    {
      data: "status",
      title: "Status",
      searchable: true,
      className: "dt-right",
    },
  ],
  ...defaultOptions,
});

const { initializeApp } = require("firebase/app");
const { getAuth, onAuthStateChanged, signOut } = require("firebase/auth");

// TODO: Add SDKs for Firebase products that you want to use
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

require("datatables.net")(window, $);
require("datatables.net-dt")(window, $);

const {
  populateRequestsTable,
  populateSubTable,
} = require("./libs/datatableFunctions");
const { selectPage } = require("./libs/nav/topbar");
const { getAllUsers, getSettings } = require("./libs/firebaseFunctions");
const { setupRequestsListener } = require("./libs/requests/listener");

let settings;
let unsubscribeRequestsListener;

require("./libs/jquery/loginPage");
require("./libs/jquery/moviesTab");
require("./libs/jquery/requests");
require("./libs/jquery/showsTab");
require("./libs/jquery/navigation");

const auth = getAuth();

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
    settings = await getSettings();
    console.log(settings);

    if (!users.includes(user.email)) {
      initializeUser();
    }
    console.log(`Successfully loggged in as ${JSON.stringify(user.email)}`);

    await populateSubTable("#movies-tbl", "movies");
    await populateSubTable("#shows-tbl", "shows");
    await populateRequestsTable();
    unsubscribeRequestsListener = setupRequestsListener();
  } else if (user) {
    unsubscribeRequestsListener();
    window.location = "index.html";
    signOut(auth);
  } else {
    unsubscribeRequestsListener();
    destroyTable("#movies-tbl");
    destroyTable("#shows-tbl");
    destroyTable("#requests-tbl");
    window.location = "index.html";
  }
});

$("#shows-tbl").DataTable({
  iDisplayLength: 15,
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
  lengthChange: false,
});

$("#movies-tbl").DataTable({
  iDisplayLength: 15,
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
  lengthChange: false,
  bFilter: false,
});

$("#requests-tbl").DataTable({
  iDisplayLength: 15,
  order: [[2, "desc"]],
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
  lengthChange: false,
  bFilter: false,
});

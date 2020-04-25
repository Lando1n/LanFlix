const movieTableSelector = "#movies-tbl";

// Launch request show dialog
$("#request-movie-button").on("click", requestMovieDialog);

$(movieTableSelector).on("dblclick", "tr", function () {
  const movieData = $(movieTableSelector).DataTable().row(".selected").data();
  const isSubbed = movieData.subbed === "yes";

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 2000,
    onOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  if (!isSubbed) {
    Toast.fire({
      icon: "success",
      title: `Subscribed to ${movieData.type}!`,
    });
    changeMovieSubOnFirebase(movieData.type, false);
    setSubbedForMovie(true);
  } else {
    Toast.fire({
      icon: "error",
      title: `Unsubscribed from ${movieData.type}`,
    });
    changeMovieSubOnFirebase(movieData.type, true);
    setSubbedForMovie(false);
  }
});

// Highlight row when clicked so that it's selected
$(movieTableSelector).on("click", "tr", function () {
  $(movieTableSelector)
    .DataTable()
    .rows()
    .every(function () {
      this.nodes().to$().removeClass("selected");
    });
  $(this).addClass("selected");
});

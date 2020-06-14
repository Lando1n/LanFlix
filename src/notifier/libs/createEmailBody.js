function createEmailBody(
  header,
  body,
  footer,
  align = { header: "center", body: "left", footer: "left" }
) {
  return `<html>
  <style>
  .table {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }
  .table td, .table th {
    padding: 8px;
    text-align: ${align.body};
  }
  .table th {
    border: 1px solid #ddd;
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: ${align.header};
    background-color: #4CAF50;
    color: white;
  }
  .table tfoot {
    border: 1px solid #ddd;
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: ${align.footer};
    background-color: #dcdcdc;
  }
  </style>
  <body>
  <table class='table'>
    <thead>
      <tr>
         <th>${header}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          ${body}
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>${footer}</td>
      </tr>
    </tfoot>
  </table>
  </body>
  </html>`;
}

function createShowEmailBody(name) {
  const header = `LanFlix Show Alert: ${name}`;
  const body = `
<br>
  A new episode of <b>${name}</b> has just been added to the Plex Server.
<br>
<br>
  From my understanding, you asked to be notified about this.
<br>
<p>
  It should be ready any moment to be streamed!
<p> `;
  const footer = `Don't want this notification? Go to <a href='https://lanflix.firebaseapp.com'>LanFlix</a> and toggle the subscription!`;
  return createEmailBody(header, body, footer);
}

function createMovieEmailBody(name) {
  const header = `LanFlix Movie Alert: ${name}`;
  const body = `
<br>
  <b>${name}</b> has just been added to the Plex Server.
<br>
<br>
  From my understanding, you asked to be notified about this.
<br>
<p>
  It should be ready any moment to be streamed!
<p> `;
  const footer = `Don't want this notification? Go to <a href='https://lanflix.firebaseapp.com'>LanFlix</a> and toggle the subscription!`;
  return createEmailBody(header, body, footer);
}

function createNewShowEmailBody(name) {
  const header = `LanFlix New Show Alert: ${name}`;
  const body = `
<br>
  <b>${name}</b> appears to be a new show on the server, would you like to subscribe?
</br>`;
  const footer = `Go to <a href='https://lanflix.firebaseapp.com'>LanFlix</a> and toggle the subscription!`;
  return createEmailBody(header, body, footer);
}

function createRequestEmailBody(name, { mediaType, which, id, poster_path }) {
  const imageUri =
    mediaType === "show"
      ? `https://www.themoviedb.org/tv/${id}`
      : `https://www.themoviedb.org/movie/${id}`;

  const header = `New Request: <a href='${imageUri}'><h3>${name}</h3></a>`;
  const body = `<img src="https://image.tmdb.org/t/p/original${poster_path}" style='width:200px;height:300px;'/><br>`;
  let footer = ``;

  if (mediaType === "show") {
    footer = `Which: ${which}`;
  }

  return createEmailBody(header, body, footer, {
    body: "center",
  });
}

module.exports = {
  createShowEmailBody,
  createMovieEmailBody,
  createNewShowEmailBody,
  createRequestEmailBody,
};

function createShowEmailBody(name) {
  return `<html>
  <style>
  .table {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }
  .table td, .table th {
    padding: 8px;
  }
  .table tr:nth-child(even){background-color: #f2f2f2;}
  .table th {
    border: 1px solid #ddd;
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    background-color: #4CAF50;
    color: white;
  }
  
  .table tfoot {
    border: 1px solid #ddd;
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #dcdcdc;
  }
  </style>
  <body>
  <table class='table'>
    <thead>
      <tr>
         <th>LanFlix Show Alert: ${name}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <br>
            A new episode of <b>${name}</b> has just been added to the Plex Server.
          <br>
          <br>
            From my understanding, you asked to be notified about this.
          <br>
          <p>
            It should be ready any moment to be streamed!
          <p> 
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>Don't want this notification? Continue to <a href='https://lanflix.firebaseapp.com'>LanFlix</a> and toggle the subscription!</td>
      </tr>
    </tfoot>
  </table>
  </body>
  </html>`;
}

function createMovieEmailBody(name) {
  return `<html>
  <style>
  .table {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }
  .table td, .table th {
    padding: 8px;
  }
  .table tr:nth-child(even){background-color: #f2f2f2;}
  .table th {
    border: 1px solid #ddd;
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    background-color: #4CAF50;
    color: white;
  }
  
  .table tfoot {
    border: 1px solid #ddd;
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #dcdcdc;
  }
  </style>
  <body>
  <table class='table'>
    <thead>
      <tr>
         <th>LanFlix Movie Alert: ${name}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <br>
            <b>${name}</b> has just been added to the Plex Server.
          <br>
          <br>
            From my understanding, you asked to be notified about this.
          <br>
          <p>
            It should be ready any moment to be streamed!
          <p> 
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>Don't want this notification? Continue to <a href='https://lanflix.firebaseapp.com'>LanFlix</a> and toggle the subscription!</td>
      </tr>
    </tfoot>
  </table>
  </body>
  </html>`;
}

function createNewShowEmailBody(name) {
  return `'${name}' appears to be a new show on the server, would you like to subscribe?</br>
<p>
If so, continue to <a href='lanflix.firebaseapp.com'>LanFlix</a> and toggle the subscription!`;
}

function createRequestEmailBody(name, { mediaType, which, id, poster_path }) {
  const imageUri =
    mediaType === "show"
      ? `https://www.themoviedb.org/tv/${id}`
      : `https://www.themoviedb.org/movie/${id}`;
  const lines = [
    `<a href='${imageUri}'><h3>${name}</h3></a>`,
    `<img src="https://image.tmdb.org/t/p/original${poster_path}" style='width:200px;height:300px;'/><br>`,
  ];

  if (mediaType === "show") {
    lines.push(`Which: ${which}`);
  }

  return lines.join("</br>");
}

module.exports = {
  createShowEmailBody,
  createMovieEmailBody,
  createNewShowEmailBody,
  createRequestEmailBody,
};

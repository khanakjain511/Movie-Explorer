const API_KEY = "45d2bf00";

function searchMovie() {
  let query = document.getElementById("search").value;
  let moviesDiv = document.getElementById("movies");

  moviesDiv.innerHTML = "Loading...";

  fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      moviesDiv.innerHTML = "";

      if (data.Response === "True") {
        data.Search.map(movie => {
          let div = document.createElement("div");
          div.className = "movie";

          div.innerHTML = `
            <img src="${movie.Poster}" />
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
          `;

          moviesDiv.appendChild(div);
        });
      } else {
        moviesDiv.innerHTML = "No movies found";
      }
    })
    .catch(() => {
      moviesDiv.innerHTML = "Error loading data";
    });
}
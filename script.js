const API_KEY = "758a4fd9";

const searchInput = document.getElementById("search");
const button = document.getElementById("btn");
const moviesDiv = document.getElementById("movies");
const statusText = document.getElementById("status");

function fetchMovies(query) {
  statusText.innerText = "Loading...";
  moviesDiv.innerHTML = "";

  fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        displayMovies(data.Search);
        statusText.innerText = "";
      } else {
        statusText.innerText = "No movies found";
      }
    })
    .catch(() => {
      statusText.innerText = "Error fetching data";
    });
}

// Display movies
function displayMovies(movies) {
  moviesDiv.innerHTML = "";

  movies.map(movie => {
    const div = document.createElement("div");
    div.className = "movie";

    div.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;

    moviesDiv.appendChild(div);
  });
}

button.addEventListener("click", () => {
  const query = searchInput.value.trim();

  if (query !== "") {
    fetchMovies(query);
  }
});
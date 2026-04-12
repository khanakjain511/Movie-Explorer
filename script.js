const API_KEY = "758a4fd9";

const searchInput = document.getElementById("search");
const button = document.getElementById("btn");
const moviesDiv = document.getElementById("movies");
const statusText = document.getElementById("status");

const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");

let allMovies = [];

// FETCH MOVIES
function fetchMovies(query) {
  statusText.innerText = "Loading...";
  moviesDiv.innerHTML = "";

  fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        allMovies = data.Search;
        applyOperations();
        statusText.innerText = "";
      } else {
        statusText.innerText = "No movies found";
      }
    })
    .catch(() => {
      statusText.innerText = "Error fetching data";
    });
}

// FILTER + SORT
function applyOperations() {
  let updated = [...allMovies];

  // FILTER
  if (filterSelect.value === "new") {
    updated = updated.filter(m => parseInt(m.Year) >= 2015);
  } else if (filterSelect.value === "old") {
    updated = updated.filter(m => parseInt(m.Year) < 2015);
  }

  // SORT (FIXED)
  if (sortSelect.value === "asc") {
    updated = updated.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  } else if (sortSelect.value === "desc") {
    updated = updated.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (sortSelect.value === "az") {
    updated = updated.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortSelect.value === "za") {
    updated = updated.sort((a, b) => b.Title.localeCompare(a.Title));
  }

  displayMovies(updated);
}

// DISPLAY
function displayMovies(movies) {
  moviesDiv.innerHTML = "";

  movies.map(movie => {
    const div = document.createElement("div");
    div.className = "movie";

    div.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="addToFav('${movie.imdbID}')">❤️</button>
    `;

    moviesDiv.appendChild(div);
  });
}

// FAVORITES
function addToFav(id) {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favs.includes(id)) {
    favs.push(id);
    localStorage.setItem("favorites", JSON.stringify(favs));
    alert("Added to favorites ❤️");
  }
}

// SHOW FAVORITES
function showFavorites() {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  const favMovies = allMovies.filter(m => favs.includes(m.imdbID));

  if (favMovies.length === 0) {
    statusText.innerText = "No favorites yet";
  } else {
    statusText.innerText = "Your Favorites";
  }

  displayMovies(favMovies);
}

// EVENTS
button.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchMovies(query);
});

// ENTER KEY
searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") button.click();
});

// DEBOUNCING (BONUS)
let timeout;
searchInput.addEventListener("input", () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    const query = searchInput.value.trim();
    if (query) fetchMovies(query);
  }, 500);
});

filterSelect.addEventListener("change", applyOperations);
sortSelect.addEventListener("change", applyOperations);


const toggleBtn = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  // Save preference
  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
});
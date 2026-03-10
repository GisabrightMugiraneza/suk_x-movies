const apiKey = "27d7234cc0a8643d0b6d28fa1a7517aa";

async function searchMovies() {

    const query = document.getElementById("searchInput").value;

    if(query === ""){
        alert("Please enter a movie name");
        return;
    }

    const url =
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;

    const response = await fetch(url);
    const data = await response.json();

    displayResults(data.results);
}

function displayResults(movies){

    const grid = document.getElementById("resultsGrid");
    const section = document.getElementById("searchResults");

    grid.innerHTML = "";

    if(movies.length === 0){
        grid.innerHTML = `<div class="no-results">No movies found</div>`;
        return;
    }

    movies.forEach(movie => {

        const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/300x450";

        const card = `
        <div class="movie-card">
            <div class="movie-poster">
                <img src="${poster}">
            </div>

            <div class="movie-info">
                <h3>${movie.title}</h3>
                <div class="movie-meta">
                    <span>${movie.release_date || "N/A"}</span>
                    <span class="rating">★ ${movie.vote_average}</span>
                </div>
            </div>
        </div>
        `;

        grid.innerHTML += card;

    });

    section.classList.add("active");
}











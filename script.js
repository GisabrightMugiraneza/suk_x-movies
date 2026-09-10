

// ==========================================
// SUK_X MOVIES
// TMDB + YOUTUBE TRAILERS
// ==========================================

const API_KEY = "27d7234cc0a8643d0b6d28fa1a7517aa";
const BASE_URL = "https://api.themoviedb.org/3";

const IMAGE_URL = "https://image.tmdb.org/t/p/original";

const POSTER_URL = "https://image.tmdb.org/t/p/w500";


// ==========================================
// HERO ELEMENTS
// ==========================================

const hero = document.getElementById("hero");
const featuredTitle = document.getElementById("featuredTitle");
const featuredOverview = document.getElementById("featuredOverview");

const watchTrailer = document.getElementById("watchTrailer");
const moreInfo = document.getElementById("moreInfo");


// ==========================================
// HERO MOVIES
// ==========================================

let heroMovies = [];
let currentHeroIndex = 0;
let currentHeroMovie = null;


// ==========================================
// LOAD TRENDING MOVIES FOR HERO
// ==========================================

async function loadHeroMovies() {

    try {

        const response = await fetch(
            `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
        );

        const data = await response.json();

        heroMovies = data.results
            .filter(movie => movie.backdrop_path)
            .slice(0, 10);

        if (heroMovies.length > 0) {

            showHeroMovie(0);

            // CHANGE HERO EVERY 4 SECONDS
            setInterval(() => {

                currentHeroIndex++;

                if (currentHeroIndex >= heroMovies.length) {
                    currentHeroIndex = 0;
                }

                showHeroMovie(currentHeroIndex);

            }, 4000);

        }

    } catch (error) {

        console.error("Hero movies error:", error);

        featuredTitle.textContent = "Suk_x Movies";
        featuredOverview.textContent =
            "Discover trending movies, TV shows and anime.";

    }

}


// ==========================================
// SHOW HERO MOVIE
// ==========================================

function showHeroMovie(index) {

    const movie = heroMovies[index];

    if (!movie) return;

    currentHeroMovie = movie;

    featuredTitle.textContent =
        movie.title || movie.name || "Unknown Movie";

    featuredOverview.textContent =
        movie.overview || "No description available.";

    // CHANGE ONLY THE HERO IMAGE
    // Your existing background colors remain untouched.
    hero.style.backgroundImage =
        `url("${IMAGE_URL}${movie.backdrop_path}")`;
}


// ==========================================
// YOUTUBE TRAILER
// ==========================================

async function getYoutubeTrailer(movieId) {

    try {

        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
        );

        const data = await response.json();

        // First try official YouTube trailer
        let trailer = data.results.find(video =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.official === true
        );

        // If official trailer isn't available,
        // use any YouTube trailer
        if (!trailer) {

            trailer = data.results.find(video =>
                video.site === "YouTube" &&
                video.type === "Trailer"
            );

        }

        // Last fallback: YouTube teaser
        if (!trailer) {

            trailer = data.results.find(video =>
                video.site === "YouTube" &&
                video.type === "Teaser"
            );

        }

        return trailer ? trailer.key : null;

    } catch (error) {

        console.error("Trailer error:", error);

        return null;
    }

}


// ==========================================
// TRAILER MODAL
// ==========================================

const trailerModal = document.getElementById("trailerModal");
const trailerContainer = document.getElementById("trailerContainer");
const closeTrailer = document.getElementById("closeTrailer");


watchTrailer.addEventListener("click", async () => {

    if (!currentHeroMovie) return;

    watchTrailer.innerHTML =
        `<i class="fa-solid fa-spinner fa-spin"></i> Loading...`;

    const youtubeKey =
        await getYoutubeTrailer(currentHeroMovie.id);

    watchTrailer.innerHTML =
        `<i class="fa-solid fa-play"></i> Watch Trailer`;

    if (!youtubeKey) {

        alert("Sorry, no YouTube trailer was found for this movie.");

        return;
    }

    trailerContainer.innerHTML = `
        <iframe
            width="100%"
            height="500"
            src="https://www.youtube.com/embed/${youtubeKey}?autoplay=1"
            title="Movie Trailer"
            frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen>
        </iframe>
    `;

    trailerModal.style.display = "flex";

});


// ==========================================
// CLOSE TRAILER
// ==========================================

closeTrailer.addEventListener("click", closeTrailerModal);

function closeTrailerModal() {

    trailerModal.style.display = "none";

    // Remove iframe so YouTube stops playing
    trailerContainer.innerHTML = "";

}


// Close when clicking outside
window.addEventListener("click", (event) => {

    if (event.target === trailerModal) {
        closeTrailerModal();
    }

});


// ==========================================
// MORE INFO
// ==========================================

moreInfo.addEventListener("click", () => {

    if (!currentHeroMovie) return;

    openMovieDetails(currentHeroMovie);

});


// ==========================================
// TRENDING MOVIES
// ==========================================

async function loadTrendingMovies() {

    try {

        const response = await fetch(
            `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
        );

        const data = await response.json();

        displayMovies(
            data.results,
            document.getElementById("trendingMovies")
        );

    } catch (error) {

        console.error("Trending error:", error);

    }

}


// ==========================================
// POPULAR MOVIES
// ==========================================

async function loadPopularMovies() {

    try {

        const response = await fetch(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );

        const data = await response.json();

        displayMovies(
            data.results,
            document.getElementById("popularMovies")
        );

    } catch (error) {

        console.error("Popular movies error:", error);

    }

}


// ==========================================
// POPULAR ANIME
// ==========================================

async function loadAnimeMovies() {

    try {

        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}` +
            `&with_genres=16` +
            `&with_original_language=ja` +
            `&sort_by=popularity.desc`
        );

        const data = await response.json();

        displayMovies(
            data.results,
            document.getElementById("animeMovies")
        );

    } catch (error) {

        console.error("Anime error:", error);

    }

}


// ==========================================
// DISPLAY MOVIES
// ==========================================

function displayMovies(movies, container) {

    container.innerHTML = "";

    if (!movies || movies.length === 0) {

        container.innerHTML =
            "<p>No movies found.</p>";

        return;
    }

    movies.forEach(movie => {

        if (!movie.poster_path) return;

        const card = document.createElement("div");

        card.className = "movie-card";

        card.innerHTML = `

            <img
                src="${POSTER_URL}${movie.poster_path}"
                alt="${movie.title || movie.name}"
                loading="lazy"
            >

            <div class="movie-info">

                <h3>
                    ${movie.title || movie.name}
                </h3>

                <p>
                    ⭐ ${movie.vote_average?.toFixed(1) || "N/A"}
                </p>

            </div>

        `;

        card.addEventListener("click", () => {

            openMovieDetails(movie);

        });

        container.appendChild(card);

    });

}


// ==========================================
// MOVIE DETAILS
// ==========================================

function openMovieDetails(movie) {

    const modal = document.getElementById("movieModal");
    const details = document.getElementById("movieDetails");

    details.innerHTML = `

        <div class="details-container">

            <img
                src="${POSTER_URL}${movie.poster_path}"
                alt="${movie.title || movie.name}"
            >

            <div>

                <h2>
                    ${movie.title || movie.name}
                </h2>

                <p>
                    ⭐ Rating:
                    ${movie.vote_average?.toFixed(1) || "N/A"}
                </p>

                <p>
                    ${movie.overview || "No description available."}
                </p>

                <button
                    class="trailer-button"
                    onclick="playMovieTrailer(${movie.id})"
                >
                    <i class="fa-solid fa-play"></i>
                    Watch Trailer
                </button>

            </div>

        </div>

    `;

    modal.style.display = "flex";

}


// ==========================================
// PLAY TRAILER FROM MOVIE CARD
// ==========================================

async function playMovieTrailer(movieId) {

    const youtubeKey =
        await getYoutubeTrailer(movieId);

    if (!youtubeKey) {

        alert("Sorry, no YouTube trailer was found.");

        return;
    }

    trailerContainer.innerHTML = `

        <iframe
            width="100%"
            height="500"
            src="https://www.youtube.com/embed/${youtubeKey}?autoplay=1"
            title="Movie Trailer"
            frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen>
        </iframe>

    `;

    trailerModal.style.display = "flex";

}


// ==========================================
// CLOSE MOVIE MODAL
// ==========================================

const movieModal =
    document.getElementById("movieModal");

const closeMovie =
    document.querySelector("#movieModal .close");


closeMovie.addEventListener("click", () => {

    movieModal.style.display = "none";

});


window.addEventListener("click", (event) => {

    if (event.target === movieModal) {

        movieModal.style.display = "none";

    }

});


// ==========================================
// SEARCH
// ==========================================

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const searchResults =
    document.getElementById("searchResults");


async function searchMovies() {

    const query =
        searchInput.value.trim();

    if (!query) {

        alert("Please enter a movie, TV show or anime name.");

        return;
    }

    try {

        const response = await fetch(
            `${BASE_URL}/search/multi?api_key=${API_KEY}` +
            `&language=en-US&query=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        const results =
            data.results.filter(item =>
                item.media_type === "movie" ||
                item.media_type === "tv"
            );

        displayMovies(results, searchResults);

        // Scroll to search results
        searchResults.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        console.error("Search error:", error);

    }

}


// Search button
searchBtn.addEventListener(
    "click",
    searchMovies
);


// Search with Enter
searchInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            searchMovies();

        }

    }
);


// ==========================================
// START WEBSITE
// ==========================================

loadHeroMovies();

loadTrendingMovies();

loadPopularMovies();

loadAnimeMovies();









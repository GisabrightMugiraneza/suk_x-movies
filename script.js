
// =====================================================
// SUK_X MOVIES
// TMDB + YOUTUBE TRAILERS
// =====================================================


// =====================================================
// TMDB SETTINGS
// =====================================================

const API_KEY = "27d7234cc0a8643d0b6d28fa1a7517aa";

const BASE_URL = "https://api.themoviedb.org/3";

const POSTER_URL = "https://image.tmdb.org/t/p/w500";

const BACKDROP_URL = "https://image.tmdb.org/t/p/original";


// =====================================================
// ELEMENTS
// =====================================================

const hero = document.getElementById("hero");

const featuredTitle =
    document.getElementById("featuredTitle");

const featuredOverview =
    document.getElementById("featuredOverview");

const watchTrailer =
    document.getElementById("watchTrailer");

const moreInfo =
    document.getElementById("moreInfo");


const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const searchResults =
    document.getElementById("searchResults");

const searchTitle =
    document.getElementById("searchTitle");


const homeContent =
    document.getElementById("homeContent");


// =====================================================
// NAVIGATION ELEMENTS
// =====================================================

const homeLink =
    document.getElementById("homeLink");

const moviesLink =
    document.getElementById("moviesLink");

const tvLink =
    document.getElementById("tvLink");

const animeLink =
    document.getElementById("animeLink");

const trendingLink =
    document.getElementById("trendingLink");


// =====================================================
// HERO
// =====================================================

let heroMovies = [];

let currentHeroIndex = 0;

let currentHeroItem = null;


// =====================================================
// LOAD HERO MOVIES
// =====================================================

async function loadHeroMovies(){

    try{

        const response = await fetch(
            `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
        );

        const data = await response.json();

        heroMovies =
            data.results
            .filter(movie => movie.backdrop_path)
            .slice(0,10);


        if(heroMovies.length === 0){
            return;
        }


        showHeroMovie(0);


        // CHANGE EVERY 4 SECONDS

        setInterval(() => {

            currentHeroIndex++;

            if(
                currentHeroIndex >= heroMovies.length
            ){

                currentHeroIndex = 0;

            }

            showHeroMovie(currentHeroIndex);

        },4000);


    }catch(error){

        console.error(
            "Hero loading error:",
            error
        );

    }

}


// =====================================================
// SHOW HERO MOVIE
// =====================================================

function showHeroMovie(index){

    const movie =
        heroMovies[index];

    if(!movie){
        return;
    }

    currentHeroItem = movie;


    featuredTitle.textContent =
        movie.title || "Unknown Movie";


    featuredOverview.textContent =
        movie.overview ||
        "No description available.";


    hero.style.backgroundImage =
        `url("${BACKDROP_URL}${movie.backdrop_path}")`;

}


// =====================================================
// GET YOUTUBE TRAILER
// =====================================================

async function getTrailer(id,type="movie"){

    try{

        const response = await fetch(
            `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`
        );

        const data = await response.json();


        // Official trailer first

        let trailer =
            data.results.find(video =>

                video.site === "YouTube" &&

                video.type === "Trailer" &&

                video.official === true

            );


        // Normal trailer

        if(!trailer){

            trailer =
                data.results.find(video =>

                    video.site === "YouTube" &&

                    video.type === "Trailer"

                );

        }


        // Teaser

        if(!trailer){

            trailer =
                data.results.find(video =>

                    video.site === "YouTube" &&

                    video.type === "Teaser"

                );

        }


        return trailer
            ? trailer.key
            : null;


    }catch(error){

        console.error(
            "Trailer error:",
            error
        );

        return null;

    }

}


// =====================================================
// TRAILER MODAL
// =====================================================

const trailerModal =
    document.getElementById("trailerModal");

const trailerContainer =
    document.getElementById("trailerContainer");

const closeTrailer =
    document.getElementById("closeTrailer");


// =====================================================
// WATCH HERO TRAILER
// =====================================================

watchTrailer.addEventListener(
    "click",
    async () => {

        if(!currentHeroItem){
            return;
        }


        watchTrailer.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin"></i> Loading...`;


        const trailer =
            await getTrailer(
                currentHeroItem.id,
                "movie"
            );


        watchTrailer.innerHTML =
            `<i class="fa-solid fa-play"></i> Watch Trailer`;


        if(!trailer){

            alert(
                "Sorry, no YouTube trailer was found."
            );

            return;
        }


        openTrailer(trailer);

    }
);


// =====================================================
// OPEN TRAILER
// =====================================================

function openTrailer(youtubeKey){

    trailerContainer.innerHTML = `

        <iframe
            src="https://www.youtube.com/embed/${youtubeKey}?autoplay=1"
            title="YouTube Movie Trailer"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen>
        </iframe>

    `;

    trailerModal.style.display = "flex";

}


// =====================================================
// CLOSE TRAILER
// =====================================================

closeTrailer.addEventListener(
    "click",
    closeTrailerWindow
);


function closeTrailerWindow(){

    trailerModal.style.display = "none";

    // This stops the YouTube video

    trailerContainer.innerHTML = "";

}


// =====================================================
// MOVIE MODAL
// =====================================================

const movieModal =
    document.getElementById("movieModal");

const movieDetails =
    document.getElementById("movieDetails");

const closeMovie =
    document.getElementById("closeMovie");


// =====================================================
// CLOSE MOVIE MODAL
// =====================================================

closeMovie.addEventListener(
    "click",
    () => {

        movieModal.style.display = "none";

    }
);


// =====================================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// =====================================================

window.addEventListener(
    "click",
    (event) => {

        if(event.target === trailerModal){

            closeTrailerWindow();

        }


        if(event.target === movieModal){

            movieModal.style.display = "none";

        }

    }
);


// =====================================================
// DISPLAY MOVIES
// =====================================================

function displayMovies(
    items,
    container
){

    container.innerHTML = "";


    if(
        !items ||
        items.length === 0
    ){

        container.innerHTML = `

            <p class="loading">
                No results found.
            </p>

        `;

        return;
    }


    items.forEach(item => {


        if(!item.poster_path){
            return;
        }


        const card =
            document.createElement("div");


        card.className =
            "movie-card";


        const title =
            item.title ||
            item.name ||
            "Unknown";


        const type =
            item.media_type === "tv"
            ? "TV"
            : "Movie";


        card.innerHTML = `

            <img
                src="${POSTER_URL}${item.poster_path}"
                alt="${title}"
                loading="lazy"
            >

            <div class="movie-info">

                <h3>
                    ${title}
                </h3>

                <p>
                    ⭐ ${
                        item.vote_average
                        ? item.vote_average.toFixed(1)
                        : "N/A"
                    }
                </p>

                <span class="type-badge">
                    ${type}
                </span>

            </div>

        `;


        card.addEventListener(
            "click",
            () => {

                openDetails(item);

            }
        );


        container.appendChild(card);

    });

}


// =====================================================
// OPEN MOVIE / TV DETAILS
// =====================================================

function openDetails(item){

    const title =
        item.title ||
        item.name ||
        "Unknown";


    const type =
        item.media_type === "tv"
        ? "tv"
        : "movie";


    movieDetails.innerHTML = `

        <div class="details-container">

            <img
                src="${POSTER_URL}${item.poster_path}"
                alt="${title}"
            >

            <div>

                <h2>
                    ${title}
                </h2>

                <p>
                    ⭐ Rating:
                    ${
                        item.vote_average
                        ? item.vote_average.toFixed(1)
                        : "N/A"
                    }
                </p>

                <p>
                    ${
                        item.overview ||
                        "No description available."
                    }
                </p>

                <button
                    class="trailer-button"
                    id="detailsTrailerButton"
                >

                    <i class="fa-solid fa-play"></i>

                    Watch Trailer

                </button>

            </div>

        </div>

    `;


    movieModal.style.display =
        "flex";


    const detailsTrailerButton =
        document.getElementById(
            "detailsTrailerButton"
        );


    detailsTrailerButton.addEventListener(
        "click",
        async () => {

            detailsTrailerButton.innerHTML =
                `<i class="fa-solid fa-spinner fa-spin"></i> Loading...`;


            const trailer =
                await getTrailer(
                    item.id,
                    type
                );


            detailsTrailerButton.innerHTML =
                `<i class="fa-solid fa-play"></i> Watch Trailer`;


            if(!trailer){

                alert(
                    "Sorry, no YouTube trailer was found."
                );

                return;
            }


            movieModal.style.display =
                "none";


            openTrailer(trailer);

        }
    );

}


// =====================================================
// SEARCH
// =====================================================

async function searchMovies(){

    const query =
        searchInput.value.trim();


    if(!query){

        searchTitle.textContent = "";

        searchResults.innerHTML = "";

        return;
    }


    searchTitle.textContent =
        `🔎 Search results for "${query}"`;


    searchResults.innerHTML = `

        <p class="loading">
            Searching...
        </p>

    `;


    try{

        const response = await fetch(

            `${BASE_URL}/search/multi` +

            `?api_key=${API_KEY}` +

            `&language=en-US` +

            `&query=${encodeURIComponent(query)}` +

            `&page=1`

        );


        const data =
            await response.json();


        const results =
            data.results.filter(item =>

                (
                    item.media_type === "movie" ||
                    item.media_type === "tv"
                ) &&

                item.poster_path

            );


        displayMovies(
            results,
            searchResults
        );


    }catch(error){

        console.error(
            "Search error:",
            error
        );


        searchResults.innerHTML = `

            <p class="loading">
                Search failed. Please try again.
            </p>

        `;

    }

}


// =====================================================
// SEARCH BUTTON
// =====================================================

searchBtn.addEventListener(
    "click",
    searchMovies
);


// =====================================================
// SEARCH ENTER KEY
// =====================================================

searchInput.addEventListener(
    "keydown",
    (event) => {

        if(event.key === "Enter"){

            searchMovies();

        }

    }
);


// =====================================================
// HIDE SEARCH RESULTS
// =====================================================

function clearSearch(){

    searchTitle.textContent = "";

    searchResults.innerHTML = "";

}


// =====================================================
// SHOW HOME
// =====================================================

homeLink.addEventListener(
    "click",
    (event) => {

        event.preventDefault();

        clearSearch();

        homeContent.style.display =
            "block";


        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    }
);


// =====================================================
// MOVIES ONLY
// =====================================================

moviesLink.addEventListener(
    "click",
    async (event) => {

        event.preventDefault();

        homeContent.style.display =
            "none";

        searchTitle.textContent =
            "🎬 All Movies";

        searchResults.innerHTML = `

            <p class="loading">
                Loading movies...
            </p>

        `;


        try{

            const response =
                await fetch(

                    `${BASE_URL}/discover/movie` +

                    `?api_key=${API_KEY}` +

                    `&language=en-US` +

                    `&sort_by=popularity.desc` +

                    `&page=1`

                );


            const data =
                await response.json();


            displayMovies(
                data.results,
                searchResults
            );


            scrollToSearchResults();


        }catch(error){

            console.error(error);

        }

    }
);


// =====================================================
// TV SHOWS ONLY
// =====================================================

tvLink.addEventListener(
    "click",
    async (event) => {

        event.preventDefault();

        homeContent.style.display =
            "none";

        searchTitle.textContent =
            "📺 Popular TV Shows";

        searchResults.innerHTML = `

            <p class="loading">
                Loading TV shows...
            </p>

        `;


        try{

            const response =
                await fetch(

                    `${BASE_URL}/tv/popular` +

                    `?api_key=${API_KEY}` +

                    `&language=en-US` +

                    `&page=1`

                );


            const data =
                await response.json();


            const tvResults =
                data.results.map(
                    item => ({

                        ...item,

                        media_type:"tv"

                    })
                );


            displayMovies(
                tvResults,
                searchResults
            );


            scrollToSearchResults();


        }catch(error){

            console.error(error);

        }

    }
);


// =====================================================
// ANIME ONLY
// =====================================================

animeLink.addEventListener(
    "click",
    async (event) => {

        event.preventDefault();

        homeContent.style.display =
            "none";

        searchTitle.textContent =
            "🎌 Popular Anime";

        searchResults.innerHTML = `

            <p class="loading">
                Loading anime...
            </p>

        `;


        try{

            /*
             * TMDB anime:
             * Animation genre = 16
             * Japanese original language
             */

            const response =
                await fetch(

                    `${BASE_URL}/discover/tv` +

                    `?api_key=${API_KEY}` +

                    `&language=en-US` +

                    `&with_genres=16` +

                    `&with_original_language=ja` +

                    `&sort_by=popularity.desc` +

                    `&page=1`

                );


            const data =
                await response.json();


            const animeResults =
                data.results.map(
                    item => ({

                        ...item,

                        media_type:"tv"

                    })
                );


            displayMovies(
                animeResults,
                searchResults
            );


            scrollToSearchResults();


        }catch(error){

            console.error(
                "Anime error:",
                error
            );

        }

    }
);


// =====================================================
// TRENDING ONLY
// =====================================================

trendingLink.addEventListener(
    "click",
    async (event) => {

        event.preventDefault();

        homeContent.style.display =
            "none";

        searchTitle.textContent =
            "🔥 Trending Movies";

        searchResults.innerHTML = `

            <p class="loading">
                Loading trending movies...
            </p>

        `;


        try{

            const response =
                await fetch(

                    `${BASE_URL}/trending/movie/week` +

                    `?api_key=${API_KEY}`

                );


            const data =
                await response.json();


            displayMovies(
                data.results,
                searchResults
            );


            scrollToSearchResults();


        }catch(error){

            console.error(
                "Trending error:",
                error
            );

        }

    }
);


// =====================================================
// SCROLL TO SEARCH RESULTS
// =====================================================

function scrollToSearchResults(){

    setTimeout(() => {

        document
            .getElementById("searchArea")
            .scrollIntoView({
                behavior:"smooth",
                block:"start"
            });

    },100);

}


// =====================================================
// START WEBSITE
// =====================================================

loadHeroMovies();

loadTrendingMovies();

loadPopularMovies();

loadAnimeMovies();


// =====================================================
// HOME: TRENDING
// =====================================================

async function loadTrendingMovies(){

    try{

        const response =
            await fetch(

                `${BASE_URL}/trending/movie/week` +

                `?api_key=${API_KEY}`

            );


        const data =
            await response.json();


        displayMovies(
            data.results,
            document.getElementById(
                "trendingMovies"
            )
        );


    }catch(error){

        console.error(
            "Trending home error:",
            error
        );

    }

}


// =====================================================
// HOME: POPULAR MOVIES
// =====================================================

async function loadPopularMovies(){

    try{

        const response =
            await fetch(

                `${BASE_URL}/movie/popular` +

                `?api_key=${API_KEY}` +

                `&language=en-US` +

                `&page=1`

            );


        const data =
            await response.json();


        displayMovies(
            data.results,
            document.getElementById(
                "popularMovies"
            )
        );


    }catch(error){

        console.error(
            "Popular movie error:",
            error
        );

    }

}


// =====================================================
// HOME: POPULAR ANIME
// =====================================================

async function loadAnimeMovies(){

    try{

        const response =
            await fetch(

                `${BASE_URL}/discover/tv` +

                `?api_key=${API_KEY}` +

                `&language=en-US` +

                `&with_genres=16` +

                `&with_original_language=ja` +

                `&sort_by=popularity.desc` +

                `&page=1`

            );


        const data =
            await response.json();


        const animeResults =
            data.results.map(
                item => ({

                    ...item,

                    media_type:"tv"

                })
            );


        displayMovies(
            animeResults,
            document.getElementById(
                "animeMovies"
            )
        );


    }catch(error){

        console.error(
            "Anime home error:",
            error
        );

    }

}









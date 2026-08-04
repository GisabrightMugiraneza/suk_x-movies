const API_KEY = "27d7234cc0a8643d0b6d28fa1a7517aa";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

const trending = document.getElementById("trendingMovies");
const popular = document.getElementById("popularMovies");
const anime = document.getElementById("animeMovies");
const searchResults = document.getElementById("searchResults");

const featuredTitle = document.getElementById("featuredTitle");
const featuredOverview = document.getElementById("featuredOverview");

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("movieModal");
const details = document.getElementById("movieDetails");

document.querySelector(".close").onclick = () => {
modal.style.display = "none";
}

window.onclick = e=>{
if(e.target===modal){
modal.style.display="none";
}
}

async function getMovies(url,container){

const res = await fetch(url);

const data = await res.json();

container.innerHTML="";

data.results.forEach(movie=>{

container.innerHTML += `

<div class="movie-card"
onclick="showMovie(${movie.id})">

<img src="${IMG+movie.poster_path}">

<div class="movie-info">

<h3>${movie.title || movie.name}</h3>

<p>${movie.release_date || movie.first_air_date}</p>

<div class="rating">

⭐ ${movie.vote_average.toFixed(1)}

</div>

</div>

</div>

`;

});

}

async function featuredMovie(){

const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);

const data = await res.json();

const movie = data.results[0];

featuredTitle.innerHTML=movie.title;

featuredOverview.innerHTML=movie.overview;

document.querySelector(".hero").style.backgroundImage=

`url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

}

featuredMovie();

getMovies(

`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,

trending

);

getMovies(

`${BASE_URL}/movie/popular?api_key=${API_KEY}`,

popular

);

getMovies(

`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16`,

anime

);

searchBtn.onclick = ()=>{

const q = searchInput.value;

if(q==="") return;

getMovies(

`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${q}`,

searchResults

);

}

async function showMovie(id){

const res = await fetch(

`${BASE_URL}/movie/${id}?api_key=${API_KEY}`

);

const movie = await res.json();

const videoRes = await fetch(

`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`

);

const videos = await videoRes.json();

let trailer="";

const found = videos.results.find(

v=>v.site==="YouTube" && v.type==="Trailer"

);

if(found){

trailer=`

<iframe

src="https://www.youtube.com/embed/${found.key}"

allowfullscreen>

</iframe>

`;

}

details.innerHTML=`

<h1>${movie.title}</h1>

<p>${movie.overview}</p>

<br>

<p>

⭐ ${movie.vote_average}

</p>

<br>

${trailer}

`;

modal.style.display="flex";

}









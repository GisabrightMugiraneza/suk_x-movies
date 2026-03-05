const apiKey = "27d7234cc0a8643d0b6d28fa1a7517aa";

async function searchMovies(){

let query = document.getElementById("searchInput").value;

let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

let response = await fetch(url);
let data = await response.json();

let moviesDiv = document.getElementById("movies");
moviesDiv.innerHTML = "";

data.results.forEach(movie => {

let poster = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

moviesDiv.innerHTML += `
<div class="movie">
<img src="${poster}">
<h3>${movie.title}</h3>
<p>⭐ ${movie.vote_average}</p>
<button onclick="watchTrailer(${movie.id})">Watch Trailer</button>
</div>
`;
  sync function watchTrailer(movieId){

let url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;

let response = await fetch(url);
let data = await response.json();

let trailer = data.results.find(video => video.type === "Trailer");

if(trailer){

let youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;

window.open(youtubeUrl);

}else{

alert("Trailer not available");
}
  }
});


}

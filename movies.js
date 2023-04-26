/* Script to display data using the OCMovies-API-EN-FR */

let displayNumber = 4;
/* define carroussel size display for various screen configuaration */
let smallScreen = window.matchMedia("screen and (max-width: 660px)");
let mediumScreen = window.matchMedia("screen and (max-width: 900px)");
let largeScreen = window.matchMedia("screen and (max-width: 1150px)");
let xLargeScreen = window.matchMedia("screen and (max-width: 1300px)");

if (smallScreen.matches) {
    displayNumber = 1;
} else if (mediumScreen.matches) {
    displayNumber = 2;
} else if (largeScreen.matches) {
    displayNumber = 3;
} else if (xLargeScreen.matches) {
    displayNumber = 4;
}

function displayCategory(start, moviesList, category) {
    /* Display displayNumber movies from the movieList starting from start
      in the category zone */
      category.innerText = "";
      let end = start + displayNumber;

      for (let i = start; i < end; i++) {
        let movieArticle = document.createElement("article");
        movieArticle.classList.add("movie-poster");
        let imageMovie = document.createElement("img");
        imageMovie.src = moviesList[i].image_url;
        imageMovie.alt = moviesList[i].title;
        imageMovie.onclick = function () {
            modal.style.display = "block";
            displayMovieInfo(moviesList[i].url);
        
        }
        movieArticle.appendChild(imageMovie);
        category.appendChild(movieArticle);

    }
}

async function displayBestFilm() {
    // display the best film retrieving it from local storage
    let bestFilm = JSON.parse(window.localStorage.getItem("bestFilm"));
    let query = await fetch(bestFilm.url);
    let jsonQuery = await query.json();
    let sectionBestFilm = document.querySelector("#best-film");
    let moviePoster = document.createElement("div");
    moviePoster.classList.add("BF-poster");
    let movieInfos = document.createElement("div");
    movieInfos.classList.add("BF-infos");
    let nameMovie = document.createElement("h1");
    nameMovie.innerText = bestFilm.title;
    let descriptionMovie = document.createElement("p");
    descriptionMovie.innerText = jsonQuery.description;
    movieInfos.classList.add("BF-infos-text");
    let imageMovie = document.createElement("img");
    imageMovie.src = bestFilm.image_url;
    imageMovie.alt = bestFilm.title;
    // informations button creation
    let infoButton = document.createElement("button");
    infoButton.innerText = "Informations";
    infoButton.id = "BestFilmBtn";
    // When the user clicks on the button, open the modal
    infoButton.onclick = function () {
        modal.style.display = "block";
        displayMovieInfo(bestFilm.url)
    }
    movieInfos.appendChild(nameMovie);
    movieInfos.appendChild(descriptionMovie);
    movieInfos.appendChild(infoButton);
    moviePoster.appendChild(imageMovie);
    sectionBestFilm.appendChild(moviePoster);
    sectionBestFilm.appendChild(movieInfos);
}

async function retrieveMoviesList(url, category) {
    /* retrieve the data from the url and concatenante them with the one stored
       in the local storage */
    let query = await fetch(url);
    let jsonQuery = await query.json();
    let moviesList = jsonQuery.results;
    let nextUrl = jsonQuery.next;
    let urlLabel = category +"url";
    if (category == "best-films"){
        let bestFilm = moviesList.shift();
        window.localStorage.setItem("bestFilm", JSON.stringify(bestFilm));
    }
    window.localStorage.setItem(urlLabel, JSON.stringify(nextUrl));
    window.localStorage.setItem(category, JSON.stringify(moviesList));
}

async function updateMoviesList(category) {
    /* retrieve the data from the url and concatenante them with the one stored
       in the local storage */
    let urlLabel = category +"url";
    let nextUrl = JSON.parse(window.localStorage.getItem(urlLabel));
    let prevMoviesList = JSON.parse(window.localStorage.getItem(category));
    let query = await fetch(nextUrl);
    let jsonQuery = await query.json();
    let newMoviesList = prevMoviesList.concat(jsonQuery.results);
    nextUrl = jsonQuery.next;
    window.localStorage.setItem(urlLabel, JSON.stringify(nextUrl));
    window.localStorage.setItem(category, JSON.stringify(newMoviesList));
}

async function categoryRightButtonHandling(category, startItem, selector) {
    /* handle the right button for the carroussel */
    let moviesList = JSON.parse(window.localStorage.getItem(category));
    let start = JSON.parse(window.localStorage.getItem(startItem));

    if ((start + displayNumber) == moviesList.length) {
        // there is not enough films in the list retrieve more films 
        await updateMoviesList(category);
        moviesList = JSON.parse(window.localStorage.getItem(category));
    }

    // switch the films displayed from one to the right */ 
    start += 1;
    let sectionCategory = document.querySelector(selector);
    sectionCategory.textContent = "";
    displayCategory(start, moviesList, sectionCategory);
    window.localStorage.setItem(startItem, JSON.stringify(start));
}

function categoryLeftButtonHandling(category, startItem, selector) {
    /* handle the lfht button for the carroussel */
    let moviesList = JSON.parse(window.localStorage.getItem(category));
    let start = JSON.parse(window.localStorage.getItem(startItem));

    if (start > 0) {
        /* if there is still place switch the films displayed from one to the left */ 
        start -= 1;
        let sectionCategory = document.querySelector(selector);
        sectionCategory.textContent = "";
        displayCategory(start, moviesList, sectionCategory);
        window.localStorage.setItem(startItem, JSON.stringify(start));
    }
}

async function displayMovieInfo(url) {
    /* display the movie info in the modal */ 
    let query = await fetch(url);
    let jsonQuery = await query.json();
    // get the modal
    let modalPoster = document.querySelector(".modal-movie-poster");
    modalPoster.textContent = "";
    let modalInfos = document.querySelector(".modal-movie-info");
    modalInfos.textContent = "";
    // set the poster
    let imageMovie = document.createElement("img");
    imageMovie.src = jsonQuery.image_url;
    imageMovie.alt = jsonQuery.title;
    modalPoster.appendChild(imageMovie);
    // display the informations
    let movieInfos = document.createElement("article");
    let nameMovie = document.createElement("h3");
    nameMovie.innerText = jsonQuery.title;
    let genresMovie = document.createElement("p");
    let genres = "";
    for (let genre of jsonQuery.genres) {
        genres = genres + genre + ", ";
    }
    genres = genres.slice(0, -2);
    genresMovie.innerText = `Genres : ${genres}`;
    let dateMovie = document.createElement("p");
    dateMovie.innerText = "Date de sortie : " + jsonQuery.date_published;
    let ratedMovie = document.createElement("p");
    ratedMovie.innerText = "Rated : " + jsonQuery.rated;
    let imdbMovie = document.createElement("p");
    imdbMovie.innerText = "Score Imdb : " + jsonQuery.imdb_score;
    let directorsMovie = document.createElement("p");
    directorsMovie.innerText = "Réalisateur : " + jsonQuery.directors;
    let actorsMovie = document.createElement("p");
    let actors = "";
    for (let actor of jsonQuery.actors) {
        actors = actors + actor + ", ";
    }
    actors = actors.slice(0, -2);
    actorsMovie.innerText = "Acteurs : " + actors;
    let durationMovie = document.createElement("p");
    durationMovie.innerText = "Durée : " + jsonQuery.duration + " min";
    let countryMovie = document.createElement("p");
    countryMovie.innerText = `Pays d'origine : ${jsonQuery.countries}`;
    let boxOfficeMovie = document.createElement("p");
    boxOfficeMovie.innerText = `Résultat au Box Office : ${jsonQuery.worldwide_gross_income ?? "inconnu"}
                                ${(jsonQuery.worldwide_gross_income == null ? " " : " USD")}`;
    let descriptionMovie = document.createElement("p");
    descriptionMovie.innerText = "Résumé : " + jsonQuery.description;


     
    movieInfos.appendChild(nameMovie);
    movieInfos.appendChild(genresMovie);
    movieInfos.appendChild(dateMovie);
    movieInfos.appendChild(ratedMovie);
    movieInfos.appendChild(imdbMovie);
    movieInfos.appendChild(directorsMovie);
    movieInfos.appendChild(actorsMovie);
    movieInfos.appendChild(durationMovie);
    movieInfos.appendChild(countryMovie);
    movieInfos.appendChild(boxOfficeMovie);
    movieInfos.appendChild(descriptionMovie);
    modalInfos.appendChild(movieInfos);
}

function displayAllCategory(){
    /* display all the category in the carrousel */    
    let moviesList = JSON.parse(window.localStorage.getItem("best-films"));
    let sectionCategory = document.querySelector("#other-best-films");
    let BFStart = JSON.parse(window.localStorage.getItem("BFStart"));
    displayCategory(BFStart, moviesList, sectionCategory);

    /* display category 1 */
    moviesList = JSON.parse(window.localStorage.getItem("category1"));
    sectionCategory = document.querySelector("#category1");
    let cat1Start = JSON.parse(window.localStorage.getItem("cat1Start"));
    displayCategory(cat1Start, moviesList, sectionCategory);

    /* display category 2 */
    moviesList = JSON.parse(window.localStorage.getItem("category2"));
    sectionCategory = document.querySelector("#category2");
    let cat2Start = JSON.parse(window.localStorage.getItem("cat1Start"));
    displayCategory(cat2Start, moviesList, sectionCategory);

    /* display category 3 */
    moviesList = JSON.parse(window.localStorage.getItem("category3"));
    sectionCategory = document.querySelector("#category3");
    let cat3Start = JSON.parse(window.localStorage.getItem("cat1Start"));
    displayCategory(cat3Start, moviesList, sectionCategory);
}

/* side navigatin for small screen handling */
/* Set the width of the side navigation to 250px to display it */
function openNav() {
  sidenav.classList.add("active");
}

/* Set the width of the side navigation to 0 to hide it*/
function closeNav() {
  sidenav.classList.remove("active");
}

/* retrieve data from database and store in local storage*/
let url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,title";
retrieveMoviesList(url, "best-films");
window.localStorage.setItem("BFStart", JSON.stringify(0));


url = "http://localhost:8000/api/v1/titles/?genre=Sci-Fi&sort_by=-imdb_score,title";
retrieveMoviesList(url, "category1");
window.localStorage.setItem("cat1Start", JSON.stringify(0));

url = "http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score,title";
retrieveMoviesList(url, "category2");
window.localStorage.setItem("cat2Start", JSON.stringify(0));

url = "http://localhost:8000/api/v1/titles/?genre=Adventure&sort_by=-imdb_score,title";
retrieveMoviesList(url, "category3");
window.localStorage.setItem("cat3Start", JSON.stringify(0));

// display the Best film informations
displayBestFilm();
// display the categories
displayAllCategory();

/* Best Films category right button handling */
let navBtnBFRight = document.querySelector(".btn.BF-right");
navBtnBFRight.addEventListener("click", async function (event) {
    categoryRightButtonHandling("best-films", "BFStart", "#other-best-films");
})

/* Best Films category left button handling */
let navBtnBFLeft = document.querySelector(".btn.BF-left");
navBtnBFLeft.addEventListener("click", async function (event) {
    categoryLeftButtonHandling("best-films", "BFStart", "#other-best-films");
})

/* Category1 right button handling */
let navBtnCat1Right = document.querySelector(".btn.Cat1-right");
navBtnCat1Right.addEventListener("click", async function (event) {
    categoryRightButtonHandling("category1", "cat1Start", "#category1");
})

/* Category1 left button handling */
let navBtnCat1Left = document.querySelector(".btn.Cat1-left");
navBtnCat1Left.addEventListener("click", async function (event) {
    categoryLeftButtonHandling("category1", "cat1Start", "#category1");
})

// Category2 right button handling
let navBtnCat2Right = document.querySelector(".btn.Cat2-right");
navBtnCat2Right.addEventListener("click", async function (event) {
    categoryRightButtonHandling("category2", "cat2Start", "#category2");
})

// Category2 left button handling
let navBtnCat2Left = document.querySelector(".btn.Cat2-left");
navBtnCat2Left.addEventListener("click", async function (event) {
    categoryLeftButtonHandling("category2", "cat2Start", "#category2");
})

// Category3 right button handling
let navBtnCat3Right = document.querySelector(".btn.Cat3-right");
navBtnCat3Right.addEventListener("click", async function (event) {
    categoryRightButtonHandling("category3", "cat3Start", "#category3");
})

// Category3 left button handling
let navBtnCat3Left = document.querySelector(".btn.Cat3-left");
navBtnCat3Left.addEventListener("click", async function (event) {
    categoryLeftButtonHandling("category3", "cat3Start", "#category3");
})

/* listener to detect chnages in screen size and
   change the number of films dispalyed in carroussel */
smallScreen.addEventListener("change", function(event){
    displayNumber = 1;
    displayAllCategory();
})
mediumScreen.addEventListener("change", function(event){
    displayNumber = 2;
    displayAllCategory();
})

largeScreen.addEventListener("change", function(event){
    displayNumber = 3;
    displayAllCategory();
})

xLargeScreen.addEventListener("change", function(event){
    displayNumber = 4;
    displayAllCategory();
})

// movie informations modal handling
// Get the modal
let modal = document.getElementById("movieModal");

// Get the button that opens the modal
let btn = document.getElementById("BestFilmBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("modal-close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// burger menu handling
let sidenav = document.getElementById("mySidenav");
let openBtn = document.getElementById("openBtn");
let closeBtn = document.getElementById("closeBtn");

openBtn.onclick = openNav;
closeBtn.onclick = closeNav;
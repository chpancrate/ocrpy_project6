function displayCategory(start, moviesList, category) {
    /* Display 4 movies from the movieList starting from start
      in the category zone */
    var end = start + 4;

    for (let i = start; i < end; i++) {
        let movieArticle = document.createElement("article")
        let nameMovie = document.createElement("p");
        nameMovie.innerText = moviesList[i].title;
        let imageMovie = document.createElement("img");
        imageMovie.src = moviesList[i].image_url;
        imageMovie.onclick = function () {
            modal.style.display = "block";
            displayMovieInfo(moviesList[i].url)
        
        }
        /*console.log("Dcat", i);*/
        movieArticle.appendChild(nameMovie);
        movieArticle.appendChild(imageMovie);
        category.appendChild(movieArticle);

    }
}

function displayBestFilm(movieList) {
    /* display the best film */
    /*console.log("BF:", movieList[0])*/
    const sectionBestFilm = document.querySelector("#best_film");
    const movieArticle = document.createElement("article")
    const nameMovie = document.createElement("p");
    nameMovie.innerText = movieList[0]["title"];
    const imageMovie = document.createElement("img");
    imageMovie.src = movieList[0].image_url
    const infoButton = document.createElement("button");
    infoButton.innerText = "Informations";
    infoButton.id = "BestFilmBtn";
    // When the user clicks on the button, open the modal
    infoButton.onclick = function () {
        modal.style.display = "block";
        displayMovieInfo(movieList[0].url)
    }
    movieArticle.appendChild(nameMovie);
    movieArticle.appendChild(imageMovie);
    movieArticle.appendChild(infoButton);
    sectionBestFilm.appendChild(movieArticle);
}

async function retrieveMoviesList(url, url2, category) {
    let query = await fetch(url);
    let jsonQuery = await query.json();
    let movies1 = jsonQuery.results;
    let query2 = await fetch(url2)
    let jsonQuery2 = await query2.json();
    let movies2 = jsonQuery2.results;
    let moviesList = movies1.concat(movies2)
    /*console.log(typeof category);
    console.log(typeof moviesList);
    console.log(category, moviesList);*/
    window.localStorage.setItem(category, JSON.stringify(moviesList));
}

function categoryRightButtonHandling(category, startItem, selector) {
    let moviesList = JSON.parse(window.localStorage.getItem(category))
    let start = JSON.parse(window.localStorage.getItem(startItem))

    if (start < 6) {
        start += 1
        let sectionCategory = document.querySelector(selector);
        sectionCategory.textContent = ""
        displayCategory(start, moviesList, sectionCategory);
        window.localStorage.setItem(startItem, JSON.stringify(start))
    }
}

function categoryLeftButtonHandling(category, startItem, selector) {
    let moviesList = JSON.parse(window.localStorage.getItem(category))
    let start = JSON.parse(window.localStorage.getItem(startItem))

    if (start > 0) {
        start -= 1
        let sectionCategory = document.querySelector(selector);
        sectionCategory.textContent = ""
        displayCategory(start, moviesList, sectionCategory);
        window.localStorage.setItem(startItem, JSON.stringify(start))
    }
}

async function displayMovieInfo(url) {
    let query = await fetch(url);
    let jsonQuery = await query.json();
    console.log(jsonQuery)
    // get the modal
    const modal = document.querySelector(".movie-info");
    modal.textContent = ""

    const movieInfos = document.createElement("article");
    const imageMovie = document.createElement("img");
    imageMovie.src = jsonQuery.image_url;
    const nameMovie = document.createElement("p");
    nameMovie.innerText = `Titre : ${jsonQuery.title}`;
    const genresMovie = document.createElement("p")
    let genres = "";
    for (let genre of jsonQuery.genres) {
        genres = genres + genre + ", ";
    }
    genres = genres.slice(0, -2);
    genresMovie.innerText = `Genres : ${genres}`;
    const dateMovie = document.createElement("p");
    dateMovie.innerText = "Date de sortie : " + jsonQuery.date_published;
    const ratedMovie = document.createElement("p");
    ratedMovie.innerText = "Rated : " + jsonQuery.rated;
    const imdbMovie = document.createElement("p");
    imdbMovie.innerText = "Score Imdb : " + jsonQuery.imdb_score;
    const directorsMovie = document.createElement("p");
    directorsMovie.innerText = "Réalisateur : " + jsonQuery.directors;
    const actorsMovie = document.createElement("p");
    let actors = ""
    for (let actor of jsonQuery.actors) {
        actors = actors + actor + ", ";
    }
    actors = actors.slice(0, -2);
    actorsMovie.innerText = "Acteurs : " + actors;
    const durationMovie = document.createElement("p");
    durationMovie.innerText = "Durée : " + jsonQuery.duration + " min";
    const countryMovie = document.createElement("p");
    countryMovie.innerText = `Pays d'origine : ${jsonQuery.countries}`;
    const boxOfficeMovie = document.createElement("p");
    boxOfficeMovie.innerText = `Résultat au Box Office : ${jsonQuery.worldwide_gross_income ?? "inconnu"}
                                ${(jsonQuery.worldwide_gross_income == null ? " " : " USD")}`;
    const descriptionMovie = document.createElement("p");
    descriptionMovie.innerText = "Résumé : " + jsonQuery.description;

    movieInfos.appendChild(imageMovie);
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
    modal.appendChild(movieInfos);
}

/* retrieve data from database and store in local storage*/
let url1 = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,title";
let url2 = "http://localhost:8000/api/v1/titles/?page=2&sort_by=-imdb_score%2Ctitle";
retrieveMoviesList(url1, url2, "best_films");
window.localStorage.setItem("BFStart", JSON.stringify(1));


url1 = "http://localhost:8000/api/v1/titles/?genre=Sci-Fi&sort_by=-imdb_score,title";
url2 = "http://localhost:8000/api/v1/titles/?genre=Sci-Fi&page=2&sort_by=-imdb_score%2Ctitle";
retrieveMoviesList(url1, url2, "category1");
window.localStorage.setItem("cat1Start", JSON.stringify(0));

url1 = "http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score,title";
url2 = "http://localhost:8000/api/v1/titles/?genre=Comedy&page=2&sort_by=-imdb_score%2Ctitle";
retrieveMoviesList(url1, url2, "category2");
window.localStorage.setItem("cat2Start", JSON.stringify(0));

url1 = "http://localhost:8000/api/v1/titles/?genre=Adventure&sort_by=-imdb_score,title";
url2 = "http://localhost:8000/api/v1/titles/?genre=Adventure&page=2&sort_by=-imdb_score%2Ctitle";
retrieveMoviesList(url1, url2, "category3");
window.localStorage.setItem("cat3Start", JSON.stringify(0));

/* display Bests films*/
let moviesList = JSON.parse(window.localStorage.getItem("best_films"))
displayBestFilm(moviesList);

let sectionCategory = document.querySelector("#other_best_films");
let BFStart = JSON.parse(window.localStorage.getItem("BFStart"))
displayCategory(BFStart, moviesList, sectionCategory);

/* display category 1 */
moviesList = JSON.parse(window.localStorage.getItem("category1"))
/*console.log("cat1", moviesList)*/
sectionCategory = document.querySelector("#category1");
let cat1Start = JSON.parse(window.localStorage.getItem("cat1Start"))
displayCategory(cat1Start, moviesList, sectionCategory)

/* display category 2 */
moviesList = JSON.parse(window.localStorage.getItem("category2"))
sectionCategory = document.querySelector("#category2");
let cat2Start = JSON.parse(window.localStorage.getItem("cat1Start"))
displayCategory(cat2Start, moviesList, sectionCategory)

/* display category 3 */
moviesList = JSON.parse(window.localStorage.getItem("category3"))
sectionCategory = document.querySelector("#category3");
let cat3Start = JSON.parse(window.localStorage.getItem("cat1Start"))
displayCategory(cat3Start, moviesList, sectionCategory)

/* Best Films category right button handling */
let navBtnBFRight = document.querySelector(".btn.BF-right");
navBtnBFRight.addEventListener("click", async function (event) {
    let moviesList = JSON.parse(window.localStorage.getItem("best_films"))
    let start = JSON.parse(window.localStorage.getItem("BFStart"))

    if (start < 6) {
        start += 1
        let sectionCategory = document.querySelector("#other_best_films");
        sectionCategory.textContent = ""
        displayCategory(start, moviesList, sectionCategory);
        window.localStorage.setItem("BFStart", JSON.stringify(start))
    }
})

/* Best Films category left button handling */
let navBtnBFLeft = document.querySelector(".btn.BF-left");
navBtnBFLeft.addEventListener("click", async function (event) {
    let moviesList = JSON.parse(window.localStorage.getItem("best_films"))
    let start = JSON.parse(window.localStorage.getItem("BFStart"))

    if (start > 1) {
        start -= 1
        let sectionCategory = document.querySelector("#other_best_films");
        sectionCategory.textContent = ""
        displayCategory(start, moviesList, sectionCategory);
        window.localStorage.setItem("BFStart", JSON.stringify(start))
    }
})

/* Category1 right button handling */
let navBtnCat1Right = document.querySelector(".btn.Cat1-right");
navBtnCat1Right.addEventListener("click", async function (event) {
    categoryRightButtonHandling("category1", "cat1Start", "#category1")
})

/* Category1 left button handling */
let navBtnCat1Left = document.querySelector(".btn.Cat1-left");
navBtnCat1Left.addEventListener("click", async function (event) {
    categoryLeftButtonHandling("category1", "cat1Start", "#category1")
})

// Category2 right button handling
let navBtnCat2Right = document.querySelector(".btn.Cat2-right");
navBtnCat2Right.addEventListener("click", async function (event) {
    categoryRightButtonHandling("category2", "cat2Start", "#category2")
})

// Category2 left button handling
let navBtnCat2Left = document.querySelector(".btn.Cat2-left");
navBtnCat2Left.addEventListener("click", async function (event) {
    categoryLeftButtonHandling("category2", "cat2Start", "#category2")
})

// Category3 right button handling
let navBtnCat3Right = document.querySelector(".btn.Cat3-right");
navBtnCat3Right.addEventListener("click", async function (event) {
    categoryRightButtonHandling("category3", "cat3Start", "#category3")
})

// Category3 left button handling
let navBtnCat3Left = document.querySelector(".btn.Cat3-left");
navBtnCat3Left.addEventListener("click", async function (event) {
    categoryLeftButtonHandling("category3", "cat3Start", "#category3")
})

// Get the modal
let modal = document.getElementById("movieModal");

// Get the button that opens the modal
let btn = document.getElementById("BestFilmBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
/*btn.onclick = function () {
    modal.style.display = "block";
    displayMovieInfo("http://localhost:8000/api/v1/titles/1508669")

}*/

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
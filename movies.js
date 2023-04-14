function displayCategory(start, moviesList, category) {
    /* Display 4 movies from the movieList starting from start
      in the category zone */
    var end = start + 4;
    /* the list has only 10 items */
    /*
    if (end > 9) {
        end = 9;
        start = 6; 
    }
    */
    for (let i = start; i < end; i++) {
        let movieArticle = document.createElement("article")
        let nameMovie = document.createElement("p");
        nameMovie.innerText = moviesList[i].title;
        let imageMovie = document.createElement("img");
        imageMovie.src = moviesList[i].image_url;
        console.log("Dcat", i);
        movieArticle.appendChild(nameMovie);
        movieArticle.appendChild(imageMovie);
        category.appendChild(movieArticle);

    }
}


function displayBestFilm(movieList) {
    /* display the best film */
    console.log("BF:", movieList[0])
    const sectionBestFilm = document.querySelector("#best_film");
    const movieArticle = document.createElement("article")
    const nameMovie = document.createElement("p");
    nameMovie.innerText = movieList[0]["title"];
    const imageMovie = document.createElement("img");
    imageMovie.src = movieList[0].image_url
    movieArticle.appendChild(nameMovie);
    movieArticle.appendChild(imageMovie);
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
    console.log(typeof category);
    console.log(typeof moviesList);
    console.log(category, moviesList);
    window.localStorage.setItem(category, JSON.stringify(moviesList));
}

/* retrieve data from database and store in local storage*/
let url1 = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,title";
let url2 = "http://localhost:8000/api/v1/titles/?Page=2&sort_by=-imdb_score,title";
retrieveMoviesList(url1, url2, "best_films");

url1 = "http://localhost:8000/api/v1/titles/?genre=Sci-Fi&sort_by=-imdb_score,title";
url2 = "http://localhost:8000/api/v1/titles/?Page=2&genre=Sci-Fi&sort_by=-imdb_score,title";
retrieveMoviesList(url1, url2, "category1");

url1 = "http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score,title";
url2 = "http://localhost:8000/api/v1/titles/?Page=2&genre=Comedy&sort_by=-imdb_score,title";
retrieveMoviesList(url1, url2, "category2");

url1 = "http://localhost:8000/api/v1/titles/?genre=Adventure&sort_by=-imdb_score,title";
url2 = "http://localhost:8000/api/v1/titles/?Page=2&genre=Adventure&sort_by=-imdb_score,title";
retrieveMoviesList(url1, url2, "category3");

/* display Bests films*/
let moviesList = JSON.parse(window.localStorage.getItem("best_films"))
displayBestFilm(moviesList);

let sectionCategory = document.querySelector("#other_best_films");
displayCategory(1, moviesList, sectionCategory);

/* display category 1 */
moviesList = JSON.parse(window.localStorage.getItem("category1"))
console.log("cat1", moviesList)
sectionCategory = document.querySelector("#category1");
displayCategory(0, moviesList, sectionCategory)

/* display category 2 */
moviesList = JSON.parse(window.localStorage.getItem("category2"))
sectionCategory = document.querySelector("#category2");
displayCategory(0, moviesList, sectionCategory)

/* display category 3 */
moviesList = JSON.parse(window.localStorage.getItem("category3"))
sectionCategory = document.querySelector("#category3");
displayCategory(0, moviesList, sectionCategory)


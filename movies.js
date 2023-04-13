/*
const query = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,title");
const jsonQuery = await query.json();
const movies = jsonQuery.results
console.log(movies);
*/

function displayCategory(start, moviesList, category){
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


function displayBestFilm(movieList){
    /* display the best film */
    const sectionBestFilm = document.querySelector("#best_film");
    const movieArticle = document.createElement("article")
    const nameMovie = document.createElement("p");
    nameMovie.innerText = movieList[0].title;
    const imageMovie = document.createElement("img");
    imageMovie.src = movieList[0].image_url
    movieArticle.appendChild(nameMovie);
    movieArticle.appendChild(imageMovie);
    sectionBestFilm.appendChild(movieArticle);
}

async function retrieveMoviesList(url, url2, category){
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
    if (category === "#best_film"){
        displayBestFilm(moviesList);
        const sectionOtherBestFilms = document.querySelector("#other_best_films");
        displayCategory(1, moviesList, sectionOtherBestFilms);
    }else{
        console.log(typeof category);
        console.log(category);
        const sectionCategory = document.querySelector(category);
        displayCategory(0, moviesList, sectionCategory)
    }
}

/* display the best films */
let url1="http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,title";
let url2="http://localhost:8000/api/v1/titles/?Page=2&sort_by=-imdb_score,title";
retrieveMoviesList(url1, url2, "#best_film");

/* display category 1 */
url1="http://localhost:8000/api/v1/titles/?genre=Sci-Fi&sort_by=-imdb_score,title";
url2="http://localhost:8000/api/v1/titles/?Page=2&genre=Sci-Fi&sort_by=-imdb_score,title";
retrieveMoviesList(url1, url2, "#category1");

/* display category 2 */
url1="http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score,title";
url2="http://localhost:8000/api/v1/titles/?Page=2&genre=Comedy&sort_by=-imdb_score,title";
retrieveMoviesList(url1, url2, "#category2");

/* display category 3 */
url1="http://localhost:8000/api/v1/titles/?genre=Adventure&sort_by=-imdb_score,title";
url2="http://localhost:8000/api/v1/titles/?Page=2&genre=Adventure&sort_by=-imdb_score,title";
retrieveMoviesList(url1, url2, "#category3");


/*
const cat1Query = await fetch("http://localhost:8000/api/v1/titles/?genre=Sci-Fi&sort_by=-imdb_score,title");
const jsonCat1Query = await cat1Query.json();
const cat1Movies = jsonCat1Query.results
console.log(cat1Movies);
const sectionCategory1 = document.querySelector("#category1");
displayCategory(0, cat1Movies, sectionCategory1)

const cat2Query = await fetch("http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score,title");
const jsonCat2Query = await cat2Query.json();
const cat2Movies = jsonCat2Query.results
console.log(cat2Movies);
const sectionCategory2 = document.querySelector("#category2");
displayCategory(0, cat2Movies, sectionCategory2)

const cat3Query = await fetch("http://localhost:8000/api/v1/titles/?genre=Adventure&sort_by=-imdb_score,title");
const jsonCat3Query = await cat3Query.json();
const cat3Movies = jsonCat3Query.results
console.log(cat3Movies);
const sectionCategory3 = document.querySelector("#category3");
displayCategory(1, cat3Movies, sectionCategory3)
*/
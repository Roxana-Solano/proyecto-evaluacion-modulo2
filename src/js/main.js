"use strict";

const buttonSerch = document.querySelector(".js_bntSerch");
const buttonReset = document.querySelector(".js_bntReset");
const seriesList = document.querySelector(".js_serieslist");
const inputSearch = document.querySelector(".js_inputSearch");
const seriesFavorite = document.querySelector(".js_seriesfavorite");
const containerFavorite = document.querySelector(".lisfavorite");
const containerSerie = document.querySelector(".lisresul");
const buttonLog = document.querySelector(".js_bntlog");
const favorite = [];

//escucho el click del boton buscar
function buttonSearch() {
  buttonSerch.addEventListener("click", (ev) => {
    ev.preventDefault();

    const valueInputSearch = inputSearch.value;
    if (valueInputSearch === "") {
      seriesList.innerHTML = `<p> No hay resultados </p>`;
    } else {
      requestApi(valueInputSearch);
    }
  });
}

function requestApi(name) {
  fetch(`https://api.jikan.moe/v4/anime?q=${name}`)
    .then((response) => response.json())
    .then((data) => renderData(data.data));
}

function renderData(data) {
  seriesList.innerHTML = ""; //limpia la lista
  containerSerie.classList.remove("hidden");
  for (const anime of data) {
    const title = anime.title;
    let image = anime.images.jpg.image_url;
    const id = anime.mal_id;
    const type = anime.type;

    if (image.includes("apple-touch-icon-256")) {
      image = "https://placehold.co/210x300/ffffff/555555?text=TV";
    }

    draw(image, title, id, seriesList, type);
    addEventSerie(image, title, id, seriesFavorite);
  }
}
//draw comic
function draw(image, title, id, container, type) {
  const serie = `<li id="serie-${id}">
                    <img src="${image}" alt="${title}" width="150">
                    <h4>${title}</h4> <p>${type}</p>
                </li>`;
  container.insertAdjacentHTML("beforeend", serie);
}

function addEventSerie(image, title, id, seriesFavorite) {
  const item = document.querySelector(`#serie-${id}`);
  item.addEventListener("click", (ev) => {
    ev.preventDefault();
    containerFavorite.classList.remove("hidden");
    draw(image, title, id, seriesFavorite);
    item.classList.add("highligth");
    //Save Favorites
    const obj = {
      image,
      title,
      id,
    };
    favorite.push(obj);
    localStorage.setItem("favorite", JSON.stringify(favorite));
  });
}

// recuperacion Favorites
function getFavorite() {
  const localStorageFavorite = JSON.parse(localStorage.getItem("favorite"));
  if (localStorageFavorite) {
    containerFavorite.classList.remove("hidden");
    for (const animeFavorite of localStorageFavorite) {
      draw(
        animeFavorite.image,
        animeFavorite.title,
        animeFavorite.id,
        seriesFavorite
      );
      const obj = {
        image: animeFavorite.image,
        title: animeFavorite.title,
        id: animeFavorite.id,
      };
      favorite.push(obj);
    }
  }
}

function resetButton() {
  buttonReset.addEventListener("click", (ev) => {
    ev.preventDefault();
    seriesList.innerHTML = "";
    inputSearch.innerHTML = "";
    seriesFavorite.innerHTML = "";
    localStorage.clear();
    containerFavorite.classList.add("hidden");
    containerSerie.classList.add("hidden");
  });
}

buttonLog.addEventListener("click", =>(ev){
ev.preventDefault();
    for(const anime of favorite){

        console.log("ss", anime.title)
    }
})


function start() {
  buttonSearch();
  resetButton();
  getFavorite();
}

start();

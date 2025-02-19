const searchBar = document.querySelector("#search_bar");
const citiesList = document.querySelector("#search_list");

/**
 * @param {HTMLInputElement} searchbar 
 */
searchBar.oninput = async function () {
    const value = this.value;

    const response = await searchCity(value);
    const cities = response.results ?? [];
    citiesList.innerHTML = "";

    for (let city of cities) {
        const item = document.createElement("button");
        item.classList.add("search_item");
        item.innerText = city.name;
        citiesList.appendChild(item);

        item.onclick = function () {
            document.cookie = `longitude=${city.longitude}`;
            document.cookie = `latitude=${city.latitude}`;
            console.log(city);
        }
    }
}

searchBar.onblur = function () {
    citiesList.innerHTML = "";
    searchBar.value = "";
    console.log("blur");
}
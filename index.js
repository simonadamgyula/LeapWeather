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
        item.innerHTML = `<img src="https://flagsapi.com/${city.country_code}/flat/64.png"> ${city.name}`;
        citiesList.appendChild(item);


        // using onmousedown, so it run before the element is deleted in onblur
        item.onmousedown = function () {
            document.cookie = `longitude=${city.longitude}`;
            document.cookie = `latitude=${city.latitude}`;
        }
    }
}

searchBar.onblur = function () {
    citiesList.innerHTML = "";
    searchBar.value = "";
}
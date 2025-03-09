const searchBar = document.querySelector("#search_bar");
const citiesList = document.querySelector("#search_list");

const temperatureElement = document.querySelector("#temperature");
const apparentTemperatureElement = document.querySelector("#apparent_temperature");
const precipitationElement = document.querySelector("#precipitation");
const precipitationProbabilityElement = document.querySelector("#precipitation_probability");
const sunriseElement = document.querySelector("#sunrise");
const sunsetElement = document.querySelector("#sunset");
const uvElement = document.querySelector("#uv");
const cityElement = document.querySelector("#city");

/**
 * @param {HTMLInputElement} searchbar 
 */
searchBar.oninput = async function () {
    const value = this.value;

    let response = null;
    try {
        response = await searchCity(value);
    } catch {
        citiesList.innerHTML = "Ellenőrizze az internet szolgáltatását!"
        return;
    }
    const cities = response.results ?? [];
    citiesList.innerHTML = "";

    for (let city of cities) {
        const item = document.createElement("button");
        item.classList.add("search_item");
        item.innerHTML = `
        <div class="upper">
            <img src="https://flagsapi.com/${city.country_code}/flat/64.png"> 
            ${city.name}
        </div>
        ${city.admin1 ?? ""}
        `;
        citiesList.appendChild(item);


        // using onmousedown, so it run before the element is deleted in onblur
        item.onmousedown = function () {
            document.cookie = `longitude=${city.longitude}`;
            document.cookie = `latitude=${city.latitude}`;
            document.cookie = `city=${city.name}`
            reloadData();
        }

    }
}

searchBar.onblur = function () {
    citiesList.innerHTML = "";
    searchBar.value = "";
}

function getDate() {
    const search = new URLSearchParams(window.location.search);
    console.log(Math.floor(new Date().getTime() / 1000), search.get("date") || Math.floor(new Date().getTime() / 1000));
    return new Date(parseInt(search.get("date")) || new Date().getTime());
}

function reloadData() {
    const date = getDate();
    console.log(date)
    getWeatherForDay(getLoaction(), date, { daily: ["temperature_2m_max", "temperature_2m_min", "apparent_temperature_min", "apparent_temperature_max", "sunrise", "sunset", "uv_index_max", "precipitation_sum", "precipitation_probability_max"] })
        .then(data => {
            cityElement.innerText = getCity();
            temperatureElement.innerText = `${data.daily.temperature_2m_min} ${data.daily_units.temperature_2m_min} / ${data.daily.temperature_2m_max} ${data.daily_units.temperature_2m_max}`;
            apparentTemperatureElement.innerHTML = `<p>${data.daily.apparent_temperature_min} ${data.daily_units.apparent_temperature_min} / ${data.daily.apparent_temperature_max} ${data.daily_units.apparent_temperature_max}</p>`;
            precipitationElement.innerHTML = `<p>${data.daily.precipitation_sum} ${data.daily_units.precipitation_sum}</p>`;
            precipitationProbabilityElement.innerHTML = `<p>${data.daily.precipitation_probability_max} ${data.daily_units.precipitation_probability_max}</p>`;
            sunriseElement.innerHTML = `<p>${new Date(data.daily.sunrise).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}</p>`;
            sunsetElement.innerHTML = `<p>${new Date(data.daily.sunset).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}</p>`;

            uvElement.innerHTML = `<p>${data.daily.uv_index_max} ${data.daily_units.uv_index_max}</p>`;
        })
        .catch(error => console.log(error));

    createGraphs(date);
}

window.onload = () => reloadData();

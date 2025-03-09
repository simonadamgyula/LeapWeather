const searchBar = document.querySelector("#search_bar");
const citiesList = document.querySelector("#search_list");

const temperatureElement = document.querySelector("#temperature");
const apparentTemperatureElement = document.querySelector("#apparent_temperature");
const humidityElement = document.querySelector("#humidity");
const windSpeedElement = document.querySelector("#wind_speed");
const windDirectionElement = document.querySelector("#wind_direction");
const uvElement = document.querySelector("#uv");
const cityElement = document.querySelector("#city");

const weeklyForecast = document.querySelector("#weekly_forecast")
// im writing a comment:) -Bence
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

function reloadData() {
    getWeatherForDay(getLoaction(), undefined, { current: ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "wind_speed_10m", "wind_direction_10m", "uv_index"] })
        .then(data => {
            cityElement.innerText = getCity();
            temperatureElement.innerText = `${data.current.temperature_2m} ${data.current_units.temperature_2m}`;
            apparentTemperatureElement.innerHTML = `<p>${data.current.apparent_temperature} ${data.current_units.apparent_temperature}</p>`;
            humidityElement.innerHTML = `<p>${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}</p>`;
            windSpeedElement.innerHTML = `<p>${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}</p>`;
            windDirectionElement.innerHTML = `<p>${data.current.wind_direction_10m}${data.current_units.wind_direction_10m} <object style="--direction: ${data.current.wind_direction_10m}deg" class="wind_arrow" data="/pictures/arrow.svg" type="image/svg+xml"></object></p>`;
            uvElement.innerHTML = `<p>${data.current.uv_index} ${data.current_units.uv_index}</p>`;
        })
        .catch(error => console.log(error))

    getForecast(getLoaction(), 7, { daily: ["temperature_2m_max", "temperature_2m_min", "weather_code"] })
        .then(data => {
            weeklyForecast.innerHTML = "";

            for (let i = 0; i < 7; i++) {
                weeklyForecast.innerHTML += `
                    <a class="forecast_card" href="/forecast.html?date=${new Date(data.daily.time[i]).getTime()}">
                        <div class="card_day">
                            <p>Hétfő</p>
                        </div>
                        <div class="card_pic">
                            <img src="pictures/sun_placeholder.jpg">
                        </div>
                        <div class="card_temperature">
                            <p>${data.daily.temperature_2m_min[0]}${data.daily_units.temperature_2m_min} / ${data.daily.temperature_2m_max[0]}${data.daily_units.temperature_2m_max}</p>
                        </div>
                    </a>`
            }
        })

    createGraphs(new Date());
}

window.onload = () => reloadData();

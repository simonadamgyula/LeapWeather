const apiUrl = "https://api.open-meteo.com/v1/forecast";
const searchUrl = "https://geocoding-api.open-meteo.com/v1/search";

/**
 * 
 * @param {{ [key: string]: any }} params 
 * @returns {string}
 */
function objectToGetParams(params) {
    return Object.entries(params)
        .map((([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`))
        .join("&")
}

/**
 * 
 * @param {string} params 
 * @returns {Promise<Response>}
 */
function sendApiRequest(uri, params) {
    let url = `${uri}?${objectToGetParams(params)}`;
    return fetch(url);
}

/**
 * 
 * @param {Date} date 
 * @returns {string}
 */
function formatDate(date) {
    let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    return `${year}-${month}-${day}`;
}


/**
 * 
 * @param {{ latitude: number, longitude: number }} location 
 * @param {Date?} day 
 * @param {{hourly: string[], daily: string[], current: string[]}} weatherVariables
 * @returns {Promise<{[key: string]: any}>}
 */
function getWeatherForDay(location, day, weatherVariables) {
    let requestOptions = {
        hourly: (weatherVariables.hourly || []).join(","),
        daily: (weatherVariables.daily || []).join(","),
        current: (weatherVariables.current || []).join(",")
    };

    if (day) {
        let formattedDate = formatDate(day);

        requestOptions = { ...requestOptions, start_date: formattedDate, end_date: formattedDate };
    } else {
        requestOptions = { ...requestOptions, forecast_days: 1 };
    }

    return new Promise((resolve, reject) => {
        sendApiRequest(apiUrl, { ...location, ...requestOptions })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

/**
 * 
 * @param {{ latitude: number, longitude: number }} location 
 * @param {number} days 
 * @param {{hourly: string[], daily: string[], current: string[]}} weatherVariables
 * @returns {Promise<{[key: string]: any}>}
 */
function getForecast(location, days, weatherVariables) {
    let requestOptions = {
        forecast_days: days,
        hourly: (weatherVariables.hourly || []).join(","),
        daily: (weatherVariables.daily || []).join(","),
        current: (weatherVariables.current || []).join(",")
    };
    
    return new Promise((resolve, reject) => {
        sendApiRequest(apiUrl, { ...location, ...requestOptions })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

// We'll need: 
// current: temperature_2m,precipitation
// hourly: temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,wind_speed_10m,wind_direction_10m,uv_index
// daily: temperature_2m_max,temperature_2m_min,precipitation_probability_max / weather_code,temperature_2m_max,temperature_2m_min

/**
 * @param {string} query 
 * @returns {Promise<{ [key: string]: any }>}
 */
function searchCity(query) {
    return new Promise((resolve, reject) => {
        sendApiRequest(searchUrl, { name: query })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}
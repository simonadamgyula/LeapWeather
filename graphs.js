const position = {
    latitude: 47.6116,
    longitude: 17.2501
}

const weatherVariables = {
    hourly: ["temperature_2m", "precipitation"],
}

getWeatherForDay(position, new Date(), weatherVariables)
    .then(data => {
        const hourlyData = data.hourly;

        makeTemperatureGraph(hourlyData.time, hourlyData.temperature_2m);
        makePrecipitationGraph(hourlyData.time, hourlyData.precipitation);
    })
    .catch(error => {
        console.error(error);
    });


/**
 * 
 * @param {number[]} times 
 * @param {number[]} temperatures 
 */
function makeTemperatureGraph(times, temperatures) {
    const timeValues = times.map(time => new Date(time).toLocaleTimeString("hu-HU", { hour: "numeric", minute: "2-digit" }));
    console.log(timeValues);

    new Chart("temperature-chart", {
        type: "line",
        data: {
            labels: timeValues,
            datasets: [{
                label: "Temperature",
                data: temperatures,
                borderColor: "rgb(255, 0, 55)",
                fill: false
            }]
        },
        options: {
            legend: { display: false }
        }
    });
}

/**
 * 
 * @param {number[]} times 
 * @param {number[]} precipitations 
 */
function makePrecipitationGraph(times, precipitations) {
    const timeValues = times.map(time => new Date(time).toLocaleTimeString("hu-HU", { hour: "numeric", minute: "2-digit" }));

    new Chart("precipitation-chart", {
        type: "bar",
        data: {
            labels: timeValues,
            datasets: [{
                label: "Precipitation",
                data: precipitations,
                backgroundColor: "#73c2fb",
                fill: true,
            }]
        },
        options: {
            legend: { display: false },
            scales: {
                yAxes: [{ ticks: { min: 0 } }],
            }
        }
    });
}

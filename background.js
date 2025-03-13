function WeatherIcon(weatherCode) {
    const today = new Date();
    let weather_icon = document.getElementById("weather_icon");
    const background = document.querySelector("body");
    let isNight = false;

    if (weatherCode == 0 && today.getHours() >= 18 || weatherCode == 0 && today.getHours() < 5) {
        weather_icon.src = "pictures/ready_for_use/hold.png";
        isNight = true;
        background.style.backgroundImage = "url('pictures/ready_for_use/hold.png')";
    }
    if (weatherCode == 0) {
        weather_icon.src = "pictures/ready_for_use/nap.png";
        background.style.backgroundImage = `url('pictures/ready_for_use/${isNight ? "night_" : "day_"}clear.png')`;
    } else if (weatherCode == 28 || 40 <= weatherCode && weatherCode <= 49) {
        weather_icon.src = "pictures/ready_for_use/cloud.png";
        background.style.backgroundImage = `url('pictures/ready_for_use/${isNight ? "night_" : "day_"}cloudy.png')`;
    } else if (weatherCode == 20 || weatherCode == 21 || weatherCode == 23 || weatherCode == 24 || 50 <= weatherCode && weatherCode <= 69) {
        background.style.backgroundImage = `url('pictures/ready_for_use/${isNight ? "night_" : "day_"}rain.png')`;
        weather_icon.src = "pictures/ready_for_use/rain.png";
    } else if (weatherCode == 25 || weatherCode == 28 || 80 <= weatherCode && weatherCode <= 99) {
        weather_icon.src = "pictures/ready_for_use/storm.png";
        background.style.backgroundImage = `url('pictures/ready_for_use/${isNight ? "night_" : "day_"}storm.png')`;
    } else if (weatherCode == 26 || weatherCode == 27 || 70 <= weatherCode && weatherCode <= 79) {
        weather_icon.src = "pictures/ready_for_use/snow.png";
        background.style.backgroundImage = `url('pictures/ready_for_use/${isNight ? "night_" : "day_"}snow.png')`;
    } else {
        weather_icon.src = "pictures/ready_for_use/nap.png";
        background.style.backgroundImage = `url('pictures/ready_for_use/${isNight ? "night_" : "day_"}clear.png')`;
    }
}

function iconByWeatherCode(weatherCode) {
    if (weatherCode == 0) {
        return "pictures/ready_for_use/nap.png";
    } else if (weatherCode == 28 || 40 <= weatherCode <= 49) {
        return "pictures/ready_for_use/cloud.png";
    } else if (weatherCode == 20 || weatherCode == 21 || weatherCode == 23 || weatherCode == 24 || 50 <= weatherCode <= 69) {
        return "pictures/ready_for_use/rain.png";
    } else if (weatherCode == 25 || weatherCode == 28 || 80 <= weatherCode <= 99) {
        return "pictures/ready_for_use/storm.png";
    } else if (weatherCode == 26 || weatherCode == 27 || 70 <= weatherCode <= 79) {
        return "pictures/ready_for_use/snow.png";
    } else {
        return "pictures/ready_for_use/nap.png";
    }
}
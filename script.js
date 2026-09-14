async function getWeather() {

    const cityInput = document.getElementById("cityInput");
    const message = document.getElementById("message");

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        clearWeather();
        return;
    }

    message.textContent = "Getting weather...";

    try {

        const cityUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const cityResponse = await fetch(cityUrl);

        if (!cityResponse.ok) {
            throw new Error("Unable to find city");
        }

        const cityData = await cityResponse.json();

        if (!cityData.results || cityData.results.length === 0) {
            throw new Error("City not found");
        }

        const location = cityData.results[0];

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Weather unavailable");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country_code}`;

        document.getElementById("temperature").textContent =
            `${Math.round(current.temperature_2m)}°C`;

        document.getElementById("description").textContent =
            getWeatherDescription(current.weather_code);

        document.getElementById("feelsLike").textContent =
            `${Math.round(current.apparent_temperature)}°C`;

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        document.getElementById("weatherIcon").src =
            getWeatherIcon(current.weather_code);

        message.textContent = "";

    } catch (error) {

        console.log(error);

        if (error.message === "City not found") {
            message.textContent =
                "City not found. Please check the city name.";
        } else {
            message.textContent =
                "Unable to get weather. Please try again.";
        }

        clearWeather();
    }
}


function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1 || code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Cloudy";
    }

    if (code === 45 || code === 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rainy";
    }

    if (code >= 71 && code <= 77) {
        return "Snowy";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown weather";
}


function getWeatherIcon(code) {

    if (code === 0) {
        return "https://cdn-icons-png.flaticon.com/512/869/869869.png";
    }

    if (code === 1 || code === 2) {
        return "https://cdn-icons-png.flaticon.com/512/1163/1163661.png";
    }

    if (code === 3) {
        return "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";
    }

    if (code === 45 || code === 48) {
        return "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";
    }

    if (code >= 51 && code <= 57) {
        return "https://cdn-icons-png.flaticon.com/512/414/414974.png";
    }

    if (code >= 61 && code <= 67) {
        return "https://cdn-icons-png.flaticon.com/512/1163/1163626.png";
    }

    if (code >= 71 && code <= 77) {
        return "https://cdn-icons-png.flaticon.com/512/642/642102.png";
    }

    if (code >= 80 && code <= 82) {
        return "https://cdn-icons-png.flaticon.com/512/1163/1163657.png";
    }

    if (code >= 95) {
        return "https://cdn-icons-png.flaticon.com/512/1146/1146869.png";
    }

    return "";
}


function clearWeather() {

    document.getElementById("cityName").textContent = "--";
    document.getElementById("temperature").textContent = "--°C";
    document.getElementById("description").textContent = "--";
    document.getElementById("feelsLike").textContent = "--°C";
    document.getElementById("humidity").textContent = "--%";
    document.getElementById("wind").textContent = "-- km/h";
    document.getElementById("weatherIcon").src = "";
}


document.getElementById("cityInput").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


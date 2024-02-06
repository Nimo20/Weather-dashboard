// Get the necessary HTML elements
var weatherContainer = document.querySelector('.weather-container');
var weatherCards = document.querySelector('.weather-cards');
var cityInput = document.querySelector('#city-input');
var searchButton = document.querySelector('#submit');

// Function to create a weather card
var createWeatherCard = (cityName, weatherItem) => {
    return `
        <li class="cards">
        <h3>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather Icon">
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </li>
    `;
    };

    var API_KEY = 'c40ec961139c146223010acccae3fa44';

    // Function to fetch weather data and update the UI
    function getWeatherDetails(cityName) {
    var API_KEY = 'c40ec961139c146223010acccae3fa44';
    var WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
        // Clear previous weather cards
        weatherCards.innerHTML = "";

        // Update the current weather container
        var currentWeather = data.list[0];
        weatherContainer.innerHTML = `
            <div class="weather-container">
            <h2>${cityName} (${currentWeather.dt_txt.split(" ")[0]})</h2>
            <h4>Temperature: ${(currentWeather.main.temp - 273.15).toFixed(2)}°C</h4>
            <h4>Wind: ${currentWeather.wind.speed} M/S</h4>
            <h4>Humidity: ${currentWeather.main.humidity}%</h4>
            </div>
            <div>
            <img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png" alt="Weather Icon">
            </div>
        `;

        // Update the weather cards for the next 5 days
        var fiveDaysForecast = data.list.slice(0, 40); // Get the first 40 items for 5 days
        for (var i = 0; i < fiveDaysForecast.length; i += 8) {
            var weatherItem = fiveDaysForecast[i];
            weatherCards.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem));
        }
        localStorage.setItem('getWeatherDetails', JSON.stringify(data));
        })
        .catch(error => {
        console.error('Error fetching weather data:', error);
        });
    }

    // Function to handle form submission
    var handleFormSubmit = event => {
    event.preventDefault();
    var cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherDetails(cityName);
        cityInput.value = "";
    }
};

 var getCityCoordinates = event => {
    event.preventDefault();
    var cityName = cityInput.value.trim();
    if (!cityName) return;

    var GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
        console.log(data[0]);
        if (data.length === 0) return alert(`No coordinates found for ${cityName}`);

        var { name, lat, lon } = data[0];
        getWeatherDetails(cityName, lat, lon);
        })
    .catch(error => {
        console.error("Error fetching city coordinates:", error);
        alert("Error fetching city coordinates. Please try again.");
});
    
};

// Add event listener to the search button
searchButton.addEventListener('click', handleFormSubmit);
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

// Function to fetch weather data and  the UI
function getWeatherDetails(cityName) {
  var API_KEY = 'c40ec961139c146223010acccae3fa44'; 
  var WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
    .then(response => response.json())
    .then(data => {
      // Clear previous weather cards
      weatherCards.innerHTML = "";

      //  the current weather container
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
        </div>`;

      // the weather cards for the next 5 days
      var fiveDaysForecast = data.list.slice(1, 6);
      fiveDaysForecast.forEach(weatherItem => {
        weatherCards.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem));
      });

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

//  event listener to the search button
searchButton.addEventListener('click', handleFormSubmit);
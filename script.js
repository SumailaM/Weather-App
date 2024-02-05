const apiKey = '66402fd56735df21c096dd5c5a670331';

// Add event listener to the search form
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const city = document.getElementById('cityInput').value; // Get the city from the input
    fetchWeatherData(city); // Call the function to fetch weather data
});

// Function to fetch weather data from the OpenWeatherMap API
function fetchWeatherData(city) {
    //  The API URL with the city name
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Get the information for current weather
            const currentWeatherData = {
                cityName: data.city.name,
                date: new Date().toLocaleDateString(),
                icon: `http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`,
                temperature: `${Math.round(data.list[0].main.temp - 273.15)}°C`,
                humidity: `${data.list[0].main.humidity}%`,
                windSpeed: `${data.list[0].wind.speed} m/s`
            };

            // Used to get information for 5-day forecast
            const forecastData = data.list.slice(1, 6).map(item => ({
                date: new Date(item.dt * 1000).toLocaleDateString(),
                icon: `http://openweathermap.org/img/w/${item.weather[0].icon}.png`,
                temperature: `${Math.round(item.main.temp - 273.15)}°C`,
                humidity: `${item.main.humidity}%`,
                windSpeed: `${item.wind.speed} m/s`
            }));

            // Update the UI with current weather and forecast data
            updateCurrentWeather(currentWeatherData);
            updateForecast(forecastData);
            updateSearchHistory(city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}

// Used a function to update the current weather section of the UI
function updateCurrentWeather(data) {
    const currentWeatherElement = document.getElementById('currentWeather');
    currentWeatherElement.innerHTML = `
        <h2>${data.cityName} - ${data.date}</h2>
        <img src="${data.icon}" alt="Weather Icon">
        <p>Temperature: ${data.temperature}</p>
        <p>Humidity: ${data.humidity}</p>
        <p>Wind Speed: ${data.windSpeed}</p>
    `;
}

// Function to update the 5-day forecast section of the UI
function updateForecast(data) {
    const forecastElement = document.getElementById('forecast');
    forecastElement.innerHTML = '<h2>5-Day Forecast</h2>';
    data.forEach(day => {
        forecastElement.innerHTML += `
            <div class="forecast-day">
                <p>Date: ${day.date}</p>
                <img src="${day.icon}" alt="Weather Icon">
                <p>Temperature: ${day.temperature}</p>
                <p>Humidity: ${day.humidity}</p>
                <p>Wind Speed: ${day.windSpeed}</p>
            </div>
        `;
    });
}

// Function to update the search history section of the UI
function updateSearchHistory(city) {
    const searchHistoryElement = document.getElementById('searchHistory');
    searchHistoryElement.innerHTML += `<p>${city}</p>`;
}

// Added a  event listener to the search history for handling city selection
document.getElementById('searchHistory').addEventListener('click', function(event) {
    if (event.target.tagName === 'P') {
        const selectedCity = event.target.textContent;
        fetchWeatherData(selectedCity);
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "RP1cjbipHNMb9L16H5ajo1coUesGiGx0"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchDailyForecast(locationKey); // Fetch 5-day daily forecast
                } else {
                    weatherDiv.innerHTML = "<p>City not found.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = "<p>Error fetching location data.</p>";
            });
    }

    function fetchWeatherData(locationKey) {
        const currentWeatherUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const currentTemperature = data[0].Temperature.Metric.Value;
                    displayWeather(data[0]);
                    displayDailyForecast([], currentTemperature); // Pass an empty array as the first argument since we are not using it
                } else {
                    weatherDiv.innerHTML = "<p>No weather data available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                weatherDiv.innerHTML = "<p>Error fetching current weather data.</p>";
            });
    }

    function fetchHourlyForecast(locationKey) {
        const hourlyForecastUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(hourlyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML += "<p>No hourly forecast data available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML += "<p>Error fetching hourly forecast data.</p>";
            });
    }

    function fetchDailyForecast(locationKey) {
        const dailyForecastUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(dailyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML += "<p>No daily forecast data available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching 5-day daily forecast data:", error);
                weatherDiv.innerHTML += "<p>Error fetching 5-day daily forecast data.</p>";
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayHourlyForecast(data) {
        let forecastContent = '<h2>Hourly Forecast</h2>';

        data.forEach(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temperature = hour.Temperature.Value;
            const weather = hour.IconPhrase;

            forecastContent += `
                <div>
                    <p>Time: ${time}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        });

        weatherDiv.innerHTML += forecastContent;
    }

    function displayDailyForecast(dailyForecasts) {
        let forecastContent = '<h2>5-Day Daily Forecast</h2>';

        // Display current temperature
      //  forecastContent += `<p>Current Temperature: ${currentTemperature}°C</p>`;

        dailyForecasts.forEach(day => {
            const date = new Date(day.Date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
            const minTemp = day.Temperature.Minimum.Value;
            const maxTemp = day.Temperature.Maximum.Value;
            const dayWeather = day.Day.IconPhrase;
            let forecastContent = '<h2>5-Day Daily Forecast</h2>';

            forecastContent += `
                <div>
                    <p>Date: ${date}</p>
                    <p>Min Temperature: ${minTemp}°C</p>
                    <p>Max Temperature: ${maxTemp}°C</p>
                    <p>Weather: ${dayWeather}</p>
                </div>
            `;
        });
        weatherDiv.innerHTML += forecastContent;
    }
});

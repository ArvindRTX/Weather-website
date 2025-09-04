document.addEventListener('DOMContentLoaded', () => {
    console.log('Event: DOMContentLoaded - Page fully loaded and parsed.');

    const weatherForm = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const weatherDisplay = document.getElementById('weather-display');


    const apiKey = 'e3dc4c7da90a8caa79908a3ccf8edd7e';
    console.log('Setup: Constants for form, input, display, and API key have been initialized.');

    weatherForm.addEventListener('submit', (event) => {
        console.log('Event: Form submitted.');
        event.preventDefault();
        const city = cityInput.value.trim();

        if (city) {
            console.log(`Action: City detected - "${city}". Calling getWeatherData.`);
            getWeatherData(city);
        } else {
            console.log('Warning: Form submitted with no city name.');
        }
    });

    function getWeatherData(city) {
        console.log(`Function: getWeatherData called for city: "${city}".`);
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        console.log(`Action: API URL constructed: ${apiUrl}`);

        weatherDisplay.innerHTML = '<p>Loading...</p>';
        weatherDisplay.classList.remove('hidden');
        weatherDisplay.classList.remove('visible');
        console.log('UI: Display set to "Loading..."');

        fetch(apiUrl)
            .then(response => {
                console.log('API: Received a response from the server.');
                if (!response.ok) {
                    console.error('Error: API response was not OK (e.g., 404, 401). Throwing an error.');
                    throw new Error('City not found. Please check the spelling.');
                }
                console.log('Success: API response is OK. Parsing JSON...');
                return response.json();
            })
            .then(data => {
                console.log('Success: JSON data parsed.', data);
                if (data.cod !== 200) {
                    console.error('Error: API returned a non-200 status code in its data. Throwing an error.');
                    throw new Error(data.message || 'Unable to fetch weather data.');
                }
                console.log('Action: Calling displayWeather with received data.');
                displayWeather(data);
            })
            .catch(error => {
                console.error('Error: Caught an error during the fetch process.', error);
                console.log('Action: Calling displayError with the error message.');
                displayError(error.message);
            });
    }

    function displayWeather(data) {
        console.log('Function: displayWeather called with data:', data);
        const cityName = data.name || 'Unknown City';
        const country = data.sys?.country ? `, ${data.sys.country}` : '';
        const temperature = Math.round(data.main?.temp ?? 0);
        const description = data.weather?.[0]?.description || 'No description';
        const iconCode = data.weather?.[0]?.icon;
        const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : '';

        const html = `
      <h2>${cityName}${country}</h2>
      ${iconCode ? `<img src="${iconUrl}" alt="${description}">` : ''}
      <p class="temp">${temperature}°C</p>
      <p class="description">${description}</p>
    `;

        weatherDisplay.innerHTML = html;
        weatherDisplay.classList.remove('hidden');
        setTimeout(() => weatherDisplay.classList.add('visible'), 10);
        console.log('UI: Weather display has been updated with new data.');
    }

    function displayError(message) {
        console.log(`Function: displayError called with message: "${message}"`);
        const html = `<p class="error">${message}</p>`;
        weatherDisplay.innerHTML = html;
        weatherDisplay.classList.remove('hidden');
        setTimeout(() => weatherDisplay.classList.add('visible'), 10);
        console.log('UI: Error message has been displayed.');
    }
});
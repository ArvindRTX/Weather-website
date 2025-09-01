document.addEventListener('DOMContentLoaded', () => {
    const weatherForm = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const weatherDisplay = document.getElementById('weather-display');
    const apiKey = 'e3dc4c7da90a8caa79908a3ccf8edd7e';

    weatherForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    });

    function getWeatherData(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        weatherDisplay.innerHTML = '<p>Loading...</p>';
        weatherDisplay.classList.remove('hidden');
        weatherDisplay.classList.remove('visible');

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found. Please check the spelling.');
                }
                return response.json();
            })
            .then(data => {
                if (data.cod !== 200) {
                    throw new Error(data.message || 'Unable to fetch weather data.');
                }
                displayWeather(data);
            })
            .catch(error => {
                displayError(error.message);
            });
    }

    function displayWeather(data) {
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
    }

    function displayError(message) {
        const html = `<p class="error">${message}</p>`;
        weatherDisplay.innerHTML = html;
        weatherDisplay.classList.remove('hidden');
        setTimeout(() => weatherDisplay.classList.add('visible'), 10);
    }
});
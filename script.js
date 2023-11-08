document.addEventListener("DOMContentLoaded", () => {
    const apiKey = 'ac7c153f241e5bf8d34e60cbc9f8cf99'; 
    const getWeatherButton = document.getElementById('get-weather-btn');
    const forecastContainer = document.getElementById('forecast-table');
    const weatherAnimation = document.querySelector('.weather-animation');
    const rainChance = document.getElementById('rain-chance');

    getWeatherButton.addEventListener('click', () => {
        const cityInput = document.getElementById('city-input');
        const location = document.getElementById('location');
        const temperature = document.getElementById('temperature');
        const description = document.getElementById('description');

        const city = cityInput.value;

        if (!city) {
            alert('Please enter a city name.');
            return;
        }

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                location.textContent = `Location: ${data.name}, ${data.sys.country}`;
                temperature.textContent = `Temperature: ${data.main.temp}°C`;
                description.textContent = `Description: ${data.weather[0].description}`;

                
                const weatherIcon = data.weather[0].icon;
                
                const weatherImages = {
                    '01d': 'clear-sky.jpg',
                    '02d': 'few-clouds.jpg',
                    '03d': 'scattered-clouds.jpg',
                    '04d': 'broken-clouds.jpg',
                    '09d': 'rain.jpg',
                    '10d': 'rain.jpg',
                    '11d': 'thunderstorm.jpg',
                    '13d': 'snow.jpg',
                    '50d': 'mist.jpg',
                    
                };
               
                const backgroundImage = weatherImages[weatherIcon] || 'default.jpg';

                
                weatherAnimation.style.backgroundImage = `url('images/${backgroundImage}')`;

                
                if (data.weather[0].main.toLowerCase() === 'rain') {
                    rainChance.textContent = 'Chance of Rain: ' + (data.rain && data.rain['1h'] ? data.rain['1h'] + 'mm' : 'Unknown');
                } else {
                    rainChance.textContent = '';
                }

                
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
            })
            .then(response => response.json())
            .then(data => {
                forecastContainer.innerHTML = '<tr><th>Date</th><th>Temperature (°C)</th><th>Description</th></tr>'; // Clear previous forecast

                for (let i = 0; i < data.list.length; i += 8) {
                    const forecast = data.list[i];
                    const date = new Date(forecast.dt * 1000).toDateString();
                    const temperature = forecast.main.temp;
                    const description = forecast.weather[0].description;

                    const row = forecastContainer.insertRow();
                    row.insertCell(0).textContent = date;
                    row.insertCell(1).textContent = `${temperature}°C`;
                    row.insertCell(2).textContent = description;
                }
            })
            .catch(error => {
                console.error(error);
                alert('City not found. Please enter a valid city name.');
            });
    });
});


// Get references to necessary DOM elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const searchedCitiesDiv = document.getElementById("searched-cities");
const apiKey = "a788839481d044c8b303a548c937f54e";

// Function to fetch and display weather data
const getForecast = async (city) => {
  try {
    // Fetch weather data from Weatherbit API
    const response = await fetch(
      `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&units=I&key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    console.log(data);

    // Process and display the weather data
    displayWeather(data);

    // Save searched city to local storage
    saveCity(city);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

// Function to handle search button click
searchBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission

  // Get the city input value
  const city = cityInput.value.trim();
  if (city) {
    getForecast(city); // Fetch and display the forecast for the input city
    cityInput.value = ""; // Clear search input field after submit
  } else {
    console.error("Please enter a valid city name.");
  }
});

// Function to display weather data on the page
const displayWeather = (data) => {
  // Extract and display current weather and 5-day forecast data
  const weatherToday = document.getElementById("weather-today");
  const weatherForecast = document.getElementById("weather-forecast");

  // Today's weather icon and data
  const iconCodeToday = data.data[0].weather.icon;
  const iconImageToday = `assets/images/weather-icons/${iconCodeToday}.png`;

  // Update today's weather section
  weatherToday.innerHTML = `
    <h3>${data.city_name}, ${data.state_code} (${dayjs().format("MM/DD/YYYY")})
      <img src="${iconImageToday}" alt="Weather Icon" style="width: 50px; height: 50px;">
    </h3> 
    <p id="temp-today">Temp: ${data.data[0].temp}°F</p>
    <p id="wind-today">Wind: ${data.data[0].wind_spd} MPH</p>
    <p id="humidity-today">Humidity: ${data.data[0].rh}%</p>
  `;

  // Clear previous 5-day forecast
  weatherForecast.innerHTML = "";

  // Update 5-day forecast section
  for (let i = 1; i < 6; i++) {
    const day = data.data[i];
    const iconCodeForecast = day.weather.icon;
    const iconImageForecast = `assets/images/weather-icons/${iconCodeForecast}.png`;

    const forecastHTML = `
      <div class="forecast col w-19% text-center mx-1 p-1" style="background-color: #157c8d; color: white;">
        <h6>${dayjs(day.datetime).format("MM/DD/YYYY")}</h6>
        <img src="${iconImageForecast}" alt="Weather Icon" style="width: 50px; height: 50px;">
        <p>Temp: ${day.temp}°F</p>
        <p>Wind: ${day.wind_spd} MPH</p>
        <p>Humidity: ${day.rh}%</p>
      </div>
    `;
    weatherForecast.innerHTML += forecastHTML;
  }
};

// Function to save the city to local storage
const saveCity = (city) => {
  let cities = JSON.parse(localStorage.getItem("searchedCities")) || [];

  // If the city is not already in the list, add it
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("searchedCities", JSON.stringify(cities));
    displaySearchedCities();
  }
};

// Function to display searched cities as buttons
const displaySearchedCities = () => {
  let cities = JSON.parse(localStorage.getItem("searchedCities")) || [];
  searchedCitiesDiv.innerHTML = "";

  cities.forEach((city) => {
    const cityBtn = document.createElement("button");
    cityBtn.textContent = city;
    cityBtn.className = "btn btn-secondary btn-sm btn-block mt-3";
    cityBtn.addEventListener("click", () => getForecast(city));
    searchedCitiesDiv.appendChild(cityBtn);
  });
};

// Initial display of searched cities on page load
displaySearchedCities();

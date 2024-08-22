// Get references to necessary DOM elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const apiKey = "a788839481d044c8b303a548c937f54e";
// const iconCode =
// const icons = assets/images/icons/${iconCode}.png

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
  } else {
    console.error("Please enter a valid city name.");
  }
});

// Function to display weather data on the page
const displayWeather = (data) => {
  // Extract and display current weather and 5-day forecast data

  const weatherToday = document.getElementById("weather-today");
  const weatherForecast = document.getElementById("weather-forecast");
  let iconCodeToday = data.data[0].weather.icon;
  let iconImageToday = `assets/images/icons/${iconCodeToday}`;

  // Update today's weather section
  weatherToday.innerHTML = `
    <h3>${data.city_name} (${dayjs().format("MM/DD/YYYY")})</h3> 
    <img>${iconImageToday}.png</img>
    <p id="temp-today"> Temp: ${data.data[0].temp}°F</p>
    <p id="wind-today"> Wind: ${data.data[0].wind_spd} MPH</p>
    <p id="humidity-today"> Humidity: ${data.data[0].rh}%</p>
  `;

  // Clear previous 5-day forecast
  weatherForecast.innerHTML = "";

  // Update 5-day forecast section
  for (let i = 1; i < 6; i++) {
    const day = data.data[i];
    let iconCodeForecast = data.data[i].weather.icon;
    let iconImageForecast = `assets/images/icons/${iconCodeForecast}`;
    const forecastHTML = `
      <div class="col text-center">
        <img>${iconImageForecast}</img>
        <h5>${dayjs(day.datetime).format("MM/DD/YYYY")}</h5>
        <p>Temp: ${day.temp}°F</p>
        <p>Wind: ${day.wind_spd} MPH</p>
        <p>Humidity: ${day.rh}%</p>
      </div>
    `;
    weatherForecast.innerHTML += forecastHTML;
  }
};

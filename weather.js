const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = document.querySelector(".info-txt"),
  inputField = document.querySelector("input"),
  locationBtn = document.querySelector("button"),
  weatherPart = document.querySelector(".weather-part"),
  wIcon = document.querySelector(".weather-part img"),
  arrowBack = document.querySelector("header i");

const loadingElement = document.getElementById("loading");
const overlayElement = document.getElementById("overlay");

function setWeatherBackgroundFromImg() {
  const img = document.querySelector("#popup img");
  if (!img) return;
  const condition = img.alt.toLowerCase();

  const body = document.body;
  body.classList.remove(
    "sunny-bg",
    "cloudy-bg",
    "rainy-bg",
    "snow-bg",
    "default-bg"
  );

  if (condition.includes("cloudy")) {
    body.classList.add("sunny-bg");
  } else if (condition.includes("cloud")) {
    body.classList.add("cloudy-bg");
  } else if (condition.includes("rain")) {
    body.classList.add("rainy-bg");
  } else if (condition.includes("snow")) {
    body.classList.add("snow-bg");
  } else {
    body.classList.add("default-bg");
    console.log("default");
  }
}
async function setWeatherBackgroundFromImg() {
  const img = document.querySelector("#popup img");
  if (!img) return;

  const condition = img.alt.toLowerCase();
  const query = encodeURIComponent(condition);
  const ACCESS_KEY = "EwqFT4iKil71dqykgO8bs8UUGe3zItIwkv5SAz3-A08";

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      }
    );

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.full;

      // Set background image
      document.body.style.backgroundImage = `url('${imageUrl}')`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
    } else {
      console.log("No image found for query:", condition);
      document.body.classList.add("default-bg");
    }
  } catch (err) {
    console.error("Error fetching background image:", err);
    document.body.classList.add("default-bg");
  }
}

async function getWeather() {
  const cityInput = document.getElementById("cityInput").value;
  const errorMessageElement = document.getElementById("error-message");

  // Check if the input field is empty
  if (!cityInput.trim()) {
    errorMessageElement.innerHTML = "Please enter a city name.";
    errorMessageElement.classList.add("error");
    setTimeout(() => {
      errorMessageElement.innerHTML = "";
      errorMessageElement.classList.remove("error");
    }, 2000);
    return;
  } else {
    errorMessageElement.innerHTML = "";
    errorMessageElement.classList.remove("error");
  }

  console.log("loadingElement:", loadingElement);
  console.log("overlayElement:", overlayElement);
  overlayElement.style.display = "block";
  loadingElement.style.display = "block";

  const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${encodeURIComponent(
    cityInput
  )}`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "0f6597fff5msh5d65db01fcd29ccp13fbf0jsn543a95237dc7",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = "";
      if (response.status === 400 || response.status === 404) {
        errorMessage =
          "City not found. Please check the spelling and try again.";
      } else {
        errorMessage = `Weather API request failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log(result);

    setTimeout(() => {
      if (result) {
        document.getElementById("popup").style.display = "flex";
      }

      // Weather icon
      wIcon.src = "https:" + result.current.condition.icon;
      wIcon.alt = result.current.condition.text;

      // Display information on the webpage
      const locationInfo = `Location: <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        result.location.name + "," + result.location.country
      )}" target="_blank" style="color:#007bff;text-decoration:underline;">${
        result.location.name
      }</a>, ${result.location.country}`;
      const weatherInfo = `Weather: ${result.current.condition.text}`;
      const temperatureInfo = `Temperature: ${result.current.temp_c}°C`;

      document.querySelector(".feels .numb-2").textContent =
        result.current.feelslike_c;
      document.querySelector(".humidity span").textContent =
        result.current.humidity;

      document.getElementById("location").innerHTML = locationInfo;
      document.getElementById("weather").innerHTML = weatherInfo;
      document.getElementById("weather-info").innerHTML = temperatureInfo;

      // Hide loading indicator after showing data
      loadingElement.style.display = "none";
      overlayElement.style.display = "none";
      setWeatherBackgroundFromImg();
    }, 2000); // 2 seconds for better UX
  } catch (error) {
    loadingElement.style.display = "none";
    overlayElement.style.display = "none";
    console.error(error);
    errorMessageElement.innerHTML = error.message;
    errorMessageElement.classList.add("error");
    setTimeout(() => {
      errorMessageElement.innerHTML = "";
      errorMessageElement.classList.remove("error");
    }, 2000);
  }
  // Remove the finally block or leave it empty
}

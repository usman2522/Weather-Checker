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

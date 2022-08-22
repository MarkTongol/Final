import { windSpeedConvert, kelvinToCelcius } from "./mymodule";
import "dotenv/config";
const key = process.env.WEATHERAPI_KEY;
const targetElement_Weather = document.querySelector("#weather");
const targetElement_advice = document.querySelector("#advice");
const form = document.querySelector("form");
let inputCity = document.querySelector(".txtLocation");

function emptyText() {
  targetElement_advice.innerHTML = null;
  let outputHtml = `<h2>I cannot process EMPTY value.. enter any location</h2>`;
  return (targetElement_Weather.innerHTML = outputHtml);
}

function convertResponseIntoJS_Weather(res_Weather) {
  return res_Weather.json();
}

function displayData_Weather(weatherData) {
  let locationName = weatherData.name;
  let outputHtml = `
        <h2>Location: ${locationName.toUpperCase()} ${
    weatherData.sys.country
  } having some ${weatherData.weather[0].description}.</h2>
        <h2>With a Min Temperature: ${kelvinToCelcius(
          weatherData.main.temp_min
        ).toFixed()} Degree Celcius and \n
        Max Temperature:  ${kelvinToCelcius(
          weatherData.main.temp_max
        ).toFixed()} Degree Celcius.</h2>
        <h2>Wind Speed of, ${windSpeedConvert(
          weatherData.wind.speed
        ).toFixed()} km/hr.</h2>
        `;
  targetElement_Weather.innerHTML = outputHtml;
}

//----------------- Advice API ----------------------------
function convertResponseIntoJS_Advice(res_Advice) {
  return res_Advice.json();
}

function displayData_Advice(adviceData) {
  let htmlAdvice = `
        <h2>-------------------------------</h2>
        <h2>Advice for you today: </h2>
        <h2>${adviceData.slip.advice}</h2>
    `;
  targetElement_advice.innerHTML = htmlAdvice;
}

//-- Promises and Prevent default
function btnFindLocation(btnEvent) {
  btnEvent.preventDefault();
  if (inputCity.value === "") {
    emptyText();
  } else {
    const baseURL_Weather = "https://api.openweathermap.org/data/2.5/weather";
    const param_Weather = `?q=${inputCity.value}&appid=${key}`;
    const endPoint_Weather = baseURL_Weather + param_Weather;

    fetch(endPoint_Weather)
      .then(convertResponseIntoJS_Weather)
      .then(displayData_Weather)
      .catch((error) => {
        targetElement_Weather.innerHTML = `<h2>${inputCity.value} is not a location or City . . . Try again! </h2>`;
        console.log("There was an error!", error);
      });

    // --- Advice API
    fetch("https://api.adviceslip.com/advice")
      .then(convertResponseIntoJS_Advice)
      .then(displayData_Advice)
      .catch((error) => {
        targetElement_advice.innerHTML = `<h2>I don't have anything for you today.. Sorry!</h2>`;
        console.log("There was an error!", error);
      });
  }
}

// --------------Event Listener--------------------------------------
form.addEventListener("submit", btnFindLocation);

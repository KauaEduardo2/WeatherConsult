const apiKey = "c1e6f9cb70251b8ff3b60ee18f9c0b92";
const apiCountryURL = "https://flagcdn.com/w320/";
const unsplashAccessKey = "wLPXBunYq6s2b1e-Bv4o-lv-WGuBwSN0wJ6EI6SkA74"; // Substitua pela sua chave da Unsplash
const unsplashURL = "https://api.unsplash.com/search/photos";
const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");
const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const umidityElement = document.querySelector("#umidity span");
const windElement = document.querySelector("#wind span");
const weatherContainer = document.querySelector("#weather-data");
const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");
const suggestionContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");
const tempMaxElement = document.querySelector("#temp-max span");
const tempMinElement = document.querySelector("#temp-min span");

// Loader
const toggleLoader = () => {
  loader.classList.toggle("hide");
};

const getCityImageFromUnsplash = async (city) => {
  const formattedCity = `${city.trim().replace(/\s+/g, "+")}+cityscape`;
  const url = `${unsplashURL}?query=${formattedCity}&client_id=${unsplashAccessKey}&per_page=1`;

  console.log("Unsplash API URL:", url); // Depuração

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.full; // Retorna a URL da imagem
    }
  } catch (error) {
    console.error("Erro ao buscar imagem na Unsplash API:", error);
  }

  return "https://via.placeholder.com/1600x900?text=City+Image+Not+Found"; // Fallback
};


const getWeatherData = async (city) => {
  toggleLoader();

  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  try {
    const res = await fetch(apiWeatherURL);
    const data = await res.json();
    toggleLoader();

    return data;
  } catch (error) {
    console.error("Erro ao buscar dados do tempo:", error);
    toggleLoader();
    return null;
  }
};

// Tratamento de erro
const showErrorMessage = () => {
  errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
  errorMessageContainer.classList.add("hide");
  weatherContainer.classList.add("hide");
  suggestionContainer.classList.add("hide");
};

const showWeatherData = async (city) => {
  hideInformation();

  const data = await getWeatherData(city);

  if (!data || data.cod === "404") {
    showErrorMessage();
    return;
  }

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  tempMaxElement.innerText = parseInt(data.main.temp_max);
  tempMinElement.innerText = parseInt(data.main.temp_min);
  // Defina a bandeira do país usando FlagCDN e transforme o código do país para minúsculas
  const countryCode = data.sys.country;
  console.log("Country code:", countryCode);

  if (countryCode) {
    countryElement.setAttribute("src", `${apiCountryURL}${countryCode.toLowerCase()}.png`);
    countryElement.onerror = () => {
      // Fallback para imagem padrão se houver erro
      countryElement.setAttribute("src", "https://via.placeholder.com/50x30?text=No+Flag");
    };
  } else {
    countryElement.setAttribute("src", "https://via.placeholder.com/50x30?text=No+Flag");
  }

  umidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;
 

  // Alterar imagem de fundo usando a Unsplash API
  const imageUrl = await getCityImageFromUnsplash(city);
  document.body.style.backgroundImage = `url("${imageUrl}")`;

  weatherContainer.classList.remove("hide");
};

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const city = cityInput.value;
  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;
    showWeatherData(city);
  }
});

suggestionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.getAttribute("id");
    showWeatherData(city);
  });
});

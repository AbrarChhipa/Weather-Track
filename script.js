const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-wether");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY="2d1883cb6b0ff21a734b6792fee781f6";

const createWeatherCard = (cityName, weatherItem, index) =>{
    if(index === 0){
        return `<div class="current-wether">
                <div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="wether-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>
                </div>`;
    } else{

        return`<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="wether-icon">
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }
}

const getWeatherdetails = (cityName, lat, lon) => {
    const Weather_Api_url= `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(Weather_Api_url).then(res=>res.json()).then(data=>{
        const uniqueforcastDate = [];
       const fiveDaysforcast = data.list.filter(forcast =>{
            const forcastDate=new Date(forcast.dt_txt).getDate();
            if(!uniqueforcastDate.includes(forcastDate)) {
                return uniqueforcastDate.push(forcastDate);
            }
        })

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        
        fiveDaysforcast.forEach((weatherItem, index) => {

            if(index===0){
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }else{
 
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
            
        });
    }).catch(()=>{
        alert("An error ocurred while fatching cordinates");
    });
}

const getcityCoordinates=()=>{
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const API_URl =`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(API_URl).then(res =>res.json()).then(data =>{
        if(!data.length) return alert(`No Coordinates found for ${cityName} `);
        const { name, lat, lon } = data[0];
        getWeatherdetails(name, lat, lon);
    }).catch(()=>{
        alert("An error ocurred while fatching cordinates");
    });
}

const getuserCoordinates = ()=>{
    navigator.geolocation.getCurrentPosition(
        position =>{
            console.log(position);
        },
        error =>{
             console.log(error);
        }
    );
}

searchButton.addEventListener("click", getcityCoordinates);

locationButton.addEventListener("click", getuserCoordinates);
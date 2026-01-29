import React, { useRef, useEffect, useState } from 'react'
import './Weather.css'
import searchIcon from '../assets/search.png'
import clearIcon from '../assets/clear.png'
import cloudIcon from '../assets/cloud.png'
import rainIcon from '../assets/rain.png'
import snowIcon from '../assets/snow.png'
import drizzleIcon from '../assets/drizzle.png'
import humidityIcon from '../assets/humidity.png'
import clearNightIcon from '../assets/clear_night.png'
import cloudNightIcon from '../assets/cloud_night.png'
import rainNightIcon from '../assets/rain_night.png'
import snowNightIcon from '../assets/snow_night.png'
import drizzleNightIcon from '../assets/drizzle_night.png'
import windIcon from '../assets/wind.png'

const Weather = () => {

    const inputRef = useRef();

    const [weatherData, setWeatherData] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const allIcons = {
        "01d": clearIcon,
        "02d": cloudIcon,
        "03d": cloudIcon,
        "04d": cloudIcon,
        "09d": drizzleIcon,
        "10d": rainIcon,
        "11d": rainIcon,
        "13d": snowIcon,
        "50d": cloudIcon,
        "01n": clearNightIcon,
        "02n": cloudNightIcon,
        "03n": cloudNightIcon,
        "04n": cloudNightIcon,
        "09n": drizzleNightIcon,
        "10n": rainNightIcon,
        "11n": rainNightIcon,
        "13n": snowNightIcon,
        "50n": cloudNightIcon,
    }

    const search = async(city) => {
        if(city === "") {
            alert("Please enter a city name")
            return;
        };
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const res = await fetch(url);
            const data = await res.json();
            if(!res.ok){
                alert("City not found");
                return;
            }
            console.log(data);
            const icon = allIcons[data.weather[0].icon];
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temp: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
            });

            // Update recent searches
            const newSearch = data.name;
            setRecentSearches(prevSearches => {
                const updatedSearches = [newSearch, ...prevSearches.filter(item => item !== newSearch)].slice(0, 3);
                localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
                return updatedSearches;
            });
            setShowHistory(false); // Close history after search

        } catch (error) {
            setWeatherData(false);
            console.error("Weather fetch error");
        }
    }

    const handleDeleteSearch = (e, cityToDelete) => {
        e.stopPropagation(); // Prevent triggering search on parent click
        setRecentSearches(prevSearches => {
            const updatedSearches = prevSearches.filter(city => city !== cityToDelete);
            localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
            return updatedSearches;
        });
    };

    const handleClearHistory = () => {
        setRecentSearches([]);
        localStorage.removeItem("recentSearches");
    };

    useEffect(() => {
        const savedSearches = localStorage.getItem("recentSearches");
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }
        search("New York");
    }, [])

  return (
    <div className='weather'>
        <div className="searchBar">
            <input 
                ref={inputRef} 
                type="text" 
                placeholder='Search' 
                onClick={() => setShowHistory(!showHistory)}
            />
            <img src={searchIcon} alt="" onClick={() => search(inputRef.current.value)}/>
        </div>
        
        {showHistory && recentSearches.length > 0 && (
            <div className="history-dropdown">
                {recentSearches.map((city, index) => (
                    <div key={index} className="history-item" onClick={() => {
                        inputRef.current.value = city;
                        search(city);
                    }}>
                        <span>{city}</span>
                        <button className="delete-btn" onClick={(e) => handleDeleteSearch(e, city)}>x</button>
                    </div>
                ))}
                <button className="clear-btn" onClick={handleClearHistory}>Clear All</button>
            </div>
        )}

        {weatherData?<>
        <img src={weatherData.icon} alt="" className='weatherIcon' />
        <p className='temp'>{weatherData.temp}°C</p>
        <p className='location'>{weatherData.location}</p>
        <div className="weatherData">
            <div className="col">
                <img src={humidityIcon} alt="" />
                <div>
                    <p>{weatherData.humidity}%</p>
                    <span>Humidity</span>
                </div>
            </div>
            <div className="col">
                <img src={windIcon} alt="" />
                <div>
                    <p>{weatherData.windSpeed} KM/hr</p>
                    <span>Wind Speed</span>
                </div>
            </div>
        </div>
        </>:<></>}
        
    </div>
  )
}

export default Weather
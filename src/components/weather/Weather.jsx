import React, { useEffect, useState } from "react";
import Search from "../search/Search";

const Weather = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

  const fetchWeatherData = async (param) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=d8a56f3b621bc5f948fc15a9da485bf5`
      );
      const data = await response.json();
      if (data) {
        setWeatherData(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchWeatherData(search);
    setSearch("");
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    fetchWeatherData("bangalore");
    setCurrentTime(getCurrentTime());

    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // calculate kelvin Temperature
  const kelvinTemperature = weatherData?.main?.temp;
  const celsiusTemperature =
    kelvinTemperature !== undefined && kelvinTemperature !== null
      ? kelvinTemperature - 273.15
      : null;

  console.log(weatherData);

  return (
    <div>
      <Search
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      {loading ? (
        <div className="loading">loading...</div>
      ) : (
        <div className="main-container">
          <div className="container-city-time">
            <div className="city-name">
              <h1>
                {weatherData?.name}, <span>{weatherData?.sys?.country}</span>
              </h1>
            </div>

            <div className="current-time-date">
              <div className="current-time">
                <span>{currentTime}</span>
              </div>
              <div className="date">
                <span>{getCurrentDate()}</span>
              </div>
            </div>
          </div>

          <div className="temp">
            {celsiusTemperature !== null
              ? `${celsiusTemperature.toFixed(0)} °C`
              : "Temperature not available"}

            <p className="description">
              {weatherData && weatherData.weather && weatherData.weather[0]
                ? weatherData.weather[0].description
                : ""}
            </p>
          </div>

          <div className="weather-info">
            <div className="column">
              <div>
                <p className="wind">
                  {Math.round(weatherData?.wind?.speed)} km/h
                </p>
                <p>Wind Speed</p>
              </div>
            </div>

            <div className="column">
              <div>
                <p className="humidity">{weatherData?.main?.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;

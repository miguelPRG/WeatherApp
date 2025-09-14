import { useEffect, useState } from "react";

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

function Graphics() {
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://ip-api.com/json/")
      .then((res) => res.json())
      .then((data) => {
        setLocation(`${data.city}, ${data.country}`);
        setCoordinates({
          latitude: data.lat,
          longitude: data.lon,
        });
        setError(null);
      })
      .catch(() => {
        setError("Error obtaining location.");
      });
  }, []);

  useEffect(() => {
    if (!coordinates.latitude || !coordinates.longitude) {
      return;
    }

    const cachedWeather = localStorage.getItem("weather");
    if (cachedWeather) {
      setWeather(JSON.parse(cachedWeather));
    } else {
      fetchWeather(coordinates);
    }
  }, [coordinates]);

  async function fetchWeather(coord: Coordinates | null = null, search: string | null = null) {
    if (!coord && !search) {
      setError("No coordinates or search term provided.");
      return;
    }

    const locationParam = coord ? `${coord.latitude},${coord.longitude}` : search;

    fetch(`http://localhost:8000/weather?location=${locationParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setWeather(null);
          setError(data.error);
        } else {
          setWeather(data);
          setError(null);
          localStorage.setItem("weather", JSON.stringify(data));
        }
      })
      .catch(() => {
        setWeather(null);
        setError("Failed to fetch weather data.");
      });
  }

  return (
    <div className="p-10 rounded-lg shadow-md ">
      <h2 className="mb-10">{location}</h2>
      {error && (
        <div className="text-red-500 font-semibold mt-55 text-center text-4xl">{error}</div>
      )}
      <div className="weather-card">
        <h3 className="mb-10">Weather information of the last 5 days</h3>
        {weather && (
          <div className="grid grid-cols-3 gap-5 ">
            <div className="weather-info">
              <h3>Real Temperature</h3>
              <p>{weather.temperature} °C</p>
            </div>
            <div className="weather-info">
              <h3>Humidity</h3>
              <p>{weather.humidity} %</p>
            </div>
            <div className="weather-info">
              <h3>Precipitation Probability</h3>
              <p>{weather.precipitationProbability} %</p>
            </div>
            <div className="weather-info">
              <h3>Wind Speed</h3>
              <p>{weather.windSpeed} km/h</p>
            </div>
            <div className="weather-info">
              <h3>UV Index</h3>
              <p>{weather.uvIndex}</p>
            </div>
            <div className="weather-info">
              <h3>Cloud Cover</h3>
              <p>{weather.cloudCover} %</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Graphics;

import { useLayoutEffect, useState, useEffect } from "react";
import {
  LineChartComponent,
  BarChartComponent,
} from "./Charts";

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

  useLayoutEffect(() => {
    const cachedWeather = localStorage.getItem("weather");
    const location = localStorage.getItem("location");
    
    if (cachedWeather && location) {
      setWeather(JSON.parse(cachedWeather));
      setLocation(location);
      console.log("Using cached weather data.");
      return;
    } else {
      console.log("No cached data found, fetching new data.");
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
    }
  }, []);

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      console.log("Fetching weather data...");
      localStorage.setItem("location", location || "");
      localStorage.setItem("weather", weather); // Clear old weather data
      fetchWeather(coordinates);
    }
  }, [coordinates]);

  async function fetchWeather(
    coord: Coordinates | null = null,
    search: string | null = null,
  ) {
    if (!coord && !search) {
      setError("No coordinates or search term provided.");
      return;
    }

    const locationParam = coord
      ? `${coord.latitude},${coord.longitude}`
      : search;

    fetch(`http://localhost:8000/weather?location=${locationParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setWeather(null);
          setError(data.error);
        } else {
          setWeather(data.timelines.daily);
          setError(null);
          localStorage.setItem("weather", JSON.stringify(data.timelines.daily)); // Corrigido!
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
        <div className="text-red-500 font-semibold mt-55 text-center text-4xl">
          {error}
        </div>
      )}
      <div className="weather-card">
        <h3 className="mb-10">Weather information of the next 5 days</h3>
        {weather && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-5">
            <div className="weather-info">
              <h3>Real Temperature</h3>
              <LineChartComponent
                data={weather.map((day:any) => ({
                  name: new Date(day.time).toLocaleDateString(),
                  Min: day.values.temperatureMin,
                  Avg: day.values.temperatureAvg,
                  Max: day.values.temperatureMax,
                }))}
                YUnits={(value: number) => `${value}°C`}
              />
            </div>
            <div className="weather-info">
              <h3>Humidity</h3>
              <BarChartComponent
                data={weather.map((day: any) => ({
                  name: new Date(day.time).toLocaleDateString(),
                  Min: day.values.humidityMin,
                  Avg: day.values.humidityAvg,
                  Max: day.values.humidityMax,
                }))}
              />
            </div>
            <div className="weather-info">
              <h3>Evapotranspiration Level</h3>
              {/*Gráfico*/}
            </div>
            <div className="weather-info">
              <h3>Wind Speed</h3>
              {/*Gráfico*/}
            </div>
            <div className="weather-info">
              <h3>Cloud Cover</h3>
              {/*Gráfico*/}
            </div>
             <div className="weather-info">
              <h3>UV Index</h3>
              {/*Gráfico*/}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Graphics;

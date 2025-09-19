import { useLayoutEffect, useState, useEffect } from "react";
import * as Chart from './Charts';

function Graphics() {
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    // Sempre buscar localização atual pelo IP
    fetch("http://ip-api.com/json/")
      .then((res) => res.json())
      .then((data) => {
        const currentLocation = `${data.city}, ${data.regionName}, ${data.country}`;
        const cachedLocation = localStorage.getItem("location");
        const cachedWeather = JSON.parse(localStorage.getItem("weather") || "null");

        // Se localização mudou ou não há cache, buscar novos dados
        if (currentLocation !== cachedLocation || !cachedWeather) {
          setLocation(currentLocation);
          localStorage.setItem("location", currentLocation);
          localStorage.removeItem("weather"); // Limpa cache antigo
          console.log("Fetching new weather data.");
        } else {
          // Se localização igual e há cache, verifica validade do cache
          const today = new Date();
          const firstDay = new Date(cachedWeather[0].time);
          firstDay.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          if (firstDay.getTime() !== today.getTime()) {
            localStorage.removeItem("weather");
          }
          setWeather(cachedWeather);
          setLocation(cachedLocation);
          console.log("Using cached weather data.");
        }
      })
      .catch(() => {
        setError("Error obtaining location.");
      });
  }, []);

  useEffect(() => {
    if (location && !weather) {
      fetchWeather(location);
    }
  }, [location]);

  async function fetchWeather(search: string) {

    fetch(`http://localhost:8000/weather?location=${search}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setWeather(null);
          setError(data.error);
        } else {
          setWeather(data.timelines.daily);
          setError(null);
          localStorage.setItem("weather", JSON.stringify(data.timelines.daily)); // Sempre string
          localStorage.setItem("location", search); // Isso salva como [object Object]
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
              <Chart.LineChartComponent
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
              <Chart.BarChartComponent
                data={weather.map((day: any) => ({
                  name: new Date(day.time).toLocaleDateString(),
                  Min: day.values.humidityMin,
                  Avg: day.values.humidityAvg,
                  Max: day.values.humidityMax,
                }))}
                YUnits={(value: number) => `${value}%`}
              />
            </div>
            <div className="weather-info">
              <h3>Evapotranspiration</h3>
              <Chart.AreaChartComponent
                data={weather.map((day: any) => ({
                  name: new Date(day.time).toLocaleDateString(),
                  Min: day.values.evapotranspirationMin,
                  Avg: day.values.evapotranspirationAvg,
                  Max: day.values.evapotranspirationMax,
                }))}
                YUnits={(value: number) => `${value} mm`}
              />
            </div>
            <div className="weather-info">
              <h3>Cloud Cover</h3>
              <Chart.ComposedChartComponent
                data={weather.map((day: any) => ({
                  name: new Date(day.time).toLocaleDateString(),
                  Min: day.values.cloudCoverMin,
                  Avg: day.values.cloudCoverAvg,
                  Max: day.values.cloudCoverMax,
                }))}
                YUnits={(value: number) => `${value} %`}
              />
            </div>
            <div className="weather-info">
              <h3>Wind Speed</h3>
              <Chart.RadialBarChartComponent
              data={weather.map((day: any, idx: number) => ({
                name: new Date(day.time).toLocaleDateString(),
                Min: day.values.windSpeedMin,
                Avg: day.values.windSpeedAvg,
                Max: day.values.windSpeedMax,
                fill: ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57"][idx % 6],
              }))}
              YUnits={(value: number) => `${value} km/h`}
              />
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

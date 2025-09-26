import { useWeather } from "../hooks/WeatherContext";
import * as Chart from "./Charts";

function Graphics() {
  const { location, weather, error, loading } = useWeather();

  return (
    <div className="p-10 rounded-lg shadow-md ">
      <h2 className="mb-10">{location}</h2>
      {loading && (
        <div className="flex flex-col items-center justify-center my-10">
          <svg
            className="animate-spin h-12 w-12 text-blue-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <span className="text-blue-700 text-xl font-semibold">
            {
              [
                "Consulting the weather gods... ⛅",
                "Checking if it will rain or shine... ☀️🌧️",
                "Fetching atmospheric data... 🌎",
                "Preparing weather charts... 📊",
                "Please wait, analyzing the weather... ⏳",
              ][Math.floor(Math.random() * 5)]
            }
          </span>
        </div>
      )}
      {error && (
        <div className="text-red-500 font-semibold mt-55 text-center text-4xl">
          {error}
        </div>
      )}
      <div className="weather-card max-w-6xl mx-auto min-w-xm">
        <h3 className="mb-10">Weather information of the next 5 days</h3>
        {weather && !loading && (
          <div className="grid lg:grid-cols-2 gap-x-5 gap-y-5 grid-cols-1 ">
            <div className="weather-info">
              <h3>Real Temperature</h3>
              <Chart.LineChartComponent
                data={weather.map((day: any) => ({
                  day: new Date(day.time).getDate(),
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
                  day: new Date(day.time).getDate(),
                  Min: day.values.humidityMin,
                  Avg: day.values.humidityAvg,
                  Max: day.values.humidityMax,
                }))}
                YUnits={(value: number) => `${value}%`}
              />
            </div>
            <div className="weather-info">
              <h3 className="break-all">Evapotranspiration</h3>
              <Chart.AreaChartComponent
                data={weather.map((day: any) => ({
                  day: new Date(day.time).getDate(),
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
                  day: new Date(day.time).getDate(), // Apenas o dia do mês
                  Min: day.values.cloudCoverMin,
                  Avg: day.values.cloudCoverAvg,
                  Max: day.values.cloudCoverMax,
                }))}
                YUnits={(value: number) => `${value} %`}
              />
            </div>
            <div className="weather-info">
              <h3>Avarage Wind Speed</h3>
              <Chart.SimpleRadarChartComponent
                data={weather.map((day: any) => ({
                  day: new Date(day.time).getDate(), // Apenas o dia do mês
                  Avg: day.values.windSpeedAvg,
                }))}
                YUnits={(value: number) => `${value} km/h`}
              />
            </div>
            <div className="weather-info">
              <h3>UV Radiation</h3>
              <Chart.ScatterChartComponent
                data={weather.map((day: any) => ({
                  day: new Date(day.time).getDate(), // Apenas o dia do mês
                  Min: day.values?.uvIndexMin ? day.values.uvIndexMin : 0,
                  Avg: day.values?.uvIndexAvg ? day.values.uvIndexAvg : 0,
                  Max: day.values?.uvIndexMax ? day.values.uvIndexMax : 0,
                }))}
                YUnits={(value: number) => `${value}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Graphics;

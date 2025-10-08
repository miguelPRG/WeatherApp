import { useWeather } from "../hooks/WeatherContext";
import { lazy, Suspense } from "react";
import LoadingAnimation from "./LoadingAnimation";

const Chart = {
  LineChartComponent: lazy(() =>
    import("./Charts").then((m) => ({ default: m.LineChartComponent })),
  ),
  BarChartComponent: lazy(() =>
    import("./Charts").then((m) => ({ default: m.BarChartComponent })),
  ),
  AreaChartComponent: lazy(() =>
    import("./Charts").then((m) => ({ default: m.AreaChartComponent })),
  ),
  ComposedChartComponent: lazy(() =>
    import("./Charts").then((m) => ({ default: m.ComposedChartComponent })),
  ),
  SimpleRadarChartComponent: lazy(() =>
    import("./Charts").then((m) => ({ default: m.SimpleRadarChartComponent })),
  ),
  ScatterChartComponent: lazy(() =>
    import("./Charts").then((m) => ({ default: m.ScatterChartComponent })),
  ),
};

function Graphics() {
  const { location, weather, error, loading } = useWeather();

  return (
    <div className="p-10 rounded-lg shadow-md ">
      <h2 className="mb-10">{location}</h2>
      {loading && <LoadingAnimation />}
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
              <Suspense fallback={<LoadingAnimation />}>
                <Chart.LineChartComponent
                  data={weather.map((day: any) => ({
                    day: new Date(day.time).getDate(),
                    Min: day.values.temperatureMin,
                    Avg: day.values.temperatureAvg,
                    Max: day.values.temperatureMax,
                  }))}
                  YUnits={(value: number) => `${value}°C`}
                />
              </Suspense>
            </div>
            <div className="weather-info">
              <h3>Humidity</h3>
              <Suspense fallback={<LoadingAnimation />}>
                <Chart.BarChartComponent
                  data={weather.map((day: any) => ({
                    day: new Date(day.time).getDate(),
                    Min: day.values.humidityMin,
                    Avg: day.values.humidityAvg,
                    Max: day.values.humidityMax,
                  }))}
                  YUnits={(value: number) => `${value}%`}
                />
              </Suspense>
            </div>
            <div className="weather-info">
              <h3 className="break-all">Evapotranspiration</h3>
              <Suspense fallback={<LoadingAnimation />}>
                <Chart.AreaChartComponent
                  data={weather.map((day: any) => ({
                    day: new Date(day.time).getDate(),
                    Min: day.values.evapotranspirationMin,
                    Avg: day.values.evapotranspirationAvg,
                    Max: day.values.evapotranspirationMax,
                  }))}
                  YUnits={(value: number) => `${value} mm`}
                />
              </Suspense>
            </div>
            <div className="weather-info">
              <h3>Cloud Cover</h3>
              <Suspense fallback={<LoadingAnimation />}>
                <Chart.ComposedChartComponent
                  data={weather.map((day: any) => ({
                    day: new Date(day.time).getDate(),
                    Min: day.values.cloudCoverMin,
                    Avg: day.values.cloudCoverAvg,
                    Max: day.values.cloudCoverMax,
                  }))}
                  YUnits={(value: number) => `${value} %`}
                />
              </Suspense>
            </div>
            <div className="weather-info">
              <h3>Avarage Wind Speed</h3>
              <Suspense fallback={<LoadingAnimation />}>
                <Chart.SimpleRadarChartComponent
                  data={weather.map((day: any) => ({
                    day: new Date(day.time).getDate(),
                    Avg: day.values.windSpeedAvg,
                  }))}
                  YUnits={(value: number) => `${value} km/h`}
                />
              </Suspense>
            </div>
            <div className="weather-info">
              <h3>UV Radiation</h3>
              <Suspense fallback={<LoadingAnimation />}>
                <Chart.ScatterChartComponent
                  data={weather.map((day: any) => ({
                    day: new Date(day.time).getDate(),
                    Min: day.values?.uvIndexMin ? day.values.uvIndexMin : 0,
                    Avg: day.values?.uvIndexAvg ? day.values.uvIndexAvg : 0,
                    Max: day.values?.uvIndexMax ? day.values.uvIndexMax : 0,
                  }))}
                  YUnits={(value: number) => `${value} UVI`}
                />
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Graphics;

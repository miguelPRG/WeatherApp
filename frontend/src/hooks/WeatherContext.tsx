import { createContext, useContext, useState, useEffect } from "react";

type WeatherContextType = {
  location: string | null;
  weather: any;
  error: string | null;
  loading: boolean;
  searchWeather: (loc: string) => Promise<void>;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: any }) => {
  const [location, setLocation] = useState<string | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true); // <- Adicionado para garantir loading no início
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      const city = data.city;
      const region = data.region;
      const country = data.country_name;
      setLocation(`${city}, ${region}, ${country}`);

      const storedWeather = localStorage.getItem("weather");
      let freshWeather;

      try {
        if (storedWeather) {
          const weatherData = JSON.parse(storedWeather);
          const today = new Date();
          if (
            Array.isArray(weatherData) &&
            weatherData.length > 0 &&
            weatherData[0]?.time
          ) {
            const firstDay = new Date(weatherData[0].time);
            if (
              firstDay.getDate() === today.getDate() &&
              firstDay.getMonth() === today.getMonth() &&
              firstDay.getFullYear() === today.getFullYear()
            ) {
              setWeather(weatherData);
              freshWeather = weatherData;
            } else {
              freshWeather = await fetchWeather(city);
              setWeather(freshWeather);
              setError(null);
            }
          } else {
            // Cache inválido, buscar novamente
            freshWeather = await fetchWeather(city);
            setWeather(freshWeather);
            setError(null);
          }
        } else {
          console.log("No stored weather data found.");
          freshWeather = await fetchWeather(city);
          setWeather(freshWeather);
          setError(null);
        }

        localStorage.setItem("weather", JSON.stringify(freshWeather));
      } catch (err: any) {
        setWeather(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // This one we don't need to share, so it's inside the provider
  async function fetchWeather(search: string) {
    try {
      console.log("Fetching weather for:", search);
      const res = await fetch(
        `https://weatherapp-69gt.onrender.com/weather?location=${search}`,
      );
      const data = await res.json();

      console.log(data)

      if (data.error) {
        throw new Error(data.error);
      }

      return data.timelines.daily;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch weather data.");
    }
  }

  const searchWeather = async (loc: string) => {
    try {
      setLoading(true);
      const data = await fetchWeather(loc);
      setWeather(data);
      setError(null);
      setLocation(loc);
    } catch (err: any) {
      setWeather(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeatherContext.Provider
      value={{ location, weather, error, searchWeather, loading }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context)
    throw new Error("useWeather must be used within WeatherProvider");
  return context;
};

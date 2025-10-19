import { createContext, useContext, useState, useEffect } from "react";

type WeatherContextType = {
  location: string | null;
  weather: any;
  error: string | null;
  progress: number;
  searchWeather: (loc: string) => Promise<void>;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: any }) => {
  const [progress, setProgress] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Interval to simulate progress
  useEffect(() => {
    if (!isFetching) return;

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.floor(Math.random() * 15), 95));
    }, 300);

    return () => clearInterval(interval);
  }, [isFetching]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Check localStorage for cached data
        const storedWeather = localStorage.getItem("weather");
        const storedLocation = localStorage.getItem("location");

        if (storedWeather && storedLocation) {
          const weatherData = JSON.parse(storedWeather);
          const today = new Date();
          const firstDay = new Date(weatherData[0]?.time);

          if (
            firstDay.getDate() === today.getDate() &&
            firstDay.getMonth() === today.getMonth() &&
            firstDay.getFullYear() === today.getFullYear()
          ) {
            setLocation(storedLocation);
            setWeather(weatherData);
            setProgress(100);
            return;
          }
        }

        let city, region, country;

        // In order to get user's location via Geolocation API, the user must grant permission
        const position = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
        );

        const { latitude, longitude } = position.coords;

        const reverseRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const reverseData = await reverseRes.json();

        city = reverseData.address.city || reverseData.address.town || reverseData.address.village;
        region = reverseData.address.county;
        country = reverseData.address.country;

        const currentLocation = `${city}, ${region}, ${country}`;
        setLocation(currentLocation);

        // Fetch weather data for the determined location
        const freshWeather = await fetchWeather(city);
        setWeather(freshWeather);

        localStorage.setItem("weather", JSON.stringify(freshWeather));
        localStorage.setItem("location", currentLocation);
      } catch (geoError) {
        console.warn("GPS failed:", geoError);
        setError("Could not get location");
        setProgress(0);
      }
    };

    fetchInitialData();
  }, []);

  async function fetchWeather(search: string) {
    try {

      if(progress !== 0){
        setProgress(0);
      }

      setIsFetching(true);

      const res = await fetch(
        `https://weatherapp-3tl7.onrender.com/weather?location=${encodeURIComponent(search)}`
      );
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setProgress(100);
      return data.timelines.daily;
    } catch (err: any) {
      setProgress(0);
      throw new Error("Failed to fetch weather data");
    } finally {
      setIsFetching(false);
    }
  }

  const searchWeather = async (loc: string) => {
    try {
      const data = await fetchWeather(loc);
      setWeather(data);
      setError(null);
      setLocation(loc);
    } catch (err: any) {
      setWeather(null);
      setError(err.message);
      setProgress(0);
    }
  };

  return (
    <WeatherContext.Provider value={{ location, weather, error, progress, searchWeather }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error("useWeather must be used within WeatherProvider");
  return context;
};

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
    // Getting initial location and weather data
    const fetchInitialData = async () => {
      setLoading(true);

      try {
        // First check if there's data in localStorage
        const storedWeather = localStorage.getItem("weather");
        const storedLocation = localStorage.getItem("location");

        if (storedWeather && storedLocation) {
          const weatherData = JSON.parse(storedWeather);
          const today = new Date();
          const firstDay = new Date(weatherData[0]?.time);

          // If the data is from today, use stored data
          if (
            firstDay.getDate() === today.getDate() &&
            firstDay.getMonth() === today.getMonth() &&
            firstDay.getFullYear() === today.getFullYear()
          ) {
            setLocation(storedLocation);
            setWeather(weatherData);
            setLoading(false);
            return;
          }
        }

        // If there's no valid data in localStorage, get current location
        let city, region, country;

        // Try via GPS
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
          });
        });

        const { latitude, longitude } = position.coords;

        // Reverse geocoding to get city name
        const reverseRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const reverseData = await reverseRes.json();

        city = reverseData.address.city || reverseData.address.town || reverseData.address.village;
        region = reverseData.address.county;
        country = reverseData.address.country;

        const currentLocation = `${city}, ${region}, ${country}`;
        setLocation(currentLocation);

        // Fetch weather data for current location
        const freshWeather = await fetchWeather(city);
        setWeather(freshWeather);
        
        // Save to localStorage
        localStorage.setItem("weather", JSON.stringify(freshWeather));
        localStorage.setItem("location", currentLocation);

      } catch (geoError) {
        console.warn("GPS failed:", geoError);
        setError("Could not get location");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  async function fetchWeather(search: string) {
    try {
      const res = await fetch(
        `https://weatherapp-69gt.onrender.com/weather?location=${encodeURIComponent(search)}`
      );
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      return data.timelines.daily;
    } catch (error: any) {
      throw new Error("Failed to fetch weather data");
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
    <WeatherContext.Provider value={{ location, weather, error, searchWeather, loading }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error("useWeather must be used within WeatherProvider");
  return context;
};

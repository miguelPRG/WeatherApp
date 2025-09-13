import { useEffect, useState } from "react";

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

function Graphics() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
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
        setLocation("Não foi possível obter a localização pelo IP.");
        setError("Erro ao obter localização.");
      });
  }, []);

  useEffect(() => {
    if (!coordinates.latitude || !coordinates.longitude) {
      return;
    }
    fetch(`http://localhost:8000/weather?location=${coordinates.latitude},${coordinates.longitude}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setWeather(null);
          setError(data.error);
        } else {
          setWeather(data);
          setError(null);
        }
      })
      .catch(() => {
        setWeather(null);
        setError("Failed to fetch weather data.");
      });
  }, [coordinates]);

  return (
    <div className="p-4 rounded-lg shadow-md ">
      <h2>Weather in {location}</h2>
      {error && (
        <div className="text-red-500 font-semibold mt-55 text-center text-4xl">{error}</div>
      )}
      {weather ? (
        <pre>{JSON.stringify(weather, null, 2)}</pre>
      ) : !error ? (
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-400 m-auto mt-55 "></div>
      ) : null}
    </div>
  );
}

export default Graphics;

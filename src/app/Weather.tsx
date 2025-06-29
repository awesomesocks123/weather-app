"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import ColorPalette from "./ColorPalette";

export default function Weather() {
  const [inputCity, setInputCity] = useState("");
  const [suggestions, setSuggestions] = useState<
    { name: string; region: string; country: string }[]
  >([]);
  const [city, setCity] = useState("New York City");
  const [weatherData, setWeatherData] = useState<{
    condition: string;
    tempF: number;
    icon: string;
  } | null>(null);

  // Fetch weather when city changes
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await res.json();
        console.log('Weather API response:', data);

        if (data.error) throw new Error(data.error);

        setWeatherData({
          condition: data.current.condition.text,
          tempF: data.current.temp_f,
          icon: data.current.condition.icon,
        });
      } catch (err) {
        console.error("Error fetching weather:", err);
        setWeatherData(null);
      }
    };

    fetchWeather();
  }, [city]);
  // Debounce city search suggestions
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputCity.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      fetch(`/api/search?q=${encodeURIComponent(inputCity)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setSuggestions(data);
          else setSuggestions([]);
        })
        .catch(() => setSuggestions([]));
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputCity]);

  // Submit handler (enter or button click)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      setInputCity("");
      setSuggestions([]);
    }
  };

  // When clicking from suggestion dropdown
  const handleSelectSuggestion = (selectedCity: string) => {
    setCity(selectedCity);
    setInputCity("");
    setSuggestions([]);
  };

  // Background gradient based on weather condition
  const getGradient = (condition: string): string => {
    const c = condition.toLowerCase();
    if (c.includes("sun")) return "from-yellow-300 to-orange-500";
    if (c.includes("rain")) return "from-blue-400 to-blue-800";
    if (c.includes("snow")) return "from-white to-gray-300";
    if (c.includes("cloud")) return "from-gray-400 to-gray-600";
    return "from-sky-300 to-indigo-400";
  };

  const gradient = weatherData
    ? getGradient(weatherData.condition)
    : "from-slate-100 to-slate-300";

  return (
    <div
      className={`h-screen flex flex-col items-center justify-center bg-gradient-to-r ${gradient} gap-6 px-4`}
    >
      <div className="bg-black/50 text-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-primary-content text-center">
          Weather-Based Outfit Color Palette
        </h1>
        <p>
          Try these weather-based either single or dual color combos to add some flair to your fit.
        </p>
      </div>

      {/* City Search Input */}
      <form
        onSubmit={handleSubmit}
        className="form-control w-full max-w-xs relative"
      >
        <div className="join w-full">
          <input
            type="text"
            placeholder="Enter a city"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            className="input input-bordered join-item w-full"
          />
          <button type="submit" className="btn btn-primary join-item">
            Search
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-base-200 border rounded-box shadow z-10 mt-1 max-h-60 overflow-y-auto">
            {suggestions.map((city, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(city.name)}
                  className="w-full text-left px-4 py-2 hover:bg-base-300"
                >
                  {city.name}, {city.region}, {city.country}
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Weather & Palette Display */}
      <div
        className="max-w-lg mx-auto text-center grid grid-cols-1 place-items-center text-white"
        id="weather"
      >
        {weatherData ? (
          <>
            <h2 className="text-lg font-semibold">Weather in {city}</h2>
            <p>Condition: {weatherData.condition}</p>
            <p>Temperature: {weatherData.tempF}°F</p>
            <Image
              src={`https:${weatherData.icon}`}
              height={100}
              width={100}
              alt={weatherData.condition}
            />
            <ColorPalette />
          </>
        ) : (
          <div className="bg-black/50 text-white p-4 rounded shadow">
            <p className="text-white">Loading weather data...</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
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

  const getWeatherEmoji = (condition: string): string => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return '☀️';
    if (lowerCondition.includes('cloud')) return '☁️';
    if (lowerCondition.includes('rain')) return '🌧️';
    if (lowerCondition.includes('snow')) return '❄️';
    if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) return '⛈️';
    if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return '🌫️';
    if (lowerCondition.includes('wind')) return '💨';
    if (lowerCondition.includes('overcast')) return '☁️';
    return '🌡️'; 
  }; 

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
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-r ${gradient} gap-6 px-2 sm:px-4 py-4`}
    >
      <div className="bg-black/50 text-white p-3 sm:p-4 rounded shadow w-full max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold text-primary-content text-center">
          Weather-Based Outfit Color Palette
        </h1>
        <p className="text-sm sm:text-base text-center">
          Try these weather-based either single or dual color combos to add some flair to your fit.
        </p>
      </div>

      {/* City Search Input */}
      <form
  onSubmit={handleSubmit}
  className="w-full max-w-xs relative"
  autoComplete="off"
>
  <div className="flex w-full">
    <input
      type="text"
      placeholder="Enter a city"
      value={inputCity}
      onChange={(e) => setInputCity(e.target.value)}
      className="flex-grow px-4 py-2 sm:py-3 text-base border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <button 
      type="submit" 
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:py-3 text-base font-medium rounded-r-md transition-colors duration-200"
    >
      Search
    </button>
  </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1 max-h-48 sm:max-h-60 overflow-y-auto text-sm">
            {suggestions.map((city, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(city.name)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-slate-800"
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
        className="max-w-lg mx-auto text-center grid grid-cols-1 place-items-center text-slate-900 bg-white p-3 sm:p-4 rounded shadow w-full"
        id="weather"
      >
        {weatherData ? (
          <>
            <h2 className="text-lg font-semibold">Weather in {city} {weatherData.condition && getWeatherEmoji(weatherData.condition)}</h2>
            <p>Condition: {weatherData.condition}</p>
            <p className="pb-3">Temperature: {weatherData.tempF}°F </p>
            <p className="text-xs text-slate-500 mb-2">Color palettes powered by <a href="https://github.com/mattdesl/dictionary-of-colour-combinations" className="underline hover:text-white" target="_blank" rel="noopener noreferrer">dictionary-of-colour-combinations</a></p>
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

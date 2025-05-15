'use client'
import { useEffect, useState } from "react";
import Image from 'next/image'
import ColorPalette from "./ColorPalette";

export default function Weather() {
  const [weatherData, setWeatherData] = useState<{
    condition: string;
    tempC: number;
    icon: string;
  } | null>(null);

  useEffect(() => {
    const apiKey = '4161a295932c4b47b77212947251505';
    const city = 'New York City';
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    async function fetchWeather() {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setWeatherData({
          condition: data.current.condition.text,
          tempF: data.current.temp_f,
          icon: data.current.condition.icon,
        });
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      }
    }

    fetchWeather();
  }, []);

  return (
    <div className="grid grid-cols-1 mx-auto place-items-center">
      <h1 className="text-xl font-bold mb-2">Welcome to the daily weather app outfit color palette</h1>
      <p className="mb-4">Enter your weather and see the color palette for your outfit today</p>
      <div className="max-w-lg mx-auto text-center" id="weather">
        {weatherData ? (
          <>
            <h2 className="text-lg font-semibold">Weather in New York City</h2>
            <p>Condition: {weatherData.condition}</p>
            <p>Temperature: {weatherData.tempF}°F</p>
            <Image src={`https:${weatherData.icon}`} height={50} width={50} alt={weatherData.condition} />
          </>
        ) : (
          <p>Loading weather data...</p>
        )}
        <ColorPalette/>
      </div>
    </div>
  );
}

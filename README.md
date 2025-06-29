# Weather-Based Outfit Color Palette

Check it out here: [https://weather-l4er3lgdn-sdfs-projects-23d4ae34.vercel.app/](https://weather-l4er3lgdn-sdfs-projects-23d4ae34.vercel.app/)

A modern web app that suggests color palettes for outfits based on live weather conditions in any city worldwide.

## Features
- Search for any city and view current weather conditions
- Get AI-inspired, weather-based color palette suggestions for your outfit
- Fast city search with autocomplete suggestions
- Clean, mobile-friendly UI

## Tech Stack
- **Frontend:** React 19, Next.js 15 (App Router), Tailwind CSS, DaisyUI
- **Backend/API:** Next.js API Routes (Edge/serverless functions)
- **Weather Data:** [WeatherAPI.com](https://weatherapi.com)
- **Deployment:** Vercel

## How It Works
1. Enter a city name to get instant suggestions.
2. Select a city to see live weather and a color palette for your outfit.
3. All weather data is securely fetched via backend API routes.

## Getting Started
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Add your WeatherAPI key to `.env.local`:
   ```env
   WEATHER_API_KEY=your_api_key_here
   ```
3. Run locally:
   ```bash
   npm run dev
   ```
4. Deploy to Vercel for production.

---

**Created with Next.js, React, and Tailwind CSS.**

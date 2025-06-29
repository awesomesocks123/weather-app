"use client";
import { useState, useEffect } from "react";
// Import the dictionary-of-colour-combinations package
import colorData from "dictionary-of-colour-combinations";

// Define types for the color data based on the actual structure
interface ColorData {
  name: string;
  combinations: number[];
  swatch: number;
  cmyk: number[];
  lab: number[];
  rgb: number[];
  hex: string;
}

export default function ColorPalette() {
  // State for selected palette and color
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number | null>(null);
  
  // Process the color data to create palettes
  const colorMap = (colorData as ColorData[]).reduce((map: Map<number, number[]>, color: ColorData, i: number) => {
    color.combinations.forEach((id: number) => {
      if (map.has(id)) map.get(id)?.push(i);
      else map.set(id, [i]);
    });
    return map;
  }, new Map());
  
  const palettes = [...colorMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(e => e[1]);

  // Select a random palette on mount
  useEffect(() => {
    shuffle();
    // eslint-disable-next-line
  }, []);

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  function shuffle() {
    const newIndex = getRandomInt(palettes.length);
    setSelectedPaletteIndex(newIndex);
  }

  if (selectedPaletteIndex === null) return null;

  // Get the selected palette and its colors
  const selectedPalette = palettes[selectedPaletteIndex];
  const paletteColors = selectedPalette.map((colorIndex: number) => (colorData as ColorData[])[colorIndex]);

  return (
    <div className="flex flex-col items-center w-full space-y-10">
      {/* Main Color Block - First color in palette */}
      <div className="w-full max-w-4xl flex flex-col items-center mb-6">
        <div
          className="w-full h-36 sm:h-48 rounded flex items-center justify-center text-2xl sm:text-3xl font-semibold text-black"
          style={{ background: paletteColors[0]?.hex }}
        >
          {paletteColors[0]?.name}
        </div>
      </div>

      {/* Combination Row */}
      <div className="flex flex-col gap-4 w-full max-w-4xl">
        <div className="flex items-center w-full mb-4">
          <div className="flex flex-1 h-20 rounded overflow-hidden">
            {paletteColors.map((color: ColorData, i: number) => (
              <div
                key={i}
                className="flex-1 h-full"
                style={{ background: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
        
        <button
          onClick={shuffle}
          className="mt-4 px-4 py-2 rounded bg-black text-white shadow"
        >
          Shuffle Combination
        </button>
      </div>
    </div>
  );
}
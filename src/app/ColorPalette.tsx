"use client";
import colors from "@/app/data/colors.json";
import { useEffect, useState } from "react";

export default function ColorPalette() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedIndex(getRandomInt(colors.colors.length));
  }, []);

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const shuffle = () => {
    let newIndex = getRandomInt(colors.colors.length);
    while (newIndex === selectedIndex) {
      newIndex = getRandomInt(colors.colors.length);
    }
    setSelectedIndex(newIndex);
  };

  if (selectedIndex === null) return null;

  const selectedColor = colors.colors[selectedIndex];
  const comboColors = selectedColor.combinations
    .map((index) => colors.colors[index - 1])
    .filter(Boolean);

  // Fill up to 6 total colors
  const colorBlocks = [selectedColor, ...comboColors]
    .concat(Array(6).fill(null))
    .slice(0, 6);

  const handleCopy = () => {
    const hexList = colorBlocks
      .filter(Boolean)
      .map((c) => c.hex)
      .join(", ");
    navigator.clipboard.writeText(hexList).then(() => {
      alert("Copied to clipboard:\n" + hexList);
    });
  };

  return (
    <div className="space-y-4 flex flex-col items-center">
      {/* Color Grid */}
      <div className="grid grid-cols-2 gap-2 h-[500px]">
        {colorBlocks.map((color, i) =>
          color ? (
            <div
              key={i}
              className="flex flex-col items-center justify-center text-center"
            >
              <div
                className="w-34 h-30 rounded shadow"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-sm mt-2 text-white">{color.name}</span>
            </div>
          ) : (
            <div key={i} className="invisible w-28 h-16" />
          )
        )}
      </div>

      {/* Buttons fixed in place below */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={shuffle}
          className="btn bg-black text-white px-4 py-1 rounded shadow"
        >
          Shuffle
        </button>
        <button
          onClick={handleCopy}
          className="btn bg-white text-black px-4 py-1 rounded shadow"
        >
          Copy HEX Codes
        </button>
      </div>
    </div>
  );
}

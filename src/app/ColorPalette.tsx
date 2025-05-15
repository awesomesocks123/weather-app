'use client'
import colors from "@/app/data/colors.json";
import { useState } from "react";

export default function ColorPalette() {
    const [selectedIndex, setSelectedIndex] = useState(()=> getRandomInt(colors.colors.length))

    function getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
      }

    const selectedColor = colors.colors[selectedIndex]
    const comboColors = selectedColor.combinations.map(index => colors.colors[index - 1]).filter(color => color !== undefined);
    
    if (!selectedColor || !comboColors) return null;

    const shuffle = () => {
        let newIndex = getRandomInt(colors.colors.length)
        while (newIndex === selectedIndex) {
            newIndex = getRandomInt(colors.colors.length)
        }
        setSelectedIndex(newIndex)
    }


  return (
    <div className="space-y-4">
        <div className="grid grid-cols-2 max-w-md max-h-sm">
            <div style={{backgroundColor: selectedColor.hex}}>
                {selectedColor.name}
            </div>
            {comboColors.map((color,i)=> (
                <div key={i} style={{backgroundColor: color.hex }}>
                {color.name}
            </div>
            ))}
        </div>
        <button onClick={shuffle} className="bg-amber-200 px-5 py-1 rounded-xl cursor-pointer">Shuffle</button>
    </div>
  );
}

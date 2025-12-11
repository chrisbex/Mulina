import React, { useState, useMemo } from 'react';
import { Floss, Brand } from '../types';
import FlossCard from './FlossCard';
import { colorDistance } from '../utils/colorUtils';

interface ColorPickerTabProps {
  database: Floss[];
}

const ColorPickerTab: React.FC<ColorPickerTabProps> = ({ database }) => {
  const [color, setColor] = useState('#e11d48'); // Domyślny różowy (rose-600)

  const closestFloss = useMemo(() => {
    if (database.length === 0) return null;

    let closest: Floss | null = null;
    let minDist = Infinity;

    database.forEach(floss => {
      if (!floss.hex) return;
      const dist = colorDistance(color, floss.hex);
      if (dist < minDist) {
        minDist = dist;
        closest = floss;
      }
    });

    return closest;
  }, [color, database]);

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <h2 className="text-gray-800 font-bold text-lg mb-2">Wybierz kolor</h2>
          <p className="text-gray-400 text-xs mb-6 max-w-xs">
            Kliknij w kółko poniżej, aby otworzyć paletę i wskazać kolor, którego szukasz.
          </p>
          
          <div className="relative group cursor-pointer">
            <input 
              type="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-32 h-32 cursor-pointer z-10"
              aria-label="Wybierz kolor"
            />
            <div 
              className="w-32 h-32 rounded-full shadow-lg border-4 border-white ring-2 ring-gray-100 transition-transform group-hover:scale-105 flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: color }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white/80 drop-shadow-md">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
                </svg>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col items-center">
             <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Twój kod HEX</span>
             <span className="font-mono text-gray-600 bg-gray-50 px-3 py-1 rounded-md text-sm mt-1 border border-gray-100">
                {color.toUpperCase()}
             </span>
          </div>
       </div>

       {closestFloss ? (
         <div className="transition-all duration-500">
           <h3 className="text-sm font-semibold text-gray-500 mb-3 ml-1 flex items-center gap-2">
             <span>🎯 Najbliższy odpowiednik w bazie:</span>
           </h3>
           <FlossCard 
              floss={closestFloss} 
              sourceBrand={Brand.DMC} 
              targetBrand={Brand.ARIADNA} 
            />
         </div>
       ) : (
           <div className="text-center text-gray-400 text-sm mt-8">Brak kolorów w bazie.</div>
       )}
    </div>
  );
};
export default ColorPickerTab;
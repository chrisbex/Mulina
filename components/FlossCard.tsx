import React from 'react';
import { Floss, Brand } from '../types';

interface FlossCardProps {
  floss: Floss;
  sourceBrand: Brand;
  targetBrand: Brand;
}

const FlossCard: React.FC<FlossCardProps> = ({ floss, sourceBrand, targetBrand }) => {
  const getCode = (brand: Brand, f: Floss) => {
    switch (brand) {
      case Brand.DMC: return f.dmc;
      case Brand.ANCHOR: return f.anchor;
      case Brand.ARIADNA: return f.ariadna;
      default: return '?';
    }
  };

  const sourceCode = getCode(sourceBrand, floss);
  const targetCode = getCode(targetBrand, floss);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 transition-transform active:scale-95">
      {/* Color Circle */}
      <div 
        className="w-16 h-16 rounded-full shadow-inner border-2 border-white ring-1 ring-gray-100 shrink-0"
        style={{ backgroundColor: floss.hex }}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-800 truncate">{floss.namePl}</h3>
          <span className="text-xs text-gray-400 font-mono">{floss.hex}</span>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase">{sourceBrand}</span>
                <span className="font-mono text-lg text-gray-600 font-medium line-through decoration-rose-500/50 decoration-2">{sourceCode}</span>
            </div>
            
            <div className="text-gray-300">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
            </div>

            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase">{targetBrand}</span>
                <span className="font-mono text-2xl text-rose-600 font-bold">{targetCode}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FlossCard;

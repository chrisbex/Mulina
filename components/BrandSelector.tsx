import React from 'react';
import { Brand } from '../types';

interface BrandSelectorProps {
  label: string;
  selected: Brand;
  onChange: (brand: Brand) => void;
  exclude?: Brand;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({ label, selected, onChange, exclude }) => {
  const brands = Object.values(Brand).filter(b => b !== exclude);

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => onChange(brand)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              selected === brand
                ? 'bg-rose-100 text-rose-700 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrandSelector;

import React, { useState, useMemo } from 'react';
import { Brand, Floss } from '../types';
import BrandSelector from './BrandSelector';
import FlossCard from './FlossCard';
import DataImporter from './DataImporter';

interface ConverterTabProps {
  database: Floss[];
  onUpdateDatabase: (data: Floss[]) => void;
}

const ConverterTab: React.FC<ConverterTabProps> = ({ database, onUpdateDatabase }) => {
  const [sourceBrand, setSourceBrand] = useState<Brand>(Brand.DMC);
  const [targetBrand, setTargetBrand] = useState<Brand>(Brand.ARIADNA);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFlosses = useMemo(() => {
    if (!searchQuery) return database;
    
    const lowerQuery = searchQuery.toLowerCase();
    
    return database.filter(f => {
      // Check codes based on selected source brand first for better relevance
      let codeMatch = false;
      if (sourceBrand === Brand.DMC) codeMatch = f.dmc.toLowerCase().includes(lowerQuery);
      else if (sourceBrand === Brand.ANCHOR) codeMatch = f.anchor.toLowerCase().includes(lowerQuery);
      else if (sourceBrand === Brand.ARIADNA) codeMatch = f.ariadna.toLowerCase().includes(lowerQuery);
      
      // Also search by name
      const nameMatch = f.name.toLowerCase().includes(lowerQuery) || f.namePl.toLowerCase().includes(lowerQuery);
      
      return codeMatch || nameMatch;
    });
  }, [searchQuery, sourceBrand, database]);

  return (
    <div className="space-y-6">
      
      {/* Import Section */}
      <DataImporter onImport={onUpdateDatabase} />

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <BrandSelector 
            label="Z (Firma Źródłowa)" 
            selected={sourceBrand} 
            onChange={setSourceBrand} 
          />
          <BrandSelector 
            label="Do (Firma Docelowa)" 
            selected={targetBrand} 
            onChange={setTargetBrand}
            exclude={sourceBrand} 
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
            placeholder={`Wpisz kod ${sourceBrand} (np. ${sourceBrand === Brand.DMC ? '310' : '403'})...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 ml-1">
            {searchQuery ? 'Wyniki wyszukiwania' : 'Wszystkie kolory'} ({filteredFlosses.length})
        </h2>
        
        {filteredFlosses.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>Nie znaleziono kodu.</p>
          </div>
        ) : (
          filteredFlosses.map((floss) => (
            <FlossCard 
              key={floss.id} 
              floss={floss} 
              sourceBrand={sourceBrand} 
              targetBrand={targetBrand} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConverterTab;

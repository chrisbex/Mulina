import React, { useState } from 'react';
import { Brand, Floss } from '../types';
import FlossCard from './FlossCard';
import { findFlossByDescription } from '../services/geminiService';

interface AiTabProps {
  database: Floss[];
}

const AiTab: React.FC<AiTabProps> = ({ database }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Floss | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Pass the current database to the service
      const floss = await findFlossByDescription(prompt, database);
      if (floss) {
        setResult(floss);
      } else {
        setError('Nie udało się dopasować koloru z bazy danych. Spróbuj innego opisu.');
      }
    } catch (e) {
      setError('Wystąpił błąd podczas komunikacji z AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
            ✨ Magiczny Asystent
          </h2>
          <p className="text-indigo-100 text-sm mb-4">
            Opisz kolor swoimi słowami, a Gemini AI znajdzie najbliższy pasujący numer muliny z Twojej bazy.
          </p>
          
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="np. kolor jesiennego liścia, rdza, głęboki ocean..."
              className="w-full rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-white/50 bg-white/90 border-none resize-none h-24 text-sm"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !prompt.trim()}
              className={`absolute bottom-3 right-3 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                ${loading || !prompt.trim() 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                }`}
            >
              {loading ? 'Szukam...' : 'Znajdź'}
            </button>
          </div>
       </div>

       {error && (
         <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
           {error}
         </div>
       )}

       {result && (
         <div className="animate-fade-in">
           <h3 className="text-sm font-semibold text-gray-500 mb-3 ml-1">Najlepsze dopasowanie:</h3>
           {/* We default to DMC -> Ariadna for display, but user sees all info in the card */}
           <FlossCard 
              floss={result} 
              sourceBrand={Brand.DMC} 
              targetBrand={Brand.ARIADNA} 
            />
            <p className="mt-2 text-xs text-gray-400 text-center">
                Dopasowano na podstawie kodu HEX: {result.hex}
            </p>
         </div>
       )}
    </div>
  );
};

export default AiTab;

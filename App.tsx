import React, { useState } from 'react';
import Header from './components/Header';
import ConverterTab from './components/ConverterTab';
import AiTab from './components/AiTab';
import ColorPickerTab from './components/ColorPickerTab';
import { FLOSS_DATABASE } from './constants';
import { Floss } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'converter' | 'ai' | 'picker'>('converter');
  
  // State for the database, initialized with the mock constant
  const [database, setDatabase] = useState<Floss[]>(FLOSS_DATABASE);

  return (
    <div className="min-h-screen pb-10">
      <Header />
      
      <main className="max-w-md mx-auto p-4">
        {/* Tabs */}
        <div className="flex p-1 bg-gray-200 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('converter')}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'converter'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-600'
            }`}
          >
            Tabela
          </button>
          <button
            onClick={() => setActiveTab('picker')}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'picker'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-600'
            }`}
          >
            Kolor 🎨
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'ai'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-600'
            }`}
          >
            AI Szukaj 🤖
          </button>
        </div>

        {/* Content */}
        <div className="transition-opacity duration-300">
          {activeTab === 'converter' && (
            <ConverterTab 
              database={database} 
              onUpdateDatabase={setDatabase} 
            />
          )}
          {activeTab === 'picker' && (
             <ColorPickerTab database={database} />
          )}
          {activeTab === 'ai' && (
            <AiTab database={database} />
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="text-center text-xs text-gray-400 mt-8 mb-4">
        <p>Baza zawiera {database.length} kolorów.</p>
        <p className="mt-1 opacity-50">Domyślnie załadowano dane przykładowe.</p>
      </footer>
    </div>
  );
};

export default App;
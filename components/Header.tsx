import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-md mx-auto flex items-center justify-center">
        <h1 className="text-white text-xl font-bold tracking-wide flex items-center gap-2">
          🧵 Przelicznik Muliny
        </h1>
      </div>
    </div>
  );
};

export default Header;

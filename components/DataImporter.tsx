import React, { useRef, useState } from 'react';
import readXlsxFile from 'read-excel-file';
import { Floss } from '../types';
import { FLOSS_DATABASE } from '../constants';

interface DataImporterProps {
  onImport: (data: Floss[]) => void;
}

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    if (value < 50) value += 100; 
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

const DataImporter: React.FC<DataImporterProps> = ({ onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccessMsg(null);

    try {
      const rows = await readXlsxFile(file);
      
      if (rows.length < 2) {
        setError('Plik wydaje się pusty.');
        return;
      }

      let headerRowIndex = -1;
      let idxDmc = -1;
      let idxAnchor = -1;
      let idxAriadna = -1;
      let idxHex = -1;
      let idxName = -1;

      for (let i = 0; i < Math.min(rows.length, 15); i++) {
        // Safe conversion to string with fallback for null/undefined/numbers
        const row = rows[i].map((c: any) => (c !== null && c !== undefined) ? String(c).toLowerCase().trim() : '');
        
        const getIndex = (keywords: string[]) => row.findIndex(h => keywords.some(k => h.includes(k)));
        
        const d = getIndex(['dmc']);
        const a = getIndex(['anchor']);
        const ar = getIndex(['ariadna']);

        if (d !== -1 || a !== -1 || ar !== -1) {
            headerRowIndex = i;
            idxDmc = d;
            idxAnchor = a;
            idxAriadna = ar;
            idxHex = getIndex(['hex', 'kod', 'barwa', 'color', 'kolor']);
            idxName = getIndex(['name', 'nazwa', 'opis']);
            break;
        }
      }

      if (headerRowIndex === -1) {
        setError('Nie znaleziono kolumn (DMC, Anchor, Ariadna). Załadowano bazę domyślną.');
        return;
      }

      const newFlosses: Floss[] = [];

      for (let i = headerRowIndex + 1; i < rows.length; i++) {
        const row = rows[i];
        const val = (idx: number) => (idx !== -1 && row[idx] !== null && row[idx] !== undefined) ? String(row[idx]).trim() : '';

        const dmcVal = val(idxDmc);
        const anchorVal = val(idxAnchor);
        const ariadnaVal = val(idxAriadna);

        if (!dmcVal && !anchorVal && !ariadnaVal) continue;

        let hex = val(idxHex);
        
        if (!hex && dmcVal) {
             const known = FLOSS_DATABASE.find(f => f.dmc === dmcVal);
             if (known) hex = known.hex;
        }
        
        if (!hex) {
           hex = stringToColor(dmcVal + anchorVal + ariadnaVal);
        }

        if (!hex.startsWith('#')) hex = '#' + hex;

        newFlosses.push({
          id: `imp-${i}`,
          dmc: dmcVal || '-',
          anchor: anchorVal || '-',
          ariadna: ariadnaVal || '-',
          hex: hex,
          name: val(idxName) || 'Kolor wgrany',
          namePl: val(idxName) || 'Kolor wgrany',
        });
      }

      if (newFlosses.length > 0) {
        onImport(newFlosses);
        setSuccessMsg(`Sukces! Wczytano ${newFlosses.length} pozycji.`);
      } else {
        setError('Nie udało się odczytać danych.');
      }

    } catch (err) {
      console.error(err);
      setError('Błąd pliku.');
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-gray-400 text-xs hover:text-rose-500 hover:border-rose-200 transition-colors flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        Wgraj własną tabelę (opcjonalnie)
      </button>

      {error && <div className="mt-2 text-red-500 text-xs text-center">{error}</div>}
      {successMsg && <div className="mt-2 text-green-600 text-xs text-center">{successMsg}</div>}
    </div>
  );
};

export default DataImporter;
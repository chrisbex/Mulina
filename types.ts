export enum Brand {
  DMC = 'DMC',
  ANCHOR = 'Anchor',
  ARIADNA = 'Ariadna'
}

export interface Floss {
  id: string;
  dmc: string;
  anchor: string;
  ariadna: string;
  hex: string;
  name: string; // English/International name
  namePl: string; // Polish name
}

export interface SearchResult {
  matchType: 'exact' | 'partial' | 'ai';
  floss: Floss;
}

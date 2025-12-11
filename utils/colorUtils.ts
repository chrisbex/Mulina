// Konwersja HEX na RGB
export const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// Obliczanie dystansu euklidesowego między dwoma kolorami HEX
// Im mniejszy wynik, tym kolory są bardziej podobne
export const colorDistance = (color1: string, color2: string) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    return Math.sqrt(
        Math.pow(rgb2.r - rgb1.r, 2) +
        Math.pow(rgb2.g - rgb1.g, 2) +
        Math.pow(rgb2.b - rgb1.b, 2)
    );
}
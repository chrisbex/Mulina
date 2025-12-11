import { GoogleGenAI, Type } from "@google/genai";
import { Floss } from "../types";
import { colorDistance } from "../utils/colorUtils";

export const findFlossByDescription = async (description: string, database: Floss[]): Promise<Floss | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // We ask Gemini to give us a HEX code for the description
    const model = "gemini-2.5-flash";
    const prompt = `Jesteś ekspertem od kolorów i haftu. Użytkownik opisuje kolor muliny: "${description}". 
    Zwróć pojedynczy kod koloru w formacie HEX, który najlepiej pasuje do tego opisu.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hex: { type: Type.STRING, description: "The 6 digit hex code e.g. #FF0000" }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    const suggestedHex = result.hex;

    if (!suggestedHex) return null;

    // Find closest match in the PROVIDED database
    let closestFloss: Floss | null = null;
    let minDistance = Infinity;

    for (const floss of database) {
        // Ensure the floss has a valid hex before comparing
        if (!floss.hex) continue;
        
        const dist = colorDistance(suggestedHex, floss.hex);
        if (dist < minDistance) {
            minDistance = dist;
            closestFloss = floss;
        }
    }

    return closestFloss;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
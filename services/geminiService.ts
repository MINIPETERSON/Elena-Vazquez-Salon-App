import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { HairOption } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// Convert Blob/File to Base64 string
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateSimulation = async (
  imageBase64: string,
  cutOption: HairOption | null,
  colorOption: HairOption | null,
  customPrompt: string
): Promise<{ image: string | null; advice: string }> => {
  const ai = getClient();

  // Construct the prompt based on combined inputs
  const instructions: string[] = [];

  if (cutOption) {
    instructions.push(cutOption.promptModifier);
  }
  
  if (colorOption) {
    instructions.push(colorOption.promptModifier);
  }

  if (customPrompt) {
    instructions.push(`Additional details: ${customPrompt}`);
  }

  // Preservation logic:
  // If we are doing a cut but NO color, explicitly say keep color.
  if (cutOption && !colorOption) {
    instructions.push("Keep the hair color natural and unchanged.");
  }
  // If we are doing a color but NO cut, explicitly say keep style.
  if (colorOption && !cutOption) {
    instructions.push("Keep the hairstyle, length, and texture exactly the same.");
  }
  // If neither, but custom prompt exists
  if (!cutOption && !colorOption && customPrompt) {
    // Rely on custom prompt, but generally try to maintain face.
  }

  const taskDescription = instructions.join(" ");

  if (!taskDescription) {
    throw new Error("No instruction provided");
  }

  // 1. Generate the Image Modification
  const imageModel = "gemini-2.5-flash-image";
  const prompt = `Function as a professional hair stylist editor. 
  Input image provided. 
  Task: ${taskDescription}
  Constraint: Preserve the person's face identity, skin tone, and background exactly as is. Only modify the hair as requested.
  Output: High quality photorealistic image.`;

  const imagePromise = ai.models.generateContent({
    model: imageModel,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64,
          },
        },
        { text: prompt },
      ],
    },
  });

  // 2. Generate Advice (Text Analysis)
  const textModel = "gemini-2.5-flash";
  
  let userIntent = "";
  if (cutOption) userIntent += `Corte: ${cutOption.name}. `;
  if (colorOption) userIntent += `Color: ${colorOption.name}. `;
  if (customPrompt) userIntent += `Extra: ${customPrompt}.`;

  const advicePrompt = `Actúa como un estilista profesional de alto nivel.
  Analiza la forma del rostro y las características de la persona en la imagen adjunta.
  
  El usuario quiere probar: ${userIntent || "un cambio de look"}.

  Por favor dame un consejo breve (máximo 80 palabras) en español.
  1. Analiza brevemente si la combinación de corte/color favorece su rostro.
  2. Un tip clave de mantenimiento para este look específico.
  
  Sé amable, positivo y profesional.`;

  const advicePromise = ai.models.generateContent({
    model: textModel,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64,
          },
        },
        { text: advicePrompt },
      ],
    },
  });

  try {
    const [imageResponse, adviceResponse] = await Promise.all([
      imagePromise,
      advicePromise,
    ]);

    // Extract Image
    let generatedImage: string | null = null;
    const parts = imageResponse.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImage = part.inlineData.data;
          break;
        }
      }
    }

    // Extract Text
    const adviceText = adviceResponse.text || "No se pudo generar un consejo en este momento.";

    return {
      image: generatedImage,
      advice: adviceText,
    };
  } catch (error) {
    console.error("Error generating simulation:", error);
    throw error;
  }
};

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { HairOption } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// Resize image to ensure it's within API limits and performant
const resizeImage = async (file: File, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions keeping aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
           reject(new Error("Could not get canvas context"));
           return;
        }
        
        // Draw with smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 JPEG with decent compression
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      img.onerror = (err) => reject(new Error("Failed to load image for resizing"));
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = (err) => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

// Convert Blob/File to Base64 string (optimized)
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return resizeImage(file);
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
    instructions.push(`User request details: ${customPrompt}`);
  }

  // Preservation logic refined:
  // Only enforce strict preservation if the user hasn't provided a custom prompt that might contradict it.
  
  // If we are doing a cut but NO color, and NO custom prompt implies color change
  if (cutOption && !colorOption && !customPrompt) {
    instructions.push("Keep the hair color natural and unchanged.");
  }
  
  // If we are doing a color but NO cut, and NO custom prompt implies cut change
  if (colorOption && !cutOption && !customPrompt) {
    instructions.push("Keep the hairstyle, length, and texture exactly the same.");
  }

  const taskDescription = instructions.join(" ");

  if (!taskDescription) {
    throw new Error("No hay instrucciones suficientes. Selecciona una opción o escribe un detalle.");
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
  } catch (error: any) {
    console.error("Error generating simulation:", error);
    // Propagate the actual error message
    throw new Error(error.message || "Error desconocido en el servicio de IA");
  }
};

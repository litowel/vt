import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeSymptoms(symptoms: string) {
  const prompt = `You are Vitala AI, a helpful medical AI assistant powered by Upfrica.africa. 
A user has provided the following symptoms: "${symptoms}".
Please provide a preliminary analysis, possible causes, and recommendations.
IMPORTANT DISCLAIMER: Always start your response by stating that you are an AI, not a doctor, and this is not medical advice. Advise the user to consult a healthcare professional for a proper diagnosis.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}

export async function analyzeImage(base64Image: string, mimeType: string, additionalInfo: string = "") {
  const prompt = `You are Vitala AI, a helpful medical AI assistant powered by Upfrica.africa.
Please analyze this image. ${additionalInfo ? `The user also provided this context: "${additionalInfo}".` : ""}
Provide a preliminary analysis of what you see, possible conditions, and recommendations.
IMPORTANT DISCLAIMER: Always start your response by stating that you are an AI, not a doctor, and this is not medical advice. Advise the user to consult a healthcare professional for a proper diagnosis.`;

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Image.split(',')[1], // Remove the data:image/...;base64, part
    },
  };

  const textPart = {
    text: prompt,
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [imagePart, textPart] },
  });

  return response.text;
}

export async function generateAudio(text: string) {
  // Clean up markdown characters for better speech synthesis
  const cleanText = text.replace(/[*#_]/g, '').slice(0, 2000); 
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: cleanText }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, // Calm, professional voice
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}

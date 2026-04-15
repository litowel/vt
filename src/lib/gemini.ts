export async function analyzeSymptoms(symptoms: string) {
  const res = await fetch('/api/ai/symptoms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to analyze symptoms");
  return data.text;
}

export async function analyzeImage(base64Image: string, mimeType: string, additionalInfo: string = "") {
  const res = await fetch('/api/ai/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Image, mimeType, additionalInfo })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to analyze image");
  return data.text;
}

export async function generateAudio(text: string) {
  const res = await fetch('/api/ai/audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to generate audio");
  return data.audioData;
}

import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// Helper function to get live USD to GHS exchange rate
async function getUsdToGhsRate() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    return data.rates.GHS || 15.0; // Fallback to 15.0 if GHS is missing
  } catch (e) {
    console.error("FX fetch failed, using fallback rate", e);
    return 15.0; // Fallback rate in case the API is down
  }
}

const app = express();
// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));

// --- AI Routes (Proxy to Gemini to protect API Key) ---
app.post("/api/ai/symptoms", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing on the server. Please add it to Vercel Environment Variables.");
    const ai = new GoogleGenAI({ apiKey });
    const { symptoms } = req.body;
    
    const prompt = `You are Vitala AI, a helpful medical AI assistant powered by Upfrica.africa. 
A user has provided the following symptoms: "${symptoms}".
Please provide a preliminary analysis, possible causes, and recommendations.
IMPORTANT DISCLAIMER: Always start your response by stating that you are an AI, not a doctor, and this is not medical advice. Advise the user to consult a healthcare professional for a proper diagnosis.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    res.json({ text: response.text });
  } catch (e: any) {
    console.error("AI Symptoms Error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/ai/image", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing on the server. Please add it to Vercel Environment Variables.");
    const ai = new GoogleGenAI({ apiKey });
    const { base64Image, mimeType, additionalInfo } = req.body;
    
    const prompt = `You are Vitala AI, a helpful medical AI assistant powered by Upfrica.africa.
Please analyze this image. ${additionalInfo ? `The user also provided this context: "${additionalInfo}".` : ""}
Provide a preliminary analysis of what you see, possible conditions, and recommendations.
IMPORTANT DISCLAIMER: Always start your response by stating that you are an AI, not a doctor, and this is not medical advice. Advise the user to consult a healthcare professional for a proper diagnosis.`;

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Image.split(',')[1],
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [imagePart, { text: prompt }] },
    });
    res.json({ text: response.text });
  } catch (e: any) {
    console.error("AI Image Error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/ai/audio", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing on the server. Please add it to Vercel Environment Variables.");
    const ai = new GoogleGenAI({ apiKey });
    const { text } = req.body;
    
    const cleanText = text.replace(/[*#_]/g, '').slice(0, 2000); 
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    res.json({ audioData: response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data });
  } catch (e: any) {
    console.error("AI Audio Error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Expose Paystack Public Key securely to the frontend
app.get("/api/payment/public-key", (req, res) => {
  try {
    const publicKey = process.env.PAYSTACK_PUBLIC_KEY || process.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      return res.status(400).json({ error: "PAYSTACK_PUBLIC_KEY is not configured in the environment." });
    }
    res.json({ publicKey });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Affiliate Routes
let affiliateStats = {
  referrals: 12,
  balance: 120.50,
  transactions: [
    { date: 'Today, 10:23 AM', plan: 'Vitala Plus (Monthly)', amount: '+$2.49' },
    { date: 'Yesterday, 2:45 PM', plan: 'Vitala Plus (Monthly)', amount: '+$2.49' },
    { date: 'Oct 12, 9:12 AM', plan: 'Vitala Plus (Annual)', amount: '+$19.99' }
  ]
};

app.get("/api/affiliate/stats", (req, res) => {
  res.json(affiliateStats);
});

app.post("/api/affiliate/withdraw", async (req, res) => {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return res.status(400).json({ error: "PAYSTACK_SECRET_KEY is not configured. Please add it to the Secrets panel." });
    }

    if (affiliateStats.balance < 50) {
      return res.status(400).json({ error: "Minimum withdrawal is $50.00" });
    }

    const { account_number, bank_code } = req.body;
    if (!account_number || !bank_code) {
      return res.status(400).json({ error: "Account number and bank code are required." });
    }

    // 1. Create Transfer Recipient
    const recipientResponse = await fetch("https://api.paystack.co/transferrecipient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secretKey}`
      },
      body: JSON.stringify({
        type: "mobile_money",
        name: "Vitala Affiliate",
        account_number: account_number,
        bank_code: bank_code,
        currency: "GHS"
      })
    });

    const recipientData = await recipientResponse.json();
    if (!recipientData.status) {
      throw new Error(`Failed to create recipient: ${recipientData.message}`);
    }

    const recipientCode = recipientData.data.recipient_code;

    // 2. Initiate Transfer
    const rate = await getUsdToGhsRate();
    const ghsAmount = affiliateStats.balance * rate;
    const amountInPesewas = Math.round(ghsAmount * 100);

    const transferResponse = await fetch("https://api.paystack.co/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secretKey}`
      },
      body: JSON.stringify({
        source: "balance",
        amount: amountInPesewas,
        currency: "GHS",
        recipient: recipientCode,
        reason: "Vitala Affiliate Payout"
      })
    });

    const transferData = await transferResponse.json();
    if (!transferData.status) {
      throw new Error(`Transfer failed: ${transferData.message}`);
    }

    affiliateStats.balance = 0;
    res.json({ success: true, message: "Withdrawal processed successfully via Paystack" });
  } catch (error: any) {
    console.error("Payout error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Local development and production server setup (skipped on Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  
  const startLocalServer = async () => {
    if (process.env.NODE_ENV !== "production") {
      // In local development, we run Vite separately or use a different script.
      // We do not import Vite here to prevent Vercel build crashes related to Rollup.
      console.log("Running in development mode. Ensure Vite is running.");
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  };
  
  startLocalServer();
}

export default app;

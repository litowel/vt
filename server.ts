import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Expose Paystack Public Key securely to the frontend
  app.get("/api/payment/public-key", (req, res) => {
    const publicKey = process.env.PAYSTACK_PUBLIC_KEY || process.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      return res.status(500).json({ error: "PAYSTACK_PUBLIC_KEY is not configured in the environment." });
    }
    res.json({ publicKey });
  });

  // Affiliate Routes
  // Note: In a production app, these values should be fetched from your database.
  // We are setting a balance > $50 so the live withdrawal API call can be tested.
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
        return res.status(500).json({ error: "PAYSTACK_SECRET_KEY is not configured. Please add it to the Secrets panel." });
      }

      if (affiliateStats.balance < 50) {
        return res.status(400).json({ error: "Minimum withdrawal is $50.00" });
      }

      const rate = await getUsdToGhsRate();
      const ghsAmount = affiliateStats.balance * rate;
      const amountInPesewas = Math.round(ghsAmount * 100);

      // Actual call to Paystack Transfer API
      // Note: Paystack requires a valid recipient code for transfers. 
      // In production, you would first create a transfer recipient using the user's bank details via the Paystack API.
      const response = await fetch("https://api.paystack.co/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secretKey}`
        },
        body: JSON.stringify({
          source: "balance",
          amount: amountInPesewas,
          currency: "GHS",
          recipient: "RCP_t0ya41mp35flk40", // Placeholder: This will return an error from Paystack if invalid
          reason: "Vitala Affiliate Payout"
        })
      });

      const data = await response.json();
      if (!data.status) {
        throw new Error(`Paystack API Error: ${data.message}`);
      }

      affiliateStats.balance = 0;
      res.json({ success: true, message: "Withdrawal processed successfully via Paystack" });
    } catch (error: any) {
      console.error("Payout error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if not running in a serverless environment like Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  
  return app;
}

const appPromise = startServer();

export default async function handler(req: any, res: any) {
  const app = await appPromise;
  return app(req, res);
}

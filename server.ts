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

  // Real Paystack Checkout Integration
  app.post("/api/payment/checkout", async (req, res) => {
    try {
      const secretKey = process.env.PAYSTACK_SECRET_KEY;
      if (!secretKey) {
        return res.status(500).json({ error: "PAYSTACK_SECRET_KEY is not configured in the environment." });
      }

      const usdAmount = 4.99;
      const rate = await getUsdToGhsRate();
      const ghsAmount = usdAmount * rate;
      const amountInPesewas = Math.round(ghsAmount * 100); // Paystack expects amounts in the lowest currency unit (pesewas)

      // Actual call to Paystack API to initialize transaction
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secretKey}`
        },
        body: JSON.stringify({
          email: "user@example.com", // In production, get this from the authenticated user
          amount: amountInPesewas,
          currency: "GHS",
          callback_url: process.env.APP_URL || "http://localhost:3000"
        })
      });

      const data = await response.json();
      if (!data.status) {
        throw new Error(data.message || "Paystack checkout failed");
      }

      // Redirect to the checkout URL provided by Paystack
      res.json({ checkoutUrl: data.data.authorization_url });
    } catch (error: any) {
      console.error("Payment error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Affiliate Routes
  // Note: In a production app, these values should be fetched from your database.
  let affiliateStats = {
    referrals: 0,
    balance: 0.00,
    transactions: []
  };

  app.get("/api/affiliate/stats", (req, res) => {
    res.json(affiliateStats);
  });

  app.post("/api/affiliate/withdraw", async (req, res) => {
    try {
      const secretKey = process.env.PAYSTACK_SECRET_KEY;
      if (!secretKey) {
        return res.status(500).json({ error: "PAYSTACK_SECRET_KEY is not configured." });
      }

      if (affiliateStats.balance < 50) {
        return res.status(400).json({ error: "Minimum withdrawal is $50.00" });
      }

      const rate = await getUsdToGhsRate();
      const ghsAmount = affiliateStats.balance * rate;
      const amountInPesewas = Math.round(ghsAmount * 100);

      // Actual call to Paystack Transfer API
      // Note: Paystack requires a recipient code for transfers. 
      // In production, you would first create a transfer recipient using the user's bank details.
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
          recipient: "RCP_t0ya41mp35flk40", // Placeholder: Replace with actual recipient code from DB
          reason: "Vitala Affiliate Payout"
        })
      });

      const data = await response.json();
      if (!data.status) {
        throw new Error(data.message || "Paystack payout failed");
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

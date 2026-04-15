import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Real Payaza Checkout Integration
  app.post("/api/payment/checkout", async (req, res) => {
    try {
      const apiKey = process.env.PAYAZA_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "PAYAZA_API_KEY is not configured in the environment." });
      }

      // Actual call to Payaza API (Replace with exact Payaza endpoint if different)
      const response = await fetch("https://api.payaza.africa/live/merchant/api/v1/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Payaza ${apiKey}`
        },
        body: JSON.stringify({
          transaction_type: "charge",
          service_payload: {
            first_name: "Vitala",
            last_name: "User",
            email_address: "user@example.com",
            phone_number: "1234567890",
            amount: 4.99,
            currency: "USD"
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Payaza checkout failed");
      }

      // Redirect to the checkout URL provided by Payaza
      res.json({ checkoutUrl: data.checkout_url || data.data?.checkout_url });
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
      const apiKey = process.env.PAYAZA_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "PAYAZA_API_KEY is not configured." });
      }

      if (affiliateStats.balance < 50) {
        return res.status(400).json({ error: "Minimum withdrawal is $50.00" });
      }

      // Actual call to Payaza Payout API
      const response = await fetch("https://api.payaza.africa/live/merchant/api/v1/payout/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Payaza ${apiKey}`
        },
        body: JSON.stringify({
          amount: affiliateStats.balance,
          currency: "USD"
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Payaza payout failed");
      }

      affiliateStats.balance = 0;
      res.json({ success: true, message: "Withdrawal processed successfully via Payaza" });
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

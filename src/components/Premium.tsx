import React, { useState, useEffect } from 'react';
import { Check, Star, Shield, Zap, CreditCard, Image as ImageIcon } from 'lucide-react';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function Premium() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Paystack script for inline popup
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getUsdToGhsRate = async () => {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      return data.rates.GHS || 15.0;
    } catch (e) {
      console.error("FX fetch failed, using fallback rate", e);
      return 15.0;
    }
  };

  const handlePaystackCheckout = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch the public key from our backend to avoid Vite env injection issues
      const keyResponse = await fetch('/api/payment/public-key');
      const keyData = await keyResponse.json();
      
      if (!keyResponse.ok) {
        throw new Error(keyData.error || "Failed to fetch Paystack configuration.");
      }
      
      const publicKey = keyData.publicKey;

      if (!window.PaystackPop) {
        throw new Error("Paystack failed to load. Please check your internet connection.");
      }

      // Convert $4.99 to GHS using live FX rate
      const usdAmount = 4.99;
      const rate = await getUsdToGhsRate();
      const ghsAmount = usdAmount * rate;
      const amountInPesewas = Math.round(ghsAmount * 100);

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: 'user@example.com', // In a real app, get from logged-in user
        amount: amountInPesewas,
        currency: 'GHS',
        ref: 'VTL_' + Math.floor((Math.random() * 1000000000) + 1),
        callback: function(response: any) {
          // Payment complete!
          alert('Payment complete! Reference: ' + response.reference);
          setLoading(false);
        },
        onClose: function() {
          setLoading(false);
        }
      });
      
      handler.openIframe();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Upgrade to Vitala Premium</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Get unlimited access to advanced AI medical analysis, image diagnostics, and audio results.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center max-w-md mx-auto">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-8">
        {/* Free Tier */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic</h3>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-gray-900">$0</span>
            <span className="text-gray-500">/ forever</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-600">
              <Check className="w-5 h-5 text-teal-500" />
              <span>3 Symptom Checks per day</span>
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <Check className="w-5 h-5 text-teal-500" />
              <span>Basic Text Analysis</span>
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <Check className="w-5 h-5 text-teal-500" />
              <span>Local History</span>
            </li>
          </ul>
          <button className="w-full py-3 px-4 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            Current Plan
          </button>
        </div>

        {/* Premium Tier */}
        <div className="bg-teal-900 rounded-3xl p-8 border border-teal-800 shadow-xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
            Recommended
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Vitala Plus</h3>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-white">$4.99</span>
            <span className="text-teal-200">/ month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-teal-50">
              <Star className="w-5 h-5 text-teal-400" />
              <span>Unlimited Symptom Checks</span>
            </li>
            <li className="flex items-center gap-3 text-teal-50">
              <ImageIcon className="w-5 h-5 text-teal-400" />
              <span>Image-based Diagnosis</span>
            </li>
            <li className="flex items-center gap-3 text-teal-50">
              <Zap className="w-5 h-5 text-teal-400" />
              <span>Audio Results (Text-to-Speech)</span>
            </li>
            <li className="flex items-center gap-3 text-teal-50">
              <Shield className="w-5 h-5 text-teal-400" />
              <span>Priority Support</span>
            </li>
          </ul>
          <button 
            onClick={handlePaystackCheckout}
            disabled={loading}
            className="w-full py-3 px-4 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-400 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Upgrade with Paystack
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

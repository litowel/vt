import React, { useState } from 'react';
import { Check, Star, Shield, Zap, CreditCard, Image as ImageIcon } from 'lucide-react';

export default function Premium() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayazaCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned from Payaza');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
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
            onClick={handlePayazaCheckout}
            disabled={loading}
            className="w-full py-3 px-4 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-400 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Upgrade with Payaza
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

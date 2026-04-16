import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Link as LinkIcon, Copy, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Affiliate() {
  const [copied, setCopied] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [payoutDetails, setPayoutDetails] = useState({ account_number: '', bank_code: 'MTN' });
  const [stats, setStats] = useState({ referrals: 0, balance: 0.00, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [affiliateLink, setAffiliateLink] = useState('');

  useEffect(() => {
    fetchStats();
    
    // Generate or retrieve a unique affiliate ID for this user
    let storedId = localStorage.getItem('vitala_affiliate_id');
    if (!storedId) {
      storedId = 'ref-' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('vitala_affiliate_id', storedId);
    }
    setAffiliateLink(`https://vitala.upfrica.africa/${storedId}`);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/affiliate/stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutDetails.account_number) {
      setError("Please enter your mobile money number.");
      return;
    }

    setWithdrawing(true);
    setError('');
    try {
      const response = await fetch('/api/affiliate/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payoutDetails)
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Withdrawal failed');
      }
      
      alert(data.message || "Withdrawal successful!");
      setShowWithdrawForm(false);
      fetchStats(); // Refresh balance
    } catch (err: any) {
      setError(err.message);
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-br from-teal-900 to-teal-800 rounded-3xl p-8 text-white shadow-lg">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Vitala Health Analyzers Program</h2>
          <p className="text-teal-100 text-lg mb-6">
            Join our exclusive partner network. Share Vitala AI with your community and earn a massive <strong className="text-white">50% recurring commission</strong> on every premium subscription you refer.
          </p>
          
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-between gap-4">
            <div className="truncate flex-1 font-mono text-teal-50">
              {affiliateLink}
            </div>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-white text-teal-900 rounded-lg font-medium hover:bg-teal-50 transition-colors shrink-0"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Total Referrals</p>
          <h4 className="text-3xl font-bold text-gray-900">
            {loading ? '...' : stats.referrals}
          </h4>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Available Balance</p>
          <h4 className="text-3xl font-bold text-gray-900">
            ${loading ? '...' : stats.balance.toFixed(2)}
          </h4>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          {!showWithdrawForm ? (
            <>
              <button 
                onClick={() => setShowWithdrawForm(true)}
                disabled={loading || stats.balance < 50}
                className="w-full py-4 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw via Paystack
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">Minimum withdrawal: $50.00</p>
            </>
          ) : (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Network</label>
                <select 
                  value={payoutDetails.bank_code}
                  onChange={(e) => setPayoutDetails({...payoutDetails, bank_code: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="MTN">MTN Mobile Money</option>
                  <option value="VOD">Vodafone Cash</option>
                  <option value="ATL">AirtelTigo Money</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input 
                  type="text"
                  placeholder="e.g. 0541234567"
                  value={payoutDetails.account_number}
                  onChange={(e) => setPayoutDetails({...payoutDetails, account_number: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setShowWithdrawForm(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={withdrawing}
                  className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {withdrawing ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Conversions</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : stats.transactions.length > 0 ? (
            stats.transactions.map((tx: any, i: number) => (
              <div key={i} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{tx.plan}</p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
                <div className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {tx.amount}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">No recent conversions.</div>
          )}
        </div>
      </div>
    </div>
  );
}

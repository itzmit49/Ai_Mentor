import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, HeartPulse, Calculator, RefreshCcw, TrendingUp } from 'lucide-react';

const CouplesPlanner = ({ onClose }) => {
  const [partner1, setPartner1] = useState({ name: 'Rahul', income: 1200000, regime: 'old', paysRent: true });
  const [partner2, setPartner2] = useState({ name: 'Priya', income: 1500000, regime: 'new', paysRent: false });
  const [rentAmount, setRentAmount] = useState(40000);

  // Simplified tax calculation logic for demonstration
  const calculateTax = (income, regime, isPayingRent) => {
    let taxable = income;
    if (regime === 'old') {
      taxable -= 50000; // Standard deduction
      if (isPayingRent) taxable -= (rentAmount * 12 * 0.5); // Simplified HRA exemption
      taxable -= 150000; // 80C
    } else {
      taxable -= 50000; // Standard deduction new regime
    }
    
    // Simple bracket calculation
    let tax = 0;
    if (taxable > 700000) {
      tax = (taxable - 700000) * 0.2 + 25000; // Mock calculation
    }
    return Math.max(0, tax);
  };

  const p1Tax = calculateTax(partner1.income, partner1.regime, partner1.paysRent);
  const p2Tax = calculateTax(partner2.income, partner2.regime, partner2.paysRent);

  // Optimization logic: who should pay rent?
  const altP1Tax = calculateTax(partner1.income, partner1.regime, false);
  const altP2Tax = calculateTax(partner2.income, partner2.regime, true);

  const currentTotal = p1Tax + p2Tax;
  const optimizedTotal = altP1Tax + altP2Tax;
  const savings = currentTotal - optimizedTotal;
  const isOptimal = savings <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-slate-900 border border-slate-700 shadow-2xl rounded-3xl overflow-hidden relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-900">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-pink-400">
            <HeartPulse className="w-6 h-6" /> Couple's Wealth Planner
          </h2>
          <p className="text-sm text-slate-400 mt-2">Optimize joint tax brackets, HRA splitting, and dual-income compounding.</p>
        </div>

        <div className="p-6 md:p-8 bg-slate-950/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Partner 1 */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2 flex justify-between">
                Partner 1
              </h3>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase">Name</label>
                <input type="text" value={partner1.name} onChange={e => setPartner1({...partner1, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 mt-1 text-sm text-white focus:border-pink-500 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase">Annual Income (₹)</label>
                <input type="number" value={partner1.income} onChange={e => setPartner1({...partner1, income: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 mt-1 text-sm text-white focus:border-pink-500 outline-none" />
              </div>
              <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-700">
                <span className="text-sm font-medium text-slate-300">Pays the Rent?</span>
                <input type="radio" checked={partner1.paysRent} onChange={() => { setPartner1({...partner1, paysRent: true}); setPartner2({...partner2, paysRent: false}); }} className="accent-pink-500 w-4 h-4 cursor-pointer" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPartner1({...partner1, regime: 'old'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${partner1.regime === 'old' ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>Old Regime</button>
                <button onClick={() => setPartner1({...partner1, regime: 'new'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${partner1.regime === 'new' ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>New Regime</button>
              </div>
            </div>

            {/* Partner 2 */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2 flex justify-between">
                Partner 2
              </h3>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase">Name</label>
                <input type="text" value={partner2.name} onChange={e => setPartner2({...partner2, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 mt-1 text-sm text-white focus:border-pink-500 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase">Annual Income (₹)</label>
                <input type="number" value={partner2.income} onChange={e => setPartner2({...partner2, income: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 mt-1 text-sm text-white focus:border-pink-500 outline-none" />
              </div>
              <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-700">
                <span className="text-sm font-medium text-slate-300">Pays the Rent?</span>
                <input type="radio" checked={partner2.paysRent} onChange={() => { setPartner2({...partner2, paysRent: true}); setPartner1({...partner1, paysRent: false}); }} className="accent-pink-500 w-4 h-4 cursor-pointer" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPartner2({...partner2, regime: 'old'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${partner2.regime === 'old' ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>Old Regime</button>
                <button onClick={() => setPartner2({...partner2, regime: 'new'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${partner2.regime === 'new' ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>New Regime</button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Monthly Rent Paid Jointly (₹)</label>
            <input type="range" min="10000" max="100000" step="1000" value={rentAmount} onChange={e => setRentAmount(Number(e.target.value))} className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
            <div className="text-center text-pink-400 font-bold mt-2">₹{rentAmount.toLocaleString()}</div>
          </div>

          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" /> AI Optimization Engine
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                 <p className="text-xs text-slate-500 font-bold mb-1">Current Tax Liability</p>
                 <p className="text-2xl font-black text-slate-200">₹{currentTotal.toLocaleString()}</p>
                 <p className="text-xs text-slate-400 mt-1">{partner1.name}: ₹{p1Tax.toLocaleString()} + {partner2.name}: ₹{p2Tax.toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-xl border ${savings > 0 ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-slate-950 border-slate-800'}`}>
                 <p className="text-xs text-slate-500 font-bold mb-1">Optimized Tax Liability</p>
                 <p className={`text-2xl font-black ${savings > 0 ? 'text-emerald-400' : 'text-slate-200'}`}>₹{Math.min(currentTotal, optimizedTotal).toLocaleString()}</p>
                 {savings > 0 && <p className="text-xs text-emerald-400 mt-1 font-bold">You can save ₹{savings.toLocaleString()}!</p>}
              </div>
            </div>

            {savings > 0 ? (
              <div className="flex bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl items-start gap-3">
                 <RefreshCcw className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-sm font-bold text-emerald-400">Restructuring Recommended</h4>
                   <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                     Transfer the rent agreement and payments to <strong>{partner1.paysRent ? partner2.name : partner1.name}</strong>. Because {partner1.paysRent ? partner2.name : partner1.name} is in the {partner1.paysRent ? partner2.regime : partner1.regime} regime with a higher marginal bracket, optimizing HRA here yields a net tax saving of ₹{savings.toLocaleString()} annually.
                   </p>
                 </div>
              </div>
            ) : (
              <div className="flex bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl items-start gap-3">
                 <TrendingUp className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-sm font-bold text-slate-300">Optimal Structure Achieved</h4>
                   <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                     Your current rental payment structure and regime selection is already tax-efficient. No changes required.
                   </p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CouplesPlanner;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, PartyPopper, Car, Home, Baby, Plane, TrendingDown, Target } from 'lucide-react';

const LifeEventSimulator = ({ onClose, currentSip = 50000, currentTarget = 10000000, timeline = 10 }) => {
  const [activeEvent, setActiveEvent] = useState(null);
  
  const events = [
    { id: 'car', icon: <Car className="w-6 h-6" />, title: 'Buy a Luxury Car', cost: 3500000, desc: 'BMW / Mercedes / Audi Downpayment + EMI' },
    { id: 'house', icon: <Home className="w-6 h-6" />, title: 'Buy a House', cost: 15000000, desc: 'Large 3BHK in Tier 1 City - Downpayment' },
    { id: 'wedding', icon: <PartyPopper className="w-6 h-6" />, title: 'Grand Wedding', cost: 2500000, desc: 'Destination wedding expenses' },
    { id: 'baby', icon: <Baby className="w-6 h-6" />, title: 'Have a Baby', cost: 1000000, desc: 'Initial healthcare and setup costs' },
    { id: 'travel', icon: <Plane className="w-6 h-6" />, title: 'World Tour / Sabbatical', cost: 1500000, desc: '6 months off traveling' },
  ];

  const handleSelect = (e) => {
    setActiveEvent(activeEvent === e.id ? null : e.id);
  };

  const selectedEvent = events.find(e => e.id === activeEvent);

  // Simplified mathematical simulation
  // Every 1 Lakh spent today costs roughly 3-4 Lakhs in 10 years at 12% return
  const fvMultiplier = Math.pow(1.12, timeline); 
  
  let fvCost = 0;
  let delayedMonths = 0;
  let extraSipNeeded = 0;

  if (selectedEvent) {
    fvCost = selectedEvent.cost * fvMultiplier;
    // How many months of SIP delayed? (Rough estimation)
    delayedMonths = Math.min(fvCost / (currentSip * 1.5), 120); // Cap at 10 years
    
    // Extra SIP needed to still meet goal on time
    // PMT formula approximation
    const r = 0.12 / 12;
    const n = timeline * 12;
    const requiredTotalFv = currentTarget + fvCost;
    const newSip = (requiredTotalFv * r) / (Math.pow(1 + r, n) - 1);
    const oldSip = (currentTarget * r) / (Math.pow(1 + r, n) - 1);
    extraSipNeeded = newSip - oldSip;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-700 shadow-2xl rounded-3xl overflow-hidden relative flex flex-col md:flex-row"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors z-10 md:hidden">
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Events List */}
        <div className="w-full md:w-5/12 border-r border-slate-800 bg-slate-900 p-6 flex flex-col max-h-[70vh] md:max-h-[600px] overflow-y-auto">
          <div className="hidden md:flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
                <PartyPopper className="w-5 h-5" /> Event Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-1">See the impact of large expenses.</p>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors hidden md:block">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3 mt-4 md:mt-0 flex-1">
            {events.map((evt) => (
              <button 
                key={evt.id}
                onClick={() => handleSelect(evt)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${activeEvent === evt.id ? 'bg-amber-500/10 border-amber-500/50 shadow-inner' : 'bg-slate-950/50 border-slate-800 hover:border-slate-600 hover:bg-slate-800'}`}
              >
                <div className={`p-3 rounded-xl border ${activeEvent === evt.id ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                  {evt.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${activeEvent === evt.id ? 'text-amber-400' : 'text-slate-200'}`}>{evt.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">₹{(evt.cost / 100000).toFixed(1)} Lakhs</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Impact Engine */}
        <div className="w-full md:w-7/12 bg-slate-950/80 p-6 md:p-8 flex flex-col justify-center min-h-[400px]">
          {!selectedEvent ? (
            <div className="flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <Target className="w-16 h-16 text-slate-600" />
              <p className="text-lg font-bold text-slate-400">Select an event to simulate its impact on your FIRE goals.</p>
            </div>
          ) : (
            <motion.div 
              key={activeEvent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-black text-white mb-2">{selectedEvent.title}</h3>
                <p className="text-slate-400 text-sm border-l-2 border-amber-500 pl-3 py-1">{selectedEvent.desc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
                   <div className="text-xs font-bold uppercase text-slate-500 flex justify-between items-center mb-2">
                     Opportunity Cost <TrendingDown className="w-4 h-4 text-rose-400" />
                   </div>
                   <p className="text-3xl font-black text-rose-400">₹{(fvCost / 10000000).toFixed(2)} Cr</p>
                   <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                     By spending ₹{(selectedEvent.cost/100000).toFixed(1)}L today, you lose the compounding power over {timeline} years at 12%.
                   </p>
                </div>
                
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
                   <div className="text-xs font-bold uppercase text-slate-500 flex justify-between items-center mb-2">
                     FIRE Delay
                   </div>
                   <p className="text-3xl font-black text-amber-400">{(delayedMonths / 12).toFixed(1)} Yrs</p>
                   <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                     Your target net worth timeline will be pushed back significantly.
                   </p>
                </div>
              </div>

              <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 mt-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 bg-amber-500 h-full"></div>
                <h4 className="font-bold text-white text-sm">How to keep your goal on track?</h4>
                <p className="text-sm text-slate-300 mt-2">
                  To achieve your original FIRE goal of ₹{(currentTarget/10000000).toFixed(2)}Cr in {timeline} years despite this expense, you must increase your monthly SIP by:
                </p>
                <div className="mt-4 text-3xl font-black text-emerald-400">
                  +₹{Math.ceil(extraSipNeeded).toLocaleString()}<span className="text-sm text-slate-500 font-medium ml-1">/ mo</span>
                </div>
              </div>

            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LifeEventSimulator;

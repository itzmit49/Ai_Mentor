import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wallet, Target, Activity, TrendingUp, Sparkles, ShieldAlert, CreditCard, Users, Clock, Landmark } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    expenses: '',
    emis: '',
    cash: '',
    investments: '',
    dependents: '',
    goal: '',
    horizon: '',
    risk: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionSelect = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setTimeout(handleNext, 300);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const questions = [
    {
      id: 'age', question: "What's your current age?", title: "Let's get started",
      subtitle: "To build your personalized roadmap, we need some basic details.",
      icon: <Activity className="w-8 h-8 text-cyan-400" />, type: "number", placeholder: "e.g. 28"
    },
    {
      id: 'income', question: "What is your monthly in-hand income?", title: "Cash Inflow",
      subtitle: "This helps us calculate your optimal SIP and tax-saving bandwidth.",
      icon: <Wallet className="w-8 h-8 text-emerald-400" />, type: "number", placeholder: "e.g. 85000"
    },
    {
      id: 'expenses', question: "What are your total monthly lifestyle expenses? (Excluding EMIs)", title: "Cash Outflow",
      subtitle: "Include rent, food, utilities, and lifestyle spending.",
      icon: <TrendingUp className="w-8 h-8 text-rose-400" />, type: "number", placeholder: "e.g. 40000"
    },
    {
      id: 'emis', question: "What is your total monthly EMI/Debt payment?", title: "Debt Obligations",
      subtitle: "Include home loans, personal loans, or credit card EMIs.",
      icon: <CreditCard className="w-8 h-8 text-orange-400" />, type: "number", placeholder: "e.g. 15000 (Put 0 if none)"
    },
    {
      id: 'cash', question: "How much Cash do you have safely in the bank?", title: "Emergency Fund",
      subtitle: "Savings accounts, liquid FDs, or pure cash.",
      icon: <Landmark className="w-8 h-8 text-indigo-400" />, type: "number", placeholder: "e.g. 150000"
    },
    {
      id: 'investments', question: "What is the total value of your existing investments?", title: "Current Portfolio",
      subtitle: "Mutual funds, Stocks, EPF, PPF, Gold.",
      icon: <Target className="w-8 h-8 text-fuchsia-400" />, type: "number", placeholder: "e.g. 400000 (Put 0 if none)"
    },
    {
      id: 'dependents', question: "Do you have any financial dependents?", title: "Family & Protection",
      subtitle: "Aging parents, a spouse, or children who rely on your income.",
      icon: <Users className="w-8 h-8 text-pink-400" />, type: "options",
      options: [
        { label: "Yes", desc: "Prioritizes term/health insurance & secure emergency funds." },
        { label: "No", desc: "Allows for a more aggressive wealth accumulation strategy." }
      ]
    },
    {
      id: 'goal', question: "What is your primary financial goal?", title: "The Destination",
      subtitle: "Whether it's FIRE, a house, or a child's education.",
      icon: <Target className="w-8 h-8 text-amber-400" />, type: "text", placeholder: "e.g. FIRE"
    },
    {
      id: 'horizon', question: "In how many years do you want to achieve this goal?", title: "Time Horizon",
      subtitle: "Determines the optimal mix of high-growth equity vs safe debt.",
      icon: <Clock className="w-8 h-8 text-teal-400" />, type: "number", placeholder: "e.g. 10"
    },
    {
      id: 'risk', question: "What is your natural risk appetite?", title: "Investment Strategy",
      subtitle: "How comfortable are you with market volatility?",
      icon: <ShieldAlert className="w-8 h-8 text-violet-400" />, type: "options",
      options: [
        { label: "Conservative", desc: "Prioritize capital protection (FDs, Bonds)" },
        { label: "Moderate", desc: "Balanced mix of growth & safety" },
        { label: "Aggressive", desc: "High growth, comfortable with volatility" }
      ]
    }
  ];

  const currentQ = questions[step];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-cyan-500/30">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />

      <motion.div key="onboarding-container" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl relative z-10">
        <div className="flex items-center justify-center mb-8 gap-3">
          <div className="p-3 bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.15)] flex items-center justify-center">
             <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            FinMentor AI
          </h1>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[420px] flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800">
            <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500" initial={{ width: `${(step / questions.length) * 100}%` }} animate={{ width: `${((step + 1) / questions.length) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease: "easeOut" }} className="mt-4 flex-1 flex flex-col">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="mb-6 p-4 bg-slate-800/50 rounded-full border border-slate-700/50 shrink-0">
                  {currentQ.icon}
                </div>
                <h2 className="text-xl font-bold text-slate-200 mb-2 tracking-wide uppercase text-sm">{currentQ.title}</h2>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-3">{currentQ.question}</h3>
                <p className="text-slate-400 text-sm">{currentQ.subtitle}</p>
              </div>

              <div className="relative flex-1 flex flex-col justify-center">
                {currentQ.type === 'options' ? (
                  <div className="space-y-4 w-full">
                    {currentQ.options.map((opt, i) => (
                       <button key={i} onClick={() => handleOptionSelect(currentQ.id, opt.label)} className={`w-full text-left p-4 rounded-2xl border transition-all ${formData[currentQ.id] === opt.label ? 'bg-cyan-500/20 border-cyan-500 text-white' : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-900'}`}>
                         <div className="font-bold text-lg mb-1">{opt.label}</div>
                         <div className="text-xs text-slate-400 font-medium">{opt.desc}</div>
                       </button>
                    ))}
                  </div>
                ) : (
                  <>
                    {currentQ.type === 'number' && (
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-lg">
                        {currentQ.id === 'age' || currentQ.id === 'horizon' ? '' : '₹'}
                      </span>
                    )}
                    <input
                      autoFocus
                      type={currentQ.type}
                      name={currentQ.id}
                      value={formData[currentQ.id]}
                      onChange={handleChange}
                      placeholder={currentQ.placeholder}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && formData[currentQ.id] !== '') handleNext();
                      }}
                      className={`w-full bg-slate-950/80 border border-slate-700 rounded-2xl py-4 pr-4 text-center text-xl font-bold text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 placeholder:font-normal ${currentQ.type === 'number' && currentQ.id !== 'age' && currentQ.id !== 'horizon' ? 'pl-8' : ''}`}
                    />
                  </>
                )}
              </div>

              <div className="mt-8 flex justify-between items-center pt-4">
                <button onClick={() => setStep(step - 1)} disabled={step === 0} className="text-slate-400 hover:text-white transition-colors disabled:opacity-0 font-medium px-4 py-2">
                  Back
                </button>
                <button onClick={handleNext} disabled={formData[currentQ.id] === ''} className="bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-[0_4px_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 hover:-translate-y-0.5">
                  {step === questions.length - 1 ? 'Analyze Profile' : 'Continue'} 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;

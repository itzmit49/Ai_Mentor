import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
import { AlertTriangle, Activity, Target, BrainCircuit, ChevronRight, Zap, Info, Loader2, CheckCircle2, Shield, HeartPulse, Scale, ScanSearch, PartyPopper, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CouplesPlanner from './CouplesPlanner';
import LifeEventSimulator from './LifeEventSimulator';
import RebalancingPlan from './RebalancingPlan';

const MoneyHealthDashboard = ({ aiData }) => {
  if (!aiData) return null;

  const [globalScore] = useState(aiData.health_score);
  const [monthlySip, setMonthlySip] = useState(aiData.investment_plan.monthly_sip);
  const [activeAction, setActiveAction] = useState(null);
  const [completedActions, setCompletedActions] = useState(new Set());
  const [showCouplesPlanner, setShowCouplesPlanner] = useState(false);
  const [showLifeSimulator, setShowLifeSimulator] = useState(false);
  const [showRebalancingPlan, setShowRebalancingPlan] = useState(false);

  const handleActionClick = (actionLabel) => {
    if (completedActions.has(actionLabel)) return;
    setActiveAction(actionLabel);
    
    setTimeout(() => {
      setCompletedActions(prev => { const next = new Set(prev); next.add(actionLabel); return next; });
      setActiveAction(null);
    }, 1500);
  };

  const baseFireData = [
    { age: 30, netWorth: 10 }, { age: 35, netWorth: 25 }, { age: 40, netWorth: 55 }, { age: 45, netWorth: 100 }, { age: 50, netWorth: 120 }
  ];
  const fireData = baseFireData.map(d => ({
    age: d.age, netWorth: Number((d.netWorth + ((monthlySip - 50000)/10000) * ((d.age - 25)/5)).toFixed(1))
  }));

  const handleSipChange = (e) => setMonthlySip(Number(e.target.value));

  const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };
  const staggerContainer = { disabled: {}, visible: { transition: { staggerChildren: 0.1 } } };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 sm:p-8 font-sans overflow-x-hidden selection:bg-emerald-500/30">
      
      <div className="fixed top-[-15%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-[1400px] mx-auto relative z-10 pb-24">
        
        {/* HEADER & TOP NAVBAR */}
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent tracking-tight mb-2 py-1">
              FinMentor Intelligence
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">{aiData.summary}</p>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
             {/* Quick Actions specific to features */}
             <button onClick={() => setShowCouplesPlanner(true)} className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-pink-500/50 hover:bg-slate-800 transition-colors px-4 py-2.5 rounded-full text-sm font-bold shadow-xl">
               <HeartPulse className="w-4 h-4 text-pink-400" /> Couple's Planner
             </button>
             <button onClick={() => setShowLifeSimulator(true)} className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 transition-colors px-4 py-2.5 rounded-full text-sm font-bold shadow-xl">
               <PartyPopper className="w-4 h-4 text-amber-400" /> Life Event Simulator
             </button>

            <div className="flex items-center gap-4 bg-slate-900/50 p-3 pr-6 rounded-full border border-slate-800/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] ml-auto">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-slate-200">Health Score</span>
                <span className="text-xs text-slate-500 font-medium">Out of 100</span>
              </div>
              <motion.div key={globalScore} initial={{ scale: 0.8, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative w-16 h-16 rounded-full flex items-center justify-center bg-slate-800/80 border border-slate-700 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-700" strokeLinecap="round" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <motion.path
                    initial={{ strokeDasharray: "0, 100" }} animate={{ strokeDasharray: `${globalScore}, 100` }} transition={{ duration: 1.5, ease: "easeOut" }}
                    className={globalScore >= 70 ? "text-emerald-400" : globalScore >= 40 ? "text-amber-400" : "text-rose-400"}
                    strokeLinecap="round" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="font-extrabold text-2xl text-white z-10">{globalScore}</span>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* ALERTS */}
        {(aiData.alerts.length > 0 || aiData.problems_detected.length > 0) && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl shadow-lg flex flex-col md:flex-row gap-6 backdrop-blur-md">
            <div className="flex-1">
              <h3 className="text-rose-400 font-bold mb-3 flex items-center gap-2 uppercase text-xs tracking-wider"><AlertTriangle className="w-4 h-4" /> Critical Alerts</h3>
              <ul className="space-y-2">
                {aiData.alerts.map((alert, i) => <li key={i} className="text-rose-200 text-sm font-medium bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/50">{alert}</li>)}
              </ul>
            </div>
          </motion.div>
        )}

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* 6-DIMENSION HEALTH SCORE RADAR */}
          <motion.div variants={fadeIn} className="col-span-1 border border-slate-800 bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
             <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-cyan-400 cursor-default">
               <Activity className="w-5 h-5" /> Health Dimensions
             </h2>
             <p className="text-xs text-slate-400 mb-4">6-point analysis identifying gaps holding back your score.</p>
             <div className="w-full flex-1 flex items-center justify-center min-h-[220px] -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={aiData.health_dimensions}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                    <Radar name="Score" dataKey="A" stroke="#22d3ee" strokeWidth={2} fill="#22d3ee" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
          </motion.div>

          {/* FIRE TOOL (Spans 2 columns) */}
          <motion.div variants={fadeIn} className="col-span-1 md:col-span-2 border border-slate-800 bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden shadow-2xl flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 gap-6">
              <div>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-emerald-400">
                  <Target className="w-5 h-5" /> FIRE Path Planner: {aiData.goal_plan.goal}
                </h2>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-700">Req: ₹{aiData.goal_plan.required_monthly_investment.toLocaleString()}/mo</span>
                  <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-700">In {aiData.goal_plan.timeline}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${aiData.goal_plan.feasibility === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : aiData.goal_plan.feasibility === 'Moderate' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                     {aiData.goal_plan.feasibility.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 w-full sm:w-auto">
                 <span className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center">Simulated SIP: <span className="text-cyan-400">₹{(monthlySip).toLocaleString()}</span></span>
                <input type="range" min="5000" max="250000" step="1000" value={monthlySip} onChange={handleSipChange} className="w-full sm:w-48 accent-cyan-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>
            
            <div className="flex-1 w-full min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fireData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                  </defs>
                  <XAxis dataKey="age" stroke="#475569" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis stroke="#475569" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}Cr`} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#1e293b' }} itemStyle={{ color: '#10b981' }} formatter={(v) => [`₹${v.toFixed(1)} Cr`, 'Net Worth']} />
                  <Area type="monotone" dataKey="netWorth" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorNet)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* MF X-RAY WIDGET */}
          <motion.div variants={fadeIn} className="col-span-1 border border-slate-800 bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col">
             <div className="absolute -right-4 -top-4 opacity-5"><ScanSearch className="w-32 h-32" /></div>
             <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-fuchsia-400">
               <ScanSearch className="w-5 h-5" /> Portfolio X-Ray
             </h2>
             <p className="text-xs text-slate-400 mb-6">Live analysis via CAMS/KFintech.</p>
             
             <div className="flex flex-col gap-4 flex-1">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-fuchsia-500/30 transition-colors">
                   <div>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Holding Overlap</p>
                     <p className="text-xl font-bold text-slate-100">{aiData.portfolio_xray.overlap}</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/40">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                   </div>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-fuchsia-500/30 transition-colors">
                   <div>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">10Yr Expense Drag</p>
                     <p className="text-xl font-bold text-rose-400">{aiData.portfolio_xray.exp_drag}</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                      <TrendingUp className="w-4 h-4 text-slate-400" />
                   </div>
                </div>
                <div className="mt-auto">
                   <button onClick={() => setShowRebalancingPlan(true)} className="w-full text-xs text-fuchsia-400 font-bold text-center border border-fuchsia-500/20 bg-fuchsia-500/10 py-2 rounded-lg cursor-pointer hover:bg-fuchsia-500/20 transition-colors">Generate Rebalancing Plan →</button>
                </div>
             </div>
          </motion.div>

        </motion.div>

        {/* BOTTOM ROW: TAX WIZARD & ACTIONS */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
           
           {/* TAX WIZARD */}
           <motion.div variants={fadeIn} className="lg:col-span-1 border border-indigo-900/30 bg-gradient-to-br from-slate-900 to-indigo-950/20 rounded-3xl p-6 shadow-2xl flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Scale className="w-24 h-24" /></div>
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400">
                 <Scale className="w-5 h-5" /> Tax Wizard
             </h2>
             
             <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 relative z-10 mb-4 shadow-inner">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-slate-400 font-bold">Old Regime Tax:</span>
                  <span className="text-sm font-black text-rose-400">₹{aiData.tax_wizard.old.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="text-xs text-slate-400 font-bold">New Regime Tax:</span>
                  <span className="text-sm font-black text-emerald-400">₹{aiData.tax_wizard.new.toLocaleString()}</span>
                </div>
                <div className="mt-3 pt-1">
                  <p className="text-center text-xs font-bold text-indigo-300">Optimal: {aiData.tax_wizard.winner}</p>
                  <p className="text-center text-xl font-black text-indigo-100 mt-1 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">Saves ₹{aiData.tax_wizard.savings.toLocaleString()}</p>
                </div>
             </div>

             <div className="flex-1 space-y-2 relative z-10">
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Missing Deductions:</p>
               {aiData.tax_wizard.missingDeductions.map((d,i) => (
                 <div key={i} className="flex items-center gap-2 bg-slate-900 border border-slate-700/50 p-2.5 rounded-xl text-xs text-slate-300 shadow-sm"><Shield className="w-3.5 h-3.5 text-amber-500 shrink-0"/> {d}</div>
               ))}
             </div>
           </motion.div>

           {/* ACTION PLAN */}
           <motion.div variants={fadeIn} className="lg:col-span-2 border border-slate-800 bg-slate-900/80 rounded-3xl p-6 shadow-2xl flex flex-col">
              <div className="flex justify-between items-end mb-5">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
                  <BrainCircuit className="w-5 h-5 text-cyan-400" /> Executive Roadmap
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
               {aiData.monthly_action_plan.map((monthPlan, idx) => (
                 <div key={idx} className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 shadow-inner">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" /> {monthPlan.month}
                   </h3>
                   <ul className="space-y-3 relative z-10 font-mono text-xs">
                     {monthPlan.actions.map((action, i) => (
                       <li key={i} className="flex gap-2.5 text-slate-300 leading-relaxed border-l border-slate-800 pl-3">
                         <span className="text-cyan-500 font-bold shrink-0">{">"}</span> {action}
                       </li>
                     ))}
                   </ul>
                 </div>
               ))}
              </div>

               <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiData.execution_actions.map((action, i) => {
                    const isCompleted = completedActions.has(action.label);
                    const isLoading = activeAction === action.label;
                    return (
                      <button key={i} onClick={() => handleActionClick(action.label)} disabled={isCompleted || isLoading || activeAction !== null}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between group overflow-hidden relative shadow-[0_4px_15px_rgba(0,0,0,0.1)] ${
                          isCompleted ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400 pointer-events-none' : isLoading ? 'bg-slate-800 border-slate-700 text-cyan-400 pointer-events-none' : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-200'
                        }`}>
                        {isLoading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent w-full h-full animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />}
                        <span className="flex items-center gap-2 z-10">
                          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" /> : isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300" />}
                          <span className="truncate pr-2">{isCompleted ? action.label : isLoading ? `Processing...` : action.label}</span>
                        </span>
                        {!isCompleted && !isLoading && <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1" />}
                      </button>
                    )
                  })}
               </div>
           </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 text-center px-4 w-full">
           <p className="text-xs text-slate-400 sm:inline-block bg-slate-900/50 backdrop-blur px-6 py-2.5 rounded-full border border-slate-800/80 leading-relaxed shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
             <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mr-2">Policy Guardrail:</span> {aiData.adaptation_note}
           </p>
        </motion.div>

        {/* MODALS */}
        <AnimatePresence>
          {showCouplesPlanner && <CouplesPlanner onClose={() => setShowCouplesPlanner(false)} />}
          {showLifeSimulator && <LifeEventSimulator onClose={() => setShowLifeSimulator(false)} currentSip={monthlySip} currentTarget={10000000} timeline={parseInt(aiData.goal_plan.timeline) || 10} />}
          {showRebalancingPlan && <RebalancingPlan onClose={() => setShowRebalancingPlan(false)} overlapPercentage={aiData.portfolio_xray.overlap} expenseDrag={aiData.portfolio_xray.exp_drag} />}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default MoneyHealthDashboard;

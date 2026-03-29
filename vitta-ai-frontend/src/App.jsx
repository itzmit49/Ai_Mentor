import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import MoneyHealthDashboard from './VittaAiDashboard';
import Onboarding from './Onboarding';

function App() {
  const [appState, setAppState] = useState('onboarding'); 
  const [aiData, setAiData] = useState(null);

  const handleOnboardingComplete = (userData) => {
    setAppState('analyzing');
    
    setTimeout(() => {
      // 1. Data parsing
      const { name, age, income, expenses, emis, cash, investments, dependents, goal, horizon, risk } = userData;
      const parsedName = name ? name.trim().split(' ')[0] : '';
      const parsedAge = Number(age) || 30;
      const parsedIncome = Number(income) || 75000;
      const parsedExpenses = Number(expenses) || 30000;
      const parsedEmis = Number(emis) || 0;
      const parsedCash = Number(cash) || 0;
      const parsedInvestments = Number(investments) || 0;
      const parsedHorizon = Number(horizon) || 10;
      const hasDependents = dependents === 'Yes';
      const riskLevel = risk || 'Moderate';
      
      const totalOutflow = parsedExpenses + parsedEmis;
      const monthlySavings = Math.max(0, parsedIncome - totalOutflow);
      const savingsRate = (monthlySavings / parsedIncome) * 100;
      const emiRatio = (parsedEmis / parsedIncome) * 100;
      
      const emergencyFundMonths = totalOutflow > 0 ? (parsedCash / totalOutflow) : 0;
      const efTarget = hasDependents ? 6 : 3;

      let alerts = [];
      let executionActions = [];
      let monthlyActionsMonth1 = [];
      let monthlyActionsMonth2 = [];
      let aiThinking = [];
      
      let overallHealthScore = 50;

      // 6 Dimensions Metrics
      let scoreEmergency = Math.min(Math.round((emergencyFundMonths / efTarget) * 100), 100);
      let scoreDebt = Math.max(100 - (emiRatio * 2), 10);
      let scoreInsurance = hasDependents ? 30 : 70; // Assumes missing if not specified
      let scoreTax = 50; 
      let scoreRetirement = 50;
      let scoreDiversification = parsedInvestments > 100000 ? 60 : 20;

      // --- RULE EVALUATION & SCORING ---
      aiThinking.push(`Savings configured at ${savingsRate.toFixed(1)}% (Inflow: ₹${parsedIncome.toLocaleString()})`);
      
      if (emiRatio > 30) {
        alerts.push(`⚠ High debt burden (${emiRatio.toFixed(1)}% of income)`);
        aiThinking.push(`High debt detected (>30% DTI). Suggesting debt reduction before aggressive investing.`);
        monthlyActionsMonth1.push("Halt equity investments. Direct 80% of monthly surplus to pre-pay high-interest loans.");
        executionActions.push({ label: "Launch Debt Restructuring Planner", type: "tools" });
        overallHealthScore -= 15;
      } else {
        overallHealthScore += 10;
        aiThinking.push(`Debt-to-income is healthy (${emiRatio.toFixed(1)}%).`);
      }

      if (emergencyFundMonths < 3) {
        alerts.push(`⚠ Emergency fund is practically empty (${emergencyFundMonths.toFixed(1)} months)`);
        aiThinking.push(`Emergency fund < 3 months. Prioritizing liquid cash safety net.`);
        monthlyActionsMonth1.unshift(`Build emergency fund aggressively. Park ₹${Math.floor(totalOutflow * 3 - parsedCash).toLocaleString()} in liquid MFs.`);
        executionActions.push({ label: "Open Liquid/Arbitrage Fund", type: "investment" });
        overallHealthScore -= 15;
      } else if (emergencyFundMonths >= 3 && emergencyFundMonths < 6) {
        aiThinking.push(`Emergency fund is average (${emergencyFundMonths.toFixed(1)} months).`);
        overallHealthScore += 5;
        if (hasDependents) monthlyActionsMonth2.push("Top up emergency fund to reach a 6-month safety net (due to dependents).");
      } else {
        aiThinking.push(`Emergency fund is fully fortified.`);
        overallHealthScore += 15;
      }

      let adjustedRisk = riskLevel;
      if (hasDependents) {
        aiThinking.push(`Dependents noted. Highlighting severe insurance gap.`);
        if (scoreInsurance < 50) {
          monthlyActionsMonth1.push("Buy a pure-term insurance policy of at least 15x annual income.");
          monthlyActionsMonth2.push("Ensure comprehensive Family Floater Health Insurance (Base + Super Top-up).");
          executionActions.push({ label: "Calculate Insurance Gap", type: "insurance" });
        }
        if (riskLevel === 'Aggressive') adjustedRisk = 'Moderate';
        else if (riskLevel === 'Moderate') adjustedRisk = 'Conservative';
      }

      if (parsedHorizon < 3) {
        aiThinking.push(`Goal horizon is short. Overriding allocation to Conservative to protect capital.`);
        adjustedRisk = 'Conservative';
      } else if (parsedHorizon >= 3 && parsedHorizon <= 7) {
        if (adjustedRisk === 'Aggressive') adjustedRisk = 'Moderate';
      }

      // MF X-Ray specific logic
      let overlapPercentage = 0;
      let expDrag = 0;
      if (parsedInvestments > parsedIncome * 12) {
        overlapPercentage = 38; // Mock high overlap
        expDrag = Math.round(parsedInvestments * 0.018 * 10);
        aiThinking.push(`Detected substantial historic portfolio (₹${parsedInvestments.toLocaleString()}). Simulating CAMS X-Ray.`);
        monthlyActionsMonth1.push("Audit mutual funds. Detected 38% overlap in large-cap holdings.");
        executionActions.push({ label: "Run Full CAMS Portfolio X-Ray", type: "tools" });
      } else if (parsedInvestments > 0) {
        overlapPercentage = 12;
      } else {
         monthlyActionsMonth2.push(`Start automated SIPs of ₹${Math.floor(monthlySavings * 0.7).toLocaleString()} exactly on salary day.`);
      }

      let equityAlloc = "60%";
      let debtAlloc = "40%";
      if (adjustedRisk === "Conservative") { equityAlloc = "25%"; debtAlloc = "75%"; } 
      else if (adjustedRisk === "Aggressive") { equityAlloc = "85%"; debtAlloc = "15%"; }

      const requiredInvestment = Math.floor(parsedIncome * 0.4); 
      let feasibility = "Moderate";
      if (monthlySavings > requiredInvestment * 1.5) { feasibility = "Easy"; overallHealthScore += 10; scoreRetirement += 30; }
      else if (monthlySavings < requiredInvestment) { feasibility = "Difficult"; overallHealthScore -= 5; scoreRetirement -= 20; }
      aiThinking.push(`Goal feasibility mathematically modeled -> ${feasibility}`);

      // Tax Wizard Simulation
      const annualIncome = parsedIncome * 12;
      const oldRegimeTax = Math.max(0, (annualIncome - 500000) * 0.15); // Highly simplified mock
      const newRegimeTax = Math.max(0, (annualIncome - 700000) * 0.05);
      const taxOptimizer = {
        old: oldRegimeTax,
        new: newRegimeTax,
        winner: oldRegimeTax > newRegimeTax ? "New Scenario" : "Old Scenario",
        savings: Math.abs(oldRegimeTax - newRegimeTax),
        missingDeductions: ["NPS Tier 1 (Sec 80CCD)", "Health Premium (Sec 80D)"]
      };

      if (executionActions.length < 3) {
        executionActions.push({ label: `Auto-Start ${adjustedRisk} SIP`, type: "investment" });
        executionActions.push({ label: "Open Tax Optimization Wizard", type: "tax" });
      }
      
      if (monthlyActionsMonth1.length === 0) monthlyActionsMonth1.push("Automate your savings to deduct instantly on salary day.");
      if (monthlyActionsMonth2.length === 0) monthlyActionsMonth2.push("Sync bank accounts for automatic categorization.");

      const mockFinMentorResponse = {
        health_score: Math.min(Math.max(Math.round(overallHealthScore), 10), 100),
        health_dimensions: [
          { subject: 'Emergency', A: scoreEmergency },
          { subject: 'Insurance', A: scoreInsurance },
          { subject: 'Debt', A: scoreDebt },
          { subject: 'Tax', A: scoreTax },
          { subject: 'Retirement', A: scoreRetirement },
          { subject: 'Diversity', A: scoreDiversification }
        ],
        summary: `${parsedName ? 'Hi ' + parsedName + '! ' : ''}You have a ${savingsRate.toFixed(1)}% savings rate. We generated a ${adjustedRisk.toLowerCase()} wealth protocol targeted for ${parsedHorizon} years.`,
        
        ai_thinking: aiThinking,
        problems_detected: [],
        alerts: alerts,
        
        goal_plan: {
          goal: goal,
          required_monthly_investment: requiredInvestment,
          timeline: `${parsedHorizon} Years`,
          feasibility: feasibility
        },

        investment_plan: {
          monthly_sip: Math.floor(monthlySavings * 0.7) || 5000, 
          allocation: { equity: equityAlloc, debt: debtAlloc }
        },
        
        tax_wizard: taxOptimizer,
        
        portfolio_xray: {
          overlap: `${overlapPercentage}%`,
          exp_drag: expDrag.toLocaleString(),
          xirr: parsedInvestments > 0 ? "14.2%" : "N/A"
        },
        
        monthly_action_plan: [
          { month: "Phase 1: Structure", actions: monthlyActionsMonth1 },
          { month: "Phase 2: Compounding", actions: monthlyActionsMonth2 }
        ],

        execution_actions: executionActions,

        reasoning: `We configured a ${adjustedRisk} portfolio specifically due to your timeline ${hasDependents ? 'and family dependencies' : ''}. The holistic score highlights gaps in your Tax Strategy, which our Wizard can fix immediately.`,
        
        adaptation_note: "Life Event Trigger: Switch to the 'Couple Planner' if married to access dual-HRA optimization."
      };
      
      setAiData(mockFinMentorResponse);
      setAppState('dashboard');
    }, 4500); 
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {appState === 'onboarding' && (
          <motion.div key="onboarding" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }}>
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}
        
        {appState === 'analyzing' && (
          <motion.div 
            key="analyzing" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 relative"
          >
             <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
             
             <div className="w-24 h-24 mb-8 relative">
               <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-cyan-400 rounded-full border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Loader2 className="w-8 h-8 text-cyan-400 animate-pulse" />
               </div>
             </div>
             <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-3 tracking-tight">FinMentor AI is Computing</h2>
             <p className="text-slate-400 text-sm font-medium animate-pulse text-center max-w-sm">
                Evaluating 6 Dimensions of Wealth, running Tax Regime permutations, and scanning portfolio overlap...
             </p>
          </motion.div>
        )}

        {appState === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-screen overflow-y-auto">
            <MoneyHealthDashboard aiData={aiData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

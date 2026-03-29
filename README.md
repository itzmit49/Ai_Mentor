# VittaAI (FinMentor AI)

VittaAI is a comprehensive, AI-powered "Money Mentor" tailored specifically for the Indian financial market. It acts as an automated, holistic financial advisor that doesn't just show numbers, but gives actionable, prioritized advice to help users reach Financial Independence / Retire Early (FIRE).

## Core Features

1. **Smart Onboarding & Profiling**
   - Dynamic onboarding questionnaire to gather essential details like income, expenses, debts (EMIs), existing investments, dependents, financial goals, and risk tolerance to build a complete financial profile.

2. **6-Dimensional Financial Health Dashboard**
   - Evaluates your financial health out of 100 on an interactive radar chart across 6 key axes: **Emergency Fund, Debt, Insurance, Tax, Retirement, and Diversification**.

3. **Tax Optimization Wizard**
   - Dynamically compares tax liability under the **Old vs. New Indian Tax Regimes** based on income.
   - Identifies the winning scenario, calculates exact potential savings, and highlights missing deductions (e.g., NPS Tier 1 under Sec 80CCD or Health Premiums under Sec 80D).

4. **Mutual Fund Portfolio X-Ray**
   - Audits existing investments (conceptualized for CAMS/KFintech statements) to calculate:
     - **Portfolio Overlap:** Detecting if you hold too many similar large-cap or sector funds.
     - **Expense Ratio Drag:** Measuring how much potential wealth is lost to high fund management fees.
     - **XIRR (Extended Internal Rate of Return):** Showing accurate historic performance of SIPs.

5. **Couples Planner**
   - A specialized dashboard for married couples to consolidate dual-income households.
   - Optimizes combined tax brackets and intelligently splits deductions (like joint home loans or dual HRA) for maximum tax efficiency.

6. **FIRE Strategy & Rebalancing Plan**
   - Acts as an automated wealth manager to generate a structured **Investment Plan** with specific monthly SIP amounts.
   - Adjusts **Asset Allocation** (Equity vs. Debt ratio) dynamically based on goal horizon and risk profile.
   - Provides a comprehensive, phased **Monthly Action Plan** with concrete, prioritized execution steps.

7. **Life Event Simulator**
   - Interactive simulation tool allowing users to map out major future expenses (e.g., buying a house, children's education, or career breaks).
   - Projects how these events will impact long-term compounding and retirement timelines.

## Tech Stack Overview
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion (for animations), Recharts (for radar and area charts), Lucide React (for icons)
- **Backend / Data Models:** Python (`mf_overlap.py`), PostgreSQL (`vitta_ai_schema.sql`) for handling heavy logic like XIRR / portfolio overlapping rules.

## Getting Started
1. Clone the repository.
2. Navigate into the frontend app directory: `cd vitta-ai-frontend`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

-- =========================================================================
-- VittaAI - Database Schema for Couple's Planner & Optimization
-- Optimized for PostgreSQL
-- Handles individual accounts, joint households, dual-income optimization,
-- and split investments.
-- =========================================================================

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. HOUSEHOLDS
-- Represents a joint entity (e.g., married couple)
CREATE TABLE households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL, -- e.g., "Rahul & Priya"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS
-- Individual accounts that can be linked to a Household
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID REFERENCES households(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pan_number VARCHAR(10) UNIQUE NOT NULL, -- Crucial for Indian Tax logic
    dob DATE NOT NULL,
    tax_regime VARCHAR(10) CHECK (tax_regime IN ('OLD', 'NEW')),
    role_in_household VARCHAR(50), -- 'Primary Earner', 'Secondary Earner'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. INCOME STREAMS
-- Used by the Tax Wizard and Couple's Planner to determine brackets
CREATE TABLE incomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL, -- 'Salary', 'Business', 'Rental', 'Capital Gains'
    annual_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    hra_component DECIMAL(15, 2) DEFAULT 0.00, -- Specific to Indian salary structure
    basic_salary_component DECIMAL(15, 2) DEFAULT 0.00,
    financial_year VARCHAR(9) NOT NULL -- e.g., '2023-2024'
);

-- 4. PORTFOLIOS (X-Ray & Trackers)
-- Portfolios can be individual or jointly analyzed
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    household_id UUID REFERENCES households(id) ON DELETE SET NULL, -- If joint visibility enabled
    broker VARCHAR(100), -- 'Zerodha', 'CAMS', 'KFintech'
    portfolio_type VARCHAR(50), -- 'Equity', 'Mutual Funds', 'PPF', 'Crypto'
    is_joint_funded BOOLEAN DEFAULT FALSE,
    last_synced_at TIMESTAMP WITH TIME ZONE
);

-- 5. MUTUAL FUND HOLDINGS
-- Used for the CAMS/KFintech X-Ray and Overlap Logic
CREATE TABLE mf_holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    fund_name VARCHAR(255) NOT NULL,
    isin_code VARCHAR(20) NOT NULL,
    units DECIMAL(15, 4) NOT NULL,
    current_nav DECIMAL(15, 4) NOT NULL,
    avg_purchase_nav DECIMAL(15, 4) NOT NULL,
    expense_ratio DECIMAL(5, 2), -- the "drag"
    asset_class VARCHAR(50) -- 'Large Cap', 'Mid Cap', 'Debt'
);

-- 6. JOINT EXPENSES & LIABILITIES
-- Used for the Couple's Planner to optimize who pays what (e.g., Rent for HRA)
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    paid_by_user_id UUID REFERENCES users(id), -- Who actually funds it
    category VARCHAR(100) NOT NULL, -- 'Rent', 'Home Loan EMI', 'Lifestyle'
    monthly_amount DECIMAL(15, 2) NOT NULL,
    is_tax_deductible BOOLEAN DEFAULT FALSE,
    deduction_section VARCHAR(50) -- e.g., 'Sec 24(b)', 'Sec 80GG'
);

-- 7. TAX DECLARATIONS & PROGRESS
-- Used to compare 80C, 80D, NPS limits dynamically
CREATE TABLE tax_investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    section VARCHAR(20) NOT NULL, -- '80C', '80D', '80CCD(1B)'
    description VARCHAR(255), -- 'ELSS Mutual Fund', 'Health Insurance Premium'
    amount_invested DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    max_deduction_limit DECIMAL(15, 2) NOT NULL,
    financial_year VARCHAR(9) NOT NULL
);

-- 8. ON-CHAIN MILESTONES (SBTs)
-- Stores the wallet address and awarded Soulbound Tokens for gamification
CREATE TABLE onchain_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_address VARCHAR(255) NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    milestone_name VARCHAR(100) NOT NULL, -- e.g., '1st 1 Lakh Saved'
    minted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tx_hash VARCHAR(255) UNIQUE NOT NULL
);

-- INDEXES for fast lookup on dashboards
CREATE INDEX idx_users_household ON users(household_id);
CREATE INDEX idx_mf_portfolio ON mf_holdings(portfolio_id);
CREATE INDEX idx_tax_user_fy ON tax_investments(user_id, financial_year);

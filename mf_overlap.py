"""
VittaAI - Mutual Fund Overlap & X-Ray Calculator
Calculates the exact portfolio overlap between two or more mutual funds.
Used by the "CAMS/KFintech X-Ray" feature to detect if a user is buying 
the same underlying stocks across multiple funds and paying extra Expense Ratio.
"""
from typing import Dict, List, Tuple

def calculate_pairwise_overlap(fund_a_holdings: Dict[str, float], fund_b_holdings: Dict[str, float]) -> float:
    """
    Calculates the exact percentage overlap between two mutual funds based on underlying stocks.
    
    Formula: 
    For every common stock, take the minimum weight present in both funds.
    Sum these minimums to get the total portfolio overlap.
    
    Args:
        fund_a_holdings: Dict mapping Stock Symbol to % Weight (e.g., {'RELIANCE': 10.5, 'HDFC': 8.2})
        fund_b_holdings: Dict mapping Stock Symbol to % Weight
    
    Returns:
        float: Overlap percentage (0.0 to 100.0)
    """
    overlap_percentage = 0.0
    
    # Find intersection of stocks (stocks present in both funds)
    common_stocks = set(fund_a_holdings.keys()).intersection(set(fund_b_holdings.keys()))
    
    for stock in common_stocks:
        weight_in_a = fund_a_holdings[stock]
        weight_in_b = fund_b_holdings[stock]
        # The true overlap is the minimum exposure across both
        overlap_percentage += min(weight_in_a, weight_in_b)
        
    return overlap_percentage

def analyze_portfolio_for_drag(portfolio: Dict[str, Dict[str, float]], threshold: float = 60.0) -> List[Dict]:
    """
    Analyzes an entire portfolio of Mutual Funds to find redundant overlapping funds.
    
    Args:
        portfolio: Dict mapping Fund Name to its holdings dict
        threshold: Alert threshold percentage (default 60%). Funds with overlap > this are flagged.
        
    Returns:
        List of dictionaries containing alerts and overlap data, sorted by highest overlap.
    """
    fund_names = list(portfolio.keys())
    alerts = []
    
    for i in range(len(fund_names)):
        for j in range(i + 1, len(fund_names)):
            fund_a = fund_names[i]
            fund_b = fund_names[j]
            
            overlap = calculate_pairwise_overlap(portfolio[fund_a], portfolio[fund_b])
            
            if overlap >= threshold:
                alerts.append({
                    "funds": (fund_a, fund_b),
                    "overlap_percentage": round(overlap, 2),
                    "action": f"High Overlap Alert! Consider consolidating to save on Expense Ratio drag."
                })
                
    # Sort by highest overlap descending
    return sorted(alerts, key=lambda x: x["overlap_percentage"], reverse=True)

# ==========================================
# Example Usage / Test Driver
# ==========================================
if __name__ == "__main__":
    # Mock data scraped from KFintech/CAMS PDFs
    print("Running VittaAI X-Ray Analysis...")
    
    # User holds two "Different" Large Cap funds
    hdfc_top_100 = {
        "HDFCBANK": 9.5,
        "ICICIBANK": 8.0,
        "RELIANCE": 7.5,
        "INFY": 5.0,
        "TCS": 4.0,
        "ITC": 3.5
    }
    
    sbi_bluechip = {
        "HDFCBANK": 8.5,
        "ICICIBANK": 7.0,
        "RELIANCE": 9.0,
        "INFY": 4.5,
        "ITC": 4.5,
        "LARSEN": 3.0
    }
    
    parag_parikh_flexi = {
        "ALPHABET": 8.0,
        "MICROSOFT": 7.5,
        "HDFCBANK": 6.0,
        "BAJAJFINANCE": 5.0,
        "ITC": 4.0
    }
    
    user_portfolio = {
        "HDFC Top 100": hdfc_top_100,
        "SBI Bluechip Fund": sbi_bluechip,
        "Parag Parikh Flexi Cap": parag_parikh_flexi
    }
    
    # Run analysis looking for > 30% overlap just for demonstration
    insights = analyze_portfolio_for_drag(user_portfolio, threshold=30.0)
    
    print("\n[!] X-Ray Insights:")
    for alert in insights:
        f1, f2 = alert["funds"]
        print(f"-> {f1} <====> {f2}")
        print(f"   Overlap: {alert['overlap_percentage']}%")
        print(f"   Suggestion: {alert['action']}\n")

"""
DeFiSwap - A simple AMM-style swap contract in Python
"""

from zerothan.py_contracts import PySmartContract

class DeFiSwap(PySmartContract):
    """Simple Constant Product AMM (x * y = k)."""
    
    def __init__(self):
        super().__init__()
        
        # Balances of the two tokens in the pool
        self.token_a_reserves = self.state_var("token_a", 1000000)
        self.token_b_reserves = self.state_var("token_b", 1000000)
        
        # Admin
        self.admin = self.state_var("admin", self.msg_sender())
        
        # Fee (0.3% usually, here represented as 3 parts in 1000)
        self.fee = 3

    @view_function
    def get_reserves(self) -> list:
        """Get current reserves of both tokens."""
        return [self.token_a_reserves, self.token_b_reserves]

    @view_function
    def get_amount_out(self, amount_in: int, reserve_in: int, reserve_out: int) -> int:
        """Calculate amount out based on x*y=k formula."""
        if amount_in <= 0:
             raise Exception("Invalid input amount")
        if reserve_in <= 0 or reserve_out <= 0:
             raise Exception("Insufficient liquidity")
             
        amount_in_with_fee = amount_in * (1000 - self.fee)
        numerator = amount_in_with_fee * reserve_out
        denominator = (reserve_in * 1000) + amount_in_with_fee
        
        return numerator // denominator

    @public_function
    def swap_a_for_b(self, amount_a_in: int):
        """Swap Token A for Token B."""
        sender = self.msg_sender()
        
        # Verify inputs
        if amount_a_in <= 0:
            raise Exception("Amount must be positive")
            
        # Calculate output
        amount_b_out = self.get_amount_out(amount_a_in, self.token_a_reserves, self.token_b_reserves)
        
        if amount_b_out >= self.token_b_reserves:
             raise Exception("Insufficient liquidity for swap")
             
        # Update reserves
        self.token_a_reserves += amount_a_in
        self.token_b_reserves -= amount_b_out
        
        self.event("Swap", sender, "A_for_B", amount_a_in, amount_b_out)

    @public_function
    def swap_b_for_a(self, amount_b_in: int):
        """Swap Token B for Token A."""
        sender = self.msg_sender()
        
        if amount_b_in <= 0:
            raise Exception("Amount must be positive")
            
        amount_a_out = self.get_amount_out(amount_b_in, self.token_b_reserves, self.token_a_reserves)
        
        if amount_a_out >= self.token_a_reserves:
             raise Exception("Insufficient liquidity for swap")
             
        self.token_b_reserves += amount_b_in
        self.token_a_reserves -= amount_a_out
        
        self.event("Swap", sender, "B_for_A", amount_b_in, amount_a_out)

    @public_function
    def add_liquidity(self, amount_a: int, amount_b: int):
        """Add liquidity to the pool (simplified)."""
        sender = self.msg_sender()
        
        self.token_a_reserves += amount_a
        self.token_b_reserves += amount_b
        
        # In real pool, you'd mint LP tokens here based on contribution
        self.event("LiquidityAdded", sender, amount_a, amount_b)

"""
TokenMint - A simple standard token minting contract in Python
"""

from zerothan.py_contracts import PySmartContract

class TokenMint(PySmartContract):
    """A simple token that allows minting and burning."""
    
    def __init__(self):
        """Initialize the token."""
        super().__init__()
        
        # Token details
        self.name = "My Python Token"
        self.symbol = "MPT"
        self.decimals = 18
        
        # Total supply management
        self.total_supply = self.state_var("total_supply", 0)
        
        # Store balances
        self.balances = self.state_var("balances", {})
        
        # Access control
        self.admin = self.state_var("admin", self.msg_sender())
        self.minting_enabled = self.state_var("minting_enabled", True)

    @public_function
    def mint(self, to: str, amount: int):
        """Mint new tokens (Admin only)."""
        sender = self.msg_sender()
        
        if sender != self.admin:
            raise Exception("Only admin can mint!")
            
        if not self.minting_enabled:
            raise Exception("Minting is disabled!")
            
        current_bal = self.balances.get(to, 0)
        self.balances[to] = current_bal + amount
        self.total_supply += amount
        
        self.event("Transfer", "0x0000000000000000000000000000000000000000", to, amount)
        self.event("Mint", to, amount)

    @public_function
    def transfer(self, to: str, amount: int):
        """Transfer tokens to another address."""
        sender = self.msg_sender()
        sender_bal = self.balances.get(sender, 0)
        
        if sender_bal < amount:
            raise Exception("Insufficient balance!")
            
        recipient_bal = self.balances.get(to, 0)
        
        self.balances[sender] = sender_bal - amount
        self.balances[to] = recipient_bal + amount
        
        self.event("Transfer", sender, to, amount)

    @view_function
    def balance_of(self, owner: str) -> int:
        """Get the balance of an address."""
        return self.balances.get(owner, 0)

    @view_function
    def get_total_supply(self) -> int:
        """Get total supply."""
        return self.total_supply

    @public_function
    def burn(self, amount: int):
        """Burn your own tokens."""
        sender = self.msg_sender()
        sender_bal = self.balances.get(sender, 0)
        
        if sender_bal < amount:
            raise Exception("Insufficient balance to burn!")
            
        self.balances[sender] = sender_bal - amount
        self.total_supply -= amount
        
        self.event("Transfer", sender, "0x0000000000000000000000000000000000000000", amount)
        self.event("Burn", sender, amount)

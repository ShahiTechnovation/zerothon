"""
NFTSimple - A simple NFT contract in Python
"""

from zerothan.py_contracts import PySmartContract

class NFTSimple(PySmartContract):
    """A simplistic NFT contract."""
    
    def __init__(self):
        super().__init__()
        
        self.name = "Python NFT"
        self.symbol = "PNFT"
        
        # Maps token_id to owner address
        self.owners = self.state_var("owners", {})
        
        # Maps owner to token count
        self.balances = self.state_var("balances", {})
        
        # Maps token_id to approved address
        self.token_approvals = self.state_var("token_approvals", {})
        
        # Next token ID to mint
        self.next_token_id = self.state_var("next_token_id", 1)
        
        self.admin = self.state_var("admin", self.msg_sender())

    @public_function
    def mint(self, to: str):
        """Mint a new NFT to an address."""
        sender = self.msg_sender()
        if sender != self.admin:
            raise Exception("Only admin can mint!")
            
        token_id = self.next_token_id
        self.next_token_id += 1
        
        self.owners[token_id] = to
        self.balances[to] = self.balances.get(to, 0) + 1
        
        self.event("Transfer", "0x0000000000000000000000000000000000000000", to, token_id)
        return token_id

    @view_function
    def owner_of(self, token_id: int) -> str:
        """Get owner of a token."""
        owner = self.owners.get(token_id)
        if not owner:
            raise Exception("Token does not exist")
        return owner

    @public_function
    def transfer(self, to: str, token_id: int):
        """Transfer NFT."""
        sender = self.msg_sender()
        owner = self.owners.get(token_id)
        
        if not owner:
            raise Exception("Token does not exist")
            
        if sender != owner:
            # Check for approval
            approved = self.token_approvals.get(token_id)
            if sender != approved:
                raise Exception("Not owner or approved")
        
        # Clear approval
        if token_id in self.token_approvals:
            del self.token_approvals[token_id]
            
        # Update balances
        self.balances[owner] -= 1
        self.balances[to] = self.balances.get(to, 0) + 1
        
        # Update owner
        self.owners[token_id] = to
        
        self.event("Transfer", owner, to, token_id)

    @public_function
    def approve(self, to: str, token_id: int):
        """Approve an address to transfer a specific token."""
        sender = self.msg_sender()
        owner = self.owners.get(token_id)
        
        if sender != owner:
            raise Exception("Not owner")
            
        self.token_approvals[token_id] = to
        self.event("Approval", owner, to, token_id)

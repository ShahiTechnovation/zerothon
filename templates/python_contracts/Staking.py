"""
Staking - A simple staking contract in Python
"""

from zerothan.py_contracts import PySmartContract

class Staking(PySmartContract):
    """Allows users to stake tokens and earn rewards (simulated)."""
    
    def __init__(self):
        super().__init__()
        
        # Maps user address to staked amount
        self.stakes = self.state_var("stakes", {})
        
        # Total staked in contract
        self.total_staked = self.state_var("total_staked", 0)
        
        # Store when they staked (simulated timestamp)
        self.stake_times = self.state_var("stake_times", {})
        
        # Reward rate (e.g., 10% per duration step)
        self.reward_rate = 10 
        
    @public_function
    def stake(self, amount: int):
        """Stake tokens."""
        sender = self.msg_sender()
        
        if amount <= 0:
            raise Exception("Amount must be positive")
            
        # In a real system, you'd transferFrom a token contract here.
        # For this template, we assume the native currency or direct deposit logic.
        
        current_stake = self.stakes.get(sender, 0)
        
        # Calculate pending rewards if already staking
        if current_stake > 0:
            self._claim_rewards(sender)
            
        self.stakes[sender] = current_stake + amount
        self.total_staked += amount
        self.stake_times[sender] = self.block_number() # Using block number as time proxy
        
        self.event("Staked", sender, amount)

    @public_function
    def withdraw(self, amount: int):
        """Withdraw staked tokens."""
        sender = self.msg_sender()
        current_stake = self.stakes.get(sender, 0)
        
        if amount > current_stake:
            raise Exception("Insufficient stake")
            
        # Claim rewards first
        self._claim_rewards(sender)
        
        self.stakes[sender] = current_stake - amount
        self.total_staked -= amount
        
        self.event("Withdrawn", sender, amount)

    @public_function
    def claim(self):
        """Claim pending rewards."""
        sender = self.msg_sender()
        self._claim_rewards(sender)

    def _claim_rewards(self, user: str):
        """Internal helper to calculate and 'send' rewards."""
        current_stake = self.stakes.get(user, 0)
        if current_stake == 0:
            return
            
        last_stake_block = self.stake_times.get(user, 0)
        current_block = self.block_number()
        
        if current_block <= last_stake_block:
            return
            
        blocks_diff = current_block - last_stake_block
        reward = (current_stake * self.reward_rate * blocks_diff) // 100
        
        if reward > 0:
             # Reset time
            self.stake_times[user] = current_block
            self.event("RewardPaid", user, reward)
            # In real contract, mint or transfer reward tokens here

    @view_function
    def get_stake(self, user: str) -> int:
        return self.stakes.get(user, 0)

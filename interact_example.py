"""
Example: How to interact with your deployed Python contract
"""

from avax_cli.interactor import ContractInteractor
from avax_cli.wallet import WalletManager
import json

# 1. Setup configuration
config = {
    "network": "fuji",
    "rpc_url": "https://api.avax-test.network/ext/bc/C/rpc",
    "chain_id": 43113
}

# 2. Load wallet
wallet = WalletManager()
# wallet.create_from_private_key("YOUR_PRIVATE_KEY")
# OR use environment variable:
# export PRIVATE_KEY="your_key_here"

# 3. Create interactor
interactor = ContractInteractor(config, wallet)

# 4. Get contract info (shows all functions)
interactor.get_contract_info("YourContractName")

# 5. Call VIEW functions (read-only, no gas)
result = interactor.call_view_function(
    "YourContractName",  # contract_name
    "get"  # function_name
    # Add arguments after function_name:
    # , 123  # Example argument
)
print(f"View result: {result}")

# 6. Send TRANSACTIONS (write, costs gas)
tx_hash = interactor.send_transaction(
    "YourContractName",  # contract_name
    "set",  # function_name
    42  # Argument: new value
)
print(f"Transaction hash: {tx_hash}")

# 7. Check balance (example for DeFi contract)
balance = interactor.call_view_function(
    "DeFiContract",  # contract_name
    "balance_of",  # function_name
    "0xYourAddress"  # User address argument
)
print(f"Balance: {balance}")

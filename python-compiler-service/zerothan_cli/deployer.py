"""Smart contract deployment to Avalanche C-Chain."""

import json
import time
from pathlib import Path
from typing import Dict, List, Any, Optional

from web3 import Web3
# Web3 middleware no longer needed for Avalanche C-Chain
from rich.console import Console

from .compiler import get_contract_artifacts
from .wallet import WalletManager

console = Console()


def get_web3_connection(config: Dict[str, Any]) -> Web3:
    """
    Create Web3 connection to Avalanche RPC.
    
    Args:
        config: Configuration dictionary with RPC URL and chain ID
    
    Returns:
        Configured Web3 instance
    """
    w3 = Web3(Web3.HTTPProvider(config["rpc_url"]))
    
    # Avalanche C-Chain is EVM compatible, no special middleware needed
    
    if not w3.is_connected():
        raise ConnectionError(f"Failed to connect to RPC: {config['rpc_url']}")
    
    # Verify chain ID
    try:
        chain_id = w3.eth.chain_id
        expected_chain_id = config["chain_id"]
        if chain_id != expected_chain_id:
            console.print(
                f"[yellow]Warning:[/yellow] Connected chain ID ({chain_id}) "
                f"does not match config ({expected_chain_id})"
            )
    except Exception as e:
        console.print(f"[yellow]Warning:[/yellow] Could not verify chain ID: {e}")
    
    return w3


def estimate_gas(
    contract_name: str,
    constructor_args: List[Any],
    config: Dict[str, Any],
    wallet: WalletManager,
    keystore_file: str = None,
    password: str = None
) -> int:
    """
    Estimate gas for contract deployment.
    
    Args:
        contract_name: Name of the contract to deploy
        constructor_args: Arguments for contract constructor
        config: Configuration dictionary
        wallet: WalletManager instance
        keystore_file: Optional keystore file path
        password: Optional password for keystore
    
    Returns:
        Estimated gas amount
    """
    # Get contract artifacts
    artifacts = get_contract_artifacts(contract_name)
    
    # Connect to blockchain
    w3 = get_web3_connection(config)
    
    # Get account
    account = wallet.get_account(keystore_file, password)
    
    # Create contract instance
    contract = w3.eth.contract(
        abi=artifacts["abi"],
        bytecode=artifacts["bytecode"]
    )
    
    # Build constructor transaction
    constructor_tx = contract.constructor(*constructor_args).build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gas': 0,  # Will be estimated
        'gasPrice': w3.eth.gas_price,
        'chainId': config["chain_id"]
    })
    
    # Estimate gas
    gas_estimate = w3.eth.estimate_gas(constructor_tx)
    
    return gas_estimate


def deploy_contract(
    contract_name: str,
    constructor_args: List[Any],
    config: Dict[str, Any],
    wallet: WalletManager,
    keystore_file: str = None,
    password: str = None
) -> Optional[Dict[str, Any]]:
    """
    Deploy a smart contract to Avalanche.
    
    Args:
        contract_name: Name of the contract to deploy
        constructor_args: Arguments for contract constructor
        config: Configuration dictionary
        wallet: WalletManager instance
        keystore_file: Optional keystore file path
        password: Optional password for keystore
    
    Returns:
        Deployment result dictionary or None if failed
    """
    try:
        # Get contract artifacts
        artifacts = get_contract_artifacts(contract_name)
        console.print(f"[blue]Loading contract artifacts for {contract_name}...[/blue]")
        
        # Connect to blockchain
        w3 = get_web3_connection(config)
        console.print(f"[blue]Connected to {config['network']} network[/blue]")
        
        # Get account
        account = wallet.get_account(keystore_file, password)
        console.print(f"[blue]Using wallet: {account.address}[/blue]")
        
        # Check balance
        balance = w3.eth.get_balance(account.address)
        balance_eth = w3.from_wei(balance, 'ether')
        console.print(f"[blue]Account balance: {balance_eth:.6f} AVAX[/blue]")
        
        if balance == 0:
            console.print("[yellow]Warning:[/yellow] Account has zero balance. Deployment may fail.")
        
        # Create contract instance
        contract = w3.eth.contract(
            abi=artifacts["abi"],
            bytecode=artifacts["bytecode"]
        )
        
        # Get gas price with some buffer
        gas_price = w3.eth.gas_price
        # Add 10% buffer to gas price
        gas_price = int(gas_price * 1.1)
        
        # Build constructor transaction
        nonce = w3.eth.get_transaction_count(account.address)
        constructor_tx = contract.constructor(*constructor_args).build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gas': 0,  # Will be set after estimation
            'gasPrice': gas_price,
            'chainId': config["chain_id"]
        })
        
        # Estimate gas with buffer
        gas_estimate = w3.eth.estimate_gas(constructor_tx)
        gas_limit = int(gas_estimate * 1.2)  # 20% buffer
        constructor_tx['gas'] = gas_limit
        
        console.print(f"[blue]Gas estimate: {gas_estimate:,}[/blue]")
        console.print(f"[blue]Gas limit: {gas_limit:,}[/blue]")
        console.print(f"[blue]Gas price: {w3.from_wei(gas_price, 'gwei'):.2f} gwei[/blue]")
        
        # Calculate deployment cost
        deployment_cost = gas_limit * gas_price
        deployment_cost_eth = w3.from_wei(deployment_cost, 'ether')
        console.print(f"[blue]Estimated deployment cost: {deployment_cost_eth:.6f} AVAX[/blue]")
        
        if balance < deployment_cost:
            raise ValueError(
                f"Insufficient balance. Need {deployment_cost_eth:.6f} AVAX, "
                f"but only have {balance_eth:.6f} AVAX"
            )
        
        # Sign and send transaction
        console.print("[blue]Signing and sending transaction...[/blue]")
        signed_tx = account.sign_transaction(constructor_tx)
        # Fixed: Use correct attribute name for Web3.py
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        console.print(f"[blue]Transaction sent: {tx_hash.hex()}[/blue]")
        console.print("[blue]Waiting for confirmation...[/blue]")
        
        # Wait for transaction receipt
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=300)
        
        if receipt.status == 1:
            console.print("[green]Transaction confirmed![/green]")
            
            # Get deployed contract address
            contract_address = receipt.contractAddress
            
            # Calculate actual gas used
            gas_used = receipt.gasUsed
            actual_cost = gas_used * gas_price
            actual_cost_eth = w3.from_wei(actual_cost, 'ether')
            
            # Save deployment info
            deployment_info = {
                'contract_name': contract_name,
                'address': contract_address,
                'tx_hash': tx_hash.hex(),
                'gas_used': gas_used,
                'gas_price': gas_price,
                'deployment_cost': float(actual_cost_eth),
                'network': config['network'],
                'chain_id': config['chain_id'],
                'deployer': account.address,
                'constructor_args': constructor_args,
                'block_number': receipt.blockNumber
            }
            
            # Save to deployments file
            deployments_file = Path("deployments.json")
            deployments = {}
            if deployments_file.exists():
                with open(deployments_file) as f:
                    deployments = json.load(f)
            
            if config['network'] not in deployments:
                deployments[config['network']] = {}
            
            deployments[config['network']][contract_name] = deployment_info
            
            with open(deployments_file, 'w') as f:
                json.dump(deployments, f, indent=2)
            
            console.print(f"[green]Deployment info saved to {deployments_file}[/green]")
            
            return deployment_info
        
        else:
            console.print("[red]Transaction failed![/red]")
            return None
    
    except Exception as e:
        console.print(f"[red]Deployment failed:[/red] {str(e)}")
        return None


def verify_contract(
    contract_address: str,
    contract_name: str,
    config: Dict[str, Any]
) -> bool:
    """
    Verify contract on Snowtrace (placeholder implementation).
    
    Args:
        contract_address: Address of deployed contract
        contract_name: Name of the contract
        config: Configuration dictionary
    
    Returns:
        True if verification successful
    """
    api_key = config.get("explorer_api_key")
    if not api_key:
        console.print("[yellow]No explorer API key configured. Skipping verification.[/yellow]")
        return False
    
    # This is a placeholder - actual implementation would interact with Snowtrace API
    console.print(f"[blue]Contract verification would be implemented here[/blue]")
    console.print(f"[blue]Contract: {contract_name} at {contract_address}[/blue]")
    console.print(f"[blue]Network: {config['network']}[/blue]")
    
    return True
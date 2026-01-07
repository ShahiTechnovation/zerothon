"""Main CLI interface for avax-cli tool."""

import json
import os
import sys
from pathlib import Path
from typing import Optional

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from .compiler import compile_contracts
from .deployer import deploy_contract, estimate_gas
from .wallet import WalletManager
from .interactor import interact_with_contract, show_contract_info

app = typer.Typer(
    name="zerothon-cli",
    help="Production-ready CLI tool for deploying Solidity smart contracts to any EVM-compatible chain",
    rich_markup_mode="rich",
)

console = Console()


@app.command()
def init(
    project_name: str = typer.Argument(..., help="Name of the project to initialize"),
    force: bool = typer.Option(False, "--force", "-f", help="Overwrite existing project"),
) -> None:
    """Initialize a new zerothon project with sample contracts and configuration."""
    project_path = Path(project_name)
    
    if project_path.exists() and not force:
        console.print(f"[red]Error:[/red] Project '{project_name}' already exists. Use --force to overwrite.")
        raise typer.Exit(1)
    
    # Create project structure
    project_path.mkdir(exist_ok=True)
    (project_path / "contracts").mkdir(exist_ok=True)
    (project_path / "build").mkdir(exist_ok=True)
    (project_path / "scripts").mkdir(exist_ok=True)
    
    # Create default config
    config = {
        "network": "fuji",
        "rpc_url": "https://api.avax-test.network/ext/bc/C/rpc",
        "chain_id": 43113,
        "explorer_api_key": ""
    }
    
    with open(project_path / "zerothon_config.json", "w") as f:
        json.dump(config, f, indent=2)
    
    # Create sample Python smart contract
    python_contract = '''from zerothon_cli.py_contracts import PySmartContract

class SimpleStorage(PySmartContract):
    """Simple storage contract written in Python."""
    
    def __init__(self):
        super().__init__()
        self.stored_data = self.state_var("stored_data", 0)
    
    @public_function
    def set(self, value: int):
        """Set stored data."""
        self.stored_data = value
        self.event("DataStored", value)
    
    @view_function  
    def get(self) -> int:
        """Get stored data."""
        return self.stored_data
'''
    
    # Create sample Solidity contract too
    solidity_contract = '''// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleStorageSol {
    uint256 private storedData;
    
    event DataStored(uint256 indexed value, address indexed sender);
    
    constructor(uint256 _initialValue) {
        storedData = _initialValue;
    }
    
    function set(uint256 _value) public {
        storedData = _value;
        emit DataStored(_value, msg.sender);
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}'''
    
    with open(project_path / "contracts" / "SimpleStorage.py", "w") as f:
        f.write(python_contract)
        
    with open(project_path / "contracts" / "SimpleStorage.sol", "w") as f:
        f.write(solidity_contract)
    
    # Create sample deploy script
    deploy_script = f'''#!/usr/bin/env python3
"""Deploy script for {project_name} contracts."""

import json
import os
from pathlib import Path

from zerothon_cli.deployer import deploy_contract
from zerothon_cli.wallet import WalletManager


def main():
    """Deploy SimpleStorage contract to EVM chain."""
    # Load configuration
    with open("zerothon_config.json") as f:
        config = json.load(f)
    
    # Initialize wallet
    wallet = WalletManager()
    
    # Deploy contract with constructor parameter
    constructor_args = [42]  # Initial value for SimpleStorage
    
    result = deploy_contract(
        contract_name="SimpleStorage",
        constructor_args=constructor_args,
        config=config,
        wallet=wallet
    )
    
    if result:
        print(f"Contract deployed successfully!")
        print(f"Address: {{result['address']}}")
        print(f"Transaction: {{result['tx_hash']}}")
        print(f"Gas used: {{result['gas_used']}}")


if __name__ == "__main__":
    main()
'''
    
    with open(project_path / "scripts" / "deploy.py", "w") as f:
        f.write(deploy_script)
    
    # Make deploy script executable
    os.chmod(project_path / "scripts" / "deploy.py", 0o755)
    
    console.print(Panel(
        f"[green]✓[/green] Project '{project_name}' initialized successfully!\n\n"
        f"[yellow]Next steps:[/yellow]\n"
        f"1. cd {project_name}\n"
        f"2. zerothon-cli wallet new  # Create a new wallet\n"
        f"3. zerothon-cli compile     # Compile contracts (Python + Solidity)\n"
        f"4. zerothon-cli deploy SimpleStorage  # Deploy Python contract to testnet\n"
        f"5. zerothon-cli deploy SimpleStorageSol  # Deploy Solidity contract",
        title="Project Initialized",
        border_style="green"
    ))


@app.command()
def compile(
    contracts_dir: str = typer.Option("contracts", "--contracts", "-c", help="Contracts directory"),
    output_dir: str = typer.Option("build", "--output", "-o", help="Output directory for compiled artifacts"),
    solc_version: Optional[str] = typer.Option(None, "--solc-version", help="Solidity compiler version"),
) -> None:
    """Compile Solidity contracts using py-solc-x."""
    contracts_path = Path(contracts_dir)
    output_path = Path(output_dir)
    
    if not contracts_path.exists():
        console.print(f"[red]Error:[/red] Contracts directory '{contracts_dir}' not found.")
        raise typer.Exit(1)
    
    try:
        with console.status("[bold green]Compiling contracts..."):
            results = compile_contracts(contracts_path, output_path, solc_version)
        
        if results:
            table = Table(title="Compilation Results")
            table.add_column("Contract", style="cyan")
            table.add_column("Status", style="green")
            table.add_column("Output", style="yellow")
            
            for contract_name, result in results.items():
                status = "✓ Success" if result["success"] else "✗ Failed"
                output_file = result.get("output_file", "N/A")
                table.add_row(contract_name, status, str(output_file))
            
            console.print(table)
            console.print(f"[green]Compilation completed![/green] Artifacts saved to '{output_dir}'")
        else:
            console.print("[yellow]No contracts found to compile.[/yellow]")
    
    except Exception as e:
        console.print(f"[red]Compilation failed:[/red] {str(e)}")
        raise typer.Exit(1)


@app.command()
def deploy(
    contract_name: str = typer.Argument(..., help="Name of the contract to deploy"),
    constructor_args: Optional[str] = typer.Option(None, "--args", help="Constructor arguments as JSON array"),
    config_file: str = typer.Option("zerothon_config.json", "--config", help="Configuration file path"),
    dry_run: bool = typer.Option(False, "--dry-run", help="Estimate gas without deploying"),
    network: Optional[str] = typer.Option(None, "--network", help="Override network from config"),
) -> None:
    """Deploy a compiled contract to EVM chain."""
    config_path = Path(config_file)
    
    if not config_path.exists():
        console.print(f"[red]Error:[/red] Config file '{config_file}' not found.")
        console.print("Run 'avax-cli init <project_name>' to create a project with default config.")
        raise typer.Exit(1)
    
    # Load configuration
    with open(config_path) as f:
        config = json.load(f)
    
    # Override network if specified
    if network:
        if network == "mainnet":
            config.update({
                "network": "mainnet",
                "rpc_url": "https://api.avax.network/ext/bc/C/rpc",
                "chain_id": 43114
            })
        elif network == "fuji":
            config.update({
                "network": "fuji", 
                "rpc_url": "https://api.avax-test.network/ext/bc/C/rpc",
                "chain_id": 43113
            })
    
    # Parse constructor arguments
    args = []
    if constructor_args:
        try:
            args = json.loads(constructor_args)
            if not isinstance(args, list):
                raise ValueError("Constructor arguments must be a JSON array")
        except json.JSONDecodeError as e:
            console.print(f"[red]Error:[/red] Invalid JSON in constructor arguments: {e}")
            raise typer.Exit(1)
    
    # Initialize wallet
    wallet = WalletManager()
    
    try:
        if dry_run:
            with console.status("[bold yellow]Estimating gas..."):
                gas_estimate = estimate_gas(contract_name, args, config, wallet)
            
            console.print(Panel(
                f"[yellow]Gas Estimation for {contract_name}[/yellow]\n\n"
                f"Estimated gas: {gas_estimate:,}\n"
                f"Network: {config['network']} (Chain ID: {config['chain_id']})\n"
                f"RPC URL: {config['rpc_url']}",
                title="Dry Run Results",
                border_style="yellow"
            ))
        else:
            with console.status(f"[bold green]Deploying {contract_name} to {config['network']}..."):
                result = deploy_contract(contract_name, args, config, wallet)
            
            if result:
                console.print(Panel(
                    f"[green]✓ Contract deployed successfully![/green]\n\n"
                    f"Contract: {contract_name}\n"
                    f"Address: {result['address']}\n"
                    f"Transaction: {result['tx_hash']}\n"
                    f"Gas used: {result['gas_used']:,}\n"
                    f"Network: {config['network']} (Chain ID: {config['chain_id']})",
                    title="Deployment Successful",
                    border_style="green"
                ))
            else:
                console.print("[red]Deployment failed. Check logs for details.[/red]")
                raise typer.Exit(1)
    
    except Exception as e:
        console.print(f"[red]Deployment error:[/red] {str(e)}")
        raise typer.Exit(1)


wallet_app = typer.Typer(help="Wallet management commands")
app.add_typer(wallet_app, name="wallet")


@wallet_app.command()
def new(
    password: Optional[str] = typer.Option(None, "--password", help="Wallet password (will prompt if not provided)"),
    keystore_file: str = typer.Option("zerothon_key.json", "--keystore", help="Keystore file path"),
) -> None:
    """Generate a new wallet and save encrypted keystore."""
    if password is None:
        password = typer.prompt("Enter password for new wallet", hide_input=True)
        confirm_password = typer.prompt("Confirm password", hide_input=True)
        
        if password != confirm_password:
            console.print("[red]Error:[/red] Passwords do not match.")
            raise typer.Exit(1)
    
    try:
        wallet_manager = WalletManager()
        address = wallet_manager.create_wallet(password or "", keystore_file)
        
        console.print(Panel(
            f"[green]✓ New wallet created successfully![/green]\n\n"
            f"Address: {address}\n"
            f"Keystore: {keystore_file}\n\n"
            f"[yellow]⚠️  Important:[/yellow]\n"
            f"• Keep your password safe - it cannot be recovered\n"
            f"• Back up your keystore file\n"
            f"• Fund your wallet with AVAX before deploying contracts",
            title="Wallet Created",
            border_style="green"
        ))
    
    except Exception as e:
        console.print(f"[red]Error creating wallet:[/red] {str(e)}")
        raise typer.Exit(1)


@wallet_app.command()
def show(
    keystore_file: str = typer.Option("zerothon_key.json", "--keystore", help="Keystore file path"),
) -> None:
    """Show wallet address and balance information."""
    try:
        wallet_manager = WalletManager()
        
        # Try to get address from environment variable first
        if os.getenv("PRIVATE_KEY"):
            address = wallet_manager.get_address_from_env()
            source = "Environment variable (PRIVATE_KEY)"
        else:
            if not Path(keystore_file).exists():
                console.print(f"[red]Error:[/red] Keystore file '{keystore_file}' not found.")
                console.print("Run 'zerothon-cli wallet new' to create a new wallet.")
                raise typer.Exit(1)
            
            password = typer.prompt(f"Enter password for {keystore_file}", hide_input=True)
            address = wallet_manager.load_wallet(keystore_file, password)
            source = f"Keystore file ({keystore_file})"
        
        console.print(Panel(
            f"[cyan]Wallet Information[/cyan]\n\n"
            f"Address: {address}\n"
            f"Source: {source}\n\n"
            f"[yellow]Note:[/yellow] Balance checking requires RPC connection.\n"
            f"Use 'zerothon-cli deploy --dry-run' to test connectivity.",
            title="Wallet Details",
            border_style="cyan"
        ))
    
    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise typer.Exit(1)


@app.command()
def interact(
    contract_name: str = typer.Argument(..., help="Name of the deployed contract"),
    function_name: str = typer.Argument(..., help="Function to call"),
    args: Optional[str] = typer.Option(None, "--args", "-a", help="Function arguments (comma-separated)"),
    view: bool = typer.Option(False, "--view", "-v", help="Call as view function (no transaction)"),
) -> None:
    """Interact with deployed smart contracts."""
    try:
        # Load configuration
        # Load configuration
        config_file = Path("zerothon_config.json")
        if not config_file.exists():
            console.print("[red]Error:[/red] zerothon_config.json not found. Run 'zerothon-cli init' first.")
            raise typer.Exit(1)
        
        with open(config_file) as f:
            config = json.load(f)
        
        # Initialize wallet
        wallet_manager = WalletManager()
        
        # Parse arguments
        parsed_args = []
        if args:
            parsed_args = [arg.strip() for arg in args.split(",")]
            # Try to convert to appropriate types
            for i, arg in enumerate(parsed_args):
                try:
                    # Try int first
                    if arg.isdigit():
                        parsed_args[i] = int(arg)
                    # Try float
                    elif "." in arg and arg.replace(".", "").isdigit():
                        parsed_args[i] = float(arg)
                    # Keep as string otherwise
                except ValueError:
                    pass
        
        # Call function
        result = interact_with_contract(
            contract_name=contract_name,
            function_name=function_name,
            args=parsed_args,
            config=config,
            wallet=wallet_manager,
            is_view=view
        )
        
        if result is None and not view:
            console.print("[red]Transaction failed![/red]")
            raise typer.Exit(1)
            
    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise typer.Exit(1)


@app.command()
def info(
    contract_name: str = typer.Argument(..., help="Name of the deployed contract"),
) -> None:
    """Show information about a deployed contract."""
    try:
        # Load configuration
        # Load configuration
        config_file = Path("zerothon_config.json")
        if not config_file.exists():
            console.print("[red]Error:[/red] zerothon_config.json not found. Run 'zerothon-cli init' first.")
            raise typer.Exit(1)
        
        with open(config_file) as f:
            config = json.load(f)
        
        # Initialize wallet
        wallet_manager = WalletManager()
        
        # Show contract info
        show_contract_info(contract_name, config, wallet_manager)
        
    except Exception as e:
        console.print(f"[red]Error:[/red] {str(e)}")
        raise typer.Exit(1)


def main():
    """Main entry point for the CLI."""
    app()


if __name__ == "__main__":
    main()
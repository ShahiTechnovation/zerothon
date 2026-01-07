// Blockchain integration with ethers.js

import { ethers } from "ethers"
import type { NetworkConfig } from "@/lib/networks"

import { DEFAULT_NETWORKS } from "@/lib/networks"
export const NETWORKS = DEFAULT_NETWORKS

export async function connectWallet(): Promise<{ address: string; balance: string }> {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed")
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  })

  const provider = new ethers.BrowserProvider(window.ethereum)
  const balance = await provider.getBalance(accounts[0])

  return {
    address: accounts[0],
    balance: ethers.formatEther(balance),
  }
}

export async function switchNetwork(network: NetworkConfig): Promise<void> {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed")
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${network.chainId.toString(16)}` }],
    })
  } catch (error: any) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${network.chainId.toString(16)}`,
            chainName: network.name,
            rpcUrls: [network.rpcUrl],
            nativeCurrency: network.nativeCurrency,
            blockExplorerUrls: [network.explorer],
          },
        ],
      })
    } else {
      throw error
    }
  }
}

export async function deployContract(
  abi: any[],
  bytecode: string,
  constructorArgs: any[],
  network: NetworkConfig,
): Promise<{ address: string; txHash: string }> {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed")
  }

  await switchNetwork(network)

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const factory = new ethers.ContractFactory(abi, bytecode, signer)
  const contract = await factory.deploy(...constructorArgs)

  await contract.waitForDeployment()
  const address = await contract.getAddress()

  return {
    address,
    txHash: contract.deploymentTransaction()?.hash || "",
  }
}

export async function callContractFunction(
  address: string,
  abi: any[],
  functionName: string,
  args: any[],
  network: NetworkConfig,
): Promise<any> {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed")
  }

  await switchNetwork(network)

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const contract = new ethers.Contract(address, abi, signer)

  const fragment = contract.interface.getFunction(functionName)
  const isView = fragment?.stateMutability === "view" || fragment?.stateMutability === "pure"

  if (isView) {
    return await contract[functionName](...args)
  } else {
    const tx = await contract[functionName](...args)
    await tx.wait()
    return tx.hash
  }
}

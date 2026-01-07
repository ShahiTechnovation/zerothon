"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Rocket, Wallet } from "lucide-react"
import { NETWORKS } from "@/lib/blockchain"
import type { NetworkConfig, DeploymentEntry } from "@/lib/types"

interface DeployPanelProps {
  selectedNetwork: NetworkConfig
  onNetworkChange: (network: NetworkConfig) => void
  walletAddress: string | null
  walletBalance: string | null
  onConnectWallet: () => void
  onDeploy: (constructorArgs: string[]) => void
  isDeploying: boolean
  deployedContracts: DeploymentEntry[]
}

export function DeployPanel({
  selectedNetwork,
  onNetworkChange,
  walletAddress,
  walletBalance,
  onConnectWallet,
  onDeploy,
  isDeploying,
  deployedContracts,
}: DeployPanelProps) {
  const [constructorArgs, setConstructorArgs] = useState<string[]>([""])

  const handleDeploy = () => {
    onDeploy(constructorArgs.filter((arg) => arg.trim()))
  }

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="p-4 border-b border-border space-y-3">
        <h2 className="text-sm font-semibold">Deploy & Run</h2>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Network</label>
          <Select
            value={selectedNetwork.name}
            onValueChange={(name) => {
              const network = Object.values(NETWORKS).find((n) => n.name === name)
              if (network) onNetworkChange(network)
            }}
          >
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(NETWORKS).map((network) => (
                <SelectItem key={network.name} value={network.name}>
                  {network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onConnectWallet} variant={walletAddress ? "default" : "outline"} size="sm" className="w-full">
          <Wallet className="w-4 h-4 mr-2" />
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
        </Button>

        {walletBalance && (
          <p className="text-xs text-muted-foreground">Balance: {Number.parseFloat(walletBalance).toFixed(4)} AVAX</p>
        )}

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Constructor Args</label>
          <div className="space-y-2">
            {constructorArgs.map((arg, i) => (
              <Input
                key={i}
                placeholder={`Arg ${i + 1}`}
                value={arg}
                onChange={(e) => {
                  const newArgs = [...constructorArgs]
                  newArgs[i] = e.target.value
                  setConstructorArgs(newArgs)
                }}
                className="text-xs"
              />
            ))}
          </div>
          <Button
            onClick={() => setConstructorArgs([...constructorArgs, ""])}
            variant="outline"
            size="sm"
            className="w-full mt-2 text-xs"
          >
            Add Argument
          </Button>
        </div>

        <Button onClick={handleDeploy} disabled={isDeploying || !walletAddress} className="w-full" size="sm">
          <Rocket className="w-4 h-4 mr-2" />
          {isDeploying ? "Deploying..." : "Deploy Contract"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold mb-3">Deployed Contracts</h3>
        {deployedContracts.length === 0 ? (
          <p className="text-xs text-muted-foreground">No contracts deployed yet</p>
        ) : (
          <div className="space-y-2">
            {deployedContracts.map((contract) => (
              <div key={contract.id} className="p-2 bg-muted rounded text-xs">
                <p className="font-semibold">{contract.contractName}</p>
                <p className="text-muted-foreground truncate">{contract.address}</p>
                <p className="text-muted-foreground text-xs">{contract.network}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

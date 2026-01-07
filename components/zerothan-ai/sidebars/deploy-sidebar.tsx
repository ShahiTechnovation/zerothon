
import { useState } from 'react'
import { ethers } from 'ethers'
import { Play, Eye, Box, AlertTriangle, FileCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DeploySidebarProps {
    account: string | null
    compiledContract: any
    deployedContract: { address: string, abi: any[] } | null
    isDeploying: boolean
    onDeploy: () => void
    onConnect: () => void
}

export function DeploySidebar({
    account,
    compiledContract,
    deployedContract,
    isDeploying,
    onDeploy,
    onConnect
}: DeploySidebarProps) {
    const [functionArgs, setFunctionArgs] = useState<{ [key: string]: string }>({})
    const [interactionLogs, setInteractionLogs] = useState<string[]>([])

    const handleInteract = async (func: any) => {
        if (!deployedContract || !window.ethereum) return

        try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(deployedContract.address, deployedContract.abi, signer)

            const args = func.inputs.map((input: any) => functionArgs[`${func.name}-${input.name}`] || '')

            setInteractionLogs(prev => [`⏳ Calling ${func.name}...`, ...prev])

            let result: any
            if (func.stateMutability === 'view' || func.stateMutability === 'pure') {
                result = await contract[func.name](...args)
                setInteractionLogs(prev => [`✓ Result: ${result.toString()}`, ...prev])
            } else {
                const tx = await contract[func.name](...args)
                setInteractionLogs(prev => [`⏳ Tx sent: ${tx.hash.slice(0, 8)}...`, ...prev])
                await tx.wait()
                setInteractionLogs(prev => [`✓ Confirmed!`, ...prev])
            }
        } catch (e: any) {
            setInteractionLogs(prev => [`✗ Error: ${e.message.slice(0, 50)}...`, ...prev])
        }
    }

    const renderFunctionInput = (func: any, input: any) => (
        <Input
            key={input.name}
            placeholder={`${input.name} (${input.type})`}
            className="h-6 text-[10px] bg-[#1e1e1e] border-[#3e3e42] mb-1"
            value={functionArgs[`${func.name}-${input.name}`] || ''}
            onChange={e => setFunctionArgs({ ...functionArgs, [`${func.name}-${input.name}`]: e.target.value })}
        />
    )

    return (
        <div className="h-full flex flex-col w-52 bg-[#1e1e1e] border-r border-[#3e3e42] overflow-hidden">
            <div className="p-3 border-b border-[#3e3e42]">
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Deploy & Run</span>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-3 space-y-4">
                    {/* Wallet Section */}
                    <div>
                        <div className="text-[10px] text-gray-500 mb-1 font-bold">ACCOUNT</div>
                        {account ? (
                            <div className="p-2 bg-[#252526] rounded border border-[#3e3e42] text-xs text-gray-300 break-all font-mono">
                                {account}
                            </div>
                        ) : (
                            <Button size="sm" onClick={onConnect} className="w-full h-7 text-xs">Connect Wallet</Button>
                        )}
                    </div>

                    {/* Contract Section */}
                    <div>
                        <div className="text-[10px] text-gray-500 mb-1 font-bold">COMPILED CONTRACT</div>
                        {compiledContract ? (
                            <div className="p-2 bg-[#252526] rounded border border-[#3e3e42] text-xs">
                                <div className="flex items-center gap-2 mb-1">
                                    <FileCode className="w-3 h-3 text-purple-400" />
                                    <span className="font-medium text-white">{compiledContract.name || 'Contract'}</span>
                                </div>
                                <div className="text-[10px] text-gray-500">{compiledContract.bytecode.length / 2} bytes</div>
                                <Button
                                    onClick={onDeploy}
                                    disabled={isDeploying || !account}
                                    className="w-full mt-2 h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    {isDeploying ? 'Deploying...' : 'Deploy'}
                                </Button>
                            </div>
                        ) : (
                            <div className="p-2 bg-[#252526]/50 rounded border border-[#3e3e42] border-dashed text-xs text-center text-gray-500">
                                No compiled contract
                            </div>
                        )}
                    </div>

                    {/* Deployed Contract Interaction */}
                    <div>
                        <div className="text-[10px] text-gray-500 mb-1 font-bold flex items-center justify-between">
                            <span>INTERACT</span>
                            {deployedContract && <Badge variant="outline" className="text-[9px] h-4">Active</Badge>}
                        </div>

                        {deployedContract ? (
                            <div className="space-y-3">
                                <div className="p-2 bg-[#1e1e1e] border border-[#3e3e42] rounded text-[10px] font-mono text-gray-400 break-all">
                                    At: {deployedContract.address}
                                </div>

                                <div className="space-y-2">
                                    {deployedContract.abi.filter((item: any) => item.type === 'function').map((func: any) => (
                                        <div key={func.name} className="p-2 bg-[#252526] rounded border border-[#3e3e42]">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-medium text-gray-200">{func.name}</span>
                                                {func.stateMutability === 'view' || func.stateMutability === 'pure' ? (
                                                    <Eye className="w-3 h-3 text-blue-400" />
                                                ) : (
                                                    <Play className="w-3 h-3 text-orange-400" />
                                                )}
                                            </div>
                                            {func.inputs.map((input: any) => renderFunctionInput(func, input))}
                                            <Button
                                                size="sm"
                                                onClick={() => handleInteract(func)}
                                                className={`w-full h-6 text-[10px] mt-1 ${func.stateMutability === 'view'
                                                    ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                                                    : 'bg-orange-600/20 text-orange-400 hover:bg-orange-600/30'
                                                    }`}
                                            >
                                                {func.stateMutability === 'view' ? 'Call' : 'Transact'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-xs text-gray-500 italic">Deploy a contract to interact</div>
                        )}
                    </div>
                </div>
            </ScrollArea>

            {/* Interaction Logs */}
            <div className="h-24 bg-[#131316] border-t border-[#3e3e42] p-2 overflow-y-auto font-mono text-[10px]">
                {interactionLogs.length === 0 && <span className="text-gray-600">Interaction logs...</span>}
                {interactionLogs.map((log, i) => (
                    <div key={i} className="text-gray-300 mb-0.5">{log}</div>
                ))}
            </div>
        </div>
    )
}

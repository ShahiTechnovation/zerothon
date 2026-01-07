
import { useState, useEffect, useMemo } from 'react'
import { Check, ChevronsUpDown, Globe, Plus, Search, Server, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { NetworkConfig, fetchAllNetworks } from '@/lib/networks'

interface NetworkSelectorProps {
    currentNetwork: NetworkConfig | null
    savedNetworks: NetworkConfig[]
    onNetworkSelect: (network: NetworkConfig) => void
    onAddNetwork: (network: NetworkConfig) => void
}

export function NetworkSelector({
    currentNetwork,
    savedNetworks,
    onNetworkSelect,
    onAddNetwork
}: NetworkSelectorProps) {
    const [open, setOpen] = useState(false)
    const [allNetworks, setAllNetworks] = useState<NetworkConfig[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Load networks when dialog opens
    useEffect(() => {
        if (open && allNetworks.length === 0) {
            setIsLoading(true)
            fetchAllNetworks()
                .then(networks => {
                    setAllNetworks(networks)
                })
                .finally(() => setIsLoading(false))
        }
    }, [open, allNetworks.length])

    // Filter logic
    const displayedNetworks = useMemo(() => {
        const query = searchQuery.toLowerCase().trim()

        // If searching, show matches from ALL networks (Chainlist)
        if (query) {
            return allNetworks
                .filter(n => n.name.toLowerCase().includes(query) || n.chainId.toString().includes(query))
                .slice(0, 50)
        }

        // If not searching, show ONLY saved networks
        return savedNetworks
    }, [allNetworks, savedNetworks, searchQuery])

    const handleSelect = (network: NetworkConfig) => {
        // If it's a new network (not in saved), add it first
        const isNew = !savedNetworks.find(n => n.chainId === network.chainId)
        if (isNew) {
            onAddNetwork(network)
        } else {
            onNetworkSelect(network)
        }
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-[160px] h-6 justify-between text-[10px] bg-[#3f3f46] border border-[#52525b] text-gray-200 hover:bg-[#52525b] hover:text-white hover:border-blue-500 transition-all cursor-pointer z-50"
                >
                    <div className="flex items-center gap-2 truncate">
                        {currentNetwork ? (
                            <>
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentNetwork ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                <span className="truncate">{currentNetwork.name}</span>
                            </>
                        ) : (
                            <>
                                <Wifi className="w-3 h-3 text-gray-400" />
                                <span>Select Network</span>
                            </>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] bg-[#18181b] border-[#27272a] text-gray-300 p-0 overflow-hidden z-[100] gap-0">
                <div className="p-4 border-b border-[#27272a] bg-[#1f1f23]">
                    <div className="flex items-center gap-2 mb-3">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <span className="font-bold text-white">Network Manager</span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                            className="flex h-9 w-full rounded-md border border-[#3e3e42] bg-[#131316] px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                            placeholder="Search Chainlist (e.g. 'Optimism', '8453')..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="h-[400px] overflow-y-auto bg-[#131316]">
                    {isLoading && searchQuery ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span>Searching 1000+ chains...</span>
                        </div>
                    ) : displayedNetworks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
                            {searchQuery ? (
                                <p>No networks found matching "{searchQuery}"</p>
                            ) : (
                                <>
                                    <p className="mb-2">Search to find new networks</p>
                                    <p className="text-xs opacity-50">Powered by Chainlist</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-[#27272a]">
                            {!searchQuery && (
                                <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase bg-[#1a1a1d]">
                                    My Networks
                                </div>
                            )}

                            {displayedNetworks.map(network => (
                                <button
                                    key={network.chainId}
                                    onClick={() => handleSelect(network)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-[#1f1f23] transition-colors group text-left"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-200 group-hover:text-blue-400 transition-colors">
                                                {network.name}
                                            </span>
                                            {savedNetworks.find(n => n.chainId === network.chainId) && (
                                                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 rounded">Saved</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                            <span className="bg-[#27272a] px-1 rounded">ID: {network.chainId}</span>
                                            <span>{network.nativeCurrency.symbol}</span>
                                        </div>
                                    </div>
                                    {currentNetwork?.chainId === network.chainId && (
                                        <Check className="w-4 h-4 text-green-500" />
                                    )}
                                </button>
                            ))}

                            {searchQuery && displayedNetworks.length > 0 && (
                                <div className="p-2 text-center text-[10px] text-gray-500">
                                    Showing top matches from Chainlist
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

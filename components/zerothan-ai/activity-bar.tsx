
import { Files, Search, Settings, Beaker, GitGraph, Box } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ActivityView = 'explorer' | 'search' | 'deploy' | 'settings' | 'extensions'

interface ActivityBarProps {
    activeView: ActivityView
    onViewChange: (view: ActivityView) => void
}

export function ActivityBar({ activeView, onViewChange }: ActivityBarProps) {
    const items = [
        { id: 'explorer', icon: Files, label: 'Explorer' },
        { id: 'search', icon: Search, label: 'Search' },
        { id: 'deploy', icon: Beaker, label: 'Test & Deploy' },
        { id: 'extensions', icon: Box, label: 'Extensions' },
    ]

    return (
        <div className="w-10 bg-[#18181b] border-r border-[#27272a] flex flex-col items-center py-2 justify-between z-20">
            <div className="flex flex-col items-center gap-2 w-full">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeView === item.id
                    return (
                        <div key={item.id} className="relative group w-full flex justify-center px-2">
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r-full" />
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "w-7 h-7 rounded-lg transition-all duration-200",
                                    isActive
                                        ? "text-blue-400 bg-blue-500/10"
                                        : "text-gray-400 hover:text-white hover:bg-[#27272a]"
                                )}
                                onClick={() => onViewChange(item.id as ActivityView)}
                                title={item.label}
                            >
                                <Icon className="w-4 h-4" />
                            </Button>
                        </div>
                    )
                })}
            </div>

            <div className="flex flex-col items-center gap-2 w-full mb-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "w-7 h-7 rounded-lg text-gray-400 hover:text-white hover:bg-[#27272a] transition-all",
                        activeView === 'settings' && "text-blue-400 bg-blue-500/10"
                    )}
                    onClick={() => onViewChange('settings')}
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

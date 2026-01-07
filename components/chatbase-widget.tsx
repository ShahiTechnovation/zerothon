'use client'

import { useEffect } from 'react'

declare global {
    interface Window {
        chatbase: any
    }
}

export function ChatbaseWidget() {
    useEffect(() => {
        // Chatbase initialization script
        (function () {
            if (!window.chatbase || window.chatbase("getState") !== "initialized") {
                window.chatbase = (...args: any[]) => {
                    if (!window.chatbase.q) {
                        window.chatbase.q = []
                    }
                    window.chatbase.q.push(args)
                }
                window.chatbase = new Proxy(window.chatbase, {
                    get(target, prop) {
                        if (prop === "q") {
                            return target.q
                        }
                        return (...args: any[]) => target(prop, ...args)
                    }
                })
            }

            const onLoad = function () {
                const script = document.createElement("script")
                script.src = "https://www.chatbase.co/embed.min.js"
                script.id = "NvAPH2KZUE58uo14cOsIj"
                script.setAttribute("domain", "www.chatbase.co")
                document.body.appendChild(script)
            }

            if (document.readyState === "complete") {
                onLoad()
            } else {
                window.addEventListener("load", onLoad)
            }
        })()
    }, [])

    return null // Widget is injected by script
}

interface ChatbaseEmbedProps {
    chatbotId?: string
    className?: string
}

export function ChatbaseEmbed({
    chatbotId = 'NvAPH2KZUE58uo14cOsIj',
    className = ''
}: ChatbaseEmbedProps) {
    return (
        <div className={`relative w-full h-full ${className}`}>
            <iframe
                src={`https://www.chatbase.co/chatbot-iframe/${chatbotId}`}
                width="100%"
                height="100%"
                frameBorder="0"
                className="rounded-lg"
                style={{
                    border: 'none',
                    background: '#000'
                }}
                title="zerothon AI Assistant"
            />
        </div>
    )
}

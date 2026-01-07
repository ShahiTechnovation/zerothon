"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Download, Copy, RotateCcw } from "lucide-react"
import JSZip from "jszip"

interface FileContent {
  name: string
  content: string
  language: string
}

interface Project {
  name: string
  description: string
  files: FileContent[]
}

export function BoltDiyIDE() {
  const [prompt, setPrompt] = useState("")
  const [project, setProject] = useState<Project | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)

  const generateProject = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setOutput(["Generating project..."])

    try {
      // Simulate project generation with Web3 templates
      const mockProject: Project = {
        name: "Web3 dApp",
        description: prompt,
        files: [
          {
            name: "contract.sol",
            language: "solidity",
            content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyDApp {
    // ${prompt}
    
    constructor() {}
    
    function execute() public {
        // Implementation
    }
}`,
          },
          {
            name: "App.tsx",
            language: "typescript",
            content: `import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export default function App() {
  const [account, setAccount] = useState('')

  useEffect(() => {
    connectWallet()
  }, [])

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    setAccount(address)
  }

  return (
    <div className="p-8">
      <h1>Web3 dApp</h1>
      <p>Connected: {account}</p>
    </div>
  )
}`,
          },
          {
            name: "deploy.js",
            language: "javascript",
            content: `const hre = require('hardhat')

async function main() {
  const MyDApp = await hre.ethers.getContractFactory('MyDApp')
  const contract = await MyDApp.deploy()
  await contract.deployed()
  console.log('Contract deployed to:', contract.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})`,
          },
        ],
      }

      setProject(mockProject)
      setSelectedFile(mockProject.files[0].name)
      setOutput(["✓ Project generated successfully!", "✓ Ready to deploy"])
    } catch (error) {
      setOutput([`✗ Error: ${error instanceof Error ? error.message : "Unknown error"}`])
    } finally {
      setIsLoading(false)
    }
  }

  const downloadProject = () => {
    if (!project) return

    const zip = new JSZip()
    if (!zip) {
      alert("JSZip not available. Please copy files manually.")
      return
    }

    project.files.forEach((file) => {
      zip.file(file.name, file.content)
    })

    zip.generateAsync({ type: "blob" }).then((blob: Blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${project.name}.zip`
      a.click()
    })
  }

  const copyFile = (content: string) => {
    navigator.clipboard.writeText(content)
    setOutput(["✓ Copied to clipboard"])
  }

  const currentFile = project?.files.find((f) => f.name === selectedFile)

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Input Section */}
      <Card className="p-4 bg-slate-800 border-slate-700">
        <div className="flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your Web3 dApp... (e.g., 'Create an ERC20 token with staking rewards')"
            className="flex-1 bg-slate-900 border-slate-600 text-white placeholder-slate-500"
            rows={3}
          />
          <Button
            onClick={generateProject}
            disabled={isLoading || !prompt.trim()}
            className="bg-blue-600 hover:bg-blue-700 h-fit"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Main IDE Section */}
      {project && (
        <div className="flex-1 flex gap-4 min-h-0">
          {/* File Explorer */}
          <Card className="w-48 bg-slate-800 border-slate-700 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-white mb-3">Files</h3>
            <div className="space-y-2">
              {project.files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file.name)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedFile === file.name ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {file.name}
                </button>
              ))}
            </div>
          </Card>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <Card className="flex-1 bg-slate-800 border-slate-700 p-4 flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-white">{selectedFile}</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => currentFile && copyFile(currentFile.content)}
                    className="h-8"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadProject} className="h-8 bg-transparent">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <pre className="flex-1 overflow-auto bg-slate-900 p-3 rounded text-xs text-slate-300 font-mono">
                <code>{currentFile?.content}</code>
              </pre>
            </Card>

            {/* Terminal */}
            <Card className="h-32 bg-slate-800 border-slate-700 p-4 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-white">Terminal</h3>
                <Button size="sm" variant="outline" onClick={() => setOutput([])} className="h-6">
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
              <div
                ref={terminalRef}
                className="flex-1 overflow-auto bg-slate-900 p-2 rounded text-xs text-green-400 font-mono"
              >
                {output.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

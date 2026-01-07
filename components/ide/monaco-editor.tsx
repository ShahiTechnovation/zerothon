"use client"

import { useRef } from "react"
import Editor from "@monaco-editor/react"
import * as monaco from "monaco-editor"
import type { Language } from "@/lib/types"

interface MonacoEditorProps {
  value: string
  language: Language
  onChange: (value: string) => void
  onSave: () => void
}

export function MonacoEditor({ value, language, onChange, onSave }: MonacoEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave()
    })
  }

  return (
    <Editor
      height="100%"
      language={language === "solidity" ? "sol" : "python"}
      value={value}
      onChange={(val) => onChange(val || "")}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
      }}
    />
  )
}

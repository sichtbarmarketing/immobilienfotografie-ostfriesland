"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bold, Italic, Underline, List, ListOrdered, Link, Undo, Redo, Type, Eye, Code } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState("visual")
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (activeTab === "visual" && editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value, activeTab])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      onChange(content)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const insertLink = () => {
    const url = prompt("URL eingeben:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  const formatHeading = (level: number) => {
    execCommand("formatBlock", `h${level}`)
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b bg-gray-50 p-2">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-3">
              <TabsTrigger value="visual" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="html" className="text-xs">
                <Code className="w-3 h-3 mr-1" />
                HTML
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">
                <Type className="w-3 h-3 mr-1" />
                Vorschau
              </TabsTrigger>
            </TabsList>
          </div>

          {activeTab === "visual" && (
            <div className="flex flex-wrap gap-1 mt-2">
              <Button variant="outline" size="sm" onClick={() => formatHeading(1)} className="text-xs h-7">
                H1
              </Button>
              <Button variant="outline" size="sm" onClick={() => formatHeading(2)} className="text-xs h-7">
                H2
              </Button>
              <Button variant="outline" size="sm" onClick={() => formatHeading(3)} className="text-xs h-7">
                H3
              </Button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <Button variant="outline" size="sm" onClick={() => execCommand("bold")} className="h-7">
                <Bold className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => execCommand("italic")} className="h-7">
                <Italic className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => execCommand("underline")} className="h-7">
                <Underline className="w-3 h-3" />
              </Button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <Button variant="outline" size="sm" onClick={() => execCommand("insertUnorderedList")} className="h-7">
                <List className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => execCommand("insertOrderedList")} className="h-7">
                <ListOrdered className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={insertLink} className="h-7 bg-transparent">
                <Link className="w-3 h-3" />
              </Button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <Button variant="outline" size="sm" onClick={() => execCommand("undo")} className="h-7">
                <Undo className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => execCommand("redo")} className="h-7">
                <Redo className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="visual" className="m-0">
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none [&_*]:text-black"
            onInput={updateContent}
            onBlur={updateContent}
            style={{ color: "#000000" }}
            suppressContentEditableWarning={true}
          />
        </TabsContent>

        <TabsContent value="html" className="m-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextareaChange}
            className="min-h-[400px] font-mono text-sm border-0 rounded-none resize-none focus:ring-0"
            placeholder={placeholder}
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div className="min-h-[400px] p-4 bg-gray-50">
            <div
              className="prose prose-sm max-w-none [&_*]:text-black [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_p]:text-black [&_strong]:text-black"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t bg-gray-50 p-2 text-xs text-gray-600">
        <p>
          <strong>Tipp:</strong> Verwenden Sie die Toolbar-Buttons oder Tastenkürzel (Strg+B für Fett, Strg+I für
          Kursiv). Im HTML-Tab können Sie direkt HTML-Code bearbeiten.
        </p>
      </div>
    </div>
  )
}

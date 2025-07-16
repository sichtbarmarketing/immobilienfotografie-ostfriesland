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
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const insertHeading = (level: number) => {
    execCommand("formatBlock", `h${level}`)
  }

  const insertLink = () => {
    const url = prompt("Link URL eingeben:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  return (
    <div className="border rounded-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <TabsList className="h-auto p-1">
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="html" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Vorschau
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="visual" className="m-0">
          {/* Toolbar */}
          <div className="border-b p-2 flex flex-wrap gap-1">
            <div className="flex gap-1 border-r pr-2 mr-2">
              <Button variant="ghost" size="sm" onClick={() => insertHeading(1)} title="Überschrift 1">
                H1
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertHeading(2)} title="Überschrift 2">
                H2
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertHeading(3)} title="Überschrift 3">
                H3
              </Button>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-2">
              <Button variant="ghost" size="sm" onClick={() => execCommand("bold")} title="Fett (Ctrl+B)">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => execCommand("italic")} title="Kursiv (Ctrl+I)">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => execCommand("underline")} title="Unterstrichen (Ctrl+U)">
                <Underline className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-2">
              <Button variant="ghost" size="sm" onClick={() => execCommand("insertUnorderedList")} title="Aufzählung">
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand("insertOrderedList")}
                title="Nummerierte Liste"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-2">
              <Button variant="ghost" size="sm" onClick={insertLink} title="Link einfügen">
                <Link className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => execCommand("undo")} title="Rückgängig (Ctrl+Z)">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => execCommand("redo")} title="Wiederholen (Ctrl+Y)">
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Editor */}
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[400px] p-4 focus:outline-none"
            style={{ color: "#000000" }}
            onInput={updateContent}
            onBlur={updateContent}
            suppressContentEditableWarning={true}
          />
        </TabsContent>

        <TabsContent value="html" className="m-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            className="min-h-[400px] font-mono text-sm border-0 rounded-none resize-none focus:ring-0"
          />
          <div className="p-2 text-xs text-gray-500 border-t bg-gray-50">
            <strong>HTML Tags:</strong> &lt;h1&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;,
            &lt;u&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a href=""&gt;, &lt;br&gt;
          </div>
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div className="min-h-[400px] p-4 bg-gray-50">
            <div
              className="prose prose-sm max-w-none"
              style={{ color: "#000000" }}
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bold, Italic, Underline, List, ListOrdered, Link, Heading1, Heading2, Heading3, Eye, Code } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function RichTextEditor({ value, onChange, placeholder, rows = 15 }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "html">("visual")
  const [htmlContent, setHtmlContent] = useState(value)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setHtmlContent(value)
  }, [value])

  const insertHtml = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = htmlContent.substring(start, end)

    const newText = htmlContent.substring(0, start) + before + selectedText + after + htmlContent.substring(end)

    setHtmlContent(newText)
    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const formatButtons = [
    {
      icon: Heading1,
      label: "Überschrift 1",
      action: () => insertHtml("<h1>", "</h1>"),
    },
    {
      icon: Heading2,
      label: "Überschrift 2",
      action: () => insertHtml("<h2>", "</h2>"),
    },
    {
      icon: Heading3,
      label: "Überschrift 3",
      action: () => insertHtml("<h3>", "</h3>"),
    },
    {
      icon: Bold,
      label: "Fett",
      action: () => insertHtml("<strong>", "</strong>"),
    },
    {
      icon: Italic,
      label: "Kursiv",
      action: () => insertHtml("<em>", "</em>"),
    },
    {
      icon: Underline,
      label: "Unterstrichen",
      action: () => insertHtml("<u>", "</u>"),
    },
    {
      icon: List,
      label: "Aufzählung",
      action: () => insertHtml("<ul>\n<li>", "</li>\n</ul>"),
    },
    {
      icon: ListOrdered,
      label: "Nummerierte Liste",
      action: () => insertHtml("<ol>\n<li>", "</li>\n</ol>"),
    },
    {
      icon: Link,
      label: "Link",
      action: () => insertHtml('<a href="https://example.com">', "</a>"),
    },
  ]

  const insertParagraph = () => {
    insertHtml("<p>", "</p>")
  }

  const insertLineBreak = () => {
    insertHtml("<br />")
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "visual" | "html")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visuell
          </TabsTrigger>
          <TabsTrigger value="html" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            HTML
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4">
          {/* Formatting Toolbar */}
          <div className="border rounded-lg p-3 bg-muted/30">
            <div className="flex flex-wrap gap-1">
              {formatButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.label}
                  className="h-8 w-8 p-0"
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
              <div className="w-px h-6 bg-border mx-1" />
              <Button variant="ghost" size="sm" onClick={insertParagraph} title="Absatz" className="h-8 px-2 text-xs">
                P
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={insertLineBreak}
                title="Zeilenumbruch"
                className="h-8 px-2 text-xs"
              >
                BR
              </Button>
            </div>
          </div>

          {/* HTML Editor */}
          <Textarea
            ref={textareaRef}
            value={htmlContent}
            onChange={(e) => {
              setHtmlContent(e.target.value)
              onChange(e.target.value)
            }}
            placeholder={placeholder}
            rows={rows}
            className="font-mono text-sm"
          />

          {/* Quick Help */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <p className="font-medium mb-2">Schnellhilfe:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>• Wählen Sie Text aus und klicken Sie auf die Formatierungs-Buttons</div>
              <div>• &lt;br /&gt; für Zeilenumbruch</div>
              <div>• &lt;p&gt;&lt;/p&gt; für Absätze</div>
              <div>• &lt;strong&gt;&lt;/strong&gt; für fetten Text</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="html" className="space-y-4">
          {/* Preview */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium mb-3 text-sm">Vorschau:</h4>
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>

          {/* HTML Source */}
          <Textarea
            value={htmlContent}
            onChange={(e) => {
              setHtmlContent(e.target.value)
              onChange(e.target.value)
            }}
            placeholder={placeholder}
            rows={rows}
            className="font-mono text-sm"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

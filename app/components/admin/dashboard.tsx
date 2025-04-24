"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")

  const handleLogout = async () => {
    try {
      // Clear session storage
      sessionStorage.removeItem("adminAuth")
      sessionStorage.removeItem("adminUser")

      // Call logout API
      await fetch("/api/auth/logout", { method: "POST" })

      // Force a hard navigation to the login page
      window.location.href = "/admin"
    } catch (error) {
      console.error("Logout error:", error)
      // Fallback to just clearing session storage and redirecting
      sessionStorage.removeItem("adminAuth")
      sessionStorage.removeItem("adminUser")
      window.location.href = "/admin"
    }
  }

  return (
    <div className="bg-background rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <Button variant="outline" onClick={handleLogout}>
          Abmelden
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="upload">Bilder hochladen</TabsTrigger>
          <TabsTrigger value="manage">Bilder verwalten</TabsTrigger>
          <TabsTrigger value="content">Inhalte bearbeiten</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Bild hochladen</CardTitle>
              <CardDescription>Laden Sie neue Bilder für Ihre Website hoch</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Bildkategorie *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Bitte auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero">Hero Bild</SelectItem>
                        <SelectItem value="interior">Innenaufnahmen</SelectItem>
                        <SelectItem value="exterior">Außenaufnahmen</SelectItem>
                        <SelectItem value="drone">Drohnenaufnahmen</SelectItem>
                        <SelectItem value="virtual-staging">Virtual Homestaging</SelectItem>
                        <SelectItem value="about">Über uns</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Titel</Label>
                    <Input id="title" placeholder="Titel des Bildes" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Bild auswählen *</Label>
                  <Input id="file" type="file" accept="image/*" />
                </div>

                <Button type="submit" className="w-full">
                  Bild hochladen
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Bilder verwalten</CardTitle>
              <CardDescription>Verwalten Sie die hochgeladenen Bilder</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Keine Bilder vorhanden. Laden Sie zuerst Bilder hoch.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Inhalte bearbeiten</CardTitle>
              <CardDescription>Bearbeiten Sie die Inhalte Ihrer Website</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="content-title">Titel</Label>
                  <Input id="content-title" placeholder="Seitentitel" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-editor">Inhalt</Label>
                  <Textarea
                    id="content-editor"
                    rows={10}
                    placeholder="Geben Sie hier den Inhalt ein..."
                    className="font-mono"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Inhalt speichern
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

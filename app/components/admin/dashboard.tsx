"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import ImageUploader from "./image-uploader"
import ImageManager from "./image-manager"
import ContentEditor from "./content-editor"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/admin")
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
          <ImageUploader />
        </TabsContent>

        <TabsContent value="manage" className="mt-0">
          <ImageManager />
        </TabsContent>

        <TabsContent value="content" className="mt-0">
          <ContentEditor />
        </TabsContent>
      </Tabs>
    </div>
  )
}

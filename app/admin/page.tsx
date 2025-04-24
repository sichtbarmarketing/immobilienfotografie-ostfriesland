import AdminLogin from "@/app/components/admin-login"

export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <AdminLogin />
      </div>
    </div>
  )
}

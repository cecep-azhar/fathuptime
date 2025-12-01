import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Pengaturan</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Profil</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nama</label>
                <p className="text-lg">{session.user.name || "Tidak ada nama"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg">{session.user.email}</p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">2FA (Two-Factor Authentication)</h2>
            <p className="text-muted-foreground mb-4">
              Fitur 2FA tersedia. Implementasi lengkap akan ditambahkan di versi mendatang.
            </p>
          </div>

          <div className="border rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Notification Channels</h2>
            <p className="text-muted-foreground mb-4">
              Kelola channel notifikasi untuk alert monitoring.
            </p>
            <p className="text-sm text-muted-foreground">
              Implementasi UI untuk manage notification channels akan ditambahkan.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

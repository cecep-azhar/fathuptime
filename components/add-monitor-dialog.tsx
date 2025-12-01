"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface AddMonitorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddMonitorDialog({ open, onOpenChange, onSuccess }: AddMonitorDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "http",
    url: "",
    keyword: "",
    port: "",
    interval: "60",
    timeout: "30",
  });

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/monitors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan monitor");
      }

      toast({
        title: "Monitor Berhasil Ditambahkan",
        description: "Monitor baru telah dibuat dan akan mulai dicek",
      });

      setFormData({
        name: "",
        type: "http",
        url: "",
        keyword: "",
        port: "",
        interval: "60",
        timeout: "30",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Tambah Monitor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Monitor</label>
            <Input
              placeholder="Website Saya"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipe</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="http">HTTP(s)</option>
              <option value="keyword">Keyword</option>
              <option value="ping">Ping</option>
              <option value="tcp">TCP Port</option>
              <option value="heartbeat">Heartbeat</option>
            </select>
          </div>

          {(formData.type === "http" || formData.type === "https" || formData.type === "keyword") && (
            <div className="space-y-2">
              <label className="text-sm font-medium">URL</label>
              <Input
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>
          )}

          {formData.type === "keyword" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Keyword</label>
              <Input
                placeholder="Welcome"
                value={formData.keyword}
                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                required
              />
            </div>
          )}

          {formData.type === "tcp" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Host</label>
                <Input
                  placeholder="example.com"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Port</label>
                <Input
                  type="number"
                  placeholder="80"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {formData.type === "ping" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Host</label>
              <Input
                placeholder="8.8.8.8 atau example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Interval (detik)</label>
              <Input
                type="number"
                value={formData.interval}
                onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                min="30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeout (detik)</label>
              <Input
                type="number"
                value={formData.timeout}
                onChange={(e) => setFormData({ ...formData, timeout: e.target.value })}
                min="5"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

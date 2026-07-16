"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/Button";
import { Save } from "lucide-react";

export default function AdminDashboard() {
  const [settings, setSettings] = useState({
    address: "",
    phone: "",
    workingHours: "",
    email: "", // keep in state to avoid API errors if it's sent, but won't render the input
    instagramUrl: "",
    whatsappUrl: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data) setSettings(data);
      } catch (e) {
        console.error("Error fetching settings", e);
      }
    };
    
    fetchSettings();
  }, [supabase]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        throw new Error(data.error || "Ошибка сервера");
      }
      
      alert("Настройки успешно сохранены!");
    } catch (e: any) {
      alert("Ошибка при сохранении настроек: " + e.message + "\n\nВозможно, вы еще не создали таблицу site_settings в Supabase!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Настройки контактов</h1>
      </div>

      {/* Settings Section */}
      <div className="bg-card border border-card-border p-6 rounded-3xl shadow-sm">
        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground/70">Адрес</label>
            <input 
              type="text" 
              value={settings.address} 
              onChange={e => setSettings({...settings, address: e.target.value})}
              className="px-4 py-3 bg-input border border-card-border rounded-xl focus:border-primary/50 focus:outline-none text-foreground transition-colors"
              placeholder="ЦУМ-1, 1 этаж"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground/70">Телефон</label>
            <input 
              type="text" 
              value={settings.phone} 
              onChange={e => setSettings({...settings, phone: e.target.value})}
              className="px-4 py-3 bg-input border border-card-border rounded-xl focus:border-primary/50 focus:outline-none text-foreground transition-colors"
              placeholder="+996 (500) 00-00-00"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground/70">Режим работы</label>
            <input 
              type="text" 
              value={settings.workingHours} 
              onChange={e => setSettings({...settings, workingHours: e.target.value})}
              className="px-4 py-3 bg-input border border-card-border rounded-xl focus:border-primary/50 focus:outline-none text-foreground transition-colors"
              placeholder="Ежедневно с 10:00 до 20:00"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground/70">Instagram Ссылка</label>
            <input 
              type="text" 
              value={settings.instagramUrl} 
              onChange={e => setSettings({...settings, instagramUrl: e.target.value})}
              className="px-4 py-3 bg-input border border-card-border rounded-xl focus:border-primary/50 focus:outline-none text-foreground transition-colors"
              placeholder="https://instagram.com/moba.kg"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-foreground/70">WhatsApp Ссылка</label>
            <input 
              type="text" 
              value={settings.whatsappUrl} 
              onChange={e => setSettings({...settings, whatsappUrl: e.target.value})}
              className="px-4 py-3 bg-input border border-card-border rounded-xl focus:border-primary/50 focus:outline-none text-foreground transition-colors"
              placeholder="https://wa.me/996500000000"
            />
          </div>
          <div className="md:col-span-2 flex justify-end mt-2">
            <Button type="submit" disabled={isSaving} className="gap-2 px-8 text-primary-foreground">
              <Save className="w-4 h-4" />
              {isSaving ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

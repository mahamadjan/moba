"use client";

import { useState, useEffect } from "react";
import { DollarSign, Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/Button";
import { Save } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    users: 0
  });

  const [settings, setSettings] = useState({
    address: "",
    phone: "",
    workingHours: "",
    email: "",
    instagramUrl: "",
    whatsappUrl: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    // In a real app, we would fetch these from the database
    // For this demo, we'll fetch actual counts if tables exist, or fallback to 0
    const fetchStats = async () => {
      try {
        const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
        
        setStats({
          products: productCount || 0,
          orders: 24, // Mock data
          revenue: 1450000, // Mock data
          users: 156 // Mock data
        });
      } catch (e) {
        console.error("Error fetching stats", e);
      }
    };
    
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data) setSettings(data);
      } catch (e) {
        console.error("Error fetching settings", e);
      }
    };
    
    fetchStats();
    fetchSettings();
  }, [supabase]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert("Настройки успешно сохранены!");
    } catch (e) {
      alert("Ошибка при сохранении настроек.");
    } finally {
      setIsSaving(false);
    }
  };

  const statCards = [
    { name: "Общая выручка", value: `${stats.revenue.toLocaleString()} сом`, icon: DollarSign, color: "text-green-400", bg: "bg-green-400/10" },
    { name: "Товаров в базе", value: stats.products, icon: Package, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Всего заказов", value: stats.orders, icon: ShoppingCart, color: "text-purple-400", bg: "bg-purple-400/10" },
    { name: "Пользователей", value: stats.users, icon: Users, color: "text-orange-400", bg: "bg-orange-400/10" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Обзор магазина</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-card border border-card-border p-6 rounded-3xl flex items-start gap-4 shadow-sm">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-foreground/50 text-sm font-medium mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Recent Orders Placeholder */}
        <div className="bg-card border border-card-border p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Последние заказы</h3>
            <button className="text-sm text-primary hover:underline">Смотреть все</button>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-card-border rounded-2xl">
            <ShoppingCart className="w-10 h-10 text-foreground/20 mb-3" />
            <p className="text-foreground/40">Здесь будут отображаться новые заказы</p>
          </div>
        </div>

        {/* Sales Chart Placeholder */}
        <div className="bg-card border border-card-border p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">График продаж</h3>
            <span className="text-sm px-3 py-1 bg-foreground/5 rounded-full text-foreground/60">За неделю</span>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-card-border rounded-2xl">
            <TrendingUp className="w-10 h-10 text-foreground/20 mb-3" />
            <p className="text-foreground/40">Статистика появится после первых заказов</p>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-card border border-card-border p-6 rounded-3xl shadow-sm mt-4">
        <h3 className="text-lg font-bold text-foreground mb-6">Настройки контактов (Подвал сайта)</h3>
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
            <label className="text-sm font-medium text-foreground/70">Email</label>
            <input 
              type="email" 
              value={settings.email} 
              onChange={e => setSettings({...settings, email: e.target.value})}
              className="px-4 py-3 bg-input border border-card-border rounded-xl focus:border-primary/50 focus:outline-none text-foreground transition-colors"
              placeholder="info@moba.kg"
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
          <div className="flex flex-col gap-2">
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
            <Button type="submit" disabled={isSaving} className="gap-2 px-8">
              <Save className="w-4 h-4" />
              {isSaving ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

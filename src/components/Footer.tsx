"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, Camera } from "lucide-react";

export function Footer() {
  const [settings, setSettings] = useState({
    address: "г. Бишкек, ул. Примерная 123",
    phone: "+996 (555) 123 456",
    workingHours: "Пн-Вс: 10:00 - 20:00",
    email: "info@moba.kg",
    instagramUrl: "https://instagram.com/moba.kg",
    whatsappUrl: "https://wa.me/996500000000"
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setSettings(data);
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="bg-card border-t border-card-border pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md">moba</span>
              <span className="text-foreground">.KG</span>
            </Link>
            <p className="text-foreground/60 mt-4 text-sm">
              Лучшие смартфоны, аксессуары и профессиональный ремонт техники в Кыргызстане.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-foreground font-semibold mb-6">Каталог</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/category/smartphones" className="text-foreground/60 hover:text-primary transition-colors text-sm">Смартфоны</Link></li>
              <li><Link href="/category/accessories" className="text-foreground/60 hover:text-primary transition-colors text-sm">Аксессуары</Link></li>
              <li><Link href="/repair" className="text-foreground/60 hover:text-primary transition-colors text-sm">Ремонт</Link></li>
              <li><Link href="/trade-in" className="text-foreground/60 hover:text-primary transition-colors text-sm">Trade-In</Link></li>
              <li><Link href="/promo" className="text-foreground/60 hover:text-primary transition-colors text-sm">Акции</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-foreground font-semibold mb-6">Контакты</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/60 text-sm">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`} className="text-foreground/60 hover:text-primary transition-colors text-sm">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/60">
                <span className="w-5 h-5 flex items-center justify-center text-primary shrink-0 font-bold">⏱</span>
                {settings.workingHours}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-foreground font-semibold mb-6">Мы в соцсетях</h3>
            <div className="flex items-center gap-4">
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                  <Camera className="w-5 h-5" />
                </a>
              )}
              {settings.whatsappUrl && (
                <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-card-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-foreground/40 text-sm">
            © {new Date().getFullYear()} moba.KG. Все права защищены.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-foreground/40 hover:text-primary transition-colors text-sm">
              Политика конфиденциальности
            </Link>
            <Link href="/sitemap" className="text-foreground/40 hover:text-primary transition-colors text-sm">
              Карта сайта
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

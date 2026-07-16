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
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 transition-all text-primary group">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {settings.whatsappUrl && (
                <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 transition-all text-primary group">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                    <path d="M12.01 2.002c-5.522 0-10 4.477-10 10 0 1.956.562 3.777 1.547 5.32l-1.547 5.682 5.811-1.524c1.48.88 3.197 1.393 5.022 1.393 5.523 0 10-4.477 10-10s-4.477-10-10-10zm5.405 14.394c-.23.645-1.328 1.233-1.83 1.32-.473.08-1.11.144-3.568-.87-2.96-1.218-4.832-4.24-4.98-4.437-.146-.197-1.189-1.583-1.189-3.02 0-1.436.75-2.146 1.018-2.427.266-.278.58-.348.775-.348.196 0 .393.003.559.01.176.01.411-.064.643.493.245.59 1.042 2.535 1.134 2.716.09.182.152.395.034.628-.116.23-.178.373-.348.567-.171.196-.364.425-.515.58-.168.175-.344.368-.145.71.198.343.882 1.46 1.895 2.36 1.306 1.157 2.404 1.517 2.748 1.673.344.156.545.132.748-.09.202-.224.872-1.025 1.107-1.376.236-.35.47-.291.785-.175.316.115 1.996.942 2.34 1.114.344.174.575.261.658.406.085.145.085.845-.145 1.49z"/>
                  </svg>
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

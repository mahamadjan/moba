"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Smartphone, Watch, Headphones, Laptop, Camera } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const CATEGORIES = [
  { name: "Смартфоны", icon: Smartphone, slug: "phones" },
  { name: "Аксессуары", icon: Headphones, slug: "accessories" },
  { name: "Ноутбуки", icon: Laptop, slug: "laptops" },
  { name: "Часы", icon: Watch, slug: "watches" },
  { name: "Планшеты", icon: Camera, slug: "tablets" },
];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').limit(8).order('created_at', { ascending: false });
      if (data) setProducts(data);
    };
    fetchProducts();
  }, [supabase]);

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative flex items-center pt-32 md:pt-40 pb-6 md:pb-10 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 via-background to-background z-0" />
        
        {/* Glowing orb */}
        <motion.div 
          animate={{ 
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary rounded-full blur-[100px] md:blur-[150px] pointer-events-none z-0"
        />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col items-center text-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-4 md:gap-6 max-w-4xl w-full relative z-10"
          >
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-foreground leading-[1.1] mb-2">
              Твой новый <br className="md:hidden" />
              <span className="animate-shine drop-shadow-[0_0_15px_rgba(255,212,0,0.6)] ml-2">
                смартфон.
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-foreground/70 max-w-2xl mx-auto mt-4 font-medium">
              Топовая техника, честные цены и официальная гарантия в moba.KG
            </p>
            

            <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full sm:w-auto">
              <Link href="/catalog">
                <Button size="lg" className="w-full sm:w-auto px-8 font-semibold rounded-full">
                  Смотреть каталог
                </Button>
              </Link>
              <Link href="/catalog?filter=discount">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto px-8 border border-foreground/10 rounded-full hover:bg-foreground/5">
                  Акции и скидки
                </Button>
              </Link>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* Marquee Promo Section (Real Products) */}
      {products.length > 0 && (
        <section className="-mt-16 md:-mt-24 w-full overflow-hidden bg-transparent py-6 md:py-8 relative flex">
          
          <div 
            className="flex whitespace-nowrap group hover:[animation-play-state:paused] will-change-transform"
            style={{
              width: 'max-content',
              animation: 'marqueeHero 30s linear infinite'
            }}
          >
            {[...products, ...products, ...products, ...products, ...products].map((p, i) => (
              <div 
                key={`promo-${i}`} 
                onClick={() => window.location.href = `/product/${p.id}`}
                className="relative w-[120px] h-[120px] md:w-[160px] md:h-[160px] mx-3 md:mx-4 rounded-3xl overflow-hidden group/item shrink-0 border-2 border-primary bg-transparent cursor-pointer hover:shadow-[0_0_25px_rgba(255,212,0,0.4)] transition-all flex items-center justify-center"
              >
                <img src={p.image_url} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" alt={p.name} />
              </div>
            ))}
          </div>
          

        </section>
      )}

      {/* Categories */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">Популярные категории</h2>
          <Link href="/catalog">
            <Button variant="ghost" className="hidden sm:flex gap-2 text-primary">
              Все категории <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, index) => (
            <Link key={cat.name} href={`/catalog?category=${cat.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-dark p-4 sm:p-6 rounded-[1.25rem] sm:rounded-2xl flex flex-col items-center justify-center gap-3 sm:gap-4 cursor-pointer hover:border-primary/50 transition-colors group h-full shadow-sm"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <cat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-foreground font-medium text-xs sm:text-base text-center">{cat.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">Хиты продаж</h2>
          <Button variant="ghost" className="hidden sm:flex gap-2 text-primary">
            Смотреть все <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.length > 0 ? products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={{
                id: product.id,
                name: product.name,
                price: product.price,
                oldPrice: product.old_price,
                imageUrl: product.image_url,
                isNew: product.is_new,
                isHit: product.is_hit
              }} />
            </motion.div>
          )) : (
            <div className="col-span-full py-12 text-center text-foreground/50">
              Загрузка товаров из базы данных... (или база пока пуста)
            </div>
          )}
        </div>
      </section>


    </div>
  );
}

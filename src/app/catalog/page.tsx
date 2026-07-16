"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Smartphone, Headphones, Laptop, Watch, Camera, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/Button";

const CATEGORIES = [
  { id: "all", name: "Все товары", icon: null },
  { id: "phones", name: "Смартфоны", icon: Smartphone },
  { id: "accessories", name: "Аксессуары", icon: Headphones },
  { id: "laptops", name: "Ноутбуки", icon: Laptop },
  { id: "watches", name: "Часы", icon: Watch },
  { id: "tablets", name: "Планшеты", icon: Camera },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("category") || "all";
  const filterQuery = searchParams.get("filter");
  const searchQueryParam = searchParams.get("search");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryQuery);

  const supabase = createClient();

  useEffect(() => {
    setActiveCategory(categoryQuery);
  }, [categoryQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*').order('created_at', { ascending: false });
        
        // Filter by category if not "all"
        if (activeCategory !== "all") {
          query = query.eq('category', activeCategory);
        }

        // Apply special filters
        if (filterQuery === "discount") {
          query = query.eq('is_discount', true);
        } else if (filterQuery === "hit") {
          query = query.eq('is_hit', true);
        } else if (filterQuery === "new") {
          query = query.eq('is_new', true);
        }
        
        // Apply search query
        if (searchQueryParam) {
          query = query.ilike('name', `%${searchQueryParam}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
      } catch (e) {
        console.error("Error fetching catalog:", e);
        setProducts([]); // clear products if error happens so it doesn't look like they belong to this category
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, filterQuery, searchQueryParam, supabase]);

  return (
    <div className="container mx-auto px-4 lg:px-8">
      
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4 bg-card p-6 rounded-3xl border border-card-border shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-primary/5 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2">
            {searchQueryParam 
              ? `Результаты поиска: "${searchQueryParam}"` 
              : (CATEGORIES.find(c => c.id === activeCategory)?.name || "Каталог товаров")}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-foreground/50 font-medium bg-foreground/5 px-3 py-1 rounded-full text-sm border border-foreground/5">
              Найдено: {products.length} {products.length === 1 ? 'товар' : 'товаров'}
            </span>
            
            {/* Show active filter badge if any */}
            {filterQuery && (
              <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-full text-sm border border-primary/20 flex items-center gap-2">
                {filterQuery === 'discount' && 'Акции и скидки'}
                {filterQuery === 'hit' && 'Хит продаж'}
                {filterQuery === 'new' && 'Новинки'}
                <button 
                  onClick={() => window.location.href = `/catalog?category=${activeCategory}`}
                  className="hover:text-foreground transition-colors ml-1"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 sticky top-28">
          <div className="bg-card border border-card-border rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-foreground mb-6 text-xl">Категории</h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-left text-base group ${
                      isActive 
                        ? "bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(255,212,0,0.1)]" 
                        : "bg-transparent border border-transparent hover:bg-foreground/5"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? "bg-primary/20 text-primary" : "bg-foreground/5 text-foreground/50 group-hover:bg-foreground/10 group-hover:text-foreground"
                    }`}>
                      {cat.icon && <cat.icon className="w-5 h-5" />}
                    </div>
                    <span className={`font-medium ${isActive ? "text-primary" : "text-foreground/70 group-hover:text-foreground"}`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content: Products Grid */}
        <div className="lg:col-span-9">
          {/* Mobile Categories (Horizontal Scroll) */}
          <div className="lg:hidden flex overflow-x-auto gap-3 pb-6 mb-2 custom-scrollbar -mx-4 px-4 snap-x">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap text-sm font-medium transition-all snap-start ${
                    isActive 
                      ? "bg-primary/20 border-2 border-primary text-primary shadow-[0_0_15px_rgba(255,212,0,0.2)]" 
                      : "bg-card border-2 border-card-border text-foreground/70"
                  }`}
                >
                  {cat.icon && <cat.icon className="w-4 h-4" />}
                  {cat.name}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-foreground/50">Загрузка товаров...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    oldPrice: product.old_price,
                    imageUrl: product.image_url?.split(',')[0] || '',
                    images: product.image_url ? product.image_url.split(',') : [],
                    isNew: product.is_new,
                    isHit: product.is_hit,
                    discount: (product.old_price && product.price < product.old_price) 
                      ? Math.round((1 - product.price / product.old_price) * 100) 
                      : undefined
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-card-border rounded-3xl bg-foreground/[0.02]">
              <Smartphone className="w-12 h-12 text-foreground/20 mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">В этой категории пока пусто</h3>
              <p className="text-foreground/50 mb-6 max-w-md">
                В этой категории еще нет добавленных товаров. Перейдите в админ-панель, чтобы добавить новые устройства.
              </p>
              <Button onClick={() => setActiveCategory("all")}>
                Смотреть все товары
              </Button>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-foreground/50">Загрузка каталога...</p>
        </div>
      }>
        <CatalogContent />
      </Suspense>
    </div>
  );
}

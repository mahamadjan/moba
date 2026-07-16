"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/Button";
import { ShoppingCart, Heart, ShieldCheck, Truck, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();
        
      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-foreground mb-4">Товар не найден</h1>
        <p className="text-foreground/50 mb-8">Возможно, он был удален или ссылка устарела.</p>
        <Button onClick={() => router.push("/catalog")}>Вернуться в каталог</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
    });
    // Optional: Redirect to cart page here if the user prefers that, 
    // but since they just asked to fix the product page, we'll just add it.
  };



  return (
    <div className="min-h-screen pt-24 pb-28 md:pt-28 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>

        {/* Main Product Container */}
        <div className="bg-card border border-card-border rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
          
          {/* TOP/LEFT: Photo Area */}
          <div className="w-full md:w-1/2 bg-foreground/5 relative flex items-center justify-center p-8 sm:p-12 min-h-[300px] md:min-h-[500px]">
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.is_discount && (
                <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded shadow-lg">
                  Акция
                </span>
              )}
              {product.is_hit && (
                <span className="bg-primary text-primary-foreground text-xs sm:text-sm font-bold px-3 py-1 rounded shadow-lg">
                  ХИТ ПРОДАЖ
                </span>
              )}
            </div>
            
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full max-h-[400px] object-contain drop-shadow-2xl"
            />
          </div>

          {/* BOTTOM/RIGHT: Details Area */}
          <div className="w-full md:w-1/2 flex flex-col p-6 sm:p-8 md:p-10">
            
            {/* Title & Info */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {product.stock_quantity > 0 ? (
                  <span className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    В наличии
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-bold border border-red-500/20">
                    <XCircle className="w-4 h-4" />
                    Нет в наличии
                  </span>
                )}
                {product.stock_quantity > 0 && product.stock_quantity < 5 && (
                  <span className="text-orange-600 dark:text-orange-400 text-sm font-bold flex items-center gap-1.5 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    Осталось мало
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="text-foreground/70 text-sm sm:text-base leading-relaxed whitespace-pre-wrap max-h-[150px] overflow-y-auto custom-scrollbar">
                {product.description || "Описание товара пока не добавлено."}
              </div>
            </div>

            {/* Price & Cart Actions (More Compact & Animated) */}
            <div className="bg-foreground/[0.03] rounded-2xl p-4 sm:p-5 mb-8 border border-foreground/5 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex flex-col">
                {product.old_price && (
                  <span className="text-foreground/40 text-sm line-through mb-1">
                    {product.old_price.toLocaleString()} с
                  </span>
                )}
                <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight flex items-baseline gap-1">
                  {product.price.toLocaleString()} <span className="text-xl text-primary">с</span>
                </span>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="group flex-1 sm:w-auto px-6 h-12 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-primary-foreground hover:scale-105 active:scale-95"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2 group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-300" />
                  В корзину
                </Button>
                <Button size="icon" variant="outline" className="w-12 h-12 border-foreground/10 shrink-0 hover:bg-foreground/5 transition-transform hover:scale-105 active:scale-95">
                  <Heart className="w-5 h-5 text-foreground/50" />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-foreground/5 rounded-xl border border-foreground/5">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Официальная гарантия</p>
                  <p className="text-xs text-foreground/50">1 год от производителя</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-foreground/5 rounded-xl border border-foreground/5">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Быстрая доставка</p>
                  <p className="text-xs text-foreground/50">По всему Кыргызстану</p>
                </div>
              </div>
            </div>



          </div>
        </div>
      </div>
    </div>
  );
}

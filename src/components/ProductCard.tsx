"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "./Button";
import { useCartStore } from "@/store/useCartStore";

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  rating?: number;
  reviewsCount?: number;
  isNew?: boolean;
  discount?: number;
  inStock?: boolean;
  isHit?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page since button is inside card/link area sometimes, but here it's separate.
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl?.split(',')[0] || '',
    });
  };

  return (
    <div className="group relative rounded-[2rem] p-[2px] overflow-hidden cursor-pointer h-full transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 bg-card border border-primary/10">
      
      {/* Neon Spinning Gradient Layer */}
      <div 
        className="absolute inset-[-100%] z-0 animate-[spin_3s_linear_infinite] opacity-30 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'conic-gradient(from 90deg at 50% 50%, transparent 0%, transparent 70%, var(--primary) 100%)' }}
      />

      {/* Inner Card */}
      <div className="relative z-10 flex flex-col justify-between bg-card rounded-[calc(2rem-2px)] p-4 sm:p-5 h-full overflow-hidden">
        {/* Background glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Top Badges (Absolute positioned over image) */}
      <div className="absolute top-3 left-3 right-3 flex justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-1.5">
          {product.discount && (
            <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-sm w-fit">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-sm w-fit">
              NEW
            </span>
          )}
          {product.isHit && (
            <span className="bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-sm w-fit">
              ХИТ
            </span>
          )}
        </div>
        
        {/* Favorite Button */}
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-background/40 backdrop-blur-sm text-foreground/50 hover:text-foreground hover:bg-background/80 transition-colors pointer-events-auto shadow-sm"
          aria-label="В избранное"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Image Container (Full bleed perfectly square) */}
      <Link href={`/product/${product.id}`} className="block relative w-full pt-[100%] bg-white/5 overflow-hidden rounded-2xl">
        {/* object-cover ensures the image fills the entire square strictly, cropping edges if needed, so all photos look like uniform squares */}
        <img
          src={product.imageUrl?.split(',')[0] || ''}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-grow mt-2 relative z-10">
        <h3 className="font-bold text-base sm:text-lg text-foreground mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs sm:text-sm text-foreground/40 line-through font-medium">
                {product.oldPrice.toLocaleString("ru-RU")} ⊆
              </span>
            )}
            <span className="text-lg sm:text-xl font-black text-foreground">
              {product.price.toLocaleString("ru-RU")} ⊆
            </span>
          </div>
          
          <Button 
            size="icon" 
            className="w-10 h-10 rounded-xl shadow-lg shadow-primary/20 shrink-0 hover:shadow-primary/40 transition-all active:scale-95"
            onClick={handleAddToCart}
            aria-label="Добавить в корзину"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}

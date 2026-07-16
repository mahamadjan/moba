"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "./Button";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

export function CartSidebar() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  // Hydration fix for zustand persist
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Lock body scroll when cart is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-card border-l border-card-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-card-border">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Корзина
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-4 relative">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center h-full text-center opacity-50 my-auto pt-20"
                  >
                    <ShoppingBag className="w-16 h-16 mb-4 text-foreground/20" />
                    <p className="text-foreground text-lg font-medium">Ваша корзина пуста</p>
                    <p className="text-foreground/50 text-sm mt-2 max-w-[250px]">
                      Самое время добавить в неё что-нибудь полезное!
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-6 border-foreground/10"
                      onClick={() => setIsOpen(false)}
                    >
                      Вернуться к покупкам
                    </Button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 50, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="flex gap-4 p-4 bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 hover:border-foreground/10 rounded-2xl relative group transition-colors shadow-lg"
                    >
                      {/* Delete Button */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg hover:bg-red-400 z-10"
                        aria-label="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      {/* Image */}
                      <div className="w-24 h-24 bg-background rounded-xl p-2 shrink-0 flex items-center justify-center border border-card-border relative overflow-hidden">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      
                      {/* Info */}
                      <div className="flex flex-col justify-between flex-1 py-0.5">
                        <h4 className="text-sm sm:text-base font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors pr-2">
                          {item.name}
                        </h4>
                        
                        <div className="flex items-end justify-between mt-3">
                          <span className="font-bold text-foreground text-lg">
                            {(item.price * item.quantity).toLocaleString()} с
                          </span>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-background rounded-lg p-1 border border-card-border shadow-inner">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-foreground/10 rounded-md transition-colors active:scale-95"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold text-foreground w-6 text-center select-none">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-foreground/10 rounded-md transition-colors active:scale-95"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer / Checkout */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="p-6 border-t border-card-border bg-card shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-20"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-foreground/60 font-medium text-lg">Итого:</span>
                    <span className="text-3xl font-bold text-foreground">
                      {getTotalPrice().toLocaleString()} <span className="text-primary text-xl">с</span>
                    </span>
                  </div>
                  <Button className="w-full py-5 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 group overflow-hidden relative">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Оформить заказ
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

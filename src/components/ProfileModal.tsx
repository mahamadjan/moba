"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Package, User, Settings, Shield } from "lucide-react";
import { Button } from "./Button";
import { createClient } from "@/utils/supabase/client";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSignOut: () => void;
}

export function ProfileModal({ isOpen, onClose, user, onSignOut }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || "");
      setPhone(user.user_metadata?.phone || "");
      setEmail(user.email || "");
      setNewPassword("");
      setIsEditing(false); // reset on open
    }
    
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [user, isOpen]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const updateData: any = { 
      data: { full_name: fullName, phone: phone } 
    };

    if (email && email !== user?.email) {
      updateData.email = email;
    }
    
    if (newPassword && newPassword.length >= 6) {
      updateData.password = newPassword;
    }

    const { error } = await supabase.auth.updateUser(updateData);
    
    setIsLoading(false);
    if (!error) {
      setIsEditing(false);
      setNewPassword(""); // clear password field
      if (email !== user?.email) {
        alert("Профиль обновлен! На вашу новую почту отправлено письмо для подтверждения.");
      } else {
        alert("Профиль успешно обновлен!");
      }
    } else {
      alert("Ошибка при сохранении: " + error.message);
    }
  };

  // Реальная защита: админку видит только конкретная почта
  const adminEmails = ['admin@moba.kg', 'moba.kg', 'superadmin@moba.kg', 'dastan.admin2026@gmail.com'];
  const isAdmin = user?.email && adminEmails.includes(user.email.toLowerCase());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-card-border rounded-3xl shadow-2xl relative pointer-events-auto custom-scrollbar"
            >
              {/* Header / Close Button */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-card-border bg-card/95 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-foreground">Личный кабинет</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Sidebar / Profile Info */}
                <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-foreground/5 border border-foreground/5 rounded-3xl p-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                      <User className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {fullName || "Пользователь"}
                    </h3>
                    <p className="text-sm text-foreground/50 mb-6 break-all">{user?.email}</p>
                    
                    {isAdmin && (
                      <Button 
                        className="w-full justify-start gap-3 mb-3 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary shadow-[0_0_15px_rgba(255,212,0,0.2)]"
                        onClick={() => {
                          onClose();
                          window.location.href = '/admin/products';
                        }}
                      >
                        <Shield className="w-4 h-4" />
                        Панель администратора
                      </Button>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-3 border-foreground/10 hover:bg-foreground/5 mb-3 text-foreground"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Settings className="w-4 h-4 text-foreground/50" />
                      Настройки
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => {
                        onClose();
                        onSignOut();
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти
                    </Button>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-8">
                  
                  {/* Settings Form */}
                  {isEditing && (
                    <div className="bg-foreground/5 border border-foreground/5 rounded-3xl p-6">
                      <h3 className="text-lg font-bold text-foreground mb-5">Редактировать профиль</h3>
                      <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm text-foreground/60 ml-1">Имя и фамилия</label>
                          <input 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Иван Иванов"
                            className="bg-input border border-card-border rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm text-foreground/60 ml-1">Телефон</label>
                          <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+996 (555) 00-00-00"
                            className="bg-input border border-card-border rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors"
                          />
                        </div>
                        
                        <div className="border-t border-card-border my-2"></div>
                        <h4 className="text-sm font-bold text-foreground/80">Смена почты и пароля</h4>
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm text-foreground/60 ml-1">Email адрес</label>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-input border border-card-border rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm text-foreground/60 ml-1">Новый пароль</label>
                          <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Оставьте пустым, если не меняете"
                            className="bg-input border border-card-border rounded-xl px-4 py-3 text-foreground focus:border-primary/50 outline-none transition-colors"
                          />
                        </div>

                        <div className="flex gap-3 mt-4">
                          <Button type="submit" disabled={isLoading} className="flex-1 text-primary-foreground">
                            {isLoading ? "Сохранение..." : "Сохранить"}
                          </Button>
                          <Button type="button" variant="outline" className="border-card-border text-foreground" onClick={() => setIsEditing(false)}>Отмена</Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Orders Section */}
                  <div className="bg-foreground/5 border border-foreground/5 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        Мои заказы
                      </h3>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-card-border rounded-2xl bg-foreground/[0.03]">
                      <Package className="w-10 h-10 text-foreground/20 mb-3" />
                      <h4 className="text-base font-medium text-foreground/70 mb-1">У вас пока нет заказов</h4>
                      <p className="text-xs text-foreground/40 max-w-xs mb-5">
                        Здесь будет отображаться история ваших покупок и статусы доставки.
                      </p>
                      <Button size="sm" onClick={onClose} className="text-primary-foreground">
                        Перейти к покупкам
                      </Button>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

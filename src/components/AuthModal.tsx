"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import { createClient } from "@/utils/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Авто-конвертация логина moba.kg в валидный email (gmail), так как Supabase может блокировать несуществующие домены (.kg)
    let loginEmail = email.trim().toLowerCase();
    if (loginEmail === "moba.kg" || loginEmail === "admin@moba.kg") {
      loginEmail = "dastan.admin2026@gmail.com";
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });
        if (error) throw error;
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email: loginEmail,
          password,
        });
        if (error) throw error;
        // Optional: show a message to check email for verification
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при авторизации");
    } finally {
      setIsLoading(false);
    }
  };

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

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-md bg-card border border-card-border rounded-3xl p-6 sm:p-8 shadow-2xl relative pointer-events-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {isLogin ? "С возвращением!" : "Создать аккаунт"}
                </h2>
                <p className="text-foreground/50 text-sm">
                  {isLogin
                    ? "Войдите, чтобы отслеживать заказы и сохранять товары в избранное."
                    : "Присоединяйтесь к нам, чтобы получать эксклюзивные скидки и бонусы."}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground/70 ml-1">Email или Логин</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com или moba.kg"
                      className="w-full bg-input border border-card-border rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-medium text-foreground/70">Пароль</label>
                    {isLogin && (
                      <a href="#" className="text-xs text-primary hover:underline">
                        Забыли пароль?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-input border border-card-border rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-2 font-semibold rounded-xl text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
                </Button>
              </form>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="h-px bg-foreground/10 flex-1" />
                <span className="text-xs text-foreground/40 uppercase font-medium tracking-wider">Или</span>
                <div className="h-px bg-foreground/10 flex-1" />
              </div>

              <Button
                type="button"
                variant="ghost"
                className="w-full mt-6 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground rounded-xl flex items-center justify-center gap-3"
                onClick={async () => {
                  try {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                      },
                    });
                    if (error) throw error;
                  } catch (err: any) {
                    setError(err.message || "Ошибка входа через Google");
                  }
                }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Продолжить с Google
              </Button>

              {/* Toggle Login/Register */}
              <div className="mt-6 text-center text-sm text-foreground/50">
                {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  {isLogin ? "Зарегистрироваться" : "Войти"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

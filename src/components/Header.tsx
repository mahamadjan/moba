"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User, Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { Logo } from "./Logo";
import { AuthModal } from "./AuthModal";
import { ProfileModal } from "./ProfileModal";
import { CartSidebar } from "./CartSidebar";
import { useCartStore } from "@/store/useCartStore";

const navLinks = [
  { name: "Каталог", href: "/catalog" },
  { name: "Смартфоны", href: "/category/smartphones" },
  { name: "Аксессуары", href: "/category/accessories" },
  { name: "Ремонт", href: "/repair" },
  { name: "Trade-In", href: "/trade-in" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  // Hydration safe cart state
  const [mounted, setMounted] = useState(false);
  const { getTotalItems, setIsOpen: setIsCartOpen } = useCartStore();

  useEffect(() => {
    setMounted(true);
    // Check initial session
    import("@/utils/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setIsAuthModalOpen(false); // Close modal on successful login
        }
      });

      return () => subscription.unsubscribe();
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled ? "glass py-2" : "bg-transparent py-3 md:py-5"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-10 h-10 md:w-12 md:h-12" width={45} height={45} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors glow-hover px-2 py-1 rounded"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Search Bar */}
            <form 
              onSubmit={handleSearch} 
              className={clsx(
                "flex items-center overflow-hidden transition-all duration-300",
                isSearchOpen ? "w-[200px] md:w-[250px] bg-foreground/5 border border-foreground/10 rounded-full px-3" : "w-10 bg-transparent border-transparent"
              )}
            >
              <button 
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-foreground hover:text-primary transition-colors shrink-0" 
                aria-label="Поиск"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              {isSearchOpen && (
                <input
                  type="text"
                  autoFocus
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  className="w-full bg-transparent border-none outline-none text-foreground text-sm placeholder:text-foreground/30 h-10"
                />
              )}
            </form>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Переключить тему"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <Moon className="w-5 h-5 md:w-6 md:h-6" />
              )}
            </button>

            {user ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl bg-foreground/5 text-foreground hover:bg-foreground/10 hover:text-primary transition-colors flex items-center justify-center relative group"
                aria-label="Профиль"
              >
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <User className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors"
                aria-label="Войти"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-foreground hover:text-primary transition-colors relative" 
              aria-label="Корзина"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {mounted && getTotalItems() > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-[10px] font-bold rounded-full flex items-center justify-center text-white">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full glass border-t border-foreground/10 lg:hidden overflow-hidden"
          >
            <nav className="flex flex-col container mx-auto px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="py-3 text-lg font-medium border-b border-foreground/5 hover:text-primary text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={() => setIsAuthModalOpen(false)} 
    />
    
    <ProfileModal 
      isOpen={isProfileModalOpen} 
      onClose={() => setIsProfileModalOpen(false)} 
      user={user}
      onSignOut={async () => {
        import("@/utils/supabase/client").then(async ({ createClient }) => {
          const supabase = createClient();
          await supabase.auth.signOut();
          setIsProfileModalOpen(false);
        });
      }}
    />
    
    <CartSidebar />
    </>
  );
}

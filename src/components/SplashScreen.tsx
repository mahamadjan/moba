"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Check if we've already shown the splash screen in this session
    const hasShownSplash = sessionStorage.getItem("splashShown");
    
    if (hasShownSplash) {
      setMounted(false);
      return;
    }
    
    // If not shown, show it and mark it as shown
    setShow(true);
    sessionStorage.setItem("splashShown", "true");

    // Start fading out at 4 seconds
    const timer = setTimeout(() => {
      setShow(false);
    }, 4000);

    // Completely unmount after fade-out finishes (4s + 0.5s fade)
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = "unset";
    }, 4500);

    document.body.style.overflow = "hidden";
    
    return () => {
      clearTimeout(timer);
      clearTimeout(unmountTimer);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className={`fixed inset-0 z-[999999] bg-[#0a0a0a] flex items-center justify-center transition-opacity duration-500 ease-in-out ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Optimized Circular container without heavy GPU shadow */}
      <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/30">
        <video 
          src="/logo-new.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover rounded-full mix-blend-screen"
          style={{ mixBlendMode: 'screen', transform: 'translateZ(0)' }}
        />
      </div>
    </div>
  );
}

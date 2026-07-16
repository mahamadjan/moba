import React from 'react';
import clsx from 'clsx';

export function Logo({ className, width = 60, height = 60 }: { className?: string, width?: number, height?: number }) {
  return (
    <div 
      className={clsx("flex flex-col items-center justify-center bg-primary rounded-full relative overflow-hidden shrink-0", className)} 
      style={{ width: `${width}px`, height: `${height}px` }}
    >
       <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] mt-[-5%]">
         {/* Phone outline */}
         <rect x="25" y="15" width="50" height="70" rx="6" fill="none" stroke="#111" strokeWidth="5" />
         <path d="M 40 15 L 60 15" stroke="#111" strokeWidth="5" />
         
         {/* Location Pin */}
         <path d="M50 35 C43 35 38 40 38 47 C38 56 50 65 50 65 C50 65 62 56 62 47 C62 40 57 35 50 35 Z" fill="#E60012" />
         <circle cx="50" cy="45" r="4" fill="#FFD400" />
         
         {/* Handshake abstraction */}
         <path d="M 20 70 Q 50 90 80 70" fill="none" stroke="#E60012" strokeWidth="8" strokeLinecap="round" />
         <path d="M 45 77 L 50 82 L 55 77" fill="none" stroke="#E60012" strokeWidth="3" />
       </svg>
       
       {/* Text block overlay */}
       <div className="absolute bottom-[4px] w-[85%] bg-black py-[2px] rounded flex items-center justify-center">
         <span className="text-white font-bold text-[8px] leading-none tracking-wider">moba.KG</span>
       </div>
    </div>
  );
}

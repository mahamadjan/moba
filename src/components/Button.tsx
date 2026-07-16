"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isAnimated?: boolean;
}

type MotionButtonProps = ButtonProps & HTMLMotionProps<"button">;

export const Button = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant = "primary", size = "md", isAnimated = true, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(255,212,0,0.5)] shadow-[0_0_15px_rgba(255,212,0,0.2)]",
      secondary: "bg-foreground/10 text-foreground border border-foreground/20 backdrop-blur-md hover:bg-foreground/20 shadow-lg shadow-foreground/5",
      outline: "border-2 border-primary/50 text-primary hover:bg-primary/10 backdrop-blur-sm",
      ghost: "hover:bg-foreground/10 text-foreground",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
      icon: "h-10 w-10",
    };

    const classes = clsx(baseStyles, variants[variant], sizes[size], className);

    if (isAnimated) {
      return (
        <motion.button
          ref={ref}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={classes}
          {...props}
        >
          {children}
        </motion.button>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

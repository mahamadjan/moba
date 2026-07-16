import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SplashScreen } from "@/components/SplashScreen";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "moba.KG — Лучшие смартфоны Кыргызстана",
  description: "Продажа телефонов, аксессуаров, ремонт техники и доставка по всему Кыргызстану.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className={`${inter.className} antialiased bg-background text-foreground min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SplashScreen />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

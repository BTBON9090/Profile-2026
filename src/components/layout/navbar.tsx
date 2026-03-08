// src/components/layout/navbar.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation"; 
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/language-switcher"; 

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 py-6 bg-black/50 backdrop-blur-md border-b border-white/5"
    >
      <Link 
        href="/" 
        className="font-mono text-sm tracking-widest font-bold text-zinc-300 hover:text-white transition-colors uppercase"
      >
        AIDEN
        <span className="text-blue-500">.</span>
        D
        <span className="hidden md:inline">ESIGN</span>
      </Link>

      <div className="flex items-center gap-8">
        <div className="flex gap-8 font-mono text-sm">
          <Link 
            href="/" 
            className={`relative group transition-colors ${pathname === '/' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            {t.nav.showcase}
            <span className={`absolute -bottom-1 left-0 h-px bg-blue-500 transition-all ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <Link 
            href="/work" 
            className={`relative group transition-colors ${pathname === '/work' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            {t.nav.gallery}
            <span className={`absolute -bottom-1 left-0 h-px bg-blue-500 transition-all ${pathname === '/work' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <Link 
            href="/about" 
            className={`relative group transition-colors ${pathname === '/about' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            {t.nav.profile}
            <span className={`absolute -bottom-1 left-0 h-px bg-blue-500 transition-all ${pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
        </div>
        
        <LanguageSwitcher />
      </div>
    </motion.nav>
  );
}

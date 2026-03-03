// src/components/layout/navbar.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-sm bg-black/0"
    >
      {/* 左侧 Logo / 名字 */}
      <div className="font-mono text-sm tracking-widest font-bold text-zinc-300">
        YOUR NAME<span className="text-blue-500">.</span>DESIGN
      </div>

      {/* 右侧导航 */}
      <div className="flex gap-8 font-mono text-sm">
        <Link href="/" className="text-white hover:text-blue-400 transition-colors relative group">
          WORK
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all group-hover:w-full"></span>
        </Link>
        <Link href="/about" className="text-zinc-500 hover:text-white transition-colors">
          ABOUT
        </Link>
      </div>
    </motion.nav>
  );
}

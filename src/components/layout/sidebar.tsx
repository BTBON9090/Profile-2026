// src/components/layout/sidebar.tsx
"use client";
import { motion } from "framer-motion";

export default function Sidebar() {
  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4 items-center"
    >
      {/* 这里未来会变成动态的，根据滚动高亮 */}
      <div className="w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
      <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
      <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
      <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
    </motion.div>
  );
}
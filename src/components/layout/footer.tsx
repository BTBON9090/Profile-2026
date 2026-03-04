// src/components/layout/footer.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Smartphone, MessageCircle, Mail, FileText, QrCode, Download, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <footer id="footer" className="bg-white/4 backdrop-blur-2xl py-20 border-t border-zinc-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
        
        {/* 顶部标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <p className="font-mono text-blue-500 mb-4 tracking-widest uppercase text-xs md:text-sm">
            Available for new opportunities
          </p>
          
          {/* 超大号邮箱 - 固定文本 */}
          <div className="relative inline-block">
            <span className="text-4xl md:text-7xl lg:text-8xl font-bold text-white hover:text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-white bg-[length:200%_auto] hover:animate-shimmer transition-all duration-300">
              Let&apos;s Talk.
            </span>
          </div>
        </motion.div>

        {/* 快速联系卡片区 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-10"
        >
          {/* 手机号卡片 */}
          <button 
            onClick={() => handleCopy("17611231055", "phone")}
            className="group relative w-full md:w-auto flex items-center justify-between gap-4 px-6 py-3 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900 rounded-full transition-all duration-300 font-mono text-sm text-zinc-300"
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-zinc-500" />
              <span>176 1123 1055</span>
            </div>
            {copiedField === "phone" ? <Check className="w-4 h-4 text-blue-500" /> : <Copy className="w-4 h-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />}
            {/* 极客风的复制提示气泡 */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap">
              {copiedField === "phone" ? (
                <><Check className="w-3 h-3 text-blue-500" /> Copied</>
              ) : (
                <><Copy className="w-3 h-3" /> Click to copy</>
              )}
            </div>
          </button>

          {/* 微信卡片 (带二维码悬停) */}
          <div className="relative group w-full md:w-auto">
            <div className="flex items-center justify-between gap-4 px-6 py-3 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900 rounded-full transition-all duration-300 font-mono text-sm text-zinc-300 cursor-default">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-zinc-500" />
                <span>WeChat: Aiden0032</span>
              </div>
              <QrCode className="w-4 h-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />
            </div>
            
            {/* 二维码悬停弹窗 */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 origin-bottom z-50">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-2xl flex flex-col items-center gap-3">
                <div className="w-44 h-48 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 overflow-hidden">
                  <img src="/images/wechat-qr.png" alt="WeChat QR" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-zinc-400 font-mono">Scan QR Code</span>
                {/* 向下的小箭头 */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900 border-b border-r border-zinc-800 rotate-45"></div>
              </div>
            </div>
          </div>

          {/* 邮箱卡片 */}
          <button 
            onClick={() => handleCopy("nc0032@qq.com", "email")}
            className="group relative w-full md:w-auto flex items-center justify-between gap-4 px-6 py-3 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900 rounded-full transition-all duration-300 font-mono text-sm text-zinc-300"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-zinc-500" />
              <span>nc0032@qq.com</span>
            </div>
            {copiedField === "email" ? <Check className="w-4 h-4 text-blue-500" /> : <Copy className="w-4 h-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />}
            {/* 极客风的复制提示气泡 */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap">
              {copiedField === "email" ? (
                <><Check className="w-3 h-3 text-blue-500" /> Copied</>
              ) : (
                <><Copy className="w-3 h-3" /> Click to copy</>
              )}
            </div>
          </button>
        </motion.div>

        {/* 简历下载按钮 */}
          <a 
            href="/resume.pdf" 
            download="倪城_Resume.pdf"
            className=" mb-20  md:w-auto flex items-center justify-center gap-3 px-6 py-3  text-white hover:text-blue-500 border border-transparent rounded-full transition-all duration-300 font-mono text-sm font-semibold"
          >
            🍀
            <span>记得下载简历和作品集呦！</span>
            <Download className="w-4 h-4" />
          </a>

        {/* 底部版权与社交链接 */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-900 text-zinc-600 font-mono text-xs md:text-sm">
          <p>© {new Date().getFullYear()} 倪城 (Ni Cheng). All rights reserved.</p>
          
          <div className="flex gap-6 mt-4 md:mt-0">
            <a 
              href="https://www.xiaohongshu.com/user/profile/6252abd90000000010006abc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-2 group"
            >
              <img src="/小红书.png" alt="小红书" className="w-7 h-7" />
              <span>小红书</span>
              <ArrowUpRight className="w-4 h-4 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

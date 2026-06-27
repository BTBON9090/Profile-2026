// src/components/layout/footer.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Smartphone, MessageCircle, Mail, FileText, Download, ArrowUpRight, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const currentYear = new Date().getFullYear();

  const contacts = [
    {
      icon: Smartphone,
      label: "Phone",
      value: "176 1123 1055",
      copyText: "17611231055",
      field: "phone",
    },
    {
      icon: MessageCircle,
      label: "WeChat",
      value: "Aiden0032",
      copyText: "Aiden0032",
      field: "wechat",
      hasQR: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: "nc0032@qq.com",
      copyText: "nc0032@qq.com",
      field: "email",
    },
  ];

  return (
    <footer id="footer" className="relative z-10 bg-black overflow-hidden border-t border-zinc-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] opacity-20"></div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-32 relative z-10">
        {/* 章节标题 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12 md:mb-16"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-blue-500 tracking-widest">06</span>
            <span className="h-px w-12 bg-zinc-800"></span>
            <span className="font-mono text-xs text-zinc-500 tracking-[0.2em] uppercase">LET'S TALK</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-700 tracking-widest hidden md:block">CONTACT</span>
        </motion.div>

        {/* 主标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-100 tracking-tight leading-[0.9] mb-6">
            LET'S TALK<span className="text-blue-500">.</span>
          </h2>
          <p className="text-sm md:text-base text-zinc-500 max-w-xl mx-auto">
            如果你有好的机会，或者想聊聊设计与 AI 的故事，随时联系我。
          </p>
        </motion.div>

        {/* 联系方式 - 等宽等间距 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-16 max-w-3xl mx-auto"
        >
          {contacts.map((contact, idx) => (
            <button
              key={idx}
              onClick={() => handleCopy(contact.copyText, contact.field)}
              className="group relative inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-zinc-800/80 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-300 w-full"
            >
              <contact.icon className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
              <span className="text-sm font-mono text-zinc-300 group-hover:text-white transition-colors">{contact.value}</span>
              {copiedField === contact.field ? (
                <Check className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-600 group-hover:text-blue-400 transition-colors" />
              )}

              {/* 微信二维码 */}
              {contact.hasQR && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 origin-bottom z-50">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-2xl flex flex-col items-center gap-3">
                    <div className="w-44 h-48 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 overflow-hidden">
                      <img src="https://cdn.btbon.cn/images/wechat-qr.png" alt="WeChat QR" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">{t.footer.scanQr}</span>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900 border-b border-r border-zinc-800 rotate-45"></div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </motion.div>

        {/* 下载简历 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center mb-18"
        >
          <a
            href="https://cdn.btbon.cn/UI设计-倪城-2026.pdf"
            download="UI设计-倪城-2026.pdf"
            className="group inline-flex items-center gap-3 px-6 py-3.5 bg-zinc-100 text-black rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 font-mono text-sm font-bold uppercase tracking-wider"
          >
            <FileText className="w-4 h-4" />
            {t.footer.downloadReminder}
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* 底部版权 */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-900 text-zinc-600 font-mono text-xs md:text-sm">
          <p>{t.footer.copyright.replace('{year}', currentYear.toString())}</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-zinc-700" />
              <span>Designed with Vibe Coding</span>
            </div>
            <a
              href="https://xhslink.com/m/78jWEdnemBP"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <img src="/小红书.png" alt="小红书" className="w-4 h-4" />
              <span className="text-xs">小红书</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

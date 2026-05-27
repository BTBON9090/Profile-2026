// src/components/sections/snow-ecosystem.tsx
"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Play, Pause, Eye } from "lucide-react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import UniversalModal from "@/components/ui/UniversalModal";
import snownewtabData from "@/data/work/snownewtab";

export default function SnowEcosystem() {
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <section id="snow-ecosystem" className="bg-transparent py-40 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-blue-400 font-mono text-sm tracking-wider uppercase">
                {t.snowEcosystem.badge}
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-zinc-300 mb-6">
              {t.snowEcosystem.title}{" "}
              <span className="text-zinc-600">{t.snowEcosystem.titleSuffix}</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl text-lg font-light">
              {t.snowEcosystem.description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="backdrop-blur-sm group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 border border-zinc-700 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-white/60" />
                <span className="text-xl font-mono font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">
                  查看项目
                </span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <a
                href="https://www.snowtech.com.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="backdrop-blur-sm group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 border border-zinc-700 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-white/60" />
                <span className="text-xl font-mono font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">
                  {t.snowEcosystem.visitWebsite}
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Browser Mockup Frame */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative max-w-7xl mx-auto"
          >
            {/* Ambient Glow */}
            <div className="absolute -inset-x-20 -inset-y-10 bg-gradient-to-b from-blue-600/20 via-transparent to-transparent blur-[120px] pointer-events-none" />

            {/* Chrome Frame */}
            <div className="relative rounded-lg md:rounded-xl overflow-hidden border border-zinc-700/30 bg-black">
              
              {/* Video */}
              <div className="relative w-full aspect-[11/6] bg-zinc-950">
                <video
                  ref={videoRef}
                  src="https://cdn.btbon.cn/home/newt.mov"
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Play Button Overlay */}
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {isPlaying ? (
                      <Pause className="w-7 h-7 text-white" />
                    ) : (
                      <Play className="w-7 h-7 text-white ml-1" />
                    )}
                  </div>
                </button>
              </div>
            </div>

          </motion.div>

        </div>
      </section>

      {/* Project Modal */}
      {showModal && (
        <UniversalModal
          isOpen={true}
          onClose={() => setShowModal(false)}
          title="雪诺企业安全浏览器"
          images={snownewtabData.behanceSlices}
          hasPrev={false}
          hasNext={false}
          onPrev={() => {}}
          onNext={() => {}}
          projectId="snownewtab"
          isCompanyProject={true}
        />
      )}
    </>
  );
}

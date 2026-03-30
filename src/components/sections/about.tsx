// src/components/sections/about.tsx
"use client";
import { motion } from "framer-motion";
import { Download, Terminal, Layers, ArrowUpRight, GitCommit, FileText } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function About() {
  const { t } = useI18n();
  
  return (
    <section id="about" className="py-32 bg-transparent relative border-t border-zinc-900">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem][mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
          
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="sticky top-32"
            >
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
                {t.about.title} <br />
                <span className="text-zinc-600">{t.about.titleSuffix}</span>
              </h2>
              <div className="w-12 h-1 bg-blue-500 mb-8"></div>
              <div className="text-zinc-400 text-lg leading-relaxed mb-8 space-y-4">
                {t.about.description.split('\n\n').map((paragraph, index) => {
                  const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                  return (
                    <p key={index}>
                      {parts.map((part, partIndex) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={partIndex} className="text-blue-400 font-semibold">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      })}
                    </p>
                  );
                })}
              </div>
              
              <a 
                href="/resume.pdf"
                download="倪城_Resume.pdf"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
              >
                <FileText className="w-4 h-4 group-hover:text-blue-600" />
                <span className="text-xl font-mono font-bold uppercase group-hover:text-blue-600">{t.about.downloadResume}</span>
                <Download className="w-4 h-4 group-hover:translate-y-0.5 group-hover:text-blue-600 transition-transform" />
              </a>
            </motion.div>
          </div>

          <div className="md:col-span-7 space-y-16 mt-12 md:mt-0">
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="border-l-2 border-zinc-800 pl-6">
                <div className="flex items-center gap-2 text-white mb-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-bold">{t.about.capabilities.systemArchitect.title}</h3>
                </div>
                <p className="text-zinc-400">{t.about.capabilities.systemArchitect.description}</p>
              </div>

              <div className="border-l-2 border-zinc-800 pl-6">
                <div className="flex items-center gap-2 text-white mb-2">
                  <Terminal className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-bold">{t.about.capabilities.aiEngineer.title}</h3>
                </div>
                <p className="text-zinc-400">{t.about.capabilities.aiEngineer.description}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white/4 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-8"
            >
              <h3 className="text-sm font-mono text-zinc-500 mb-6 uppercase tracking-widest">{t.about.techStack}</h3>
              
              <div className="space-y-8">
                {Object.values(t.about.techStackData).map((group: any, idx: number) => (
                  <div key={idx}>
                    <div className="text-white font-medium mb-3">{group.category}</div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item: string, i: number) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 bg-black border border-zinc-800 rounded-full text-xs font-mono text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 font-mono">
                  <span className="text-blue-500">{"$"}</span> {t.about.experience.title}
                </h3>
                <p className="text-zinc-400 font-mono text-sm">{t.about.experience.subtitle}</p>
              </div>

              <div className="relative ml-3 space-y-16 pb-10">
                <div className="absolute top-2 bottom-0 left-[-2px] w-px bg-gradient-to-b from-zinc-800 via-zinc-800 to-transparent"></div>

                {t.about.experience.items.map((exp: any, index: number) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative pl-8 md:pl-12 group"
                  >
                    {/* Git Commit 节点图标 (Hover 时点亮为蓝色) */}
                    <div className="absolute -left-[17px] top-1 bg-black p-1">
                      <GitCommit className="w-6 h-6 text-zinc-600 group-hover:text-blue-500 transition-colors duration-300" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm overflow-hidden">
                          {exp.logo ? (
                            <img src={exp.logo} alt={exp.company} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-zinc-500">🏢</span>
                          )}
                        </span>
                        {exp.company}
                      </h3>
                      <div className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
                        {exp.time}
                      </div>
                    </div>
                    
                    <div className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-3xl">
                      {Array.isArray(exp.description) ? (
                        <ol className="list-decimal list-inside space-y-1.5 pl-2">
                          {exp.description.map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ol>
                      ) : (
                        <p>{exp.description}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((t: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-xs font-mono text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors cursor-default ">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}

              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

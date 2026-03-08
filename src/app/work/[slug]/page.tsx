// src/app/work/[slug]/page.tsx
"use client";
import { use, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, Type, Palette, ShieldCheck, Zap, 
  User, Crosshair, Scale, AlertTriangle, Search, Braces, 
  Route, XCircle, MessageSquareQuote, LayoutGrid, Check, X 
} from "lucide-react";

// ==========================================
// 1. 全维数据库 (注入了 10 种结构体所需的数据)
// ==========================================
const caseStudies = {
  "snow-ecosystem": {
    // 结构 1 & 2: 基础信息
    title: "SnowTech Ecosystem",
    subtitle: "Enterprise Zero-Trust Security Workspace",
    role: "Lead Product Designer",
    timeline: "2024 - 2026",
    platform: "Web / Desktop Chrome",
    heroImage: "/images/snow-admin.png", // 替换为真实大图
    
    // 结构 3: 核心洞察引语
    quote: "“B 端设计的最高境界，是让复杂的业务逻辑在极简的界面中隐形。”",
    
    // 结构 4: 单列沉浸阅读
    overview: "雪诺科技的零信任生态是替代传统 VDI 的新一代架构。作为唯一体验负责人，我主导了从底层逻辑重构到高保真界面落地的全过程。",
    challenge: "B端安全后台通常伴随着反人类的长表单和复杂的层级嵌套。PM 提供的初始原型试图将所有配置项平铺，这会导致新手管理员极高的认知负荷和出错率。",
    
    // [新增 11] Persona 角色画像
    personas:[
      { role: "IT 管理员", pain: "部署 VPN 极其繁琐，员工经常报障，排错成本极高。" },
      { role: "普通员工", pain: "每天需要输入十几次密码，远程办公时访问内网奇慢无比。" }
    ],

    // [新增 17] User Journey 旅程
    journey:[
      { step: "Discovery", desc: "管理员在控制台一键创建企业应用策略。" },
      { step: "Distribution", desc: "策略通过云端毫秒级下发至全员浏览器。" },
      { step: "Access", desc: "员工免密单点登录，直接安全访问内网 SaaS。" }
    ],

    // 结构 5: 左字右图粘性叙事 (分解复杂流程)
    stickySteps:[
      { title: "分步渐进式架构", desc: "将原本包含上百个字段的长表单，拆解为基础配置、策略绑定、发布上线三个逻辑闭环，极大降低填写阻力。" },
      { title: "Draft vs Publish 机制", desc: "引入发布状态机，解耦前端表单状态与后端真实数据，管理员可中途保存草稿，消除了表单丢失的焦虑。" },
      { title: "实时脱敏预览", desc: "不再让用户盲猜脱敏规则，右侧提供所见即所得的正则匹配高亮预览区域。" }
    ],

    // 结构 6: 滑块对比
    beforeImage: "/images/snow-wireframe.png", 
    afterImage: "/images/snow-admin.png",      
    
    // 结构 7: Mac Window 微交互展示
    interactionMockup: "/images/snow-browser.png", // 放一张浏览器 AI 侧边栏的图
    interactionDesc: "AI 侧边栏上下文感知交互，支持拖拽网页内容直接生成摘要。",

    // [新增 12] UI Anatomy 界面解剖
    anatomyImage: "/images/snow-admin.png",
    anatomySpots:[
      { x: "20%", y: "30%", title: "全局工作台", desc: "将最高频的数据看板前置" },
      { x: "80%", y: "15%", title: "状态发布开关", desc: "解决前后端草稿逻辑冲突的核心机制" }
    ],

    // [新增 13] Trade-offs 设计权衡
    tradeoffs: {
      rejected: { title: "Plan A: 弹窗流", desc: "通过无限弹窗配置规则。缺点：遮挡底层视野，极易迷失层级。" },
      adopted: { title: "Plan B: 抽屉与分步表单", desc: "右侧抽屉滑出，保留父级上下文，空间利用率提升 40%。" }
    },

    //[新增 14] Edge Cases 边界态
    edgeCases:[
      { state: "空状态 (Empty)", desc: "新注册企业无应用时，提供清晰的 Onboarding 引导动画。" },
      { state: "极限值 (Limits)", desc: "当应用名称超过 50 字符，自动折叠并提供 Tooltip。" }
    ],

    // [新增 15] Micro-details 像素深潜
    microZoom: { image: "/images/snow-admin.png", desc: "复杂的权限穿梭框 Hover 态与拖拽阴影的像素级打磨。" },

    // [新增 16] Design to Code 工程协同
    codeBridge: {
      ui: "/images/snow-admin.png",
      code: `{\n  "component": "SnowButton",\n  "variant": "primary",\n  "state": "disabled",\n  "tokens": {\n    "bg": "var(--snow-blue-500)",\n    "opacity": 0.4\n  }\n}`
    },

    // [新增 18] Graveyard 废弃方案
    graveyard: { image: "/images/snow-wireframe.png", reason: "早期试图模仿传统的防火墙配置界面，被业务线否决，因为我们的受众是普通 IT 而非顶级极客。" },

    // [新增 19] Testimonials 业务原声
    testimonials:[
      { text: "“这套全新的后台让我们的客户交付时间从 2 周缩短到了 3 天。”", author: "VP of Product" },
      { text: "“非常严谨的组件规范，前端研发成本肉眼可见地降低了。”", author: "Frontend Lead" }
    ],

    // 结构 8: 设计系统资产
    designSystem: {
      colors:["#2563EB", "#7C3AED", "#10B981", "#EF4444", "#F59E0B"],
      typography: { heading: "Inter / JetBrains Mono", body: "14px Regular / 1.5 Leading" }
    },

    // 结构 9: 收益看板
    impacts:[
      { value: "90%", label: "部署成本降低" },
      { value: "40%", label: "配置效率提升" },
      { value: "0 to 1", label: "设计规范基建" }
    ],

    // 结构 10: 全景大图与下一篇
    fullWidthImage: "/images/snow-admin.png",
    masonryImages:["/images/snow-admin.png", "/images/snow-browser.png", "/images/plugin-ui.png", "/images/ai-translate.png"],
    nextProject: { slug: "all-in-one", name: "AllinOne Figma Plugin" }
  }
};

// ==========================================
// 结构体组件: 滑块对比 (Structure 6)
// ==========================================
const ImageCompareSlider = ({ before, after }: { before: string, after: string }) => {
  const [sliderPos, setSliderPos] = useState(50);
  return (
    <div className="relative w-full h-[400px] md:h-[700px] rounded-2xl overflow-hidden cursor-ew-resize bg-zinc-900 border border-zinc-800 my-16 select-none group">
      <Image src={after} alt="After" fill className="object-cover object-top" />
      <div className="absolute inset-0 w-full h-full" style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}>
        <Image src={before} alt="Before" fill className="object-cover object-top opacity-50 grayscale blur-[1px]" />
      </div>
      <div className="absolute top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]" style={{ left: `calc(${sliderPos}% - 2px)` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-black border-2 border-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <ArrowLeft className="w-3 h-3 text-white" />
          <ArrowRight className="w-3 h-3 text-white" />
        </div>
      </div>
      <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
      <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-mono text-zinc-400 border border-zinc-800">Wireframe (Before)</div>
      <div className="absolute top-6 right-6 bg-blue-600/90 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-mono text-white shadow-lg">High Fidelity (After)</div>
    </div>
  );
};

// ==========================================
// 主页面入口
// ==========================================
export default function UniversalCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); // Next.js 15 解包
  const data = caseStudies[slug as keyof typeof caseStudies];

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 250]); 
  const opacity1 = useTransform(scrollY, [0, 600],[1, 0]);

  if (!data) return <div className="min-h-screen bg-black flex justify-center items-center text-white font-mono">Project Configuration Missing</div>;

  return (
    <div className="bg-[#050505] min-h-screen selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* 顶部返回键 */}
      <Link href="/work" className="fixed top-8 left-8 z-50 w-12 h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all group shadow-2xl">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* [结构 1] Cinematic Hero 巨幕 */}
      <div className="relative w-full h-[85vh] overflow-hidden bg-black border-b border-zinc-900">
        <motion.div style={{ y: y1, opacity: opacity1 }} className="absolute inset-0 w-full h-full">
          <Image src={data.heroImage} alt={data.title} fill className="object-cover object-top opacity-70" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        </motion.div>
        <div className="absolute bottom-0 w-full">
          <div className="max-w-6xl mx-auto px-6 md:px-12 pb-20">
            <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tight mb-4">{data.title}</h1>
            <p className="text-xl md:text-3xl text-blue-400 font-light tracking-wide">{data.subtitle}</p>
          </div>
        </div>
      </div>

      {/* [结构 2] Metadata Grid 元信息矩阵 */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 border-b border-zinc-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {Object.entries({ Role: data.role, Timeline: data.timeline, Platform: data.platform, Output: "UX / UI / Strategy" }).map(([key, val]) => (
            <div key={key}>
              <div className="text-xs font-mono text-zinc-600 mb-2 uppercase tracking-widest">{key}</div>
              <div className="text-sm text-zinc-300">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* [结构 3] The Insight Quote 核心洞察 */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-32 text-center">
        <ShieldCheck className="w-12 h-12 text-blue-500/50 mx-auto mb-8" />
        <h2 className="text-3xl md:text-4xl text-white font-medium leading-relaxed italic tracking-wide">
          {data.quote}
        </h2>
      </div>

      {/* [结构 11] Persona 角色画像 (新增) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-32">
        <div className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-12 text-center">User Personas</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.personas.map((p: any, i: number) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl flex gap-6">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0"><User className="w-8 h-8 text-zinc-500" /></div>
              <div><h3 className="text-xl text-white font-bold mb-2">{p.role}</h3><p className="text-zinc-400 text-sm leading-relaxed">{p.pain}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* [结构 17] User Journey 旅程穿梭 (新增) */}
      <div className="w-full bg-zinc-950 border-y border-zinc-900 py-24 mb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-12">Core Workflow</div>
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {data.journey.map((j: any, i: number) => (
              <div key={i} className="flex-1 bg-black border border-zinc-800 p-8 rounded-2xl relative group hover:border-blue-500 transition-colors">
                <div className="text-blue-500/20 text-6xl font-bold font-mono absolute top-4 right-4 group-hover:text-blue-500/40 transition-colors">0{i+1}</div>
                <h3 className="text-xl font-bold text-white mb-4 relative z-10">{j.step}</h3>
                <p className="text-zinc-400 text-sm relative z-10">{j.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*[结构 4] Editorial Reading 单列阅读 */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 pb-32 text-lg text-zinc-400 leading-relaxed font-light space-y-16">
        <section>
          <div className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-4">01 // Context</div>
          <p className="text-white text-xl">{data.overview}</p>
        </section>
        <section>
          <div className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-4">02 // The Challenge</div>
          <div className="p-8 border-l-2 border-red-500/50 bg-red-500/5 rounded-r-3xl text-zinc-300">
            {data.challenge}
          </div>
        </section>
      </div>

      {/* [结构 5] Sticky Scroll 粘性叙事 */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-zinc-900">
        <div className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-16 text-center">03 // Logic Refactoring</div>
        <div className="flex flex-col md:flex-row gap-16 relative">
          <div className="md:w-1/2 space-y-[40vh] pb-[40vh]">
            {data.stickySteps.map((step, i) => (
              <div key={i} className="min-h-[30vh] flex flex-col justify-center">
                <div className="text-5xl font-mono font-bold text-zinc-800 mb-6">0{i+1}</div>
                <h3 className="text-3xl font-bold text-white mb-6">{step.title}</h3>
                <p className="text-xl text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="md:w-1/2 hidden md:block relative">
            <div className="sticky top-32 w-full h-[600px] bg-zinc-900 border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden flex items-center justify-center">
               <Image src={data.heroImage} alt="Sticky View" fill className="object-cover opacity-80" />
               <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
               <div className="relative z-10 px-8 py-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 text-white font-mono text-sm">
                 // Scroll to see state transitions
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* [结构 12] UI Anatomy 界面解剖雷达 (新增) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-32">
        <div className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-12 text-center">Interface Anatomy</div>
        <div className="relative w-full h-[60vh] rounded-[2rem] border border-zinc-800 overflow-hidden bg-zinc-900">
           <Image src={data.anatomyImage} alt="Anatomy" fill className="object-cover object-top opacity-50" />
           {data.anatomySpots.map((spot: any, i: number) => (
             <div key={i} className="absolute group cursor-pointer" style={{ top: spot.y, left: spot.x }}>
               <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(59,130,246,0.8)]"><Crosshair className="w-3 h-3 text-white" /></div>
               <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
               {/* Tooltip */}
               <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 bg-black/90 backdrop-blur-md border border-zinc-700 p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                 <div className="text-white font-bold text-sm mb-1">{spot.title}</div><div className="text-zinc-400 text-xs">{spot.desc}</div>
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* [结构 13] Trade-offs 方案权衡 (新增) */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-32">
        <div className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-12 text-center">Design Trade-offs</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="border border-red-500/20 bg-red-500/5 rounded-3xl p-10 relative overflow-hidden">
             <XCircle className="w-12 h-12 text-red-500/20 absolute top-8 right-8" />
             <div className="text-red-400 font-bold mb-4 flex items-center gap-2"><X className="w-5 h-5"/> {data.tradeoffs.rejected.title}</div>
             <p className="text-zinc-400 text-sm leading-relaxed">{data.tradeoffs.rejected.desc}</p>
           </div>
           <div className="border border-green-500/20 bg-green-500/5 rounded-3xl p-10 relative overflow-hidden">
             <Check className="w-12 h-12 text-green-500/20 absolute top-8 right-8" />
             <div className="text-green-400 font-bold mb-4 flex items-center gap-2"><Check className="w-5 h-5"/> {data.tradeoffs.adopted.title}</div>
             <p className="text-zinc-400 text-sm leading-relaxed">{data.tradeoffs.adopted.desc}</p>
           </div>
        </div>
      </div>

      {/* [结构 14] Edge Cases 异常态展厅 (新增) */}
      <div className="w-full bg-zinc-950 py-24 mb-32 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-4 mb-12"><AlertTriangle className="w-6 h-6 text-yellow-500" /><h2 className="text-2xl font-bold text-white">Edge Cases & Empty States</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {data.edgeCases.map((ec: any, i: number) => (
               <div key={i} className="border-l-2 border-zinc-700 pl-6"><div className="text-white font-mono mb-2">{ec.state}</div><p className="text-zinc-400 text-sm">{ec.desc}</p></div>
             ))}
          </div>
        </div>
      </div>

      {/* [结构 6] Slider 破局对比 */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-32 border-t border-zinc-900">
        <div className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-12 text-center">04 // Visual Execution</div>
        <ImageCompareSlider before={data.beforeImage} after={data.afterImage} />
      </div>

{/* [结构 15] Micro-details Zoom 像素级微观深潜 (新增) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-32 flex flex-col md:flex-row gap-16 items-center">
        <div className="md:w-1/2">
          <div className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-6">Pixel Perfection</div>
          <h2 className="text-3xl font-bold text-white mb-6">Micro-Interactions</h2>
          <p className="text-zinc-400 leading-relaxed">{data.microZoom.desc}</p>
        </div>
        <div className="md:w-1/2 relative h-[400px] w-full rounded-full border border-zinc-800 bg-zinc-900 overflow-hidden flex items-center justify-center shadow-2xl">
           {/* 用 scale-150 模拟放大镜效果 */}
           <Image src={data.microZoom.image} alt="Zoom" width={800} height={800} className="object-cover scale-150 origin-center opacity-80" />
           <div className="absolute inset-0 border-[20px] border-[#050505] rounded-full pointer-events-none"></div>
        </div>
      </div>

      {/* [结构 16] Design to Code 工程协同桥梁 (新增) */}
      <div className="w-full bg-black py-32 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
           <div className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-12 text-center">Design Engineering</div>
           <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden border border-zinc-800">
              <div className="lg:w-1/2 h-[400px] relative bg-zinc-900"><Image src={data.codeBridge.ui} alt="UI Component" fill className="object-cover opacity-80" /></div>
              <div className="lg:w-1/2 bg-[#0D0D0D] p-8 md:p-12 flex flex-col justify-center">
                 <div className="flex items-center gap-2 mb-6 text-zinc-600 font-mono text-xs"><Braces className="w-4 h-4"/> Design Tokens & JSON Payload</div>
                 <pre className="text-blue-400 font-mono text-sm leading-loose overflow-x-auto"><code>{data.codeBridge.code}</code></pre>
              </div>
           </div>
        </div>
      </div>

      {/*[结构 18] The Graveyard 废弃方案墓地 (新增) */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-32 text-center">
         <h2 className="text-2xl font-bold text-zinc-600 mb-12">The Graveyard (Rejected Concept)</h2>
         <div className="relative w-full h-[400px] rounded-3xl border-2 border-dashed border-zinc-800 overflow-hidden mb-8 opacity-40 grayscale">
            <Image src={data.graveyard.image} alt="Rejected" fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center"><XCircle className="w-32 h-32 text-red-500 opacity-50" /></div>
         </div>
         <p className="text-zinc-500 text-sm font-mono max-w-2xl mx-auto">Reasoning: {data.graveyard.reason}</p>
      </div>

      {/*[结构 19] Testimonials 高管原声 (新增) */}
      <div className="w-full bg-gradient-to-b from-[#050505] to-[#0a0a0a] py-32 border-t border-zinc-900">
         <div className="max-w-6xl mx-auto px-6 md:px-12">
            <MessageSquareQuote className="w-12 h-12 text-blue-500/20 mb-12 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {data.testimonials.map((t: any, i: number) => (
                 <div key={i} className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md">
                   <p className="text-lg text-zinc-300 italic mb-6">"{t.text}"</p>
                   <div className="text-sm font-mono text-blue-400">— {t.author}</div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* [结构 20] Deliverables Masonry 瀑布流全景墙 (新增) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
         <div className="flex items-center justify-between mb-12">
            <div className="text-sm font-mono text-blue-500 uppercase tracking-widest">Deliverables Gallery</div>
            <LayoutGrid className="w-5 h-5 text-zinc-600" />
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {data.masonryImages.map((img: string, i: number) => (
              <div key={i} className={`relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 ${i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`}>
                 <Image src={img} alt="Deliverable" fill className="object-cover opacity-60 hover:opacity-100 transition-opacity" />
              </div>
            ))}
         </div>
      </div>
      
      {/* [结构 7] Mac Window Mockup 交互模拟器 */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-32">
         <div className="w-full bg-[#111] border border-zinc-800 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]">
           <div className="h-12 bg-[#1A1A1A] border-b border-zinc-800 flex items-center px-6 gap-2">
             <div className="w-3 h-3 rounded-full bg-[#ED6A5E]"></div>
             <div className="w-3 h-3 rounded-full bg-[#F5BF4F]"></div>
             <div className="w-3 h-3 rounded-full bg-[#61C554]"></div>
             <div className="ml-4 h-6 px-4 bg-black/50 rounded-md text-[10px] font-mono text-zinc-500 flex items-center">snowtech.app/workspace</div>
           </div>
           <div className="relative w-full h-[500px]">
             <Image src={data.interactionMockup} alt="Interaction" fill className="object-cover object-top" />
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-lg px-6 py-3 rounded-full border border-zinc-700 text-sm text-white shadow-2xl flex items-center gap-3">
               <Zap className="w-4 h-4 text-blue-400" />
               {data.interactionDesc}
             </div>
           </div>
         </div>
      </div>

      {/* [结构 8] Design System Bento 基建资产 */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-32 border-t border-zinc-900">
        <div className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-12 text-center">05 // Foundation</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-10 rounded-[2rem]">
             <div className="flex items-center gap-3 mb-8"><Palette className="w-5 h-5 text-zinc-400" /><h3 className="text-white font-medium">Color Tokens</h3></div>
             <div className="flex gap-4 flex-wrap">
               {data.designSystem.colors.map((c: string) => (
                 <div key={c} className="w-16 h-16 rounded-2xl shadow-inner border border-white/10" style={{ backgroundColor: c }}></div>
               ))}
             </div>
           </div>
           <div className="md:col-span-1 bg-zinc-900 border border-zinc-800 p-10 rounded-[2rem]">
             <div className="flex items-center gap-3 mb-8"><Type className="w-5 h-5 text-zinc-400" /><h3 className="text-white font-medium">Typography</h3></div>
             <div className="space-y-4">
               <div className="text-3xl font-bold text-white">{data.designSystem.typography.heading}</div>
               <div className="text-sm text-zinc-500 font-mono">{data.designSystem.typography.body}</div>
             </div>
           </div>
        </div>
      </div>

      {/* [结构 9] Impact Metrics 业务收益 */}
      <div className="w-full bg-gradient-to-b from-[#050505] to-[#0A0A0A] py-32 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-sm font-mono text-blue-500 uppercase tracking-widest mb-16 text-center">06 // The Impact</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {data.impacts.map((impact: any, i: number) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
                <div className="relative text-7xl font-bold text-white mb-4 tracking-tighter">{impact.value}</div>
                <div className="text-sm font-mono text-zinc-500 uppercase tracking-widest">{impact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* [结构 10] Edge-to-Edge Reveal 无界大图 */}
      <div className="w-full h-[80vh] relative mt-32">
        <Image src={data.fullWidthImage} alt="Full View" fill className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
      </div>

      {/* Footer Next Project */}
      {data.nextProject && (
        <Link href={`/work/${data.nextProject.slug}`} className="block w-full py-40 bg-black hover:bg-zinc-900 transition-colors text-center group">
          <div className="text-sm font-mono text-zinc-500 tracking-widest uppercase mb-6 group-hover:text-blue-400 transition-colors">Up Next</div>
          <h2 className="text-5xl md:text-8xl font-bold text-white group-hover:translate-y-2 transition-transform duration-700">
            {data.nextProject.name}
          </h2>
        </Link>
      )}

    </div>
  );
}
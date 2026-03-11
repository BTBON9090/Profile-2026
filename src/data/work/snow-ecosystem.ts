// src/data/work/snow-ecosystem.ts

const snowEcosystemData = {
  "snow-ecosystem": {
    template: "v1", // 👈 必须补上这行！这是它的身份标识
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

    // ... 保留之前的 1-20 的数据 ...

    // [新增 21] Aha Moment
    ahaMoment: "在深入调研后我发现，管理员根本不关心‘策略怎么配’，他们只关心‘员工能不能连上’。我们将配置逻辑从‘基于规则’彻底转向了‘基于意图’。",
    // [新增 22] Atomic Anatomy
    anatomyComponent: { name: "Policy Card", padding: "16px", radius: "12px", gap: "8px" },
    // [新增 23] Information Architecture
    iaNodes: ["Global Dashboard", "Access Policies", "User Identity", "Audit Logs"],
    // [新增 24] I18n
    i18n: { en: "Deploy Secure Gateway", ar: "نشر البوابة الآمنة" },
    // [新增 25] A11y
    a11y: { contrast: "7.1:1 (AAA)", focusRing: "2px Solid Blue" },
    //[新增 26] Optimistic UI
    performance: "针对百万级日志拉取，设计了带微光扫视的 Skeleton Loading，降低了用户 40% 的等待焦虑感。",
    //[新增 27] AI State Machine
    aiStates:["Idle", "Analyzing DOM...", "Streaming Payload...", "Action Suggestions"],
    // [新增 28] Data Viz
    dataViz: "将复杂的网络连通性数据，抽象为简单的‘桑基图 (Sankey Diagram)’，流量走向一目了然。",
    // [新增 29] Responsive
    responsive:["1440px (Desktop)", "1024px (Tablet)", "390px (Mobile)"],
    // [新增 30] Iterations
    iterations:[
      { ver: "v1.0", desc: "基础可用，但表单过长。" },
      { ver: "v2.0", desc: "引入抽屉组件，但上下文易丢失。" },
      { ver: "v3.0", desc: "最终采用分步式弹层，完美闭环。" }
    ],
    // [新增 31] Easing Curve
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    // [新增 32] Microcopy
    microcopy: { bad: "Error 404: Gateway not found", good: "网关未响应，请检查连接器状态或重试" },
    // [新增 33] Cold Start
    coldStart: "新租户注册后，提供 3 分钟极速‘向导模式’，完成首个应用发布。",
    // [新增 34] RBAC
    rbac: ["Super Admin", "Security Auditor", "Department Manager"],
    //[新增 35] Cmd+K
    shortcuts:["Cmd + K (Global Search)", "Cmd + / (Shortcuts Help)"],
    // [新增 36] Backend Constraints
    apiConstraint: "由于后端 WebSocket 连接建立需要 800ms，我在按钮上增加了‘连接中’的过渡态，避免了用户的重复点击引发的数据脏写。",
    // [新增 37] Roadmap
    roadmap:["Q3: AI Copilot Integration", "Q4: Automated Threat Response"],
    // [新增 38] X-Ray Spotlight 数据
    xray: { baseImage: "/images/snow-admin.png", overlayImage: "/images/snow-admin.png", codeSpot1: "<SidebarNavigation />", codeSpot2: "<DataGrid virtualized={true} />" },
    
    //[新增 39] 3D Exploded 数据
    explodedView: { layer1: "BASE_LAYER / Canvas", layer2: "Glassmorphism UI", layer3: "ACTION_BUTTON" },
    
    //[新增 40] SVG Circuit 数据
    topology: { source: "PostgreSQL", middleware: "LLM Engine", client: "Client UI" },
    
    // [新增 41] Magnetic Terminal 数据
    terminal: { logs:["✔ Compiled successfully in 1432ms", "Wait until bundle finished...", "Injecting Magnetic Physics...", "[framer-motion] useSpring initialized"] },
    
    // ... 保持原来的 nextProject 在最下面

    // 结构 10: 全景大图与下一篇
    fullWidthImage: "/images/snow-admin.png",
    masonryImages:["/images/snow-admin.png", "/images/snow-browser.png", "/images/plugin-ui.png", "/images/ai-translate.png"],
    nextProject: { slug: "all-in-one", name: "AllinOne Figma Plugin" },

    
  },
}

export default snowEcosystemData;
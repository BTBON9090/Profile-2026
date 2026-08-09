export type AppBoxArticleSection = {
  title: string;
  paragraphs: string[];
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  caption?: string;
  points?: string[];
};

export type AppBoxArticle = {
  productId: string;
  lead: string;
  readingTime: string;
  cover?: string;
  coverAlt?: string;
  coverFit?: "cover" | "contain";
  sections: AppBoxArticleSection[];
  downloadNote?: string;
};

export const appBoxArticles: Record<string, AppBoxArticle> = {
  launchpad: {
    productId: "launchpad",
    lead: "LaunchPad 不是一个新的应用商店，而是把 macOS 用户熟悉的启动方式重新做回来。它保持原生、快速，也允许每个人按自己的习惯整理应用。",
    readingTime: "约 4 分钟",
    cover: "/product-assets/launchpad-icon.png",
    coverAlt: "LaunchPad 应用图标",
    coverFit: "contain",
    sections: [
      {
        title: "为什么重新做一个启动台",
        paragraphs: [
          "系统升级之后，很多用户仍然保留着 F4、触控板手势和分组整理的肌肉记忆。LaunchPad 的目标不是复制旧界面，而是保留这套无需思考的启动路径。",
          "应用启动属于高频、短时操作。界面必须快速出现，也必须在完成选择后立即离开，不应该让动画或设置本身抢走注意力。",
        ],
      },
      {
        title: "三种布局，一套数据",
        paragraphs: [
          "应用可以按分类网格、分页网格或纵向列表浏览。布局变化不会复制数据，搜索、分组、重命名和排序始终使用同一套应用索引。",
        ],
        points: ["支持 F4、快捷键、触控板手势与触发角", "拖放创建分组，自定义名称和排序", "原生 SwiftUI 构建，空闲时不持续占用前台资源"],
      },
      {
        title: "适合谁使用",
        paragraphs: [
          "如果你习惯通过 Dock 或 Spotlight 启动应用，系统现有方式已经足够。如果你更依赖视觉位置、应用分组和手势记忆，LaunchPad 会更直接。",
        ],
      },
    ],
  },
  aura: {
    productId: "aura",
    lead: "Aura 是一个本地优先的私密图片画廊。它处理的不是简单的隐藏，而是图片文件、应用入口和解锁方式三个层次的隐私。",
    readingTime: "约 5 分钟",
    cover: "/product-assets/aura-preview.png",
    coverAlt: "Aura 伪装相册界面",
    coverFit: "contain",
    sections: [
      {
        title: "从看不见，到真正拿不到",
        paragraphs: [
          "普通隐藏相册仍然依赖系统图库，其他应用、系统搜索或通知仍可能发现文件。Aura 的隔离模式会把图片移动到应用私有空间，并从系统图库移除原文件。",
          "所有整理信息都保存在本机。标签、浏览记录和幻灯片设置不需要上传到云端。",
        ],
      },
      {
        title: "入口也可以是一层保护",
        paragraphs: [
          "Aura 提供多套可交互伪装界面。桌面图标、应用名称与打开后的内容可以同步改变，只有完成约定手势才会进入真实画廊。",
        ],
        points: ["图片物理隔离", "入口身份伪装", "多种秘密解锁手势", "本地标签和幻灯片"],
      },
      {
        title: "下载说明",
        paragraphs: [
          "当前下载文件使用 .bin 后缀，避免部分浏览器拦截。下载完成后将后缀改为 .apk，再在 Android 设备中安装。",
        ],
      },
    ],
    downloadNote: "下载后请将 .bin 后缀改为 .apk。",
  },
  allinone: {
    productId: "allinone",
    lead: "AllinOne 把设计师频繁重复的小动作集中到一个 Figma 插件里。它不试图替代设计过程，而是减少找图层、改文案和整理组件的机械时间。",
    readingTime: "约 6 分钟",
    cover: "https://cdn.btbon.cn/images/ALO.webp",
    coverAlt: "AllinOne Figma 插件封面",
    coverFit: "cover",
    sections: [
      {
        title: "先解决每天都会遇到的问题",
        paragraphs: [
          "超级选择器可以按类型、属性和实例关系定位图层。查找替换、字体统计和批量调整则覆盖多语言与规范整理场景。",
        ],
        image: "https://cdn.btbon.cn/plugin/超级选择.png",
        imageAlt: "AllinOne 超级选择器界面",
      },
      {
        title: "AI 功能必须落到具体动作",
        paragraphs: [
          "AI 组件说明书会读取组件集并生成用途与使用建议。多语言翻译可以直接处理文本图层，再绑定 Figma Variables。AI 输出继续留在设计上下文里，而不是停在聊天窗口。",
        ],
        image: "https://cdn.btbon.cn/plugin/sms.gif",
        imageAlt: "AllinOne AI 组件说明书演示",
      },
      {
        title: "一个入口，三十多项能力",
        paragraphs: [
          "插件按照任务而不是技术分类。选择、文本、组件、图像和 AI 各自形成清晰分区，常用功能可以更快被找到。",
        ],
        points: ["超级选择与图层整理", "文本查找替换与多语言", "组件说明书与语义命名", "等轴形变和图像工具"],
      },
    ],
  },
  "ai-translate": {
    productId: "ai-translate",
    lead: "AI Translate 是一个尽量不打断阅读的浏览器翻译插件。用户可以在整页双语对照和局部划词翻译之间切换，并自由配置模型。",
    readingTime: "约 4 分钟",
    cover: "https://cdn.btbon.cn/images/aitran.webp",
    coverAlt: "AI Translate 浏览器翻译插件封面",
    coverFit: "cover",
    sections: [
      {
        title: "翻译不应该覆盖原文",
        paragraphs: [
          "整页翻译会保留原始段落，并把译文放在对应内容附近。用户可以随时对照语义，不需要在两个页面之间来回切换。",
        ],
      },
      {
        title: "只翻译当前需要的部分",
        paragraphs: [
          "划词翻译适合术语、短句和局部阅读。悬浮结果靠近选择区域出现，完成后可以快速收起。",
        ],
        points: ["整页双语对照", "局部划词翻译", "自定义模型与接口", "适配长文章阅读"],
      },
      {
        title: "关于模型配置",
        paragraphs: [
          "插件支持用户提供自己的模型服务。密钥只用于发起翻译请求，安装前仍建议阅读项目说明并确认接口来源。",
        ],
      },
    ],
  },
  "block-wall": {
    productId: "block-wall",
    lead: "BlockWall 是一个可直接在浏览器中操作的三维背景生成器。材质、灯光、相机和翻转行为都可以实时调整。",
    readingTime: "约 3 分钟",
    cover: "/product-assets/blockwall-icon.png",
    coverAlt: "BlockWall 三维方块墙生成器图标",
    coverFit: "contain",
    sections: [
      {
        title: "从静态背景变成可调整的场景",
        paragraphs: [
          "方块墙由真实 Three.js 场景驱动。每次修改颜色、倒角、雾效和光照，画面都会立即更新，不需要重新导出素材。",
        ],
      },
      {
        title: "动效可以被控制",
        paragraphs: [
          "自动翻转、悬停响应、并发数量与动画时长都可以独立调整。低性能设备也可以关闭互动，只保留静态背景。",
        ],
        points: ["实时材质与灯光", "真实倒角和多种表面预设", "自动翻转与悬停反馈", "参数面板即时预览"],
      },
      {
        title: "适合使用的场景",
        paragraphs: [
          "它适合活动页面、产品首屏和视觉实验。如果页面本身已经包含大量动画，建议降低翻转频率或直接输出静态方案。",
        ],
      },
    ],
  },
  "offer-guard": {
    productId: "offer-guard",
    lead: "offer 谈薪防坑计算器把一份复杂的录用条件拆成可以逐项核对的问题。它会整理薪资结构、估算税后收入，并帮助你在签字前准备好向 HR 继续确认的内容。",
    readingTime: "约 4 分钟",
    cover: "/product-assets/offer-negotiation-calculator-icon.png",
    coverAlt: "offer 谈薪防坑计算器图标",
    coverFit: "contain",
    sections: [
      {
        title: "先把收入结构拆开看",
        paragraphs: [
          "月薪只是 Offer 的一部分。固定薪资、发薪月数、绩效奖金、补贴和长期激励需要分别记录，避免把有条件的收入直接当成稳定收入。",
          "当某一项没有写清计算方式、发放时间或获得条件时，工具会把它保留在待确认清单里。",
        ],
      },
      {
        title: "集中检查容易忽略的条件",
        paragraphs: [
          "除了收入，还需要关注试用期、工作地点、社保公积金、奖金条件、竞业限制和违约责任。offer 谈薪防坑计算器把这些内容放进同一条检查路径，减少只盯着总包数字而漏看其他条款的情况。",
        ],
        points: ["固定收入与浮动收入分开记录", "试用期和转正条件核对", "社保公积金与工作地点确认", "限制条款和待确认问题集中整理"],
      },
      {
        title: "带着问题再做决定",
        paragraphs: [
          "检查完成后，用户可以回看仍然缺失的信息，并把需要追问的内容整理成一份沟通清单。城市社保和公积金预设按 2026 年 8 月 9 日可查到的官方口径复核；尚未公布新标准的城市会明确保留上一期官方值。",
          "计算结果仅供薪资比较和沟通准备，不构成税务、社保、公积金或劳动法律意见。最终金额应以签约主体所在地的当期政策、公司申报数据和实际工资单为准。",
        ],
      },
    ],
  },
};

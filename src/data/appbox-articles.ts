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
  eaglecp: {
    productId: "eaglecp",
    lead: "EagleCP 是一个面向 Eagle 桌面端的本地图片工具插件，聚焦两大核心能力：批量现代格式压缩与多模式细节对比。所有编码、预览与对比均在电脑本地完成，图片与元数据不出域。",
    readingTime: "约 4 分钟",
    cover: "/product-assets/eaglecp-icon.png",
    coverAlt: "EagleCP 插件图标",
    coverFit: "contain",
    downloadNote: "下载按钮始终指向最新发布的安装包，无需手动选择版本。",
    sections: [
      {
        title: "为 Eagle 而生的伴随工具",
        paragraphs: [
          "EagleCP 以插件形态运行在 Eagle 桌面端内部：插件创建、显示、再次运行和切换资源库时，都会自动同步 Eagle 的当前选区到「待处理图片」列表，也可以从 Eagle 顶部菜单或右键菜单直接打开。",
        ],
        image: "/product-assets/eagle-logo.png",
        imageAlt: "Eagle 官方图标",
        imageFit: "contain",
        caption: "EagleCP 与 Eagle 桌面端配套使用，图为 Eagle 官方图标。",
      },
      {
        title: "批量压缩，且尽量不白压缩",
        paragraphs: [
          "勾选待处理图片后可选择 WebP、AVIF、JPEG XL 的单格式或多格式组合输出。有损质量可在 40–95% 之间调节，无损模式锁定原始像素尺寸；也可开启最长边 1280–7680px 缩放，小图不会被放大。",
          "当新文件的空间收益不足 5% 时会自动跳过，避免无意义的二次编码。压缩完成的副本会完整继承 Eagle 文件夹、标签、评分、导入时间和备注，并自动带上「已压缩」标签。",
        ],
        points: ["WebP / AVIF / JPEG XL 单格式或多格式输出", "内置 JPEG XL 编码器（cjxl），三种格式均无需额外安装", "创建副本或安全替换原图，多格式输出自动强制创建副本", "待处理图片支持独立勾选、批量定位和选择性压缩"],
      },
      {
        title: "三种对比模式确认细节",
        paragraphs: [
          "压缩后是否损失了关键细节，需要放在同一视野里比较。平行宫格支持 2–16 张图片同步缩放；滑动分割用分割线左右对照；闪烁切换按时间交替显示，快速发现差异。",
          "对比视图最高 12 倍缩放、同步平移与视图重置，放大后还提供滚动条与右下角缩略导航图，大图定位更直观；不满意的文件可以直接送入 Eagle 回收站。",
        ],
      },
      {
        title: "本地处理，元数据不出域",
        paragraphs: [
          "图片编码、预览和画质对比均在电脑本地完成。插件只在用户主动检查版本更新时读取公开的 COS 版本清单，不上传任何图片或元数据。内置格式指南会根据内容、兼容性与后续用途帮助你选择格式。",
        ],
      },
      {
        title: "运行要求",
        paragraphs: [
          "安装前请确认环境满足以下条件：",
        ],
        points: ["macOS（Apple Silicon）", "Eagle 4.0 或更高版本", "Node.js", "WebP、AVIF、JPEG XL 编码器均已内置，无需额外安装"],
      },
      {
        title: "下载与安装流程",
        paragraphs: [
          "第一步：点击页面顶部的“下载插件”，获取最新的 .eagleplugin 安装包。下载链接会自动解析到最近一次发布的版本，每次下载都是最新版。",
          "第二步：双击下载得到的 EagleCP-x.x.x.eagleplugin 文件，Eagle 会自动唤起并弹出安装提示，按提示完成安装即可。",
          "第三步：在 Eagle 中选中图片，通过顶部菜单或右键菜单打开 EagleCP，选区会自动同步，勾选后即可开始压缩或对比。",
          "注意：.eaglepack 是 Eagle 的素材导入包格式，不是插件安装格式。如果界面一直提示导入，请取消任务，改用 .eagleplugin 文件安装。",
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
    lead: "薪算器把复杂的录用条件整理成一份清晰、可比较的薪资结构。它会拆分固定与浮动收入、估算税后，并提示仍需确认的信息，让求职者更从容地理解自己的 Offer。",
    readingTime: "约 4 分钟",
    cover: "/product-assets/offer-negotiation-calculator-icon.png",
    coverAlt: "薪算器图标",
    coverFit: "contain",
    sections: [
      {
        title: "先把收入结构拆开看",
        paragraphs: [
          "月薪只是 Offer 的一部分。固定薪资、发薪月数、绩效奖金、补贴和长期激励需要分别记录，避免把有条件的收入直接当成稳定收入。",
          "当某一项暂时缺少计算方式、发放时间或获得条件时，工具会把它保留在待确认清单里，方便后续补充信息。",
        ],
      },
      {
        title: "把影响收入的条件放在一起",
        paragraphs: [
          "试用期、工作地点、社保公积金和奖金兑现方式都会影响实际收入。薪算器把这些信息放进同一条计算路径，帮助用户同时理解目标值、常态估算和税后结果。",
        ],
        points: ["固定收入与浮动收入分开记录", "试用期收入单独估算", "社保公积金按城市参考值计算", "多个 Offer 使用同一口径比较"],
      },
      {
        title: "带着清晰信息做决定",
        paragraphs: [
          "测算完成后，用户可以回看仍然缺失的信息，并把需要进一步确认的内容整理成沟通清单。城市社保和公积金预设按 2026 年 8 月 9 日可查到的官方口径复核；尚未公布新标准的城市会明确保留上一期官方值。",
          "计算结果仅供薪资比较和沟通准备，不构成税务、社保、公积金或劳动法律意见。最终金额应以签约主体所在地的当期政策、公司申报数据和实际工资单为准。",
        ],
      },
    ],
  },
  "lyrics-skyline": {
    productId: "lyrics-skyline",
    lead: "Lyric Skyline 把主站正在使用的歌词天际屏做成一个独立的音乐视觉实验室。用户可以完整试听、调整层次与动效，并把参数和模板导出到自己的项目。",
    readingTime: "约 4 分钟",
    cover: "/product-assets/lyrics-skyline-icon.png",
    coverAlt: "Lyric Skyline 歌词天际屏播放器图标",
    coverFit: "contain",
    sections: [
      {
        title: "从固定效果变成可调的歌词空间",
        paragraphs: [
          "经典模式保留主站当前使用的前景、中景和背景歌词层。展示宽度、随机分布、水平与垂直离散、字体、字重和模糊程度都可以实时调整。",
          "工具会读取同一套播放列表与歌词时间轴，因此在调参时看到的不是静态样例，而是真实歌曲中的连续变化。",
        ],
      },
      {
        title: "凝聚与弥散是独立效果模式",
        paragraphs: [
          "粒子凝聚会让分散字符逐步回到可读歌词，弥散湮灭则让完整文字向两侧拆解。它们与经典天际屏分开实现，切换效果不会改变主站默认方案。",
        ],
        points: ["经典前中后景天际屏", "粒子凝聚成文字", "歌词弥散与湮灭", "低动态偏好自动降级"],
      },
      {
        title: "完整播放控制与方案导出",
        paragraphs: [
          "播放器提供歌曲选择、时间轴拖动、前后十秒、循环、倍速和歌词同步微调。完成视觉设置后，可以导出 JSON 参数，或下载一个独立 HTML 模板继续开发。",
        ],
      },
    ],
  },
};

# 作品集网站设计与技术指南

## 🎨 设计理念

### 核心风格
- **极客理性风**：采用黑白灰为主色调，配合蓝色点缀，营造专业、理性的技术氛围
- **沉浸式体验**：通过 Framer Motion 实现丝滑的动画效果，打造一滑到底的流畅体验
- **极简主义**：干净的布局，充足的留白，突出内容本身

### 设计元素
- **字体系统**：Inter (正文) + JetBrains Mono (代码/标题)，经典的系统级无衬线体搭配程序员最爱的等宽字体
- **色彩方案**：
  - 主色调：Zinc 系列（黑白灰）
  - 强调色：蓝色 (#3B82F6)
  - 辅助色：红色（小红书图标）
- **动效设计**：
  - 页面元素入场动画
  - 悬停效果
  - 平滑滚动

## 🛠️ 技术栈

### 核心框架
- **Next.js 16.1.6** (App Router)：React 的终极形态，服务端渲染 (RSC) 带来极致的首屏加载速度，SEO 友好
- **Tailwind CSS v4**：原子化 CSS，构建速度极快，维护极其方便
- **Shadcn/ui + Radix UI**：无头组件库，100% 可自定义，自带高级的黑白灰 "Geek" 风格
- **Framer Motion 12**：实现沉浸式动效的核心引擎
- **Lucide React**：现代简约的图标库
- **Vercel**：零配置部署，全球 CDN 加速

### 项目结构
```
src/
├── app/
│   ├── layout.tsx       // 全局布局（包含顶部导航 + 左侧锚点）
│   ├── page.tsx         // 首页（承载所有作品模块的滚动容器）
│   └── globals.css      // 全局样式
├── components/
│   ├── ui/              // 基础 UI 组件 (Button, Card, etc.)
│   ├── layout/          // 布局组件 (Navbar, Sidebar, Footer)
│   ├── sections/        // 页面分块组件
│   │   ├── hero.tsx     // 首屏 (Hero Section)
│   │   ├── about.tsx    // 个人介绍
│   │   └── projects/    // 具体作品模块
│   └── visual/          // 视觉装饰组件 (背景, 光效)
└── lib/                 // 工具函数 (utils.ts)
```

## 📱 页面结构

### 1. 全局布局 (layout.tsx)
- 强制深色模式 (`<html lang="en" className="dark">`)
- 字体配置：Inter + JetBrains Mono
- 固定顶部导航栏
- 固定左侧锚点导航
- 主内容区域

### 2. 导航组件
- **Navbar**：固定顶部，透明背景，滚动时变化效果
- **Sidebar**：固定左侧，垂直排列的导航点，随滚动高亮
- **Footer**：页面底部，包含联系方式和社交链接

### 3. 内容区块
- **Hero Section**：首屏区域，大型标题和简短介绍
- **About Section**：个人介绍，技能展示
- **Projects Section**：作品展示，卡片式布局

## 🎯 设计规范

### 色彩变量
```css
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
  --radius: 0.5rem;
}
```

### 排版规范
- **标题**：JetBrains Mono, 粗体, 大尺寸
- **正文**：Inter, 常规, 中等尺寸
- **代码/标签**：JetBrains Mono, 等宽
- **行高**：1.5-1.8
- **字间距**：标题使用 tracking-wider

### 动画规范
- **入场动画**：从下往上，淡入效果
- **悬停动画**：轻微缩放，颜色变化
- **滚动动画**：元素随滚动渐入
- **过渡时间**：0.6-0.8秒，使用 easeOut 缓动函数

## 🔧 开发指南

### 新增组件
1. 在 `src/components/` 相应目录下创建组件
2. 对于 UI 组件，遵循 Shadcn/ui 规范
3. 对于页面区块，使用 Framer Motion 添加适当动画

### 新增页面
1. 在 `src/app/` 下创建新的路由目录
2. 添加 `page.tsx` 文件
3. 遵循项目的设计风格和布局规范

### 性能优化
- 使用 Server Components 处理数据获取
- 客户端组件仅用于交互和动画
- 合理使用 `next/image` 优化图片加载
- 代码分割和懒加载

## 📋 待优化项

### 功能优化
- [ ] 作品详情页
- [ ] 响应式导航（移动端汉堡菜单）
- [ ] 滚动到指定区块的动画
- [ ] 深色/浅色模式切换

### 设计优化
- [ ] 更多视觉装饰元素
- [ ] 作品卡片的悬停效果
- [ ] 更丰富的页面过渡动画
- [ ] 自定义光标效果

### 内容优化
- [ ] 个人介绍内容完善
- [ ] 作品案例填充
- [ ] 技能展示模块
- [ ] 联系方式优化

## 🚀 部署指南

1. 确保所有依赖已安装：`npm install`
2. 构建项目：`npm run build`
3. 部署到 Vercel：
   - 连接 GitHub 仓库
   - 零配置部署
   - 自动生成域名

## 📝 版本记录

- **v1.0**：基础项目搭建
  - Next.js 16 + Tailwind CSS v4
  - 基础布局组件
  - 首屏和关于页面
  - 社交链接配置

---

**注意**：本指南用于指导 AI 进行项目优化，确保所有修改都遵循项目的设计风格和技术规范。
// src/app/page.tsx
import Hero from "@/components/sections/hero";
import AllInOne from "@/components/sections/all-in-one"; // 引入新组件
import SnowEcosystem from "@/components/sections/snow-ecosystem";
import About from "@/components/sections/about";
import Footer from "@/components/layout/footer"; // 注意路径，我们在 layout 下创建的

export default function Home() {
  return (
    <div className=" min-h-screen selection:bg-blue-500/30 selection:text-blue-200">
      <Hero />
      <AllInOne />
      <SnowEcosystem />
      <About />
      <Footer />
    </div>
  );
}


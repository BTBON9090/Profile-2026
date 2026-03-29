// src/data/projects.ts

// 1. 引入你所有拆分出去的作品数据
import snowEcosystem from './work/snow-ecosystem';
import lightBranding from './work/light-branding';
import darkAppUiData from './work/dark-app-ui';
import enterplorer from './work/enterplorer';
import avic from './work/avic';
import kwaiMagneticStar from './work/kwaiMagneticStar';
import amazeui from './work/amazeui';
import studio from './work/studio';
import others from './work/others';
import k10 from './work/k10';
// import allInOne from './work/all-in-one'; 

// 2. 建立全局数据索引库 (Registry)
const allProjects: Record<string, any> = {
  "snow-ecosystem": snowEcosystem,
  "light-branding": lightBranding,
  "dark-app-ui": darkAppUiData,
  "enterplorer": enterplorer,
  "avic": avic,
  "kwai-magnetic-star": kwaiMagneticStar,
  "amazeui": amazeui,
  "studio": studio,
  "others": others,
  "k10": k10,
  // "all-in-one": allInOne,
};

// 3. 暴露出两个极其优雅的方法供 UI 层调用
export const getProjectBySlug = (slug: string) => {
  return allProjects[slug] || null;
};

export const getAllProjectSlugs = () => {
  return Object.keys(allProjects);
};
// src/data/projects.ts

// 1. 引入你所有拆分出去的作品数据
import snowEcosystem from './work/snow-ecosystem';
import lightBranding from './work/light-branding';
import darkAppUiData from './work/dark-app-ui';
import k05 from './work/k05';
import k06 from './work/k06';
import k07 from './work/k07';
import k08 from './work/k08';
import k09 from './work/k09';
import k10 from './work/k10';
// import allInOne from './work/all-in-one'; 

// 2. 建立全局数据索引库 (Registry)
const allProjects: Record<string, any> = {
  "snow-ecosystem": snowEcosystem,
  "light-branding": lightBranding,
  "dark-app-ui": darkAppUiData,
  "k05": k05,
  "k06": k06,
  "k07": k07,
  "k08": k08,
  "k09": k09,
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
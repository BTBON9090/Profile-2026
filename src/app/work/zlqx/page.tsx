import type { Metadata } from 'next';
import Link from 'next/link';
import ProjectDemo from './project-demo';
import './project.css';

export const metadata: Metadata = {
  title: '智聘千寻 · AI 招聘工作台 | BTBON.Design',
  description: '覆盖职位、候选人、面试、Offer 与组织权限的 AI 招聘工作台，体验完整的高保真交互原型。',
};

export default function ZhipinProject() {
  return <div className="zhipin-project">
    <header className="zhipin-project__header">
      <Link href="/work" className="zhipin-project__back">← 返回 PROJECT</Link>
      <p className="zhipin-project__eyebrow">2026 · AI RECRUITMENT</p>
      <h1>智聘千寻<span>让招聘流程，围绕判断展开。</span></h1>
      <p className="zhipin-project__lead">从职位发布、候选人推进到面试与 Offer，将 AI 助手放进真实的工作流程。一个可以亲手操作的招聘工作台。</p>
      <div className="zhipin-project__tags"><span>AI 招聘 Agent</span><span>B 端体验</span><span>人力资源</span><span>交互原型</span></div>
    </header>
    <ProjectDemo />
    <section className="zhipin-project__scope" aria-label="项目说明">
      <div><h2>从一份简历，到一次入职</h2><p>职位、候选人、面试和 Offer 串成连续链路；组织权限、消息与招聘配置为协同工作提供支撑。</p></div>
      <div><h2>可以操作的产品原型</h2><p>演示数据保存在当前浏览器。AI 生成、简历解析与消息发送为交互模拟，适合探索流程和设计取舍。</p></div>
    </section>
  </div>;
}

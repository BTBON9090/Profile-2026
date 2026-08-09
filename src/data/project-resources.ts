export type ProjectResource = {
  label: string;
  href: string;
  kind: "figma";
};

const resourcesByProject: Record<string, ProjectResource[]> = {
  snowspace: [
    {
      label: "业务设计文件",
      href: "https://www.figma.com/design/xCIFvWHiCEKrSqF5wkTnwD/%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0?node-id=919-2568&t=YRyjE6FoVQl3bQBi-1",
      kind: "figma",
    },
    {
      label: "ADS 组件库",
      href: "https://www.figma.com/design/hpdSbaRsIllvJfhynCPVa8/ADS-2.5.2?node-id=8253-44145&t=mW1FoILWKtTxXm7X-1",
      kind: "figma",
    },
  ],
};

export function getProjectResources(projectId: string | null | undefined) {
  if (!projectId) return [];
  return resourcesByProject[projectId] ?? [];
}

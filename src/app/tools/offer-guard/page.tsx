import type { Metadata } from "next";
import ProductBackButton from "@/components/ui/product-back-button";

export const metadata: Metadata = {
  title: "offer 谈薪防坑计算器 | AppBox",
  description: "拆解薪资结构、估算税后收入并检查 Offer 风险条款。",
};

export default function OfferGuardPage() {
  return (
    <div className="offer-guard-host">
      <ProductBackButton light />
      <iframe
        className="offer-guard-frame"
        src="/tools/offer-guard.html?embedded=1"
        title="offer 谈薪防坑计算器"
        allow="clipboard-write"
      />
    </div>
  );
}

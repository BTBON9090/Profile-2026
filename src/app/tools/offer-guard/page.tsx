import type { Metadata } from "next";
import ProductBackButton from "@/components/ui/product-back-button";

export const metadata: Metadata = {
  title: "薪算器 | AppBox",
  description: "拆解 Offer 薪资结构、估算税后收入，并使用统一口径比较不同方案。",
};

export default function OfferGuardPage() {
  return (
    <div className="offer-guard-host">
      <ProductBackButton light />
      <iframe
        className="offer-guard-frame"
        src="/tools/offer-guard-standalone.html?embedded=1"
        title="薪算器"
        allow="clipboard-write"
      />
    </div>
  );
}

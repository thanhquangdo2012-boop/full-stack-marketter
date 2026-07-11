import { notFound } from "next/navigation";
import Link from "next/link";
import { getPaidMvp3Count } from "@/lib/mvp3-count";
import { PRODUCT_INFO, getMvp3Price, formatVnd, type ProductCode } from "@/lib/pricing";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

function isProductCode(value: string | undefined): value is ProductCode {
  return value === "mvp2" || value === "mvp3" || value === "mvp4";
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productParam } = await searchParams;
  const product: ProductCode = isProductCode(productParam) ? productParam : "mvp3";

  let price = PRODUCT_INFO[product].defaultPrice;
  if (product === "mvp3") {
    price = getMvp3Price(await getPaidMvp3Count());
  }

  if (!PRODUCT_INFO[product]) notFound();

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="text-sm text-slate-500 mb-6 inline-block">
          ← Về trang chủ
        </Link>
        <CheckoutForm
          product={product}
          productName={PRODUCT_INFO[product].name}
          priceFormatted={formatVnd(price)}
        />
      </div>
    </main>
  );
}

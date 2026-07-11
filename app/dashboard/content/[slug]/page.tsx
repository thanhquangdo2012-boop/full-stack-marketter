import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentMember } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { hasAccess, type Tier } from "@/lib/tiers";

export const dynamic = "force-dynamic";

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.mustChangePassword) redirect("/change-password");

  const db = supabaseAdmin();
  const { data: item } = await db
    .from("content_items")
    .select("title, body, required_tier")
    .eq("slug", slug)
    .maybeSingle();

  if (!item) notFound();

  // RULE-04/RULE-06: kiểm tra quyền TRƯỚC khi đưa body vào response — không
  // render nội dung thật ra HTML rồi mới ẩn bằng CSS.
  const unlocked = hasAccess(member.tier, item.required_tier as Tier);
  if (!unlocked) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-xl font-bold mb-2">Nội dung này chưa được mở khoá</h1>
          <p className="text-sm text-slate-500 mb-6">
            Cần nâng cấp lên gói {item.required_tier.toUpperCase()} để xem nội dung này.
          </p>
          <Link href="/upgrade" className="text-amber-600 font-semibold">
            Xem các gói nâng cấp →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-sm text-slate-500 mb-6 inline-block">
          ← Tổng quan
        </Link>
        <article className="bg-white border border-slate-200 rounded-2xl p-8 prose prose-sm max-w-none whitespace-pre-wrap">
          <h1 className="text-xl font-bold mb-4">{item.title}</h1>
          <div>{item.body}</div>
        </article>
      </div>
    </main>
  );
}

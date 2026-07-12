import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/" className="text-sm text-slate-500 mb-6 inline-block">
          ← Về trang chủ
        </Link>
        {/* LoginForm đọc ?identifier= qua useSearchParams (điền sẵn khi tới
            từ /checkout) — bắt buộc bọc Suspense để Next.js prerender được
            phần tĩnh còn lại của trang. */}
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

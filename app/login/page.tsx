import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/" className="text-sm text-slate-500 mb-6 inline-block">
          ← Về trang chủ
        </Link>
        <LoginForm />
      </div>
    </main>
  );
}

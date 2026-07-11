import { CONTAINER } from "@/lib/ui";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 text-center text-[13px] border-t border-white/10">
      <div className={CONTAINER}>
        <p>
          Full-stack Marketer — Lộ trình dành cho người làm marketing - truyền thông đa năng bất
          đắc dĩ.
        </p>
        <p className="mt-1.5">
          © {new Date().getFullYear()} Full-stack Marketer. Mọi thắc mắc về đơn hàng, liên hệ qua
          Zalo ở trang xác nhận đăng ký.
        </p>
      </div>
    </footer>
  );
}

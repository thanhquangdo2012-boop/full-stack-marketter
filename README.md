# Full-stack Marketer — website

Next.js (App Router) + Tailwind + Supabase + Upstash Redis. Xem [CLAUDE.md](CLAUDE.md) để hiểu
đầy đủ bối cảnh sản phẩm, [project-brief.md](project-brief.md) cho các quyết định đã chốt, và
[12-NGUYEN-TAC-BAO-MAT.md](12-NGUYEN-TAC-BAO-MAT.md) cho chuẩn bảo mật bắt buộc.

## Việc cần làm TRƯỚC khi cho khách thật dùng

- [ ] Điền `BANK_ACCOUNT_NAME` / `BANK_ACCOUNT_NUMBER` / `BANK_NAME` thật trong `.env.local` (trang `/checkout` đang hiện placeholder rỗng nếu chưa điền).
- [ ] Điền `NEXT_PUBLIC_ZALO_CONTACT` (link/số Zalo thật để giao hàng, hỗ trợ).
- [ ] Duyệt lại nội dung nháp trong `content/mvp2/` và `content/mvp3/` (đánh dấu ⚠️ NỘI DUNG NHÁP) — đây là sản phẩm bán thật, không giao nội dung nháp cho khách.
- [ ] Duyệt lại quiz nháp trong `content/mvp3/quiz-draft.md` — quiz UI chưa được code trong bản này (mới có draft nội dung + logic gợi ý), làm ở bước sau nếu duyệt xong.
- [ ] Đặt `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` thật (xem hướng dẫn bên dưới).

## 1. Cài đặt

```bash
npm install
cp .env.local.example .env.local
```

Điền các biến trong `.env.local`:

| Biến | Lấy ở đâu |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Upstash Console → tạo Redis database (free tier) |
| `AUTH_SECRET` | Chạy `openssl rand -base64 32` (hoặc bất kỳ chuỗi ngẫu nhiên ≥32 ký tự) |
| `ADMIN_EMAIL` | Email bạn dùng để đăng nhập `/admin/login` |
| `ADMIN_PASSWORD_HASH` | Xem mục 3 bên dưới |
| `BANK_ACCOUNT_NAME`, `BANK_ACCOUNT_NUMBER`, `BANK_NAME` | Thông tin chuyển khoản hiển thị ở `/checkout` sau khi khách đăng ký |
| `NEXT_PUBLIC_ZALO_CONTACT` | Link Zalo (vd: `https://zalo.me/xxxx`) hiển thị sau khi đăng ký |

## 2. Khởi tạo database Supabase

Chạy nội dung [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql) trong
Supabase SQL Editor (hoặc `supabase db push` nếu dùng Supabase CLI). Migration này tạo bảng
`members`, `orders`, `quiz_results`, `content_items` và bật RLS trên tất cả (RULE-10).

Sau đó nạp nội dung nháp vào `content_items`:

```bash
npm run seed
```

## 3. Tạo mật khẩu admin

`ADMIN_PASSWORD_HASH` là bcrypt hash, không phải mật khẩu thô. Tạo bằng Node:

```bash
node -e "require('bcryptjs').hash('mật-khẩu-thật-của-bạn', 12).then(console.log)"
```

Dán kết quả vào `ADMIN_PASSWORD_HASH` trong `.env.local`.

⚠️ **Escape dấu `$`:** Next.js load `.env.local` với cơ chế expand kiểu shell
(`$VAR` bị hiểu là tham chiếu biến khác). Hash bcrypt luôn có dạng `$2a$12$...`
nên PHẢI escape mỗi dấu `$` thành `\$`, ví dụ:

```
ADMIN_PASSWORD_HASH=\$2a\$12\$abc123...
```

Nếu quên bước này, phần đầu hash bị cắt mất và đăng nhập `/admin` luôn báo
sai mật khẩu dù gõ đúng — chỉ xảy ra ở `.env.local` local, biến khai báo
trực tiếp trên Vercel dashboard không bị ảnh hưởng.

## 3.5. SePay — tự động xác nhận thanh toán (tuỳ chọn)

Không bắt buộc — không cấu hình thì vẫn xác nhận đơn tay ở `/admin/orders` bình thường.

1. Tạo tài khoản tại [sepay.vn](https://sepay.vn), liên kết tài khoản ngân hàng nhận tiền
   (VIB) — bước này bạn tự làm, cần OTP/đăng nhập ngân hàng thật.
2. Tạo `SEPAY_WEBHOOK_SECRET` bằng `openssl rand -hex 32`, dán vào `.env.local` **và** vào Vercel
   Environment Variables.
3. Trên dashboard SePay, tạo Webhook mới:
   - URL: `https://<domain-cua-ban>/api/webhooks/sepay`
   - Kiểu xác thực: **HMAC-SHA256** (không dùng "None" hay "API Key" đơn giản)
   - Secret: dán đúng giá trị `SEPAY_WEBHOOK_SECRET` ở bước 2
4. Đảm bảo mọi giao dịch chuyển khoản (checkout, admin xác nhận tay) đều dùng đúng "Nội dung
   CK" là mã đơn hàng (`FSM-XXXXXX`) — webhook đọc mã đơn từ nội dung chuyển khoản qua regex,
   không khớp được sẽ bỏ qua giao dịch đó (không lỗi, chỉ không tự xác nhận).

Webhook chỉ tự xác nhận khi **số tiền khớp chính xác** với đơn hàng — nếu lệch, hệ thống gửi
email cảnh báo (`[Cần kiểm tra tay]`) và để bạn tự xác nhận thủ công thay vì tự động mở khoá sai
giá.

## 4. Chạy dev

```bash
npm run dev
```

Mở http://localhost:3000

- `/checkout?product=mvp3` — luồng đăng ký + hướng dẫn chuyển khoản
- `/login` — đăng nhập thành viên
- `/dashboard` — khu vực thành viên (khoá nội dung theo tier)
- `/admin/login` → `/admin/orders` — xác nhận thanh toán thủ công

## 5. Build & deploy

```bash
npm run build
```

Deploy lên Vercel: kết nối repo hoặc `vercel deploy`, khai báo toàn bộ biến trong
`.env.local.example` ở Vercel → Project Settings → Environment Variables. Trước khi deploy, chạy
lại **Checklist Deploy** trong [12-NGUYEN-TAC-BAO-MAT.md](12-NGUYEN-TAC-BAO-MAT.md).

## Cấu trúc thư mục

```
app/              — trang + API routes (Next.js App Router)
components/       — UI components (trang chủ, form, dashboard)
lib/              — supabase client, auth, rate-limit, pricing, tiers
content/          — nội dung sản phẩm dạng markdown (nạp vào DB qua npm run seed)
supabase/migrations/ — schema SQL
scripts/          — script seed nội dung
```

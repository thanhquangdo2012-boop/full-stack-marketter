# CLAUDE.md — Website "Lộ trình Full-stack Marketer" (SaaS: Frontend + Backend)

File này dành cho Claude Code đọc và thực thi trực tiếp khi build/tiếp tục project này. Đây **không phải** project vibecode chung chung — sản phẩm, thương hiệu, và nội dung phần lớn đã được xác định sẵn qua 2 tài liệu nguồn:

- `Phan-tich-ngach-Nguoi-Marketing-Da-Nang-2026-07-11.docx` — báo cáo chiến lược ngách (định vị, đối tượng, mô hình 3 giai đoạn, 4 MVP, Grand Slam Offer).
- `Full-stack-Marketer.html` — landing page nháp đã viết sẵn cho MVP3, dùng làm **baseline nội dung + màu sắc + font** cho trang chủ (không phải khoahocsolo.com).

File bảo mật bắt buộc đi kèm: [12-NGUYEN-TAC-BAO-MAT.md](12-NGUYEN-TAC-BAO-MAT.md) — đọc trước khi viết bất kỳ dòng code backend nào.

Câu trả lời phỏng vấn đã tổng hợp: [project-brief.md](project-brief.md) — đọc file này trước, chỉ hỏi lại HV (Đỗ Thanh Quang) những mục còn đánh dấu "CẦN XÁC NHẬN".

## 0. RÀNG BUỘC BẮT BUỘC — ẨN DANH

Đây là ràng buộc quan trọng nhất, khác biệt so với project web bán khóa học thông thường:

- **Nội dung công khai trên site** (copy, story, trust section, footer, tên hiển thị, ảnh) — ẨN DANH HOÀN TOÀN. Không hiển thị tên thật "Đỗ Thanh Quang" ở bất kỳ đâu thuộc phần nội dung/thương hiệu. Dùng thương hiệu sản phẩm "Full-stack Marketer" hoặc bút danh, không dùng ảnh chân dung thật (nếu cần ảnh, dùng avatar minh hoạ/illustration, không phải ảnh thật).
- **Phần pháp lý / thanh toán** (trang điều khoản, thông tin chuyển khoản, hoá đơn nếu có) — được phép dùng tên thật/tài khoản ngân hàng thật vì đây là giao dịch tiền thật cần minh bạch. Đặt các thông tin này ở trang riêng (`/checkout`, `/terms`), không trộn vào nội dung marketing công khai.
- Không tự ý thêm số liệu thành tích, tên khách hàng, case study cụ thể có thể định danh công ty/sự kiện thật — báo cáo ngách đã nêu rõ đây là rủi ro lộ danh tính. Khi cần ví dụ, kể khái quát (đã có sẵn trong landing page và trust section).
- Không dùng định dạng lộ mặt (livestream, video call, Zoom) ở bất kỳ đâu trên site.

## 1. SẢN PHẨM & VALUE LADDER (đã xác định, không cần hỏi lại)

| Bậc | Tên | Vai trò | Giá | Định dạng |
|---|---|---|---|---|
| MVP1 | Lead magnet | Miễn phí, thu thập Tên/SĐT/Email, kéo vào kênh riêng | 0đ | Ebook/checklist tặng — "Checklist 10 câu hỏi để biết bạn đang bị kéo giãn hay đang được đào tạo đa năng" |
| MVP2 | Sản phẩm lọc | Lọc người có nhu cầu thật, hoàn tiền 100% sau dùng thử | 99.000–199.000đ | Bộ công cụ số nhỏ: mẫu tờ trình, kịch bản họp sếp lớn, checklist điều phối liên phòng ban |
| MVP3 | Sản phẩm chính | Nguồn doanh thu chính | 399.000đ (tăng dần: 399k/499k/599k theo mốc 50/150 người) | Lộ trình Full-stack Marketer: quiz chẩn đoán, nguồn học chọn lọc, tiêu chí tự đánh giá, checklist trước khi nộp + bonus (mẫu tờ trình MVP2, vé nhóm kín, cập nhật 6 tháng) |
| MVP4 | VIP | Bổ trợ, giới hạn số lượng | 2.000.000–4.000.000đ | Gói nâng cao đi kèm MVP3, hoặc tư vấn 1-1 mở rộng |

Người đã mua MVP2 mà mua tiếp MVP3 → trừ thẳng số tiền MVP2 đã trả vào giá MVP3.

**Tier tài khoản thành viên tương ứng:** `free` (đăng ký qua MVP1) → `mvp2` → `mvp3` → `mvp4`. Tier chỉ tăng, admin xác nhận thanh toán thủ công mới nâng tier (xem mục 4).

## 2. TECH STACK

Giữ nguyên chuẩn trong 12-NGUYEN-TAC-BAO-MAT.md:

| Thành phần | Công nghệ |
|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS |
| Hosting | Vercel |
| Database + Auth | Supabase (Postgres), RLS bật bắt buộc |
| Rate limiting | Upstash Redis |
| Hash mật khẩu | bcrypt |
| Font | Be Vietnam Pro (Google Fonts, đã dùng trong landing page gốc) |
| Thanh toán | **Thủ công** — chuyển khoản ngân hàng, admin xác nhận tay trong trang `/admin` (không tích hợp cổng thanh toán tự động ở giai đoạn này) |

## 3. GIAO DIỆN — dùng `Full-stack-Marketer.html` làm baseline

Không áp dụng cấu trúc khối kiểu khoahocsolo.com (top bar/hero/pricing 3 card kiểu khóa học). Thay vào đó, giữ đúng cấu trúc đã viết sẵn trong `Full-stack-Marketer.html`, chuyển từ HTML tĩnh sang component Next.js + Tailwind, dùng lại nguyên bảng màu:

```css
--navy:#0f172a; --navy-light:#1e293b; --gold:#f59e0b; --gold-dark:#d97706;
--ink:#1e293b; --muted:#64748b; --bg-soft:#f8fafc; --border:#e2e8f0; --green:#16a34a;
```

Thứ tự khối trang chủ (đúng theo file gốc):

1. Nav — logo chữ "Full-stack **Marketer**" (span màu gold-dark) + nút CTA "Nhận lộ trình" (scroll tới `#pricing`).
2. Hero — eyebrow, H1 (có `<em>` màu gold nhấn "ngoài chuyên môn"), sub, CTA row (nút chính + ghi chú khan hiếm "50 suất đầu tiên...").
3. **Dải số liệu ấn tượng** (bổ sung mới, đáp ứng yêu cầu 4-số-liệu chuẩn landing page): 4 nỗi sợ đã giải quyết · 5 mảnh ghép năng lực · 50 suất đầu tiên · 7 ngày hoàn tiền — đặt ngay dưới hero, trước section "Bạn có đang thấy quen không".
4. Section "Bạn có đang thấy quen không" — agitate-intro + 4 pain-card (kéo giãn / cùn / không ai dạy / sợ bị chửi) + before/after grid.
5. Section "Những tình huống lấn sân quen thuộc" — 4 scenario-card theo vai trò (Ads thủ, Content Writer, Designer, PR), mỗi card: tình huống → cách lộ trình xử lý → lợi ích lâu dài.
6. Trust section — câu chuyện ẩn danh (giữ nguyên nội dung gốc, không chỉnh sửa thêm chi tiết định danh).
7. "Trong lộ trình có gì" — stack-list 5 mốc đánh số + growth-callout.
8. "Lộ trình này dành cho ai" — qualify-grid (Phù hợp / Chưa phù hợp).
9. "Tặng kèm khi đăng ký" — bonus-grid 3 thẻ.
10. Pricing section (`#pricing`) — price-ladder 3 mốc (50/150/sau) + price-box chi tiết MVP3 + CTA **"Giữ suất giá ..."** → dẫn tới `/checkout` (không phải link `#` chết như bản nháp).
11. FAQ.
12. Final push CTA.
13. Footer — không lộ tên thật, ghi chú bản quyền thương hiệu "Full-stack Marketer".

Responsive: bám nguyên breakpoint đã viết sẵn trong CSS gốc (`@media(max-width:640px)`), chuyển sang Tailwind breakpoints tương đương (`sm:`/`md:`). Test tối thiểu 375px và 1440px trước khi báo hoàn thành.

**Không cần hỏi lại HV** các mục: brand name, màu sắc, font, H1/sub, 4 lý do, 5 mốc lộ trình, 3 gói giá, bonus, FAQ, chính sách hoàn tiền — toàn bộ đã có sẵn trong `Full-stack-Marketer.html`, copy nguyên văn khi build component, không diễn giải lại.

## 4. LUỒNG MUA HÀNG (thay thế mục A.4/B.1 của file vibecode gốc — không dùng popup tự động)

Vì đây là site bán sản phẩm số ẩn danh, thanh toán thủ công — **không dùng popup tự động khi vào trang** (dễ gây khó chịu, không hợp giọng "kể chuyện thật" của thương hiệu). Thay vào đó:

1. Khách bấm CTA "Giữ suất giá..." ở pricing section → vào trang `/checkout?product=mvp3` (hoặc mvp2/mvp4 nếu có entry point riêng).
2. Trang checkout: form 3 trường bắt buộc (Họ tên, SĐT, Email) + hiển thị rõ sản phẩm/giá đang chọn.
3. Submit form → API `/api/register` (rate limit, RULE-08/09):
   - Nếu SĐT/email chưa tồn tại: tạo `members` mới, `password_hash` = bcrypt("123456789"), `tier = 'free'`, `must_change_password = true`, tạo kèm `orders` record (`status = 'pending_payment'`, `product = 'mvp3'`, `amount = <giá hiện tại theo mốc>`).
   - Nếu đã tồn tại: không tạo trùng, tạo `orders` mới gắn với `member_id` cũ.
4. Trang xác nhận (`/checkout/thanh-toan` hoặc tương tự) hiển thị: thông tin chuyển khoản (tên chủ tài khoản, số tài khoản, ngân hàng, nội dung chuyển khoản = mã đơn hàng) + hướng dẫn "Vui lòng chuyển khoản đúng nội dung để được xác nhận nhanh" + nhắc tài khoản đăng nhập (SĐT/email) và mật khẩu mặc định `123456789` + nhắc bắt buộc đổi mật khẩu khi đăng nhập lần đầu.
5. Admin vào `/admin/orders`, thấy đơn `pending_payment`, xác nhận đã nhận tiền → API `/api/admin/confirm-order` (yêu cầu admin auth) → set `orders.status = 'paid'`, nâng `members.tier` tương ứng, mở khoá nội dung.
6. Member đăng nhập lần đầu bằng mật khẩu mặc định → bắt buộc đổi mật khẩu (`must_change_password`) trước khi vào dashboard, đúng RULE-04/RULE-08/09 trong file bảo mật.

⚠️ Giữ nguyên lưu ý bảo mật của file gốc: mật khẩu mặc định `123456789` giống nhau cho mọi tài khoản mới là điểm yếu đã biết — bước bắt buộc đổi mật khẩu lần đầu và rate limiting không được bỏ qua.

## 5. DASHBOARD THÀNH VIÊN

- Menu: Tổng quan · Lộ trình của tôi · Nâng cấp gói · Đổi mật khẩu · Đăng xuất.
- Tier `free`: thấy được MVP1 (nội dung/checklist miễn phí), thấy trạng thái đơn hàng đang chờ xác nhận nếu có.
- Tier `mvp2`/`mvp3`/`mvp4`: mở khoá đúng nội dung tương ứng (server verify theo RULE-04, không ẩn bằng CSS theo RULE-06). Nội dung MVP3 gồm: quiz chẩn đoán (logic phân nhánh theo câu trả lời, xem mục 6), danh sách nguồn học theo mảng việc, bộ tiêu chí tự đánh giá, checklist trước khi nộp.
- Nội dung tier cao hơn hiển thị dạng khoá/mờ kèm nút "Nâng cấp" dẫn tới bảng so sánh giá (`/upgrade`), không lộ nội dung thật trong HTML khi chưa có quyền.

## 6. QUIZ CHẨN ĐOÁN (đặc thù sản phẩm, không có trong file vibecode gốc)

MVP3 có "quiz chẩn đoán lộ trình riêng" — hỏi vài câu về công ty/công việc hiện tại của member, trả về gợi ý mảng kỹ năng + tài liệu ưu tiên tương ứng. Đây **chỉ là logic phân nhánh theo câu trả lời** (if/else hoặc bảng mapping), không cần AI ở giai đoạn này (theo đúng báo cáo ngách mục 7). Lưu kết quả quiz vào bảng `quiz_results` gắn với `member_id`, hiển thị lại trên dashboard.

Câu hỏi quiz cụ thể — **CẦN HỎI HV** (báo cáo không liệt kê chi tiết từng câu, chỉ nói khái niệm), xem [project-brief.md](project-brief.md) mục còn trống.

## 7. MÔ HÌNH DỮ LIỆU (Supabase)

| Bảng | Mục đích | Bảo mật |
|---|---|---|
| `members` | tên, sđt, email, password_hash, tier ('free'\|'mvp2'\|'mvp3'\|'mvp4'), must_change_password | RLS bật, password bcrypt (RULE-07, RULE-10) |
| `members_public` (VIEW) | dữ liệu công khai tối thiểu, không gồm password_hash | anon key chỉ đọc view này |
| `orders` | member_id, product, amount, status ('pending_payment'\|'paid'\|'cancelled'), bank_transfer_note (mã đơn), created_at, confirmed_at, confirmed_by | ghi/sửa chỉ qua API server-side + admin auth |
| `quiz_results` | member_id, answers (jsonb), recommended_tracks | RLS: member chỉ đọc/ghi kết quả của chính mình |
| `content_items` | tier yêu cầu, loại nội dung (nguồn học/tiêu chí/checklist), nội dung | đọc công khai theo tier ở server, ghi chỉ qua admin |

## 8. QUY TRÌNH THỰC THI

1. Đọc [project-brief.md](project-brief.md), hỏi HV các mục còn "CẦN XÁC NHẬN" (từng câu một, không dồn).
2. Cập nhật project-brief.md, xin xác nhận cuối "OK bắt đầu code".
3. Khởi tạo Next.js + Tailwind, cấu trúc `components/` / `app/api/` / `lib/`.
4. Build trang chủ theo mục 3, dùng nguyên nội dung từ `Full-stack-Marketer.html`.
5. Dựng schema Supabase theo mục 7, bật RLS ngay khi tạo bảng.
6. Viết API `/api/register`, `/api/login`, `/api/change-password`, `/api/admin/confirm-order`, quiz theo mục 6 — tuân RULE-02/03/04/11.
7. Build `/checkout`, `/login`, `/change-password`, `/dashboard`, `/upgrade`, `/admin`.
8. Rate limiting Upstash cho mọi endpoint đăng nhập/đăng ký/admin.
9. `.env.local` liệt kê đủ biến, không commit.
10. Chạy Checklist Deploy trong 12-NGUYEN-TAC-BAO-MAT.md, báo đạt/chưa đạt.
11. Deploy Vercel, test trên desktop + mobile thật.

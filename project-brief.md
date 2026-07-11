# Project Brief — Lộ trình Full-stack Marketer

Tổng hợp từ `Phan-tich-ngach-Nguoi-Marketing-Da-Nang-2026-07-11.docx` + `Full-stack-Marketer.html` + quyết định của HV trong phiên làm việc ngày 2026-07-11. Các mục đánh dấu **[MẶC ĐỊNH]** có thể chỉnh sau. Các mục đánh dấu **[CẦN XÁC NHẬN]** đang chờ HV trả lời.

## Thương hiệu & Ẩn danh
- Tên thương hiệu: **Full-stack Marketer**
- Tác giả: ẩn danh trên toàn bộ nội dung/thương hiệu. Chữ ký trust section: "Người đồng hành, Full-stack Marketer" **[MẶC ĐỊNH — giữ nguyên như bản nháp, có thể đổi bút danh khác]**
- Danh tính thật (Đỗ Thanh Quang) chỉ xuất hiện ở phần pháp lý/thanh toán (trang điều khoản, xác nhận chuyển khoản), không ở nội dung marketing.
- Không dùng ảnh chân dung thật, không livestream/video call.

## Màu sắc & Font (lấy nguyên từ Full-stack-Marketer.html)
- navy `#0f172a`, navy-light `#1e293b`, gold `#f59e0b`, gold-dark `#d97706`, ink `#1e293b`, muted `#64748b`, bg-soft `#f8fafc`, border `#e2e8f0`, green `#16a34a`
- Font: Be Vietnam Pro (400–800), Google Fonts

## Cấu trúc trang chủ
Theo đúng thứ tự đã viết trong `Full-stack-Marketer.html` (xem CLAUDE.md mục 3) + bổ sung dải số liệu 4 mục dưới hero (4 nỗi sợ / 5 mảnh ghép năng lực / 50 suất đầu tiên / 7 ngày hoàn tiền).

## Value ladder / sản phẩm
Xem bảng đầy đủ trong CLAUDE.md mục 1. Tóm tắt: MVP1 miễn phí (lead magnet) → MVP2 99–199k (bộ công cụ nhỏ) → MVP3 399k (Lộ trình chính, tăng giá theo mốc 50/150 người) → MVP4 2–4tr (VIP).

## Thanh toán
- **[Quyết định của HV]** Chuyển khoản ngân hàng thủ công, admin xác nhận tay trong `/admin`, không tích hợp cổng thanh toán tự động ở bản đầu.
- **[CẦN XÁC NHẬN]** Thông tin tài khoản ngân hàng hiển thị ở trang checkout: tên chủ tài khoản, số tài khoản, ngân hàng. Đây là dữ liệu thật, tôi sẽ không tự đặt — cần HV cung cấp trực tiếp (có thể gửi riêng, không nhất thiết qua chat nếu muốn giữ kín).
- **[CẦN XÁC NHẬN]** Nội dung ghi chú chuyển khoản dùng mã đơn hàng tự sinh — có cần thêm quy ước riêng không (ví dụ tiền tố "FSM-")?

## Kênh liên hệ & giao hàng
- **[CẦN XÁC NHẬN]** Kênh cho "vé vào nhóm kín" (bonus MVP3) và hỗ trợ khách: Zalo, Telegram, hay cả hai? Cần link/thông tin cụ thể (có thể dùng số ẩn danh riêng, không phải số cá nhân).
- **[CẦN XÁC NHẬN]** Email nào nhận thông báo đơn hàng mới cho admin? (mặc định đề xuất dùng quangdtq.2012@gmail.com nếu không có email riêng cho thương hiệu — **[MẶC ĐỊNH]**, xác nhận lại)

## Nội dung thật bên trong sản phẩm (core deliverable)
- **[CẦN XÁC NHẬN]** MVP2 (mẫu tờ trình, kịch bản họp sếp lớn, checklist điều phối liên phòng ban) và nội dung MVP3 (nguồn học chọn lọc theo mảng việc, bộ tiêu chí tự đánh giá, checklist trước khi nộp) — HV đã có sẵn nội dung thật ở đâu đó để đưa vào, hay muốn tôi soạn bản nháp trước dựa theo mô tả trong báo cáo, HV duyệt/chỉnh sau?
- Nếu chưa có nội dung thật: dùng placeholder rõ ràng "nội dung mẫu — cần thay trước khi bán thật", không giao hàng placeholder cho khách thật.

## Quiz chẩn đoán (MVP3)
- **[CẦN XÁC NHẬN]** Câu hỏi cụ thể trong quiz (báo cáo chỉ nói khái niệm: hỏi về công ty và công việc hiện tại, trả về gợi ý mảng kỹ năng/tài liệu). Tôi có thể soạn bản nháp 4–6 câu dựa theo 4 vai trò đã có trong landing page (Ads thủ, Content Writer, Designer, PR) để HV duyệt — hay HV muốn tự soạn?

## Hạ tầng & triển khai
- **[CẦN XÁC NHẬN]** Domain: đã có chưa, hay dùng tạm `*.vercel.app`?
- **[CẦN XÁC NHẬN]** Đã có tài khoản Vercel và Supabase chưa?
- **[CẦN XÁC NHẬN]** Có cần giới hạn số lượng đăng ký (khớp mốc 50/150 người trong bảng giá) hoặc chặn đăng ký trùng SĐT dồn dập không? (đề xuất mặc định: có, để khớp cơ chế khan hiếm thật trong Grand Slam Offer — **[MẶC ĐỊNH]**)

## Trang quản trị (admin)
- **[MẶC ĐỊNH]** Chỉ HV (Đỗ Thanh Quang) truy cập `/admin`, xác nhận qua Supabase Auth. Chức năng: xem danh sách đơn hàng theo trạng thái, xác nhận thanh toán → nâng tier, xem danh sách thành viên theo tier.

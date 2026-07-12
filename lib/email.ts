import "server-only";
import { Resend } from "resend";

/**
 * Báo cho ADMIN (chính bạn) qua email khi có đơn đăng ký/đặt hàng mới —
 * KHÔNG dùng để gửi email cho khách hàng. Vì chưa có domain riêng xác minh
 * với Resend, chỉ gửi được từ địa chỉ sandbox "onboarding@resend.dev" tới
 * đúng email chủ tài khoản Resend — không gửi được cho người khác. Xem
 * README.md phần Email.
 *
 * Cố tình "best effort": nếu gửi lỗi (thiếu key, domain khác, rate limit
 * Resend...) chỉ log, KHÔNG throw — không được để một email thất bại làm
 * hỏng luồng đăng ký/thanh toán thật của khách (RULE-11: lỗi phụ không
 * được chặn nghiệp vụ chính).
 */
export async function notifyAdminNewOrder(params: {
  orderCode: string;
  productName: string;
  amountFormatted: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  isNewMember: boolean;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!apiKey || !adminEmail) return;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Full-stack Marketer <onboarding@resend.dev>",
      to: adminEmail,
      subject: `[Đơn mới] ${params.orderCode} — ${params.productName}`,
      text: [
        `Có ${params.isNewMember ? "khách mới" : "khách cũ đăng ký thêm"} vừa tạo đơn hàng:`,
        ``,
        `Mã đơn: ${params.orderCode}`,
        `Sản phẩm: ${params.productName}`,
        `Số tiền: ${params.amountFormatted}`,
        `Tên: ${params.customerName}`,
        `SĐT: ${params.customerPhone}`,
        `Email: ${params.customerEmail}`,
        ``,
        `Vào /admin/orders để xác nhận sau khi nhận được chuyển khoản.`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[notifyAdminNewOrder] gửi email thất bại (bỏ qua, không chặn đăng ký)", err);
  }
}

import "server-only";
import { Resend } from "resend";

/**
 * Gửi email cho ADMIN (chính bạn) — KHÔNG dùng để gửi email cho khách
 * hàng. Vì chưa có domain riêng xác minh với Resend, chỉ gửi được từ địa
 * chỉ sandbox "onboarding@resend.dev" tới đúng email chủ tài khoản Resend
 * — không gửi được cho người khác. Xem README.md phần Email.
 *
 * Cố tình "best effort": nếu gửi lỗi (thiếu key, domain khác, rate limit
 * Resend...) chỉ log, KHÔNG throw — không được để một email thất bại làm
 * hỏng luồng đăng ký/thanh toán thật của khách (RULE-11: lỗi phụ không
 * được chặn nghiệp vụ chính).
 */
async function sendAdminEmail(subject: string, lines: string[]) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!apiKey || !adminEmail) return;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Full-stack Marketer <onboarding@resend.dev>",
      to: adminEmail,
      subject,
      text: lines.join("\n"),
    });
  } catch (err) {
    console.error(`[sendAdminEmail] gửi email thất bại (bỏ qua): ${subject}`, err);
  }
}

export async function notifyAdminNewOrder(params: {
  orderCode: string;
  productName: string;
  amountFormatted: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  isNewMember: boolean;
}) {
  await sendAdminEmail(`[Đơn mới] ${params.orderCode} — ${params.productName}`, [
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
  ]);
}

export async function notifyAdminOrderAutoConfirmed(params: { orderCode: string }) {
  await sendAdminEmail(`[Tự động xác nhận] ${params.orderCode}`, [
    `SePay đã tự động xác nhận thanh toán cho đơn ${params.orderCode} — tier thành viên đã được nâng.`,
    `Không cần thao tác gì thêm, chỉ để bạn theo dõi.`,
  ]);
}

export async function notifyAdminSepayMismatch(params: {
  orderCode: string;
  expectedAmount: number;
  receivedAmount: number;
}) {
  await sendAdminEmail(`[Cần kiểm tra tay] Số tiền lệch — ${params.orderCode}`, [
    `SePay báo có tiền vào khớp mã đơn ${params.orderCode} nhưng SỐ TIỀN KHÔNG KHỚP:`,
    ``,
    `Cần: ${params.expectedAmount.toLocaleString("vi-VN")}đ`,
    `Nhận được: ${params.receivedAmount.toLocaleString("vi-VN")}đ`,
    ``,
    `Hệ thống KHÔNG tự xác nhận đơn này — vào /admin/orders kiểm tra và xác nhận tay nếu hợp lệ.`,
  ]);
}

import { CONTAINER } from "@/lib/ui";

export default function TrustSection() {
  return (
    <section className="bg-slate-50 py-14">
      <div className={CONTAINER}>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-center mb-8">
          Ai đứng sau lộ trình này
        </h2>
        <div className="max-w-[680px] mx-auto bg-white border border-slate-200 rounded-2xl p-8">
          <span className="text-4xl text-amber-500 leading-none">&ldquo;</span>
          <p className="text-[15px] my-3">
            Có một buổi họp mà bên Sale nói thẳng: nội dung này không giúp bán được hàng gì cả.
            Vài phút sau, người quản lý truyền thông trực tiếp lại nói: làm vậy là quá thương mại,
            mất chất thương hiệu. Cùng một bài viết, bị chê ngược nhau từ hai phía, không ai đứng
            ra nói rõ đâu mới là đúng. Đó là cảm giác quen thuộc suốt nhiều năm làm marketing -
            truyền thông tại một công ty nửa gia đình trị, nơi chủ nắm quyền và tư duy khá cũ.
          </p>
          <p className="text-[15px] my-3">
            Trước đó nữa là giai đoạn tự học chạy quảng cáo Facebook một mình để bán ví, túi xách
            online — không ai dạy, chỉ có ngân sách thử nghiệm đốt hết mà đơn không ra, rồi tự
            ngồi mổ xẻ xem sai ở đâu. Sau này nhận chạy ads thuê cho đủ ngành hàng khác nhau — nội
            y, gia dụng, đồng phục, nội thất — cũng theo đúng cách đó: làm trước, sai, rồi mới
            hiểu.
          </p>
          <p className="text-[15px] my-3">
            Cái khó không phải là thiếu năng lực, mà là không có ai đứng giữa hai làn tư duy trái
            ngược để chỉ nên nghe ai, nên tin vào đâu. Sau nhiều lần tự đứng một mình giữa hai
            phía, quyết định ngồi lại hệ thống hóa mọi thứ đã tự học được — không theo trường phái
            nào, chỉ theo cách nào thực sự dùng được.
          </p>
          <p className="text-[15px] my-3">
            Chọn ẩn danh không phải vì thiếu tự tin, mà để có thể kể thật 100% những gì đã trải
            qua, kể cả những lúc làm sai và bị nhắc nhở — không phải giữ ý cho công ty hay cho ai.
          </p>
          <div className="text-[13px] text-slate-500 font-semibold mt-4">
            — Người đồng hành, Full-stack Marketer
          </div>
        </div>
      </div>
    </section>
  );
}

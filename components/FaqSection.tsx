import { CONTAINER } from "@/lib/ui";

const FAQS = [
  {
    q: "Tôi không giỏi kể chuyện hay viết lách, có học được không?",
    a: "Lộ trình tập trung vào tư duy và checklist thực thi, không yêu cầu kỹ năng viết hay kể chuyện.",
  },
  {
    q: "Tôi làm ở công ty nhỏ, không có quy trình bài bản, có áp dụng được không?",
    a: "Quiz đầu vào sẽ hỏi về đúng bối cảnh công ty và công việc của bạn để đưa ra gợi ý phù hợp, không phải một bản áp dụng chung cho mọi nơi.",
  },
  {
    q: "Mua rồi có được hỗ trợ thêm gì không?",
    a: "Có nhóm kín với buổi hỏi đáp định kỳ đi kèm, và tài liệu được cập nhật trong 6 tháng đầu.",
  },
  {
    q: "Nhận sản phẩm dưới hình thức nào?",
    a: "Truy cập lộ trình dạng tài liệu số cùng đường link vào nhóm kín, gửi qua kênh đăng ký sau khi hoàn tất.",
  },
];

export default function FaqSection() {
  return (
    <section className="py-14">
      <div className={CONTAINER}>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-center mb-8">
          Câu hỏi thường gặp
        </h2>
        <div>
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              className={`py-[18px] ${i !== FAQS.length - 1 ? "border-b border-slate-200" : ""}`}
            >
              <h4 className="text-[15px] font-bold mb-1.5">{f.q}</h4>
              <p className="text-sm text-slate-500">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

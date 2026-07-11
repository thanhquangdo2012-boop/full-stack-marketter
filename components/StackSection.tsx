import { CONTAINER } from "@/lib/ui";

const STACK = [
  {
    num: 1,
    feel: "Cảm giác quen thuộc: nhận việc mới, đầu óc trống rỗng, không biết bắt đầu từ đâu",
    problem: "Vấn đề: Không biết bắt đầu từ đâu khi bị giao việc lạ",
    title: "Quiz chẩn đoán lộ trình riêng",
    desc: "Trả lời vài câu về công ty và công việc hiện tại, nhận về đúng lộ trình học phù hợp — không phải bản chung chung, không cần tự đoán xem nên học gì trước.",
  },
  {
    num: 2,
    feel: "Cảm giác quen thuộc: mở 10 tab Google, đọc xong vẫn không biết tin ai",
    problem: "Vấn đề: Tài liệu học rời rạc, không biết nguồn nào đáng tin",
    title: "Danh sách nguồn học đã chọn lọc",
    desc: "Tài liệu, KOL, nguồn tham khảo theo từng mảng việc cụ thể — đỡ mất hàng giờ tự sàng lọc thông tin nhiễu.",
  },
  {
    num: 3,
    feel: "Cảm giác quen thuộc: gửi đi rồi mới hồi hộp, không biết có đúng không",
    problem: "Vấn đề: Làm xong không biết đúng hay sai, không ai review",
    title: "Bộ tiêu chí tự đánh giá kết quả",
    desc: "Khung chấm cho tờ trình, content, hình ảnh — tự kiểm tra trước khi nộp, không cần chờ ai duyệt hộ, không phải đoán mò.",
  },
  {
    num: 4,
    feel: "Cảm giác quen thuộc: sai một chi tiết nhỏ, gánh hết trách nhiệm một mình",
    problem: "Vấn đề: Sợ làm sai bị chửi",
    title: "Checklist kiểm tra trước khi nộp",
    desc: "Rà lại những lỗi thường gặp nhất ở từng loại việc, giảm rủi ro sai sót ngay từ đầu — an tâm hơn trước khi bấm gửi.",
  },
  {
    num: 5,
    feel: "Cảm giác quen thuộc: cuối tuần vẫn ngồi tự học, mà không chắc học đúng thứ cần",
    problem: "Vấn đề: Mất quá nhiều thời gian tự mày mò",
    title: "Lộ trình rút gọn, đúng trọng tâm",
    desc: "Chỉ học đúng phần việc cần dùng ngay, không học lan man những thứ chưa cần tới — lấy lại thời gian cho bản thân.",
  },
];

export default function StackSection() {
  return (
    <section className="py-14">
      <div className={CONTAINER}>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-center mb-2.5">
          Trong lộ trình có gì
        </h2>
        <p className="max-w-[560px] mx-auto mb-10 text-[15px] text-slate-500 text-center">
          Mỗi phần giải quyết đúng một vấn đề thật, không lý thuyết dàn trải
        </p>

        <div className="max-w-[680px] mx-auto">
          {STACK.map((item, i) => (
            <div
              key={item.num}
              className={`flex gap-4 py-5 ${
                i !== STACK.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              <div className="shrink-0 w-[34px] h-[34px] bg-slate-900 text-amber-500 rounded-full flex items-center justify-center font-bold text-sm">
                {item.num}
              </div>
              <div>
                <div className="text-[13px] italic text-amber-600 mb-1.5">{item.feel}</div>
                <div className="text-[13px] text-amber-700/80 mb-1">{item.problem}</div>
                <h4 className="text-[15px] font-bold mb-1">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-[680px] mx-auto mt-9 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6 sm:p-7">
          <span className="block text-xs font-extrabold uppercase tracking-wide text-amber-600 mb-2">
            Không chỉ để đỡ sợ
          </span>
          <p className="text-[15px]">
            Ghép 5 mảnh trên lại, bạn không chỉ bớt hoảng mỗi lần bị giao việc lạ — bạn có sẵn một
            hồ sơ năng lực đa năng mà người chỉ giỏi một mảng chuyên môn không có. Đó đúng là nền
            tảng của người được cân nhắc lên vị trí nhìn toàn cục — quản lý, trưởng nhóm, hoặc
            marketing lead — thay vì mãi là người chỉ thực thi theo phân công.
          </p>
        </div>
      </div>
    </section>
  );
}

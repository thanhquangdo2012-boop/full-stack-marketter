import { CONTAINER } from "@/lib/ui";

const SCENARIOS = [
  {
    role: "Ads thủ",
    situation:
      'Bạn được tuyển vào để tối ưu ngân sách quảng cáo, ROAS, target audience. Nhưng tháng này công ty có sự kiện ra mắt sản phẩm, và vì "không có ai rành hơn", bạn bị kéo đi chọn hoa, sắp bàn ghế, làm việc với đơn vị tổ chức sự kiện — những thứ chưa từng học qua.',
    solve:
      "quiz chẩn đoán chỉ ngay khung tư duy điều phối sự kiện cần dùng, tra bộ tài liệu điều phối liên phòng ban thay vì tự mò, dùng checklist để tránh sai sót cơ bản khi lần đầu làm việc với đơn vị ngoài.",
    growth:
      'không chỉ "sống sót" qua sự kiện — có thêm kỹ năng điều phối đa bên, nền tảng để ứng tuyển vị trí quản lý dự án hoặc trưởng nhóm sau này.',
  },
  {
    role: "Content Writer",
    situation:
      "Bạn giỏi viết, nhưng sếp yêu cầu tổng hợp số liệu hiệu suất content của quý thành một bản báo cáo có insight, trình bày cho ban lãnh đạo — thứ bạn chưa từng được đào tạo để làm.",
    solve:
      'bộ tiêu chí tự đánh giá giúp bạn biết một báo cáo "đủ sức nặng" cần có gì trước khi trình, danh sách nguồn học giúp tra nhanh cách đọc số liệu cơ bản mà không cần học cả một khóa phân tích dữ liệu.',
    growth:
      "kỹ năng đọc số liệu và kể chuyện bằng data tách bạn ra khỏi nhóm chỉ biết viết, mở đường sang vị trí content strategist hoặc marketing lead.",
  },
  {
    role: "Designer",
    situation:
      "Bạn thiết kế hình ảnh, nhưng team thiếu người nên bạn bị giao đi phỏng vấn khách hàng để hiểu insight trước khi thiết kế chiến dịch mới — một kỹ năng hoàn toàn khác với thiết kế.",
    solve:
      "khung câu hỏi phỏng vấn cơ bản và cách tổng hợp insight thành brief thiết kế, để không phải ứng biến hoàn toàn từ số 0.",
    growth:
      "designer hiểu insight khách hàng là designer hiếm — bước đệm để trở thành creative lead thay vì chỉ thực thi theo brief người khác đưa.",
  },
  {
    role: "PR / Truyền thông",
    situation:
      'Bạn quen làm thông cáo báo chí, xây hình ảnh thương hiệu, nhưng giờ phải lên kịch bản quảng cáo bán hàng trực tiếp vì phía Sale yêu cầu "brand phải ra số" — ngôn ngữ hoàn toàn khác với những gì bạn quen làm.',
    solve:
      "tài liệu chọn lọc giúp nắm nhanh nguyên lý viết quảng cáo bán hàng cơ bản mà không cần học lại từ đầu, tiêu chí tự đánh giá giúp tự tin hơn trước khi trình.",
    growth:
      "người vừa hiểu thương hiệu vừa hiểu ngôn ngữ bán hàng là người hiếm trong ngành — gần đúng chân dung marketing manager mà nhiều công ty đang thiếu.",
  },
];

export default function ScenarioSection() {
  return (
    <section className="py-14">
      <div className={CONTAINER}>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-center mb-2.5">
          Những tình huống lấn sân quen thuộc
        </h2>
        <p className="max-w-[560px] mx-auto mb-10 text-[15px] text-slate-500 text-center">
          Đây là các tình huống điển hình, không phải case của một khách hàng cụ thể — vì lộ
          trình mới ra mắt, chưa có ai dùng để trích dẫn
        </p>

        <div className="space-y-[18px]">
          {SCENARIOS.map((s) => (
            <div key={s.role} className="border border-slate-200 rounded-2xl p-6 sm:p-[26px]">
              <span className="inline-block bg-slate-900 text-amber-500 text-xs font-bold px-3 py-1.5 rounded-full mb-3.5">
                {s.role}
              </span>
              <p className="text-[15px] mb-3.5">{s.situation}</p>
              <div className="bg-slate-50 border-l-[3px] border-amber-500 rounded-r-lg px-4 py-3 text-sm mb-3">
                <b className="text-amber-600">Cách xử lý trong lộ trình:</b> {s.solve}
              </div>
              <p className="text-[13px] text-green-700 italic">
                <b className="not-italic">Về lâu dài:</b> {s.growth}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

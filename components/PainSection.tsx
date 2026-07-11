import { CONTAINER } from "@/lib/ui";

const PAIN_CARDS = [
  {
    tag: "Sợ bị kéo giãn",
    title: "Một người làm việc của bốn người",
    body: "Sáng viết content, trưa chạy ads, chiều bị kéo vào họp bàn chiến lược, tối ngồi làm báo cáo — không ai hỏi bạn có kịp không, chỉ hỏi bao giờ xong.",
  },
  {
    tag: "Sợ bị cùn",
    title: "Kỹ năng chính đang mài mòn",
    body: "Có những tuần bạn không viết nổi một dòng content tử tế, vì cả tuần chỉ toàn họp và xử lý việc phát sinh. Bạn bắt đầu tự hỏi mình còn giỏi thứ gì.",
  },
  {
    tag: "Sợ không ai dạy",
    title: "Tự bơi một mình",
    body: "Lên chức hoặc nhận việc mới nhưng không có ai ngồi xuống chỉ bạn cách làm đúng — chỉ có deadline và kỳ vọng, không có hướng dẫn.",
  },
  {
    tag: "Sợ làm sai bị chửi",
    title: "Làm việc lạ, dễ mắc lỗi",
    body: "Việc ngoài chuyên môn không ai review giúp trước khi gửi đi. Sai một câu chữ trong tờ trình, bạn là người đứng ra nhận hết.",
  },
];

export default function PainSection() {
  return (
    <section className="py-14">
      <div className={CONTAINER}>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-center mb-2.5">
          Bạn có đang thấy quen không
        </h2>
        <p className="max-w-[640px] mx-auto mb-8 text-base text-center">
          9 giờ tối, bạn vẫn đang ngồi chỉnh sửa một bản báo cáo không thuộc chuyên môn của mình,
          trong khi <strong className="text-amber-600">việc thật sự bạn được tuyển vào để làm</strong>{" "}
          thì dồn lại từ sáng đến giờ chưa đụng tới. Sếp lớn hỏi tiến độ, sếp trực tiếp hỏi vì sao
          chưa xong content, còn bạn thì không biết nên xin lỗi ai trước.
        </p>

        <div className="grid sm:grid-cols-2 gap-[18px]">
          {PAIN_CARDS.map((card) => (
            <div
              key={card.tag}
              className="bg-slate-50 border border-slate-200 rounded-xl p-[22px]"
            >
              <span className="block text-xs font-bold text-amber-600 uppercase tracking-wide mb-2">
                {card.tag}
              </span>
              <h3 className="text-[17px] font-bold mb-2">{card.title}</h3>
              <p className="text-sm text-slate-500">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-[18px] max-w-[760px] mx-auto mt-10">
          <div className="rounded-xl p-6 bg-red-50 border border-red-200">
            <span className="block text-xs font-extrabold uppercase tracking-wide mb-3 text-red-600">
              Hiện tại
            </span>
            <ul className="space-y-1.5 text-sm">
              <li>— Nhận việc mới mà không biết bắt đầu từ đâu</li>
              <li>— Tự tìm tài liệu học lẻ tẻ trên mạng, không biết tin nguồn nào</li>
              <li>— Làm xong không chắc đúng hay sai, hồi hộp chờ phản hồi</li>
              <li>— Mỗi lần bị giao việc lạ là một lần lo lắng</li>
            </ul>
          </div>
          <div className="rounded-xl p-6 bg-green-50 border border-green-200">
            <span className="block text-xs font-extrabold uppercase tracking-wide mb-3 text-green-600">
              Sau khi có lộ trình
            </span>
            <ul className="space-y-1.5 text-sm">
              <li>— Có sẵn khung tư duy cho từng loại việc, mở ra là biết làm gì trước</li>
              <li>— Tài liệu đã được chọn lọc sẵn, không mất thời gian tìm kiếm</li>
              <li>— Tự kiểm tra được kết quả trước khi gửi đi, tự tin hơn</li>
              <li>— Việc ngoài chuyên môn không còn là nỗi sợ, mà là cơ hội tích lũy</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

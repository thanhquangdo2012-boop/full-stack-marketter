import { CONTAINER } from "@/lib/ui";

export default function QualifySection() {
  return (
    <section className="bg-slate-50 py-14">
      <div className={CONTAINER}>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-center mb-2.5">
          Lộ trình này dành cho ai
        </h2>
        <p className="max-w-[560px] mx-auto mb-8 text-[15px] text-slate-500 text-center">
          Nói thẳng để bạn không mất thời gian nếu chưa đúng đối tượng
        </p>

        <div className="grid sm:grid-cols-2 gap-[18px] max-w-[760px] mx-auto">
          <div className="rounded-xl p-6 bg-green-50 border border-green-200">
            <h4 className="font-extrabold mb-3 text-green-700">Phù hợp nếu bạn</h4>
            <ul className="space-y-1.5 text-sm">
              <li>Đang làm Content, Digital Ads, Marketing - Truyền thông tại doanh nghiệp vừa và nhỏ</li>
              <li>Đang phải ôm việc ngoài chuyên môn: nghiên cứu, báo cáo, điều phối, tờ trình</li>
              <li>Muốn có hệ thống thay vì tiếp tục tự mò mẫm một mình</li>
              <li>Muốn biến việc bị giao ngoài chuyên môn thành lợi thế cho vị trí cao hơn, không chỉ để sống sót qua ngày</li>
              <li>Sẵn sàng bỏ ra vài giờ mỗi tuần để áp dụng, không tìm phép màu tức thì</li>
            </ul>
          </div>
          <div className="rounded-xl p-6 bg-white border border-slate-200">
            <h4 className="font-extrabold mb-3 text-slate-500">Chưa phù hợp nếu bạn</h4>
            <ul className="space-y-1.5 text-sm">
              <li>Đã có quy trình bài bản, người hướng dẫn rõ ràng tại công ty</li>
              <li>Chỉ cần một khóa học lý thuyết, không có ý định thực hành</li>
              <li>Đang tìm cách kiếm tiền nhanh, không phải xây năng lực dài hạn</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

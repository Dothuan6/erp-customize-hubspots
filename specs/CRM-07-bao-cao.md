# CRM-07 — Báo cáo

# Product Requirement Document

| | | | |
|---|---|---|---|
| **Project Owner** | TTS | **Update at** | 02-10-2026 |
| **Created by** | TTS (qua Claude) | **Project** | CRM theo UX HubSpot — HarnexAI ERP |
| **Version** | 2.0 | **Features** | R-01 → R-10 (trang Báo cáo, hai dashboard) |

**CONTENT**

- USER STORIES
- OVERVIEW FLOW
- USE CASE DESCRIPTION
  - UC-1: Mở trang Báo cáo và chọn dashboard
  - UC-2: Dùng các nút ở header dashboard
  - UC-3: Lọc nhanh theo khoảng thời gian và owner
  - UC-4: Lọc nâng cao
  - UC-5: Đọc và thao tác trên một thẻ báo cáo
  - UC-6: Sắp xếp bố cục dashboard
  - UC-7: Xem bản ghi phía sau một con số (drill-down)
  - UC-8: Xem dashboard "Tổng quan dữ liệu CRM"
  - UC-9: Xem dashboard "Tổng quan pipeline"
- BUSINESS RULE
- ACCEPTANCE CRITERIA
- PHỤ LỤC

**VERSION HISTORY**

| **Ver** | **Author** | **Description** | **Updated at** |
|---|---|---|---|
| 2.0 | TTS (qua Claude) | Viết lại theo mẫu PRD: user story, use case, business rule, acceptance criteria. Nội dung giữ như bản 1.2 | 02-10-2026 |
| 1.x | TTS (qua Claude) | Các bản trước 02-10-2026 (1.0 bản đầu, 1.1 sửa theo review, 1.2 sửa vị trí mục Báo cáo trên sidebar) | 01-10-2026 |

---

# USER STORIES

US-RPT-01: Là quản lý kinh doanh, tôi muốn mở mục Báo cáo, chuyển giữa các dashboard và đánh dấu yêu thích để vào nhanh dashboard hay xem. (R-01)

US-RPT-02: Là người dùng, tôi muốn đổi tên dashboard, xuất dữ liệu và sao chép liên kết để dùng số liệu ngoài hệ thống và gửi cho đồng nghiệp. (R-02)

US-RPT-03: Là quản lý kinh doanh, tôi muốn lọc cả dashboard theo khoảng thời gian và theo người phụ trách để xem số liệu của đúng kỳ, đúng người. (R-03)

US-RPT-04: Là quản lý kinh doanh, tôi muốn lọc thêm theo Lifecycle stage và Gói dịch vụ mục tiêu để xem riêng một nhóm contact hoặc deal. (R-04)

US-RPT-05: Là người dùng, tôi muốn mỗi thẻ báo cáo ghi rõ kỳ, kỳ so sánh và bộ lọc đang áp, kèm menu thao tác, để hiểu con số và xử lý tiếp. (R-05)

US-RPT-06: Là người dùng, tôi muốn đổi thứ tự, đổi kích thước, gỡ và thêm lại thẻ để dashboard hợp với cách tôi làm việc. (R-06)

US-RPT-07: Là người dùng, tôi muốn bấm vào một con số để xem danh sách bản ghi tạo nên con số đó và xuất ra CSV. (R-07)

US-RPT-08: Là quản lý kinh doanh, tôi muốn xem dashboard "Tổng quan dữ liệu CRM" để biết contact, deal và hoạt động mới trong kỳ. (R-08)

US-RPT-09: Là quản lý kinh doanh, tôi muốn xem dashboard "Tổng quan pipeline" để biết deal đã tạo, đã đóng, doanh số chốt theo sale và tiến trình qua các giai đoạn. (R-09)

US-RPT-10: Là PO, tôi muốn dashboard không có thẻ nào về Tickets để người dùng không thấy báo cáo của đối tượng ERP chưa có. (R-10)

# OVERVIEW FLOW

| **Bước** | **Tác nhân** | **Mô tả** |
|---|---|---|
| 1 | Người dùng | Bấm "Báo cáo" trên sidebar. |
| 2 | Hệ thống | Mở dashboard xem gần nhất, gồm header, thanh bộ lọc và lưới thẻ. |
| 3 | FE | Gửi truy vấn của từng thẻ với bộ lọc mặc định của dashboard. |
| 4 | Máy chủ | Tổng hợp số liệu trên các bản ghi người xem đọc được và trả về cho từng thẻ. |
| 5 | Người dùng | Đổi khoảng thời gian, owner hoặc bộ lọc nâng cao. |
| 6 | Hệ thống | Ghi bộ lọc lên URL, chờ 500 ms rồi tải lại mọi thẻ. |
| 7 | Người dùng | Bấm một con số, cột, lát hoặc thanh trên thẻ. |
| 8 | Hệ thống | Mở panel phải liệt kê các bản ghi tạo nên con số đó, cho xuất CSV. |
| 9 | Người dùng | Khi cần: chuyển dashboard, đổi tên, kéo thả thẻ, đổi kích thước, gỡ thẻ, xuất dữ liệu, sao chép liên kết. |
| 10 | Hệ thống | Lưu tên, bố cục, yêu thích theo từng người dùng. Bộ lọc không lưu. |

# USE CASE DESCRIPTION

## UC-1: Mở trang Báo cáo và chọn dashboard (R-01)

| | |
|---|---|
| **Actor** | Người đọc được ít nhất một trong Contacts, Deals, Activities |
| **Trigger** | Bấm mục "Báo cáo" trên sidebar, hoặc bấm nút tiêu đề dashboard |
| **Pre-condition** | Không có |
| **Main Flow** | 1. Người dùng bấm "Báo cáo" trên sidebar.<br>2. Hệ thống mở dashboard người dùng xem gần nhất tại `/reports/<dashboardId>`.<br>3. FE gọi `POST /dashboards/:id/viewed` để ghi lượt xem.<br>4. Hệ thống hiện trang gồm header dashboard, thanh bộ lọc và lưới thẻ.<br>5. Người dùng bấm nút tiêu đề, ví dụ "Tổng quan dữ liệu CRM ▾".<br>6. Hệ thống mở popover rộng 420 px gồm ô tìm theo tên, bốn tab "Tất cả", "Xem gần đây", "Yêu thích", "Của tôi" và danh sách dashboard.<br>7. Mỗi dòng có ☆, tên dashboard và một dòng nhỏ: "Xem lần cuối {dd/mm/yyyy HH:mm}" ở tab Xem gần đây, số thẻ ở các tab khác.<br>8. Người dùng bấm ☆ để thêm hoặc bỏ yêu thích. Popover không đóng.<br>9. Người dùng chọn một dashboard.<br>10. Hệ thống chuyển sang dashboard đó, giữ bộ lọc Owner và bộ lọc nâng cao nếu dashboard mới có các bộ lọc đó, đặt lại khoảng thời gian về mặc định của dashboard mới. |
| **Post-condition** | Dashboard vừa mở đứng đầu tab "Xem gần đây". Dấu yêu thích được lưu theo người dùng. |
| **Exception Flow** | 1a. Người dùng không đọc được Contacts, Deals và Activities → không thấy mục "Báo cáo".<br>2a. Chưa xem dashboard nào → mở "Tổng quan dữ liệu CRM".<br>6a. Tab "Của tôi" luôn rỗng trong giai đoạn này → "Chưa hỗ trợ tạo dashboard riêng."<br>6b. Tab "Yêu thích" rỗng → "Bấm ☆ cạnh tên dashboard để thêm vào Yêu thích." |

## UC-2: Dùng các nút ở header dashboard (R-02)

| | |
|---|---|
| **Actor** | Người mở được dashboard |
| **Trigger** | Bấm ☆, "Thao tác ▾", "Chia sẻ ▾" hoặc "Thêm nội dung ▾" ở header |
| **Pre-condition** | Đang ở một dashboard |
| **Main Flow** | 1. Hệ thống hiện header từ trái sang phải: ☆ yêu thích, nút tiêu đề (UC-1), bên phải ba nút "Thao tác ▾", "Chia sẻ ▾", "Thêm nội dung ▾".<br>2. Đổi tên: người dùng chọn "Thao tác ▾ → Đổi tên dashboard".<br>2.1. Hệ thống hiện ô sửa tên tại chỗ trên tiêu đề. Enter lưu, Esc huỷ.<br>2.2. Hệ thống lưu tên mới cho riêng người đổi.<br>3. Xuất dữ liệu: người dùng chọn "Thao tác ▾ → Xuất dữ liệu (tệp ZIP)".<br>3.1. Nút xoay, hệ thống hiện toast "Đang chuẩn bị tệp…".<br>3.2. Máy chủ tạo tệp với bộ lọc đang áp. Trình duyệt tải `{tên dashboard}-{dd-mm-yyyy}.zip`, mỗi thẻ một tệp CSV số liệu tổng hợp.<br>4. Khôi phục: người dùng chọn "Thao tác ▾ → Khôi phục bố cục mặc định".<br>4.1. Hệ thống hỏi "Đưa dashboard về tên, thứ tự, kích thước và các thẻ mặc định?".<br>4.2. Người dùng đồng ý. FE gọi `DELETE my-state`.<br>5. Chia sẻ: người dùng chọn "Chia sẻ ▾ → Sao chép liên kết".<br>5.1. Hệ thống chép URL hiện tại (có bộ lọc) vào bộ nhớ tạm và hiện toast "Đã sao chép liên kết".<br>6. Thêm lại thẻ: người dùng mở "Thêm nội dung ▾" và bấm "Thêm" ở một thẻ đã gỡ.<br>6.1. Hệ thống đưa thẻ về cuối dashboard với kích thước mặc định. |
| **Post-condition** | Tên, bố cục, yêu thích chỉ đổi với chính người dùng. Người nhận liên kết thấy cùng bộ lọc, với quyền xem dữ liệu của họ. |
| **Exception Flow** | 2.1a. Tên để trống → "Nhập tên dashboard".<br>3.2a. Có thẻ bị bỏ qua khi xuất → toast "Đã xuất. {n} thẻ không xuất được, xem ghi-chu.txt trong tệp".<br>6a. Không có thẻ đã gỡ → "Mọi báo cáo đều đang hiện". |

## UC-3: Lọc nhanh theo khoảng thời gian và owner (R-03)

| | |
|---|---|
| **Actor** | Người mở được dashboard |
| **Trigger** | Bấm "Khoảng thời gian ▾", "Owner ▾" (hoặc "Sale phụ trách ▾"), hoặc biểu tượng ↻ ở hàng bộ lọc |
| **Pre-condition** | Đang ở một dashboard |
| **Main Flow** | 1. Hệ thống hiện hàng bộ lọc dưới header với khoảng thời gian mặc định của dashboard (BR-03).<br>2. Người dùng bấm "Khoảng thời gian ▾".<br>3. Hệ thống mở popover liệt kê 14 mốc, mỗi mốc kèm khoảng ngày thật (ví dụ "01/10 – 31/10"), cuối cùng là "Tuỳ chọn…".<br>4. Người dùng chọn một mốc. Hoặc chọn "Tuỳ chọn…", nhập hai ô Từ – Đến và bấm "Áp dụng".<br>5. Nút hiện mốc đã chọn, ví dụ "Khoảng thời gian: Cả tháng này". Rê chuột hiện "01/10/2026 – 31/10/2026".<br>6. Người dùng bấm "Owner ▾" (ở "Tổng quan pipeline" là "Sale phụ trách ▾").<br>7. Hệ thống mở popover chọn nhiều nhân viên: ô tìm, mục "(Chưa có owner)", ba nhóm Đang làm việc, Tạm nghỉ, Đã nghỉ.<br>8. Người dùng tick một hoặc nhiều người.<br>9. Hệ thống ghi bộ lọc lên URL, chờ 500 ms sau lần đổi cuối rồi tải lại mọi thẻ. Mỗi thẻ có trạng thái tải riêng.<br>10. Người dùng bấm ↻ cuối hàng để tải lại mọi thẻ, bỏ qua bộ nhớ đệm. Cạnh nút ghi "Số liệu tính lúc {HH:mm}". |
| **Post-condition** | Mọi thẻ hiện số liệu theo bộ lọc mới. Bấm Back của trình duyệt quay về bộ lọc trước. Bộ lọc không lưu theo người dùng. |
| **Exception Flow** | 4a. Khoảng tuỳ chọn quá 3 năm → báo "Khoảng thời gian tối đa 3 năm" dưới hai ô, không gửi truy vấn.<br>8a. Chọn 1–2 người → nút hiện tên. Chọn nhiều hơn → nút hiện "{n} người".<br>10a. Bấm ↻ lần nữa trong 10 giây → nút đang vô hiệu, không gửi yêu cầu làm mới. |

## UC-4: Lọc nâng cao (R-04)

| | |
|---|---|
| **Actor** | Người mở được dashboard |
| **Trigger** | Bấm nút "Bộ lọc nâng cao ({n})" ở hàng bộ lọc |
| **Pre-condition** | Đang ở một dashboard |
| **Main Flow** | 1. Hệ thống mở panel phải rộng 460 px.<br>2. Hệ thống hiện hai bộ lọc dạng checkbox: "Lifecycle stage" và "Gói dịch vụ mục tiêu".<br>3. Người dùng tick các giá trị cần lọc.<br>4. Người dùng bấm "Áp dụng".<br>5. Hệ thống đóng panel và tải lại các thẻ có nguồn tương ứng. Thẻ chịu bộ lọc hiện chip "Bộ lọc ({n})". |
| **Post-condition** | Nút ghi "Bộ lọc nâng cao ({n})", `n` là số bộ lọc đang có giá trị. Bộ lọc nằm trên URL. |
| **Exception Flow** | 4a. Bấm "Xoá tất cả" → bỏ mọi giá trị đã tick.<br>4b. Bấm "Huỷ" → đóng panel, không đổi bộ lọc.<br>5a. Thẻ không chịu bộ lọc nâng cao nào (thẻ hoạt động) → số liệu không đổi, không hiện chip "Bộ lọc" cho bộ lọc đó. |

## UC-5: Đọc và thao tác trên một thẻ báo cáo (R-05)

| | |
|---|---|
| **Actor** | Người mở được dashboard |
| **Trigger** | Xem một thẻ, rê chuột lên thẻ, bấm tiêu đề hoặc mở menu ⋮ của thẻ |
| **Pre-condition** | Dashboard đã mở |
| **Main Flow** | 1. Hệ thống hiện header thẻ: tiêu đề, biểu tượng ⓘ và hàng chip.<br>2. Hàng chip gồm chip khoảng thời gian (ví dụ "Cả tháng này"), chip so sánh ở thẻ có so sánh (ví dụ "So với: tháng trước"), chip "Bộ lọc ({n})" khi có Owner hoặc bộ lọc nâng cao áp vào thẻ.<br>3. Hệ thống hiện thân thẻ theo kiểu biểu đồ: số, cột đứng, đường, tròn, thanh ngang hoặc bảng (Phụ lục A).<br>4. Người dùng rê chuột lên ⓘ để đọc mô tả phép tính, lên chip để xem ngày cụ thể hoặc danh sách bộ lọc.<br>5. Người dùng bấm tiêu đề thẻ. Hệ thống mở danh sách Contacts hoặc Deals với bộ lọc đã áp.<br>6. Người dùng rê chuột lên thẻ. Hệ thống hiện ở góc phải: tay nắm kéo ⋮⋮, nút ↻ làm mới riêng thẻ, nút ⋮ mở menu.<br>7. Người dùng mở menu ⋮ và chọn một mục: "Đi tới {Contacts / Deals}", "Xem bản ghi", "Đổi tên", "Xuất dữ liệu chi tiết (CSV)", "Di chuyển lên trước", "Di chuyển ra sau", "Gỡ khỏi dashboard" (Phụ lục A).<br>8. Với "Đổi tên": người dùng sửa tiêu đề tại chỗ, hệ thống lưu cho riêng người dùng.<br>9. Với "Gỡ khỏi dashboard": hệ thống gỡ ngay và hiện toast "Đã gỡ “{tên}”" kèm nút "Hoàn tác" trong 5 giây. |
| **Post-condition** | Tên thẻ, việc gỡ thẻ được lưu theo người dùng. Thẻ đã gỡ thêm lại được bằng "Thêm nội dung ▾" (UC-2). |
| **Exception Flow** | 5a. Thẻ không có danh sách đích (thẻ hoạt động) → tiêu đề là chữ thường, menu không có mục "Đi tới…".<br>7a. Không có `record.export` trên nguồn của thẻ → không có mục "Xuất dữ liệu chi tiết (CSV)".<br>7b. Thẻ đầu không có "Di chuyển lên trước"; thẻ cuối không có "Di chuyển ra sau".<br>8a. Tên để trống → về tên mặc định.<br>9a. Bấm "Hoàn tác" → thẻ trở lại đúng vị trí cũ.<br>3a. Đang tải, không có dữ liệu, lỗi, quá thời gian, quá giới hạn tần suất, không có quyền → thẻ hiện trạng thái theo Phụ lục A. Các thẻ khác vẫn bình thường. |

## UC-6: Sắp xếp bố cục dashboard (R-06)

| | |
|---|---|
| **Actor** | Người mở được dashboard |
| **Trigger** | Kéo tay nắm ⋮⋮ của thẻ, bấm nút đổi kích thước ở góc dưới phải thẻ, hoặc gỡ / thêm lại thẻ |
| **Pre-condition** | Dashboard đã mở |
| **Main Flow** | 1. Người dùng kéo tay nắm ⋮⋮ của một thẻ.<br>2. Hệ thống hiện chỗ thả có viền đứt trong lúc kéo.<br>3. Người dùng thả thẻ. Hệ thống đổi thứ tự.<br>4. Người dùng bấm nút đổi kích thước. Thẻ đổi vòng 1 → 2 → 3 → 1 cột. Tooltip của nút: "Đổi kích thước (đang {n} cột)".<br>5. FE gộp các lần đổi trong 1 giây thành một lần gửi và lưu vào `my-state` của người dùng. |
| **Post-condition** | Bố cục mới được nhớ theo người dùng, tải lại trang vẫn giữ. Truy vấn của các thẻ không chạy lại. |
| **Exception Flow** | 1a. Dùng bàn phím → đổi thứ tự bằng mục "Di chuyển lên trước / Di chuyển ra sau" trong menu ⋮ (UC-5).<br>5a. Lỗi lưu → toast "Chưa lưu được bố cục", bố cục trên màn hình giữ nguyên. |

## UC-7: Xem bản ghi phía sau một con số (R-07)

| | |
|---|---|
| **Actor** | Người đọc được collection nguồn của thẻ |
| **Trigger** | Bấm con số KPI, cột, điểm, lát, thanh, ô bảng, hoặc mục "Xem bản ghi" trong menu ⋮ |
| **Pre-condition** | Thẻ đã tải xong số liệu |
| **Main Flow** | 1. Hệ thống mở panel phải rộng 640 px, có scrim.<br>2. Tiêu đề panel là "{tiêu đề thẻ} · {nhãn nhóm}", ví dụ "Nguồn contact · Website". Dòng phụ là "{n} bản ghi · {khoảng thời gian}".<br>3. Hệ thống hiện bảng với các cột theo nguồn, 50 dòng một lần.<br>4. Người dùng bấm tên bản ghi ở cột đầu để mở trang chi tiết trong tab hiện tại. Ctrl/⌘ + bấm mở tab mới.<br>5. Người dùng bấm tiêu đề cột để sắp xếp.<br>6. Người dùng bấm "Xem thêm" ở cuối để tải 50 dòng tiếp.<br>7. Người dùng bấm "Xuất CSV" ở header panel. Trình duyệt tải tệp các bản ghi đó. |
| **Post-condition** | Không thay đổi dữ liệu. Lượt xuất được máy chủ ghi nhật ký. |
| **Exception Flow** | 1a. Mã drill hết hạn (`410`) → FE chạy lại truy vấn của thẻ rồi mở lại danh sách, người dùng không phải làm gì.<br>2a. Số bản ghi trong panel khác con số trên thẻ → panel ghi chữ nhỏ "Số liệu đã thay đổi kể từ lúc tính thẻ."<br>7a. Không có `record.export` → không có nút "Xuất CSV".<br>7b. Quá 50.000 dòng → "Danh sách quá lớn để xuất. Thu hẹp bộ lọc rồi thử lại." |

## UC-8: Xem dashboard "Tổng quan dữ liệu CRM" (R-08, R-10)

| | |
|---|---|
| **Actor** | Người đọc được ít nhất một trong Contacts, Deals, hoạt động |
| **Trigger** | Mở dashboard "Tổng quan dữ liệu CRM" |
| **Pre-condition** | Không có |
| **Main Flow** | 1. Hệ thống đặt bộ lọc mặc định: "Khoảng thời gian: Cả tháng này", Owner không chọn ai.<br>2. Hệ thống hiện bảy thẻ theo thứ tự mặc định (định nghĩa ở Phụ lục A): "Contacts mới tạo", "Nguồn contact", "Contacts thêm theo thời gian", "Deals tạo theo thời gian", "Deals theo giai đoạn", "Phân loại hoạt động", "Tổng hợp hoạt động theo nhóm".<br>3. Thẻ "Contacts mới tạo" hiện số contact tạo trong kỳ và dòng so sánh với kỳ liền trước.<br>4. Ba thẻ contact tính theo ngày tạo contact (BR-11). Hai thẻ deal tính theo ngày tạo deal.<br>5. Hai thẻ hoạt động chỉ đếm việc đã diễn ra (BR-12).<br>6. Người dùng lọc, đọc thẻ và xem bản ghi theo UC-3, UC-4, UC-5, UC-7. |
| **Post-condition** | Không thay đổi dữ liệu. |
| **Exception Flow** | 2a. Thẻ Tickets của HubSpot ("Open ticket summary", "Ticket status breakdown") → không có trên dashboard và không có trong "Thêm nội dung ▾" (BR-01).<br>2b. Người dùng không đọc được nguồn của một thẻ → thẻ đó hiện "Bạn chưa có quyền xem dữ liệu {Contacts / Deals / hoạt động}.", vẫn giữ chỗ trong bố cục. |

## UC-9: Xem dashboard "Tổng quan pipeline" (R-09)

| | |
|---|---|
| **Actor** | Người đọc được Deals |
| **Trigger** | Chọn "Tổng quan pipeline" trong bộ chọn dashboard, hoặc bấm nút "Báo cáo" ở trang chi tiết sale (CRM-08) |
| **Pre-condition** | Không có |
| **Main Flow** | 1. Hệ thống đặt bộ lọc mặc định: "Khoảng thời gian: Cả quý này", Sale phụ trách không chọn ai.<br>2. Hệ thống hiện sáu thẻ theo thứ tự mặc định (định nghĩa ở Phụ lục A): "Deals đã tạo", "Deals đã đóng", "Deals theo trạng thái", "Hiệu quả sale theo giá trị chốt", "Tiến trình deal qua các giai đoạn", "Thời gian chốt trung bình".<br>3. Thẻ "Deals đã tạo" và "Deals đã đóng" hiện con số và dòng so sánh với kỳ liền trước.<br>4. Thẻ "Deals đã đóng", "Hiệu quả sale theo giá trị chốt", "Thời gian chốt trung bình" tính theo ngày đóng thật của deal (BR-13).<br>5. Thẻ "Tiến trình deal qua các giai đoạn" hiện số deal đã từng tới từng giai đoạn từ 1 đến 5, kèm dòng tỷ lệ chuyển từ giai đoạn 1 sang Closed Won.<br>6. Người dùng lọc, đọc thẻ và xem bản ghi theo UC-3, UC-4, UC-5, UC-7. |
| **Post-condition** | Không thay đổi dữ liệu. |
| **Exception Flow** | 4a. Deal đã đóng nhưng không có ngày đóng → không vào ba thẻ ở bước 4.<br>5a. Có deal tạo trước khi có lịch sử giai đoạn → thẻ ghi thêm chữ nhỏ "{n} deal tạo trước khi có lịch sử giai đoạn được tính theo giai đoạn hiện tại."<br>4b. Thẻ "Thời gian chốt trung bình" có mốc không có deal thắng → không vẽ điểm ở mốc đó, đường nối qua. |

# BUSINESS RULE

| **BR** | **Mô tả** |
|---|---|
| BR-01 | **Dashboard có sẵn, vị trí và URL**<br>- Có hai dashboard: "Tổng quan dữ liệu CRM" (7 thẻ) và "Tổng quan pipeline" (6 thẻ). Không tạo được dashboard mới trong giai đoạn này.<br>- Mục "Báo cáo" nằm trên sidebar, ở nhóm menu ERP dưới vạch ngăn, sau Media.<br>- Mục "Báo cáo" chỉ hiện với người đọc được ít nhất một trong Contacts, Deals, Activities.<br>- URL: `/reports/<dashboardId>?range=month&owners=emp_07,emp_12&lifecycle=Lead&goi=PROFESSIONAL`. `range` là mã mốc hoặc `custom:2026-09-01:2026-09-30`.<br>- Bố cục trang theo template T3 của design system: header dashboard, thanh bộ lọc, lưới thẻ.<br>- ERP chưa có đối tượng Ticket. Không có thẻ hay dashboard nào về Tickets (R-10).<br>- Các nút "Explore reports", "Create dashboard", ⚙ của HubSpot không hiện. |
| BR-02 | **Trạng thái riêng của từng người dùng**<br>- Tên dashboard, tên thẻ, thứ tự, kích thước, thẻ đã gỡ, yêu thích, xem gần đây lưu theo từng người dùng. Người khác không bị ảnh hưởng.<br>- "Khôi phục bố cục mặc định" đưa tên, thứ tự, kích thước, các thẻ về mặc định. Dấu ☆ yêu thích giữ nguyên.<br>- Bộ lọc không lưu theo người dùng. Mở lại dashboard không có tham số URL thì về mặc định.<br>- Bộ lọc nằm trên URL để chia sẻ. Back của trình duyệt quay về bộ lọc trước. |
| BR-03 | **Khoảng thời gian**<br>- Mặc định: "Cả tháng này" ở "Tổng quan dữ liệu CRM", "Cả quý này" ở "Tổng quan pipeline".<br>- Popover liệt kê 14 mốc theo đúng thứ tự bảng mốc thời gian của F14-S1, cuối cùng là "Tuỳ chọn…".<br>- Khoảng tuỳ chọn tối đa 3 năm.<br>- Chuyển dashboard thì khoảng thời gian về mặc định của dashboard mới. |
| BR-04 | **Bộ lọc Owner / Sale phụ trách**<br>- Popover giống popover owner của danh sách (CRM-01, phần bộ lọc nhanh): ô tìm, mục "(Chưa có owner)", chỉ nhân viên `is_sales`, ba nhóm Đang làm việc, Tạm nghỉ, Đã nghỉ.<br>- Thẻ contact, deal lọc theo `owner_id`. Thẻ hoạt động lọc theo `$actor` (người thực hiện). Chi tiết từng thẻ ở cột "Owner áp vào", Phụ lục A.<br>- Khi không chọn ai, thẻ hoạt động đếm cả hoạt động của nhân viên không thuộc đội kinh doanh (ví dụ kế toán ghi chú trên contact). Popover chỉ có nhân viên `is_sales` nên không lọc riêng được những người này (câu hỏi Q6).<br>- Chuyển dashboard thì giữ bộ lọc Owner. |
| BR-05 | **Bộ lọc nâng cao**<br>- "Lifecycle stage" áp vào thẻ có nguồn Contacts. Giá trị: checkbox các giá trị D-LIFECYCLE.<br>- "Gói dịch vụ mục tiêu" áp vào thẻ có nguồn Deals. Giá trị: checkbox các giá trị của `g_i_d_ch_v_m_c_ti_u`.<br>- Thẻ hoạt động không chịu bộ lọc nâng cao nào.<br>- Ba nút "Áp dụng", "Xoá tất cả", "Huỷ" như bộ lọc nâng cao của danh sách (CRM-01, phần bộ lọc nâng cao).<br>- Chuyển dashboard thì giữ bộ lọc nâng cao nếu dashboard mới có bộ lọc đó. |
| BR-06 | **Tải lại và làm mới**<br>- Đổi bộ lọc: FE chờ 500 ms sau lần đổi cuối rồi tải lại mọi thẻ. Đổi liền nhiều bộ lọc chỉ tải một lần.<br>- Thẻ dùng bộ nhớ đệm 60 giây.<br>- Nút ↻ ở hàng bộ lọc tải lại mọi thẻ với `fresh=1` (bỏ qua bộ nhớ đệm). Sau khi bấm, nút vô hiệu tới hết 10 giây.<br>- Chữ "Số liệu tính lúc {HH:mm}" lấy `meta.computedAt` cũ nhất trong các thẻ.<br>- Nút ↻ trên từng thẻ chỉ làm mới thẻ đó.<br>- Gặp `429`, FE không tự gửi lại. |
| BR-07 | **So sánh với kỳ trước**<br>- Chỉ thẻ kiểu Số có so sánh: "Contacts mới tạo", "Deals đã tạo", "Deals đã đóng". Kỳ trước tính theo F14-S1, phần kỳ so sánh.<br>- Chip: "So với: hôm qua" (mốc Hôm nay), "So với: hôm kia" (Hôm qua), "So với: tuần trước", "So với: tháng trước", "So với: quý trước", "So với: năm trước". Với 7/30/90 ngày qua và khoảng tuỳ chọn, chip ghi khoảng ngày của kỳ trước, ví dụ "So với: 18/09 – 24/09".<br>- Rê chuột lên chip luôn hiện khoảng ngày cụ thể của kỳ trước.<br>- Dòng so sánh: "▲ 29% so với tháng trước (21)" màu thành công, "▼ …" màu lỗi, "Không đổi so với tháng trước" khi bằng. Tên kỳ giống chip; với 7/30/90 ngày và tuỳ chọn ghi "so với kỳ trước".<br>- Kỳ trước bằng 0: ghi "Kỳ trước ({khoảng ngày}): 0", ví dụ "Kỳ trước (01/08 – 31/08): 0", không tính phần trăm.<br>- Mốc "Mọi thời gian": không có chip so sánh, không có dòng so sánh. |
| BR-08 | **Hiển thị thẻ**<br>- Style thẻ theo card báo cáo của design system. Màu biểu đồ theo bảng màu biểu đồ của design system.<br>- Thân thẻ theo kiểu biểu đồ, trạng thái thẻ và menu ⋮ theo các bảng ở Phụ lục A.<br>- Rê chuột lên cột, điểm, lát, thanh hiện tooltip "{nhóm}: {giá trị}".<br>- Mọi biểu đồ có `role="img"` và nhãn là tiêu đề thẻ. Dưới biểu đồ có bảng dữ liệu ẩn cho trình đọc màn hình.<br>- Biểu đồ theo thời gian chia mốc `auto`: theo ngày hoặc theo tháng tuỳ độ dài khoảng thời gian.<br>- Thẻ không có quyền đọc nguồn vẫn giữ chỗ trong bố cục. |
| BR-09 | **Bố cục**<br>- Lưới 3 cột từ 1240 px. 2 cột ở 905–1239 px, thẻ 3 cột chiếm 2. 1 cột dưới 905 px.<br>- Đổi kích thước theo vòng 1 → 2 → 3 → 1 cột.<br>- Thẻ thêm lại nằm cuối dashboard với kích thước mặc định.<br>- Mọi thay đổi lưu ngay vào `my-state` của người dùng, gộp các lần đổi trong 1 giây thành một lần gửi.<br>- Đổi bố cục không chạy lại truy vấn của thẻ. |
| BR-10 | **Drill-down và xuất dữ liệu**<br>- Drill-down mở từ con số KPI, cột, điểm, lát, chú thích, thanh, ô bảng có số khác 0, hoặc "Xem bản ghi" (danh sách của tổng).<br>- 50 dòng một lần. Sắp xếp gửi tham số `sort`.<br>- Xuất CSV tối đa 50.000 dòng.<br>- Xuất cả dashboard: tệp ZIP, mỗi thẻ một tệp CSV số liệu tổng hợp. Thẻ người dùng không có quyền bị bỏ qua.<br>- Con số khớp tuyệt đối với thẻ thì dùng drill-down, không dùng link tiêu đề (BR-14). |
| BR-11 | **Ngày tạo contact**<br>- Ba thẻ contact của "Tổng quan dữ liệu CRM" tính theo `time.field = { "coalesce": ["lead_created_at", "_createdAt"] }`.<br>- Contact chuyển từ Leads tính theo ngày tạo lead gốc. Contact tạo mới tính theo ngày tạo hệ thống.<br>- Lý do: không làm vậy thì toàn bộ lead cũ dồn vào ngày chạy script chuyển đổi và ba thẻ có một cột vọt lên bất thường (câu hỏi Q8). |
| BR-12 | **Hoạt động "đã diễn ra"**<br>- Hai thẻ hoạt động tính theo `$happenedAt` (F14-S1, phần thời điểm hoạt động đã diễn ra).<br>- Đếm: ghi chú, cuộc gọi, cuộc họp đã qua giờ, task đã xong.<br>- Không đếm: cuộc gọi, cuộc họp hẹn trong tương lai; cuộc họp có kết quả Huỷ, Đổi lịch, Không đến; task chưa xong.<br>- Cách tính này khớp với "Ngày hoạt động gần nhất" (F03-S2). |
| BR-13 | **Phép tính của "Tổng quan pipeline"**<br>- Thời điểm đóng là `closed_at`: máy chủ ghi khi deal chuyển vào Won hoặc Lost (CRM-00, trường của Deals). Không dùng Ngày dự kiến chốt.<br>- Script chuyển đổi của CRM-00 điền `closed_at` cho deal đã ở Won/Lost bằng `ng_y_c_p_nh_t_g_n_nh_t` nếu có. Không có thì để trống và deal đó không vào thẻ 2, 4, 6 (câu hỏi Q3).<br>- Trạng thái deal: Thắng = 5. Closed Won, Thua = 6. Closed Lost, còn lại là Đang mở (CRM-00, định nghĩa deal đang mở).<br>- Phễu tính theo lịch sử giai đoạn (F03-S3), không theo giai đoạn hiện tại. Deal thua vẫn được tính ở các giai đoạn đã đi qua. |
| BR-14 | **Link tiêu đề thẻ**<br>- Link mở danh sách Contacts hoặc Deals với bộ lọc Ngày tạo bằng mốc đang chọn và owner. Thẻ 2, 4, 6 của "Tổng quan pipeline" lọc thêm "Ngày đóng" (`closed_at`) trong khoảng đang chọn.<br>- Mốc có trong bộ lọc nhanh của CRM-01 thì truyền theo mã. Quý trước (`lastquarter`), Năm trước (`lastyear`) truyền dạng khoảng tuỳ chọn. Mọi thời gian (`all`) thì không thêm bộ lọc Ngày tạo.<br>- Danh sách Contacts lọc theo Ngày tạo hệ thống, còn thẻ contact tính theo ngày tạo lead gốc (BR-11). Số dòng trong danh sách có thể khác số trên thẻ ở các khoảng trước ngày chuyển đổi. |
| BR-15 | **Quyền**<br>- Thấy menu Báo cáo, mở dashboard: đọc được ít nhất một collection nguồn của dashboard.<br>- Xem số liệu của một thẻ và drill-down: đọc được collection nguồn của thẻ. Số liệu chỉ tính trên bản ghi người xem đọc được.<br>- Xuất CSV (thẻ, drill-down): `record.export` trên collection nguồn.<br>- Xuất dữ liệu cả dashboard: đọc được ít nhất một nguồn.<br>- Đổi tên, bố cục, yêu thích: mọi người mở được dashboard, chỉ ảnh hưởng chính họ. |

# ACCEPTANCE CRITERIA

AC-1: Chọn dashboard, yêu thích, xem gần đây (R-01)

- Đang ở "Tổng quan dữ liệu CRM", mở bộ chọn, bấm ☆ ở "Tổng quan pipeline" → tab Yêu thích có "Tổng quan pipeline".
- Chọn "Tổng quan pipeline" → chuyển dashboard, khoảng thời gian thành "Cả quý này".
- Minh mở "Tổng quan pipeline" lúc 09:00 rồi "Tổng quan dữ liệu CRM" lúc 09:05 → tab Xem gần đây có "Tổng quan dữ liệu CRM" đứng đầu với "Xem lần cuối 01/10/2026 09:05".

AC-2: Header dashboard (R-02)

- Minh đổi tên dashboard thành "Báo cáo của Minh" → Lan mở cùng dashboard vẫn thấy "Tổng quan dữ liệu CRM".
- Đã gỡ thẻ "Nguồn contact", mở "Thêm nội dung ▾", bấm "Thêm" → thẻ trở lại cuối dashboard, kích thước 2 cột.
- Bộ lọc "Quý trước", Owner Minh Trần, chọn "Chia sẻ ▾ → Sao chép liên kết" và gửi cho Lan → Lan mở liên kết thấy đúng hai bộ lọc đó, số liệu theo quyền của Lan.

AC-3: Mặc định và URL của bộ lọc nhanh (R-03)

- Ngày 01/10/2026 mở "Tổng quan dữ liệu CRM" không có tham số URL → "Khoảng thời gian: Cả tháng này", rê chuột hiện "01/10/2026 – 31/10/2026".
- Mở "Tổng quan pipeline" → "Cả quý này" (01/10/2026 – 31/12/2026).
- Mở `/reports/pipeline-overview?range=lastmonth` ngày 01/10/2026 → bộ lọc "Tháng trước" (01/09 – 30/09); thẻ KPI có chip "So với: tháng trước", kỳ so sánh là 01/08 – 31/08.
- Đổi Owner rồi bấm Back → bộ lọc Owner về như trước.

AC-4: Owner chọn nhiều và khoảng tuỳ chọn (R-03)

- Minh Trần có 5 contact, Lan Lê có 3 contact tạo trong tháng; chọn Owner hai người → thẻ "Contacts mới tạo" hiện 8, nút ghi "Owner: Minh Trần, Lan Lê", thẻ "Phân loại hoạt động" chỉ đếm hoạt động của hai người.
- Chọn "Tuỳ chọn…", nhập 01/09/2026 – 15/09/2026, bấm "Áp dụng" → nút ghi "Khoảng thời gian: 01/09/2026 – 15/09/2026"; URL có `range=custom:2026-09-01:2026-09-15`; thẻ "Contacts thêm theo thời gian" chia theo ngày (15 mốc).
- Tuỳ chọn 4 năm → báo "Khoảng thời gian tối đa 3 năm", không gửi truy vấn.
- Bấm ↻ làm mới hai lần trong 5 giây → lần hai không gửi `fresh=1`, nút vô hiệu tới hết 10 giây.

AC-5: Bộ lọc nâng cao chỉ áp vào đúng nguồn (R-04)

- Ở "Tổng quan dữ liệu CRM", chọn Lifecycle stage = Customer → thẻ 1, 2, 3 có chip "Bộ lọc (1)" và số liệu đổi.
- Thẻ 4, 5, 6, 7 không đổi.

AC-6: Chip và dòng so sánh (R-05)

- Tháng 10 có 27 contact mới, tháng 9 có 21 → thẻ "Contacts mới tạo" có chip "So với: tháng trước" và dòng "▲ 29% so với tháng trước (21)".
- Chọn "Mọi thời gian" → thẻ KPI không có dòng so sánh, không có chip "So với".

AC-7: Menu thẻ và gỡ thẻ (R-05)

- Thẻ "Deals đã đóng", người dùng có `record.export` → menu ⋮ có Đi tới Deals · Xem bản ghi · Đổi tên · Xuất dữ liệu chi tiết (CSV) · Di chuyển lên trước · Di chuyển ra sau · Gỡ khỏi dashboard.
- Gỡ thẻ rồi bấm "Hoàn tác" → thẻ trở lại đúng vị trí cũ.
- Bấm tiêu đề "Contacts mới tạo" với "Quý trước" → danh sách Contacts lọc Ngày tạo khoảng 01/07/2026 – 30/09/2026.

AC-8: Trạng thái thẻ, quyền (R-05)

- Lan không đọc được collection hoạt động → thẻ 6, 7 hiện "Bạn chưa có quyền xem dữ liệu hoạt động."; các thẻ khác bình thường.
- Một thẻ trả `504`, các thẻ khác bình thường → chỉ thẻ đó hiện "Báo cáo chạy quá lâu. Thử thu hẹp khoảng thời gian."
- Người không có `record.export` → không có "Xuất dữ liệu chi tiết (CSV)", không có "Xuất CSV" ở drill-down.
- Người không đọc được Contacts, Deals, hoạt động → không thấy menu Báo cáo.

AC-9: Bố cục được nhớ và khôi phục (R-06)

- Kéo thẻ "Deals theo giai đoạn" lên đầu, đổi sang 2 cột, tải lại trang → thẻ vẫn đứng đầu và rộng 2 cột.
- Đã đổi thứ tự, gỡ một thẻ, đổi tên dashboard; chọn "Thao tác ▾ → Khôi phục bố cục mặc định" và xác nhận → dashboard về tên, thứ tự, kích thước và đủ 7 thẻ mặc định; ☆ yêu thích giữ nguyên.
- Lỗi lưu bố cục → toast "Chưa lưu được bố cục", bố cục trên màn hình giữ nguyên.

AC-10: Màn hẹp và bàn phím (R-06)

- Màn 390 px → một cột, thẻ 3 cột chiếm hết bề ngang.
- Màn 1000 px → thẻ 3 cột chiếm 2 cột.
- Đổi thứ tự thẻ chỉ bằng bàn phím làm được qua menu ⋮.
- Trình đọc màn hình đọc được tiêu đề và bảng dữ liệu ẩn của biểu đồ cột.

AC-11: Drill-down (R-07)

- Thẻ "Nguồn contact" có cột Website = 18, bấm cột → panel "Nguồn contact · Website" ghi "18 bản ghi · Cả tháng này", liệt kê 18 contact với các cột Họ và tên, Email, Contact owner, Nguồn, Lifecycle stage, Ngày tạo.
- Bấm "Xuất CSV" → tải tệp 18 dòng.
- Drill 120 bản ghi, bấm "Xem thêm" hai lần → đủ 120, không trùng.
- Drill bằng mã hết hạn → hệ thống tự chạy lại, mở được danh sách.

AC-12: Tổng quan dữ liệu CRM (R-08)

- Mở dashboard → có đúng 7 thẻ theo thứ tự và kiểu biểu đồ ở Phụ lục A; không có thẻ Tickets.
- Trong tháng có 3 cuộc gọi đã ghi, 1 cuộc họp hẹn ngày 20/10, 2 task chưa xong, 1 task đã xong; xem thẻ "Phân loại hoạt động" ngày 01/10/2026 → Cuộc gọi = 3, Cuộc họp = 0, Task = 1.
- Thẻ "Tổng hợp hoạt động theo nhóm", chọn Owner 3 người, 1 người không có hoạt động → dòng người đó toàn 0.

AC-13: Deals đã đóng và thời gian chốt (R-09)

- Deal X có Ngày dự kiến chốt 15/12 nhưng đã chuyển sang Closed Won ngày 01/10/2026 → thẻ "Deals đã đóng" với "Cả quý này" có đếm X.
- Thẻ "Thời gian chốt trung bình" có tháng không có deal thắng → không có điểm ở tháng đó, đường nối qua.

AC-14: Phễu và hiệu quả sale (R-09)

- Trong quý có deal A đi tới "4. Proposal Sent" rồi thua, deal B đang ở "2. Discovery Call", deal C đã thắng → thẻ "Tiến trình deal qua các giai đoạn" có các thanh 3 · 3 · 2 · 2 · 1 và dòng "Tỷ lệ chuyển từ 1. MQL Qualified sang 5. Closed Won: 33%".
- Trong quý Minh Trần thắng 2 deal tổng 610.000.000 ₫, Lan Lê thắng 1 deal 240.000.000 ₫ → thẻ "Hiệu quả sale theo giá trị chốt" có thanh Minh "610 tr ₫" đứng trên thanh Lan "240 tr ₫".
- Bấm thanh Minh → mở 2 deal.

AC-15: Không có Tickets (R-10)

- Ở mọi dashboard, mở "Thêm nội dung ▾" → không có thẻ nào về Tickets.
- Mở bộ chọn dashboard → không có dashboard nào về Tickets.

# PHỤ LỤC

## A. Màn hình và dữ liệu hiển thị

**Bộ lọc nhanh theo dashboard**

| Dashboard | Bộ lọc nhanh | Khoảng thời gian mặc định |
|---|---|---|
| Tổng quan dữ liệu CRM | Khoảng thời gian ▾ · Owner ▾ | Cả tháng này |
| Tổng quan pipeline | Khoảng thời gian ▾ · Sale phụ trách ▾ | Cả quý này |

**Bộ lọc nâng cao**

| Bộ lọc | Áp vào thẻ có nguồn | Giá trị |
|---|---|---|
| Lifecycle stage | Contacts | Checkbox các giá trị D-LIFECYCLE |
| Gói dịch vụ mục tiêu | Deals | Checkbox các giá trị của `g_i_d_ch_v_m_c_ti_u` |

**Nút ở header dashboard**

| Nút | Mục | Hành vi |
|---|---|---|
| Thao tác ▾ | Đổi tên dashboard | Ô sửa tên tại chỗ trên tiêu đề, Enter lưu, Esc huỷ. Tên chỉ đổi với người đổi. Trống thì báo "Nhập tên dashboard" |
| | Xuất dữ liệu (tệp ZIP) | Xuất với bộ lọc đang áp; tải `{tên dashboard}-{dd-mm-yyyy}.zip`, mỗi thẻ một tệp CSV số liệu tổng hợp. Đang tạo tệp: nút xoay, toast "Đang chuẩn bị tệp…". Có thẻ bị bỏ qua: toast "Đã xuất. {n} thẻ không xuất được, xem ghi-chu.txt trong tệp" |
| | Khôi phục bố cục mặc định | Hộp xác nhận "Đưa dashboard về tên, thứ tự, kích thước và các thẻ mặc định?"; gọi `DELETE my-state` |
| Chia sẻ ▾ | Sao chép liên kết | Chép URL hiện tại (có bộ lọc), toast "Đã sao chép liên kết". Dưới mục có chữ nhỏ "Người nhận thấy cùng bộ lọc, với quyền xem dữ liệu của họ" |
| Thêm nội dung ▾ | Danh sách thẻ đã gỡ | Mỗi thẻ một dòng có nút "Thêm"; thêm thì thẻ trở lại cuối dashboard với kích thước mặc định. Không có thẻ đã gỡ: "Mọi báo cáo đều đang hiện" |

**Menu ⋮ của thẻ**

| Mục | Hiện khi | Hành vi |
|---|---|---|
| Đi tới {Contacts / Deals} | Thẻ có danh sách đích | Như bấm tiêu đề |
| Xem bản ghi | Luôn | Mở drill-down của tổng |
| Đổi tên | Luôn | Sửa tiêu đề tại chỗ; lưu vào `cardTitles` của người dùng. Trống thì về tên mặc định |
| Xuất dữ liệu chi tiết (CSV) | Có `record.export` trên nguồn | Xuất bản ghi của tổng |
| Di chuyển lên trước / Di chuyển ra sau | Không phải thẻ đầu / cuối | Đổi chỗ với thẻ bên cạnh (thay cho kéo thả khi dùng bàn phím) |
| vạch ngăn | | |
| Gỡ khỏi dashboard | Luôn | Gỡ ngay, toast "Đã gỡ “{tên}”" kèm nút "Hoàn tác" 5 giây. Thêm lại bằng "Thêm nội dung ▾" |

**Thân thẻ theo kiểu biểu đồ**

| Kiểu | Hiển thị |
|---|---|
| Số (KPI) | Nhãn nhỏ chữ hoa ("SỐ LƯỢNG CONTACTS"), con số lớn là nút mở drill-down, dòng so sánh theo BR-07 |
| Cột đứng | Mỗi nhóm một cột, nhãn giá trị trên đầu cột, trục y 3 vạch; bấm cột mở drill-down nhóm đó |
| Đường | Điểm theo mốc thời gian, nhãn giá trị trên điểm; bấm điểm mở drill-down mốc đó |
| Tròn (donut) | Lát theo nhóm, tổng ở giữa kèm đơn vị; chú thích dưới có số và phần trăm, bấm lát hoặc chú thích mở drill-down |
| Thanh ngang | Mỗi nhóm một thanh, nhãn trái, giá trị phải; bấm thanh mở drill-down |
| Bảng | Như mô tả ở thẻ; ô số khác 0 là nút mở drill-down |

**Trạng thái thẻ**

| Trạng thái | Hiển thị |
|---|---|
| Đang tải | Skeleton theo kiểu biểu đồ |
| Không có dữ liệu | Biểu tượng và "Không có dữ liệu trong khoảng thời gian này" |
| Lỗi | "Không tải được báo cáo." và nút "Thử lại" |
| Quá thời gian (`504`) | "Báo cáo chạy quá lâu. Thử thu hẹp khoảng thời gian." và "Thử lại" |
| Quá giới hạn tần suất (`429`) | "Bạn đang tải báo cáo quá nhanh. Thử lại sau ít phút." và "Thử lại". FE không tự gửi lại |
| Không có quyền đọc nguồn | "Bạn chưa có quyền xem dữ liệu {Contacts / Deals / hoạt động}." Thẻ vẫn giữ chỗ trong bố cục |

**Định nghĩa 7 thẻ của "Tổng quan dữ liệu CRM"** (theo thứ tự mặc định)

| # | Thẻ (id) | Kích thước | Kiểu | Nguồn · phép đo | Trường thời gian · nhóm | So sánh | Owner áp vào | Nâng cao | Link tiêu đề | Mô tả ⓘ |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Contacts mới tạo (`newc`) | 1 | Số | Contacts · đếm | Ngày tạo contact¹ trong khoảng | Có | `owner_id` | Lifecycle | Contacts, lọc Ngày tạo + owner | "Số contact được tạo trong khoảng thời gian, so với kỳ liền trước." |
| 2 | Nguồn contact (`src`) | 2 | Cột đứng | Contacts · đếm | Ngày tạo contact¹ trong khoảng · nhóm `source` (D-SOURCE, có "(Trống)") | Không | `owner_id` | Lifecycle | Contacts, lọc Ngày tạo + owner | "Contact tạo trong khoảng thời gian, chia theo Nguồn." |
| 3 | Contacts thêm theo thời gian (`cover`) | 1 | Đường | Contacts · đếm | Ngày tạo contact¹ · mốc `auto` | Không | `owner_id` | Lifecycle | Contacts, lọc Ngày tạo + owner | "Số contact tạo mới theo ngày hoặc theo tháng, tuỳ độ dài khoảng thời gian." |
| 4 | Deals tạo theo thời gian (`dover`) | 2 | Đường | Deals · đếm | `_createdAt` · mốc `auto` | Không | `owner_id` | Gói dịch vụ | Deals, lọc Ngày tạo + sale | "Số deal tạo mới theo ngày hoặc theo tháng, tuỳ độ dài khoảng thời gian." |
| 5 | Deals theo giai đoạn (`stage`) | 1 | Tròn | Deals · đếm | `_createdAt` trong khoảng · nhóm giai đoạn hiện tại (D-STAGE) | Không | `owner_id` | Gói dịch vụ | Deals, lọc Ngày tạo + sale | "Deal tạo trong khoảng thời gian, chia theo giai đoạn hiện tại." |
| 6 | Phân loại hoạt động (`atype`) | 1 | Thanh ngang | Hoạt động · đếm | `$happenedAt` trong khoảng · nhóm `$type` (Ghi chú, Task, Cuộc họp, Cuộc gọi) | Không | `$actor` | — | Không có | "Hoạt động đã diễn ra trong khoảng thời gian: ghi chú, cuộc gọi, cuộc họp đã qua giờ, task đã xong." |
| 7 | Tổng hợp hoạt động theo nhóm (`team`) | 2 | Bảng | Hoạt động · đếm | `$happenedAt` trong khoảng · nhóm `$actor` × `$type` | Không | `$actor` | — | Không có | "Số hoạt động đã diễn ra của từng người, theo loại." |

¹ Ngày tạo contact gửi lên là `time.field = { "coalesce": ["lead_created_at", "_createdAt"] }` (BR-11).

Ghi chú từng thẻ:

- Thẻ 5 dùng 6 màu đầu của bảng màu phân loại trong design system, theo thứ tự D-STAGE.
- Thẻ 7: mỗi dòng là một nhân viên; các cột Ghi chú · Task · Cuộc họp · Cuộc gọi · Tổng; sắp theo Tổng giảm dần.
- Thẻ 7 khi có bộ lọc Owner: FE gửi các id đó vào `include` của nhóm `$actor`, để hiện đúng những người được chọn kể cả khi bằng 0. Không có bộ lọc Owner thì chỉ hiện người có ít nhất một hoạt động.
- Thẻ 7 có dòng "(Không xác định)" cho hoạt động của tài khoản không gắn nhân viên.
- Thẻ Tickets của HubSpot bị bỏ (R-10).

**Định nghĩa 6 thẻ của "Tổng quan pipeline"** (theo thứ tự mặc định)

| # | Thẻ (id) | Kích thước | Kiểu | Nguồn · phép đo | Trường thời gian · nhóm | So sánh | Owner áp vào | Nâng cao | Link tiêu đề | Mô tả ⓘ |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Deals đã tạo (`dcr`) | 1 | Số | Deals · đếm | `_createdAt` trong khoảng | Có | `owner_id` | Gói dịch vụ | Deals, lọc Ngày tạo + sale | "Số deal được tạo trong khoảng thời gian, so với kỳ liền trước." |
| 2 | Deals đã đóng (`dcl`) | 1 | Số | Deals · đếm, giai đoạn là 5. Closed Won hoặc 6. Closed Lost | `closed_at` trong khoảng | Có | `owner_id` | Gói dịch vụ | Deals, lọc giai đoạn Won/Lost + Ngày đóng + sale | "Số deal chuyển sang Closed Won hoặc Closed Lost trong khoảng thời gian, so với kỳ liền trước." |
| 3 | Deals theo trạng thái (`dst`) | 1 | Tròn | Deals · đếm | `_createdAt` trong khoảng · nhóm `giai_o_n_pipeline` gộp ba nhóm bằng `buckets`: Đang mở / Thắng / Thua | Không | `owner_id` | Gói dịch vụ | Deals, lọc Ngày tạo + sale | "Deal tạo trong khoảng thời gian: đang mở, đã thắng, đã thua." |
| 4 | Hiệu quả sale theo giá trị chốt (`perf`) | 2 | Thanh ngang | Deals · tổng Amount (`t_ng_cash_in_d_ki_n`), giai đoạn 5. Closed Won | `closed_at` trong khoảng · nhóm `owner_id` | Không | `owner_id` | Gói dịch vụ | Deals, lọc Won + Ngày đóng + sale | "Tổng Cash-In Dự Kiến của deal Closed Won, theo ngày đóng, chia theo Sale phụ trách." |
| 5 | Tiến trình deal qua các giai đoạn (`fun`) | 2 | Thanh ngang | Báo cáo có tên `stage_funnel` (F14-S1), giai đoạn 1 → 5 | `_createdAt` trong khoảng | Không | `owner_id` | Gói dịch vụ | Deals, lọc Ngày tạo + sale | "Số deal tạo trong khoảng thời gian đã từng tới hoặc vượt qua từng giai đoạn. Deal thua vẫn được tính ở các giai đoạn đã đi qua." |
| 6 | Thời gian chốt trung bình (`ttc`) | 1 | Đường | Deals · `avg_days` từ `_createdAt` tới `closed_at`, giai đoạn 5. Closed Won | `closed_at` · mốc `auto` | Không | `owner_id` | Gói dịch vụ | Deals, lọc Won + Ngày đóng + sale | "Số ngày trung bình từ lúc tạo deal tới lúc deal chuyển sang Closed Won, theo tháng đóng." |

Ghi chú từng thẻ:

- Thẻ 3: màu theo màu trạng thái của design system.
- Thẻ 4: sắp theo giá trị giảm dần; giá trị dạng rút gọn "610 tr ₫", "1,2 tỷ ₫"; tooltip có số đầy đủ. Deal không có sale phụ trách ở dòng "(Trống)".
- Thẻ 5: dưới biểu đồ có dòng "Tỷ lệ chuyển từ 1. MQL Qualified sang 5. Closed Won: {conversion}%". Khi `meta.approximated` lớn hơn 0 thì thêm chữ nhỏ "{n} deal tạo trước khi có lịch sử giai đoạn được tính theo giai đoạn hiện tại."
- Thẻ 6: giá trị hiển thị "{x} ngày" (một chữ số thập phân, dấu phẩy). Mốc không có deal thắng thì không vẽ điểm (không phải 0) và đường nối qua.
- Link tiêu đề của thẻ 2, 4, 6 lọc thêm "Ngày đóng" (`closed_at`) trong khoảng đang chọn, để danh sách Deals ra đúng các deal của thẻ.

## B. Dữ liệu

Spec này không thêm collection hay trường mới. Các trường dùng trong phép tính (đặc tả ở CRM-00):

| Nguồn | Key | Dùng cho |
|---|---|---|
| Contacts | `owner_id` | Bộ lọc Owner |
| Contacts | `lead_created_at`, `_createdAt` | Ngày tạo contact (BR-11) |
| Contacts | `source` | Nhóm của thẻ "Nguồn contact" |
| Deals | `owner_id` | Bộ lọc Sale phụ trách, nhóm của thẻ "Hiệu quả sale theo giá trị chốt" |
| Deals | `_createdAt` | Ngày tạo deal |
| Deals | `closed_at` | Thời điểm đóng (BR-13) |
| Deals | `giai_o_n_pipeline` | Giai đoạn, trạng thái Đang mở / Thắng / Thua |
| Deals | `t_ng_cash_in_d_ki_n` | Amount |
| Deals | `g_i_d_ch_v_m_c_ti_u` | Bộ lọc nâng cao Gói dịch vụ mục tiêu |
| Deals | `ng_y_c_p_nh_t_g_n_nh_t` | Điền `closed_at` cho deal cũ khi chuyển đổi |
| Hoạt động | `$actor`, `$type`, `$happenedAt` | Người thực hiện, loại, thời điểm đã diễn ra (trường ảo của F14-S1) |

Trạng thái theo người dùng lưu ở `dashboard_user_state` (F14-S1, cấu hình dashboard): tên dashboard, tên thẻ (`cardTitles`), thứ tự, kích thước, thẻ đã gỡ, yêu thích, lần xem cuối. FE đọc và ghi qua `my-state`.

Tham số URL: `range`, `owners`, `lifecycle`, `goi`.

## C. API

Mọi API tổng hợp, drill-down, xuất tệp và cấu hình dashboard do F14-S1 đặc tả. Spec này dùng:

| Việc | API |
|---|---|
| Số liệu của một thẻ | Truy vấn tổng hợp của F14-S1 (nguồn, phép đo, `time.field`, nhóm, `buckets`, `include`, bộ lọc owner). Trả kèm `meta.computedAt` và mã drill |
| Thẻ "Tiến trình deal qua các giai đoạn" | Báo cáo có tên `stage_funnel` của F14-S1; trả `conversion` và `meta.approximated` |
| Làm mới bỏ qua bộ nhớ đệm | Thêm `fresh=1` |
| Danh sách bản ghi của một con số | Drill-down của F14-S1 bằng mã drill, có `sort`, 50 dòng một lần |
| Xuất CSV bản ghi (thẻ, drill-down) | Xuất chi tiết của F14-S1, tối đa 50.000 dòng, có ghi nhật ký |
| Xuất cả dashboard | Xuất dashboard của F14-S1, trả tệp ZIP |
| Danh sách dashboard theo tab, yêu thích | API dashboard của F14-S1, tham số `tab` |
| Ghi lượt xem | `POST /dashboards/:id/viewed` |
| Đọc, lưu, xoá trạng thái của người dùng | `my-state` (xoá: `DELETE my-state`) |

Mã lỗi FE phải xử lý:

| Mã | Tình huống | FE làm gì |
|---|---|---|
| `504` | Truy vấn của thẻ quá thời gian | Thẻ hiện "Báo cáo chạy quá lâu. Thử thu hẹp khoảng thời gian." và "Thử lại" |
| `429` | Quá giới hạn tần suất | Thẻ hiện "Bạn đang tải báo cáo quá nhanh. Thử lại sau ít phút." và "Thử lại"; không tự gửi lại |
| `410` | Mã drill hết hạn | Chạy lại truy vấn của thẻ rồi mở lại danh sách |

## D. Lệch so với sheet / prototype

Lệch so với sheet, cần PO xác nhận:

- R-01, R-05, R-06, R-07 sheet ghi "Chỉ FE" nhưng cần BE: R-01 cần danh sách dashboard, yêu thích, xem gần đây; R-05 cần đổi tên thẻ và xuất dữ liệu; R-06 cần lưu bố cục; R-07 cần API drill-down và xuất CSV. Đề nghị sửa cột Phạm vi thành "FE + BE".
- Tên dashboard trên giao diện dùng tiếng Việt: "Tổng quan dữ liệu CRM" (sheet: CRM Data Overview) và "Tổng quan pipeline" (sheet: Pipeline Overview), theo quy ước ngôn ngữ sản phẩm.
- R-10 Báo cáo Tickets: ngoài phạm vi. Tiêu chí nghiệm thu của R-10 chỉ kiểm rằng không có thẻ nào liên quan tới Tickets.

Lệch so với prototype (`crm-bao-cao-hubspot.html`):

| Trong prototype | Bản thật |
|---|---|
| "Deals đã đóng", "Thời gian chốt trung bình" dùng Ngày dự kiến chốt (ngày do sale đoán, có thể nằm trong tương lai) | `closed_at` (BR-13) |
| Phễu theo giai đoạn hiện tại, bỏ deal thua | Theo lịch sử giai đoạn, tính cả deal thua |
| Hoạt động đếm theo lúc tạo | Theo thời điểm đã diễn ra (BR-12) |
| Đếm, cộng trên dữ liệu tải về trình duyệt | F14-S1 tổng hợp ở máy chủ |
| Kỳ trước = khoảng cùng độ dài liền trước | Theo F14-S1, phần kỳ so sánh |
| Biểu đồ theo thời gian luôn theo tháng | Mốc `auto` |
| Owner là tên | Id `NhanVien` |
| Bố cục, yêu thích, tên lưu `localStorage` | `dashboard_user_state` |
| Xuất CSV dựng ở trình duyệt | Máy chủ xuất, có giới hạn và ghi nhật ký |
| "Mọi thời gian" bắt đầu 01/01/2026 | Từ bản ghi sớm nhất |

**Ngoài phạm vi:** tạo dashboard, tạo báo cáo tự do ("Create dashboard", "Explore reports" của HubSpot); gửi báo cáo định kỳ; báo cáo của trang Sales (CRM-08); báo cáo Tickets (R-10).

## E. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai |
|---|---|---|
| Q1 | Sheet ghi R-01, R-05, R-06, R-07 là "Chỉ FE" nhưng cần BE. Đồng ý sửa cột Phạm vi? | PO |
| Q2 | Thẻ hoạt động đang bỏ cuộc họp có kết quả Huỷ, Đổi lịch, Không đến (theo "Ngày hoạt động gần nhất"). Khách có muốn đếm riêng những cuộc họp này ở đâu đó không? | Khách |
| Q3 | Deal đã đóng từ trước khi có `closed_at`: lấy ngày cập nhật gần nhất làm ngày đóng có chấp nhận được không? | Khách |
| Q4 | Có cần dashboard dùng chung do quản lý sắp xếp cho cả đội không? (cùng câu hỏi về dashboard dùng chung ở F14-S1) | Khách |
| Q5 | Đặt tên dashboard tiếng Việt (Tổng quan dữ liệu CRM, Tổng quan pipeline) có được không, hay giữ tên tiếng Anh như portal HubSpot của khách? | Khách |
| Q6 | Bộ lọc Owner chỉ liệt kê nhân viên `is_sales`, trong khi thẻ hoạt động đếm cả người ngoài đội kinh doanh. Có cần lọc được những người này không? | Khách |
| Q7 | "Cả tháng này" so với cả tháng trước (giống HubSpot) nên đầu tháng con số luôn giảm mạnh. Khách có muốn so cùng số ngày (01/10 – 01/10 với 01/09 – 01/09) không? Nếu có thì sửa F14-S1, phần kỳ so sánh | Khách |
| Q8 | Script chuyển Leads có lấy được ngày tạo lead gốc để ghi `lead_created_at` không? Không lấy được thì thẻ contact sẽ có một cột vọt lên ở ngày chuyển đổi | BE (spike chuyển đổi) |

## F. Tài liệu liên quan

- Prototype: `crm-bao-cao-hubspot.html` (Tổng quan dữ liệu CRM), `crm-bao-cao-hubspot.html?d=pipe` (Tổng quan pipeline)
- Nguồn HubSpot: portal 247428660, hai dashboard "CRM Data Overview" và "Pipeline Overview", khảo sát 29/09/2026 (chỉ xem, không sửa)
- Plan: `00-PLAN-viet-spec.md`
- Spec nền: `F14-S1-api-tong-hop-bao-cao.md` (truy vấn tổng hợp, báo cáo có tên, drill-down, xuất tệp, cấu hình dashboard), `F03-S3` (lịch sử giai đoạn cho phễu), `F03-S6` (người thực hiện hoạt động), `F03-S2` ("Ngày hoạt động gần nhất")
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` (trường của Contacts, Deals, hoạt động dùng trong phép tính; script chuyển đổi)
- Khung: `CRM-01-khung-danh-sach-trang-chi-tiet.md` (bộ lọc nhanh, popover owner, bộ lọc nâng cao)
- Màn liên quan: `CRM-08-sales.md` (nút "Báo cáo" ở trang chi tiết sale)
- Design system: `DESIGN-SYSTEM-HUBSPOT.md` (màu trạng thái, bảng màu biểu đồ, card báo cáo, template T3, sidebar)
- Đối chiếu HubSpot: `DOI-CHIEU-CHUC-NANG.md` phần Báo cáo

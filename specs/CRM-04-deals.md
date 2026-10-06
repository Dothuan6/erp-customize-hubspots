# CRM-04 — Deals

# Product Requirement Document

| | | | |
|---|---|---|---|
| **Project Owner** | TTS | **Update at** | 02-10-2026 |
| **Created by** | TTS (qua Claude) | **Project** | CRM theo UX HubSpot — HarnexAI ERP |
| **Version** | 2.0 | **Features** | D-01 → D-15 (màn Deals) |

**CONTENT**

- USER STORIES
- OVERVIEW FLOW
- USE CASE DESCRIPTION
  - UC-1: Xem danh sách deal dạng bảng
  - UC-2: Xem và lên lịch hoạt động tiếp theo
  - UC-3: Mở rộng dòng
  - UC-4: Xem board theo giai đoạn
  - UC-5: Kéo thả đổi giai đoạn
  - UC-6: Tạo deal
  - UC-7: Xem và sửa trang chi tiết deal
  - UC-8: Kích hoạt Workflow và Quản lý trường
- BUSINESS RULE
- ACCEPTANCE CRITERIA
- PHỤ LỤC

**VERSION HISTORY**

| **Ver** | **Author** | **Description** | **Updated at** |
|---|---|---|---|
| 2.0 | TTS (qua Claude) | Viết lại theo mẫu PRD: user story, use case, business rule, acceptance criteria. Nội dung giữ như bản 1.x | 02-10-2026 |
| 1.x | TTS (qua Claude) | Các bản trước 02-10-2026 (1.0 bản đầu, 1.1 sửa theo đợt 3) | 30-09-2026 |

---

# USER STORIES

US-DEAL-01: Là sale, tôi muốn xem danh sách deal với bộ lọc nhanh và các cột chính để tìm ra deal cần xử lý. (D-01, D-02, D-03)

US-DEAL-02: Là sale, tôi muốn thấy hoạt động tiếp theo của từng deal và lên lịch ngay trên danh sách để không bỏ sót deal nào. (D-04)

US-DEAL-03: Là sale, tôi muốn mở rộng một dòng để xem nhanh contact và công ty của deal mà không rời danh sách. (D-05)

US-DEAL-04: Là quản lý kinh doanh, tôi muốn xem board theo giai đoạn kèm tổng giá trị và giá trị có trọng số của từng cột để biết pipeline đang nằm ở đâu. (D-06, D-07)

US-DEAL-05: Là sale, tôi muốn kéo thẻ deal sang giai đoạn khác để cập nhật tiến độ nhanh. (D-08)

US-DEAL-06: Là sale, tôi muốn tạo deal từ danh sách hoặc từ trang Contact, Company với thông tin điền sẵn, và để hệ thống tự cấp Mã Deal. (D-09)

US-DEAL-07: Là sale, tôi muốn xem và sửa thông tin chính của deal, contact và công ty liên quan ngay trên trang chi tiết. (D-10, D-11, D-13)

US-DEAL-08: Là sale, tôi muốn thấy việc tạo deal và đổi giai đoạn trên timeline của deal, contact và công ty để nắm lịch sử. (D-12)

US-DEAL-09: Là quản trị, tôi muốn vẫn chạy được workflow và mở Quản lý trường của Deals_Pipeline từ giao diện mới. (D-14)

US-DEAL-10: Là quản lý kinh doanh, tôi muốn thấy pipeline đang dùng trên thanh công cụ, để sau này chuyển được giữa nhiều pipeline. Nhiều pipeline chưa làm trong giai đoạn này. (D-01, D-15)

# OVERVIEW FLOW

| **Bước** | **Tác nhân** | **Mô tả** |
|---|---|---|
| 1 | Người dùng | Bấm "Deals" trên sidebar. |
| 2 | Hệ thống | Mở màn Deals ở dạng board, cột theo Giai đoạn Pipeline, mỗi cột có chân ghi tổng giá trị. |
| 3 | Người dùng | Lọc bằng bộ lọc nhanh, đổi sang dạng bảng, mở rộng dòng để xem contact và công ty. |
| 4 | Người dùng | Kéo thẻ sang cột khác để đổi giai đoạn. |
| 5 | Máy chủ | Lưu giai đoạn mới, ghi sự kiện "Hoạt động Deal" lên deal, contact và công ty của deal. |
| 6 | Người dùng | Bấm "Thêm deals", điền panel "Tạo Deal" và bấm Tạo. |
| 7 | Máy chủ | Sinh Mã Deal, lưu deal cùng các liên kết trong một giao dịch. |
| 8 | Người dùng | Bấm Mã Deal để mở trang chi tiết. |
| 9 | Hệ thống | Hiện thẻ định danh, card "Về Deal này", tab Hoạt động và các card Contacts, Companies, Line items, Tệp đính kèm. |
| 10 | Người dùng | Sửa Amount, ngày chốt, giai đoạn tại chỗ; lên lịch hoạt động; chạy workflow khi cần. |

# USE CASE DESCRIPTION

## UC-1: Xem danh sách deal dạng bảng (D-01, D-02, D-03, D-15)

| | |
|---|---|
| **Actor** | Người dùng đọc được collection `Deals_Pipeline` |
| **Trigger** | Mở màn Deals và chọn dạng bảng |
| **Pre-condition** | Script khởi tạo đã đặt vị trí trường theo Phụ lục B |
| **Main Flow** | 1. Hệ thống hiện header: tiêu đề "Deals ⌄", menu ⋮ (Import, Export, Kết nối Google Sheet, Ghim vào sidebar, Chỉnh sửa thuộc tính) và nút split "Thêm deals ▾".<br>2. Hệ thống hiện tab view: "Tất cả deals", "Deals của tôi" và các view người dùng đã lưu trên ERP.<br>3. Hệ thống hiện thanh công cụ. Sau nút Sắp xếp có nút "Deals_Pipeline ⌄".<br>4. Hệ thống hiện bốn bộ lọc nhanh: Sale phụ trách, Ngày tạo, Ngày hoạt động gần nhất, Ngày dự kiến chốt.<br>5. Hệ thống hiện bảng với 8 cột mặc định theo Phụ lục A, sắp theo Ngày tạo giảm dần.<br>6. Người dùng lọc, tìm theo Mã Deal hoặc Tên Deal, thêm cột bằng nút "+".<br>7. Người dùng sửa một ô tại chỗ. Hệ thống lưu theo quy tắc chung của CRM-01, phần cột và sửa tại chỗ.<br>8. Người dùng bấm Mã Deal để mở trang chi tiết (UC-7). |
| **Post-condition** | Bộ lọc, cột ẩn, bề rộng cột lưu trong View của ERP. Mật độ bảng lưu theo người dùng. |
| **Exception Flow** | 1a. Người dùng bấm phần chữ của "Thêm deals" → mở panel tạo (UC-6). Bấm ▾ → menu "Tạo mới" và "Import".<br>3a. Người dùng mở menu "Deals_Pipeline ⌄" → chỉ có một mục "Deals_Pipeline" đang chọn, không có mục "sắp có".<br>4a. F03-S2 chưa xong → ẩn bộ lọc "Ngày hoạt động gần nhất" và cột "Hoạt động tiếp theo" (BR-02).<br>6a. Người dùng mở hộp "Chỉnh sửa cột" → không kéo đổi thứ tự được, có dòng "Đổi thứ tự trong Quản lý trường" (BR-05).<br>7a. Sửa Amount khi deal đang lấy tổng từ line item → ô chỉ đọc, rê chuột hiện "Tính từ line items" (BR-06).<br>7b. Sửa trường Test ở ô bảng → không vào chế độ sửa; chỉ sửa được ở trang chi tiết. |

## UC-2: Xem và lên lịch hoạt động tiếp theo (D-04)

| | |
|---|---|
| **Actor** | Sale |
| **Trigger** | Nhìn cột "Hoạt động tiếp theo" trên bảng, hoặc bấm nút "Lên lịch ▾" trong cột đó |
| **Pre-condition** | F03-S2 đã xong (có trường tính `next_activity_at`, `next_activity_id`) |
| **Main Flow** | 1. Hệ thống hiện hoạt động tiếp theo của từng deal: "Task · {dd/mm}" kèm biểu tượng task, hoặc "Họp · {dd/mm}" kèm biểu tượng lịch.<br>2. Sale rê chuột vào ô. Hệ thống hiện "{tiêu đề} — hạn {dd/mm/yyyy}" với task, hoặc "{tiêu đề} — {dd/mm/yyyy HH:mm}" với cuộc họp.<br>3. Sale bấm vào ô. Hệ thống mở trang chi tiết deal ở tab Hoạt động (`?tab=activities`).<br>4. Với deal chưa có hoạt động tiếp theo, hệ thống hiện nút "Lên lịch ▾".<br>5. Sale bấm "Lên lịch ▾" và chọn "Lên lịch cuộc họp" hoặc "Tạo task".<br>6. Hệ thống mở cửa sổ soạn tương ứng (CRM-05) ngay trên màn danh sách, đã gắn deal này.<br>7. Sale điền và lưu.<br>8. Hệ thống cập nhật ô của deal đó. |
| **Post-condition** | Hoạt động mới gắn với deal. Ô hiện hoạt động vừa tạo. Sale vẫn ở màn danh sách. |
| **Exception Flow** | 1a. Task đã quá hạn → thêm nhãn "Quá hạn" màu lỗi.<br>1b. F03-S2 chưa xong → cột không có trong cột mặc định và danh sách "+". |

## UC-3: Mở rộng dòng (D-05)

| | |
|---|---|
| **Actor** | Người dùng đọc được `Deals_Pipeline` |
| **Trigger** | Bấm nút mở rộng ở cột Mã Deal |
| **Pre-condition** | Đang ở dạng bảng |
| **Main Flow** | 1. Người dùng bấm nút mở rộng ở một dòng.<br>2. Hệ thống hiện bảng con với hai kênh để chọn: Contacts và Companies.<br>3. Người dùng chọn Contacts. Hệ thống hiện các cột Tên (link), Email, Vai trò (tag).<br>4. Người dùng chọn Companies. Hệ thống hiện các cột Tên công ty (link), Domain, Số điện thoại. |
| **Post-condition** | Không thay đổi dữ liệu. |
| **Exception Flow** | 4a. Deal chỉ có một công ty nên bảng con Companies có tối đa một dòng. |

## UC-4: Xem board theo giai đoạn (D-06, D-07)

| | |
|---|---|
| **Actor** | Người dùng đọc được `Deals_Pipeline` |
| **Trigger** | Mở màn Deals (board là dạng mặc định) |
| **Pre-condition** | Không có |
| **Main Flow** | 1. Hệ thống hiện board, mỗi cột là một giá trị của Giai đoạn Pipeline.<br>2. Mỗi cột tải 20 thẻ đầu.<br>3. Mỗi thẻ hiện 8 phần theo Phụ lục A: Mã Deal, Tên Deal, Công ty, Ngày tạo, Ngày dự kiến chốt, Amount, Sale phụ trách và chân thẻ.<br>4. FE gọi API `group-summary` với cùng bộ lọc của danh sách.<br>5. Hệ thống hiện chân cột hai dòng: Tổng giá trị và Giá trị có trọng số (BR-09).<br>6. Người dùng bấm nút Ghi chú hoặc nút Task ở chân thẻ. Hệ thống mở cửa sổ soạn ngay trên màn board.<br>7. Người dùng đổi "Cột theo" sang một trường Lựa chọn đơn khác. Hệ thống dựng lại cột và chân cột. |
| **Post-condition** | Ghi chú hoặc task tạo từ thẻ được gắn với deal và các contact, công ty của deal (theo CRM-05). Người dùng vẫn ở màn board. |
| **Exception Flow** | 3a. Deal không có công ty, ngày chốt, Amount hoặc sale phụ trách → phần đó không hiện trên thẻ.<br>3b. Deal không có hoạt động tiếp theo → chân thẻ ghi "— \| Chưa có lịch".<br>5a. Cột "5. Closed Won" → dòng thứ hai ghi "Thắng (100%)". Cột "6. Closed Lost" → "Thua (0%)".<br>7a. "Cột theo" không phải Giai đoạn Pipeline → vẫn có Tổng giá trị và trọng số, không có dòng "Thắng / Thua". |

## UC-5: Kéo thả đổi giai đoạn (D-08, D-12)

| | |
|---|---|
| **Actor** | Người dùng có quyền sửa deal |
| **Trigger** | Kéo một thẻ deal sang cột khác trên board |
| **Pre-condition** | Board đang chia cột theo Giai đoạn Pipeline |
| **Main Flow** | 1. Người dùng kéo thẻ sang cột khác và thả.<br>2. Hệ thống cập nhật `giai_o_n_pipeline` của deal.<br>3. Máy chủ ghi `stage_changed_at`.<br>4. Máy chủ ghi sự kiện "Hoạt động Deal" lên timeline của deal.<br>5. Máy chủ lan sự kiện sang các Contact và Company của deal.<br>6. Hệ thống cập nhật lại chân cột nguồn và cột đích. |
| **Post-condition** | Deal ở giai đoạn mới. Timeline của deal, contact và công ty liên quan đều có sự kiện "Hoạt động Deal". |
| **Exception Flow** | 2a. Lưu lỗi → thẻ quay về cột cũ, hệ thống hiện lỗi, chân cột không đổi.<br>3a. Deal vào "5. Closed Won" hoặc "6. Closed Lost" → máy chủ ghi `closed_at`. Deal ra khỏi hai giai đoạn này → máy chủ xoá `closed_at`.<br>1a. Kéo vào "6. Closed Lost" → không bắt nhập Lý do thất bại trong giai đoạn này (câu hỏi Q3). |

## UC-6: Tạo deal (D-09)

| | |
|---|---|
| **Actor** | Người dùng có quyền tạo deal |
| **Trigger** | Bấm "Thêm deals" trên header; hoặc "+ Thêm → Tạo mới" ở card Deals của một Contact; hoặc ở card Deals của một Company |
| **Pre-condition** | Không có |
| **Main Flow** | 1. Hệ thống mở panel phải, tiêu đề "Tạo Deal".<br>2. Hệ thống hiện 9 trường theo Phụ lục A và điền sẵn theo nơi mở (BR-13). Panel không có ô Mã Deal.<br>3. Người dùng điền Tên Deal, chọn Giai đoạn Pipeline (mặc định "1. MQL Qualified") và các trường khác.<br>4. Người dùng bấm "Thêm trường khác" nếu cần. Hệ thống hiện thêm mọi trường nhập tay còn lại của Deals_Pipeline.<br>5. Ở mục "Liên kết Deal với", người dùng chọn một Company và thêm các Contact. Mỗi contact có ô Vai trò (không bắt buộc) và nút gỡ.<br>6. Người dùng bấm Tạo.<br>7. Máy chủ sinh Mã Deal (BR-11) và ghi deal cùng các liên kết trong một giao dịch.<br>8. Máy chủ ghi sự kiện "Đã tạo" lên deal và lan sang Company, Contacts đã gắn.<br>9. Hệ thống hiện toast "Đã tạo DEAL-0021 “Dược phẩm Thiên Phúc - Deal mới”" kèm link mở deal. |
| **Post-condition** | Mở từ header: người dùng ở lại danh sách hoặc board, deal mới hiện ở cột giai đoạn đã chọn. Mở từ card: card Deals của contact hoặc company cập nhật; nếu tạo từ Company, card Deals của từng contact đã tick cũng có deal mới. |
| **Exception Flow** | 3a. Tên Deal để trống → nút Tạo vô hiệu, cạnh nút ghi "Còn 1 trường bắt buộc chưa nhập".<br>2a. Owner của contact hoặc công ty đang "Tạm nghỉ" hay "Đã nghỉ" → ô Sale phụ trách để trống, dưới ô ghi "Owner hiện tại {tên} không còn làm việc".<br>2b. Mở từ Company có hơn 20 contact → tick sẵn 20, dưới danh sách ghi "Còn {n} contact của công ty chưa được chọn" và có ô tìm để thêm.<br>7a. Request gửi sẵn `m_deal` trùng mã đã có (nhập file, API) → máy chủ trả `409`. |

## UC-7: Xem và sửa trang chi tiết deal (D-10, D-11, D-12, D-13)

| | |
|---|---|
| **Actor** | Người dùng đọc được deal; muốn sửa thì cần quyền sửa |
| **Trigger** | Bấm Mã Deal ở bảng, ở thẻ board, hoặc ở link trong toast |
| **Pre-condition** | Deal tồn tại |
| **Main Flow** | 1. Hệ thống hiện trang ba cột theo bố cục chung của CRM-01. Cột giữa chỉ có tab Hoạt động, không có tab Tổng quan.<br>2. Thẻ định danh hiện biểu tượng bắt tay, tiêu đề là Mã Deal, dòng nhỏ bên dưới là Tên Deal.<br>3. Thẻ định danh hiện bốn dòng phụ: Amount, Ngày dự kiến chốt, Pipeline (tag "Deals_Pipeline"), Giai đoạn (pill).<br>4. Thẻ định danh có sáu nút nhanh và menu Thao tác (các mục theo Phụ lục B).<br>5. Card "Về Deal này" hiện 6 trường theo Phụ lục A, sửa tại chỗ được trừ "Liên hệ gần nhất".<br>6. Cột phải hiện bốn card theo thứ tự: Contacts, Companies, Line items, Tệp đính kèm.<br>7. Người dùng rê chuột vào tiêu đề và bấm ✎. Hệ thống mở popover một ô "Tên Deal" kèm dòng "Mã Deal là mã định danh, không đổi được."<br>8. Người dùng bấm Amount, nhập số, Enter để lưu, Esc để huỷ.<br>9. Người dùng bấm nút ngày chốt. Hệ thống mở bộ chọn ngày; chọn là lưu. Có nút "Xoá ngày".<br>10. Người dùng bấm pill giai đoạn. Hệ thống mở popover danh sách giai đoạn, giai đoạn hiện tại có dấu tick. Chọn giai đoạn khác là lưu ngay, kết quả như kéo thả trên board (UC-5).<br>11. Timeline ở tab Hoạt động hiện sự kiện "Hoạt động Deal" và "Đã tạo" trong nhóm "Cập nhật", lọc được theo loại "Hoạt động Deal". |
| **Post-condition** | Giá trị sửa được lưu. Đổi Amount hoặc Sale phụ trách sinh sự kiện "Thay đổi thuộc tính". Đổi ngày chốt có dòng trong lịch sử thuộc tính. |
| **Exception Flow** | 8a. Deal có line item và `use_line_items_amount = true` → Amount chỉ đọc, rê chuột hiện "Tính từ line items" (BR-06).<br>5a. F03-S2 chưa xong → dòng "Liên hệ gần nhất" không hiện, card còn 5 trường.<br>6a. Deal đã có công ty → ở card Companies, "+ Thêm" đổi thành "Đổi" và hệ thống hỏi trước khi thay.<br>6b. Đổi công ty xong → card Deals của công ty cũ không còn deal này. |

## UC-8: Kích hoạt Workflow và Quản lý trường (D-14)

| | |
|---|---|
| **Actor** | Người dùng có quyền chạy workflow thủ công, hoặc có quyền `collection.update_schema` trên Deals_Pipeline |
| **Trigger** | Mở menu Thao tác ở trang chi tiết deal |
| **Pre-condition** | Đang ở trang chi tiết deal |
| **Main Flow** | 1. Người dùng chọn "Kích hoạt Workflow".<br>2. Hệ thống mở hộp chọn, liệt kê các workflow đang bật có thể chạy thủ công trên Deals_Pipeline (ERP hiện có 10).<br>3. Người dùng chọn một workflow và bấm "Kích hoạt".<br>4. Hệ thống chạy workflow cho deal này. Chạy xong hoặc lỗi thì hiện toast theo cơ chế đang có của ERP.<br>5. Người dùng chọn "Quản lý trường dữ liệu". Hệ thống mở trang Quản lý trường của Deals_Pipeline. |
| **Post-condition** | Workflow chạy như trên ERP hiện tại. |
| **Exception Flow** | 1a. Không có quyền chạy workflow → mục "Kích hoạt Workflow" ẩn.<br>5a. Không có quyền sửa cấu trúc collection → mục "Quản lý trường dữ liệu" ẩn. |

# BUSINESS RULE

| **BR** | **Mô tả** |
|---|---|
| BR-01 | **Deals dùng collection có sẵn**<br>- Deals dùng collection `Deals_Pipeline` đang có trên ERP, với 10 workflow đang chạy. Cơ chế chung của danh sách và trang chi tiết theo CRM-01.<br>- Deals khác Contacts và Companies ở ba điểm: dùng collection có sẵn, có board kèm tổng tiền, có line items.<br>- Tính năng ghi "ERP có sẵn" là chức năng đã có trên ERP hoặc chỉ tính từ trường đã có. Giao diện mới không được làm mất chức năng đó và phải có tiêu chí hồi quy.<br>- Thay đổi giao diện không ảnh hưởng workflow đang chạy. Ảnh hưởng do thay đổi dữ liệu (`sale_ph_tr_ch`, `lead_id`) xử lý theo CRM-00, phần chuyển đổi dữ liệu và rà workflow. |
| BR-02 | **Phụ thuộc F03-S2**<br>- Ba trường tính `last_activity_at`, `next_activity_at`, `last_contacted_at` do F03-S2 cung cấp (đợt 3).<br>- Khi F03-S2 chưa xong: bộ lọc nhanh "Ngày hoạt động gần nhất" ẩn; cột "Hoạt động tiếp theo" không có trong cột mặc định và danh sách "+"; dòng "Liên hệ gần nhất" không hiện trong card "Về Deal này".<br>- Các tiêu chí nghiệm thu liên quan chỉ áp dụng khi F03-S2 đã xong. |
| BR-03 | **Một pipeline**<br>- Menu "Deals_Pipeline ⌄" hiện chỉ có một mục "Deals_Pipeline" đang chọn.<br>- Nhiều pipeline (D-15) chưa làm trong giai đoạn này. Việc này cần trường Pipeline và danh mục giai đoạn theo từng pipeline; CRM-00 giữ chỗ key `pipeline`.<br>- Menu không hiện mục "sắp có" để tránh hứa trước với khách. Key `pipeline` không được dùng cho trường nào khác. |
| BR-04 | **Bộ lọc và view**<br>- Ngày dự kiến chốt có thêm bốn mốc tương lai: Ngày mai, Tuần sau, Tháng sau, 30 ngày tới. Ngày tạo không có các mốc này.<br>- Nút ⊕ thêm được: Giai đoạn, Gói dịch vụ, Thời hạn thanh toán, Lý do thất bại, trường tự tạo.<br>- Bộ lọc nâng cao là bộ lọc điều kiện đang có của ERP, giữ nguyên chức năng. Bộ lọc đã lưu trong các view hiện có không bị mất.<br>- "Deals của tôi" là view hệ thống mới. View người dùng đã lưu trên ERP giữ nguyên và hiện thành tab. |
| BR-05 | **Thứ tự cột theo thứ tự trường**<br>- Cột của bảng Deals xếp theo thứ tự trường trong Quản lý trường (`columnOrder: "field"`), không kéo đổi riêng theo view. Đây là quy tắc ERP hiện tại.<br>- Contacts và Companies là collection mới nên cho kéo đổi theo view (`columnOrder: "view"`). Việc hai màn khác nhau là câu hỏi Q1.<br>- Script khởi tạo đặt lại vị trí trường theo Phụ lục B để cột mặc định ra đúng thứ tự.<br>- Cột trường hệ thống luôn đứng sau mọi trường thường, theo thứ tự Ngày tạo, Ngày sửa.<br>- Đổi vị trí trường không đổi dữ liệu và không ảnh hưởng workflow (workflow tham chiếu theo key). Việc này vẫn phải ghi vào bảng rà workflow của CRM-00. |
| BR-06 | **Khoá Amount khi tính từ line item**<br>- Amount chỉ sửa được khi `use_line_items_amount = false` hoặc deal chưa có line item.<br>- Ngược lại ô chỉ đọc, rê chuột hiện "Tính từ line items" (chi tiết ở CRM-06).<br>- Quy tắc áp cho ô bảng, thẻ định danh và panel "Xem tất cả thuộc tính".<br>- Máy chủ cũng từ chối ghi Amount qua mọi đường khác trong trạng thái này: `422 AMOUNT_LOCKED` (theo F03-S2, phần khoá Amount). |
| BR-07 | **Hoạt động tiếp theo**<br>- Là hoạt động gần nhất trong số task chưa xong (theo hạn, kể cả task đã quá hạn) và cuộc họp sắp tới (theo giờ bắt đầu), gắn với deal. Định nghĩa "sắp tới" ở CRM-00.<br>- Giá trị đổi theo thời gian: cuộc họp vừa qua giờ bắt đầu thì không còn là "tiếp theo". F03-S2 phải tính lại theo lịch, không chỉ khi hoạt động thay đổi.<br>- Cột không sắp xếp được trong giai đoạn này vì ghép từ hai trường tính. Lọc được theo `next_activity_at` ở bộ lọc nâng cao. |
| BR-08 | **Board và thẻ**<br>- Màn Deals mặc định mở ở board, cột theo Giai đoạn Pipeline. Người dùng đổi "Cột theo" sang trường Lựa chọn đơn khác được (chức năng ERP có sẵn).<br>- Thẻ không hiện tỷ lệ thành công; tỷ lệ chỉ dùng ở chân cột.<br>- Thẻ deal đã thắng, đã thua không có badge riêng vì đã nằm trong cột Won, Lost. |
| BR-09 | **Chân cột board**<br>- Tổng giá trị = tổng Amount của mọi deal trong cột, theo bộ lọc hiện tại.<br>- Giá trị có trọng số = tổng (Amount × Tỷ lệ thành công ÷ 100) của mọi deal trong cột.<br>- Phần trăm p = làm tròn (tổng trọng số ÷ tổng giá trị × 100). Tổng giá trị bằng 0 thì p = 0.<br>- Amount trống tính là 0. Tỷ lệ thành công trống tính là 0.<br>- Cột "5. Closed Won" hiện "Thắng (100%)", cột "6. Closed Lost" hiện "Thua (0%)" thay cho dòng trọng số. Chỉ đổi cách hiển thị, không đổi Tỷ lệ thành công của deal.<br>- Tổng tính ở máy chủ trên toàn bộ deal khớp bộ lọc, không cộng trên các thẻ đã tải (API ở Phụ lục C). |
| BR-10 | **Đổi giai đoạn**<br>- Giai đoạn chỉ đổi khi người dùng đổi: kéo thả, chọn ở thẻ định danh, sửa ô, hoặc workflow người dùng cấu hình. Spec này không có tự động đổi giai đoạn.<br>- Đổi giai đoạn không tự đổi Tỷ lệ thành công.<br>- `stage_changed_at` và `closed_at` do máy chủ ghi (theo CRM-00, phần trường của Deals).<br>- Sự kiện tạo deal và đổi giai đoạn lan sang Contacts và Company của deal. Đổi `owner_id` và Amount sinh sự kiện "Thay đổi thuộc tính" (cấu hình ở Phụ lục B). |
| BR-11 | **Mã Deal**<br>- Máy chủ sinh mã dạng `DEAL-{n}` khi request tạo không gửi `m_deal`. `n` tăng dần, đệm 0 cho đủ 4 chữ số (`DEAL-0021`); từ 10.000 trở đi không đệm.<br>- `n` lấy từ bộ đếm riêng của collection, tăng nguyên tử, để hai người tạo cùng lúc không trùng mã (chi tiết ở Phụ lục C).<br>- Mã Deal không đổi được trên giao diện.<br>- `m_deal` cần cờ Duy nhất. Cờ chỉ bật sau khi dữ liệu cũ đã hết mã trùng và mã rỗng (theo CRM-00, phần chuyển đổi Mã Deal).<br>- Bộ đếm nguyên tử cần BE xác nhận (câu hỏi Q2). Phương án tạm nếu chưa làm được: panel có ô Mã Deal bắt buộc, kiểm trùng khi rời ô. |
| BR-12 | **Tạo deal**<br>- Tên Deal và Giai đoạn Pipeline bắt buộc trên panel. Amount từ 0 trở lên. Tỷ lệ thành công từ 0 đến 100. Sale phụ trách chỉ chọn nhân viên đang làm việc.<br>- Spec không tự bật cờ Bắt buộc trên ERP cho hai trường trên, vì có thể làm hỏng workflow hoặc job nhập đang chạy. API và nhập file vẫn tạo được deal thiếu chúng nếu ERP chưa có cờ. BA cần kiểm lại; khách quyết việc bật cờ sau khi rà.<br>- Deal và liên kết ghi trong một giao dịch (theo F03-S1, tạo bản ghi kèm liên kết).<br>- `use_line_items_amount` mặc định `true`. Amount nhập lúc tạo được giữ cho đến khi line item đầu tiên của deal được lưu (CRM-06). |
| BR-13 | **Điền sẵn theo nơi mở**<br>- Bảng điền sẵn ở Phụ lục A.<br>- Sale phụ trách mặc định: mở từ header thì là nhân viên gắn với tài khoản đang đăng nhập; mở từ card thì là owner của contact hoặc công ty, không có thì như header.<br>- Owner đang "Tạm nghỉ" hay "Đã nghỉ" thì ô để trống kèm dòng "Owner hiện tại {tên} không còn làm việc".<br>- Mở từ Company: tick sẵn tối đa 20 contact. Contact có công ty này là công ty chính đứng trước, sau đó theo thời điểm liên kết mới nhất. Giới hạn này giữ request dưới mức 50 liên kết của F03-S1.<br>- Mở từ Contact: vai trò của contact để trống. |
| BR-14 | **Xoá và nhân bản**<br>- Xoá deal là xoá mềm. Line item và điều chỉnh cấp Deal bị xoá theo. Dòng nối Deal – Contact, Activity – Deal bị xoá theo (theo F03-S1, phần xoá bản ghi). Khôi phục deal thì khôi phục đủ.<br>- Nhân bản deal: mở panel "Tạo Deal" điền sẵn mọi trường nhập tay (trừ Mã Deal), Company, Contacts và vai trò. Không sao chép line item, hoạt động, tệp. |
| BR-15 | **Quyền**<br>- Quyền xem, tạo, sửa, xoá theo CRM-01, phần quyền.<br>- Kích hoạt Workflow: cần quyền chạy workflow thủ công trên Deals_Pipeline, theo cơ chế ERP hiện có.<br>- Quản lý trường dữ liệu: cần `collection.update_schema` trên Deals_Pipeline.<br>- Không có quyền thì mục tương ứng trong menu Thao tác ẩn. |

# ACCEPTANCE CRITERIA

AC-1: Header và pipeline (D-01, D-15)

- Người có quyền tạo và nhập deal mở Deals thấy tiêu đề "Deals ⌄" và nút "Thêm deals ▾" với "Tạo mới" và "Import".
- Không còn hai nút "Tạo mới" và "Import" riêng của ERP.
- Thanh công cụ có nút "Deals_Pipeline ⌄". Mở menu chỉ có một mục Deals_Pipeline đang chọn, không có mục "sắp có".
- Màn Deals không có chức năng tạo hay chuyển pipeline. Key `pipeline` không được dùng cho trường nào khác.

AC-2: Bộ lọc nhanh và bộ lọc nâng cao (D-02)

- View "Tất cả deals" chưa chỉnh có bốn bộ lọc nhanh: Sale phụ trách, Ngày tạo, Ngày hoạt động gần nhất (khi F03-S2 đã xong), Ngày dự kiến chốt.
- Hôm nay 30/09/2026, chọn "Ngày dự kiến chốt ▾ → 30 ngày tới" → còn các deal có ngày chốt từ 30/09 đến 29/10.
- Bộ lọc Ngày tạo không có mốc "30 ngày tới".
- View đã lưu trên ERP với điều kiện "Gói Dịch Vụ Mục Tiêu Bằng PROFESSIONAL" → mở view, điều kiện vẫn áp dụng và hiện trong "Bộ lọc nâng cao (1)".

AC-3: Cột mặc định và sửa tại chỗ (D-03)

- Sau khi script đặt vị trí trường, dạng bảng của "Tất cả deals" có cột theo thứ tự: Mã Deal, Tên Deal, Giai đoạn, Amount, Ngày dự kiến chốt, Sale phụ trách, Hoạt động tiếp theo (khi F03-S2 đã xong), Ngày tạo.
- Hộp "Chỉnh sửa cột" không kéo đổi thứ tự được và có dòng "Đổi thứ tự trong Quản lý trường".
- Ngày dự kiến chốt đã qua mà deal còn mở → ô ngày có màu cảnh báo.
- Sửa Amount tại ô khi deal có line item và `use_line_items_amount = true` → ô không vào chế độ sửa, tooltip "Tính từ line items".
- Sửa trường Test tại ô bảng → không vào chế độ sửa; ở trang chi tiết thì sửa được.

AC-4: Hoạt động tiếp theo (D-04)

- F03-S2 đã xong. DEAL-013 có task chưa xong hạn 30/09 và cuộc họp 02/10 → cột hiện "Task · 30/09"; rê chuột hiện tiêu đề task và hạn.
- DEAL-004 không có hoạt động tiếp theo. Bấm "Lên lịch ▾ → Tạo task", nhập tiêu đề, hạn 03/10, lưu → ô đổi thành "Task · 03/10" mà không rời màn danh sách.
- Task chưa xong hạn 25/09, hôm nay 30/09 → hiện "Task · 25/09" kèm nhãn "Quá hạn".

AC-5: Mở rộng dòng (D-05)

- DEAL-013 có 2 contact (Hạnh – Người quyết định, Bảo – không vai trò) và công ty Thiên Phúc.
- Mở rộng dòng, chọn Contacts → bảng con có 2 dòng kèm vai trò.
- Chọn Companies → bảng con có 1 dòng Thiên Phúc.

AC-6: Thẻ board (D-06)

- DEAL-013 có công ty, ngày chốt, amount, sale phụ trách, task sắp tới → thẻ có đủ 8 phần theo thứ tự ở Phụ lục A và không có tỷ lệ thành công.
- Bấm nút Ghi chú ở chân thẻ, nhập nội dung, lưu → ghi chú gắn DEAL-013 và các contact, công ty của nó; người dùng vẫn ở màn board.
- Màn 390 px: mỗi cột rộng 82% màn hình, cuộn ngang được, chân cột vẫn đọc được.

AC-7: Chân cột board (D-07)

- Cột "1. MQL Qualified" có 25 deal (board chỉ tải 20 thẻ), tổng Amount 1.000.000.000 ₫, tổng trọng số 150.000.000 ₫ → chân cột hiện "1.000.000.000 ₫ | Tổng giá trị" và "150.000.000 ₫ (15%) | Giá trị có trọng số".
- Chân cột "5. Closed Won" có dòng thứ hai "Thắng (100%)", cột "6. Closed Lost" có "Thua (0%)". Tỷ lệ thành công trong dữ liệu các deal đó không đổi.
- Lọc Sale phụ trách = Lan Lê → tổng chỉ tính deal của Lan Lê.
- Đổi "Cột theo" sang Gói dịch vụ → chân cột có Tổng giá trị và trọng số, không có "Thắng/Thua".
- Deal có Amount trống, Tỷ lệ 50 → góp 0 vào cả hai tổng.

AC-8: Kéo thả đổi giai đoạn (D-08)

- Kéo DEAL-013 từ "3. Demo Scheduled" sang "4. Proposal Sent" → Giai đoạn là "4. Proposal Sent"; chân cả hai cột cập nhật; timeline của DEAL-013, Thiên Phúc, Hạnh, Bảo đều có sự kiện "Hoạt động Deal".
- Kéo DEAL-013 đang mở vào "5. Closed Won" → `closed_at` được ghi. Kéo ngược về "4. Proposal Sent" → `closed_at` bị xoá.
- Kéo thẻ khi API lỗi → thẻ về cột cũ, chân cột không đổi.

AC-9: Tạo deal (D-09)

- Người dùng gắn với nhân viên Minh Trần. Chọn "Thêm deals → Tạo mới", nhập Tên Deal "Gói Pro cho An Khang", chọn Company "Thực phẩm An Khang", thêm Contact "Phan Văn Tài" vai trò "Người ảnh hưởng", bấm Tạo.
- Deal được tạo với Mã Deal do hệ thống sinh, Giai đoạn "1. MQL Qualified", Sale phụ trách Minh Trần.
- Deal có trong card Deals của An Khang và của Phan Văn Tài với vai trò đúng.
- Xoá trống Tên Deal → nút Tạo vô hiệu, cạnh nút ghi "Còn 1 trường bắt buộc chưa nhập".
- Bấm "Thêm trường khác" → hiện thêm các trường nhập tay còn lại, gồm Phí thuê trả trước, Phí khởi tạo, Số tiền giảm giá, Lý do giảm, Lý do thất bại.

AC-10: Mã Deal (D-09)

- Hai người cùng bấm Tạo trong cùng một giây, cả hai request thành công → hai deal có Mã Deal khác nhau.
- 50 request tạo deal đồng thời → 50 mã khác nhau, liên tiếp.
- Deal lớn nhất là DEAL-0120 → deal tiếp theo là DEAL-0121.
- Nhập file có deal `m_deal = DEAL-0500` khi bộ đếm đang ở 121, rồi tạo deal mới từ giao diện → deal mới là DEAL-0501.
- Tạo deal gửi sẵn `m_deal` đã tồn tại → `409`.

AC-11: Điền sẵn khi tạo từ Contact, Company (D-09)

- Tạo từ Company có 3 contact, bỏ tick 1 → deal có 2 contact.
- Tạo từ Company có 35 contact → tick sẵn 20, contact có công ty này là công ty chính đứng đầu; có dòng "Còn 15 contact của công ty chưa được chọn".
- Tạo từ Contact không có công ty → tên mặc định "{full_name} - Deal mới", Company trống.
- Tạo từ Contact có owner "Đã nghỉ" → Sale phụ trách trống, có dòng "Owner hiện tại … không còn làm việc".

AC-12: Thẻ định danh (D-10)

- Trang chi tiết DEAL-013, bấm ✎ → popover chỉ có ô Tên Deal và dòng "Mã Deal là mã định danh, không đổi được."
- Bấm pill giai đoạn chọn "4. Proposal Sent", rồi bấm ngày chốt chọn 15/10/2026 → hai giá trị lưu ngay; timeline có sự kiện "Hoạt động Deal"; lịch sử thuộc tính có dòng đổi ngày chốt.
- DEAL-013 chưa có line item: bấm Amount, nhập 250000000, Enter → Amount hiện "250.000.000 ₫", timeline có sự kiện "Thay đổi thuộc tính" của Amount.
- DEAL-013 đã có line item và đang dùng tổng line item → bấm Amount không vào chế độ sửa.

AC-13: Về Deal này (D-11)

- Card "Về Deal này" có đúng các trường: Sale phụ trách, Liên hệ gần nhất (chỉ đọc, chỉ khi F03-S2 đã xong), Gói dịch vụ mục tiêu, Thời hạn thanh toán, Tỷ lệ thành công (%), Lý do thất bại.
- Card không có Amount.
- Giá trị giống bảng dữ liệu ERP.

AC-14: Sự kiện Hoạt động Deal (D-12)

- DEAL-013 liên kết Thiên Phúc và Hạnh. Minh Trần đổi giai đoạn từ "3. Demo Scheduled" sang "4. Proposal Sent" → timeline của Hạnh và Thiên Phúc có "Hoạt động Deal — Minh Trần đã chuyển DEAL-013 từ “3. Demo Scheduled” sang “4. Proposal Sent”."
- Tạo deal từ card Deals của Hạnh → timeline của Hạnh có sự kiện "{người tạo} đã tạo Deal {Mã Deal}".

AC-15: Card bên phải (D-13)

- Cột phải của DEAL-013 có theo thứ tự: Contacts (kèm vai trò), Companies (một công ty, không tag Primary), Line items, Tệp đính kèm.
- DEAL-013 thuộc Thiên Phúc. Ở card Companies chọn ⋯ → Đổi công ty → Titan Bases, xác nhận → DEAL-013 thuộc Titan Bases; card Deals của Thiên Phúc không còn DEAL-013.

AC-16: Workflow và Quản lý trường (D-14)

- Có workflow đang bật chạy được trên Deals_Pipeline. Chọn Thao tác → Kích hoạt Workflow → một workflow → Kích hoạt → workflow chạy cho DEAL-013 như trên ERP hiện tại.
- Người có quyền sửa cấu trúc chọn Thao tác → Quản lý trường dữ liệu → mở trang Quản lý trường của Deals_Pipeline.
- Hồi quy: chạy từng workflow trong 10 workflow sau khi đổi vị trí trường → kết quả như trước khi đổi.

AC-17: Nhân bản, xoá và khôi phục

- Nhân bản DEAL-013 → panel tạo điền sẵn trường, Company, Contacts, vai trò; Mã Deal trống; line item không được sao chép.
- Xoá deal có 2 line item rồi khôi phục → line item mất rồi trở lại.

AC-18: API tổng theo nhóm

- Gọi `group-summary` không có `sumField` → chỉ trả `count`.
- Gọi `group-summary` với `groupBy` là trường Văn bản → `400 GROUP_BY_INVALID`.

# PHỤ LỤC

## A. Màn hình và dữ liệu hiển thị

**Cột mặc định của bảng (D-03)**

Cột chính là Mã Deal. Các trường còn lại thêm bằng nút "+".

| # | Cột | Trường | Hiển thị |
|---|---|---|---|
| 1 | Mã Deal (cột chính) | `m_deal` | Biểu tượng và mã dạng link, nút mở rộng, nút "Xem trước" |
| 2 | Tên Deal | `t_n_deal` | Chữ thường |
| 3 | Giai đoạn | `giai_o_n_pipeline` | Pill màu theo thứ tự lựa chọn; "5. Closed Won" xanh lá, "6. Closed Lost" đỏ (theo design system HubSpot, phần pill trạng thái) |
| 4 | Amount | `t_ng_cash_in_d_ki_n` (tên trên ERP: "Tổng Cash-In Dự Kiến") | Canh phải, `1.240.000.000 ₫` |
| 5 | Ngày dự kiến chốt | `ng_y_d_ki_n_ch_t` | `dd/mm/yyyy`. Quá ngày mà deal còn mở: chữ màu cảnh báo kèm biểu tượng |
| 6 | Sale phụ trách | `owner_id` | Như cột owner ở CRM-02 |
| 7 | Hoạt động tiếp theo | `next_activity_at` và `next_activity_id` | Theo UC-2 |
| 8 | Ngày tạo | trường hệ thống | `dd/mm/yyyy HH:mm` |

**Bảng con khi mở rộng dòng (D-05)**

| Kênh | Cột của bảng con |
|---|---|
| Contacts | Tên (link), Email, Vai trò (tag) |
| Companies | Tên công ty (link), Domain, Số điện thoại |

**Thẻ deal trên board (D-06)**, từ trên xuống:

1. Mã Deal dạng link (mở trang chi tiết).
2. Tên Deal, chữ nhạt.
3. Công ty (biểu tượng toà nhà) dạng link, nếu có.
4. Ngày tạo (biểu tượng lịch có dấu tick).
5. Ngày dự kiến chốt (biểu tượng lịch), nếu có.
6. Amount in đậm (biểu tượng tiền), nếu có.
7. Sale phụ trách (biểu tượng người), nếu có.
8. Chân thẻ (có viền trên): nút Ghi chú, nút Task (mở cửa sổ soạn trên màn board), chữ Hoạt động tiếp theo như ở bảng, hoặc "— | Chưa có lịch" khi không có.

**Chân cột board (D-07)**

| Dòng | Hiển thị |
|---|---|
| Tổng giá trị | "{tổng} ₫ \| Tổng giá trị", định dạng tiền như bảng |
| Giá trị có trọng số | "{tổng trọng số} ₫ ({p}%) \| Giá trị có trọng số" |

Biểu tượng ⓘ ở dòng trọng số có tooltip "Tổng Cash-In Dự Kiến × Tỷ Lệ Thành Công (%) của từng deal". Công thức ở BR-09.

**Trường của panel "Tạo Deal" (D-09)**

| # | Trường | Key | Kiểu ô | Mặc định | Ràng buộc |
|---|---|---|---|---|---|
| 1 | Tên Deal | `t_n_deal` | Ô nhập | Theo nơi mở | Bắt buộc |
| 2 | Pipeline | (không có) | Chọn, khoá | Deals_Pipeline | Chỉ hiển thị |
| 3 | Giai đoạn Pipeline | `giai_o_n_pipeline` | Chọn | 1. MQL Qualified | Bắt buộc |
| 4 | Amount (Tổng Cash-In Dự Kiến) | `t_ng_cash_in_d_ki_n` | Ô tiền | Trống | Từ 0 trở lên |
| 5 | Ngày dự kiến chốt | `ng_y_d_ki_n_ch_t` | Chọn ngày | Trống | |
| 6 | Sale phụ trách | `owner_id` | Chọn nhân viên | Theo nơi mở | Chỉ nhân viên đang làm việc |
| 7 | Gói dịch vụ mục tiêu | `g_i_d_ch_v_m_c_ti_u` | Chọn | Trống | |
| 8 | Thời hạn thanh toán | `th_i_h_n_thanh_to_n` | Chọn | Trống | |
| 9 | Tỷ lệ thành công (%) | `t_l_th_nh_c_ng` | Ô số | Trống | 0–100 |

Dưới các ô trên có link "Thêm trường khác". Link mở ra mọi trường nhập tay còn lại của Deals_Pipeline: Phí thuê trả trước, Phí khởi tạo, Số tiền giảm giá, Lý do giảm, Lý do thất bại, trường tự tạo. Form tạo bản ghi của ERP hiện có đủ 17 trường; link này giữ chức năng đó mà không làm panel dài.

Mục "Liên kết Deal với":

- Company: chọn một công ty, có tìm (kênh một giá trị).
- Contacts: danh sách có ô tìm để thêm contact. Mỗi dòng có ô Vai trò (danh mục D-LABEL-DC, không bắt buộc) và nút gỡ.

**Điền sẵn theo nơi mở**

| Nơi mở | Tên Deal | Company | Contacts | Sale phụ trách |
|---|---|---|---|---|
| Header "Thêm deals" | Trống | Trống, chọn được | Trống, chọn được | Nhân viên gắn với tài khoản đang đăng nhập |
| Card Deals của Contact | "{Công ty chính} - Deal mới"; không có công ty thì "{full_name} - Deal mới" | Công ty chính của contact, sửa được | Contact đó, khoá; vai trò trống | Owner của contact; không có thì như header |
| Card Deals của Company | "{name} - Deal mới" | Công ty đó, khoá | Contact của công ty, tick sẵn tối đa 20, bỏ tick được | Owner của công ty; không có thì như header |

**Thẻ định danh (D-10)**

| Dòng | Hành vi |
|---|---|
| Amount | Giá trị in đậm. Bấm để sửa tại chỗ, Enter lưu, Esc huỷ. Khoá theo BR-06 |
| Ngày dự kiến chốt | Nút có biểu tượng lịch. Bấm mở bộ chọn ngày, chọn là lưu. Có nút "Xoá ngày" |
| Pipeline | Tag "Deals_Pipeline" |
| Giai đoạn | Pill giai đoạn. Bấm mở popover danh sách giai đoạn dạng pill, giai đoạn hiện tại có dấu tick. Chọn giai đoạn khác là lưu ngay |

**Card "Về Deal này" (D-11)**

Ánh xạ từ card "About this deal" của HubSpot sang trường ERP:

| HubSpot | Trường ERP | Key | Sửa tại chỗ |
|---|---|---|---|
| Deal owner | Sale phụ trách | `owner_id` | Có |
| Last contacted | Liên hệ gần nhất | `last_contacted_at` | Không (trường tính, F03-S2) |
| Deal type | Gói dịch vụ mục tiêu | `g_i_d_ch_v_m_c_ti_u` | Có |
| Priority | Thời hạn thanh toán | `th_i_h_n_thanh_to_n` | Có |
| (không có) | Tỷ lệ thành công (%) | `t_l_th_nh_c_ng` | Có, 0–100 |
| Closed lost reason | Lý do thất bại | `l_do_th_t_b_i` | Có |

Ánh xạ "Priority → Thời hạn thanh toán" không cùng nghĩa. Đây là lựa chọn giữ vị trí trường trong card cho giống HubSpot, dùng trường ERP có sẵn (câu hỏi Q5). Amount không nằm trong card này vì đã sửa được ở thẻ định danh, đúng như sheet D-10.

**Câu hiển thị của sự kiện (D-12)**

- Đổi giai đoạn: "**Hoạt động Deal** — {người thực hiện} đã chuyển {Mã Deal} từ “{giai đoạn cũ}” sang “{giai đoạn mới}”."
- Tạo, trên trang Deal: "**Đã tạo** — Deal này được tạo bởi {người thực hiện}".
- Tạo, trên trang Contact và Company: "{người thực hiện} đã tạo Deal {Mã Deal}".

**Card bên phải (D-13)**, theo thứ tự:

| # | Card | Kênh | Thẻ | Menu ⋯ | "+ Thêm" |
|---|---|---|---|---|---|
| 1 | Contacts (n) | `jn:crm_deal_contacts` | Tên (link), tên công ty chính của contact (chữ nhạt), "Email:" kèm ⧉, "Số điện thoại:", vai trò (tag) hoặc "Thêm nhãn liên kết" | Sửa vai trò, Gỡ liên kết | Tạo mới: panel tạo Contact (CRM-02), Deal điền sẵn và khoá, Company điền sẵn bằng Company của deal. Thêm có sẵn: chọn nhiều, ô vai trò chung |
| 2 | Companies (0 hoặc 1) | `field:company_id` | Tên (link), "Domain:" kèm ↗ ⧉, "Số điện thoại:". Không có tag Primary vì deal chỉ có một công ty | Đổi công ty, Gỡ liên kết | Khi đã có công ty, "+ Thêm" đổi thành "Đổi" và hỏi trước khi thay (theo CRM-01, phần card liên kết) |
| 3 | Line items | | Theo CRM-06 | | |
| 4 | Tệp đính kèm | | Theo CRM-01, phần card tệp đính kèm | | |

## B. Dữ liệu

**Cấu hình đối tượng Deals**

| Thuộc tính | Giá trị |
|---|---|
| `collection` | `Deals_Pipeline` (slug thật chờ BE xác nhận; spec viết `deals_pipeline`) |
| `label` | Deal / Deals |
| `icon` | `handshake` |
| `displayField` | `m_deal` (Mã Deal). Tên Deal hiện dòng phụ |
| `avatar` | `icon` (biểu tượng bắt tay) |
| `views` | `all` "Tất cả deals", `mine` "Deals của tôi", view đã lưu trên ERP |
| `searchFields` | `m_deal`, `t_n_deal` |
| `quickFilters` | `owner_id` (Sale phụ trách), `_createdAt` (Ngày tạo), `last_activity_at`, `ng_y_d_ki_n_ch_t` |
| `quickFiltersMore` | `giai_o_n_pipeline`, `g_i_d_ch_v_m_c_ti_u`, `th_i_h_n_thanh_to_n`, `l_do_th_t_b_i`, trường tự tạo |
| `futureDateFields` | `ng_y_d_ki_n_ch_t` (có thêm mốc tương lai) |
| `columns` | Cột mặc định ở Phụ lục A |
| `columnOrder` | `field` (BR-05) |
| `defaultSort` | `_createdAt`, giảm dần |
| `expand` | `jn:crm_deal_contacts` "Contacts", `field:company_id` "Companies" |
| `board` | Cột theo `giai_o_n_pipeline`; thẻ ở Phụ lục A |
| `defaultMode` | `board` |
| `createFields` | Trường của panel "Tạo Deal" ở Phụ lục A |
| `createAssociations` | `field:company_id` (Company), `jn:crm_deal_contacts` (Contacts) |
| `keyProps` | Card "Về Deal này" ở Phụ lục A |
| `rightCards` | `jn:crm_deal_contacts`, `field:company_id`, `ref:crm_line_items.deal_id` (card Line items, CRM-06). Card Tệp đính kèm luôn nằm cuối, do `attachmentField` bật |
| `overviewTab` | `false` (trang Deal chỉ có tab Hoạt động) |
| `actions` | Kích hoạt Workflow, Quản lý trường dữ liệu, vạch ngăn, Theo dõi, Xem tất cả thuộc tính, Xem lịch sử thuộc tính, Xem lịch sử liên kết, vạch ngăn, Nhân bản, Gộp, Xoá |
| `attachmentField` | `attachments` |

**Vị trí trường của Deals_Pipeline do script khởi tạo đặt**

Vị trí 1 là trên cùng trong Quản lý trường.

| Vị trí | Trường | Ghi chú |
|---|---|---|
| 1 | `m_deal` | Giữ |
| 2 | `t_n_deal` | Giữ |
| 3 | `giai_o_n_pipeline` | Chuyển từ vị trí 6 lên |
| 4 | `t_ng_cash_in_d_ki_n` | Chuyển từ vị trí 9 lên |
| 5 | `ng_y_d_ki_n_ch_t` | Chuyển từ vị trí 13 lên |
| 6 | `owner_id` | Mới |
| 7 | `next_activity_at` | Mới, trường tính |
| 8 | `company_id` | Mới |
| 9 | `g_i_d_ch_v_m_c_ti_u` | |
| 10 | `th_i_h_n_thanh_to_n` | |
| 11 | `t_l_th_nh_c_ng` | |
| 12 | `l_do_th_t_b_i` | |
| 13 | `ph_thu_tr_tr_c` | |
| 14 | `ph_kh_i_t_o_setup` | |
| 15 | `s_ti_n_gi_m_gi` | |
| 16 | `l_do_gi_m` | |
| 17 | `use_line_items_amount` | Mới |
| 18 | `last_activity_at` | Mới, trường tính |
| 19 | `last_contacted_at` | Mới, trường tính |
| 20 | `ng_y_c_p_nh_t_g_n_nh_t` | |
| 21 | `stage_changed_at` | Mới |
| 22 | `closed_at` | Mới |
| 23 | `attachments` | Mới |
| 24 | `next_activity_id` | Mới, trường tính, ẩn khỏi danh sách "+" |
| 25 | `line_items_total` | Mới, trường tính (CRM-06) |
| 26 | `line_items_version` | Mới, hệ thống, ẩn khỏi danh sách "+" |
| 27 | `test` | Chờ xoá (theo CRM-00, phần rà workflow) |
| 28 | `sale_ph_tr_ch` | Ngừng dùng, ẩn (theo CRM-00, chuyển đổi Sale phụ trách) |
| 29 | `lead_id` | Ngừng dùng, ẩn (theo CRM-00, chuyển đổi Lead) |

Trường hệ thống `_createdAt` (Ngày tạo) không nằm trong Quản lý trường.

Trường Test (Liên kết → NhanVien) chỉ sửa được ở trang chi tiết, giữ đúng hành vi ERP hiện tại.

**Cấu hình sự kiện F03-S3 cho Deals_Pipeline (D-12)**

- `giai_o_n_pipeline` là trường `stage`, tiêu đề sự kiện "Hoạt động Deal".
- `owner_id` và `t_ng_cash_in_d_ki_n` sinh sự kiện "Thay đổi thuộc tính".
- Sự kiện `created` và `stage_changed` lan sang Contacts (`jn:crm_deal_contacts`) và Company (`field:company_id`).

## C. API

**Tổng theo nhóm cho board (`group-summary`)**

Board cần số thẻ và tổng tiền của toàn bộ deal trong mỗi cột, trong khi mỗi cột chỉ tải 20 thẻ đầu.

Đây là API của tầng dữ liệu F03 và dùng cho mọi board của CRM-01. Đặc tả đặt tạm ở đây vì Deals là màn đầu tiên cần tổng tiền. Khi có spec nền cho board hoặc F14-S1, phần này chuyển sang đó và giữ nguyên hợp đồng.

```
GET /api/v1/collections/:slug/group-summary
    ?groupBy=giai_o_n_pipeline
    &sumField=t_ng_cash_in_d_ki_n
    &weightField=t_l_th_nh_c_ng
    &filter[...]=...&batch=...   (cùng tham số lọc với danh sách)
```

```json
{
  "status": "success",
  "data": [
    { "value": "1. MQL Qualified", "count": 12, "sum": 540000000, "weightedSum": 54000000 },
    { "value": "5. Closed Won",    "count": 4,  "sum": 612000000, "weightedSum": 612000000 },
    { "value": null,               "count": 3,  "sum": 0,         "weightedSum": 0 }
  ]
}
```

- `groupBy` bắt buộc, phải là trường Lựa chọn đơn.
- API nhận đủ tham số lọc của API danh sách: `filter` (kể cả `linked_to_me` của F03-S1 và điều kiện `_or … contains` mà ô tìm kiếm của CRM-01 sinh ra) và `batch` (của F03-S3). Kết quả luôn khớp với danh sách cùng tham số.
- `count` luôn có. `sum` chỉ có khi gửi `sumField` (trường Số hoặc Tiền tệ).
- `weightedSum` = tổng (`sumField` × `weightField` ÷ 100), chỉ có khi gửi cả hai. Giá trị trống tính là 0.
- Dòng `value: null` là số bản ghi trống trường nhóm, dùng cho dòng "… bản ghi chưa có … không hiển thị trên board" của CRM-01.
- Chỉ đếm bản ghi người gọi đọc được.
- Contacts, Companies chỉ cần `count`.

| Tình huống | Mã lỗi |
|---|---|
| `groupBy` thiếu hoặc không phải Lựa chọn đơn | `400 GROUP_BY_INVALID` |
| `sumField` hoặc `weightField` không phải Số/Tiền tệ | `400 SUM_FIELD_INVALID` |
| Trường không tồn tại | `404 FIELD_NOT_FOUND` |

**Bộ đếm Mã Deal**

- Khi request tạo không gửi `m_deal`, máy chủ sinh mã dạng `DEAL-{n}`. `n` là số tăng dần, đệm 0 cho đủ 4 chữ số (`DEAL-0021`); từ 10.000 trở đi không đệm.
- `n` lấy từ một bộ đếm riêng của collection, tăng nguyên tử, để hai người tạo cùng lúc không bị trùng mã.
- Giá trị khởi đầu = số lớn nhất trong các Mã Deal dạng `DEAL-{n}` đang có + 1. Mã cũ không theo dạng này được giữ nguyên và bỏ qua khi tính (theo CRM-00, phần chuyển đổi Mã Deal).
- Request gửi sẵn `m_deal` (nhập file, API) thì dùng giá trị đó. Trùng mã có sẵn thì trả `409`.
- Mã gửi sẵn có dạng `DEAL-{n}` với `n` lớn hơn hoặc bằng giá trị kế tiếp của bộ đếm: máy chủ nâng bộ đếm lên `n + 1` trong cùng giao dịch, để mã sinh sau này không đụng mã vừa nhập.
- `m_deal` cần cờ Duy nhất trên ERP. Cờ chỉ bật sau khi dữ liệu cũ đã hết mã trùng và mã rỗng.
- F03 chưa có bộ đếm nguyên tử (F03 ghi "Atomic counter" ở mục MVP Excluded). Việc này cần BE xác nhận trước khi làm (câu hỏi Q2).

**API khác dùng trong spec**

| Việc | API |
|---|---|
| Tạo deal kèm liên kết | F03-S1, tạo bản ghi kèm liên kết trong một giao dịch (tối đa 50 liên kết) |
| Sự kiện "Đã tạo", "Hoạt động Deal" | F03-S3, cấu hình và lan sự kiện |
| Từ chối ghi Amount khi đang khoá | `422 AMOUNT_LOCKED` (F03-S2) |

## D. Lệch so với sheet / prototype

**Ưu tiên và phạm vi theo sheet**

| ID | Tính năng | Ưu tiên | Phạm vi sheet |
|---|---|---|---|
| D-01 | Header và pipeline | P0 | Chỉ FE |
| D-02 | Bộ lọc nhanh | P0 | Chỉ FE |
| D-03 | Cột mặc định | P0 | ERP có sẵn |
| D-04 | Cột Hoạt động tiếp theo | P1 | FE + BE |
| D-05 | Mở rộng dòng | P1 | Chỉ FE |
| D-06 | Thẻ board | P0 | Chỉ FE |
| D-07 | Chân cột board | P1 | ERP có sẵn |
| D-08 | Kéo thả đổi giai đoạn | P0 | ERP có sẵn |
| D-09 | Tạo deal | P0 | FE + BE |
| D-10 | Thẻ định danh | P0 | Chỉ FE |
| D-11 | Về Deal này | P0 | ERP có sẵn |
| D-12 | Sự kiện Hoạt động Deal | P1 | FE + BE |
| D-13 | Card bên phải | P0 | Chỉ FE |
| D-14 | Workflow và Quản lý trường | P1 | ERP có sẵn |
| D-15 | Nhiều pipeline | P2 | FE + BE (chưa làm) |

**Lệch so với sheet, cần PO xác nhận**

Ba mục sheet ghi "ERP có sẵn" nhưng thực tế cần BE làm thêm. Đề nghị sửa cột Phạm vi trong sheet:

| ID | Sheet ghi | Cần làm thêm | Nên ghi |
|---|---|---|---|
| D-03 | ERP có sẵn | Script đặt lại vị trí trường (Phụ lục B) | FE + BE (script) |
| D-07 | ERP có sẵn | API tổng theo nhóm trên toàn bộ dữ liệu khớp bộ lọc (Phụ lục C) | FE + BE |
| D-08 | ERP có sẵn | Kéo thả đã có; sự kiện "Hoạt động Deal", `stage_changed_at`, `closed_at` là mới (F03-S3, CRM-00) | FE + BE |

- D-03: sheet ghi "thứ tự cột theo thứ tự trường ERP". Spec giữ quy tắc đó cho Deals, khác với Contacts và Companies (câu hỏi Q1).
- D-15: chưa làm trong giai đoạn này (BR-03).

**Prototype giả lập, bản thật khác**

| Trong prototype | Bản thật |
|---|---|
| Mã Deal sinh ở FE bằng số lượng deal + 1 | Máy chủ sinh bằng bộ đếm nguyên tử |
| Tạo deal từ Contact tự gán vai trò "Người quyết định" | Vai trò trống |
| Tạo deal từ Company gắn mọi contact, không bỏ chọn được | Tick sẵn, bỏ tick được |
| Chân cột cộng trên dữ liệu đã tải ở trình duyệt | API `group-summary` trên toàn bộ dữ liệu khớp bộ lọc |
| Hoạt động tiếp theo tính ở FE mỗi lần vẽ | Trường tính `next_activity_at`, `next_activity_id` (F03-S2) |
| Sự kiện "Hoạt động Deal" ghi ở FE, gắn contact đang liên kết | Máy chủ ghi, lan theo cấu hình (F03-S3) |
| Owner là chuỗi `sale_ph_tr_ch` | `owner_id` |
| Liên kết Deal lưu ở `dealLinks` | `company_id` và `crm_deal_contacts` |
| Card Companies trên Deal có tag "Primary" | Không có tag (một công ty) |
| Tỷ lệ thành công mặc định 10 khi tạo từ card | Để trống |
| Bộ lọc, cột ẩn, bề rộng cột lưu `localStorage` | Bộ lọc, cột ẩn, bề rộng cột lưu trong View của ERP; mật độ bảng lưu theo người dùng (F03-S4) |

## E. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai |
|---|---|---|
| Q1 | Deals giữ quy tắc "thứ tự cột = thứ tự trường" (sheet D-03) trong khi Contacts, Companies cho kéo đổi thứ tự theo view. Chấp nhận khác nhau, hay cho Deals kéo đổi luôn? | PO / khách |
| Q2 | BE làm được bộ đếm nguyên tử để sinh Mã Deal không? Nếu chưa, dùng phương án ô Mã Deal bắt buộc. | BE |
| Q3 | Kéo vào "6. Closed Lost" có cần bắt nhập Lý do thất bại không? | Khách |
| Q4 | API Kanban hiện có của ERP đã trả số bản ghi mỗi cột chưa? Nếu có, `group-summary` chỉ cần bổ sung tổng tiền. | BE |
| Q5 | Ánh xạ "Priority → Thời hạn thanh toán" trong card "Về Deal này" có hợp với khách không, hay bỏ vị trí đó? | Khách |

Việc cần kiểm thêm (không phải câu hỏi cho khách): BA kiểm lại Tên Deal và Giai đoạn Pipeline có cờ Bắt buộc trên ERP hay không (khảo sát 23/09 không ghi); BE xác nhận slug thật của `Deals_Pipeline`.

## F. Tài liệu liên quan

- Prototype: `crm-giao-dich-hubspot.html` (danh sách, board), `crm-record-hubspot.html?type=deal&id=r013` (trang chi tiết), `crm-shared.js`
- Nguồn HubSpot: portal 247428660, màn Deals, khảo sát 24/09 và 29/09/2026
- Plan: `00-PLAN-viet-spec.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` (trường của Deals, chuyển đổi dữ liệu, rà workflow)
- Khung: `CRM-01-khung-danh-sach-trang-chi-tiet.md`
- Màn liên quan: `CRM-02-contacts.md`, `CRM-03-companies.md`, `CRM-05` (cửa sổ soạn hoạt động, timeline), `CRM-06` (card Line items)
- Spec nền: `F03-S1-lien-ket-ban-ghi.md`, `F03-S2` (Ngày hoạt động gần nhất, Hoạt động tiếp theo, Liên hệ gần nhất), `F03-S3-nhat-ky-thay-doi-su-kien.md`, `F03-S4` (trạng thái giao diện theo người dùng)
- Design system: `DESIGN-SYSTEM-HUBSPOT.md` (pill trạng thái)
- Đối chiếu chức năng: `DOI-CHIEU-CHUC-NANG.md`, phần Deals

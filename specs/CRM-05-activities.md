# CRM-05 — Activities: cửa sổ soạn và timeline

# Product Requirement Document

| | | | |
|---|---|---|---|
| **Project Owner** | TTS | **Update at** | 02-10-2026 |
| **Created by** | TTS (qua Claude) | **Project** | CRM theo UX HubSpot — HarnexAI ERP |
| **Version** | 2.0 | **Features** | A-01 → A-16 (giao diện hoạt động: cửa sổ soạn và timeline) |

**CONTENT**

- USER STORIES
- OVERVIEW FLOW
- USE CASE DESCRIPTION
  - UC-1: Mở cửa sổ soạn, soạn nội dung và lưu
  - UC-2: Chọn bản ghi liên kết và tạo task theo dõi
  - UC-3: Tạo ghi chú
  - UC-4: Tạo task có nhắc nhở và lặp lại
  - UC-5: Ghi lại cuộc gọi
  - UC-6: Ghi lại cuộc họp và lên lịch cuộc họp
  - UC-7: Xem timeline theo tab
  - UC-8: Lọc, tìm và thu gọn timeline
  - UC-9: Xem thẻ hoạt động và ghim, sửa, xoá
  - UC-10: Hoàn thành và mở lại task
  - UC-11: Bình luận trên hoạt động
- BUSINESS RULE
- ACCEPTANCE CRITERIA
- PHỤ LỤC

**VERSION HISTORY**

| **Ver** | **Author** | **Description** | **Updated at** |
|---|---|---|---|
| 2.0 | TTS (qua Claude) | Viết lại theo mẫu PRD: user story, use case, business rule, acceptance criteria. Nội dung giữ như bản 1.x | 02-10-2026 |
| 1.x | TTS (qua Claude) | Các bản trước 02-10-2026 (v1.0, bản đầu, 30-09-2026) | 30-09-2026 |

---

# USER STORIES

US-ACT-01: Là sale, tôi muốn mở một cửa sổ soạn ở góc màn hình mà vẫn xem được trang phía sau, để vừa đọc thông tin khách vừa ghi. (A-01, A-02)

US-ACT-02: Là sale, tôi muốn một hoạt động được gắn sẵn với contact, công ty và deal liên quan, để cả đội thấy nó ở mọi bản ghi đó. (A-03)

US-ACT-03: Là sale, tôi muốn tạo luôn một task theo dõi khi ghi lại ghi chú, cuộc gọi hoặc cuộc họp, để không quên bước tiếp theo. (A-04)

US-ACT-04: Là sale, tôi muốn ghi nhanh một ghi chú trên bản ghi, để lưu lại điều vừa biết về khách. (A-05)

US-ACT-05: Là sale, tôi muốn tạo task có hạn, nhắc nhở và chu kỳ lặp, để việc định kỳ không bị bỏ sót. (A-06, A-07)

US-ACT-06: Là sale, tôi muốn ghi lại cuộc gọi và cuộc họp đã diễn ra, và lên lịch cuộc họp sắp tới, để lịch sử làm việc với khách đầy đủ. (A-08, A-09, A-10)

US-ACT-07: Là sale, tôi muốn xem timeline của bản ghi theo từng loại hoạt động, lọc theo loại, thời gian, người thực hiện, để tìm nhanh việc cần xem. (A-11, A-12)

US-ACT-08: Là sale, tôi muốn ghim, sửa, xoá hoạt động và xem các bản ghi liên kết ngay trên thẻ. (A-13)

US-ACT-09: Là sale, tôi muốn tick hoàn thành task ngay trên timeline, để không phải mở biểu mẫu. (A-14)

US-ACT-10: Là quản lý kinh doanh, tôi muốn bình luận trên ghi chú và task của sale, để trao đổi ngay tại chỗ. (A-16)

US-ACT-11: Là người dùng, tôi muốn thấy rõ email, SMS, gọi trực tiếp chưa có trong giai đoạn này, để không bấm nhầm rồi chờ. (A-15)

# OVERVIEW FLOW

| **Bước** | **Tác nhân** | **Mô tả** |
|---|---|---|
| 1 | Người dùng | Mở trang chi tiết Contact, Company hoặc Deal, tab "Hoạt động". |
| 2 | Hệ thống | Hiện timeline: hàng tab loại hoạt động, thanh công cụ, mục ghim, nhóm "Sắp tới", các nhóm theo tháng. |
| 3 | Người dùng | Bấm một nút nhanh hoặc nút theo tab để mở cửa sổ soạn (Ghi chú, Task, Cuộc gọi, Cuộc họp). |
| 4 | Hệ thống | Mở cửa sổ soạn ở góc phải dưới, tick sẵn các bản ghi liên kết được gợi ý. |
| 5 | Người dùng | Điền biểu mẫu, soạn nội dung, tuỳ chọn tick "Tạo task" để theo dõi, rồi bấm nút chính. |
| 6 | Máy chủ | Lưu hoạt động, gắn với các bản ghi đã tick, tạo task theo dõi nếu có. |
| 7 | Hệ thống | Đóng cửa sổ, hiện toast, tải lại timeline và các vùng liên quan. |
| 8 | Người dùng | Đổi tab, lọc, tìm, thu gọn hoặc mở thẻ trên timeline. |
| 9 | Người dùng | Trên thẻ: ghim, sửa, xoá, xem liên kết, tick hoàn thành task, bình luận. |
| 10 | Hệ thống | Cập nhật thẻ và timeline theo thao tác. |

# USE CASE DESCRIPTION

## UC-1: Mở cửa sổ soạn, soạn nội dung và lưu (A-01, A-02)

| | |
|---|---|
| **Actor** | Người dùng tạo được bản ghi `crm_activities` và đọc được bản ghi chủ |
| **Trigger** | Bấm một trong các nơi mở cửa sổ soạn (Phụ lục A, bảng "Nơi mở cửa sổ soạn") |
| **Pre-condition** | Đang ở trang chi tiết Contact, Company, Deal hoặc danh sách Deals |
| **Main Flow** | 1. Hệ thống mở cửa sổ soạn dính đáy màn hình, cách mép phải 16 px, rộng 500 px. Trang phía sau vẫn cuộn và bấm được.<br>2. Hệ thống hiện thanh tiêu đề: nút ⌄ thu gọn, tên cửa sổ, nút ⛶ phóng to/thu nhỏ, nút ✕ đóng.<br>3. Hệ thống hiện phần thân từ trên xuống: phần riêng theo loại, dòng báo lỗi (ẩn khi không có lỗi), "Liên kết với N bản ghi ▾", dòng task theo dõi, chân có nút chính.<br>4. Người dùng gõ nội dung vào ô soạn thảo và dùng thanh định dạng dưới ô: Đậm, Nghiêng, Gạch chân, Xoá định dạng, Danh sách chấm, Danh sách số.<br>5. Người dùng có thể bấm ⌄ để thu cửa sổ còn thanh tiêu đề rộng 320 px, bấm vào thanh để mở lại; hoặc bấm ⛶ để phóng to 860 px ở giữa màn hình.<br>6. Người dùng bấm nút chính hoặc nhấn Ctrl+Enter (⌘+Enter trên Mac).<br>7. Nút chính chuyển sang trạng thái đang lưu, không bấm được lần hai.<br>8. Máy chủ lưu hoạt động.<br>9. Hệ thống đóng cửa sổ, hiện toast "Đã lưu {loại}" và tải lại timeline cùng các vùng liên quan (BR-14). |
| **Post-condition** | Hoạt động được lưu và hiện trên timeline của mọi bản ghi liên kết. |
| **Exception Flow** | 1a. Đang có một cửa sổ soạn khác có nội dung chưa lưu → hỏi "Bỏ nội dung đang soạn? Nội dung chưa lưu sẽ mất." với hai nút "Bỏ" và "Tiếp tục soạn". Cửa sổ cũ rỗng thì thay luôn.<br>1b. Màn hẹp dưới 600 px → cửa sổ chiếm toàn màn hình, không có nút phóng to.<br>4a. Dán nội dung từ nơi khác → giữ đậm, nghiêng, gạch chân, danh sách; bỏ màu, cỡ chữ, bảng, ảnh.<br>4b. Còn dưới 1.000 ký tự → hiện bộ đếm, ví dụ "Còn 850 ký tự". Vượt giới hạn 20.000 ký tự → nút chính vô hiệu.<br>6a. Người dùng bấm ✕, nhấn Esc hoặc rời trang khi có nội dung chưa lưu → hỏi "Bỏ nội dung đang soạn?" như 1a. Không có nội dung thì đóng luôn.<br>6b. Tải lại trình duyệt khi có nội dung chưa lưu → hộp xác nhận mặc định của trình duyệt.<br>8a. Lưu lỗi → giữ cửa sổ và nội dung, hiện lỗi tiếng Việt từ API ở dòng báo lỗi.<br>9a. Có task theo dõi → toast "Đã lưu {loại} và task theo dõi". |

## UC-2: Chọn bản ghi liên kết và tạo task theo dõi (A-03, A-04)

| | |
|---|---|
| **Actor** | Người dùng đang soạn một hoạt động |
| **Trigger** | Cửa sổ soạn vừa mở ở chế độ tạo mới |
| **Pre-condition** | Có bản ghi chủ (bản ghi đang mở, hoặc deal của dòng trên danh sách Deals) |
| **Main Flow** | 1. FE gọi gợi ý liên kết với bản ghi chủ (F03-S6, gợi ý liên kết).<br>2. Hệ thống tick sẵn tất cả gợi ý và hiện dòng "Liên kết với 3 bản ghi ▾".<br>3. Người dùng bấm dòng đó để mở danh sách. Mỗi dòng có checkbox, biểu tượng đối tượng, tên bản ghi, loại (Contact / Company / Deal) chữ nhạt.<br>4. Người dùng bỏ tick bản ghi không muốn gắn, hoặc gõ ô "Thêm bản ghi…" ở cuối danh sách để gắn thêm bản ghi ngoài gợi ý.<br>5. Với Ghi chú, Cuộc gọi, Cuộc họp: hệ thống hiện dòng ☐ "Tạo task" [loại task ▾] "để theo dõi" [mốc ▾], mặc định không tick.<br>6. Người dùng tick, chọn loại task (To-do / Gọi điện / Email) và mốc (mặc định "sau 3 ngày làm việc").<br>7. Người dùng lưu hoạt động (UC-1).<br>8. FE gửi `followUpTask` kèm hoạt động. Máy chủ đặt tiêu đề, người thực hiện và liên kết cho task. |
| **Post-condition** | Hoạt động chỉ hiện trên timeline của các bản ghi còn tick. Task theo dõi nằm ở nhóm "Sắp tới", hạn 08:00 của ngày theo mốc. |
| **Exception Flow** | 4a. Bỏ tick hết, còn 0 bản ghi → nút chính vô hiệu, dòng báo lỗi ghi "Chọn ít nhất một bản ghi để liên kết".<br>4b. Bỏ tick một contact đang nằm ở ô "Đã liên hệ" hoặc "Người tham dự" → contact đó bị bỏ luôn ở ô người.<br>5a. Đang tạo Task hoặc đang sửa hoạt động → không có dòng task theo dõi.<br>1a. Đang sửa hoạt động → danh sách là liên kết hiện có, không gọi gợi ý lại. |

## UC-3: Tạo ghi chú (A-05)

| | |
|---|---|
| **Actor** | Người dùng có quyền ghi hoạt động |
| **Trigger** | Bấm nút nhanh "Ghi chú", nút "Tạo ghi chú" ở tab Ghi chú, hoặc mục Ghi chú trong "Tạo hoạt động ▾" |
| **Pre-condition** | Đang ở trang chi tiết bản ghi |
| **Main Flow** | 1. Hệ thống mở cửa sổ "Ghi chú". Dòng đầu ghi "Cho" và tag tên bản ghi chủ.<br>2. Người dùng nhập nội dung vào ô soạn thảo (chữ gợi ý "Bắt đầu nhập để ghi chú…").<br>3. Người dùng bấm "Tạo ghi chú".<br>4. Hệ thống lưu, đóng cửa sổ, hiện toast "Đã lưu ghi chú".<br>5. Thẻ Ghi chú "bởi {người tạo}" đứng đầu nhóm tháng hiện tại trên timeline. |
| **Post-condition** | Ghi chú có trên timeline của các bản ghi liên kết. |
| **Exception Flow** | 3a. Nội dung rỗng → dòng báo lỗi "Nhập nội dung ghi chú", con trỏ vào ô soạn thảo, không gọi API. |

## UC-4: Tạo task có nhắc nhở và lặp lại (A-06, A-07)

| | |
|---|---|
| **Actor** | Người dùng có quyền ghi hoạt động |
| **Trigger** | Bấm nút nhanh "Task", nút "Tạo task" ở tab Task, mục Task trong "Tạo hoạt động ▾" hoặc trong "Lên lịch ▾" ở danh sách Deals |
| **Pre-condition** | Có bản ghi chủ |
| **Main Flow** | 1. Hệ thống mở cửa sổ "Task" với các ô theo Phụ lục A, bảng "Biểu mẫu Task".<br>2. Người dùng nhập Tên task.<br>3. Người dùng chọn Ngày thực hiện (mặc định "Sau 3 ngày làm việc", 08:00) và giờ.<br>4. Người dùng chọn Gửi nhắc nhở (mặc định "Không nhắc") và Lặp lại (mặc định "Không lặp").<br>5. Người dùng chọn Loại task, Ưu tiên, Hàng đợi, Người thực hiện. Người thực hiện mặc định là nhân viên gắn với tài khoản đang đăng nhập.<br>6. Người dùng nhập Ghi chú nếu cần, rồi bấm "Tạo".<br>7. Hệ thống lưu. Task nằm ở nhóm "Sắp tới" trên timeline.<br>8. Tới giờ nhắc, người thực hiện nhận thông báo chuông "Nhắc việc: …". Thẻ task có biểu tượng chuông.<br>9. Với task lặp: khi task được đánh dấu xong, máy chủ tạo task kỳ tiếp (UC-10). |
| **Post-condition** | Task được lưu với hạn, người thực hiện, nhắc nhở và chu kỳ lặp đã chọn. |
| **Exception Flow** | 2a. Tên trống → "Nhập tên task".<br>3a. Chọn "Chọn ngày…" → hiện ô chọn ngày.<br>3b. Ngày trong quá khứ → được phép, hiện chữ nhỏ "Ngày này đã qua".<br>4a. Chọn nhắc khi người thực hiện chưa có tài khoản ERP → chữ nhỏ dưới ô "{tên} chưa có tài khoản ERP nên sẽ không nhận được nhắc".<br>4b. Chọn lặp → chữ nhỏ "Task kỳ tiếp được tạo khi task này được đánh dấu xong".<br>5a. Danh mục Hàng đợi rỗng → không có ô Hàng đợi.<br>5b. Người dùng chưa gắn nhân viên → ô Người thực hiện trống, bắt buộc chọn. Chưa chọn mà bấm "Tạo" → "Chọn người thực hiện". |

## UC-5: Ghi lại cuộc gọi (A-08)

| | |
|---|---|
| **Actor** | Người dùng có quyền ghi hoạt động |
| **Trigger** | Bấm nút nhanh "Gọi", mục "Ghi lại cuộc gọi" trong menu "Thêm", nút "Ghi lại cuộc gọi" ở tab Cuộc gọi, hoặc mục Cuộc gọi trong "Tạo hoạt động ▾" |
| **Pre-condition** | Đang ở trang chi tiết bản ghi |
| **Main Flow** | 1. Hệ thống mở cửa sổ "Ghi lại cuộc gọi" với các ô theo Phụ lục A, bảng "Biểu mẫu Ghi lại cuộc gọi".<br>2. Hệ thống chọn sẵn người ở ô "Đã liên hệ" theo bản ghi chủ (BR-07).<br>3. Người dùng chọn thêm hoặc bỏ contact ở ô "Đã liên hệ".<br>4. Người dùng chọn Kết quả cuộc gọi, Hướng cuộc gọi, Thời điểm (mặc định là thời điểm mở cửa sổ).<br>5. Người dùng nhập nội dung (chữ gợi ý "Bắt đầu nhập để ghi lại cuộc gọi…") và bấm "Ghi lại cuộc gọi".<br>6. Hệ thống lưu. Thẻ cuộc gọi ghi "Đã liên hệ: {tên}". |
| **Post-condition** | Cuộc gọi hiện trên timeline của bản ghi chủ và của mọi contact đã liên hệ. |
| **Exception Flow** | 4a. Để trống Kết quả, Hướng → vẫn hợp lệ. Chỉ Thời điểm là bắt buộc.<br>2a. Danh sách người rỗng (ví dụ deal chưa có contact) → dòng "Chưa có contact liên kết" và ô tìm. |

## UC-6: Ghi lại cuộc họp và lên lịch cuộc họp (A-09, A-10)

| | |
|---|---|
| **Actor** | Người dùng có quyền ghi hoạt động |
| **Trigger** | Ghi lại: mục "Ghi lại cuộc họp" trong menu "Thêm", nút "Ghi lại cuộc họp" ở tab Cuộc họp. Lên lịch: nút nhanh "Họp", nút "Lên lịch cuộc họp" ở tab Cuộc họp, mục Lên lịch cuộc họp trong "Lên lịch ▾" ở danh sách Deals |
| **Pre-condition** | Có bản ghi chủ |
| **Main Flow** | 1. Trường hợp ghi lại cuộc họp:<br>1.1. Hệ thống mở cửa sổ "Ghi lại cuộc họp" (Phụ lục A, bảng "Biểu mẫu Ghi lại cuộc họp"). Không có ô tiêu đề.<br>1.2. Hệ thống chọn sẵn Người tham dự theo bản ghi chủ (BR-07). Bắt đầu mặc định là thời điểm mở cửa sổ, Thời lượng 15 phút.<br>1.3. Người dùng chọn người, Kết quả cuộc họp, nhập nội dung, bấm "Ghi lại cuộc họp".<br>1.4. Máy chủ đặt tiêu đề "Cuộc họp".<br>2. Trường hợp lên lịch cuộc họp:<br>2.1. Hệ thống mở cửa sổ "Lên lịch cuộc họp". Có ô Tiêu đề cuộc họp ở trên cùng.<br>2.2. Kết quả mặc định "Đã lên lịch". Bắt đầu mặc định 10:00 ngày mai. Thời lượng mặc định 30 phút.<br>2.3. Người dùng nhập tiêu đề, chọn người, chỉnh giờ, bấm "Lưu lịch họp".<br>2.4. Cuộc họp nằm ở nhóm "Sắp tới". |
| **Post-condition** | Cuộc họp được lưu trong ERP. Hệ thống không gửi lời mời, không đồng bộ lịch Google, Outlook. |
| **Exception Flow** | 2.3a. Tiêu đề trống → "Nhập tiêu đề cuộc họp".<br>2.3b. Bắt đầu trong quá khứ → chữ nhỏ "Thời điểm này đã qua. Nếu cuộc họp đã diễn ra, hãy dùng Ghi lại cuộc họp." Vẫn cho lưu.<br>1.2a. Trang Company → không chọn sẵn ai. |

## UC-7: Xem timeline theo tab (A-11, A-15)

| | |
|---|---|
| **Actor** | Người dùng đọc được bản ghi |
| **Trigger** | Mở tab "Hoạt động" ở cột giữa trang chi tiết, hoặc mở link có `?tab=activities&atab=…` |
| **Pre-condition** | Trang chi tiết mở được |
| **Main Flow** | 1. Hệ thống hiện hàng tab: Tất cả hoạt động, Ghi chú, Email, Cuộc gọi, Task, Cuộc họp.<br>2. Hệ thống hiện thanh công cụ 1: ô "Tìm hoạt động", nút theo tab, "Thu gọn tất cả ▾" bên phải.<br>3. Ở tab Tất cả, hệ thống hiện thêm thanh công cụ 2 là hàng bộ lọc (UC-8).<br>4. Hệ thống gọi API timeline và hiện mục ghim, nhóm "Sắp tới", rồi các nhóm theo tháng ("Tháng 9 năm 2026").<br>5. Người dùng bấm một tab loại.<br>6. Hệ thống gọi lại API với `tab` tương ứng, giữ chữ trong ô tìm, đổi nút trên thanh công cụ theo Phụ lục A, bảng "Tab và nút theo tab".<br>7. Người dùng bấm "Xem thêm hoạt động" khi còn trang sau. Hệ thống nối trang tiếp vào cuối. |
| **Post-condition** | Tab con đang mở ghi vào URL (`atab`). Ô tìm và bộ lọc không ghi vào URL, không nhớ khi rời trang. |
| **Exception Flow** | 4a. Đang tải lần đầu → skeleton 4 thẻ.<br>4b. Không có mục nào → câu trạng thái rỗng theo Phụ lục A.<br>4c. Lỗi tải → "Không tải được hoạt động." và nút "Thử lại".<br>5a. Bấm tab Email → không gọi API, hiện "Gửi và ghi email chưa có trong giai đoạn này."; hai nút "Ghi lại email", "Soạn email" vô hiệu, tooltip "Email chưa có trong giai đoạn này".<br>6a. Tab Cuộc gọi → nút "Gọi điện" vô hiệu, tooltip "Gọi trực tiếp cần tổng đài, chưa có trong giai đoạn này. Dùng Ghi lại cuộc gọi."<br>4d. Nhóm "Sắp tới" có hơn 20 việc → cuối nhóm có "Xem thêm việc sắp tới ({còn lại})", tải tiếp ngay trong nhóm.<br>2a. Người không tạo được hoạt động → không có nút theo tab. |

## UC-8: Lọc, tìm và thu gọn timeline (A-12)

| | |
|---|---|
| **Actor** | Người dùng đọc được bản ghi |
| **Trigger** | Bấm một chip lọc ở tab Tất cả, gõ ô "Tìm hoạt động", hoặc bấm "Thu gọn tất cả ▾" |
| **Pre-condition** | Đang ở tab "Hoạt động" |
| **Main Flow** | 1. Người dùng bấm chip "Hoạt động ({x}/9) ▾". Hệ thống mở popover có ô tìm, dòng "Chọn tất cả" và ba cột nhóm: Giao tiếp, Hoạt động nhóm, Cập nhật.<br>2. Người dùng tick các loại muốn xem. Chip đổi số `x`, nổi bật và có nút ✕ khi ít hơn 9.<br>3. Người dùng bấm chip "Mọi thời gian ▾" và chọn một mốc. Chip đổi chữ theo mốc.<br>4. Người dùng bấm chip "Người thực hiện ▾" và tick nhân viên. Chip hiện "Người thực hiện (2)".<br>5. Người dùng gõ ô tìm. FE gửi `q` sau khi ngừng gõ 300 ms.<br>6. Hệ thống tải lại timeline theo lựa chọn.<br>7. Người dùng bấm "Xoá tất cả" để đưa ba chip về mặc định. Chữ trong ô tìm giữ nguyên.<br>8. Người dùng chọn "Thu gọn tất cả". Mọi thẻ chỉ còn phần đầu, menu đổi thành "Mở rộng tất cả". |
| **Post-condition** | Timeline chỉ hiện mục khớp bộ lọc và ô tìm. Không thay đổi dữ liệu. |
| **Exception Flow** | 2a. Bỏ tick hết → timeline rỗng, "Không có hoạt động phù hợp bộ lọc."<br>6a. Có lọc hoặc tìm, không khớp → "Không có hoạt động phù hợp bộ lọc." và link "Xoá tất cả".<br>7a. Không có bộ lọc nào khác mặc định → không có link "Xoá tất cả".<br>1a. Đang ở tab khác "Tất cả" → không có bộ lọc loại, khoảng thời gian, người thực hiện. Ô tìm vẫn dùng được.<br>8a. Sau khi thu gọn tất cả, bấm một thẻ → chỉ thẻ đó mở. |

## UC-9: Xem thẻ hoạt động và ghim, sửa, xoá (A-13)

| | |
|---|---|
| **Actor** | Người dùng đọc được bản ghi. Ghim, sửa, xoá theo `can` của từng mục |
| **Trigger** | Bấm vào thẻ, bấm "Thao tác ▾" hoặc "{n} liên kết ▾" trên thẻ |
| **Pre-condition** | Timeline đã tải |
| **Main Flow** | 1. Hệ thống hiện phần đầu thẻ: biểu tượng, tiêu đề theo loại, thời điểm dạng `30/09/2026 lúc 09:15`, nút "Thao tác ▾" (không có ở sự kiện).<br>2. Người dùng bấm vùng trống của phần đầu để thu gọn hoặc mở thẻ.<br>3. Hệ thống hiện phần thân: dòng thông tin theo loại, nội dung, chân thẻ có "{n} liên kết ▾" và "Bình luận ({n})".<br>4. Người dùng bấm "{n} liên kết ▾". Hệ thống hiện tên các bản ghi liên kết dạng link, cách nhau bằng " · ".<br>5. Trường hợp ghim: người dùng chọn "Thao tác ▾ → Ghim lên đầu". Thẻ lên đầu timeline với dải "Đã ghim", toast "Đã ghim lên đầu timeline".<br>6. Trường hợp sửa: người dùng chọn "Sửa". Hệ thống mở cửa sổ soạn cùng loại, tên "Sửa {loại}", điền giá trị hiện có, nút chính "Lưu" và nút "Huỷ". Lưu xong toast "Đã lưu thay đổi".<br>7. Trường hợp xoá: người dùng chọn "Xoá". Hệ thống hỏi "Hoạt động này sẽ bị xoá khỏi mọi bản ghi liên kết. Có thể khôi phục trong 30 ngày." với nút đỏ "Xoá". Xác nhận thì thẻ biến mất, toast "Đã xoá hoạt động". |
| **Post-condition** | Ghim: mỗi bản ghi chỉ có một hoạt động ghim. Sửa: thẻ hiện nội dung mới. Xoá: hoạt động biến khỏi timeline của mọi bản ghi liên kết, khôi phục được trong 30 ngày. |
| **Exception Flow** | 3a. Nội dung dài hơn 8 dòng → cắt, kèm "Xem thêm".<br>3b. Không có liên kết nào khác bản ghi đang mở (n = 0) → ẩn "{n} liên kết ▾".<br>5a. Bản ghi đã có hoạt động ghim khác → hoạt động cũ tự bỏ ghim, về vị trí theo thời gian.<br>5b. Thẻ đang ghim → mục menu là "Bỏ ghim", toast "Đã bỏ ghim".<br>6a. Đang sửa → không có dòng task theo dõi; danh sách liên kết là liên kết hiện có.<br>1a. `can` không cho phép một thao tác → mục menu đó ẩn.<br>1b. Sự kiện lan từ bản ghi khác → thêm dòng nhỏ "Từ {Deal DEAL-013}" dạng link. |

## UC-10: Hoàn thành và mở lại task (A-14)

| | |
|---|---|
| **Actor** | Người thực hiện task, hoặc người có quyền sửa hoạt động (`can.complete = true`) |
| **Trigger** | Bấm vòng tròn tick trước tiêu đề task, trên thẻ ở timeline hoặc ở nhóm "Sắp tới" |
| **Pre-condition** | Task hiện trên timeline |
| **Main Flow** | 1. Người dùng bấm vòng tròn của task chưa xong.<br>2. FE đổi giao diện ngay: vòng tròn thành dấu tick đầy, tiêu đề gạch ngang, nhãn "Quá hạn" biến mất.<br>3. FE gọi `complete` (F03-S6, hoàn thành và mở lại task).<br>4. Hệ thống hiện toast "Đã hoàn thành task".<br>5. Task rời nhóm "Sắp tới" và xuống nhóm tháng theo ngày hoàn thành.<br>6. Người dùng bấm lại vào task đã xong. FE gọi `reopen`, toast "Đã mở lại task". |
| **Post-condition** | Task đổi trạng thái xong / chưa xong. Task lặp đã xong thì có task kỳ tiếp ở nhóm "Sắp tới". |
| **Exception Flow** | 1a. `can.complete = false` → vòng tròn mờ, tooltip "Bạn không phải người thực hiện task này", bấm không có tác dụng.<br>3a. API lỗi → trả lại trạng thái cũ và hiện lỗi.<br>4a. Task lặp → toast "Đã hoàn thành task. Đã tạo task kỳ tiếp hạn {dd/mm/yyyy}."<br>6a. Mở lại task lặp đã sinh kỳ tiếp → toast "Đã mở lại task. Task kỳ tiếp đã được tạo trước đó, xoá nếu không cần." |

## UC-11: Bình luận trên hoạt động (A-16)

| | |
|---|---|
| **Actor** | Người dùng đọc được hoạt động |
| **Trigger** | Bấm "Bình luận ({n})" ở chân thẻ Ghi chú hoặc Task |
| **Pre-condition** | Thẻ đang mở |
| **Main Flow** | 1. Hệ thống mở vùng bình luận ngay dưới thẻ.<br>2. Hệ thống hiện các bình luận, cũ nhất trước: avatar chữ cái, tên người viết, thời gian tương đối ("3 phút trước"), nội dung.<br>3. Người dùng viết vào ô bình luận và bấm "Gửi" hoặc Ctrl+Enter.<br>4. Hệ thống hiện bình luận mới với tên người viết và "vừa xong".<br>5. Chân thẻ đổi số, ví dụ "Bình luận (1)". |
| **Post-condition** | Bình luận được lưu trên hoạt động. |
| **Exception Flow** | 2a. Rê chuột lên thời gian tương đối → hiện ngày giờ đầy đủ.<br>4a. Bình luận của mình có menu ⋯: Sửa, Xoá. Xoá hỏi "Xoá bình luận này?".<br>1a. Thẻ Cuộc gọi, Cuộc họp, sự kiện hệ thống → không có "Bình luận". |

# BUSINESS RULE

| **BR** | **Mô tả** |
|---|---|
| BR-01 | **Nơi mở và bản ghi chủ**<br>- Cửa sổ soạn là một component dùng chung (`ActivityComposer`), mở được từ nhiều nơi (Phụ lục A, bảng "Nơi mở cửa sổ soạn").<br>- Nơi mở quyết định bản ghi chủ (xem F03-S6, phần bản ghi chủ).<br>- Mỗi lúc chỉ có một cửa sổ soạn. Mở cửa sổ mới khi cửa sổ cũ có nội dung chưa lưu thì hỏi "Bỏ nội dung đang soạn?"; cửa sổ cũ rỗng thì thay luôn.<br>- Cửa sổ soạn nằm trên mọi nội dung của trang. Không có lớp phủ mờ (scrim): người dùng vẫn cuộn, bấm được trang phía sau. |
| BR-02 | **Khung, đóng và lưu**<br>- Vị trí, kích thước bốn trạng thái (bình thường, thu gọn, phóng to, màn hẹp) theo Phụ lục A.<br>- Tên cửa sổ: "Ghi chú", "Task", "Ghi lại cuộc gọi", "Ghi lại cuộc họp", "Lên lịch cuộc họp"; khi sửa: "Sửa ghi chú", "Sửa task"…<br>- "Có nội dung" nghĩa là: ô soạn thảo có chữ, hoặc ô tiêu đề có chữ, hoặc (khi sửa) bất kỳ ô nào khác giá trị ban đầu.<br>- Bấm ✕, nhấn Esc, mở cửa sổ khác, rời trang (bấm link, đổi trang chi tiết) khi có nội dung: hỏi "Bỏ nội dung đang soạn? Nội dung chưa lưu sẽ mất." với "Bỏ" và "Tiếp tục soạn". Tải lại trình duyệt dùng hộp xác nhận mặc định của trình duyệt.<br>- Phím tắt: Ctrl+Enter (⌘+Enter trên Mac) bấm nút chính. Esc như ✕. Enter trong ô soạn thảo là xuống dòng, không gửi.<br>- Khi lưu, nút chính ở trạng thái đang lưu, không bấm được lần hai.<br>- Lưu xong: đóng cửa sổ, toast "Đã lưu {loại}" (có task theo dõi thì "Đã lưu {loại} và task theo dõi").<br>- Lưu lỗi: giữ cửa sổ và nội dung, hiện lỗi tiếng Việt từ API ở dòng báo lỗi.<br>- Cửa sổ có `role="dialog"` và tên; mở, soạn, lưu được chỉ bằng bàn phím. |
| BR-03 | **Soạn thảo có định dạng**<br>- Ô soạn thảo cao tối thiểu 110 px, tối đa 40% chiều cao màn hình, cuộn trong.<br>- Chữ gợi ý theo loại: "Bắt đầu nhập để ghi chú…", "Bắt đầu nhập để ghi lại cuộc gọi…", "Bắt đầu nhập để ghi lại cuộc họp…", "Ghi chú…" (Task).<br>- Thanh định dạng dưới ô: Đậm (Ctrl+B), Nghiêng (Ctrl+I), Gạch chân (Ctrl+U), Xoá định dạng, vạch ngăn, Danh sách chấm, Danh sách số.<br>- Không có nút chèn liên kết và nút đính kèm. Thẻ `<a>` không nằm trong danh sách thẻ được giữ và đính kèm chưa làm (F03-S6, quy tắc lọc nội dung; xem câu hỏi Q3).<br>- Dán từ nơi khác: giữ đậm, nghiêng, gạch chân, danh sách; bỏ màu, cỡ chữ, bảng, ảnh. Việc lọc cuối cùng làm ở máy chủ; FE lọc trước để người dùng thấy đúng cái sẽ được lưu.<br>- Giới hạn 20.000 ký tự HTML sau khi lọc. FE chạy cùng quy tắc lọc rồi đếm để con số khớp máy chủ.<br>- Còn dưới 1.000 ký tự thì hiện bộ đếm "Còn 850 ký tự"; vượt thì nút chính vô hiệu. |
| BR-04 | **Liên kết với N bản ghi**<br>- Khi tạo mới, tất cả bản ghi gợi ý được tick sẵn.<br>- Bỏ tick là bỏ liên kết. Bản ghi chủ cũng bỏ tick được.<br>- Còn 0 bản ghi: nút chính vô hiệu, dòng báo lỗi "Chọn ít nhất một bản ghi để liên kết".<br>- Ô "Thêm bản ghi…" tìm theo tên trên cả ba đối tượng, tối đa 10 kết quả mỗi đối tượng.<br>- Contact được chọn ở ô "Đã liên hệ" (cuộc gọi) hoặc "Người tham dự" (cuộc họp) luôn nằm trong danh sách liên kết với vai trò tương ứng.<br>- Bỏ tick contact đó ở danh sách liên kết thì bỏ luôn ở ô người. Tick người mới ở ô người thì thêm vào danh sách liên kết.<br>- Khi sửa, danh sách là liên kết hiện có của hoạt động; không gọi gợi ý lại. |
| BR-05 | **Task theo dõi và mốc ngày**<br>- Dòng task theo dõi chỉ hiện khi tạo mới Ghi chú, Cuộc gọi, Cuộc họp. Không hiện khi tạo Task và khi sửa.<br>- Ô tick mặc định không được tick.<br>- Mốc (viết thường vì đứng giữa câu): ngày mai, sau 2 ngày làm việc, sau 3 ngày làm việc ({thứ}), sau 1 tuần, sau 2 tuần, sau 1 tháng. Mặc định "sau 3 ngày làm việc".<br>- Giờ hạn của task theo dõi luôn là 08:00.<br>- Tiêu đề, người thực hiện, liên kết của task theo dõi do máy chủ đặt.<br>- Mốc ngày tính theo giờ Việt Nam, từ ngày hôm nay, cách tính ở Phụ lục A (dùng chung cho ô Ngày thực hiện của Task).<br>- "Ngày làm việc" bỏ thứ Bảy và Chủ nhật. Chưa trừ ngày nghỉ lễ (xem câu hỏi Q1).<br>- Nhãn "Sau 3 ngày làm việc (Thứ Hai)" ghi thứ của ngày tính được. |
| BR-06 | **Task**<br>- Bắt buộc: Tên task, Người thực hiện.<br>- Ngày trong quá khứ được phép (ghi lại việc đã trễ), hiện chữ nhỏ "Ngày này đã qua".<br>- Ô Người thực hiện chỉ gồm nhân viên "Đang làm việc".<br>- Ô Hàng đợi ẩn khi danh mục `queue` rỗng (hiện tại khách chưa có hàng đợi nào).<br>- "Lặp lại" là ô chọn chu kỳ, vì máy chủ cần biết chu kỳ. Task kỳ tiếp chỉ được tạo khi task hiện tại được đánh dấu xong, không tự hiện theo lịch.<br>- Nhắc nhở gửi bằng thông báo chuông cho người thực hiện có tài khoản ERP.<br>- Bố cục: Tên task một hàng; hàng 2 gồm Ngày thực hiện và Gửi nhắc nhở; hàng 3 là Lặp lại; hàng 4 gồm Loại, Ưu tiên, Hàng đợi, Người thực hiện; cuối là ô Ghi chú. |
| BR-07 | **Cuộc gọi, cuộc họp và ô chọn người**<br>- Cuộc gọi: chỉ Thời điểm là bắt buộc. Ba ô đầu một hàng; Thời điểm một hàng; rồi ô soạn thảo.<br>- Ghi lại cuộc họp mới không có ô tiêu đề (giống HubSpot); máy chủ đặt tiêu đề "Cuộc họp". Khi sửa một cuộc họp đã có tiêu đề thì hiện ô tiêu đề.<br>- Lên lịch cuộc họp dùng cùng biểu mẫu với ghi lại cuộc họp, khác ở: Tiêu đề bắt buộc, kết quả mặc định "Đã lên lịch", bắt đầu mặc định 10:00 ngày mai, thời lượng 30 phút.<br>- Dưới nút "Lưu lịch họp" có chữ nhỏ "Cuộc họp chỉ lưu trong ERP, chưa gửi lời mời cho người tham dự."<br>- Ô chọn người hiện "{n} contact ▾", bấm mở danh sách có checkbox. Danh sách và giá trị chọn sẵn theo bản ghi chủ (Phụ lục A, bảng "Ô chọn người").<br>- Trên trang Company không chọn sẵn ai, vì chọn cả công ty sẽ ghi sai "Liên hệ gần nhất" của những người không dự.<br>- Có ô tìm khi danh sách hơn 7 người. Cuối danh sách có ô "Thêm contact khác…" tìm trên toàn bộ Contacts.<br>- Danh sách rỗng: dòng "Chưa có contact liên kết" và ô tìm. |
| BR-08 | **Tab timeline và phần ngoài phạm vi**<br>- Sáu tab: Tất cả hoạt động (`ALL`), Ghi chú (`NOTE`), Email (`EMAIL`), Cuộc gọi (`CALL`), Task (`TASK`), Cuộc họp (`MEETING`).<br>- Tab Tất cả không có nút theo tab. Các tab khác có nút theo Phụ lục A.<br>- Đổi tab giữ chữ trong ô tìm.<br>- Tab khác "Tất cả" không có bộ lọc loại, khoảng thời gian, người thực hiện.<br>- URL: `?tab=activities&atab=CALL` mở thẳng tab Cuộc gọi.<br>- Không làm gửi, ghi email, SMS, WhatsApp, LinkedIn, gọi qua tổng đài (A-15). Các chỗ còn giữ để bố cục giống HubSpot hiện ở trạng thái vô hiệu hoặc câu thông báo, và không gọi API nào (Phụ lục A, bảng "Chỗ ngoài phạm vi"). |
| BR-09 | **Bộ lọc, tìm và thu gọn**<br>- Bộ lọc chỉ có ở tab Tất cả, gồm ba chip: "Hoạt động ({x}/9) ▾", "Mọi thời gian ▾", "Người thực hiện ▾".<br>- `x` là số mục đang tick. Đủ 9 thì chip ở trạng thái thường; ít hơn thì chip nổi bật và có nút ✕ để về đủ 9.<br>- Mục "Email" vẫn có trong danh sách để giữ bố cục HubSpot; tick hay không cũng không đổi kết quả trong giai đoạn này.<br>- Mốc thời gian: Mọi thời gian, Hôm nay, 7 ngày qua, 30 ngày qua, 90 ngày qua, 12 tháng qua, Tuỳ chọn (hai ô Từ – Đến). Cách tính giống CRM-01, phần bộ lọc theo ngày (giờ Việt Nam, gồm cả hôm nay). "12 tháng qua" là từ cùng ngày năm trước đến hôm nay.<br>- Chip Người thực hiện: danh sách nhân viên có checkbox, người đang đăng nhập đứng đầu kèm "(tôi)"; ô tìm khi hơn 7 người; ba nhóm theo trạng thái làm việc như popover owner của CRM-01.<br>- Ý nghĩa "người thực hiện" với từng loại mục theo F03-S6, API timeline (`actor`).<br>- "Xoá tất cả" chỉ hiện khi có ít nhất một bộ lọc khác mặc định; đưa ba chip về mặc định, giữ ô tìm.<br>- Nhóm ghim và nhóm "Sắp tới" chịu bộ lọc loại, người và ô tìm, nhưng không chịu khoảng thời gian.<br>- Ô tìm gửi `q` sau khi ngừng gõ 300 ms, áp cho mọi tab.<br>- "Thu gọn tất cả ▾" là menu một mục đổi qua lại "Thu gọn tất cả" / "Mở rộng tất cả". Áp cho mọi thẻ đang hiện và các thẻ tải thêm sau đó. Bấm một thẻ vẫn mở, đóng riêng thẻ đó. |
| BR-10 | **Nhóm và thứ tự trên timeline**<br>- Thứ tự: mục ghim, nhóm "Sắp tới", các nhóm theo tháng.<br>- Mục ghim không có tiêu đề nhóm; thẻ có dải "Đã ghim" phía trên.<br>- Nhóm "Sắp tới": việc gần nhất lên trước. `total` lớn hơn 20 thì cuối nhóm có "Xem thêm việc sắp tới ({còn lại})".<br>- Nhóm theo tháng: mới nhất trước, nhóm theo tháng của thời điểm hiển thị.<br>- "Xem thêm hoạt động" tải trang tiếp và nối vào cuối; mục của tháng đang dở tiếp tục dưới cùng tiêu đề tháng đó, tiêu đề tháng không lặp. |
| BR-11 | **Thẻ hoạt động và sửa**<br>- Biểu tượng, tiêu đề, dòng thông tin theo loại ở Phụ lục A. Giá trị trống hiện "—".<br>- Task chưa xong đã qua hạn có nhãn "Quá hạn" màu lỗi. Task đã xong thì tiêu đề gạch ngang.<br>- Sự kiện không có "Thao tác ▾", không có bình luận.<br>- "{n} liên kết ▾" lấy n từ `links.count`, không tính bản ghi đang mở; ẩn khi n = 0.<br>- Mục trong "Thao tác ▾" hiện theo `can` của API.<br>- Chỉ ghim được một hoạt động mỗi bản ghi; ghim cái mới thì cái cũ tự bỏ.<br>- Hộp xác nhận xoá không ghi số bản ghi, vì người xem có thể không thấy hết các bản ghi liên kết. Xoá là xoá mềm, khôi phục được trong 30 ngày.<br>- Giai đoạn này thẻ không có mục "History" (lịch sử sửa hoạt động) như HubSpot.<br>- Sửa: không có dòng task theo dõi; lưu gửi PATCH với danh sách liên kết đầy đủ.<br>- Sửa Task: sửa được mọi ô trong biểu mẫu. Trạng thái xong / chưa xong không có trong biểu mẫu, đổi bằng vòng tròn tick trên thẻ. |
| BR-12 | **Hoàn thành task**<br>- Vòng tròn tick có ở thẻ task trên timeline và ở nhóm "Sắp tới".<br>- Chỉ bấm được khi `can.complete = true` (người thực hiện hoặc người có quyền sửa).<br>- Cập nhật lạc quan: đổi giao diện ngay, lỗi thì trả lại trạng thái cũ và hiện lỗi.<br>- Task xong rời nhóm "Sắp tới", xuống nhóm tháng theo ngày hoàn thành.<br>- Vòng tròn có nhãn "Đánh dấu hoàn thành" / "Đánh dấu chưa xong" cho trình đọc màn hình. |
| BR-13 | **Bình luận**<br>- Chỉ có trên Ghi chú và Task (theo sheet A-16). Cuộc gọi, cuộc họp, sự kiện hệ thống không có.<br>- Danh sách cũ nhất trước.<br>- Ô viết bình luận là ô soạn thảo thu nhỏ (cao 60 px), thanh định dạng chỉ có Đậm, Nghiêng, Danh sách chấm.<br>- Tối đa 5.000 ký tự.<br>- Chỉ bình luận của mình có menu ⋯ Sửa, Xoá.<br>- A-16 là P2; QĐ-10 đề xuất để sang đợt sau. Phần này viết sẵn để dùng khi chốt làm. |
| BR-14 | **Làm mới sau khi thay đổi**<br>- Sau khi tạo, sửa, xoá, hoàn thành hoạt động, FE tải lại các vùng theo Phụ lục A, bảng "Vùng tải lại".<br>- Timeline tải lại trang đầu, giữ tab và bộ lọc.<br>- Trường tính (Liên hệ gần nhất, Hoạt động tiếp theo…) do F03-S2 cập nhật sau giao dịch, thường trong vài giây (p95 dưới 5 giây).<br>- Với các vùng có trường tính, FE tải lại tối đa 3 lần, cách nhau 2 giây, dừng sớm khi giá trị đã đổi. Sau đó để nguyên, lần tải sau sẽ đúng. |
| BR-15 | **Quyền trên giao diện**<br>- Mở cửa sổ soạn: tạo được bản ghi `crm_activities` và đọc được bản ghi chủ. Không đủ quyền: năm nút hoạt động trên thẻ định danh vô hiệu, tooltip "Bạn chưa có quyền ghi hoạt động"; nút theo tab ẩn.<br>- Sửa, xoá, ghim, hoàn thành: theo `can` trong mỗi mục của API timeline. Không đủ quyền: mục menu ẩn, vòng tròn tick mờ.<br>- Bình luận: đọc được hoạt động.<br>- Xem timeline: đọc được bản ghi. Không đọc được thì trang chi tiết không mở (CRM-01).<br>- FE không tự suy quyền từ vai trò; chỉ dựa vào `can` và quyền collection trả về từ API. |

# ACCEPTANCE CRITERIA

AC-1: Khung cửa sổ soạn (A-01)

- Ở trang Contact Hạnh, bấm nút "Ghi chú" → cửa sổ hiện ở góc phải dưới.
- Gõ vài chữ, bấm ⌄ → cửa sổ thu còn thanh tiêu đề rộng 320 px. Bấm vào thanh tiêu đề → mở lại, nội dung còn nguyên.
- Màn 390 px → cửa sổ toàn màn hình, không có nút phóng to.
- Mở, soạn, lưu ghi chú chỉ bằng bàn phím làm được; cửa sổ có `role="dialog"` và tên; Esc đóng.

AC-2: Hỏi trước khi bỏ nội dung (A-01)

- Cửa sổ Ghi chú đang có chữ, bấm ✕ → hỏi "Bỏ nội dung đang soạn?". Chọn "Tiếp tục soạn" thì cửa sổ còn nguyên; chọn "Bỏ" thì đóng.
- Cửa sổ Task đang có tên task chưa lưu, bấm nút "Ghi chú" → hỏi "Bỏ nội dung đang soạn?" trước khi mở cửa sổ Ghi chú.
- Đang soạn, bấm link sang trang khác → hỏi "Bỏ nội dung đang soạn?".

AC-3: Lưu (A-01)

- Cửa sổ Ghi chú có nội dung hợp lệ, nhấn Ctrl+Enter → ghi chú được lưu, cửa sổ đóng, toast "Đã lưu ghi chú".
- Bấm nút chính hai lần liên tiếp → chỉ một request.
- Lưu lỗi mạng → cửa sổ còn, nội dung còn, có dòng lỗi.

AC-4: Soạn thảo có định dạng (A-02)

- Gõ một dòng in đậm và một danh sách hai chấm, lưu → thẻ trên timeline hiện đúng chữ đậm và danh sách.
- Dán nội dung Word có chữ màu đỏ cỡ 20 và một bảng → chữ còn, màu và cỡ chữ bị bỏ, bảng thành các dòng chữ.
- Gõ 19.200 ký tự → bộ đếm "Còn 800 ký tự".
- Thanh định dạng không có nút chèn liên kết và nút đính kèm.

AC-5: Liên kết với N bản ghi (A-03)

- Contact Hạnh có công ty chính Thiên Phúc và DEAL-013 đang mở. Mở cửa sổ Ghi chú từ trang Hạnh → dòng ghi "Liên kết với 3 bản ghi"; mở ra thấy Hạnh, Thiên Phúc, DEAL-013 đều được tick.
- Bỏ tick DEAL-013 rồi lưu → ghi chú hiện trên timeline Hạnh và Thiên Phúc, không hiện trên DEAL-013.
- Bỏ tick cả ba bản ghi → nút "Tạo ghi chú" vô hiệu và có dòng "Chọn ít nhất một bản ghi để liên kết".
- Thêm qua "Thêm bản ghi…" một deal không có trong gợi ý → deal được gắn khi lưu.
- Bỏ tick Hạnh ở danh sách liên kết khi Hạnh đang ở ô Đã liên hệ → ô Đã liên hệ bỏ Hạnh theo.

AC-6: Task theo dõi và mốc ngày (A-04)

- Hôm nay thứ Tư 30/09/2026, ghi lại cuộc gọi có tick "Tạo task To-do để theo dõi sau 3 ngày làm việc (Thứ Hai)" → toast "Đã lưu cuộc gọi và task theo dõi"; nhóm Sắp tới có task "Theo dõi: cuộc gọi với Nguyễn Thị Hạnh" hạn 05/10/2026 08:00.
- "Sau 3 ngày làm việc" khi hôm nay thứ Sáu 02/10/2026 → thứ Tư 07/10.
- "Sau 2 ngày làm việc" khi hôm nay Chủ nhật 04/10/2026 → thứ Ba 06/10.
- "Sau 1 tháng" khi hôm nay 31/01/2027 → 28/02/2027.

AC-7: Tạo ghi chú (A-05)

- Ở trang Deal DEAL-013, bấm "Ghi chú" → dòng đầu cửa sổ ghi "Cho DEAL-013".
- Nhập nội dung, bấm "Tạo ghi chú" → thẻ Ghi chú "bởi {tôi}" đứng đầu tháng hiện tại.
- Cửa sổ chưa có chữ, bấm "Tạo ghi chú" → dòng báo lỗi "Nhập nội dung ghi chú"; không gọi API.

AC-8: Tạo task (A-06)

- Ở trang Contact Hạnh, tôi gắn với nhân viên Minh Trần, hôm nay thứ Tư 30/09/2026. Mở Task, nhập "Gửi báo giá", chọn "Sau 2 ngày làm việc", giờ 14:00, ưu tiên Cao, bấm "Tạo" → task hạn 02/10/2026 14:00, người thực hiện Minh Trần, nằm ở nhóm Sắp tới.
- Danh mục Hàng đợi chưa có giá trị → cửa sổ Task không có ô Hàng đợi.

AC-9: Nhắc nhở và lặp lại (A-07)

- Task hạn 05/10/2026 08:00, "Gửi nhắc nhở: 1 giờ trước", người thực hiện Lan Lê có tài khoản → đến 07:00 ngày 05/10 Lan nhận thông báo chuông "Nhắc việc: …"; thẻ task có biểu tượng chuông.
- Task "Gọi chăm sóc" lặp hằng tuần, hạn 01/10/2026 08:00, Lan tick hoàn thành ngày 01/10 → toast "Đã hoàn thành task. Đã tạo task kỳ tiếp hạn 08/10/2026."; task mới hiện ở nhóm Sắp tới.

AC-10: Ghi lại cuộc gọi (A-08)

- Trang Deal DEAL-013 có hai contact, Hạnh được gắn vào deal trước Bảo. Mở "Ghi lại cuộc gọi" → ô Đã liên hệ có Hạnh được chọn sẵn.
- Chọn thêm Bảo, kết quả "Đã kết nối", hướng "Gọi đi", lưu → thẻ cuộc gọi ghi "Đã liên hệ: Nguyễn Thị Hạnh, Trần Văn Bảo".
- Cuộc gọi hiện trên timeline của cả Hạnh và Bảo.
- Lưu cuộc gọi từ trang Contact → card thuộc tính chính cập nhật Liên hệ gần nhất (khi F03-S2 đã xong).

AC-11: Ghi lại cuộc họp (A-09)

- Trang Company Thiên Phúc có 3 contact. Mở "Ghi lại cuộc họp" → ô Người tham dự chưa chọn ai, danh sách có đủ 3 contact để chọn.
- Thời lượng mặc định 15 phút; không có ô tiêu đề; lưu xong thẻ có tiêu đề "Cuộc họp".
- Deal chưa có contact, mở Ghi lại cuộc họp → ô người hiện "Chưa có contact liên kết" và ô tìm.

AC-12: Lên lịch cuộc họp (A-10)

- Hôm nay 30/09/2026, bấm nút "Họp" trên thẻ định danh → cửa sổ "Lên lịch cuộc họp" có ô Tiêu đề bắt buộc, kết quả "Đã lên lịch", bắt đầu 01/10/2026 10:00, thời lượng 30 phút.
- Lưu xong cuộc họp nằm ở nhóm Sắp tới.
- Chọn bắt đầu hôm qua → có chữ nhỏ cảnh báo, vẫn lưu được.
- Lên lịch cuộc họp từ danh sách Deals → ô Hoạt động tiếp theo của deal đổi, không rời danh sách.

AC-13: Tab và nút theo tab (A-11)

- Từ tab Tất cả, lần lượt bấm tab Ghi chú, Cuộc gọi, Task, Cuộc họp → thanh công cụ lần lượt có "Tạo ghi chú"; "Ghi lại cuộc gọi" và "Gọi điện" (vô hiệu); "Tạo task"; "Ghi lại cuộc họp" và "Lên lịch cuộc họp".
- Hàng bộ lọc không hiện ở bốn tab này.
- Mở link `…/records/rec_r013?tab=activities&atab=MEETING` → trang chi tiết DEAL-013 mở ở tab Hoạt động, tab con Cuộc họp.
- Tìm "báo giá" ở tab Cuộc gọi → chỉ cuộc gọi có chữ đó.

AC-14: Bộ lọc timeline (A-12)

- Timeline Deal có cuộc gọi, ghi chú và sự kiện đổi giai đoạn. Mở "Hoạt động (9/9)", bỏ tick "Chọn tất cả", tick "Hoạt động Deal" → chip ghi "Hoạt động (1/9)" và có nút ✕; timeline chỉ còn sự kiện đổi giai đoạn.
- Đang lọc loại 1/9, "30 ngày qua", Người thực hiện (1), bấm "Xoá tất cả" → ba chip về mặc định; chữ trong ô tìm giữ nguyên.
- Chọn "Tuỳ chọn" 01/09–15/09 → nhóm Sắp tới và mục ghim vẫn hiện.
- Timeline có 12 thẻ đang mở, chọn "Thu gọn tất cả" → mọi thẻ chỉ còn phần đầu; bấm một thẻ thì chỉ thẻ đó mở; menu đổi thành "Mở rộng tất cả".

AC-15: Phân trang timeline (A-11, A-13)

- Timeline 75 mục, bấm "Xem thêm hoạt động" hai lần → đủ 75 mục, không trùng, tiêu đề tháng không lặp.
- Timeline có 26 việc sắp tới, bấm "Xem thêm việc sắp tới (6)" → nhóm Sắp tới có đủ 26 mục, vẫn tăng dần.

AC-16: Thẻ hoạt động: ghim, liên kết, xoá, sửa (A-13)

- Ghi chú N1 đang ghim trên DEAL-013. Chọn "Thao tác ▾ → Ghim lên đầu" ở ghi chú N2 → N2 đứng đầu timeline với dải "Đã ghim"; N1 về vị trí theo thời gian.
- Cuộc gọi gắn Hạnh, Thiên Phúc, DEAL-013; đang ở trang Hạnh, bấm "2 liên kết ▾" → hiện "Dược phẩm Thiên Phúc · DEAL-013" dạng link.
- Chọn "Xoá" → hộp xác nhận ghi "Hoạt động này sẽ bị xoá khỏi mọi bản ghi liên kết. Có thể khôi phục trong 30 ngày."; xác nhận thì thẻ biến mất và toast "Đã xoá hoạt động".
- Ghi chú do tôi tạo, chọn "Sửa" → cửa sổ tên "Sửa ghi chú", không có dòng task theo dõi; đổi nội dung, bấm "Lưu" → thẻ hiện nội dung mới, toast "Đã lưu thay đổi".
- Sự kiện lan từ DEAL-013 trên timeline Contact → thẻ có dòng "Từ Deal DEAL-013" dạng link, không có "Thao tác ▾".

AC-17: Hoàn thành task (A-14)

- Task quá hạn 25/09 ở nhóm Sắp tới, tôi là người thực hiện. Bấm vòng tròn → tiêu đề gạch ngang, nhãn "Quá hạn" mất, task chuyển xuống nhóm tháng 9 năm 2026 theo ngày hoàn thành 30/09.
- Task giao cho Lan Lê; tôi không phải Lan và không có quyền sửa hoạt động → vòng tròn mờ, tooltip "Bạn không phải người thực hiện task này"; bấm không có tác dụng.
- Hoàn thành task khi API lỗi → task trở lại chưa xong, hiện lỗi.
- Mở lại task lặp đã sinh kỳ tiếp → toast nhắc task kỳ tiếp đã tạo.
- Vòng tròn tick có nhãn "Đánh dấu hoàn thành" / "Đánh dấu chưa xong".

AC-18: Các chỗ ngoài phạm vi (A-15)

- Ở trang chi tiết bất kỳ, bấm tab Email → hiện "Gửi và ghi email chưa có trong giai đoạn này."
- Nút "Gọi điện" ở tab Cuộc gọi và nút "Email" trên thẻ định danh vô hiệu, có tooltip.
- Không có request nào được gửi khi bấm ba chỗ trên.

AC-19: Bình luận (A-16)

- Ghi chú của Minh Trần trên DEAL-013. Tôi bấm "Bình luận (0)", viết "Đã gửi báo giá", bấm "Gửi" → bình luận hiện dưới ghi chú với tên tôi và "vừa xong".
- Chân thẻ đổi thành "Bình luận (1)".
- Thẻ Cuộc gọi không có "Bình luận".

AC-20: Quyền

- Người không tạo được hoạt động → năm nút hoạt động vô hiệu, không có nút theo tab.
- `can.delete = false` → menu "Thao tác ▾" không có "Xoá".

# PHỤ LỤC

## A. Màn hình và dữ liệu hiển thị

**Nơi mở cửa sổ soạn**

| Nơi mở | Bản ghi chủ | Loại |
|---|---|---|
| Sáu nút nhanh trên thẻ định danh (CRM-01, nút nhanh trên thẻ định danh) | Bản ghi đang mở | Ghi chú · Task · Ghi lại cuộc gọi (nút "Gọi") · Lên lịch cuộc họp (nút "Họp") · Ghi lại cuộc gọi, Ghi lại cuộc họp (menu "Thêm") |
| Nút theo tab trên timeline | Bản ghi đang mở | Theo tab |
| "Tạo hoạt động ▾" ở tab Tổng quan (CRM-02, tab Tổng quan) | Bản ghi đang mở | Ghi chú · Cuộc gọi · Task · Cuộc họp |
| "Lên lịch ▾" ở cột Hoạt động tiếp theo của danh sách Deals (CRM-04, cột Hoạt động tiếp theo) | Deal của dòng đó | Lên lịch cuộc họp · Task |
| "Sửa" trên thẻ hoạt động | Bản ghi đang mở | Loại của hoạt động |

**Vị trí và kích thước cửa sổ soạn** (theo `DESIGN-SYSTEM-HUBSPOT.md`, phần cửa sổ soạn; lấy từ `crm-shared.css` `.composer`)

| Trạng thái | Vị trí | Rộng | Ghi chú |
|---|---|---|---|
| Bình thường | Dính đáy màn hình, cách mép phải 16 px | 500 px (tối đa bề rộng màn hình trừ 32 px) | Cao theo nội dung, tối đa 86% chiều cao màn hình; phần thân cuộn trong |
| Thu gọn | Như trên | 320 px | Chỉ còn thanh tiêu đề; bấm vào thanh để mở lại |
| Phóng to | Giữa màn hình, cách đáy 4% | 860 px (tối đa bề rộng màn hình trừ 32 px) | Bo đủ bốn góc |
| Màn hẹp (< 600 px) | Toàn màn hình | 100% | Không có nút phóng to |

Thanh tiêu đề: nút ⌄ thu gọn (mũi tên lật lên khi đang thu gọn) · tên cửa sổ · nút ⛶ phóng to/thu nhỏ · nút ✕ đóng.

Thứ tự trong thân: phần riêng theo loại · dòng báo lỗi (ẩn khi không có lỗi) · "Liên kết với N bản ghi ▾" · dòng task theo dõi (chỉ khi tạo mới và không phải Task) · chân: nút chính và, khi sửa, nút "Huỷ".

**Dòng task theo dõi**

☐ "Tạo task" [loại task ▾: To-do / Gọi điện / Email] "để theo dõi" [mốc ▾].

**Cách tính mốc ngày** (giờ Việt Nam, từ ngày hôm nay)

| Mốc | Cách tính | Ví dụ khi hôm nay là thứ Tư 30/09/2026 |
|---|---|---|
| Hôm nay | Hôm nay | 30/09 |
| Ngày mai | Hôm nay + 1 ngày lịch | 01/10 |
| Sau n ngày làm việc | Đếm tới n ngày, bỏ thứ Bảy và Chủ nhật | Sau 2: thứ Sáu 02/10. Sau 3: thứ Hai 05/10 |
| Sau 1 tuần, 2 tuần | + 7, + 14 ngày lịch | 07/10, 14/10 |
| Sau 1 tháng | Cùng ngày tháng sau; tháng sau không có ngày đó thì ngày cuối tháng | 30/10 |

**Biểu mẫu Ghi chú**

| # | Ô | Kiểu | Ghi chú |
|---|---|---|---|
| 1 | Cho | Tag tên bản ghi chủ | Chỉ hiển thị |
| 2 | Nội dung | Ô soạn thảo | Bắt buộc. Rỗng: "Nhập nội dung ghi chú" |

Nút chính: "Tạo ghi chú".

**Biểu mẫu Task**

Tên trường, danh mục và ràng buộc theo CRM-00 (phần hoạt động) và F03-S6 (trường theo loại hoạt động).

| # | Ô | Kiểu | Mặc định | Ràng buộc |
|---|---|---|---|---|
| 1 | Tên task | Ô chữ lớn không viền, chữ gợi ý "Nhập tên task" | — | Bắt buộc |
| 2 | Ngày thực hiện | Chọn mốc (như task theo dõi, thêm "Hôm nay" và "Chọn ngày…") + ô giờ | Sau 3 ngày làm việc · 08:00 | "Chọn ngày…" hiện ô chọn ngày. Ngày trong quá khứ được phép (ghi lại việc đã trễ), hiện chữ nhỏ "Ngày này đã qua" |
| 3 | Gửi nhắc nhở | Chọn (D-REMINDER) | Không nhắc | |
| 4 | Lặp lại | Chọn: Không lặp · Hằng ngày · Hằng tuần · 2 tuần một lần · Hằng tháng · Hằng quý · Nửa năm · Hằng năm (D-REPEAT) | Không lặp | |
| 5 | Loại task | Chọn (D-TASKKIND) | To-do | |
| 6 | Ưu tiên | Chọn (D-PRIORITY) | Không | |
| 7 | Hàng đợi | Chọn (danh mục `queue`) | — | Ẩn khi danh mục rỗng |
| 8 | Người thực hiện | Chọn nhân viên có tìm | Nhân viên gắn với tài khoản đang đăng nhập | Bắt buộc. Chỉ nhân viên "Đang làm việc". Người dùng chưa gắn nhân viên: ô trống, bắt buộc chọn |
| 9 | Ghi chú | Ô soạn thảo | — | |

Nút chính: "Tạo". Lỗi: tên trống "Nhập tên task"; chưa có người thực hiện "Chọn người thực hiện".

**Biểu mẫu Ghi lại cuộc gọi**

| # | Ô | Kiểu | Mặc định |
|---|---|---|---|
| 1 | Đã liên hệ | Chọn nhiều contact (ô chọn người) | Theo bảng "Ô chọn người" |
| 2 | Kết quả cuộc gọi | Chọn (D-CALLOUTCOME), mục đầu "Chọn kết quả" | Chưa chọn |
| 3 | Hướng cuộc gọi | Chọn: Gọi đi / Gọi đến, mục đầu "Chọn hướng" | Chưa chọn |
| 4 | Thời điểm | Ngày giờ | Thời điểm mở cửa sổ |
| 5 | Nội dung | Ô soạn thảo | — |

Nút chính: "Ghi lại cuộc gọi".

**Biểu mẫu Ghi lại cuộc họp**

| # | Ô | Kiểu | Mặc định |
|---|---|---|---|
| 1 | Người tham dự | Chọn nhiều contact (ô chọn người) | Theo bảng "Ô chọn người" |
| 2 | Kết quả cuộc họp | Chọn (D-MEETOUTCOME), mục đầu "Chọn kết quả" | Chưa chọn |
| 3 | Bắt đầu | Ngày giờ | Thời điểm mở cửa sổ |
| 4 | Thời lượng | Chọn: 15 phút · 30 phút · 45 phút · 1 giờ · 1 giờ 30 phút · 2 giờ | 15 phút |
| 5 | Nội dung | Ô soạn thảo | — |

Nút chính: "Ghi lại cuộc họp".

**Biểu mẫu Lên lịch cuộc họp** (cùng biểu mẫu Ghi lại cuộc họp, khác ở các dòng sau)

| Ô | Khác biệt |
|---|---|
| Tiêu đề cuộc họp | Thêm ở trên cùng, bắt buộc. Trống: "Nhập tiêu đề cuộc họp" |
| Kết quả cuộc họp | Mặc định "Đã lên lịch" |
| Bắt đầu | Mặc định 10:00 ngày mai. Trong quá khứ: chữ nhỏ "Thời điểm này đã qua. Nếu cuộc họp đã diễn ra, hãy dùng Ghi lại cuộc họp." Vẫn cho lưu |
| Thời lượng | Mặc định 30 phút |

Nút chính: "Lưu lịch họp". Dưới nút: "Cuộc họp chỉ lưu trong ERP, chưa gửi lời mời cho người tham dự."

**Ô chọn người (Đã liên hệ, Người tham dự)**

| Bản ghi chủ | Danh sách | Cuộc gọi chọn sẵn | Cuộc họp chọn sẵn |
|---|---|---|---|
| Contact | Chính contact đó | Contact đó | Contact đó |
| Deal | Contact của deal, xếp theo thời điểm gắn vào deal, cũ trước | Contact đầu danh sách | Mọi contact của deal |
| Company | Contact của công ty (tối đa 50), xếp theo tên | Không chọn sẵn | Không chọn sẵn |

**Bố cục timeline** (style theo `DESIGN-SYSTEM-HUBSPOT.md`, phần timeline)

1. Hàng tab loại hoạt động.
2. Thanh công cụ 1: ô "Tìm hoạt động" · nút theo tab · "Thu gọn tất cả ▾" bên phải.
3. Thanh công cụ 2, chỉ ở tab Tất cả: bộ lọc.
4. Mục ghim, nhóm "Sắp tới", các nhóm theo tháng.
5. Nút "Xem thêm hoạt động" khi còn trang sau.

**Tab và nút theo tab**

| Tab | Mã | Nút trên thanh công cụ |
|---|---|---|
| Tất cả hoạt động | `ALL` | Không có |
| Ghi chú | `NOTE` | "Tạo ghi chú" |
| Email | `EMAIL` | "Ghi lại email", "Soạn email": hiện ở trạng thái vô hiệu, tooltip "Email chưa có trong giai đoạn này" (A-15) |
| Cuộc gọi | `CALL` | "Ghi lại cuộc gọi" · "Gọi điện" (vô hiệu, tooltip "Gọi trực tiếp cần tổng đài, chưa có trong giai đoạn này. Dùng Ghi lại cuộc gọi.") |
| Task | `TASK` | "Tạo task" |
| Cuộc họp | `MEETING` | "Ghi lại cuộc họp" · "Lên lịch cuộc họp" |

**Chip "Hoạt động ({x}/9) ▾"**: popover rộng 520 px, có ô tìm, dòng "Chọn tất cả", rồi ba cột nhóm.

| Nhóm | Mục | Mã gửi API |
|---|---|---|
| Giao tiếp | Cuộc gọi · Email | `CALL`, `EMAIL` |
| Hoạt động nhóm | Cuộc họp · Ghi chú · Task | `MEETING`, `NOTE`, `TASK` |
| Cập nhật | Hoạt động Deal · Thay đổi liên kết · Thay đổi thuộc tính · Tạo bản ghi | `S_STAGE`, `S_ASSOC`, `S_PROP`, `S_CREATED` |

**Nhóm trên timeline**

| Thứ tự | Nhóm | Tiêu đề nhóm | Nội dung |
|---|---|---|---|
| 1 | Ghim | Không có tiêu đề; thẻ có dải "Đã ghim" (kèm biểu tượng ghim) phía trên | `pinned` |
| 2 | Sắp tới | "Sắp tới" | `upcoming.items`, việc gần nhất lên trước. `total` > 20 thì cuối nhóm có "Xem thêm việc sắp tới ({còn lại})", tải tiếp ngay trong nhóm bằng `section=upcoming` |
| 3 | Theo tháng | "Tháng 9 năm 2026" | `items`, mới nhất trước, nhóm theo tháng của thời điểm hiển thị |

**Trạng thái của timeline**

| Trạng thái | Hiển thị |
|---|---|
| Đang tải lần đầu | Skeleton 4 thẻ |
| Tab Tất cả, không có mục nào, không lọc | "Chưa có hoạt động nào. Ghi lại cuộc gọi, cuộc họp hoặc thêm ghi chú để cả đội cùng theo dõi." |
| Có lọc hoặc tìm, không khớp | "Không có hoạt động phù hợp bộ lọc." + link "Xoá tất cả" |
| Tab loại, không có mục | "Chưa có {cuộc gọi / ghi chú / task / cuộc họp} nào." |
| Tab Email | "Gửi và ghi email chưa có trong giai đoạn này." |
| Lỗi tải | "Không tải được hoạt động." + nút "Thử lại" |

**Phần đầu thẻ hoạt động**

| Loại | Biểu tượng | Tiêu đề |
|---|---|---|
| Ghi chú | `sticky_note_2` | "Ghi chú" + chữ nhạt " bởi {người tạo}" |
| Cuộc gọi | `call` | "Cuộc gọi" + " bởi {người tạo}" |
| Cuộc họp | `event` | Tiêu đề cuộc họp + " bởi {người tạo}" |
| Task | Vòng tròn tick | Tiêu đề task; task đã xong thì gạch ngang |
| Sự kiện | `history`; sự kiện Hoạt động Deal thêm biểu tượng bắt tay nhỏ | Tiêu đề sự kiện (F03-S3, nội dung sự kiện hệ thống) |

Bên phải: thời điểm hiển thị dạng `30/09/2026 lúc 09:15` · nút "Thao tác ▾" (chỉ với hoạt động, không có ở sự kiện).

**Phần thân thẻ** (ẩn khi thẻ thu gọn)

| Loại | Dòng thông tin, dạng "Nhãn: giá trị" |
|---|---|
| Task | Hạn: 05/10/2026 08:00 (kèm nhãn "Quá hạn" màu lỗi khi chưa xong và hạn đã qua) · Loại · Ưu tiên · Người thực hiện · biểu tượng lặp "Hằng tuần" nếu có lặp · biểu tượng chuông nếu có nhắc |
| Cuộc gọi | Hướng · Kết quả · Đã liên hệ: {tên} |
| Cuộc họp | Bắt đầu · Thời lượng · Kết quả · Tham dự: {tên} |
| Sự kiện | Câu hiển thị theo F03-S3. Sự kiện lan từ bản ghi khác có thêm dòng nhỏ "Từ {Deal DEAL-013}" dạng link |

Sau dòng thông tin là nội dung HTML đã lọc; dài hơn 8 dòng thì cắt kèm "Xem thêm". Chân thẻ: "{n} liên kết ▾" và "Bình luận ({n})" (chỉ Ghi chú và Task).

**Menu "Thao tác ▾"**

| Mục | Hành vi |
|---|---|
| Ghim lên đầu / Bỏ ghim | Toast "Đã ghim lên đầu timeline" / "Đã bỏ ghim". Chỉ ghim được một hoạt động mỗi bản ghi; ghim cái mới thì cái cũ tự bỏ |
| Sửa | Mở cửa sổ soạn ở chế độ sửa |
| Xem liên kết | Mở danh sách liên kết ở chân thẻ |
| vạch ngăn | |
| Xoá | Hộp xác nhận nút đỏ "Xoá": "Hoạt động này sẽ bị xoá khỏi mọi bản ghi liên kết. Có thể khôi phục trong 30 ngày." Xoá xong toast "Đã xoá hoạt động" |

**Vùng bình luận**

- Mỗi bình luận: avatar chữ cái · tên người viết · thời gian tương đối ("3 phút trước", rê chuột hiện ngày giờ đầy đủ) · nội dung.
- Ô viết: cao 60 px, thanh định dạng Đậm, Nghiêng, Danh sách chấm. Nút "Gửi" (Ctrl+Enter). Tối đa 5.000 ký tự.
- Menu ⋯ trên bình luận của mình: Sửa · Xoá (hộp xác nhận "Xoá bình luận này?").

**Chỗ ngoài phạm vi (A-15)**

| Chỗ | Cách hiện |
|---|---|
| Nút "Email" trong sáu nút nhanh | Vô hiệu (CRM-01, nút nhanh trên thẻ định danh) |
| Menu "Thêm": Ghi lại email, SMS, WhatsApp, LinkedIn | Nhãn "Ngoài phạm vi" (CRM-01, nút nhanh trên thẻ định danh) |
| Tab Email | Câu thông báo, không gọi API |
| Nút "Gọi điện" ở tab Cuộc gọi | Vô hiệu, có tooltip |
| Mục "Email" trong bộ lọc | Có nhưng không có dữ liệu |

**Vùng tải lại sau khi tạo, sửa, xoá, hoàn thành hoạt động**

| Vùng | Khi nào |
|---|---|
| Timeline (trang đầu, giữ tab và bộ lọc) | Luôn |
| Tab Tổng quan: Việc sắp tới, Tương tác gần đây, Tóm tắt (CRM-02, tab Tổng quan) | Luôn |
| Card thuộc tính chính (Liên hệ gần nhất) | Khi hoạt động là Cuộc gọi hoặc Cuộc họp |
| Ô Hoạt động tiếp theo trên danh sách Deals | Khi cửa sổ soạn mở từ danh sách (CRM-04, cột Hoạt động tiếp theo) |

## B. Dữ liệu

File này chỉ đặc tả giao diện. Dữ liệu ở CRM-00 (phần hoạt động và bảng nối hoạt động với bản ghi) và F03-S6.

- Collection: `crm_activities` và bảng nối với bản ghi.
- Danh mục dùng trong biểu mẫu: D-REMINDER (Gửi nhắc nhở), D-REPEAT (Lặp lại), D-TASKKIND (Loại task), D-PRIORITY (Ưu tiên), `queue` (Hàng đợi), D-CALLOUTCOME (Kết quả cuộc gọi), D-MEETOUTCOME (Kết quả cuộc họp).
- Người thực hiện lấy từ `NhanVien` đang làm việc (CRM-00, collection nhân viên).
- Query trên URL: `tab=activities`, `atab` nhận `ALL`, `NOTE`, `EMAIL`, `CALL`, `TASK`, `MEETING`.

## C. API

Mọi API thuộc F03-S6. File này chỉ nêu chỗ giao diện dùng.

| Việc | API và trường dùng |
|---|---|
| Gợi ý liên kết khi mở cửa sổ | F03-S6, gợi ý liên kết; gọi với bản ghi chủ |
| Tạo hoạt động | F03-S6, tạo hoạt động; gửi kèm `followUpTask` khi tick task theo dõi |
| Sửa hoạt động | PATCH với danh sách liên kết đầy đủ (F03-S6, sửa hoạt động) |
| Timeline | F03-S6, API timeline. Gửi `tab`, `q`, bộ lọc loại, khoảng thời gian, người thực hiện (`actor`). Trả `pinned`, `upcoming.items`, `upcoming` `total`, `items`, `nextCursor`; mỗi mục có `links.count` và `can` (ví dụ `can.complete`, `can.delete`) |
| Tải thêm việc sắp tới | API timeline với `section=upcoming` |
| Tải trang tiếp | API timeline với con trỏ `nextCursor` |
| Ghim, bỏ ghim | F03-S6, ghim hoạt động |
| Hoàn thành, mở lại task | F03-S6, `complete` và `reopen`; phản hồi cho biết task kỳ tiếp đã tạo |
| Nhắc nhở, lặp lại | Job nhắc và job lặp của F03-S6 |
| Sự kiện hệ thống trên timeline | F03-S3, nội dung sự kiện hệ thống |
| Trường tính (Liên hệ gần nhất, Hoạt động tiếp theo) | F03-S2 cập nhật sau giao dịch |

## D. Lệch so với sheet / prototype

**Lệch so với sheet, cần PO xác nhận**

- Sheet ghi A-04, A-05, A-06, A-08, A-09, A-11, A-12, A-13, A-14 là "Chỉ FE", nhưng tất cả cần collection `crm_activities` và API của F03-S6 (tạo, timeline, ghim, hoàn thành). Không có BE thì không lưu, không đọc được gì. Đề nghị sửa cột Phạm vi thành "FE + BE" (giống cách xử lý D-03, D-07, D-08 ở CRM-04).
- A-16 (bình luận) theo sheet chỉ áp cho Ghi chú và Task; spec giữ đúng phạm vi đó. A-16 là P2 và QĐ-10 đề xuất để sang đợt sau.
- Tên tab và mục lọc dùng "Email", "Task" thay cho "Emails", "Tasks" của sheet (A-11, A-12), theo quy ước dùng ngôn ngữ sản phẩm tiếng Việt.
- A-15 (Email, SMS, gọi trực tiếp) sheet ghi "Ngoài phạm vi"; spec chỉ kiểm rằng các chỗ còn giữ hiện đúng trạng thái và không gọi API.

Phạm vi và ưu tiên theo sheet: A-01 P0 Chỉ FE · A-02 P1 FE + BE · A-03 P0 FE + BE · A-04 P1 Chỉ FE · A-05 P0 Chỉ FE · A-06 P0 Chỉ FE · A-07 P2 FE + BE · A-08 P0 Chỉ FE · A-09 P0 Chỉ FE · A-10 P1 FE + BE · A-11 P0 Chỉ FE · A-12 P1 Chỉ FE · A-13 P1 Chỉ FE · A-14 P0 Chỉ FE · A-15 P2 Ngoài phạm vi · A-16 P2 FE + BE.

**Lệch so với prototype**

| Trong prototype | Bản thật |
|---|---|
| Hoạt động lưu `localStorage` | `crm_activities` và bảng nối (CRM-00, F03-S6) |
| `autoRefs` chọn liên kết ở FE | Gợi ý từ máy chủ (F03-S6, gợi ý liên kết) |
| Nút chèn liên kết, đính kèm chỉ hiện toast | Không có hai nút này (BR-03) |
| "Lặp lại" là ô tick, không làm gì | Ô chọn chu kỳ; máy chủ sinh kỳ tiếp (BR-06) |
| "Gửi nhắc nhở" chỉ lưu giá trị | Job nhắc gửi thông báo chuông (F03-S6) |
| Ghim theo trình duyệt | Ghim theo bản ghi, dùng chung (F03-S6) |
| Người thực hiện là danh sách tên cố định | NhanVien đang làm việc (CRM-00) |
| Mọi người tick hoàn thành được mọi task | Theo `can.complete` (BR-12) |
| Xoá ghi "Không thể hoàn tác" | Xoá mềm, khôi phục 30 ngày (BR-11) |
| Lọc, tìm, nhóm trên mảng đã tải | API timeline có phân trang (F03-S6) |
| Menu "Thu gọn tất cả" có mục "Mới nhất trước" không làm gì | Bỏ mục đó; thứ tự luôn mới nhất trước |
| Không có bình luận | Có (UC-11) |

**Ngoài phạm vi file này:** tab Tổng quan (CRM-02, CRM-03); trường tính Ngày hoạt động gần nhất, Liên hệ gần nhất, Hoạt động tiếp theo (F03-S2); nội dung sự kiện hệ thống (F03-S3); dữ liệu, API, job nền của hoạt động (F03-S6).

## E. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai |
|---|---|---|
| Q1 | Mốc "ngày làm việc" có cần trừ ngày nghỉ lễ không? (cùng câu hỏi ở F03-S6) | Khách |
| Q2 | Nút "Email" và nút "Gọi điện" vô hiệu có làm khách hiểu nhầm không, hay nên ẩn? (cùng câu hỏi ở CRM-01) | Khách |
| Q3 | Có cần đính kèm tệp vào ghi chú không? (cùng câu hỏi ở F03-S6) | Khách |
| Q4 | Sheet ghi A-05, A-06, A-08, A-09 là "Chỉ FE" nhưng cần BE. Đồng ý sửa cột Phạm vi? | PO |

## F. Tài liệu liên quan

- Plan: `00-PLAN-viet-spec.md`
- Prototype: `crm-record-hubspot.html` với `?type=contact`, `company` hoặc `deal` và `&id=` (tab Hoạt động); `crm-giao-dich-hubspot.html` (Lên lịch từ danh sách Deals); code `crm-objects.js` (`composer`, `timeline`); CSS `crm-shared.css` (`.composer`, `.cm-*`, `.tl-*`, `.ta`)
- Spec nền: `F03-S6-activities-timeline.md` (API hoạt động, timeline, job nhắc và lặp), `F03-S3-nhat-ky-thay-doi-su-kien.md` (sự kiện, người theo dõi), F03-S2 (trường tính)
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` (hoạt động, bảng nối)
- Khung: `CRM-01-khung-danh-sach-trang-chi-tiet.md` (nút nhanh, cột giữa trang chi tiết)
- Màn liên quan: CRM-02, CRM-03 (tab Tổng quan), CRM-04 (danh sách Deals)
- Design system: `DESIGN-SYSTEM-HUBSPOT.md` (chip lọc, timeline, cửa sổ soạn)
- Đối chiếu HubSpot: `DOI-CHIEU-CHUC-NANG.md` phần Activities. Nguồn: portal 247428660, Deal 001, khảo sát 29/09/2026 (chỉ mở và đóng cửa sổ soạn, không lưu gì)

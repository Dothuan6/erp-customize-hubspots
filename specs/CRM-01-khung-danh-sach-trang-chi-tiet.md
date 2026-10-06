# CRM-01 — Khung danh sách và trang chi tiết dùng chung

# Product Requirement Document

| | | | |
|---|---|---|---|
| **Project Owner** | TTS | **Update at** | 02-10-2026 |
| **Created by** | TTS (qua Claude) | **Project** | CRM theo UX HubSpot — HarnexAI ERP |
| **Version** | 2.0 | **Features** | C-03, C-04, C-05, C-07, C-08, C-10, C-11, C-12, C-15, C-17, C-22 (khung dùng chung cho Contacts, Companies, Deals) |

**CONTENT**

- USER STORIES
- OVERVIEW FLOW
- USE CASE DESCRIPTION
  - UC-1: Xem danh sách và đổi view
  - UC-2: Tìm kiếm và sắp xếp
  - UC-3: Lọc nhanh
  - UC-4: Lọc nâng cao
  - UC-5: Chỉnh cột và sửa ô trong bảng
  - UC-6: Cài đặt và lưu view
  - UC-7: Mở rộng dòng
  - UC-8: Xem trước bản ghi
  - UC-9: Xem danh sách dạng board
  - UC-10: Thao tác hàng loạt
  - UC-11: Xem trang chi tiết và dùng nút hành động nhanh
  - UC-12: Dùng menu Thao tác
  - UC-13: Xem và sửa thuộc tính
  - UC-14: Xem, thêm, gỡ liên kết ở card liên kết
  - UC-15: Quản lý tệp đính kèm
  - UC-16: Tạo bản ghi bằng panel tạo
- BUSINESS RULE
- ACCEPTANCE CRITERIA
- PHỤ LỤC

**VERSION HISTORY**

| **Ver** | **Author** | **Description** | **Updated at** |
|---|---|---|---|
| 2.0 | TTS (qua Claude) | Viết lại theo mẫu PRD: user story, use case, business rule, acceptance criteria. Nội dung giữ như bản 1.3 | 02-10-2026 |
| 1.x | TTS (qua Claude) | Các bản trước 02-10-2026 (1.0 → 1.3: bản đầu và các lần bổ sung theo review đợt 2, 3, 4) | 30-09-2026 → 01-10-2026 |

---

# USER STORIES

US-KHUNG-01: Là sale, tôi muốn xem danh sách contact, công ty, deal theo từng view và chuyển nhanh giữa các view để thấy đúng nhóm bản ghi mình cần. (C-10, C-12)

US-KHUNG-02: Là sale, tôi muốn tìm kiếm, sắp xếp và lọc danh sách theo owner, ngày, trạng thái để thu hẹp danh sách trong vài lần bấm. (C-03, C-04, C-05)

US-KHUNG-03: Là sale, tôi muốn chọn cột, mật độ, kiểu Bảng hoặc Board rồi lưu thành view để lần sau mở lại đúng cách nhìn đó. (C-10)

US-KHUNG-04: Là sale, tôi muốn xem bản ghi liên kết và thông tin chính của một bản ghi ngay trên danh sách để không phải mở trang chi tiết. (C-07, C-08)

US-KHUNG-05: Là quản lý kinh doanh, tôi muốn gán owner hoặc xoá nhiều bản ghi trong một lần để không phải làm từng dòng. (C-11)

US-KHUNG-06: Là sale, tôi muốn ghi nhanh ghi chú, cuộc gọi, task, cuộc họp từ trang chi tiết để lưu lại việc đã làm với khách. (C-15)

US-KHUNG-07: Là sale, tôi muốn theo dõi, nhân bản, gộp, xoá bản ghi và xem lịch sử thay đổi từ một menu trên trang chi tiết. (C-17)

US-KHUNG-08: Là sale, tôi muốn xem và sửa thuộc tính, thêm và gỡ liên kết ngay trên trang chi tiết để hồ sơ khách luôn đúng.

US-KHUNG-09: Là sale, tôi muốn đính kèm tệp vào bản ghi để giữ báo giá, hợp đồng cùng chỗ với khách. (C-22)

US-KHUNG-10: Là lập trình viên màn CRM, tôi muốn một khung danh sách và trang chi tiết dùng chung đọc cấu hình của từng đối tượng, để Contacts, Companies, Deals chỉ khai báo cấu hình và phần riêng.

# OVERVIEW FLOW

| **Bước** | **Tác nhân** | **Mô tả** |
|---|---|---|
| 1 | Người dùng | Mở danh sách Contacts, Companies hoặc Deals. |
| 2 | Hệ thống | Đọc cấu hình đối tượng và hiện header, tab view, thanh công cụ, thanh bộ lọc nhanh, bảng hoặc board, footer. |
| 3 | Người dùng | Chọn view, tìm kiếm, lọc nhanh, lọc nâng cao, sắp xếp, chỉnh cột. |
| 4 | Hệ thống | Tải lại danh sách từ máy chủ và ghi mọi trạng thái vào URL. View không tự lưu, tab hiện dấu "đã thay đổi". |
| 5 | Người dùng | Mở rộng dòng hoặc bấm "Xem trước" để xem nhanh; chọn nhiều dòng để gán owner hoặc xoá. |
| 6 | Người dùng | Bấm tên bản ghi để mở trang chi tiết. |
| 7 | Hệ thống | Hiện trang ba cột: định danh và thuộc tính bên trái, tab Tổng quan và Hoạt động ở giữa, card liên kết và tệp đính kèm bên phải. |
| 8 | Người dùng | Sửa thuộc tính tại chỗ, bấm nút nhanh để ghi hoạt động, thêm hoặc gỡ liên kết, tải tệp, dùng menu "Thao tác ▾". |
| 9 | Hệ thống | Lưu từng thay đổi, báo kết quả bằng toast; máy chủ ghi sự kiện vào timeline. |
| 10 | Người dùng | Khi cần tạo bản ghi: bấm "Thêm …" ở header hoặc "+ Thêm" ở card liên kết, điền panel tạo và bấm "Tạo". |

# USE CASE DESCRIPTION

## UC-1: Xem danh sách và đổi view (C-12)

| | |
|---|---|
| **Actor** | Người dùng có quyền `record.read` trên collection |
| **Trigger** | Mở danh sách Contacts, Companies hoặc Deals |
| **Pre-condition** | Không có |
| **Main Flow** | 1. Hệ thống hiện màn danh sách theo bố cục ở Phụ lục A: header, hàng tab view, thanh công cụ, thanh bộ lọc nhanh, bảng hoặc board, footer.<br>2. Header hiện tiêu đề dạng nút "Contacts ⌄", số bản ghi của view, menu ⋮ và nút split "Thêm contacts ▾".<br>3. Hàng tab hiện các view hệ thống của đối tượng, rồi các view người dùng đã lưu.<br>4. Người dùng bấm một tab để đổi view.<br>5. Hệ thống tải danh sách theo view đó và ghi view vào URL.<br>6. Người dùng bấm tiêu đề để chuyển sang Contacts, Companies, Deals hoặc "Dữ liệu khác…" (về trang Dữ liệu của ERP).<br>7. Người dùng dùng footer để đổi trang, đổi số dòng mỗi trang, làm mới, Export, khôi phục view, nhân bản view.<br>8. Người dùng bấm tên một bản ghi để mở trang chi tiết (UC-11). |
| **Post-condition** | Mọi trạng thái của danh sách nằm trong URL. Gửi link cho đồng nghiệp là họ thấy đúng cùng danh sách, theo quyền của họ. Nút Back của trình duyệt quay về trạng thái trước. |
| **Exception Flow** | 1a. Không có quyền đọc collection → trang thông báo "Bạn chưa có quyền xem Contacts".<br>1b. Đang tải lần đầu → skeleton 8 dòng giữ đúng cột.<br>1c. Lỗi tải → giữ header bảng, hiện "Không tải được danh sách. Thử lại" kèm nút Thử lại.<br>3a. Tab tràn chiều ngang → cuộn ngang; menu "Tất cả view" ở cuối liệt kê đủ.<br>5a. Collection chưa có bản ghi → "Chưa có contact nào", nút "Thêm contact", link "Import từ file".<br>5b. Có bộ lọc nhưng không khớp → "Không có contact nào khớp bộ lọc" và nút "Xoá tất cả bộ lọc".<br>5c. View "của tôi" mà tài khoản chưa gắn nhân viên → "Tài khoản của bạn chưa được gắn với nhân viên nào nên chưa có bản ghi 'của tôi'. Liên hệ quản trị viên để gắn."<br>5d. Đang tải lại (đổi bộ lọc, đổi trang) → giữ dữ liệu cũ mờ đi, thanh tiến độ mảnh trên đầu bảng.<br>1d. Mở bằng link có `?batch=<id>` → danh sách chỉ hiện bản ghi của lần thao tác hàng loạt đó (BR-02). |

## UC-2: Tìm kiếm và sắp xếp (C-03)

| | |
|---|---|
| **Actor** | Người dùng đang ở danh sách |
| **Trigger** | Gõ vào ô tìm kiếm, bấm nút "Sắp xếp" hoặc bấm tiêu đề cột |
| **Pre-condition** | Danh sách đã tải |
| **Main Flow** | 1. Người dùng bấm phím `/` hoặc bấm vào ô tìm kiếm.<br>2. Người dùng gõ từ khoá.<br>3. Hệ thống gửi truy vấn sau khi người dùng ngừng gõ 300 ms.<br>4. Hệ thống hiện các bản ghi có từ khoá trong các trường tìm kiếm của đối tượng và ghi từ khoá vào URL.<br>5. Người dùng bấm "Sắp xếp", chọn trường và chiều tăng hoặc giảm.<br>6. Hệ thống sắp lại danh sách, hiện mũi tên ở tiêu đề cột tương ứng và ghi sắp xếp vào URL.<br>7. Người dùng cũng có thể bấm tiêu đề cột: lần 1 tăng, lần 2 giảm, lần 3 bỏ sắp xếp (về mặc định).<br>8. Người dùng bấm nút "Bộ lọc" trên thanh công cụ để ẩn hoặc hiện thanh bộ lọc nhanh. |
| **Post-condition** | Danh sách theo từ khoá và sắp xếp mới. Trạng thái ẩn hoặc hiện thanh bộ lọc nhanh được nhớ theo người dùng. |
| **Exception Flow** | 1a. Người dùng đang gõ trong ô nhập khác → phím `/` không nhảy sang ô tìm.<br>2a. Xoá hết chữ → bỏ điều kiện tìm.<br>5a. Cột lấy qua liên kết (ví dụ "Công ty chính") → không sắp xếp được: tiêu đề không có mũi tên, menu cột không có mục sắp xếp. |

## UC-3: Lọc nhanh (C-04)

| | |
|---|---|
| **Actor** | Người dùng đang ở danh sách |
| **Trigger** | Bấm một nút trên thanh bộ lọc nhanh, ví dụ "Contact owner ▾" |
| **Pre-condition** | Thanh bộ lọc nhanh đang hiện |
| **Main Flow** | 1. Hệ thống hiện hàng nút bộ lọc nhanh theo cấu hình đối tượng. Ví dụ Contacts: Contact owner ▾, Ngày tạo ▾, Ngày hoạt động gần nhất ▾, Lead status ▾. Sau đó là nút ⊕, nút ✎ và "Bộ lọc nâng cao (n)".<br>2. Người dùng bấm một nút.<br>3. Hệ thống mở popover theo kiểu trường (Phụ lục A).<br>4. Người dùng chọn giá trị. Kiểu checkbox: tick là áp dụng ngay. Khoảng ngày tuỳ chọn, văn bản, số: bấm "Áp dụng".<br>5. Hệ thống lọc danh sách. Nút đổi nền và hiện giá trị ngắn gọn, ví dụ "Owner: Minh Trần, Lan Lê", "Ngày tạo: 30 ngày qua".<br>6. Người dùng bấm ⊕, chọn một trường để thêm nút bộ lọc vào cuối hàng.<br>7. Người dùng bấm ✎ để kéo đổi thứ tự nút hoặc bấm ✕ để gỡ một nút.<br>8. Người dùng bấm link "Xoá tất cả" để bỏ mọi bộ lọc. |
| **Post-condition** | Bộ lọc nằm trong URL. View chưa được lưu, tab hiện dấu "đã thay đổi". |
| **Exception Flow** | 4a. Bấm "Xoá" trong popover → bỏ bộ lọc đó.<br>5a. Bộ lọc có hơn 2 giá trị → nút hiện "Lead status: 3 giá trị".<br>7a. Gỡ bộ lọc mặc định của đối tượng → gỡ được; "Khôi phục view" đưa về như cũ.<br>8a. Chưa có bộ lọc nhanh hay nâng cao nào → link "Xoá tất cả" không hiện.<br>1a. F03-S2 chưa xong → nút "Ngày hoạt động gần nhất" ẩn khỏi cấu hình mặc định. |

## UC-4: Lọc nâng cao (C-05)

| | |
|---|---|
| **Actor** | Người dùng đang ở danh sách |
| **Trigger** | Bấm "Bộ lọc nâng cao (n)" trên thanh bộ lọc nhanh, hoặc chọn "Lọc theo cột này" ở menu tiêu đề cột |
| **Pre-condition** | Danh sách đã tải |
| **Main Flow** | 1. Hệ thống mở panel phải 460 px có scrim.<br>2. Panel hiện danh sách điều kiện dọc, mỗi điều kiện một thẻ có nút xoá.<br>3. Người dùng thêm điều kiện: chọn trường, chọn điều kiện theo kiểu trường (Phụ lục A), nhập giá trị.<br>4. Người dùng bấm "Áp dụng".<br>5. Hệ thống lọc danh sách theo mọi điều kiện, nối VÀ.<br>6. Nút trên thanh bộ lọc hiện số điều kiện đang bật, ví dụ "Bộ lọc nâng cao (2)". |
| **Post-condition** | Điều kiện nằm trong URL. View chưa được lưu. |
| **Exception Flow** | 3a. Trường đã có ở bộ lọc nhanh → vẫn thêm được; panel ghi chú dưới điều kiện đó "Trường này cũng đang được lọc ở bộ lọc nhanh."<br>4a. Đóng panel (✕, "Huỷ", bấm scrim) mà không bấm "Áp dụng" → danh sách không đổi.<br>4b. Bấm "Xoá tất cả" trong panel → bỏ mọi điều kiện. |

## UC-5: Chỉnh cột và sửa ô trong bảng (C-10)

| | |
|---|---|
| **Actor** | Người dùng đang ở danh sách dạng bảng |
| **Trigger** | Bấm cột "+", chọn "Chỉnh sửa cột…", bấm menu tiêu đề cột, hoặc bấm vào một ô |
| **Pre-condition** | Danh sách đang ở kiểu Bảng |
| **Main Flow** | 1. Bảng hiện cột checkbox, cột chính (tên bản ghi), các cột mặc định của đối tượng, rồi cột "+".<br>2. Người dùng bấm "+", tìm và chọn một trường chưa hiện để thêm cột.<br>3. Người dùng chọn "Chỉnh sửa cột…" (cuối danh sách của "+", hoặc trong menu ⚙).<br>4. Hệ thống mở hộp "Chỉnh sửa cột": bên trái là mọi trường có ô tìm và checkbox; bên phải là cột đang hiện.<br>5. Người dùng tick để thêm, bấm ✕ để bỏ, kéo để đổi thứ tự, rồi áp dụng.<br>6. Người dùng kéo mép tiêu đề để đổi bề rộng cột; bấm đúp mép để về mặc định.<br>7. Người dùng bấm tiêu đề cột (hoặc ⋮ khi rê chuột) để mở menu: Sắp xếp tăng, Sắp xếp giảm, Lọc theo cột này, Ẩn cột, Sửa trường.<br>8. Người dùng bấm một ô để sửa tại chỗ: Enter lưu, Esc huỷ, bấm ra ngoài là lưu.<br>9. Hệ thống lưu giá trị mới vào bản ghi. |
| **Post-condition** | Cột hiện, thứ tự và bề rộng cột thuộc view (chưa lưu cho tới khi người dùng lưu view). Giá trị ô đã sửa được lưu vào bản ghi ngay. |
| **Exception Flow** | 5a. Cột chính → không bỏ được.<br>5b. Đối tượng có thứ tự cột theo trường (`columnOrder: field`, ví dụ Deals) → cột bên phải chỉ có ✕, không kéo được, trên đầu ghi "Thứ tự cột theo thứ tự trường. Đổi thứ tự trong Quản lý trường."<br>7a. Người không có quyền quản lý trường → không có mục "Sửa trường".<br>8a. Trường tính, cột lấy qua liên kết → không sửa được (con trỏ bình thường, không viền khi rê).<br>8b. Không có quyền ghi bản ghi → ô không vào chế độ sửa.<br>9a. Lưu lỗi (ví dụ trùng email) → ô trở về giá trị cũ, hiện thông báo lỗi tiếng Việt từ API.<br>9b. Bản ghi vừa được người khác sửa → xem BR-22. |

## UC-6: Cài đặt và lưu view (C-10)

| | |
|---|---|
| **Actor** | Người dùng đang ở danh sách |
| **Trigger** | Bấm nút ⚙ trên thanh công cụ, nút "+" cuối hàng tab, hoặc icon "Khôi phục view", "Nhân bản view" ở footer |
| **Pre-condition** | Danh sách đã tải |
| **Main Flow** | 1. Người dùng bấm ⚙.<br>2. Hệ thống mở menu: Kiểu hiển thị (Bảng / Board), Mật độ (Thoáng / Gọn), Chỉnh sửa cột…, Lưu view, Đổi tên view, Xoá view, Khôi phục view mặc định.<br>3. Người dùng đổi kiểu hiển thị, mật độ, bộ lọc, sắp xếp hoặc cột.<br>4. Hệ thống áp dụng ngay. View không tự lưu; tab hiện dấu chấm "đã thay đổi".<br>5. Người dùng chọn một trong các cách xử lý thay đổi:<br>5.1. "Lưu view" trong menu ⚙: ghi thay đổi vào view đang mở.<br>5.2. "Nhân bản view" ở footer: đặt tên, lưu trạng thái hiện tại thành view mới, mặc định riêng tư.<br>5.3. "Khôi phục view" ở footer: bỏ thay đổi, về trạng thái đã lưu.<br>5.4. Nút "+" cuối hàng tab: tạo view mới từ trạng thái hiện tại, đặt tên và chọn chia sẻ cho mọi người hay chỉ mình. |
| **Post-condition** | View được lưu, tạo mới hoặc trở về trạng thái đã lưu. Mật độ lưu theo người dùng, không lưu vào view. |
| **Exception Flow** | 2a. View hệ thống → không sửa, không xoá được; không có "Đổi tên view", "Xoá view".<br>2b. Người dùng không phải người tạo view và không có quyền quản lý view chung → không có mục "Lưu view".<br>2c. View chưa có thay đổi → không có mục "Lưu view".<br>2d. Chọn "Xoá view" → hỏi qua hộp xác nhận.<br>2e. "Khôi phục view mặc định" trên view hệ thống → bộ lọc nhanh, cột, sắp xếp, mật độ về cấu hình của đối tượng. Trên view người dùng → về trạng thái đã lưu. |

## UC-7: Mở rộng dòng (C-07)

| | |
|---|---|
| **Actor** | Người dùng đang ở danh sách dạng bảng |
| **Trigger** | Bấm nút › cạnh tên bản ghi |
| **Pre-condition** | Đối tượng có khai báo đối tượng liên kết để mở rộng (`expand`) |
| **Main Flow** | 1. Hệ thống mở popover chọn đối tượng liên kết. Ví dụ Contacts: "Companies", "Deals".<br>2. Người dùng chọn một mục.<br>3. Hệ thống chèn ngay dưới dòng một dòng phụ chứa bảng con các bản ghi liên kết. Nút › xoay 90°.<br>4. Bảng con hiện tối đa 5 bản ghi, mỗi bản ghi 3–4 cột tóm tắt, kèm nhãn liên kết nếu có (ví dụ "Người quyết định").<br>5. Người dùng bấm "+ Thêm" ở góc bảng con để thêm liên kết, cùng hành vi như "+ Thêm" của card liên kết (UC-14). |
| **Post-condition** | Dòng ở trạng thái mở rộng cho tới khi người dùng đóng hoặc đổi trang, bộ lọc, sắp xếp. |
| **Exception Flow** | 4a. Còn nhiều hơn 5 bản ghi → link "Xem tất cả n" mở trang chi tiết và cuộn tới card tương ứng (`?card=<associationId>`).<br>4b. Dòng chưa có liên kết nào → "Chưa có {tên đối tượng} nào" (ví dụ "Chưa có deal nào") và "+ Thêm".<br>2a. Dòng đang mở một đối tượng, người dùng chọn đối tượng khác → thay bảng con.<br>3a. Đổi trang, đổi bộ lọc hay đổi sắp xếp → đóng mọi dòng đang mở. |

## UC-8: Xem trước bản ghi (C-08)

| | |
|---|---|
| **Actor** | Người dùng đang ở danh sách (bảng hoặc board) |
| **Trigger** | Bấm nút "Xem trước" hiện khi rê chuột vào ô tên (bảng) hoặc trên thẻ (board) |
| **Pre-condition** | Danh sách đã tải |
| **Main Flow** | 1. Hệ thống mở panel Xem trước. Màn từ 1240 px trở lên: panel dock bên phải vùng nội dung, rộng 400 px, bảng co lại, không có scrim.<br>2. Panel hiện tên, avatar, dòng phụ như trang chi tiết và nút "Mở trang chi tiết".<br>3. Panel hiện danh sách thuộc tính chính của đối tượng, sửa tại chỗ được.<br>4. Panel hiện tóm tắt liên kết: mỗi card bên phải của trang chi tiết thu thành một dòng, ví dụ "Companies (1): Dược phẩm Thiên Phúc". Bấm dòng thì mở trang chi tiết ở card đó.<br>5. Người dùng sửa một thuộc tính trong panel.<br>6. Hệ thống lưu và cập nhật luôn dòng tương ứng trên bảng.<br>7. Người dùng bấm Esc hoặc ✕ để đóng panel. |
| **Post-condition** | Thay đổi trong panel đã lưu vào bản ghi. |
| **Exception Flow** | 1a. Màn dưới 1240 px → panel phủ 460 px có scrim.<br>1b. Thiết bị cảm ứng → nút "Xem trước" hiện thường trực ở cột chính.<br>1c. Panel đang mở, người dùng bấm "Xem trước" của dòng khác → panel đổi sang bản ghi đó, không đóng rồi mở lại. |

## UC-9: Xem danh sách dạng board

| | |
|---|---|
| **Actor** | Người dùng đang ở danh sách |
| **Trigger** | Chọn "Board" ở nhóm nút Bảng/Board trên thanh công cụ hoặc trong menu ⚙ |
| **Pre-condition** | Đối tượng có khai báo board |
| **Main Flow** | 1. Hệ thống hiện board. Mỗi cột là một lựa chọn của trường làm cột, theo đúng thứ tự trong danh mục.<br>2. Đầu mỗi cột hiện tên lựa chọn và số thẻ. Deals có thêm tổng tiền (theo CRM-04).<br>3. Mỗi cột tải 20 thẻ đầu; cuộn tới cuối cột thì tải thêm.<br>4. Người dùng kéo một thẻ sang cột khác.<br>5. Hệ thống cập nhật trường ngay, thẻ ở lại cột mới. Máy chủ ghi sự kiện vào timeline.<br>6. Người dùng bấm "Cột theo ▾" (chỉ hiện ở chế độ Board) để đổi trường làm cột sang một trường Lựa chọn đơn khác của collection.<br>7. Hệ thống vẽ lại board theo trường mới và tải lại số thẻ mỗi cột. |
| **Post-condition** | Kiểu hiển thị và trường "Cột theo" là thay đổi chưa lưu của view. Bộ lọc và tìm kiếm áp dụng cho board như cho bảng. |
| **Exception Flow** | 1a. Có bản ghi mà trường làm cột đang rỗng → không hiện trên board; dưới hàng cột có dòng "12 bản ghi chưa có Lifecycle stage không hiển thị trên board" kèm link chuyển sang bảng đã lọc "(Trống)".<br>5a. Lưu lỗi → thẻ quay về cột cũ và hiện thông báo.<br>4a. Không có quyền ghi bản ghi → thẻ không kéo được.<br>6a. Bấm "Khôi phục view" → về trường làm cột mặc định của đối tượng. |

## UC-10: Thao tác hàng loạt (C-11)

| | |
|---|---|
| **Actor** | Người dùng có quyền ghi (gán owner) hoặc `record.delete` (xoá) |
| **Trigger** | Tick checkbox đầu dòng hoặc checkbox tiêu đề |
| **Pre-condition** | Danh sách đang ở kiểu Bảng |
| **Main Flow** | 1. Người dùng tick từng dòng, hoặc tick checkbox tiêu đề để chọn mọi dòng của trang hiện tại.<br>2. Hệ thống thay thanh công cụ bằng thanh hàng loạt: "Đã chọn N", Gán owner, Xoá, Bỏ chọn.<br>3. Khi đã chọn cả trang và tổng số bản ghi lớn hơn một trang, người dùng có thể bấm link "Chọn tất cả 312 bản ghi khớp bộ lọc".<br>4. Trường hợp gán owner:<br>4.1. Người dùng bấm "Gán owner", tìm và chọn một nhân viên hoặc "Bỏ owner".<br>4.2. Hệ thống hỏi "Gán owner Lan Lê cho 24 contact?".<br>4.3. Người dùng xác nhận. Hệ thống đổi owner và báo "Đã gán owner cho 24 contact".<br>5. Trường hợp xoá:<br>5.1. Người dùng bấm "Xoá".<br>5.2. Hệ thống mở hộp xác nhận có nút đỏ "Xoá 24 contact" và nội dung "24 contact sẽ được chuyển vào thùng rác và có thể khôi phục trong 30 ngày. Liên kết của chúng với company, deal sẽ bị gỡ theo và cũng được khôi phục khi khôi phục contact."<br>5.3. Người dùng xác nhận. Hệ thống chuyển các bản ghi vào thùng rác. |
| **Post-condition** | Bản ghi có owner mới hoặc nằm trong thùng rác. Mỗi bản ghi đổi owner có một sự kiện riêng trên timeline. |
| **Exception Flow** | 3a. F03-S5 chưa có → link "Chọn tất cả … khớp bộ lọc" không hiện, chỉ chọn được trong trang.<br>1a. Đổi bộ lọc, tìm kiếm hay view → bỏ chọn hết.<br>4.3a. Từ 201 bản ghi chọn tay, hoặc chọn theo bộ lọc → chạy nền, thanh tiến độ ở góc màn hình, xong có thông báo.<br>4.3b. Có bản ghi người dùng không có quyền sửa → bỏ qua, kết quả ghi "Đã gán 20. Bỏ qua 4 bản ghi bạn không có quyền sửa."<br>5.3a. API từ chối một số bản ghi (ví dụ không có quyền xoá) → kết quả ghi số đã xoá và số bị bỏ qua.<br>2a. Không có `record.delete` → không có mục Xoá. |

## UC-11: Xem trang chi tiết và dùng nút hành động nhanh (C-15)

| | |
|---|---|
| **Actor** | Người dùng đọc được bản ghi |
| **Trigger** | Bấm tên bản ghi ở danh sách, bấm "Mở trang chi tiết" ở panel Xem trước, hoặc mở `/data/<slug>/records/<id>` |
| **Pre-condition** | Bản ghi tồn tại |
| **Main Flow** | 1. Hệ thống hiện trang ba cột: trái, giữa, phải (Phụ lục A).<br>2. Cột trái, hàng trên cùng: link "‹ Contacts" quay về danh sách và nút "Thao tác ▾" (UC-12).<br>3. Cột trái, phần định danh: avatar, tên chữ lớn, nút ✎ hiện khi rê chuột để đổi tên, dòng phụ theo cấu hình đối tượng.<br>4. Cột trái, sáu nút nhanh dạng tròn có nhãn: Ghi chú, Email, Gọi, Task, Họp, Thêm.<br>5. Cột trái, card thuộc tính chính (UC-13) và card Trường bổ sung (theo CRM-09).<br>6. Cột giữa: tab "Tổng quan" (nếu đối tượng có) và tab "Hoạt động" (theo CRM-05).<br>7. Cột phải: các card liên kết (UC-14) và card Tệp đính kèm (UC-15).<br>8. Người dùng bấm một nút nhanh.<br>9. Hệ thống mở cửa sổ soạn tương ứng (Phụ lục A): Ghi chú, Ghi lại cuộc gọi, Task, Cuộc họp ở chế độ Lên lịch.<br>10. Người dùng bấm "Thêm" để mở menu có ô tìm, chọn "Ghi lại cuộc gọi", "Ghi lại cuộc họp" hoặc "Sắp xếp nút…". |
| **Post-condition** | Xem không đổi dữ liệu. Tab giữa đang mở nằm trong URL (`?tab=activities`). Thứ tự nút nhanh, nếu đổi, lưu theo người dùng và áp cho cả ba đối tượng. |
| **Exception Flow** | 2a. Bấm "‹ Contacts" → về danh sách, giữ nguyên bộ lọc lúc rời đi.<br>8a. Nút Email → vô hiệu, tooltip "Gửi email chưa có trong giai đoạn này".<br>8b. Người dùng không tạo được hoạt động → năm nút hoạt động vô hiệu, tooltip "Bạn chưa có quyền ghi hoạt động".<br>10a. Các mục Ghi lại email, Ghi lại SMS, Ghi lại WhatsApp, Ghi lại tin nhắn LinkedIn → hiện với nhãn "Ngoài phạm vi", bấm không làm gì.<br>1a. Mở bằng `?card=<associationId>` → cuộn tới card liên kết đó và mở nó nếu đang thu gọn.<br>1b. Màn hẹp → bố cục đổi theo BR-15. |

## UC-12: Dùng menu Thao tác (C-17)

| | |
|---|---|
| **Actor** | Người dùng đọc được bản ghi; từng mục cần thêm quyền tương ứng |
| **Trigger** | Bấm "Thao tác ▾" ở hàng trên cùng của trang chi tiết |
| **Pre-condition** | Đang ở trang chi tiết |
| **Main Flow** | 1. Hệ thống mở menu theo thứ tự cố định: Theo dõi / Bỏ theo dõi, Xem tất cả thuộc tính, Xem lịch sử thuộc tính, Xem lịch sử liên kết, Tìm trên Google, vạch ngăn, Nhân bản, Gộp, Xoá.<br>2. Người dùng chọn "Theo dõi": hệ thống thêm tài khoản của người dùng vào người theo dõi bản ghi.<br>3. Người dùng chọn "Xem tất cả thuộc tính": hệ thống mở panel phải 640 px gồm mọi trường của bản ghi, có ô tìm, sửa tại chỗ.<br>4. Người dùng chọn "Xem lịch sử thuộc tính": hệ thống mở panel, người dùng chọn một trường để xem giá trị cũ, giá trị mới, ai đổi, lúc nào.<br>5. Người dùng chọn "Xem lịch sử liên kết": hệ thống mở panel danh sách thêm và gỡ liên kết của bản ghi, lọc được theo đối tượng.<br>6. Người dùng chọn "Tìm trên Google": hệ thống mở tab mới tìm theo tên bản ghi.<br>7. Người dùng chọn "Nhân bản": hệ thống tạo bản sao theo BR-17 rồi mở bản sao.<br>8. Người dùng chọn "Gộp": hệ thống mở hộp thoại gộp hai bước (theo F03-S5, hộp thoại gộp bản ghi).<br>9. Người dùng chọn "Xoá": hệ thống hỏi xác nhận bằng hộp nút đỏ như xoá hàng loạt; xong thì quay về danh sách. |
| **Post-condition** | Tuỳ mục: bản ghi có người theo dõi mới, có bản sao, đã gộp, hoặc nằm trong thùng rác. |
| **Exception Flow** | 1a. Đối tượng không dùng mục nào → bỏ mục đó. Deal không có "Tìm trên Google".<br>1b. Deal → có thêm hai mục của ERP đặt trên cùng: "Kích hoạt Workflow" và "Quản lý trường dữ liệu" (D-14, theo CRM-04).<br>1c. Người dùng không có quyền với một mục (ví dụ Xoá khi không có `record.delete`) → mục ẩn, không để vô hiệu.<br>4a. F03-S3 chưa xong → mục "Xem lịch sử thuộc tính" hiện nhãn "Sắp có" và không bấm được.<br>8a. F03-S5 chưa xong → mục "Gộp" hiện nhãn "Sắp có", bấm không làm gì.<br>7a. Deal → không tạo ngay; mở panel Tạo Deal điền sẵn dữ liệu, Mã Deal để trống. |

## UC-13: Xem và sửa thuộc tính

| | |
|---|---|
| **Actor** | Người dùng đọc được bản ghi; sửa cần quyền ghi bản ghi |
| **Trigger** | Bấm một giá trị trong card thuộc tính chính ở cột trái |
| **Pre-condition** | Đang ở trang chi tiết |
| **Main Flow** | 1. Card hiện tiêu đề theo cấu hình đối tượng ("Thông tin chính", "Về Deal này"), nút ▾ thu gọn và "Thao tác ▾" của card.<br>2. Thân card là danh sách các thuộc tính chính của đối tượng.<br>3. Người dùng bấm một giá trị để sửa tại chỗ.<br>4. Hệ thống lưu và hiện toast "Đã lưu 'Lead status'".<br>5. Cuối card có link "Xem tất cả thuộc tính" và dòng "Ngày tạo: 12/09/2026".<br>6. Người dùng bấm "Thao tác ▾" của card để chọn: Tuỳ chỉnh thuộc tính, Xem tất cả thuộc tính, Xem lịch sử thuộc tính. |
| **Post-condition** | Giá trị mới được lưu vào bản ghi. |
| **Exception Flow** | 3a. Trường tính → chỉ đọc.<br>3b. Không có quyền ghi bản ghi → không vào chế độ sửa.<br>4a. Bản ghi vừa được người khác sửa → "Bản ghi vừa được người khác sửa. Tải lại để xem giá trị mới" kèm nút Tải lại; không ghi đè.<br>4b. Mất mạng khi đang sửa → giữ giá trị vừa nhập trong ô, hiện lỗi, cho thử lại.<br>6a. Hai mục "Làm giàu dữ liệu", "Điền thuộc tính thông minh" → hiện với biểu tượng khoá và nhãn "Ngoài phạm vi". |

## UC-14: Xem, thêm, gỡ liên kết ở card liên kết

| | |
|---|---|
| **Actor** | Người dùng đọc được bản ghi và đối tượng đích; thêm, gỡ cần quyền theo F03-S1, phần quyền liên kết |
| **Trigger** | Xem cột phải của trang chi tiết, bấm "+ Thêm" hoặc menu ⋯ trên một thẻ |
| **Pre-condition** | Đối tượng có khai báo card liên kết (`rightCards`) |
| **Main Flow** | 1. Mỗi card hiện header: ▾ thu gọn, tên và số bản ghi ("Companies (2)"), "+ Thêm", ⚙ chọn thuộc tính hiển thị trên thẻ.<br>2. Card hiện tối đa 5 thẻ, bản ghi Primary trước. Mỗi thẻ có tên dạng link, tag "Primary" nếu có, menu ⋯, 1–3 dòng phụ "Nhãn: giá trị" và nhãn liên kết nếu có.<br>3. Người dùng bấm "+ Thêm". Hệ thống mở panel phải có hai tab: "Tạo mới" và "Thêm có sẵn".<br>4. Tab "Tạo mới": panel tạo của đối tượng đích (UC-16), liên kết với bản ghi đang mở được điền sẵn và khoá.<br>5. Tab "Thêm có sẵn":<br>5.1. Người dùng tìm bản ghi của đối tượng đích.<br>5.2. Người dùng chọn bản ghi; nhập nhãn liên kết nếu kênh có nhãn (áp cho mọi bản ghi đã chọn).<br>5.3. Người dùng bấm "Lưu". Hệ thống thêm liên kết và cập nhật card.<br>6. Người dùng bấm ⋯ trên một thẻ để: Đặt làm Primary, Bỏ Primary, Sửa nhãn liên kết, Gỡ liên kết.<br>7. Gỡ liên kết: hệ thống hỏi "Gỡ liên kết giữa 'Nguyễn Thị Hạnh' và 'DEAL-013'? Hai bản ghi vẫn được giữ nguyên." Người dùng xác nhận thì gỡ. |
| **Post-condition** | Liên kết được thêm, sửa hoặc gỡ. Hai bản ghi vẫn giữ nguyên khi gỡ liên kết. |
| **Exception Flow** | 2a. Card có hơn 5 bản ghi → link "Xem tất cả Companies liên kết" mở panel phải: danh sách đủ, có ô tìm, phân trang 20, cùng menu ⋯.<br>2b. Card rỗng → icon, một câu ngắn do spec đối tượng quy định (ví dụ "Contact này chưa tham gia deal nào.") và nút "Thêm".<br>2c. Kênh có nhãn mà dòng chưa có nhãn → link "Thêm nhãn liên kết".<br>1a. Không có quyền đọc đối tượng đích → card không hiện.<br>1b. Không có quyền thêm, gỡ liên kết → nút "+ Thêm" và các mục ⋯ ẩn.<br>5.2a. Kênh một giá trị (ví dụ Công ty của Deal) → chỉ chọn một bản ghi (radio). Kênh nhiều giá trị → chọn nhiều (checkbox).<br>5.2b. Bản ghi đã liên kết → hiện sẵn tick và mờ.<br>5.3a. Việc thêm sẽ ghi đè một liên kết đang có → hệ thống hỏi trước (BR-19). |

## UC-15: Quản lý tệp đính kèm (C-22)

| | |
|---|---|
| **Actor** | Người dùng đọc được bản ghi; tải lên và gỡ cần quyền ghi bản ghi |
| **Trigger** | Xem card "Tệp đính kèm" ở cột phải, bấm "Tải lên" hoặc menu ⋯ của một tệp |
| **Pre-condition** | Đối tượng có trường Tệp đính kèm (`attachmentField`; theo CRM-00 là trường `attachments` trên Contacts, Companies, Deals) |
| **Main Flow** | 1. Card hiện danh sách tệp: icon theo loại, tên, dung lượng, người tải lên, ngày.<br>2. Người dùng bấm tên tệp để xem trước hoặc tải.<br>3. Người dùng bấm "Tải lên" và chọn một hoặc nhiều tệp.<br>4. Hệ thống tải tệp lên qua F02, xong thì ghi id tệp vào trường.<br>5. Người dùng bấm ⋯ của một tệp, chọn "Tải xuống" hoặc "Gỡ khỏi bản ghi".<br>6. Gỡ: hệ thống hỏi xác nhận, rồi gỡ tệp khỏi trường. |
| **Post-condition** | Trường Tệp đính kèm của bản ghi có thêm hoặc bớt tệp. Tệp đã gỡ vẫn còn trong thư viện Media nếu F02 giữ. |
| **Exception Flow** | 1a. Chưa có tệp → "Chưa có tệp nào" và nút "Tải lên".<br>3a. Người không có quyền ghi bản ghi → chỉ xem và tải xuống.<br>3b. Tệp vượt dung lượng hoặc sai loại → theo giới hạn trong cấu hình trường Tệp đính kèm của ERP.<br>1b. Đối tượng không có `attachmentField` → card không hiện. |

## UC-16: Tạo bản ghi bằng panel tạo

| | |
|---|---|
| **Actor** | Người dùng có quyền `record.write` trên collection |
| **Trigger** | Bấm "Thêm contacts ▾" ở header (phần chữ, hoặc ▾ rồi "Tạo mới"), "Tạo mới" ở card liên kết, hoặc "+ Thêm" ở dòng mở rộng |
| **Pre-condition** | Không có |
| **Main Flow** | 1. Hệ thống mở panel phải 460 px có scrim, tiêu đề "Tạo Contact".<br>2. Panel hiện các trường theo thứ tự cấu hình của đối tượng, đánh dấu * trường bắt buộc.<br>3. Cuối panel có mục "Liên kết với": mỗi kênh là một ô chọn có tìm kiếm (ví dụ Contacts: Company, Deal). Kênh có nhãn thì có thêm ô nhãn.<br>4. Người dùng điền các trường.<br>5. Người dùng bấm "Tạo" hoặc nhấn Ctrl/⌘+Enter.<br>6. Hệ thống tạo bản ghi kèm liên kết trong một giao dịch.<br>7. Hoặc người dùng bấm "Tạo và thêm tiếp": hệ thống tạo xong, làm trống form, giữ liên kết đã điền sẵn từ card, hiện toast "Đã tạo contact". |
| **Post-condition** | Bản ghi mới tồn tại và đã có liên kết ngay khi tạo. |
| **Exception Flow** | 3a. Panel mở từ card liên kết → liên kết với bản ghi đang mở được điền sẵn và khoá.<br>4a. Nhấn Enter trong ô nhập → không gửi form.<br>5a. Còn trường bắt buộc trống → nút "Tạo" vô hiệu, cạnh nút ghi "Còn 1 trường bắt buộc chưa nhập".<br>6a. Lỗi trùng (409, ví dụ email đã có) → hiện ngay dưới ô, không đóng panel. Người dùng đọc được bản ghi trùng: "Email này đã có ở contact Nguyễn Thị Hạnh" kèm link mở contact đó. Không đọc được: "Email này đã được dùng cho một contact khác".<br>1a. Đóng panel khi đã nhập dữ liệu → hỏi "Bỏ nội dung đang nhập?".<br>1b. Không có quyền tạo → nút "Thêm …" ẩn.<br>1c. Bấm ▾ rồi "Import" → mở chức năng Import của ERP. |

# BUSINESS RULE

| **BR** | **Mô tả** |
|---|---|
| BR-01 | **Khung dùng chung và cấu hình đối tượng**<br>- Contacts, Companies, Deals dùng cùng một khung danh sách và cùng một khung trang chi tiết, chỉ khác cấu hình (cột nào, bộ lọc nào, card nào).<br>- Mỗi đối tượng khai báo một cấu hình theo mẫu ở Phụ lục B. Giá trị cụ thể nằm ở CRM-02, CRM-03, CRM-04, phần cấu hình đối tượng.<br>- Khung là các component dùng chung của màn Dữ liệu, đổi theo theme `data-brand="crm"`, không phải một bộ màn riêng.<br>- Collection không thuộc CRM cũng dùng khung này khi bật theme nhưng không có cấu hình đối tượng: danh sách dùng cột và bộ lọc mặc định của ERP; cột phải của trang chi tiết hiện danh sách liên kết chung (theo F03-S1, phần hiển thị liên kết trên trang chi tiết) thay cho các card liên kết.<br>- Style không đặc tả ở đây. Kích thước, màu, bo góc lấy từ DESIGN-SYSTEM-HUBSPOT theo tên component.<br>- Không bỏ chức năng nào ERP đang có trên màn danh sách; vị trí mới của từng chức năng ở Phụ lục A. |
| BR-02 | **Trạng thái danh sách trên URL**<br>- URL query giữ: view đang chọn, từ khoá, bộ lọc nhanh, bộ lọc nâng cao, sắp xếp, chế độ bảng/board, "Cột theo", trang.<br>- Tham số `?batch=<id>`: link trong thông báo gộp của một thao tác hàng loạt mở danh sách với tham số này. Danh sách chỉ hiện các bản ghi thuộc lần thao tác đó (API lọc theo F03-S3, phần thông báo gộp của thao tác hàng loạt).<br>- Khi có `batch`, thanh bộ lọc nhanh hiện một nút đặc biệt "Thao tác hàng loạt lúc 14:05 30/09 ✕"; bấm ✕ bỏ tham số.<br>- Tham số `batch` không lưu vào view khi bấm Lưu hay Nhân bản view. |
| BR-03 | **Header danh sách**<br>- Số bản ghi cạnh tiêu đề tính theo trạng thái đã lưu của view, không tính thay đổi chưa lưu (từ khoá, bộ lọc vừa thêm). Số sau khi áp thay đổi nằm ở footer.<br>- Menu ⋮: Import, Export, Kết nối Google Sheet, Ghim vào sidebar, Chỉnh sửa thuộc tính (mở trang Quản lý trường của collection; tên mục theo sheet C-01). Mục nào người dùng không có quyền thì ẩn.<br>- Nút chính dạng split "Thêm contacts ▾": bấm phần chữ mở panel tạo; bấm ▾ chọn "Tạo mới" hoặc "Import". |
| BR-04 | **View và tab view**<br>- Ba loại view hệ thống dùng lại được: `all` ("Tất cả contacts", không lọc), `mine` ("Contacts của tôi", `owner_id` dùng toán tử `linked_to_me`), `unassigned` ("Contacts chưa có owner", `owner_id` rỗng).<br>- View hệ thống không sửa, không xoá được.<br>- View "của tôi" là bộ lọc, không phải giới hạn quyền.<br>- View dùng cơ chế View sẵn có của ERP (F03 `View`: bộ lọc, sắp xếp, cột, `isShared`).<br>- View không tự lưu khi người dùng đổi bộ lọc, sắp xếp hoặc cột. Tab hiện dấu chấm "đã thay đổi".<br>- Thuộc view (lưu cùng view): bộ lọc, sắp xếp, cột hiện, thứ tự và bề rộng cột, danh sách nút bộ lọc nhanh, kiểu hiển thị Bảng/Board (`View.viewType`), trường "Cột theo".<br>- "Nhân bản view" tạo view mới mặc định riêng tư; view gốc không đổi.<br>- Nút "Lưu" chỉ hiện với người tạo view hoặc người có quyền quản lý view chung, khi view có thay đổi. |
| BR-05 | **Tìm kiếm và sắp xếp**<br>- Ô tìm kiếm quét các trường trong `searchFields` của đối tượng (ví dụ Contacts: `full_name`, `email`, `phone`), khớp chứa chuỗi, không phân biệt hoa thường.<br>- Gửi truy vấn sau khi ngừng gõ 300 ms; chuyển thành bộ lọc F03 dạng `_or` các điều kiện `contains`.<br>- Tìm kiếm nối VÀ với mọi bộ lọc khác đang bật.<br>- Popover "Sắp xếp" cho chọn trường trong các cột đang hiện và `columnsMore`, cùng chiều tăng hoặc giảm.<br>- Chỉ sắp xếp một trường tại một thời điểm.<br>- Mặc định theo `defaultSort` của đối tượng (Contacts, Companies: Ngày tạo giảm dần).<br>- Trường tính (ví dụ Ngày hoạt động gần nhất) sắp xếp được vì F03-S2 lưu giá trị tính vào bản ghi.<br>- Cột lấy qua liên kết không sắp xếp được trong giai đoạn này.<br>- Nút "Bộ lọc" trên thanh công cụ và nút ⌃ cuối thanh bộ lọc nhanh cùng ẩn hoặc hiện thanh bộ lọc nhanh; trạng thái nhớ theo người dùng. |
| BR-06 | **Bộ lọc nhanh**<br>- Nút theo thứ tự `quickFilters` của đối tượng. Nút ⊕ mở danh sách trường trong `quickFiltersMore` và trường người dùng tự tạo (theo CRM-09), có ô tìm.<br>- Popover theo kiểu trường ở Phụ lục A. Kiểu Hộp kiểm, Người dùng, Tiền tệ, Văn bản dài, Đường dẫn: theo CRM-09, phần bộ lọc cho trường tuỳ chỉnh.<br>- Các giá trị trong cùng một bộ lọc nối HOẶC. Các bộ lọc khác nhau, ô tìm kiếm và bộ lọc nâng cao nối VÀ.<br>- Nút đang có giá trị đổi nền và hiện giá trị; quá 2 giá trị thì hiện "{tên}: 3 giá trị".<br>- Popover owner chỉ gồm nhân viên thuộc đội kinh doanh (`is_sales`, theo CRM-08), chia ba nhóm theo thứ tự: Đang làm việc, Tạm nghỉ, Đã nghỉ; hai nhóm sau có nhãn trạng thái. Mục đầu là "(Chưa có owner)".<br>- "Xoá tất cả" bỏ mọi bộ lọc nhanh và nâng cao, giữ view và sắp xếp.<br>- Bộ lọc "Ngày hoạt động gần nhất" cần `last_activity_at` do F03-S2 tính và lưu. Khi F03-S2 chưa xong, nút này ẩn khỏi cấu hình mặc định; không lọc ở phía FE trên dữ liệu đã tải. |
| BR-07 | **Mốc thời gian**<br>- Tính theo múi giờ Asia/Ho_Chi_Minh. Tuần bắt đầu thứ Hai. Bảng mốc ở Phụ lục A.<br>- Khi gửi API, điều kiện "Đến" là trước 00:00 của ngày kế tiếp, để không sót bản ghi tạo trong giây cuối cùng của ngày.<br>- "7 ngày qua" gồm cả hôm nay (7 ngày lịch).<br>- Dòng phụ dưới mỗi mốc trong popover ghi khoảng ngày thật, ví dụ "24/09 – 30/09" khi hôm nay là 30/09.<br>- Trường nằm trong `futureDateFields` của đối tượng (ví dụ Ngày dự kiến chốt của Deals) có thêm bốn mốc tương lai, đặt trước "Tuỳ chọn". Trường khác không có bốn mốc này.<br>- Mốc lưu vào URL và view dưới dạng mã mốc; riêng `custom` lưu hai ngày cụ thể. View "30 ngày qua" mở vào tuần sau vẫn là 30 ngày tính từ hôm đó.<br>- Bộ lọc nâng cao dùng cùng danh sách mốc với bộ lọc nhanh của trường đó. |
| BR-08 | **Bộ lọc nâng cao**<br>- Dùng lại bộ lọc điều kiện đang có của ERP (chọn trường, điều kiện theo kiểu, giá trị). Chức năng giữ nguyên, chỉ đổi cách trình bày.<br>- Các điều kiện nối VÀ. Nếu component hiện có của ERP đã hỗ trợ nhóm HOẶC thì giữ, nhưng không bắt buộc trong giai đoạn này (câu hỏi Q1).<br>- Điều kiện theo kiểu trường ở Phụ lục A, giữ đúng bộ điều kiện ERP.<br>- Một trường có ở cả bộ lọc nhanh và nâng cao: hai điều kiện nối VÀ.<br>- `n` trên nút là số điều kiện đang bật.<br>- Nút cuối panel: "Áp dụng", "Xoá tất cả", "Huỷ". |
| BR-09 | **Cột và ô của bảng**<br>- Thứ tự: cột checkbox (dính trái), cột chính (dính trái), các cột trong `columns`, cột "+".<br>- Cột chính: avatar theo `avatar` của đối tượng, tên dạng link mở trang chi tiết, nút mở rộng ›, nút "Xem trước" hiện khi rê chuột.<br>- `columnOrder: view`: người dùng kéo đổi thứ tự, lưu trong view. `columnOrder: field`: thứ tự cột là thứ tự trường trong Quản lý trường của collection; ẩn/hiện cột và bề rộng vẫn lưu trong view. Deals dùng kiểu `field`.<br>- Link "Đổi thứ tự trong Quản lý trường" chỉ hiện với người có quyền quản lý trường.<br>- Thứ tự và bề rộng cột lưu trong `visibleFieldsJSON` của view (F03).<br>- Mỗi ô một dòng; quá dài cắt bằng "…", rê chuột hiện đủ.<br>- Lựa chọn hiển thị dạng pill màu; owner là avatar nhỏ và tên; email có ↗ mở ứng dụng thư; tiền canh phải, dạng `1.240.000 ₫`; ngày `dd/mm/yyyy`.<br>- Sửa ô kiểu lựa chọn mở popover chọn có ô tìm.<br>- "Lọc theo cột này" mở bộ lọc nâng cao với trường đó. "Sửa trường" đi tới Quản lý trường. |
| BR-10 | **Mở rộng dòng và Xem trước**<br>- Mở rộng: mỗi dòng chỉ mở một đối tượng liên kết tại một thời điểm; nhiều dòng mở cùng lúc được.<br>- Bảng con tối đa 5 bản ghi, 3–4 cột tóm tắt do spec đối tượng định nghĩa; dữ liệu lấy cho từng dòng với `limit=5`.<br>- Đổi trang, bộ lọc hay sắp xếp thì đóng mọi dòng đang mở.<br>- Xem trước: từ 1240 px là panel dock 400 px không scrim; dưới 1240 px là panel phủ 460 px có scrim.<br>- Panel Xem trước hiện các trường trong `keyProps` của đối tượng và tóm tắt các card bên phải của trang chi tiết. |
| BR-11 | **Board**<br>- Cột là các lựa chọn của trường `board.field`, đúng thứ tự trong danh mục. Nội dung thẻ theo `board.card`.<br>- "Cột theo ▾" là chức năng Kanban có sẵn của ERP. Trường đang chọn là thay đổi chưa lưu của view; "Khôi phục view" đưa về `board.field`.<br>- Số thẻ mỗi cột và số bản ghi trống lấy từ API `group-summary` (theo CRM-04, phần API), tính trên toàn bộ bản ghi khớp bộ lọc, không đếm thẻ đã tải.<br>- Gọi lại `group-summary` mỗi khi đổi bộ lọc, từ khoá, "Cột theo", hoặc sau khi kéo thẻ.<br>- Bản ghi có trường làm cột rỗng không hiện trên board (giữ hành vi ERP).<br>- Mỗi cột tải 20 thẻ đầu, cuộn tới cuối thì tải thêm.<br>- Sự kiện timeline khi kéo thẻ do máy chủ ghi (F03-S3); FE không tự ghi. |
| BR-12 | **Mật độ và khôi phục view**<br>- Mật độ: Thoáng (dòng 44 px) hoặc Gọn (dòng 34 px). Là tuỳ chọn cá nhân, lưu theo người dùng cho từng đối tượng (F03-S4), không lưu vào view.<br>- Kiểu hiển thị Bảng/Board là thuộc tính của view; đổi trên view đang mở là một thay đổi chưa lưu như đổi bộ lọc.<br>- "Khôi phục view mặc định" với view hệ thống: đưa bộ lọc nhanh, cột, sắp xếp, mật độ về cấu hình của đối tượng. Với view người dùng: về trạng thái đã lưu.<br>- "Đổi tên view", "Xoá view" chỉ có với view người dùng tạo. |
| BR-13 | **Thao tác hàng loạt**<br>- Checkbox tiêu đề chỉ chọn các dòng của trang hiện tại.<br>- Chọn theo bộ lọc cần API thao tác hàng loạt theo bộ lọc của F03-S5.<br>- Popover Gán owner: nhân viên đang làm việc có `is_sales` (như ô chọn owner ở CRM-00), có ô tìm, thêm mục "Bỏ owner".<br>- Gán owner gọi `bulk/update`, xoá gọi `bulk/delete` của F03-S5.<br>- Tới 200 bản ghi chọn tay: chạy ngay. Từ 201 bản ghi chọn tay (tối đa 1.000), hoặc chọn theo bộ lọc: chạy nền theo F03-S5, có thanh tiến độ ở góc màn hình, xong có thông báo.<br>- Xoá là xoá mềm: bản ghi vào thùng rác, khôi phục được trong 30 ngày; liên kết bị gỡ theo và được khôi phục cùng bản ghi.<br>- Bản ghi người dùng không có quyền bị bỏ qua; kết quả ghi rõ số đã làm và số bỏ qua. |
| BR-14 | **Footer và phân trang**<br>- Trái sang phải: pill đếm, phân trang, Làm mới, Export, Khôi phục view, Nhân bản view.<br>- Pill đếm: "18 bản ghi". Khi view có thay đổi chưa lưu: "Hiển thị 5 / 18 bản ghi", trong đó 18 là số của view đã lưu.<br>- Phân trang: 25, 50 hoặc 100 dòng mỗi trang (mặc định 25), nút Trước, Sau, và "Trang 2 / 8". Không cuộn vô hạn.<br>- Làm mới: tải lại trang hiện tại, giữ mọi bộ lọc.<br>- Export: xuất file theo bộ lọc và cột đang hiện, chọn `.xlsx` hoặc `.csv` (chức năng ERP có sẵn). Cần quyền `record.export`.<br>- Nút chỉ có icon phải có tooltip và nhãn cho trình đọc màn hình. |
| BR-15 | **Bố cục trang chi tiết**<br>- Từ 1240 px: ba cột 320 px, giữa co giãn, 320 px.<br>- 905–1239 px: cột trái và giữa; cột phải xuống dưới, full width.<br>- Dưới 905 px: một cột theo thứ tự trái, giữa, phải.<br>- URL `/data/<slug>/records/<id>` (giữ đường dẫn hiện có của ERP).<br>- Tab mặc định khi mở trang: "Tổng quan" nếu đối tượng có (`overviewTab`), không thì "Hoạt động". Nội dung tab Tổng quan ở spec đối tượng; timeline và cửa sổ soạn ở CRM-05.<br>- Đổi tên bằng ✎: spec đối tượng quy định trường nào đổi được (ví dụ Contacts đổi họ và tên; Deals chỉ đổi Tên Deal, không đổi Mã Deal). |
| BR-16 | **Nút hành động nhanh**<br>- Sáu nút: Ghi chú, Email, Gọi, Task, Họp, Thêm; hành vi ở Phụ lục A.<br>- Gửi email nằm ngoài phạm vi (A-15); nút Email vẫn hiện để giữ bố cục HubSpot, ở trạng thái vô hiệu.<br>- Nút Gọi mở cửa sổ soạn Ghi lại cuộc gọi, không gọi điện thật (A-15). Nút Họp mở cửa sổ soạn Cuộc họp ở chế độ Lên lịch (A-10).<br>- "Sắp xếp nút…" mở hộp kéo thả thứ tự 5 nút đầu. Thứ tự lưu theo người dùng (F03-S4), áp cho cả ba đối tượng.<br>- Người dùng tạo được hoạt động (`record.write` trên `crm_activities`) và đọc được bản ghi là dùng được nút, kể cả khi chỉ có quyền xem bản ghi (theo F03-S1, quy tắc kế thừa quyền qua liên kết). |
| BR-17 | **Menu Thao tác**<br>- Mục theo `actions` của đối tượng, thứ tự cố định. Mục không có quyền thì ẩn, không để vô hiệu.<br>- Theo dõi: người theo dõi là tài khoản, nhận thông báo trong ERP khi bản ghi đổi owner, có hoạt động mới do người khác tạo, hoặc (Deal) đổi giai đoạn. Người làm thao tác không nhận thông báo cho thao tác của chính mình.<br>- Khi owner được đặt và nhân viên đó có `tai_khoan`, tài khoản đó tự được thêm vào người theo dõi. Nhân viên chưa có tài khoản thì không ai được thêm tự động.<br>- Xem tất cả thuộc tính: các trường chia nhóm "Thông tin chính", "Trường khác", "Trường bổ sung".<br>- Tìm trên Google: Contact tìm tên và tên công ty Primary; Company tìm tên và domain.<br>- Nhân bản Contact, Company: sao mọi trường nhập tay, trừ trường Duy nhất (email, domain) và trường tính. Company: `name` thêm hậu tố " (bản sao)". Contact: `first_name` thêm hậu tố " (bản sao)"; nếu `first_name` trống thì ghi "Bản sao", để bản sao luôn thoả ràng buộc tên của Contact ở CRM-00. Contact giữ liên kết công ty Primary.<br>- Nhân bản Deal: mở panel Tạo Deal điền sẵn dữ liệu, Mã Deal để trống.<br>- Gộp: chọn bản ghi cùng loại, chọn bản ghi giữ lại và giá trị từng trường.<br>- Lịch sử thuộc tính, lịch sử liên kết, theo dõi phụ thuộc F03-S3; gộp phụ thuộc F03-S5. |
| BR-18 | **Card thuộc tính chính**<br>- Tiêu đề theo `keyProps.title`; thân là các trường trong `keyProps.fields`.<br>- Card này không có ⚙. Chọn thêm trường hiển thị làm ở card Trường bổ sung (CRM-09, TB-05).<br>- Mục "Tuỳ chỉnh thuộc tính" mở ⚙ của card Trường bổ sung (theo sheet CO-07, áp cho cả ba đối tượng). |
| BR-19 | **Card liên kết**<br>- Mỗi mục trong `rightCards` là một card; dữ liệu qua F03-S1.<br>- Tối đa 5 thẻ, Primary trước. Dòng phụ trên thẻ do spec đối tượng quy định. Thuộc tính hiển thị chọn bằng ⚙ lưu theo người dùng (F03-S4).<br>- Mục ⋯ chỉ hiện khi kênh hỗ trợ: "Đặt làm Primary" (kênh có Primary, dòng chưa Primary), "Bỏ Primary" (dòng đang Primary), "Sửa nhãn liên kết" (kênh có nhãn), "Gỡ liên kết" (mọi kênh, trừ trường Bắt buộc).<br>- Tab "Thêm có sẵn" tìm theo `searchFields` của đối tượng đích.<br>- Spec đối tượng có thể điền sẵn thêm khi tạo mới từ card (ví dụ Deal tạo từ Company có tên "<Tên công ty> - Deal mới", theo CRM-04).<br>- Khi thêm sẽ ghi đè một liên kết đang có (API trả `ASSOCIATION_REPLACES`), giao diện hỏi trước. Một bản ghi: "DEAL-007 đang thuộc Logistics Tân Cảng Xanh. Chuyển sang Dược phẩm Thiên Phúc?". Nhiều bản ghi: một hộp liệt kê mọi bản ghi sẽ bị chuyển ("3 deal đang thuộc công ty khác sẽ được chuyển sang Dược phẩm Thiên Phúc") với nút "Chuyển tất cả", "Chỉ thêm deal chưa có công ty", "Huỷ". |
| BR-20 | **Panel tạo bản ghi**<br>- Dùng chung cho nút "Thêm …" ở header, "Tạo mới" ở card liên kết và ở mở rộng dòng.<br>- Trường theo `createFields`; kênh liên kết theo `createAssociations` (C-13 ở CRM-02 và tương tự ở các spec đối tượng).<br>- Nút ở footer, canh trái: "Tạo", "Tạo và thêm tiếp", "Huỷ".<br>- Ctrl/⌘+Enter bằng "Tạo". Enter trong ô nhập không gửi form.<br>- Lỗi `409 CONFLICT` cần trả thêm `details.existingRecordId` khi người gọi đọc được bản ghi trùng (câu hỏi Q6). |
| BR-21 | **Quyền**<br>- Mở danh sách: `record.read` trên collection. Không đủ: trang thông báo.<br>- Tạo: `record.write` trên collection. Không đủ: nút "Thêm …" ẩn.<br>- Sửa ô, sửa thuộc tính, kéo thẻ board: ghi được bản ghi (quyền collection hoặc là chủ sở hữu hệ thống). Không đủ: ô không vào chế độ sửa, thẻ không kéo được.<br>- Xoá, xoá hàng loạt: `record.delete`. Không đủ: mục ẩn.<br>- Export: `record.export`. Không đủ: nút ẩn.<br>- Import: `record.bulk_import`. Không đủ: mục ẩn.<br>- Lưu, đổi tên, xoá view dùng chung: người tạo view hoặc `collection.manage_views`. Không đủ: mục ẩn.<br>- Thêm, gỡ liên kết: theo F03-S1, phần quyền liên kết. Không đủ: nút "+ Thêm" và mục ⋯ ẩn. |
| BR-22 | **Hiệu năng và hành vi mạng**<br>- Danh sách 25 dòng kèm cột "Công ty chính": 2 request (danh sách, và một request lấy liên kết cho 25 id). Không gọi từng dòng.<br>- Khi view có thay đổi chưa lưu: thêm 1 request đếm số của view đã lưu; kết quả đếm lưu đệm 60 giây.<br>- Trang chi tiết: request bản ghi và request danh sách kênh liên kết chạy song song; mỗi card gọi dữ liệu riêng khi hiện vào màn hình.<br>- Sửa tại chỗ gửi `PATCH` kèm `If-Match`. Nhận `412` thì hiện "Bản ghi vừa được người khác sửa. Tải lại để xem giá trị mới" kèm nút Tải lại; không ghi đè.<br>- Mất mạng khi đang sửa: giữ giá trị người dùng vừa nhập trong ô, hiện lỗi, cho thử lại. |

# ACCEPTANCE CRITERIA

AC-1: Tìm kiếm (C-03)

- Danh sách Contacts có "Nguyễn Thị Hạnh" (email hanh@thienphuc.vn). Bấm `/` rồi gõ "thienphuc" → sau khi ngừng gõ, danh sách chỉ còn contact có "thienphuc" trong tên, email hoặc SĐT; URL có tham số tìm kiếm.
- Gõ `/` khi đang ở ô nhập khác → không nhảy sang ô tìm.
- Gõ nhanh 6 ký tự → chỉ 1 request sau 300 ms.

AC-2: Sắp xếp (C-03)

- Danh sách đang sắp mặc định Ngày tạo giảm dần. Bấm tiêu đề cột "Lead status" ba lần → lần 1 tăng, lần 2 giảm, lần 3 về mặc định.
- Bấm "Sắp xếp", chọn "Ngày hoạt động gần nhất", chiều giảm dần → danh sách sắp theo trường đó, mũi tên hiện ở tiêu đề cột tương ứng, URL có tham số sắp xếp.

AC-3: Ẩn, hiện thanh bộ lọc (C-03)

- Bấm nút "Bộ lọc" trên thanh công cụ → thanh bộ lọc nhanh ẩn.
- Tải lại trang → thanh vẫn ẩn.
- Bấm ⌃ → thanh hiện lại.

AC-4: Lọc owner (C-04)

- Mở "Contact owner ▾", tick Minh Trần và Lan Lê → chỉ còn contact của hai người; nút hiện "Owner: Minh Trần, Lan Lê".
- Có 3 contact chưa có owner. Chọn "(Chưa có owner)" → danh sách có đúng 3 contact đó.
- Bộ lọc có 12 nhân viên, gõ "lan" vào ô tìm của popover → chỉ còn nhân viên có "lan" trong tên; nhân viên đã tick trước đó vẫn giữ tick.
- Tick 2 owner và chọn Lead status "Mới" → bộ lọc gửi đi: owner IN (2 id) VÀ lead_status = Mới.

AC-5: Mốc ngày (C-04)

- Hôm nay 30/09/2026, chọn "Ngày tạo ▾ → 7 ngày qua" → danh sách gồm contact tạo từ 00:00 ngày 24/09 đến 23:59 ngày 30/09 giờ Việt Nam; dòng phụ trong popover ghi "24/09 – 30/09".
- View đã lưu với "Ngày tạo: 30 ngày qua", mở vào ngày khác → khoảng ngày tính lại từ ngày mở.
- "Tuần này" khi hôm nay là Chủ nhật 04/10/2026 → 28/09 00:00 đến 04/10 23:59.
- "Tháng trước" ngày 31/03 → 01/02 đến 28/02 (hoặc 29/02 năm nhuận). "Quý này" ngày 30/09 → 01/07 đến 30/09.

AC-6: Mốc ngày tương lai (C-04)

- Deals có `futureDateFields` gồm Ngày dự kiến chốt, hôm nay 30/09/2026. Chọn "Tuần sau" ở bộ lọc "Ngày dự kiến chốt" → chỉ còn deal có ngày dự kiến chốt từ 05/10 đến 11/10/2026.
- Popover bộ lọc "Ngày tạo" không có mốc "Tuần sau".
- "Tuần sau" khi hôm nay là Chủ nhật 04/10/2026 → 05/10 00:00 đến 11/10 23:59.
- "30 ngày tới" ngày 30/09/2026 → 30/09 00:00 đến 29/10 23:59.

AC-7: Thêm và sửa hàng bộ lọc nhanh (C-04)

- Bấm ⊕, chọn "Thành phố" → nút "Thành phố ▾" xuất hiện cuối hàng; "Khôi phục view" gỡ nút đó.
- Bấm ✎, kéo "Lead status" lên đầu, bấm ✕ trên "Ngày tạo", thoát chế độ sửa → hàng còn 3 nút theo thứ tự mới; "Khôi phục view" đưa về 4 nút như ban đầu.
- Dùng bàn phím mở bộ lọc nhanh, chọn giá trị, đóng popover → làm được hết bằng Tab, Enter, Space, Esc.

AC-8: Bộ lọc nâng cao (C-05)

- Thêm hai điều kiện "Thành phố Bằng Hà Nội" và "Lifecycle stage Bằng Customer", bấm Áp dụng → chỉ còn contact thoả cả hai; nút hiện "Bộ lọc nâng cao (2)".
- Panel đang mở, đã thêm một điều kiện, đóng bằng ✕ → danh sách không đổi.
- Thêm cùng một trường ở bộ lọc nhanh và nâng cao → hai điều kiện nối VÀ, panel có ghi chú.

AC-9: Mở rộng dòng (C-07)

- Company "Logistics Tân Cảng Xanh" có 2 contact. Bấm › và chọn "Contacts" → dưới dòng hiện bảng con 2 contact kèm nhãn liên kết (nếu có) và nút "+ Thêm".
- Mở rộng 3 dòng cùng lúc → cả 3 hiện bảng con.
- Một dòng đang mở rộng, chuyển sang trang 2 → không còn dòng nào mở rộng.

AC-10: Xem trước (C-08)

- Màn 1440 px, bấm "Xem trước" trên một dòng → panel 400 px dock bên phải, bảng co lại, không có scrim.
- Sửa Lead status trong panel → dòng trên bảng đổi theo.
- Panel đang mở cho contact A, bấm "Xem trước" trên contact B → panel hiện B mà không đóng.

AC-11: Mật độ và khôi phục view (C-10)

- Chọn mật độ Gọn trên Contacts, mở Contacts từ máy khác cùng tài khoản → vẫn là Gọn; người dùng khác vẫn thấy Thoáng.
- Đã thêm 2 cột và 1 bộ lọc nhanh trên view "Tất cả contacts", chọn ⚙ → Khôi phục view mặc định → cột và bộ lọc về cấu hình gốc của Contacts.

AC-12: Chỉnh sửa cột (C-10)

- Chọn ⚙ → Chỉnh sửa cột…, bỏ cột "Số điện thoại", kéo "Lead status" lên đầu, Áp dụng → bảng không còn cột Số điện thoại, Lead status đứng ngay sau cột tên.
- Đối tượng có `columnOrder: field`, mở hộp "Chỉnh sửa cột" → cột bên phải không kéo được, có dòng "Thứ tự cột theo thứ tự trường".
- Đổi thứ tự trường trong Quản lý trường → thứ tự cột trên bảng đổi theo.
- Sửa email trùng ngay tại ô → ô trở về giá trị cũ, hiện lỗi từ API.

AC-13: Bảng, Board và "Cột theo" (C-10)

- Đang ở "Tất cả contacts" dạng bảng, chọn ⚙ → Kiểu hiển thị: Board → hiện board theo Lifecycle stage với cùng bộ lọc; tab view hiện dấu "đã thay đổi".
- Chọn "Cột theo ▾" → Lead status → board vẽ lại theo các lựa chọn của Lead status, số thẻ mỗi cột đúng với tổng bản ghi khớp bộ lọc; tab hiện dấu "đã thay đổi"; "Khôi phục view" về lại Lifecycle stage.
- Đổi "Cột theo" rồi bấm Back → về trường cột trước.
- Một cột có 60 thẻ, mới tải 20 → đầu cột ghi 60, không ghi 20.
- Board có 12 bản ghi rỗng trường cột → hiện dòng "12 bản ghi … không hiển thị" và link.
- Kéo thẻ khi API trả lỗi → thẻ về cột cũ, hiện lỗi.

AC-14: Gán owner hàng loạt (C-11)

- Chọn 24 contact, Gán owner → Lan Lê → xác nhận → 24 contact có owner Lan Lê; mỗi contact có một sự kiện "Đổi owner" trên timeline.
- Trong 24 contact có 4 contact người dùng không có quyền sửa → kết quả ghi "Đã gán 20. Bỏ qua 4 bản ghi bạn không có quyền sửa."
- Chọn tất cả 1.500 bản ghi khớp bộ lọc rồi gán owner → chạy nền, có tiến độ, xong có thông báo.

AC-15: Chọn và xoá hàng loạt (C-11)

- Bộ lọc khớp 312 contact, trang 25 dòng. Tick checkbox tiêu đề rồi bấm "Chọn tất cả 312 bản ghi khớp bộ lọc" → thanh hàng loạt ghi "Đã chọn 312".
- Chọn cả trang rồi đổi bộ lọc → bỏ chọn hết.
- Chọn 3 contact, Xoá → xác nhận → 3 contact biến khỏi danh sách và có trong thùng rác; hộp xác nhận có câu "có thể khôi phục trong 30 ngày".
- Người không có `record.delete` → không thấy Xoá ở thanh hàng loạt và menu Thao tác.

AC-16: Footer và view (C-12)

- Bộ lọc khớp 5 trên 18 contact → footer có "Hiển thị 5 / 18 bản ghi", nút làm mới, Export, khôi phục view, nhân bản view.
- Đang ở "Tất cả contacts" có thêm một bộ lọc chưa lưu, bấm "Nhân bản view", đặt tên "Contacts Hà Nội" → có tab mới "Contacts Hà Nội" (riêng tư) mang bộ lọc đó; "Tất cả contacts" không đổi.
- Người không có `record.export` → footer không có Export.
- View "Contacts của tôi" với tài khoản chưa gắn nhân viên → hiện câu giải thích, không hiện bảng rỗng.

AC-17: Nút hành động nhanh (C-15)

- Ở trang chi tiết một contact, bấm lần lượt Ghi chú, Gọi, Task, Họp → mở lần lượt cửa sổ soạn Ghi chú, Ghi lại cuộc gọi, Task, Cuộc họp chế độ Lên lịch.
- Rê chuột vào nút Email → nút vô hiệu, tooltip "Gửi email chưa có trong giai đoạn này".
- Đổi thứ tự nút thành Gọi, Ghi chú, Task, Họp, Email rồi mở trang chi tiết Company → thứ tự nút là thứ tự vừa đặt.
- Bấm "Thêm" và gõ "họp" → chỉ còn mục "Ghi lại cuộc họp"; bấm vào thì mở cửa sổ soạn cuộc họp đã diễn ra.
- Các mục Ghi lại email, SMS, WhatsApp, LinkedIn (khi không lọc) có nhãn "Ngoài phạm vi" và bấm không mở gì.

AC-18: Nhân bản, Gộp, Tìm trên Google, Xoá (C-17)

- Contact có email hanh@thienphuc.vn, công ty Primary Thiên Phúc. Thao tác → Nhân bản → mở bản sao có tên thêm " (bản sao)", email trống, vẫn liên kết Thiên Phúc là Primary.
- F03-S5 chưa triển khai → mục "Gộp" có nhãn "Sắp có" và bấm không làm gì.
- Contact Nguyễn Thị Hạnh, công ty Primary Dược phẩm Thiên Phúc. Thao tác → Tìm trên Google → mở tab mới tìm "Nguyễn Thị Hạnh Dược phẩm Thiên Phúc".
- Người có quyền xoá chọn Thao tác → Xoá → xác nhận → quay về danh sách Contacts; contact đó không còn trong danh sách và có trong thùng rác.

AC-19: Theo dõi và lịch sử (C-17)

- X theo dõi Deal DEAL-013, owner là Y. Y đổi giai đoạn Deal → X nhận một thông báo trong ERP; Y không nhận thông báo cho thao tác của chính mình.
- Contact có 14 trường gốc và 2 trường bổ sung. Thao tác → Xem tất cả thuộc tính, gõ "thành" → panel liệt kê các trường có "thành" trong tên (ví dụ Thành phố); sửa Thành phố trong panel thì card Thông tin chính đổi theo.
- F03-S3 đã triển khai; Lead status từng đổi Mới → Đang xử lý → Có deal. Xem lịch sử thuộc tính → chọn Lead status → thấy 3 dòng theo thời gian giảm dần, mỗi dòng có giá trị cũ, giá trị mới, người đổi, thời điểm.
- Contact từng được gắn rồi gỡ khỏi DEAL-007. Xem lịch sử liên kết → thấy hai dòng "Đã liên kết với DEAL-007" và "Đã gỡ liên kết với DEAL-007" kèm người và thời điểm.

AC-20: Tệp đính kèm (C-22)

- Ở trang chi tiết Deal, tải lên "bao_gia_v2.pdf" → card hiện tệp với tên, dung lượng, người tải, ngày.
- Gỡ tệp đó → card rỗng và hiện "Chưa có tệp nào".

AC-21: Trạng thái trên URL và thông báo gộp

- Danh sách có từ khoá, 2 bộ lọc nhanh, sắp xếp theo Ngày hoạt động gần nhất, trang 3. Sao chép URL và mở ở tab mới → thấy đúng cùng trạng thái đó.
- Bấm Back sau khi đổi bộ lọc → về trạng thái bộ lọc trước.
- Minh vừa gán owner Lan Lê cho 24 contact trong một lần. Lan bấm thông báo "Minh Trần đã giao 24 contact cho bạn" → danh sách Contacts mở với đúng 24 contact đó và nút "Thao tác hàng loạt lúc …"; bấm ✕ trên nút thì về danh sách đầy đủ.
- Mở `?batch=<id>` rồi bấm Nhân bản view → view mới không chứa điều kiện batch.

AC-22: Xung đột khi sửa

- A và B cùng mở một contact. B đổi Lead status, sau đó A đổi Lead status → A nhận thông báo "Bản ghi vừa được người khác sửa…"; giá trị của B không bị ghi đè.

AC-23: Card liên kết

- DEAL-007 thuộc Logistics Tân Cảng Xanh. Từ card Deals của Thiên Phúc chọn "Thêm có sẵn" → DEAL-007 → Lưu → hiện câu hỏi chuyển công ty; chọn "Chuyển" thì DEAL-007 thuộc Thiên Phúc và biến khỏi card Deals của Tân Cảng Xanh.
- Tạo contact từ card Contacts của Company → contact mới có liên kết tới Company đó ngay khi tạo.
- Người dùng không đọc được đối tượng đích → card không hiện.

AC-24: Panel tạo

- Nhấn Enter trong ô Email → không gửi form.
- Nhấn Ctrl+Enter khi đủ trường bắt buộc → tạo thành công.
- Đóng panel khi đã nhập → hỏi "Bỏ nội dung đang nhập?".

AC-25: Màn hẹp và số request

- Trang chi tiết ở 390 px → một cột, thứ tự trái, giữa, phải; không cuộn ngang trang.
- Danh sách 25 dòng có cột Công ty chính, không có thay đổi chưa lưu → tổng 2 request dữ liệu.

# PHỤ LỤC

## A. Màn hình và dữ liệu hiển thị

**Tính năng sở hữu**

Sheet ghi các tính năng này dưới phân hệ Contacts vì Contacts là màn làm đầu tiên, nhưng cả ba đối tượng đều dùng.

| ID | Tính năng | Ưu tiên | Use case |
|---|---|---|---|
| C-03 | Tìm kiếm, bộ lọc, sắp xếp | P0 | UC-2 |
| C-04 | Bộ lọc nhanh dạng popover | P0 | UC-3 |
| C-05 | Bộ lọc nâng cao | P1 | UC-4 |
| C-07 | Mở rộng dòng | P1 | UC-7 |
| C-08 | Xem trước | P1 | UC-8 |
| C-10 | Cài đặt view | P1 | UC-5, UC-6 |
| C-11 | Thao tác hàng loạt | P1 | UC-10 |
| C-12 | Footer danh sách | P2 | UC-1 |
| C-15 | Nút hành động nhanh | P0 | UC-11 |
| C-17 | Menu Thao tác | P1 | UC-12 |
| C-22 | Card Tệp đính kèm | P2 | UC-15 |

Ngoài phạm vi file này: nội dung cột, bộ lọc mặc định, board, panel tạo, thẻ định danh và card riêng của từng đối tượng (CRM-02, CRM-03, CRM-04); cửa sổ soạn hoạt động và timeline (CRM-05); card Trường bổ sung (CRM-09); tuỳ biến bố cục trang chi tiết kiểu nút "Customize" của HubSpot (không có trong sheet, không làm).

**Từ ngữ**

| Từ | Nghĩa |
|---|---|
| Panel phải | Khung trượt từ mép phải, rộng 460 px |
| Scrim | Lớp nền tối mờ phủ phía sau panel hoặc hộp thoại; bấm vào scrim thì đóng |
| Dock | Panel nằm cố định trong vùng nội dung, bảng co lại nhường chỗ, không có scrim |
| Nút split | Nút chia hai phần: bấm chữ làm hành động chính, bấm ▾ mở menu lựa chọn khác |
| Segmented | Nhóm nút liền nhau, chọn một (ví dụ Bảng / Board) |
| Toast | Thông báo ngắn góc màn hình, tự ẩn sau vài giây |
| Pill | Nhãn màu bo góc hiển thị giá trị lựa chọn |

**Bố cục trang danh sách** (template T1 của DESIGN-SYSTEM-HUBSPOT), từ trên xuống:

1. Header đối tượng (`ObjectHeader`)
2. Hàng tab view
3. Thanh công cụ
4. Thanh bộ lọc nhanh (thu gọn được)
5. Thanh hàng loạt (chỉ hiện khi có dòng được chọn)
6. Bảng hoặc board; panel Xem trước dock bên phải khi mở
7. Footer

**Chức năng ERP hiện có phải giữ**

Giai đoạn 1 đã chốt "chức năng = 100% ERP". Giai đoạn 2 đổi sang UX HubSpot nhưng không bỏ chức năng nào ERP đang có trên màn danh sách (theo `DOI-CHIEU-CHUC-NANG.md`, phần chức năng ERP hiện có).

| Chức năng ERP hiện có | Vị trí trong khung mới |
|---|---|
| View đã lưu (tạo, sửa, xoá; loại Danh sách/Kanban) | Hàng tab view, menu ⚙ |
| Tìm kiếm | Ô tìm kiếm |
| Bộ lọc điều kiện theo kiểu trường | Bộ lọc nâng cao |
| Sắp xếp theo cột (tăng → giảm → bỏ) | Tiêu đề cột và nút Sắp xếp |
| Ẩn/hiện cột, kéo đổi bề rộng cột | Nút "+" và hộp "Chỉnh sửa cột" |
| Sửa ô tại chỗ | Giữ nguyên |
| Mật độ Thoáng / Gọn | Menu ⚙ |
| Chọn nhiều → Xoá | Thanh hàng loạt |
| Import, Export, Kết nối Google Sheet | Menu ⋮ ở header (cả ba); Import còn ở nút "Thêm … ▾"; Export còn ở footer |
| Làm mới, phân trang, đếm bản ghi | Footer |
| Ghim vào sidebar | Menu ⋮ ở header |
| Mở drawer chi tiết | Xem trước |
| Kanban chọn trường làm cột, kéo thả đổi giá trị | Board |

**Trạng thái màn danh sách**

| Trạng thái | Hiển thị |
|---|---|
| Đang tải lần đầu | Skeleton 8 dòng giữ đúng cột |
| Đang tải lại (đổi bộ lọc, đổi trang) | Giữ dữ liệu cũ mờ đi, thanh tiến độ mảnh trên đầu bảng |
| Collection chưa có bản ghi | "Chưa có contact nào", nút "Thêm contact", link "Import từ file" |
| Có bộ lọc nhưng không khớp | "Không có contact nào khớp bộ lọc" và nút "Xoá tất cả bộ lọc" |
| View "của tôi" với tài khoản chưa gắn nhân viên | "Tài khoản của bạn chưa được gắn với nhân viên nào nên chưa có bản ghi 'của tôi'. Liên hệ quản trị viên để gắn." |
| Lỗi tải | Giữ header bảng, hiện Alert "Không tải được danh sách. Thử lại" kèm nút Thử lại |
| Không có quyền đọc collection | Trang thông báo "Bạn chưa có quyền xem Contacts" |

**Popover bộ lọc nhanh theo kiểu trường**

| Kiểu trường | Nội dung popover | Giá trị lọc |
|---|---|---|
| Liên kết tới NhanVien (owner) | Ô tìm và danh sách nhân viên thuộc đội kinh doanh (`is_sales`) có checkbox. Mục đầu "(Chưa có owner)". Ba nhóm theo thứ tự: Đang làm việc, Tạm nghỉ, Đã nghỉ; hai nhóm sau có nhãn trạng thái | Nhiều giá trị, nối HOẶC |
| Lựa chọn đơn | Ô tìm (khi hơn 7 lựa chọn) và checkbox các lựa chọn dạng pill. Mục cuối "(Trống)" | Nhiều giá trị, nối HOẶC |
| Ngày, Ngày giờ | Danh sách mốc thời gian (bảng dưới) và "Tuỳ chọn…" mở hai ô Từ – Đến | Một khoảng |
| Văn bản | Ô nhập và chọn "Chứa" / "Bằng" | Một điều kiện |
| Số | Chọn "Bằng" / "Lớn hơn" / "Nhỏ hơn" và ô nhập | Một điều kiện |

Hộp kiểm, Người dùng, Tiền tệ, Văn bản dài, Đường dẫn (thường gặp ở trường tuỳ chỉnh): theo CRM-09, phần bộ lọc cho trường tuỳ chỉnh.

Nút trong popover: "Xoá" (bỏ bộ lọc này) và "Áp dụng". Với kiểu checkbox, tick là áp dụng ngay; "Áp dụng" chỉ cần cho khoảng ngày tuỳ chọn và kiểu văn bản, số.

**Mốc thời gian**

Cột "Đến" ghi 23:59 cho dễ đọc; khi gửi API, điều kiện là trước 00:00 của ngày kế tiếp (BR-07).

| Mã | Mốc | Từ | Đến |
|---|---|---|---|
| `today` | Hôm nay | 00:00 hôm nay | 23:59 hôm nay |
| `yesterday` | Hôm qua | 00:00 hôm qua | 23:59 hôm qua |
| `week` | Tuần này | 00:00 thứ Hai tuần này | 23:59 Chủ nhật tuần này |
| `lastweek` | Tuần trước | 00:00 thứ Hai tuần trước | 23:59 Chủ nhật tuần trước |
| `month` | Tháng này | 00:00 ngày 1 tháng này | 23:59 ngày cuối tháng này |
| `lastmonth` | Tháng trước | 00:00 ngày 1 tháng trước | 23:59 ngày cuối tháng trước |
| `d7` | 7 ngày qua | 00:00 của 6 ngày trước | 23:59 hôm nay |
| `d30` | 30 ngày qua | 00:00 của 29 ngày trước | 23:59 hôm nay |
| `d90` | 90 ngày qua | 00:00 của 89 ngày trước | 23:59 hôm nay |
| `quarter` | Quý này | 00:00 ngày đầu quý | 23:59 ngày cuối quý |
| `year` | Năm nay | 00:00 ngày 1/1 | 23:59 ngày 31/12 |
| `custom` | Tuỳ chọn | ngày người dùng chọn | ngày người dùng chọn |

Bốn mốc thêm cho trường nằm trong `futureDateFields`, đặt trước "Tuỳ chọn":

| Mã | Mốc | Từ | Đến |
|---|---|---|---|
| `tomorrow` | Ngày mai | 00:00 ngày mai | 23:59 ngày mai |
| `nextweek` | Tuần sau | 00:00 thứ Hai tuần sau | 23:59 Chủ nhật tuần sau |
| `nextmonth` | Tháng sau | 00:00 ngày 1 tháng sau | 23:59 ngày cuối tháng sau |
| `n30` | 30 ngày tới | 00:00 hôm nay | 23:59 của 29 ngày sau |

**Điều kiện của bộ lọc nâng cao theo kiểu trường**

| Kiểu | Điều kiện |
|---|---|
| Văn bản, Văn bản dài | Chứa · Bằng · Khác · Trống · Không trống |
| Số, Tiền tệ | Bằng · Lớn hơn · Nhỏ hơn · Trống · Không trống |
| Lựa chọn đơn, Liên kết, Người dùng | Bằng · Khác · Trống · Không trống |
| Ngày, Ngày giờ | Trong khoảng (dùng cùng danh sách mốc của bộ lọc nhanh) · Trống · Không trống |
| Hộp kiểm | Có · Không |

**Menu ⚙ (cài đặt view)**

| Mục | Ghi chú |
|---|---|
| Kiểu hiển thị: Bảng / Board | Thuộc tính của view |
| Mật độ: Thoáng (dòng 44 px) / Gọn (dòng 34 px) | Tuỳ chọn cá nhân, lưu theo người dùng cho từng đối tượng |
| Chỉnh sửa cột… | Mở hộp "Chỉnh sửa cột" (modal lớn) |
| Lưu view | Chỉ hiện với người được sửa view này, khi view có thay đổi |
| Đổi tên view · Xoá view | Chỉ view người dùng tạo; xoá qua hộp xác nhận |
| Khôi phục view mặc định | Theo BR-12 |

**Bố cục trang chi tiết** (template T2 của DESIGN-SYSTEM-HUBSPOT)

| Cột | Nội dung |
|---|---|
| Trái | Card định danh · Card thuộc tính chính · Card Trường bổ sung (CRM-09) |
| Giữa | Tab Tổng quan (nếu `overviewTab`) · Tab Hoạt động (CRM-05) |
| Phải | Card liên kết theo `rightCards` · Card Tệp đính kèm |

**Sáu nút nhanh ở card định danh**

| Nút | Hành vi |
|---|---|
| Ghi chú | Mở cửa sổ soạn Ghi chú (CRM-05) |
| Email | Gửi email nằm ngoài phạm vi (A-15). Nút vẫn hiện để giữ bố cục HubSpot, ở trạng thái vô hiệu, tooltip "Gửi email chưa có trong giai đoạn này" |
| Gọi | Mở cửa sổ soạn Ghi lại cuộc gọi. Không gọi điện thật (A-15) |
| Task | Mở cửa sổ soạn Task |
| Họp | Mở cửa sổ soạn Cuộc họp ở chế độ Lên lịch (A-10) |
| Thêm | Mở menu có ô tìm (bảng dưới) |

**Menu "Thêm"**

| Mục | Trạng thái |
|---|---|
| Ghi lại cuộc gọi | Hoạt động |
| Ghi lại cuộc họp | Hoạt động (cuộc họp đã diễn ra) |
| Ghi lại email · Ghi lại SMS · Ghi lại WhatsApp · Ghi lại tin nhắn LinkedIn | Hiện với nhãn "Ngoài phạm vi", bấm không làm gì |
| Sắp xếp nút… | Mở hộp kéo thả thứ tự 5 nút đầu. Thứ tự lưu theo người dùng (F03-S4), áp cho cả ba đối tượng |

**Menu "Thao tác ▾" của trang chi tiết**

| Mục | Hành vi | Phụ thuộc |
|---|---|---|
| Theo dõi / Bỏ theo dõi | Theo BR-17 | F03-S3 (danh sách người theo dõi và phát thông báo) |
| Xem tất cả thuộc tính | Panel phải 640 px: mọi trường của bản ghi, nhóm "Thông tin chính" / "Trường khác" / "Trường bổ sung", có ô tìm, sửa tại chỗ | Không |
| Xem lịch sử thuộc tính | Panel: chọn một trường → danh sách giá trị cũ, giá trị mới, ai đổi, lúc nào | F03-S3. Khi F03-S3 chưa xong, mục hiện nhãn "Sắp có" và không bấm được |
| Xem lịch sử liên kết | Panel: danh sách thêm, gỡ liên kết của bản ghi, lọc theo đối tượng | F03-S3 |
| Tìm trên Google | Mở tab mới tìm theo tên bản ghi (Contact: tên và tên công ty Primary; Company: tên và domain). Không có với Deal | Không |
| (vạch ngăn) | | |
| Nhân bản | Theo BR-17. Xong mở bản sao | Không |
| Gộp | Mở hộp thoại gộp hai bước của F03-S5: chọn bản ghi cùng loại, chọn bản ghi giữ lại và giá trị từng trường | F03-S5. Khi chưa xong, nhãn "Sắp có" |
| Xoá | Hộp xác nhận nút đỏ như xoá hàng loạt, xong quay về danh sách | Không |

Deal có thêm hai mục của ERP hiện có, đặt trên cùng: "Kích hoạt Workflow" và "Quản lý trường dữ liệu" (D-14, CRM-04).

**Menu "Thao tác" của card thuộc tính chính**

- Tuỳ chỉnh thuộc tính (mở ⚙ của card Trường bổ sung, CRM-09; theo sheet CO-07, áp cho cả ba đối tượng)
- Xem tất cả thuộc tính
- Xem lịch sử thuộc tính
- "Làm giàu dữ liệu", "Điền thuộc tính thông minh" (hai mục của HubSpot): hiện với biểu tượng khoá và nhãn "Ngoài phạm vi"

**Menu ⋯ của thẻ trong card liên kết** (mục chỉ hiện khi kênh hỗ trợ)

| Mục | Kênh | API F03-S1 |
|---|---|---|
| Đặt làm Primary | Có Primary, dòng chưa Primary | Sửa liên kết, `isPrimary: true` |
| Bỏ Primary | Có Primary, dòng đang Primary | Sửa liên kết, `isPrimary: false` |
| Sửa nhãn liên kết | Có nhãn | Sửa liên kết, `label` |
| Gỡ liên kết | Mọi kênh (trừ trường Bắt buộc) | Gỡ liên kết |

**Card Tệp đính kèm**

- Mỗi tệp: icon theo loại · tên (bấm để xem trước hoặc tải) · dung lượng · người tải lên · ngày.
- Menu ⋯ mỗi tệp: Tải xuống · Gỡ khỏi bản ghi.
- Rỗng: "Chưa có tệp nào" và nút "Tải lên".

## B. Dữ liệu

**Cấu hình đối tượng**

Mỗi đối tượng CRM khai báo một cấu hình theo mẫu dưới. Khung đọc cấu hình này để dựng màn. Viết dạng TypeScript để rõ kiểu; tên thuộc tính là đề xuất cho FE, có thể đổi khi code nhưng phải giữ đủ ý.

```ts
interface CrmObjectConfig {
  collection: string;                 // slug, ví dụ 'crm_contacts'
  label: { one: string; many: string };      // 'Contact' / 'Contacts'
  icon: string;                       // Material Symbols, ví dụ 'person'
  displayField: string;               // key dùng làm tên bản ghi, ví dụ 'full_name'
  avatar: 'initials' | 'logo' | 'icon';

  views: SystemView[];                // view hệ thống (BR-04)
  searchFields: string[];             // trường ô tìm kiếm quét (BR-05)
  quickFilters: string[];             // bộ lọc nhanh mặc định, theo thứ tự
  quickFiltersMore: string[];         // thêm được bằng ⊕
  futureDateFields?: string[];        // trường ngày có thêm mốc tương lai (BR-07)
  columns: string[];                  // cột mặc định sau cột chính
  columnsMore: string[];              // thêm được bằng "+"
  columnOrder: 'view' | 'field';      // ai quyết định thứ tự cột (BR-09)
  defaultSort: { field: string; dir: 'asc' | 'desc' };
  expand: { associationId: string; label: string }[];   // mở rộng dòng (UC-7)
  board?: { field: string; card: string[] };            // trường làm cột và nội dung thẻ (UC-9)
  defaultMode: 'table' | 'board';

  createFields: string[];             // trường trong panel tạo (UC-16)
  createAssociations: string[];       // associationId hiện ở mục "Liên kết với"
  identity: { subtitle: string[] };   // dòng phụ dưới tên (UC-11)
  keyProps: { title: string; fields: string[] };        // card thuộc tính chính (UC-13)
  rightCards: string[];               // associationId theo thứ tự card bên phải (UC-14)
  overviewTab: boolean;               // có tab Tổng quan (Catch-up) hay không
  actions: ActionKey[];               // mục trong menu Thao tác (UC-12)
  attachmentField?: string;           // key trường Tệp đính kèm (UC-15)
}
```

Giá trị cụ thể cho từng đối tượng nằm ở CRM-02, CRM-03, CRM-04, phần cấu hình đối tượng.

**Thứ gì lưu ở đâu**

| Dữ liệu | Nơi lưu |
|---|---|
| Bộ lọc, sắp xếp, cột (hiện, thứ tự, bề rộng), nút bộ lọc nhanh, kiểu Bảng/Board, "Cột theo" | View của ERP (F03 `View`, `visibleFieldsJSON`, `viewType`, `isShared`) |
| Mật độ Thoáng/Gọn (theo từng đối tượng) | Theo người dùng (F03-S4) |
| Ẩn, hiện thanh bộ lọc nhanh | Theo người dùng |
| Thứ tự nút hành động nhanh | Theo người dùng (F03-S4), áp cho cả ba đối tượng |
| Thuộc tính hiển thị trên thẻ của card liên kết | Theo người dùng (F03-S4) |
| Trạng thái danh sách đang xem | URL query (BR-02) |
| Tệp đính kèm | Trường `attachments` của bản ghi, tệp tải qua F02 |

**Tham số URL**

| Tham số | Màn | Ý nghĩa |
|---|---|---|
| view, từ khoá, bộ lọc nhanh, bộ lọc nâng cao, sắp xếp, chế độ bảng/board, "Cột theo", trang | Danh sách | Trạng thái danh sách |
| `?batch=<id>` | Danh sách | Chỉ hiện bản ghi của một lần thao tác hàng loạt |
| `?tab=activities` | Trang chi tiết | Tab giữa đang mở |
| `?card=<associationId>` | Trang chi tiết | Cuộn tới card liên kết và mở nó nếu đang thu gọn |

**Nơi triển khai trong code**

Tên file theo DESIGN-SYSTEM-HUBSPOT, phần ánh xạ màn ERP.

| Phần | File hiện có | Việc làm |
|---|---|---|
| Danh sách | `features/data/RecordListView.tsx` | Dựng theo template T1 |
| Bảng | `features/data/RecordTableView.tsx` | Cột chính dính trái, nút mở rộng, Xem trước, cột "+" |
| Board | `features/data/RecordKanbanView.tsx` | Thẻ theo cấu hình đối tượng |
| Bộ lọc | `features/data/RecordFilterBar.tsx` | Tách thành `QuickFilterBar` (mới) và panel bộ lọc nâng cao giữ logic cũ |
| View đã lưu | `features/data/SavedViewsMenu.tsx` | Hiển thị dạng tab |
| Trang chi tiết | `features/data/RecordDetailPage.tsx` | Template T2, 3 cột |
| Drawer | `features/data/RecordDetailDrawer.tsx` | Thành panel Xem trước (dock) |
| Tạo bản ghi | `features/data/RecordCreateModal.tsx` | Modal → panel phải |
| Component mới | `components/ui/PropertyList.tsx`, `AssociationCard`, `ObjectHeader`, `QuickFilterBar`, `OptionPill` | Theo DESIGN-SYSTEM-HUBSPOT, các component cùng tên |

## C. API

File này không định nghĩa API mới. Khung gọi các API của spec nền:

| Việc | API |
|---|---|
| Danh sách, tìm, lọc, sắp xếp, phân trang | API danh sách bản ghi của F03. Tìm kiếm là bộ lọc `_or` các điều kiện `contains`. Mọi lọc, tìm, sắp xếp chạy ở máy chủ |
| View "của tôi" | `owner_id` với toán tử `linked_to_me` (F03-S1, toán tử lọc theo liên kết; CRM-00, phần view "của tôi") |
| Danh sách theo `?batch=<id>` | Lọc theo F03-S3, phần thông báo gộp của thao tác hàng loạt |
| Cột lấy qua liên kết (ví dụ "Công ty chính") | F03-S1, API lấy liên kết cho nhiều bản ghi trong một lần gọi (25 id) |
| Mở rộng dòng, thẻ trong card liên kết | F03-S1, API danh sách bản ghi liên kết của một bản ghi; mở rộng dòng dùng `limit=5` |
| Số trên header card liên kết, danh sách kênh | F03-S1, API danh sách kênh liên kết của bản ghi |
| Đặt/bỏ Primary, sửa nhãn | F03-S1, API sửa liên kết (`isPrimary`, `label`) |
| Gỡ liên kết | F03-S1, API gỡ liên kết |
| Tạo bản ghi kèm liên kết | F03-S1, API tạo bản ghi kèm liên kết trong một giao dịch |
| Số thẻ mỗi cột board, số bản ghi trống | `group-summary` (CRM-04, phần API) |
| Gán owner, xoá hàng loạt | `bulk/update`, `bulk/delete` (F03-S5, API thao tác hàng loạt) |
| Gộp | F03-S5, hộp thoại gộp bản ghi |
| Theo dõi, lịch sử thuộc tính, lịch sử liên kết, sự kiện timeline | F03-S3 |
| Sửa tại chỗ | `PATCH` bản ghi kèm `If-Match` (F03) |
| Tệp đính kèm | Tải lên qua F02, rồi ghi id tệp vào trường |
| Export, Import, Kết nối Google Sheet | Chức năng có sẵn của ERP |
| Tuỳ chọn cá nhân | F03-S4, cấu hình hiển thị theo người dùng |

**Mã lỗi khung xử lý**

| Mã | Tình huống | Giao diện |
|---|---|---|
| `409 CONFLICT` | Trùng trường Duy nhất khi tạo (ví dụ email) | Lỗi ngay dưới ô, không đóng panel. Cần `details.existingRecordId` khi người gọi đọc được bản ghi trùng (Q6) |
| `412` | Bản ghi đã bị người khác sửa (sai `If-Match`) | "Bản ghi vừa được người khác sửa. Tải lại để xem giá trị mới" kèm nút Tải lại; không ghi đè |
| `ASSOCIATION_REPLACES` | Thêm liên kết sẽ ghi đè liên kết đang có | Hỏi trước khi chuyển (BR-19) |

## D. Lệch so với sheet / prototype

**Lệch so với sheet và design system**

- Sheet ghi 11 tính năng này dưới phân hệ Contacts; spec gán cho khung dùng chung vì cả ba đối tượng đều dùng.
- DESIGN-SYSTEM-HUBSPOT bản 1.0 ghi mật độ "lưu localStorage theo bảng". Spec này đổi sang lưu theo người dùng để đổi máy vẫn giữ lựa chọn; DESIGN-SYSTEM-HUBSPOT đã cập nhật theo (bản 1.1).
- Tuỳ biến bố cục trang chi tiết kiểu nút "Customize" của HubSpot không có trong sheet, không làm.
- Nút Email và các mục Ghi lại email, SMS, WhatsApp, LinkedIn vẫn hiện để giữ bố cục HubSpot nhưng không hoạt động (A-15).
- Hai mục "Làm giàu dữ liệu", "Điền thuộc tính thông minh" của HubSpot hiện với nhãn "Ngoài phạm vi".

**Prototype giả lập gì**

| Trong prototype | Bản thật |
|---|---|
| Dữ liệu và view lưu trong `localStorage` của trình duyệt | View lưu ở ERP (F03 `View`); tuỳ chọn cá nhân lưu theo người dùng (F03-S4) |
| Lọc, tìm, sắp xếp chạy trên mảng dữ liệu đã tải ở FE | Mọi lọc, tìm, sắp xếp chạy ở API, có phân trang |
| "Ngày hoạt động gần nhất" tính ở FE mỗi lần vẽ bảng | Trường `last_activity_at` do F03-S2 tính và lưu |
| Owner là chuỗi tên; popover owner lấy từ danh sách tên cố định | Liên kết tới NhanVien, danh sách lấy từ API, lọc theo trạng thái làm việc |
| "Công ty chính" lấy từ `contact.company` (một công ty) | Dòng Primary của bảng nối, lấy qua F03-S1 |
| Export chỉ hiện toast | Gọi chức năng Export của ERP |
| Nhân bản view chỉ hiện toast | Tạo view thật |
| Hộp xoá ghi "Không thể hoàn tác" | Xoá mềm, khôi phục được 30 ngày |
| "Theo dõi" chỉ đổi nhãn nút | Lưu người theo dõi và phát thông báo (F03-S3) |
| Sự kiện "Đổi owner", "Đổi lifecycle" do FE tự ghi | BE ghi (F03-S3) |
| Tệp đính kèm chỉ hiện toast "sắp ra mắt" | Tải lên qua F02, lưu vào trường `attachments` |

## E. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai |
|---|---|---|
| Q1 | Component bộ lọc điều kiện hiện có của ERP đã hỗ trợ nhóm HOẶC chưa? (Quyết định bộ lọc nâng cao giữ nhóm HOẶC hay chỉ làm VÀ) | FE |
| Q2 | Thao tác hàng loạt chạy ngay tới 200 bản ghi, nhiều hơn thì chạy nền (theo F03-S5). Ngưỡng này có phù hợp giới hạn thời gian request hiện tại của ERP không? | BE |
| Q3 | "Theo dõi" có cần gửi email hay chỉ thông báo trong ERP? | Khách |
| Q4 | Trên màn hẹp (dưới 600 px) có cần giữ bảng cuộn ngang hay chuyển sang danh sách thẻ như F03 mô tả cho mobile? | PO |
| Q5 | Nút Email vô hiệu có gây hiểu nhầm cho khách không, hay nên ẩn hẳn? | Khách |
| Q6 | Lỗi `409 CONFLICT` có trả được id bản ghi bị trùng (khi người gọi đọc được) không? | BE |
| Q7 | C-04 là P0 nhưng bộ lọc "Ngày hoạt động gần nhất" phụ thuộc F03-S2 (đợt 3). Chấp nhận ra mắt bộ lọc nhanh thiếu mục này, hay kéo phần tính `last_activity_at` của F03-S2 lên sớm? | PO |

## F. Tài liệu liên quan

- Prototype: `crm-contacts-hubspot.html`, `crm-companies-hubspot.html`, `crm-giao-dich-hubspot.html` (danh sách); `crm-record-hubspot.html?type=contact|company|deal&id=` (trang chi tiết); code dùng chung `crm-list.js`, `crm-objects.js`, `crm-shared.js`
- Nguồn HubSpot: portal 247428660, màn Contacts / Companies / Deals, khảo sát 28–29/09/2026 (`DOI-CHIEU-CHUC-NANG.md`, phần Contacts, Companies, Deals)
- Plan: `00-PLAN-viet-spec.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md`
- Spec đối tượng dùng khung này: `CRM-02` Contacts, `CRM-03` Companies, `CRM-04` Deals, `CRM-08-sales.md`
- Spec liên quan: `CRM-05` (hoạt động, timeline), `CRM-09` (trường bổ sung)
- Spec nền: `ERPMini/features/features/F03-S1-lien-ket-ban-ghi.md` (liên kết), `F03-S2` (trường tính, cho bộ lọc "Ngày hoạt động gần nhất"), `F03-S3` (lịch sử, theo dõi), `F03-S4` (lưu cấu hình view theo người dùng), `F03-S5` (gộp, thao tác hàng loạt lớn), `F02` (tệp)
- Design system: `../DESIGN-SYSTEM-HUBSPOT.md` (template T1, T2; bảng dữ liệu, panel phải, modal, `PropertyList`, `AssociationCard`, `ObjectHeader`, `QuickFilterBar`, `OptionPill`)
- Đối chiếu chức năng: `../DOI-CHIEU-CHUC-NANG.md` (phần chức năng ERP hiện có; phần Contacts, Companies, Deals)

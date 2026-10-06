# CRM-10 — Sơ đồ quan hệ

# Product Requirement Document

| | | | |
|---|---|---|---|
| **Project Owner** | TTS | **Update at** | 02-10-2026 |
| **Created by** | TTS (qua Claude) | **Project** | CRM theo UX HubSpot — HarnexAI ERP |
| **Version** | 2.0 | **Features** | QH-01 → QH-07 (trang Sơ đồ quan hệ) |

**CONTENT**

- USER STORIES
- OVERVIEW FLOW
- USE CASE DESCRIPTION
  - UC-1: Mở trang Sơ đồ quan hệ
  - UC-2: Xem lưu đồ đối tượng CRM
  - UC-3: Làm nổi liên kết
  - UC-4: Xem panel chi tiết đối tượng
  - UC-5: Xem panel chi tiết quan hệ
  - UC-6: Xem luồng bán hàng và bảng quan hệ
  - UC-7: Tải sơ đồ SVG
- BUSINESS RULE
- ACCEPTANCE CRITERIA
- PHỤ LỤC

**VERSION HISTORY**

| **Ver** | **Author** | **Description** | **Updated at** |
|---|---|---|---|
| 2.0 | TTS (qua Claude) | Viết lại theo mẫu PRD: user story, use case, business rule, acceptance criteria. Nội dung giữ như bản 1.x | 02-10-2026 |
| 1.x | TTS (qua Claude) | Các bản trước 02-10-2026 (v1.0, bản đầu, 01-10-2026) | 01-10-2026 |

---

# USER STORIES

US-QH-01: Là người dùng CRM, tôi muốn có mục "Sơ đồ quan hệ" trên sidebar để mở nhanh trang mô tả mô hình dữ liệu CRM. (QH-01)

US-QH-02: Là người dùng CRM, tôi muốn thấy bảy đối tượng CRM và các đường nối giữa chúng, kèm số bản ghi và số liên kết đang có, để hiểu dữ liệu nối với nhau thế nào. (QH-02)

US-QH-03: Là người dùng CRM, tôi muốn rê chuột hoặc dùng phím Tab vào một thẻ để chỉ các liên kết của thẻ đó nổi lên. (QH-03)

US-QH-04: Là quản trị hoặc BA, tôi muốn bấm một thẻ để xem mô tả, các liên kết và danh sách thuộc tính của đối tượng đó. (QH-04)

US-QH-05: Là quản trị hoặc lập trình viên, tôi muốn bấm một quan hệ để biết nó lưu ở đâu, màn hình nào dùng và khi xoá thì sao. (QH-05)

US-QH-06: Là sale mới, tôi muốn đọc luồng bán hàng 4 bước và bảng chi tiết các quan hệ để hiểu mình tạo dữ liệu theo trình tự nào. (QH-06)

US-QH-07: Là BA, tôi muốn tải sơ đồ thành tệp SVG để in hoặc dán vào tài liệu. (QH-07)

# OVERVIEW FLOW

| **Bước** | **Tác nhân** | **Mô tả** |
|---|---|---|
| 1 | Người dùng | Bấm "Sơ đồ quan hệ" trên sidebar. |
| 2 | FE | Vẽ ngay 7 thẻ và 12 đường từ cấu hình sơ đồ, chỗ số hiện "…". |
| 3 | FE | Gửi một yêu cầu thống kê liên kết lên máy chủ. |
| 4 | Máy chủ | Trả số bản ghi, số thuộc tính, số liên kết, cách lưu và hành vi khi xoá, theo quyền người xem. |
| 5 | Hệ thống | Điền số lên thẻ và chip, hiện "Số liệu tính lúc {HH:mm}" dưới sơ đồ. |
| 6 | Người dùng | Rê chuột hoặc Tab vào một thẻ, một chip để làm nổi các liên kết. |
| 7 | Người dùng | Bấm một thẻ để mở panel đối tượng, hoặc bấm một chip để mở panel quan hệ. |
| 8 | Hệ thống | Mở panel bên phải, ghi `?node=` hoặc `?edge=` vào URL. |
| 9 | Người dùng | Cuộn xuống đọc luồng bán hàng 4 bước và bảng "Chi tiết các quan hệ". |
| 10 | Người dùng | Bấm "Tải SVG" để lấy tệp sơ đồ. |

# USE CASE DESCRIPTION

## UC-1: Mở trang Sơ đồ quan hệ (QH-01)

| | |
|---|---|
| **Actor** | Người đọc được ít nhất một trong bảy collection của sơ đồ (Phụ lục A) |
| **Trigger** | Bấm mục "Sơ đồ quan hệ" trên sidebar (biểu tượng `schema`, ngay sau "Sales", trước vạch ngăn nhóm menu ERP), hoặc mở thẳng `/crm/schema` |
| **Pre-condition** | Đã đăng nhập |
| **Main Flow** | 1. Hệ thống mở `/crm/schema`.<br>2. Hệ thống hiện trang theo template T4: tiêu đề trang, đoạn mô tả, nội dung trong frame.<br>3. Nếu URL có `?node=<mã đối tượng>`, hệ thống mở sẵn panel đối tượng đó (UC-4).<br>4. Nếu URL có `?edge=<mã R>`, hệ thống mở sẵn panel quan hệ đó (UC-5).<br>5. Người dùng mở panel hoặc chuyển panel sang đối tượng, quan hệ khác. Hệ thống thêm một mục vào lịch sử trình duyệt.<br>6. Người dùng bấm Back. Hệ thống quay về panel trước; hết panel thì đóng panel.<br>7. Người dùng đóng panel bằng ✕ hoặc Esc. Hệ thống bỏ tham số khỏi URL. |
| **Post-condition** | Trang chỉ đọc, không thay đổi dữ liệu. URL phản ánh đúng panel đang mở để chia sẻ. |
| **Exception Flow** | 1a. Người dùng không đọc được collection nào trong bảy collection → không có mục "Sơ đồ quan hệ"; mở thẳng `/crm/schema` thì thấy trang báo không có quyền của ERP.<br>3a. Giá trị không có trong cấu hình (`?node=abc`, `?edge=R99`) → bỏ qua, không mở panel, không báo lỗi.<br>4a. `?edge=R9` hoặc `?edge=R14` → bỏ qua, vì hai quan hệ này không phải đường vẽ. |

## UC-2: Xem lưu đồ đối tượng CRM (QH-02)

| | |
|---|---|
| **Actor** | Người dùng mở được trang |
| **Trigger** | Trang `/crm/schema` được mở |
| **Pre-condition** | Không có |
| **Main Flow** | 1. Hệ thống hiện đầu trang: tiêu đề "Sơ đồ quan hệ dữ liệu", tag "Sale · Company · Contact · Deal", nút "Tải SVG" bên phải, đoạn mô tả và chú thích (câu chữ ở Phụ lục A).<br>2. FE vẽ ngay 7 thẻ và 12 đường từ cấu hình sơ đồ (Phụ lục A). Chỗ số hiện "…".<br>3. FE gửi một yêu cầu `POST /api/v1/associations/stats` (Phụ lục C).<br>4. Máy chủ trả số liệu và thông tin cấu trúc theo quyền người xem.<br>5. Hệ thống điền dòng phụ "{n} bản ghi · {m} thuộc tính" trên mỗi thẻ.<br>6. Hệ thống điền chip trên mỗi đường: "{bản số} {nhãn} · {số}", ví dụ "N:N có vai trò · 2.310".<br>7. Hệ thống hiện chữ nhỏ "Số liệu tính lúc {HH:mm}" dưới khung.<br>8. Người dùng rê chuột lên chip. Hệ thống hiện tooltip "{Tên quan hệ} · {bản số} · {số} liên kết". |
| **Post-condition** | Sơ đồ có đủ số liệu sống. Số liệu có thể khác nhau giữa hai người khác quyền. |
| **Exception Flow** | 4a. Lỗi tải số liệu → sơ đồ vẫn hiện, số là "—", dải cảnh báo trên khung "Không tải được số liệu." và nút "Thử lại".<br>4b. Máy chủ trả `400 ASSOCIATION_STATS_INVALID` (quá giới hạn yêu cầu) → xử lý như lỗi tải. Không xảy ra với cấu hình này (7 collection, 14 kênh).<br>5a. Collection chưa tạo trên hệ thống → thẻ viền đứt, dòng phụ "Chưa tạo trên hệ thống" (BR-06).<br>5b. Người xem không đọc được collection → dòng phụ "Không có quyền xem số liệu" (BR-07).<br>6a. Kênh chưa có trên hệ thống → đường nét chấm, chip "Chưa có trên hệ thống" (BR-06).<br>6b. Người xem không đọc đủ hai phía → chip bỏ phần số, ví dụ "N:N hoạt động" (BR-07).<br>6c. Bản số máy chủ trả khác cấu hình → hiện theo máy chủ, FE ghi cảnh báo vào log lỗi phía trình duyệt. |

## UC-3: Làm nổi liên kết (QH-03)

| | |
|---|---|
| **Actor** | Người dùng mở được trang |
| **Trigger** | Rê chuột hoặc focus bàn phím vào một thẻ, một chip |
| **Pre-condition** | Sơ đồ đã vẽ |
| **Main Flow** | 1. Người dùng rê chuột hoặc Tab tới một thẻ.<br>2. Hệ thống giữ nguyên độ đậm của các đường có một đầu là thẻ đó và các thẻ ở đầu kia, đường dày lên 2.6 px. Mọi thứ khác mờ xuống 18%.<br>3. Người dùng rê chuột hoặc Tab tới một chip.<br>4. Hệ thống chỉ làm nổi đường đó và hai thẻ hai đầu.<br>5. Chuột rời khung hoặc focus rời sơ đồ. Hệ thống bỏ làm nổi.<br>6. Người dùng bấm Enter hoặc Space trên thẻ, chip đang focus. Hệ thống mở panel (UC-4, UC-5).<br>7. Người dùng bấm Esc. Hệ thống đóng panel và trả focus về thẻ hoặc chip đã mở nó. |
| **Post-condition** | Không thay đổi dữ liệu. |
| **Exception Flow** | 2a. Đang mở panel đối tượng → thẻ đó viền `--primary` 2 px và các liên kết của nó giữ trạng thái làm nổi tới khi đóng panel. Rê chuột sang thẻ khác thì tạm làm nổi thẻ kia, rời chuột thì về thẻ đang chọn.<br>2b. Đang mở panel quan hệ → đường đó và hai thẻ giữ trạng thái làm nổi.<br>1a. Màn cảm ứng → không có rê chuột; chạm vào thẻ hoặc chip mở panel luôn, trạng thái làm nổi theo panel.<br>2c. Người dùng bật giảm chuyển động (`prefers-reduced-motion`) → đổi trạng thái tức thì, không chuyển tiếp. |

## UC-4: Xem panel chi tiết đối tượng (QH-04)

| | |
|---|---|
| **Actor** | Người dùng mở được trang |
| **Trigger** | Bấm một thẻ trên sơ đồ, bấm tên đối tượng trong một panel khác, hoặc mở URL có `?node=` |
| **Pre-condition** | Sơ đồ đã vẽ |
| **Main Flow** | 1. Hệ thống mở Drawer bên phải (chế độ dock hoặc phủ theo BR-09).<br>2. Hệ thống hiện header: vòng tròn biểu tượng, tên đối tượng, nút ✕.<br>3. Hệ thống hiện mô tả đối tượng (Phụ lục A) và chữ nhỏ "Collection: `{slug}`".<br>4. Hệ thống hiện mục "Liên kết ({k})": một dòng cho mỗi đường nối tới thẻ này, theo thứ tự bảng quan hệ.<br>5. Với Deal và Hoạt động, hệ thống hiện thêm một dòng "Dòng con" (Phụ lục A).<br>6. FE gọi `GET /api/v1/collections/:slug/schema` khi mở panel của đối tượng này lần đầu, rồi giữ kết quả trong phiên.<br>7. Hệ thống hiện mục "Thuộc tính ({m})": mỗi trường một tag ghi tên hiển thị, theo thứ tự hiển thị của collection.<br>8. Hệ thống hiện nút chính ở cuối panel theo cột "Nút ở panel" (Phụ lục A), mở trong tab hiện tại.<br>9. Người dùng bấm tên đối tượng bên kia trong một dòng liên kết. Hệ thống chuyển panel sang đối tượng đó.<br>10. Người dùng bấm phần còn lại của dòng liên kết. Hệ thống mở panel quan hệ (UC-5). |
| **Post-condition** | Không thay đổi dữ liệu. URL có `?node=<mã>`. Thẻ đang chọn và các liên kết của nó được làm nổi. |
| **Exception Flow** | 3a. Người xem không đọc được đối tượng → panel hiện mô tả, các liên kết (không số) và câu "Bạn chưa có quyền xem {tên đối tượng}."<br>7a. Đang tải thuộc tính → 6 tag skeleton.<br>7b. Lỗi tải thuộc tính → "Không tải được danh sách thuộc tính." và nút "Thử lại".<br>7c. Hơn 40 trường → hiện 40 tag đầu và nút "Xem tất cả {m}" mở rộng ngay trong panel.<br>8a. Đối tượng Hoạt động, Line item → không có nút chính.<br>8b. Người có quyền sửa cấu trúc collection → thấy thêm nút phụ "Quản lý trường". |

## UC-5: Xem panel chi tiết quan hệ (QH-05)

| | |
|---|---|
| **Actor** | Người dùng mở được trang |
| **Trigger** | Bấm chip trên sơ đồ, bấm một dòng trong bảng quan hệ, bấm dòng liên kết trong panel đối tượng, hoặc mở URL có `?edge=` |
| **Pre-condition** | Sơ đồ đã vẽ |
| **Main Flow** | 1. Hệ thống mở Drawer bên phải, cùng hai chế độ như panel đối tượng (BR-09).<br>2. Hệ thống hiện header: "{A} → {B}" với quan hệ 1:N, "{A} ↔ {B}" với quan hệ N:N, và nút ✕.<br>3. Hệ thống hiện dòng dưới header: mã R, pill bản số, tên quan hệ. Ví dụ "R6 · N:N · Contact của deal (có vai trò)".<br>4. Hệ thống hiện mục "Lưu ở đâu", dựng từ dữ liệu máy chủ theo mẫu câu ở Phụ lục A.<br>5. Hệ thống hiện mục "Màn hình dùng" theo chữ ở Phụ lục A.<br>6. Hệ thống hiện mục "Khi xoá": câu theo `onDelete` (Phụ lục A), rồi ghi chú thêm nếu có.<br>7. Hệ thống hiện mục "Hiện có": "{số} liên kết."<br>8. Hệ thống hiện hai nút phụ "{A}" và "{B}" ở cuối panel. Bấm thì mở panel của đối tượng đó (UC-4). |
| **Post-condition** | Không thay đổi dữ liệu. URL có `?edge=<mã R>`. Đường đang chọn và hai thẻ hai đầu được làm nổi. |
| **Exception Flow** | 4a. Kênh chưa có trên hệ thống → panel ghi "Quan hệ này chưa được tạo trên hệ thống." và chỉ hiện phần Màn hình dùng.<br>7a. Người xem chỉ đọc được một phía → panel vẫn hiện Lưu ở đâu, Khi xoá; mục "Hiện có" ghi "Bạn chưa có quyền xem đủ hai phía của quan hệ này."<br>4b. Người xem không đọc được phía nào → panel hiện tên quan hệ, Màn hình dùng và câu "Bạn chưa có quyền xem hai đối tượng của quan hệ này." thay cho Lưu ở đâu, Khi xoá, Hiện có. |

## UC-6: Xem luồng bán hàng và bảng quan hệ (QH-06)

| | |
|---|---|
| **Actor** | Người dùng mở được trang |
| **Trigger** | Cuộn xuống dưới sơ đồ |
| **Pre-condition** | Trang đã mở |
| **Main Flow** | 1. Hệ thống hiện bốn ô luồng bán hàng dưới sơ đồ. Mỗi ô có số thứ tự tròn, tiêu đề, đoạn mô tả và dòng nhỏ "Quan hệ: R…" (nội dung ở Phụ lục A).<br>2. Hệ thống hiện bảng tiêu đề "Chi tiết các quan hệ", 12 dòng theo thứ tự bảng quan hệ, không phân trang (cột ở Phụ lục A).<br>3. Người dùng bấm một dòng của bảng.<br>4. Hệ thống mở panel quan hệ của dòng đó (UC-5). |
| **Post-condition** | Không thay đổi dữ liệu. |
| **Exception Flow** | 1a. Màn dưới 900 px → bốn ô xếp một cột.<br>2a. Màn hẹp hơn 880 px → bảng cuộn ngang.<br>2b. Không có quyền hoặc lỗi tải số liệu → cột "Liên kết hiện có" ghi "—". |

## UC-7: Tải sơ đồ SVG (QH-07)

| | |
|---|---|
| **Actor** | Mọi người mở được trang |
| **Trigger** | Bấm nút "Tải SVG" ở đầu trang |
| **Pre-condition** | Số liệu đã tải xong |
| **Main Flow** | 1. Người dùng bấm "Tải SVG".<br>2. FE dựng một tệp SVG độc lập từ sơ đồ đang hiện, không gọi máy chủ (thành phần tệp ở BR-12).<br>3. Trình duyệt tải tệp `so-do-quan-he-crm-{dd-mm-yyyy}.svg`.<br>4. Hệ thống hiện toast "Đã tải sơ đồ (SVG)". |
| **Post-condition** | Người dùng có tệp SVG mở được trên máy không có font Material Symbols, nền sáng, có tiêu đề kèm thời điểm. |
| **Exception Flow** | 1a. Số liệu đang là "…" (chưa tải xong) → nút vô hiệu, tooltip "Đang tải số liệu". |

# BUSINESS RULE

| **BR** | **Mô tả** |
|---|---|
| BR-01 | **Trang chỉ đọc, hai lớp dữ liệu**<br>- Trang là tài liệu sống về mô hình dữ liệu CRM: đối tượng nào nối với đối tượng nào, lưu ở đâu, xoá thì sao, hiện có bao nhiêu liên kết. Trang không sửa được cấu trúc.<br>- Cấu hình sơ đồ nằm trong mã FE (một file cấu hình, ví dụ `crm-schema-map.ts`): đối tượng, vị trí, màu, mô tả, quan hệ, nhãn ngắn, màn hình dùng. Sửa chữ hay dời một thẻ không cần đụng BE.<br>- Dữ liệu sống lấy từ máy chủ mỗi lần mở trang: số bản ghi, số thuộc tính, số liên kết, cách lưu và hành vi khi xoá. Nhờ vậy sơ đồ không nói khác hệ thống thật. |
| BR-02 | **Quyền**<br>- Thấy menu, mở trang: đọc được ít nhất một trong bảy collection, theo quy tắc đọc của F03 (có quyền đọc collection, hoặc là chủ sở hữu hệ thống của ít nhất một bản ghi trong đó).<br>- Thấy số bản ghi, số thuộc tính của một thẻ: đọc được collection đó (hoặc sở hữu bản ghi trong đó; số chỉ tính các bản ghi đó).<br>- Thấy số liên kết của một quan hệ: đọc được cả hai phía.<br>- Thấy cách lưu, hành vi khi xoá của một quan hệ: đọc được ít nhất một phía.<br>- Nút "Mở …" ở panel: như quyền của trang đích.<br>- Nút "Quản lý trường": quyền sửa cấu trúc collection.<br>- Tải SVG: mọi người mở được trang.<br>- Đối tượng người xem không đọc được vẫn hiện trên sơ đồ, để người xem hiểu đủ mô hình. |
| BR-03 | **Tham số URL và lịch sử trình duyệt**<br>- `?node=deal` mở sẵn panel đối tượng; giá trị là cột "Mã" của bảng đối tượng.<br>- `?edge=R6` mở sẵn panel quan hệ; giá trị là mã R của bảng quan hệ.<br>- Mỗi lần mở panel hoặc chuyển panel thì thêm một mục lịch sử (`pushState`). Đóng panel bằng ✕ hoặc Esc thì bỏ tham số (`replaceState`).<br>- Giá trị không có trong cấu hình thì bỏ qua, không báo lỗi. R9, R14 không mở được bằng `edge`. |
| BR-04 | **Số đếm**<br>- Mọi số đếm theo quyền người xem; hai người khác quyền có thể thấy số khác nhau.<br>- Máy chủ lưu đệm 5 phút. Trang hiện "Số liệu tính lúc {HH:mm}" để người xem biết số không tức thời.<br>- Số có dấu chấm ngăn nghìn ("1.248").<br>- Thẻ Sale chỉ đếm nhân viên `is_sales = true`, mọi trạng thái.<br>- Số liên kết của R1, R2, R3, R13 tính theo mọi nhân viên được trỏ tới: task giao được cho nhân viên ngoài đội kinh doanh, và dữ liệu chuyển đổi có thể có owner chưa được đánh dấu `is_sales`. Mô tả của thẻ Sale nói rõ điều này.<br>- Dòng nối đã vào thùng rác không được đếm. |
| BR-05 | **Thẻ, đường, chip**<br>- Bảy thẻ, mười hai đường, đúng vị trí và toạ độ ở Phụ lục A.<br>- Ba kiểu đường: Nhân viên (tím), Liên kết (liền), Hoạt động (đứt).<br>- Chip ghi "{bản số} {nhãn} · {số}". Bản số đậm màu `--primary`.<br>- Bản số lấy từ máy chủ; máy chủ không trả thì theo cột Bản số trong cấu hình.<br>- R9 (Điều chỉnh cấp Deal) và R14 (Bình luận hoạt động) không vẽ thành thẻ hay đường; số của chúng hiện ở panel Deal và Hoạt động.<br>- Khoảng cách ngắn nhất giữa khung chip và khung thẻ ≥ 8 px, hai chip không chồng nhau (cách tính và cách xử lý ở Phụ lục A). |
| BR-06 | **Cấu hình và hệ thống chưa khớp**<br>- Trang có thể được mở khi BE mới dựng xong một phần. Không chặn cả trang.<br>- Collection `exists = false`: thẻ nền `--surface-2`, viền đứt, dòng phụ "Chưa tạo trên hệ thống"; các đường nối tới thẻ đó ở dạng nét chấm.<br>- Kênh `exists = false`: đường nét chấm màu `--outline`, chip "Chưa có trên hệ thống".<br>- `cardinality` khác cấu hình: hiện theo máy chủ. Đây là dấu hiệu cấu hình FE lỗi thời; FE ghi cảnh báo vào log lỗi phía trình duyệt. |
| BR-07 | **Người xem không đọc được**<br>- Thẻ `readable = false`: dòng phụ "Không có quyền xem số liệu", số không hiện, thẻ vẫn bấm được.<br>- Kênh `readable = false` nhưng còn thông tin cấu trúc (đọc được một phía): chip bỏ phần số.<br>- Kênh chỉ trả `{ "readable": false }` (không đọc được phía nào): chip dùng bản số trong cấu hình, không có số.<br>- Thẻ chỉ nhận `{ "readable": false }` không bao giờ hiện dạng "Chưa tạo trên hệ thống", vì máy chủ không cho biết collection có tồn tại hay không. |
| BR-08 | **Làm nổi và bàn phím**<br>- Thứ tự Tab: bảy thẻ theo thứ tự bảng đối tượng, rồi các chip theo thứ tự bảng quan hệ.<br>- Enter hoặc Space mở panel. Esc đóng panel và trả focus về thẻ hoặc chip đã mở nó.<br>- Phần được làm nổi giữ độ đậm, đường dày 2.6 px; phần còn lại mờ xuống 18%.<br>- Focus bàn phím: thẻ viền 2 px `--primary` như hover; chip có vòng focus 2 px `--primary` cách khung chip 2 px. |
| BR-09 | **Hai chế độ của panel**<br>- Từ 1240 px: chế độ dock, rộng 400 px, không scrim, khung vẽ co lại bên trái. Người xem vẫn rê chuột, bấm các thẻ khác; bấm thẻ khác thì thay nội dung panel, không đóng mở lại.<br>- Dưới 1240 px: panel phủ rộng 460 px có scrim. Bấm scrim thì đóng. Muốn xem đối tượng khác thì dùng mục Liên kết trong panel.<br>- Dưới 600 px: panel chiếm toàn màn.<br>- Panel đối tượng và panel quan hệ dùng chung quy tắc này. |
| BR-10 | **Thuộc tính trong panel đối tượng**<br>- Trường có `origin = custom` có thêm nhãn "Mới" (trang Quản lý trường của F03-S4 gọi cùng loại này là "Tuỳ chỉnh"; hai chữ chỉ cùng một cờ).<br>- Rê chuột lên tag hiện "{key} · {kiểu trường}" và mô tả trường nếu có.<br>- `m` ở tiêu đề là số trường trong danh sách vừa tải, cùng quy tắc với `fieldCount`. Nếu vừa có người thêm trường làm hai số lệch thì panel theo danh sách.<br>- Quá 40 trường thì hiện 40 tag đầu và nút "Xem tất cả {m}". |
| BR-11 | **"Lưu ở đâu" và "Khi xoá"**<br>- Hai mục này dựng từ dữ liệu máy chủ (`storage`, `onDelete`), không chép tay.<br>- Mẫu câu giữ đúng chữ ở Phụ lục A.<br>- Panel quan hệ thêm ghi chú khi xoá do FE giữ (nếu có). Bảng quan hệ không kèm ghi chú.<br>- Bảng quan hệ hiện "Lưu ở đâu" dạng rút gọn: `crm_contacts.owner_id` hoặc bảng nối `crm_deal_contacts`. |
| BR-12 | **Tệp SVG**<br>- Dòng tiêu đề "Sơ đồ quan hệ dữ liệu CRM · {dd/mm/yyyy HH:mm}" ở đầu và chú thích ở cuối; `viewBox 0 -48 1120 836` (thêm 48 px phía trên cho tiêu đề, 48 px phía dưới cho chú thích).<br>- Thẻ, đường, chip với số liệu đang hiện; không có trạng thái làm nổi.<br>- Màu của bản sáng, kể cả khi người dùng đang ở chế độ tối.<br>- Style viết thẳng vào tệp. Biểu tượng nhúng dạng `path` SVG, không dựa vào font Material Symbols.<br>- Phông chữ khai báo `Be Vietnam Pro, Inter, Arial, sans-serif`.<br>- Tên tệp `so-do-quan-he-crm-{dd-mm-yyyy}.svg`. |
| BR-13 | **Luồng bán hàng 4 bước**<br>- Nội dung đúng theo Phụ lục A.<br>- Không có câu nào nói hệ thống tự gán vai trò "Người quyết định" cho contact của deal: vai trò do sale chọn.<br>- Không có câu nào nói deal Closed Won tự đổi Lifecycle stage: Lifecycle stage do người dùng tự đổi.<br>- Một hàng 4 cột từ 900 px, một cột dưới 900 px. |
| BR-14 | **Màn hẹp và trợ năng**<br>- Khung vẽ rộng 100% khung, tối thiểu 760 px. Dưới 760 px khung vẽ cuộn ngang; đầu trang và bảng giữ nguyên bề rộng màn.<br>- Bảng quan hệ là phần thay thế bằng chữ cho toàn bộ sơ đồ; trình đọc màn hình đọc được đủ thông tin mà không cần SVG.<br>- Ba kiểu đường khác nhau không chỉ ở màu: đường nhân viên có nhãn chip "owner", "phụ trách", "Người thực hiện"; đường hoạt động là nét đứt; bảng có cột Loại.<br>- Nhãn trợ năng của SVG, thẻ, chip theo Phụ lục A. |

# ACCEPTANCE CRITERIA

AC-1: Menu và quyền mở trang (QH-01)

- Người đọc được `crm_contacts` thấy "Sơ đồ quan hệ" ngay sau "Sales" và trước vạch ngăn; bấm mở `/crm/schema`.
- Người không đọc được collection nào trong bảy collection: không có mục "Sơ đồ quan hệ"; mở thẳng `/crm/schema` thì thấy trang báo không có quyền của ERP.
- Người không có quyền đọc `crm_contacts` nhưng là chủ sở hữu hệ thống của 5 contact: thấy menu; thẻ Contact ghi "5 bản ghi".

AC-2: Tham số URL và nút Back (QH-01, QH-04)

- Mở `/crm/schema?node=deal` → panel Deal mở sẵn, thẻ Deal viền `--primary`, các liên kết của Deal được làm nổi.
- Mở `/crm/schema?edge=R6` → panel quan hệ R6 mở sẵn.
- Mở `/crm/schema?node=abc` hoặc `?edge=R9` → không mở panel, không lỗi.
- Panel Contact đang mở, bấm "Company" trong mục Liên kết → panel đổi sang Company, URL đổi thành `?node=company`.
- Bấm Back hai lần: lần 1 về panel Contact, lần 2 đóng panel.

AC-3: Đủ thẻ và đường (QH-02)

- Hệ thống đã có đủ collection và bảng nối của CRM-00 → sơ đồ có 7 thẻ và 12 đường.
- Đường R1, R2, R3, R13 màu tím; R10, R11, R12 nét đứt.
- Chip R6 ghi "N:N có vai trò · {số}".
- Mở trang chỉ gửi đúng một `POST /associations/stats`; không gọi schema cho tới khi mở panel.

AC-4: Số liệu đúng định nghĩa (QH-02)

- Có 15 nhân viên, trong đó 12 người `is_sales = true`. `crm_deal_contacts` có 3 dòng, 1 dòng đã vào thùng rác theo khi deal của nó bị xoá.
- Mở sơ đồ với tài khoản đọc được toàn bộ dữ liệu → thẻ Sale ghi "12 bản ghi"; chip R6 ghi "· 2".

AC-5: Hệ thống chưa khớp cấu hình (QH-02)

- BE chưa tạo bảng nối `crm_activity_deals` → đường R12 nét chấm xám, chip "Chưa có trên hệ thống"; các đường khác vẫn có số; trang không báo lỗi.
- Collection `crm_line_items` có `exists = false` → thẻ Line item viền đứt "Chưa tạo trên hệ thống"; R7, R8 nét chấm.
- API trả `cardinality = 1:N` cho R6 → chip hiện 1:N theo máy chủ; có log cảnh báo phía trình duyệt.

AC-6: Lỗi tải số liệu (QH-02)

- API thống kê trả lỗi 500 → thẻ và đường vẫn vẽ, mọi số là "—", có dải "Không tải được số liệu." với nút "Thử lại".
- Bấm "Thử lại" khi API đã ổn → số hiện đủ.

AC-7: Không đủ quyền (QH-02, QH-05)

- Người không đọc được `NhanVien` → thẻ Sale ghi "Không có quyền xem số liệu"; chip R1, R2, R3, R13 không có số.
- Lan đọc được Deals nhưng không đọc được `crm_activities`, bấm chip R12 → chip không có số; panel vẫn có Lưu ở đâu và Khi xoá; mục Hiện có ghi "Bạn chưa có quyền xem đủ hai phía của quan hệ này."

AC-8: Làm nổi bằng chuột và bàn phím (QH-03)

- Rê chuột lên thẻ Deal → các đường R3, R5, R6, R7, R12 và các thẻ Sale, Company, Contact, Line item, Hoạt động rõ; thẻ Sản phẩm và các đường còn lại mờ.
- Dùng Tab tới thẻ Deal cho kết quả giống hệt.
- Đi hết sơ đồ chỉ bằng Tab: thứ tự 7 thẻ rồi 12 chip; Enter mở panel; Esc đóng và trả focus đúng chỗ.
- Bật giảm chuyển động → làm nổi tức thì.

AC-9: Panel đối tượng (QH-04)

- `crm_companies` có trường "Mã số thuế" (key `cf_ma_so_thue`, `origin = custom`). Bấm thẻ Company → panel có mô tả, chữ "Collection: `crm_companies`", mục "Liên kết (4)" gồm Sale (R2), Contact (R4), Deal (R5), Hoạt động (R11).
- Tag "Mã số thuế" có nhãn "Mới", rê chuột hiện "cf_ma_so_thue · Văn bản"; có nút "Mở Companies".
- Mở panel Contact hai lần → chỉ gọi schema `crm_contacts` một lần.
- Collection có 55 trường → panel hiện 40 tag và "Xem tất cả 55".
- Panel Deal có dòng con "Điều chỉnh cấp Deal…" với số dòng.
- Người không có quyền sửa cấu trúc → không có nút "Quản lý trường".

AC-10: Panel quan hệ dựng từ máy chủ (QH-05)

- Trường `owner_id` của `crm_contacts` có `onDelete = restrict`. Bấm chip R1.
- Panel ghi "Trường `owner_id` (Contact owner, Liên kết → `NhanVien`) trên `crm_contacts`."
- Phần Khi xoá ghi "Không xoá được Sale khi còn Contact trỏ tới." kèm ghi chú "Nhân viên nghỉ việc thì đánh dấu Đã nghỉ…".

AC-11: Luồng bán hàng và bảng quan hệ (QH-06)

- Dưới sơ đồ có 4 ô luồng với nội dung ở Phụ lục A; không có câu nào nói tự gán vai trò hay tự đổi Lifecycle stage.
- Bảng có 12 dòng theo thứ tự R1, R2, R3, R13, R4, R5, R6, R7, R8, R10, R11, R12.
- Bấm dòng R4 mở panel quan hệ R4.

AC-12: Tải SVG (QH-07)

- Đang ở chế độ tối, sơ đồ đã có số liệu, bấm "Tải SVG" ngày 01/10/2026 → tải tệp `so-do-quan-he-crm-01-10-2026.svg`.
- Mở tệp bằng trình duyệt khác trên máy không có font Material Symbols vẫn thấy biểu tượng dạng hình (không phải chữ "person"), nền sáng, có tiêu đề kèm thời điểm.
- Mở tệp bằng trình sửa ảnh vector → đủ 7 thẻ, 12 đường, chữ tiếng Việt có dấu đúng.
- Số liệu đang tải → nút vô hiệu, tooltip "Đang tải số liệu".

AC-13: Khoảng cách chip (QH-02)

- Chạy kiểm tự động trên cấu hình với mọi số 5 chữ số → mọi chip cách thẻ ≥ 8 px, không chip nào chồng chip khác.

AC-14: Màn hẹp và tốc độ

- Màn 1100 px, bấm thẻ Deal → panel phủ có scrim; bấm scrim thì đóng.
- Màn 390 px: khung vẽ cuộn ngang; panel toàn màn; luồng 1 cột; bảng cuộn ngang.
- Mở trang khi bộ nhớ đệm máy chủ trống, với bộ dữ liệu kiểm hiệu năng của F03-S1: API dưới 1,5 giây; số liệu hiện xong trên màn dưới 2 giây.

# PHỤ LỤC

## A. Màn hình và dữ liệu hiển thị

### A.1 Cấu hình sơ đồ

**Đối tượng (bảy thẻ)**

| Mã | Tên trên thẻ | Collection | Đếm số bản ghi | Biểu tượng | Màu (token của design system) | Vị trí thẻ (x, y) | Nút ở panel |
|---|---|---|---|---|---|---|---|
| `contact` | Contact | `crm_contacts` | Mọi bản ghi | `person` | `--obj-contact` | 460, 40 | "Mở Contacts" |
| `sale` | Sale | `NhanVien` | `is_sales = true`, mọi trạng thái | `badge` | `--obj-sale` | 460, 200 | "Mở Sales" (CRM-08) |
| `company` | Company | `crm_companies` | Mọi bản ghi | `domain` | `--obj-company` | 80, 320 | "Mở Companies" |
| `deal` | Deal | `deals_pipeline` | Mọi bản ghi | `handshake` | `--obj-deal` | 840, 320 | "Mở Deals" |
| `activity` | Hoạt động | `crm_activities` | Mọi loại | `forum` | `--obj-activity` | 460, 500 | Không có (không có trang danh sách riêng) |
| `lineitem` | Line item | `crm_line_items` | Mọi bản ghi | `receipt_long` | `--obj-lineitem` | 840, 500 | Không có |
| `product` | Sản phẩm | `crm_products` | Mọi bản ghi | `inventory_2` | `--obj-product` | 840, 630 | "Mở trong Dữ liệu" (trang Dữ liệu của `crm_products`, xem CRM-06) |

Slug `deals_pipeline` là slug tạm của Deals_Pipeline, chờ BE xác nhận như ghi ở F03-S1.

**Mô tả đối tượng** (hiện ở panel đối tượng)

| Mã | Mô tả |
|---|---|
| `contact` | Người liên hệ ở phía khách hàng. Một contact gắn được với nhiều công ty, trong đó tối đa một công ty chính, và tham gia nhiều deal; ở mỗi deal có thể ghi vai trò của contact (Người quyết định, Người ảnh hưởng…). |
| `sale` | Nhân viên thuộc đội kinh doanh (collection NhanVien, có đánh dấu "Thuộc đội kinh doanh"); số trên thẻ chỉ đếm những người này. Nhân viên là Contact owner, Company owner, Sale phụ trách của deal và người thực hiện task; task giao được cho cả nhân viên ngoài đội kinh doanh, nên số trên các đường nối tính mọi nhân viên. Số liệu trên trang Sales tính từ các liên kết này. |
| `company` | Doanh nghiệp khách hàng, có nhiều contact và nhiều deal. Khi tạo hoạt động trên một contact, công ty chính của contact đó được gợi ý gắn kèm (người tạo bỏ chọn được), nhờ vậy timeline công ty có hoạt động của người trong công ty. |
| `deal` | Cơ hội bán hàng (collection Deals_Pipeline đang chạy). Thuộc tối đa một công ty, có nhiều contact, một sale phụ trách và nhiều line item. Khi bật tính theo line item, Amount lấy từ tổng line item. |
| `activity` | Ghi chú, cuộc gọi, cuộc họp, task. Một hoạt động gắn cùng lúc vào nhiều contact, công ty, deal nên hiện trên timeline của tất cả bản ghi đó. Task có người thực hiện. |
| `lineitem` | Dòng sản phẩm trong deal: số lượng, đơn giá, chiết khấu, tần suất thanh toán, kỳ hạn. Chọn từ thư viện thì tên và giá được chép sang lúc thêm; sửa trên line item không làm đổi thư viện. |
| `product` | Thư viện sản phẩm, gói dịch vụ dùng chung. Một sản phẩm dùng ở nhiều line item của nhiều deal. Quản lý ở trang Dữ liệu. |

**Quan hệ (mười hai đường nối)**

Mã R theo CRM-00, danh sách quan hệ R1–R14. Cột "Kênh hỏi máy chủ" là `from` và `associationId` gửi lên API thống kê liên kết của F03-S1; chiều được chọn sao cho bản số đọc tự nhiên từ thẻ thứ nhất.

| Mã | Thẻ A → B | Kiểu đường | Bản số | Kênh hỏi máy chủ | Tên quan hệ | Nhãn trên chip |
|---|---|---|---|---|---|---|
| R1 | Sale → Contact | Nhân viên | 1:N | `NhanVien` · `ref:crm_contacts.owner_id` | Contact owner | owner |
| R2 | Sale → Company | Nhân viên | 1:N | `NhanVien` · `ref:crm_companies.owner_id` | Company owner | owner |
| R3 | Sale → Deal | Nhân viên | 1:N | `NhanVien` · `ref:deals_pipeline.owner_id` | Sale phụ trách | phụ trách |
| R13 | Sale → Hoạt động | Nhân viên | 1:N | `NhanVien` · `ref:crm_activities.assignee_id` | Người thực hiện task | Người thực hiện |
| R4 | Contact ↔ Company | Liên kết | N:N | `crm_contacts` · `jn:crm_contact_companies` | Công ty của contact (có công ty chính) | có Primary |
| R5 | Company → Deal | Liên kết | 1:N | `crm_companies` · `ref:deals_pipeline.company_id` | Công ty của deal | Công ty của Deal |
| R6 | Deal ↔ Contact | Liên kết | N:N | `deals_pipeline` · `jn:crm_deal_contacts` | Contact của deal (có vai trò) | có vai trò |
| R7 | Deal → Line item | Liên kết | 1:N | `deals_pipeline` · `ref:crm_line_items.deal_id` | Line item của deal | Line items |
| R8 | Sản phẩm → Line item | Liên kết | 1:N | `crm_products` · `ref:crm_line_items.product_id` | Sản phẩm của line item | Sản phẩm |
| R10 | Hoạt động ↔ Contact | Hoạt động | N:N | `crm_activities` · `jn:crm_activity_contacts` | Hoạt động của contact | hoạt động |
| R11 | Hoạt động ↔ Company | Hoạt động | N:N | `crm_activities` · `jn:crm_activity_companies` | Hoạt động của công ty | hoạt động |
| R12 | Hoạt động ↔ Deal | Hoạt động | N:N | `crm_activities` · `jn:crm_activity_deals` | Hoạt động của deal | hoạt động |

Hai kênh dòng con cũng được hỏi để hiện số ở panel (không vẽ):

- R9: `deals_pipeline` · `ref:crm_deal_adjustments.deal_id`
- R14: `crm_activities` · `ref:crm_activity_comments.activity_id`

**Màn hình dùng và ghi chú khi xoá** (chữ do FE giữ, hiện ở panel và bảng)

| Mã | Màn hình dùng | Ghi chú thêm khi xoá |
|---|---|---|
| R1 | Cột và bộ lọc Contact owner ở danh sách Contacts; view "Contacts của tôi"; card bản ghi sở hữu trên trang sale (CRM-08) | Nhân viên nghỉ việc thì đánh dấu Đã nghỉ (CRM-08) và chuyển giao bản ghi, không xoá |
| R2 | Cột và bộ lọc Company owner ở danh sách Companies; card bản ghi sở hữu trên trang sale | Như R1 |
| R3 | Cột Sale phụ trách ở bảng và board Deals; Báo cáo theo sale (CRM-07); bảng xếp hạng Sales (CRM-08) | Như R1 |
| R13 | Việc của tôi; card Việc cần làm và thẻ Task quá hạn trên trang sale (CRM-08) | Như R1 |
| R4 | Card Companies trên trang Contact; card Contacts trên trang Company; cột Công ty chính | — |
| R5 | Card Companies trên trang Deal; card Deals trên trang Company; mở rộng dòng ở danh sách | — |
| R6 | Card Contacts (có vai trò) trên trang Deal; card Deals trên trang Contact; form tạo deal | — |
| R7 | Card Line items và trình sửa line item trên trang Deal (CRM-06) | — |
| R8 | Thư viện sản phẩm trong trình sửa line item (CRM-06) | Line item đã chép tên và giá nên vẫn đủ thông tin. Nên tắt "Đang bán" thay vì xoá sản phẩm |
| R10 | Timeline Contact; Ngày hoạt động gần nhất, Liên hệ gần nhất (F03-S2) | — |
| R11 | Timeline Company | — |
| R12 | Timeline Deal; cột Hoạt động tiếp theo ở bảng Deals | — |

**Đường vẽ** (toạ độ trong `viewBox 0 0 1120 740`, thẻ rộng 200 cao 88)

| Mã | Các điểm của đường | Tâm chip |
|---|---|---|
| R1 | 560,200 → 560,128 | 560,164 |
| R2 | 460,250 → 280,336 | 370,293 |
| R3 | 660,250 → 840,336 | 752,294 |
| R13 | 560,288 → 560,500 | 560,450 |
| R4 | 460,108 → 220,320 | 330,222 |
| R5 | 280,384 → 840,384 | 420,384 |
| R6 | 660,108 → 900,320 | 790,222 |
| R7 | 990,408 → 990,500 | 990,454 |
| R8 | 940,630 → 940,588 | 940,609 |
| R10 | 520,588 → 520,690 → 30,690 → 30,70 → 460,70 | 245,70 |
| R11 | 460,548 → 180,408 | 330,483 |
| R12 | 660,548 → 890,408 | 775,478 |

**Quy tắc khoảng cách chip**

- Chip rộng 26 px + 6,4 px mỗi ký tự của chuỗi "{bản số} {nhãn} · {số}".
- Với số tới 5 chữ số, mọi chip ở bảng trên cách thẻ gần nhất ít nhất 8 px và không chồng chip khác.
- Quy tắc kiểm được: khoảng cách ngắn nhất giữa khung chip và khung thẻ ≥ 8 px, hai chip không chồng nhau.
- Số dài hơn làm vi phạm quy tắc này thì FE trượt tâm chip dọc theo đường của nó cho tới khi đạt; không được thì rút số thành dạng "12,3 nghìn".

### A.2 Đầu trang và khung vẽ

**Đầu trang**

- Tiêu đề "Sơ đồ quan hệ dữ liệu" · tag "Sale · Company · Contact · Deal" · bên phải nút "Tải SVG".
- Đoạn mô tả, tối đa 900 px: "Mỗi thẻ là một đối tượng CRM. Đường tím là quan hệ với nhân viên (owner, người thực hiện), đường liền là liên kết giữa hai đối tượng, đường đứt là hoạt động gắn vào bản ghi. Rê chuột hoặc dùng phím Tab để làm nổi các liên kết của một thẻ; bấm thẻ hoặc nhãn để xem chi tiết."
- Chú thích: mẫu đường tím "Nhân viên (owner, người thực hiện)" · mẫu đường liền "Liên kết" · mẫu đường đứt "Hoạt động gắn bản ghi" · "**1:N** một – nhiều" · "**N:N** nhiều – nhiều".

**Khung vẽ**

- SVG `viewBox 0 0 1120 740`, rộng 100% khung, tối thiểu 760 px; hẹp hơn thì khung cuộn ngang. Nền chấm lưới theo design system, phần sơ đồ quan hệ.
- Thẻ đối tượng: dải màu trên cùng và vòng tròn biểu tượng theo màu của đối tượng · tên (15/700) · dòng phụ "{n} bản ghi · {m} thuộc tính".
- Đường nối: ba kiểu ở cột "Kiểu đường", style theo design system, phần sơ đồ quan hệ.
- Chip trên đường: "{bản số} {nhãn} · {số}". Tooltip "{Tên quan hệ} · {bản số} · {số} liên kết".
- Dưới khung: chữ nhỏ "Số liệu tính lúc {HH:mm}".

### A.3 Các trạng thái hiển thị

**Trạng thái tải**

| Trạng thái | Hiển thị |
|---|---|
| Đang tải | Thẻ và đường vẽ ngay từ cấu hình; chỗ số hiện "…" |
| Lỗi tải số liệu | Sơ đồ vẫn hiện, số là "—"; dải cảnh báo trên khung "Không tải được số liệu." + nút "Thử lại" |
| Quá giới hạn yêu cầu (`400 ASSOCIATION_STATS_INVALID`) | Không xảy ra với cấu hình này (7 collection, 14 kênh); nếu gặp thì xử lý như lỗi tải |

**Cấu hình và hệ thống chưa khớp**

| Phản hồi | Hiển thị |
|---|---|
| Collection `exists = false` | Thẻ nền `--surface-2`, viền đứt, dòng phụ "Chưa tạo trên hệ thống"; các đường nối tới thẻ đó cũng ở dạng dưới |
| Kênh `exists = false` | Đường nét chấm màu `--outline`, chip "Chưa có trên hệ thống"; panel quan hệ ghi "Quan hệ này chưa được tạo trên hệ thống." và chỉ hiện phần Màn hình dùng |
| `cardinality` khác bản số trong cấu hình | Hiện theo máy chủ. Đây là dấu hiệu cấu hình FE lỗi thời; FE ghi cảnh báo vào log lỗi phía trình duyệt |

**Người xem không đọc được**

| Phản hồi | Trên sơ đồ | Trong panel |
|---|---|---|
| Thẻ `readable = false` | Dòng phụ "Không có quyền xem số liệu", số không hiện. Thẻ vẫn bấm được | Mô tả, các liên kết (không số) và câu "Bạn chưa có quyền xem {tên đối tượng}." |
| Kênh `readable = false`, còn thông tin cấu trúc (đọc được một phía) | Chip bỏ phần số ("N:N hoạt động") | Vẫn hiện Lưu ở đâu, Khi xoá; mục "Hiện có" ghi "Bạn chưa có quyền xem đủ hai phía của quan hệ này." |
| Kênh chỉ trả `{ "readable": false }` (không đọc được phía nào) | Chip dùng bản số trong cấu hình, không có số | Tên quan hệ, Màn hình dùng và câu "Bạn chưa có quyền xem hai đối tượng của quan hệ này." thay cho Lưu ở đâu, Khi xoá, Hiện có |

### A.4 Panel đối tượng

- **Header**: vòng tròn biểu tượng · tên đối tượng · nút ✕.
- **Mô tả** theo bảng mô tả đối tượng. Dưới mô tả chữ nhỏ "Collection: `{slug}`" (cho quản trị và BE tra cứu).
- **Liên kết ({k})**: mỗi dòng gồm biểu tượng của đối tượng bên kia · tên đối tượng bên kia (nút, bấm thì chuyển panel sang đối tượng đó) · pill bản số · tên quan hệ · số liên kết (canh phải). Bấm vào phần còn lại của dòng mở panel quan hệ.
- **Dòng con** (chỉ Deal và Hoạt động), một dòng chữ không có nút, phần cuối là câu Khi xoá dựng từ `onDelete` của R9, R14 theo mẫu ở A.5:
  - Deal: "Điều chỉnh cấp Deal (chiết khấu, phí, thuế) · `crm_deal_adjustments` · {số} dòng." + câu Khi xoá.
  - Hoạt động: "Bình luận · `crm_activity_comments` · {số} bình luận." + câu Khi xoá.
- **Thuộc tính ({m})**: tag tên hiển thị của từng trường; nhãn "Mới" theo BR-10. Đang tải: 6 tag skeleton. Lỗi: "Không tải được danh sách thuộc tính." + "Thử lại".
- **Cuối panel**: nút chính theo cột "Nút ở panel", mở trong tab hiện tại. Người có quyền sửa cấu trúc collection thấy thêm nút phụ "Quản lý trường" mở trang Quản lý trường của collection đó (F03-S4).

### A.5 Panel quan hệ

- **Header**: "{A} → {B}" (1:N) hoặc "{A} ↔ {B}" (N:N) · nút ✕. Dòng dưới: mã R · pill bản số · tên quan hệ.

**Lưu ở đâu**, dựng từ `storage`:

- Kênh `ref`: "Trường `{storage.field}` ({storage.fieldName}, Liên kết → `{from}`) trên `{storage.collection}`." Ví dụ: "Trường `owner_id` (Contact owner, Liên kết → `NhanVien`) trên `crm_contacts`."
- Kênh `junction`: "Bảng nối `{junction}` (`{left}` ↔ `{right}`)."
  - Thêm "Nhãn: trường `{labelField}`." khi có `labelField`.
  - Khi có `primaryField`, thêm "Mỗi {X} có tối đa một dòng Primary (`{primaryField}`).", trong đó X là tên thẻ của collection ở phía `primaryScope` (`leftCollection` hoặc `rightCollection`). Ví dụ: "Mỗi Contact có tối đa một dòng Primary (`is_primary`)."

**Màn hình dùng**: chữ ở bảng "Màn hình dùng và ghi chú khi xoá" (A.1).

**Khi xoá**, câu theo `onDelete`, rồi thêm ghi chú ở bảng A.1 nếu có:

| `onDelete` | Câu |
|---|---|
| `restrict` | "Không xoá được {A} khi còn {B} trỏ tới." |
| `cascade` (kênh `ref`) | "Xoá {A} thì các {B} của nó vào thùng rác theo; khôi phục {A} thì chúng trở lại." |
| `keep` | "Xoá {A} thì {B} giữ nguyên; ô liên kết hiện “(Đã xoá)” kèm tên {A} đã xoá, khôi phục {A} thì liên kết trở lại." |
| `cascade` (kênh `junction`) | "Xoá một bên thì dòng nối vào thùng rác theo, bản ghi bên kia giữ nguyên. Dòng nối được khôi phục khi cả hai bên đều đang hoạt động." |

**Hiện có**: "{số} liên kết." theo quyền người xem (không đủ quyền thì theo A.3).

**Cuối panel**: hai nút phụ "{A}" và "{B}" mở panel của từng đối tượng.

### A.6 Luồng bán hàng 4 bước

| # | Tiêu đề | Mô tả | Quan hệ |
|---|---|---|---|
| 1 | Nhận khách | Tạo contact, chọn Contact owner trong đội kinh doanh, gắn công ty (công ty đầu tiên là công ty chính). Company có owner riêng. | R1, R2, R4 |
| 2 | Mở cơ hội | Tạo deal từ card Deals của contact hoặc công ty: deal điền sẵn công ty và contact, Sale phụ trách mặc định là owner của contact hoặc công ty. Vai trò của contact trong deal do sale chọn. | R3, R5, R6 |
| 3 | Chăm sóc và báo giá | Ghi chú, cuộc gọi, cuộc họp, task gắn được cùng lúc vào contact, công ty, deal (hệ thống gợi ý sẵn, người tạo bỏ chọn được) nên hiện trên timeline của cả ba. Task có người thực hiện. Thêm line item từ thư viện sản phẩm hoặc dòng tuỳ chỉnh. | R10, R11, R12, R13, R7, R8 |
| 4 | Chốt và đo lường | Sale chuyển deal sang Closed Won hoặc Closed Lost, máy chủ ghi ngày đóng. Doanh số thắng và % chỉ tiêu trên trang Sales, Báo cáo tính theo Sale phụ trách và ngày đóng; pipeline đang mở tính theo Sale phụ trách của các deal chưa đóng. Lifecycle stage của contact và công ty do người dùng tự đổi. | R3 |

### A.7 Bảng "Chi tiết các quan hệ"

Bảng theo DataTable của design system, 12 dòng theo thứ tự bảng quan hệ ở A.1, không phân trang.

| Cột | Nội dung |
|---|---|
| Quan hệ | "{A} → {B}" (1:N) hoặc "{A} ↔ {B}" (N:N) đậm, dòng dưới tên quan hệ và mã R |
| Loại | Nhân viên · Liên kết · Hoạt động (để không chỉ dựa vào màu đường) |
| Bản số | Pill 1:N / N:N |
| Lưu ở đâu | Như A.5, dạng rút gọn: `crm_contacts.owner_id` hoặc bảng nối `crm_deal_contacts` |
| Màn hình dùng | Chữ ở A.1 |
| Khi xoá | Câu ở A.5, không kèm ghi chú |
| Liên kết hiện có | Số, canh phải; "—" khi không có quyền hoặc lỗi |

### A.8 Nhãn trợ năng

- SVG có `role="group"` và nhãn "Sơ đồ quan hệ giữa Sale, Company, Contact, Deal, Hoạt động, Line item và Sản phẩm".
- Mỗi thẻ là `role="button"`, nhãn "{tên}: {n} bản ghi, {k} liên kết"; đang tải thì "{tên}: đang tải số liệu"; không có quyền thì "{tên}: không có quyền xem số liệu".
- Mỗi chip là `role="button"`, nhãn "{A} – {B}: {tên quan hệ}, {bản số}, {số} liên kết" (bỏ phần số khi đang tải hoặc không có quyền).

## B. Dữ liệu

Trang không thêm collection hay trường nào. Trang đọc bảy collection và các kênh liên kết đã đặc tả ở CRM-00.

| Lớp dữ liệu | Nằm ở đâu | Gồm gì |
|---|---|---|
| Cấu hình sơ đồ | Mã FE, một file cấu hình (ví dụ `crm-schema-map.ts`) | Đối tượng, vị trí, màu, mô tả, quan hệ nối hai thẻ nào, nhãn ngắn, màn hình dùng, ghi chú khi xoá, toạ độ đường và chip |
| Dữ liệu sống | Máy chủ, lấy mỗi lần mở trang | Số bản ghi, số thuộc tính, số liên kết, cách lưu, hành vi khi xoá của từng quan hệ |

URL: `/crm/schema`, tham số tuỳ chọn `?node=<mã đối tượng>` và `?edge=<mã R>` (BR-03).

## C. API

| Việc | API |
|---|---|
| Số liệu và cấu trúc quan hệ | `POST /api/v1/associations/stats` (F03-S1, API thống kê liên kết). Mở trang gửi đúng một yêu cầu |
| Danh sách thuộc tính của một đối tượng | `GET /api/v1/collections/:slug/schema` của F03, gọi khi mở panel đối tượng lần đầu, rồi giữ trong phiên. Thuộc tính `origin` của trường theo F03-S4 |

**Yêu cầu thống kê gửi lên**

- `collections`: bảy collection ở bảng đối tượng; riêng `NhanVien` kèm `where: { "is_sales": { "eq": true } }`.
- `associations`: mười hai kênh ở bảng quan hệ và hai kênh dòng con R9, R14.

**Phản hồi dùng để hiển thị**

| Hiển thị | Lấy từ |
|---|---|
| "{n} bản ghi" trên thẻ | `collections[slug].records` |
| "{m} thuộc tính" trên thẻ | `collections[slug].fieldCount` |
| Bản số trên chip | `cardinality` của kênh (1:N hoặc N:N); máy chủ không trả thì theo cột Bản số ở Phụ lục A |
| Số trên chip, cột "Liên kết hiện có" | `count` của kênh |
| "Lưu ở đâu" | `storage` |
| "Khi xoá" | `onDelete` + ghi chú ở Phụ lục A |
| "Số liệu tính lúc {HH:mm}" | `computedAt` |
| Trạng thái chưa tạo, không đọc được | `exists`, `readable` |

**Mã lỗi**

| Mã | Ý nghĩa | FE xử lý |
|---|---|---|
| `400 ASSOCIATION_STATS_INVALID` | Quá giới hạn yêu cầu | Như lỗi tải số liệu. Không xảy ra với cấu hình này (7 collection, 14 kênh) |

Máy chủ lưu đệm 5 phút. Mục tiêu tốc độ của API: dưới 1,5 giây khi bộ nhớ đệm trống.

## D. Lệch so với sheet / prototype

**Lệch so với sheet, cần PO xác nhận**

- Bảng quan hệ có 12 dòng, không phải 11. Prototype vẽ theo thiết kế cũ. Spec vẽ theo CRM-00, danh sách quan hệ:
  - Contact – Company là N:N qua bảng nối có Primary (QĐ-03), không phải trường `company_id` một giá trị trên Contact.
  - Owner là trường Liên kết `owner_id` tới NhanVien (QĐ-01), không phải tên sale dạng chữ.
  - Hoạt động nối với Contact, Company, Deal qua ba bảng nối riêng, không phải một bảng `activity_links` chung.
  - Thêm quan hệ R13 Nhân viên → Hoạt động (người thực hiện task), prototype chưa có.
  - Hai quan hệ dòng con R9 (Điều chỉnh cấp Deal) và R14 (Bình luận hoạt động) không vẽ thành thẻ riêng; chúng được nêu trong panel của Deal và Hoạt động.
- Luồng bán hàng 4 bước được viết lại. Prototype có hai câu không khớp spec: "Deal tự liên kết Contact với nhãn Người quyết định" (theo CRM-04, vai trò để trống, sale tự chọn) và "Deal Closed Won → Contact/Company thành Customer" (không có tự động nào như vậy; Lifecycle stage do người dùng đổi).
- "Lưu ở đâu (gợi ý BE)" thành "Lưu ở đâu". Lúc viết prototype chưa có thiết kế dữ liệu nên đó là gợi ý. Nay CRM-00 đã chốt, panel đọc nơi lưu thật từ máy chủ, không chép tay.
- QH-01 "thẻ trên trang chủ": thẻ này chỉ có ở trang mục lục prototype (`index.html`), là trang giới thiệu các màn mẫu chứ không phải Trang chủ của ERP. Spec chỉ làm mục trên sidebar (xem câu hỏi Q1).
- QH-07 tên tệp thêm ngày tải (`so-do-quan-he-crm-{dd-mm-yyyy}.svg`, sheet ghi `so-do-quan-he-crm.svg`) để tải nhiều lần không đè nhau.
- QH-04, QH-05 sheet ghi "Chỉ FE": đúng về giao diện, nhưng dữ liệu của hai panel đến từ cùng API với QH-02. Không phát sinh việc BE ngoài QH-02.
- Nhãn "Mới" ở tag thuộc tính theo sheet QH-04 và TB-04; trang Quản lý trường của F03-S4 gọi là "Tuỳ chỉnh".

**Khác prototype về bố cục sơ đồ**

- Khung cao 740 thay vì 720 (thẻ Sản phẩm kết thúc ở y = 718, sát mép).
- Thêm R13 (đường dọc giữa Sale và Hoạt động).
- Dời chip R5 sang trái (từ 560 về 420) để không đè lên R13; dời chip R3, R12 ra xa thẻ.
- Rút gọn nhãn chip R3 thành "phụ trách" và R10–R12 thành "hoạt động" cho chip đủ chỗ.

**Prototype giả lập, bản thật khác**

| Trong prototype | Bản thật |
|---|---|
| Số bản ghi, số liên kết đếm trên dữ liệu mẫu trong trình duyệt | API thống kê liên kết của F03-S1, theo quyền người xem, đệm 5 phút |
| Collection hoạt động tên `Sales_Activities` | `crm_activities` (CRM-00) |
| Nút "Sales" ở đầu trang | Bỏ; đã có trên sidebar |
| Màu đối tượng mã cứng, vài màu không đủ tương phản với biểu tượng trắng | Token `--obj-*` của design system |
| Tải SVG gán màu sáng bằng biến CSS chép từ trang, biểu tượng là chữ dùng font Material Symbols (thiếu font thì hiện chữ "person"), tên tệp không có ngày | Biểu tượng dạng `path`, màu bản sáng viết thẳng vào tệp, có tiêu đề và chú thích, tên tệp có ngày |
| Không có tham số URL | `?node=`, `?edge=` |

**Ngoài phạm vi:** sửa cấu trúc từ sơ đồ (thêm trường, tạo bảng nối, kéo thả đổi bố cục); sơ đồ cho collection ngoài CRM; tự dàn trang khi có đối tượng mới; xuất PNG, PDF.

## E. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai |
|---|---|---|
| Q1 | Sheet QH-01 có "thẻ trên trang chủ". ERP chưa có trang chủ CRM; có cần thêm lối tắt ở Trang chủ ERP (F11) không, hay chỉ sidebar là đủ? | PO |
| Q2 | Trang này mở cho mọi người dùng CRM hay chỉ quản trị và BA? Spec đang cho mọi người đọc được ít nhất một collection CRM. | PO / khách |
| Q3 | Thẻ Sale đếm mọi nhân viên `is_sales`, kể cả đã nghỉ. Có muốn chỉ đếm người đang làm việc không? | Khách |

Chờ BE xác nhận: slug `deals_pipeline` là slug tạm (ghi ở F03-S1).

## F. Tài liệu liên quan

- Prototype: `crm-quan-he-hubspot.html`
- Plan: `00-PLAN-viet-spec.md`
- Spec nền: `F03-S1-lien-ket-ban-ghi.md` (API thống kê liên kết), `F03-S4-truong-tuy-chinh-cau-hinh-hien-thi.md` (thuộc tính `origin` của trường, trang Quản lý trường), F03 `GET /collections/:slug/schema`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` (danh sách quan hệ R1–R14, các collection CRM)
- Màn liên quan: `CRM-04-deals.md` (vai trò của contact khi tạo deal), `CRM-06-line-items-san-pham.md`, `CRM-07-bao-cao.md`, `CRM-08-sales.md`
- Design system: `DESIGN-SYSTEM-HUBSPOT.md` (sidebar, DataTable, Drawer, sơ đồ quan hệ, template T4)
- Đối chiếu HubSpot: `DOI-CHIEU-CHUC-NANG.md`, nguồn Settings › Data management › Data model (Data model overview)

# CRM-10 — Sơ đồ quan hệ

> **Trạng thái:** 💡 Proposed · v1.0 · 01/10/2026 · chờ review
> **Tính năng sở hữu (7):** QH-01 → QH-07
> **Phụ thuộc:** `F03-S1` §4.8 (API thống kê liên kết, viết đầy đủ ở đợt này), §3.1, §3.4 · F03 `GET /collections/:slug/schema` + `F03-S4` §3.1 (`origin` để gắn nhãn "Mới") · `CRM-00` §4, §6.1 (danh sách quan hệ R1–R14) · `DESIGN-SYSTEM-HUBSPOT.md` §5 (sidebar), §6.10 (Drawer), §6.18 (sơ đồ quan hệ, thêm ở đợt này), §7.4 (template T4)
> **Prototype:** `crm-quan-he-hubspot.html`
> **Nguồn HubSpot:** Settings › Data management › Data model (Data model overview) — `DOI-CHIEU-CHUC-NANG.md` §17

---

## 1. Phạm vi

| ID | Tính năng | Ưu tiên | Phạm vi sheet | Mục |
|---|---|---|---|---|
| QH-01 | Menu Sơ đồ quan hệ | P1 | Chỉ FE | §2 |
| QH-02 | Lưu đồ đối tượng CRM | P1 | FE + BE | §3, §4 |
| QH-03 | Làm nổi liên kết | P2 | Chỉ FE | §5 |
| QH-04 | Panel chi tiết đối tượng | P2 | Chỉ FE | §6 |
| QH-05 | Panel chi tiết quan hệ | P2 | Chỉ FE | §7 |
| QH-06 | Luồng bán hàng 4 bước + bảng quan hệ | P2 | Chỉ FE | §8 |
| QH-07 | Tải sơ đồ SVG | P2 | Chỉ FE | §9 |

Trang này là tài liệu sống về mô hình dữ liệu CRM: ai mở cũng thấy đối tượng nào nối với đối tượng nào, lưu ở đâu, xoá thì sao, và hiện có bao nhiêu liên kết. Trang chỉ đọc, không sửa được cấu trúc.

Lệch so với sheet và prototype, cần PO xác nhận:

- **Bảng quan hệ có 12 dòng, không phải 11.** Prototype vẽ theo thiết kế cũ. Spec vẽ theo CRM-00 §6.1:
  - Contact – Company là **N:N qua bảng nối có Primary** (QĐ-03), không phải trường `company_id` một giá trị trên Contact.
  - Owner là **trường Liên kết `owner_id` tới NhanVien** (QĐ-01), không phải tên sale dạng chữ.
  - Hoạt động nối với Contact, Company, Deal qua **ba bảng nối riêng**, không phải một bảng `activity_links` chung.
  - Thêm quan hệ R13 **Nhân viên → Hoạt động** (người thực hiện task), prototype chưa có.
  - Hai quan hệ dòng con R9 (Điều chỉnh cấp Deal) và R14 (Bình luận hoạt động) không vẽ thành thẻ riêng; chúng được nêu trong panel của Deal và Hoạt động (§6).
- **Luồng bán hàng 4 bước được viết lại.** Prototype có hai câu không khớp spec: "Deal tự liên kết Contact với nhãn Người quyết định" (CRM-04 §5.3: vai trò để trống, sale tự chọn) và "Deal Closed Won → Contact/Company thành Customer" (không có tự động nào như vậy; Lifecycle stage do người dùng đổi). Nội dung mới ở §8.1.
- **"Lưu ở đâu (gợi ý BE)" thành "Lưu ở đâu".** Khi viết prototype chưa có thiết kế dữ liệu nên đó là gợi ý. Nay CRM-00 đã chốt, panel đọc nơi lưu thật từ máy chủ (§3.2), không chép tay.
- **QH-01 "thẻ trên trang chủ"**: thẻ này chỉ có ở trang mục lục prototype (`index.html`), là trang giới thiệu các màn mẫu chứ không phải Trang chủ của ERP. Spec chỉ làm mục trên sidebar (Q1).
- **QH-07 tên tệp** thêm ngày tải (`so-do-quan-he-crm-{dd-mm-yyyy}.svg`, sheet ghi `so-do-quan-he-crm.svg`) để tải nhiều lần không đè nhau.
- **QH-04, QH-05 "Chỉ FE"**: đúng về giao diện, nhưng dữ liệu của hai panel đến từ cùng API với QH-02 (F03-S1 §4.8). Không phát sinh việc BE ngoài QH-02.

**Ngoài phạm vi:** sửa cấu trúc từ sơ đồ (thêm trường, tạo bảng nối, kéo thả đổi bố cục); sơ đồ cho collection ngoài CRM; tự dàn trang khi có đối tượng mới; xuất PNG, PDF.

---

## 2. Vị trí, URL, quyền xem (QH-01)

- Mục **"Sơ đồ quan hệ"** trên sidebar, biểu tượng `schema`, ngay sau "Sales", trước vạch ngăn nhóm menu ERP (DS-HUBSPOT §5: Contacts · Companies · Deals · Sales · Sơ đồ quan hệ ─ Dữ liệu · Workflow · Biểu mẫu · Media · Báo cáo).
- URL: `/crm/schema`. Tham số tuỳ chọn để chia sẻ đúng chỗ đang xem:
  - `?node=deal` mở sẵn panel đối tượng (§6). Giá trị là cột "Mã" ở §3.1.
  - `?edge=R6` mở sẵn panel quan hệ (§7). Giá trị là mã R ở §3.1.
  - Mỗi lần mở panel hoặc chuyển panel sang đối tượng, quan hệ khác thì thêm một mục vào lịch sử trình duyệt (`pushState`); nút Back quay về panel trước, hết panel thì đóng panel. Đóng panel bằng ✕ hoặc Esc thì bỏ tham số (`replaceState`).
  - Giá trị không có trong cấu hình (`?node=abc`, `?edge=R9`, `?edge=R99`) thì bỏ qua, không mở panel, không báo lỗi. R9, R14 không phải đường vẽ nên không mở được bằng `edge`.
- Hiện mục menu với người đọc được ít nhất một trong bảy collection ở §3.1, theo quy tắc đọc của F03: có quyền đọc collection, hoặc là chủ sở hữu hệ thống của ít nhất một bản ghi trong đó. Đối tượng người xem không đọc được vẫn hiện trên sơ đồ (§4.4), để người xem hiểu đủ mô hình.
- Bố cục theo template T4 (DS-HUBSPOT §7.4): tiêu đề trang, đoạn mô tả, nội dung trong frame.

---

## 3. Dữ liệu của trang

Trang có hai lớp dữ liệu:

- **Cấu hình sơ đồ** nằm trong mã FE (một file cấu hình, ví dụ `crm-schema-map.ts`): đối tượng nào, vẽ ở đâu, màu gì, mô tả bằng lời, quan hệ nào nối hai thẻ nào, nhãn ngắn, màn hình nào dùng. Phần này là câu chữ và bố cục do BA, FE soạn; để ở FE thì sửa chữ hay dời một thẻ không cần đụng BE.
- **Dữ liệu sống** lấy từ máy chủ mỗi lần mở trang: số bản ghi, số thuộc tính, số liên kết, cách lưu và hành vi khi xoá của từng quan hệ. Phần này để ở máy chủ để sơ đồ không bao giờ nói khác hệ thống thật.

### 3.1 Cấu hình sơ đồ

**Đối tượng (bảy thẻ)**

| Mã | Tên trên thẻ | Collection | Đếm số bản ghi | Biểu tượng | Màu (DS §6.18) | Vị trí thẻ (x, y) | Nút ở panel |
|---|---|---|---|---|---|---|---|
| `contact` | Contact | `crm_contacts` | Mọi bản ghi | `person` | `--obj-contact` | 460, 40 | "Mở Contacts" |
| `sale` | Sale | `NhanVien` | `is_sales = true`, mọi trạng thái | `badge` | `--obj-sale` | 460, 200 | "Mở Sales" (CRM-08) |
| `company` | Company | `crm_companies` | Mọi bản ghi | `domain` | `--obj-company` | 80, 320 | "Mở Companies" |
| `deal` | Deal | `deals_pipeline` | Mọi bản ghi | `handshake` | `--obj-deal` | 840, 320 | "Mở Deals" |
| `activity` | Hoạt động | `crm_activities` | Mọi loại | `forum` | `--obj-activity` | 460, 500 | Không có (không có trang danh sách riêng) |
| `lineitem` | Line item | `crm_line_items` | Mọi bản ghi | `receipt_long` | `--obj-lineitem` | 840, 500 | Không có |
| `product` | Sản phẩm | `crm_products` | Mọi bản ghi | `inventory_2` | `--obj-product` | 840, 630 | "Mở trong Dữ liệu" (trang Dữ liệu của `crm_products`, CRM-06 §1) |

Slug `deals_pipeline` là slug tạm của Deals_Pipeline, chờ BE xác nhận như F03-S1 §2.2.

Thẻ Sale chỉ đếm nhân viên `is_sales`, nhưng số liên kết của R1, R2, R3, R13 tính theo **mọi** nhân viên được trỏ tới: task giao được cho nhân viên ngoài đội kinh doanh (CRM-00 §6.2, CRM-08 §3.2), và dữ liệu chuyển đổi có thể có owner chưa được đánh dấu `is_sales`. Mô tả của thẻ Sale nói rõ điều này.

**Mô tả đối tượng** (hiện ở panel, §6):

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

Mã R theo CRM-00 §6.1. Cột "Kênh hỏi máy chủ" là `from` và `associationId` gửi lên F03-S1 §4.8; chiều được chọn sao cho bản số đọc tự nhiên từ thẻ thứ nhất.

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

Hai kênh dòng con cũng được hỏi để hiện số ở panel (không vẽ): R9 `deals_pipeline` · `ref:crm_deal_adjustments.deal_id` và R14 `crm_activities` · `ref:crm_activity_comments.activity_id`.

**Màn hình dùng và ghi chú khi xoá** (chữ do FE giữ, hiện ở panel và bảng):

| Mã | Màn hình dùng | Ghi chú thêm khi xoá |
|---|---|---|
| R1 | Cột và bộ lọc Contact owner ở danh sách Contacts; view "Contacts của tôi"; card bản ghi sở hữu trên trang sale (CRM-08 §7.7) | Nhân viên nghỉ việc thì đánh dấu Đã nghỉ (CRM-08 §9) và chuyển giao bản ghi, không xoá |
| R2 | Cột và bộ lọc Company owner ở danh sách Companies; card bản ghi sở hữu trên trang sale | Như R1 |
| R3 | Cột Sale phụ trách ở bảng và board Deals; Báo cáo theo sale (CRM-07); bảng xếp hạng Sales (CRM-08) | Như R1 |
| R13 | Việc của tôi; card Việc cần làm và thẻ Task quá hạn trên trang sale (CRM-08 §7.3, §7.5) | Như R1 |
| R4 | Card Companies trên trang Contact; card Contacts trên trang Company; cột Công ty chính | — |
| R5 | Card Companies trên trang Deal; card Deals trên trang Company; mở rộng dòng ở danh sách | — |
| R6 | Card Contacts (có vai trò) trên trang Deal; card Deals trên trang Contact; form tạo deal | — |
| R7 | Card Line items và trình sửa line item trên trang Deal (CRM-06) | — |
| R8 | Thư viện sản phẩm trong trình sửa line item (CRM-06 §4.3) | Line item đã chép tên và giá nên vẫn đủ thông tin. Nên tắt "Đang bán" thay vì xoá sản phẩm |
| R10 | Timeline Contact; Ngày hoạt động gần nhất, Liên hệ gần nhất (F03-S2) | — |
| R11 | Timeline Company | — |
| R12 | Timeline Deal; cột Hoạt động tiếp theo ở bảng Deals | — |

**Đường vẽ** (toạ độ trong `viewBox 0 0 1120 740`, thẻ rộng 200 cao 88):

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

So với prototype: khung cao 740 thay vì 720 (thẻ Sản phẩm kết thúc ở y = 718, sát mép); thêm R13 (đường dọc giữa Sale và Hoạt động); dời chip R5 sang trái (từ 560 về 420) để không đè lên R13; dời chip R3, R12 ra xa thẻ; rút gọn nhãn chip R3 thành "phụ trách" và R10–R12 thành "hoạt động" cho chip đủ chỗ.

Chip rộng 26 px + 6,4 px mỗi ký tự của chuỗi "{bản số} {nhãn} · {số}". Với số tới 5 chữ số, mọi chip ở bảng trên cách thẻ gần nhất ít nhất 8 px và không chồng chip khác. Quy tắc kiểm được: **khoảng cách ngắn nhất giữa khung chip và khung thẻ ≥ 8 px, hai chip không chồng nhau**. Số dài hơn làm vi phạm quy tắc này thì FE trượt tâm chip dọc theo đường của nó cho tới khi đạt; không được thì rút số thành dạng "12,3 nghìn".

### 3.2 Dữ liệu sống

Mở trang, FE gửi **một** yêu cầu `POST /api/v1/associations/stats` (F03-S1 §4.8):

- `collections`: bảy collection ở bảng đối tượng; riêng `NhanVien` kèm `where: { "is_sales": { "eq": true } }`.
- `associations`: mười hai kênh ở bảng quan hệ và hai kênh dòng con R9, R14.

Phản hồi cho FE:

| Hiển thị | Lấy từ |
|---|---|
| "{n} bản ghi" trên thẻ | `collections[slug].records` |
| "{m} thuộc tính" trên thẻ | `collections[slug].fieldCount` |
| Bản số trên chip | `cardinality` của kênh (1:N hoặc N:N); máy chủ không trả thì theo cột Bản số ở §3.1 |
| Số trên chip, cột "Liên kết hiện có" | `count` của kênh |
| "Lưu ở đâu" | `storage` (§7) |
| "Khi xoá" | `onDelete` + ghi chú ở bảng trên (§7) |
| "Số liệu tính lúc {HH:mm}" | `computedAt` |

Danh sách thuộc tính trong panel đối tượng (§6) lấy riêng bằng `GET /api/v1/collections/:slug/schema` của F03 khi mở panel lần đầu, rồi giữ trong phiên.

Mọi số đếm theo quyền người xem (F03-S1 §4.8): hai người khác quyền có thể thấy số khác nhau. Máy chủ lưu đệm 5 phút; trang hiện chữ nhỏ "Số liệu tính lúc {HH:mm}" dưới sơ đồ để người xem biết số không tức thời.

### 3.3 Khi cấu hình và hệ thống chưa khớp

Trang có thể được mở khi BE mới dựng xong một phần (ví dụ chưa có bảng nối hoạt động). Không chặn cả trang:

| Phản hồi | Hiển thị |
|---|---|
| Collection `exists = false` | Thẻ nền `--surface-2`, viền đứt, dòng phụ "Chưa tạo trên hệ thống"; các đường nối tới thẻ đó cũng ở dạng dưới |
| Kênh `exists = false` | Đường nét chấm màu `--outline`, chip "Chưa có trên hệ thống"; panel quan hệ ghi "Quan hệ này chưa được tạo trên hệ thống." và chỉ hiện phần Màn hình dùng |
| `cardinality` khác bản số trong cấu hình | Hiện theo máy chủ. Đây là dấu hiệu cấu hình FE lỗi thời; FE ghi cảnh báo vào log lỗi phía trình duyệt |

---

## 4. Lưu đồ (QH-02)

### 4.1 Đầu trang

- Tiêu đề "Sơ đồ quan hệ dữ liệu" · tag "Sale · Company · Contact · Deal" · bên phải nút "Tải SVG" (§9).
- Đoạn mô tả, tối đa 900 px: "Mỗi thẻ là một đối tượng CRM. Đường tím là quan hệ với nhân viên (owner, người thực hiện), đường liền là liên kết giữa hai đối tượng, đường đứt là hoạt động gắn vào bản ghi. Rê chuột hoặc dùng phím Tab để làm nổi các liên kết của một thẻ; bấm thẻ hoặc nhãn để xem chi tiết."
- Chú thích: mẫu đường tím "Nhân viên (owner, người thực hiện)" · mẫu đường liền "Liên kết" · mẫu đường đứt "Hoạt động gắn bản ghi" · "**1:N** một – nhiều" · "**N:N** nhiều – nhiều".

### 4.2 Khung vẽ

- SVG `viewBox 0 0 1120 740`, rộng 100% khung, tối thiểu 760 px; hẹp hơn thì khung cuộn ngang. Nền chấm lưới theo DS §6.18.
- **Thẻ đối tượng**: dải màu trên cùng và vòng tròn biểu tượng theo màu của đối tượng · tên (15/700) · dòng phụ "{n} bản ghi · {m} thuộc tính". Số có dấu chấm ngăn nghìn ("1.248").
- **Đường nối**: ba kiểu ở cột "Kiểu đường" (§3.1), style ở DS §6.18.
- **Chip trên đường**: "{bản số} {nhãn} · {số}", ví dụ "N:N có vai trò · 2.310". Bản số đậm màu `--primary`. Rê chuột lên chip hiện tooltip "{Tên quan hệ} · {bản số} · {số} liên kết".
- Dưới khung: chữ nhỏ "Số liệu tính lúc {HH:mm}".

### 4.3 Trạng thái tải

| Trạng thái | Hiển thị |
|---|---|
| Đang tải | Thẻ và đường vẽ ngay từ cấu hình; chỗ số hiện "…" |
| Lỗi tải số liệu | Sơ đồ vẫn hiện, số là "—"; dải cảnh báo trên khung "Không tải được số liệu." + nút "Thử lại" |
| Quá giới hạn yêu cầu (`400 ASSOCIATION_STATS_INVALID`) | Không xảy ra với cấu hình này (7 collection, 14 kênh); nếu gặp thì xử lý như lỗi tải |

### 4.4 Đối tượng hoặc quan hệ người xem không đọc được

- Thẻ có `readable = false`: dòng phụ "Không có quyền xem số liệu", số không hiện. Thẻ vẫn bấm được; panel hiện mô tả, các liên kết (không số) và câu "Bạn chưa có quyền xem {tên đối tượng}."
- Kênh có `readable = false` nhưng vẫn có thông tin cấu trúc (người xem đọc được một phía): chip bỏ phần số ("N:N hoạt động"). Panel quan hệ vẫn hiện Lưu ở đâu, Khi xoá; mục "Hiện có" ghi "Bạn chưa có quyền xem đủ hai phía của quan hệ này."
- Kênh chỉ trả `{ "readable": false }` (người xem không đọc được phía nào): chip dùng bản số trong cấu hình, không có số; panel hiện tên quan hệ, Màn hình dùng và câu "Bạn chưa có quyền xem hai đối tượng của quan hệ này." thay cho Lưu ở đâu, Khi xoá, Hiện có.
- Thẻ chỉ nhận `{ "readable": false }` không bao giờ hiện dạng "Chưa tạo trên hệ thống" (§3.3), vì máy chủ không cho biết collection có tồn tại hay không.

---

## 5. Làm nổi liên kết (QH-03)

| Thao tác | Kết quả |
|---|---|
| Rê chuột hoặc focus bàn phím vào một thẻ | Các đường có một đầu là thẻ đó và các thẻ ở đầu kia giữ nguyên độ đậm, đường dày lên 2.6 px; mọi thứ khác mờ xuống 18% |
| Rê chuột hoặc focus vào một chip | Chỉ đường đó và hai thẻ hai đầu được làm nổi |
| Chuột rời khung, focus rời sơ đồ | Bỏ làm nổi |
| Đang mở panel đối tượng | Thẻ đó viền `--primary` 2 px và các liên kết của nó giữ trạng thái làm nổi tới khi đóng panel. Rê chuột sang thẻ khác thì tạm làm nổi thẻ kia, rời chuột thì về thẻ đang chọn |
| Đang mở panel quan hệ | Đường đó và hai thẻ giữ trạng thái làm nổi |
| Màn cảm ứng | Không có rê chuột; chạm vào thẻ hoặc chip mở panel luôn, trạng thái làm nổi theo panel như hai dòng trên |

- Thứ tự Tab: bảy thẻ theo thứ tự bảng đối tượng, rồi các chip theo thứ tự bảng quan hệ. Enter hoặc Space mở panel. Esc đóng panel và trả focus về thẻ hoặc chip đã mở nó.
- Người dùng bật giảm chuyển động (`prefers-reduced-motion`): đổi trạng thái tức thì, không chuyển tiếp.

---

## 6. Panel chi tiết đối tượng (QH-04)

Bấm thẻ mở Drawer phải (DS-HUBSPOT §6.10):

- Từ 1240 px: chế độ **dock**, rộng 400 px, không scrim, khung vẽ co lại bên trái. Người xem vẫn rê chuột, bấm các thẻ khác; bấm thẻ khác thì thay nội dung panel, không đóng mở lại.
- Dưới 1240 px: panel phủ rộng 460 px có scrim (dưới 600 px chiếm toàn màn). Bấm scrim thì đóng. Muốn xem đối tượng khác thì dùng mục Liên kết trong panel.

Panel quan hệ (§7) dùng cùng hai chế độ này.

- **Header**: vòng tròn biểu tượng · tên đối tượng · nút ✕.
- **Mô tả** theo bảng ở §3.1. Dưới mô tả chữ nhỏ "Collection: `{slug}`" (cho quản trị và BE tra cứu).
- **Liên kết ({k})**: một dòng cho mỗi đường nối tới thẻ này, theo thứ tự bảng quan hệ. Mỗi dòng: biểu tượng của đối tượng bên kia · tên đối tượng bên kia (nút, bấm thì chuyển panel sang đối tượng đó) · pill bản số · tên quan hệ · số liên kết (canh phải). Bấm vào phần còn lại của dòng mở panel quan hệ (§7).
- **Dòng con** (chỉ Deal và Hoạt động), một dòng chữ không có nút, phần cuối là câu Khi xoá dựng từ `onDelete` của R9, R14 như §7:
  - Deal: "Điều chỉnh cấp Deal (chiết khấu, phí, thuế) · `crm_deal_adjustments` · {số} dòng." + câu Khi xoá.
  - Hoạt động: "Bình luận · `crm_activity_comments` · {số} bình luận." + câu Khi xoá.
- **Thuộc tính ({m})**: mỗi trường một tag ghi **tên hiển thị** của trường, theo thứ tự hiển thị của collection. Trường có `origin = custom` (F03-S4 §3.1) có thêm nhãn "Mới", theo sheet QH-04 và TB-04 (trang Quản lý trường của F03-S4 gọi cùng loại này là "Tuỳ chỉnh"; hai chữ chỉ cùng một cờ). Rê chuột lên tag hiện "{key} · {kiểu trường}" và mô tả trường nếu có. `m` ở tiêu đề là số trường trong danh sách vừa tải, cùng quy tắc với `fieldCount` (F03-S1 §4.8); nếu vừa có người thêm trường làm hai số lệch thì panel theo danh sách. Hơn 40 trường thì hiện 40 tag đầu và nút "Xem tất cả {m}" mở rộng ngay trong panel. Đang tải: 6 tag skeleton. Lỗi: "Không tải được danh sách thuộc tính." + "Thử lại".
- **Cuối panel**:
  - Nút chính theo cột "Nút ở panel" (§3.1), mở trong tab hiện tại.
  - Người có quyền sửa cấu trúc collection thấy thêm nút phụ "Quản lý trường" mở trang Quản lý trường của collection đó (F03-S4).

---

## 7. Panel chi tiết quan hệ (QH-05)

Bấm chip trên sơ đồ, dòng trong bảng quan hệ (§8.2) hoặc dòng liên kết trong panel đối tượng.

- **Header**: "{A} → {B}" với quan hệ 1:N, "{A} ↔ {B}" với quan hệ N:N · nút ✕. Dòng dưới: mã R · pill bản số · tên quan hệ, ví dụ "R6 · N:N · Contact của deal (có vai trò)".
- **Lưu ở đâu**, dựng từ `storage`:
  - Kênh `ref`: "Trường `{storage.field}` ({storage.fieldName}, Liên kết → `{from}`) trên `{storage.collection}`." Ví dụ: "Trường `owner_id` (Contact owner, Liên kết → `NhanVien`) trên `crm_contacts`."
  - Kênh `junction`: "Bảng nối `{junction}` (`{left}` ↔ `{right}`)." Thêm "Nhãn: trường `{labelField}`." khi có `labelField`. Khi có `primaryField`, thêm "Mỗi {X} có tối đa một dòng Primary (`{primaryField}`).", trong đó X là tên thẻ của collection ở phía `primaryScope` (`leftCollection` hoặc `rightCollection`), ví dụ "Mỗi Contact có tối đa một dòng Primary (`is_primary`)."
- **Màn hình dùng**: chữ ở bảng §3.1.
- **Khi xoá**, câu theo `onDelete`, rồi thêm ghi chú ở bảng §3.1 nếu có:

| `onDelete` | Câu |
|---|---|
| `restrict` | "Không xoá được {A} khi còn {B} trỏ tới." |
| `cascade` (kênh `ref`) | "Xoá {A} thì các {B} của nó vào thùng rác theo; khôi phục {A} thì chúng trở lại." |
| `keep` | "Xoá {A} thì {B} giữ nguyên; ô liên kết hiện “(Đã xoá)” kèm tên {A} đã xoá, khôi phục {A} thì liên kết trở lại." |
| `cascade` (kênh `junction`) | "Xoá một bên thì dòng nối vào thùng rác theo, bản ghi bên kia giữ nguyên. Dòng nối được khôi phục khi cả hai bên đều đang hoạt động." |

- **Hiện có**: "{số} liên kết." theo quyền người xem (§4.4 khi không đủ quyền).
- **Cuối panel**: hai nút phụ "{A}" và "{B}" mở panel của từng đối tượng.

---

## 8. Luồng bán hàng và bảng quan hệ (QH-06)

### 8.1 Luồng bán hàng 4 bước

Bốn ô dưới sơ đồ: một hàng 4 cột từ 900 px, một cột dưới 900 px. Mỗi ô: số thứ tự tròn · tiêu đề · đoạn mô tả · dòng nhỏ "Quan hệ: R…".

| # | Tiêu đề | Mô tả | Quan hệ |
|---|---|---|---|
| 1 | Nhận khách | Tạo contact, chọn Contact owner trong đội kinh doanh, gắn công ty (công ty đầu tiên là công ty chính). Company có owner riêng. | R1, R2, R4 |
| 2 | Mở cơ hội | Tạo deal từ card Deals của contact hoặc công ty: deal điền sẵn công ty và contact, Sale phụ trách mặc định là owner của contact hoặc công ty. Vai trò của contact trong deal do sale chọn. | R3, R5, R6 |
| 3 | Chăm sóc và báo giá | Ghi chú, cuộc gọi, cuộc họp, task gắn được cùng lúc vào contact, công ty, deal (hệ thống gợi ý sẵn, người tạo bỏ chọn được) nên hiện trên timeline của cả ba. Task có người thực hiện. Thêm line item từ thư viện sản phẩm hoặc dòng tuỳ chỉnh. | R10, R11, R12, R13, R7, R8 |
| 4 | Chốt và đo lường | Sale chuyển deal sang Closed Won hoặc Closed Lost, máy chủ ghi ngày đóng. Doanh số thắng và % chỉ tiêu trên trang Sales, Báo cáo tính theo Sale phụ trách và ngày đóng; pipeline đang mở tính theo Sale phụ trách của các deal chưa đóng. Lifecycle stage của contact và công ty do người dùng tự đổi. | R3 |

### 8.2 Bảng quan hệ

Tiêu đề "Chi tiết các quan hệ". Bảng theo DataTable (DS-HUBSPOT §6.6), 12 dòng theo thứ tự bảng quan hệ ở §3.1, không phân trang:

| Cột | Nội dung |
|---|---|
| Quan hệ | "{A} → {B}" (1:N) hoặc "{A} ↔ {B}" (N:N) đậm, dòng dưới tên quan hệ và mã R |
| Loại | Nhân viên · Liên kết · Hoạt động (để không chỉ dựa vào màu đường) |
| Bản số | Pill 1:N / N:N |
| Lưu ở đâu | Như §7, dạng rút gọn: `crm_contacts.owner_id` hoặc bảng nối `crm_deal_contacts` |
| Màn hình dùng | Chữ ở §3.1 |
| Khi xoá | Câu ở §7, không kèm ghi chú |
| Liên kết hiện có | Số, canh phải; "—" khi không có quyền hoặc lỗi |

- Bấm một dòng mở panel quan hệ.
- Hẹp hơn 880 px thì bảng cuộn ngang.

---

## 9. Tải sơ đồ SVG (QH-07)

- Nút "Tải SVG" ở đầu trang. FE dựng một tệp SVG độc lập từ sơ đồ đang hiện, không gọi máy chủ.
- Tệp gồm:
  - Dòng tiêu đề "Sơ đồ quan hệ dữ liệu CRM · {dd/mm/yyyy HH:mm}" ở đầu và chú thích ở cuối; tệp có `viewBox 0 -48 1120 836` (thêm 48 px phía trên cho tiêu đề, 48 px phía dưới cho chú thích).
  - Thẻ, đường, chip với số liệu đang hiện; không có trạng thái làm nổi.
  - Màu của bản sáng, kể cả khi người dùng đang ở chế độ tối, để in và dán vào tài liệu.
  - Style viết thẳng vào tệp. Biểu tượng nhúng dạng `path` SVG, không dựa vào font Material Symbols: prototype xuất tên biểu tượng dạng chữ ("person", "badge") khi máy mở tệp không có font đó.
  - Phông chữ khai báo `Be Vietnam Pro, Inter, Arial, sans-serif` để máy không có phông vẫn đọc được tiếng Việt.
- Tên tệp `so-do-quan-he-crm-{dd-mm-yyyy}.svg`. Xong hiện toast "Đã tải sơ đồ (SVG)".
- Số liệu đang là "…" (chưa tải xong): nút vô hiệu, tooltip "Đang tải số liệu".

---

## 10. Màn hẹp và trợ năng

- Dưới 760 px: khung vẽ cuộn ngang, đầu trang và bảng giữ nguyên bề rộng màn. Panel chiếm toàn màn như Drawer ở màn hẹp (DS-HUBSPOT §6.10).
- SVG có `role="group"` và nhãn "Sơ đồ quan hệ giữa Sale, Company, Contact, Deal, Hoạt động, Line item và Sản phẩm". Mỗi thẻ là `role="button"`, nhãn "{tên}: {n} bản ghi, {k} liên kết"; đang tải thì "{tên}: đang tải số liệu"; không có quyền thì "{tên}: không có quyền xem số liệu". Mỗi chip là `role="button"`, nhãn "{A} – {B}: {tên quan hệ}, {bản số}, {số} liên kết" (bỏ phần số khi đang tải hoặc không có quyền).
- Focus bàn phím: thẻ viền 2 px `--primary` như hover; chip có vòng focus 2 px `--primary` cách khung chip 2 px.
- Bảng quan hệ (§8.2) là phần thay thế bằng chữ cho toàn bộ sơ đồ; trình đọc màn hình đọc được đủ thông tin mà không cần SVG.
- Ba kiểu đường khác nhau không chỉ ở màu: đường nhân viên có nhãn chip "owner", "phụ trách", "Người thực hiện"; đường hoạt động là nét đứt; bảng có cột Loại.

---

## 11. Quyền

| Hành động | Điều kiện |
|---|---|
| Thấy menu, mở trang | Đọc được ít nhất một trong bảy collection |
| Thấy số bản ghi, số thuộc tính của một thẻ | Đọc được collection đó (hoặc sở hữu bản ghi trong đó; số chỉ tính các bản ghi đó) |
| Thấy số liên kết của một quan hệ | Đọc được cả hai phía (F03-S1 §4.8) |
| Thấy cách lưu, hành vi khi xoá của một quan hệ | Đọc được ít nhất một phía (F03-S1 §4.8) |
| Nút "Mở …" ở panel | Như quyền của trang đích |
| Nút "Quản lý trường" | Quyền sửa cấu trúc collection |
| Tải SVG | Mọi người mở được trang |

---

## 12. Tiêu chí nghiệm thu

**AC-QH01-1 — Menu**
Given người dùng đọc được `crm_contacts`
When mở CRM
Then sidebar có "Sơ đồ quan hệ" ngay sau "Sales" và trước vạch ngăn; bấm mở `/crm/schema`.

**AC-QH01-2 — Không có quyền nào**
Given người dùng không đọc được collection nào trong bảy collection ở §3.1
When mở CRM
Then không có mục "Sơ đồ quan hệ"; mở thẳng `/crm/schema` thì thấy trang báo không có quyền của ERP.

**AC-QH02-1 — Đủ thẻ và đường**
Given hệ thống đã có đủ collection và bảng nối của CRM-00
When mở sơ đồ
Then có 7 thẻ và 12 đường; đường R1, R2, R3, R13 màu tím; R10, R11, R12 nét đứt; chip R6 ghi "N:N có vai trò · {số}".

**AC-QH02-2 — Số liệu đúng định nghĩa**
Given có 15 nhân viên trong đó 12 người `is_sales = true`, và `crm_deal_contacts` có 3 dòng, 1 dòng trong đó đã vào thùng rác theo khi deal của nó bị xoá
When mở sơ đồ với tài khoản đọc được toàn bộ dữ liệu
Then thẻ Sale ghi "12 bản ghi"; chip R6 ghi "· 2".

**AC-QH02-3 — Kênh chưa có trên hệ thống**
Given BE chưa tạo bảng nối `crm_activity_deals`
When mở sơ đồ
Then đường R12 nét chấm xám, chip "Chưa có trên hệ thống"; các đường khác vẫn có số; trang không báo lỗi.

**AC-QH02-4 — Lỗi tải số liệu**
Given API thống kê trả lỗi 500
When mở sơ đồ
Then thẻ và đường vẫn vẽ, mọi số là "—", có dải "Không tải được số liệu." với nút "Thử lại"; bấm "Thử lại" khi API đã ổn thì số hiện đủ.

**AC-QH03-1 — Làm nổi bằng chuột và bàn phím**
Given sơ đồ đã tải
When rê chuột lên thẻ Deal
Then các đường R3, R5, R6, R7, R12 và các thẻ Sale, Company, Contact, Line item, Hoạt động rõ; thẻ Sản phẩm và các đường còn lại mờ. Dùng Tab tới thẻ Deal cho kết quả giống hệt.

**AC-QH04-1 — Panel đối tượng**
Given collection `crm_companies` có trường "Mã số thuế" (key `cf_ma_so_thue`, `origin = custom`)
When bấm thẻ Company
Then panel có mô tả, chữ "Collection: `crm_companies`", mục "Liên kết (4)" gồm Sale (R2), Contact (R4), Deal (R5), Hoạt động (R11); tag "Mã số thuế" có nhãn "Mới", rê chuột hiện "cf_ma_so_thue · Văn bản"; nút "Mở Companies".

**AC-QH04-2 — Chuyển panel giữa hai đối tượng**
Given panel Contact đang mở
When bấm "Company" trong mục Liên kết
Then panel đổi sang Company, URL đổi thành `?node=company`; bấm Back thì về panel Contact.

**AC-QH05-1 — Panel quan hệ dựng từ máy chủ**
Given trường `owner_id` của `crm_contacts` có `onDelete = restrict`
When bấm chip của R1
Then panel ghi "Trường `owner_id` (Contact owner, Liên kết → `NhanVien`) trên `crm_contacts`.", phần Khi xoá ghi "Không xoá được Sale khi còn Contact trỏ tới." kèm ghi chú "Nhân viên nghỉ việc thì đánh dấu Đã nghỉ…".

**AC-QH05-2 — Không đủ quyền hai phía**
Given Lan đọc được Deals nhưng không đọc được `crm_activities`
When bấm chip R12
Then chip không có số; panel vẫn có Lưu ở đâu và Khi xoá; mục Hiện có ghi "Bạn chưa có quyền xem đủ hai phía của quan hệ này."

**AC-QH06-1 — Luồng và bảng**
Given sơ đồ đã tải
When cuộn xuống dưới sơ đồ
Then có 4 ô luồng với nội dung ở §8.1 (không có câu nào nói tự gán vai trò hay tự đổi Lifecycle stage) và bảng 12 dòng theo thứ tự R1, R2, R3, R13, R4, R5, R6, R7, R8, R10, R11, R12; bấm dòng R4 mở panel quan hệ R4.

**AC-QH07-1 — Tải SVG**
Given đang ở chế độ tối, sơ đồ đã có số liệu
When bấm "Tải SVG" ngày 01/10/2026
Then tải tệp `so-do-quan-he-crm-01-10-2026.svg`; mở bằng trình duyệt khác trên máy không có font Material Symbols vẫn thấy biểu tượng dạng hình (không phải chữ "person"), nền sáng, có tiêu đề kèm thời điểm.

---

## 13. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-CRM10-01 | E2E | Mở `/crm/schema?node=deal` | Panel Deal mở sẵn, thẻ Deal viền `--primary`, các liên kết của Deal được làm nổi |
| TC-CRM10-02 | E2E | Mở `/crm/schema?edge=R6` | Panel quan hệ R6 mở sẵn |
| TC-CRM10-03 | E2E | Mở `/crm/schema?node=abc` | Bỏ qua tham số, không mở panel, không lỗi |
| TC-CRM10-04 | E2E | Mở trang, đếm yêu cầu mạng | Đúng một `POST /associations/stats`; không gọi schema cho tới khi mở panel |
| TC-CRM10-05 | E2E | Mở panel Contact hai lần | Gọi schema `crm_contacts` một lần |
| TC-CRM10-06 | E2E | Collection có 55 trường | Panel hiện 40 tag và "Xem tất cả 55" |
| TC-CRM10-07 | E2E | Panel Deal | Có dòng con "Điều chỉnh cấp Deal…" với số dòng |
| TC-CRM10-08 | E2E | Collection `crm_line_items` `exists = false` | Thẻ Line item viền đứt "Chưa tạo trên hệ thống"; R7, R8 nét chấm |
| TC-CRM10-09 | E2E | API trả `cardinality = 1:N` cho R6 | Chip hiện 1:N theo máy chủ; log cảnh báo phía trình duyệt |
| TC-CRM10-10 | Quyền | Người không đọc được `NhanVien` | Thẻ Sale "Không có quyền xem số liệu"; chip R1, R2, R3, R13 không có số |
| TC-CRM10-11 | Quyền | Người không có quyền đọc `crm_contacts`, là chủ sở hữu hệ thống của 5 contact | Thấy menu; thẻ Contact "5 bản ghi" |
| TC-CRM10-19 | E2E | Mở panel Contact, bấm Company trong mục Liên kết, bấm Back hai lần | Lần 1 về panel Contact, lần 2 đóng panel |
| TC-CRM10-20 | E2E | Mở `/crm/schema?edge=R9` | Không mở panel, không lỗi |
| TC-CRM10-21 | E2E | Màn 1100 px, bấm thẻ Deal | Panel phủ có scrim; bấm scrim thì đóng |
| TC-CRM10-22 | Hình học | Chạy kiểm tự động trên cấu hình với mọi số 5 chữ số | Mọi chip cách thẻ ≥ 8 px, không chip nào chồng chip khác |
| TC-CRM10-12 | Quyền | Người không có quyền sửa cấu trúc | Không có nút "Quản lý trường" |
| TC-CRM10-13 | A11y | Đi hết sơ đồ chỉ bằng Tab | Thứ tự 7 thẻ rồi 12 chip; Enter mở panel; Esc đóng và trả focus đúng chỗ |
| TC-CRM10-14 | A11y | Bật giảm chuyển động | Làm nổi tức thì |
| TC-CRM10-15 | E2E | Màn 390 px | Khung vẽ cuộn ngang; panel toàn màn; luồng 1 cột; bảng cuộn ngang |
| TC-CRM10-16 | E2E | Tải SVG khi số liệu đang tải | Nút vô hiệu, tooltip "Đang tải số liệu" |
| TC-CRM10-17 | E2E | Mở tệp SVG đã tải bằng trình sửa ảnh vector | Đủ 7 thẻ, 12 đường, chữ tiếng Việt có dấu đúng |
| TC-CRM10-18 | Hiệu năng | Mở trang khi bộ nhớ đệm máy chủ trống, dữ liệu ở F03-S1 §8 | API < 1,5 giây (F03-S1 §4.8); số liệu hiện xong trên màn < 2 giây |

---

## 14. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Số bản ghi, số liên kết đếm trên dữ liệu mẫu trong trình duyệt | API F03-S1 §4.8, theo quyền người xem, đệm 5 phút |
| Contact – Company là `company_id` một giá trị (1:N) | Bảng nối có Primary, N:N (QĐ-03) |
| Owner nối theo tên sale | Trường Liên kết `owner_id` tới NhanVien (QĐ-01) |
| Một bảng `activity_links` chung | Ba bảng nối `crm_activity_contacts`, `_companies`, `_deals` |
| 11 quan hệ, không có Nhân viên → Hoạt động | 12 quan hệ, thêm R13 |
| "Lưu ở đâu" là chữ gợi ý viết tay | Dựng từ metadata máy chủ (§7) |
| Collection hoạt động tên `Sales_Activities` | `crm_activities` (CRM-00 §5.10) |
| Luồng bước 2 tự gán "Người quyết định", bước 4 tự đổi Customer | Bỏ hai câu này (§8.1) |
| Nút "Sales" ở đầu trang | Bỏ; đã có trên sidebar |
| Màu đối tượng mã cứng, vài màu không đủ tương phản với biểu tượng trắng | Token `--obj-*` (DS §6.18) |
| Tải SVG gán màu sáng bằng biến CSS chép từ trang, biểu tượng là chữ dùng font Material Symbols (thiếu font thì hiện chữ "person"), tên tệp không có ngày | Biểu tượng dạng `path`, màu bản sáng viết thẳng vào tệp, có tiêu đề và chú thích, tên tệp có ngày (§9) |
| Không có tham số URL | `?node=`, `?edge=` (§2) |

---

## 15. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | Sheet QH-01 có "thẻ trên trang chủ". ERP chưa có trang chủ CRM; có cần thêm lối tắt ở Trang chủ ERP (F11) không, hay chỉ sidebar là đủ? | PO | §2 |
| Q2 | Trang này mở cho mọi người dùng CRM hay chỉ quản trị và BA? Spec đang cho mọi người đọc được ít nhất một collection CRM | PO / khách | §2, §11 |
| Q3 | Thẻ Sale đếm mọi nhân viên `is_sales`, kể cả đã nghỉ. Có muốn chỉ đếm người đang làm việc không? | Khách | §3.1 |

---

## Liên kết

- Plan: `00-PLAN-viet-spec.md`
- Spec nền: `ERPMini/features/features/F03-S1-lien-ket-ban-ghi.md` §3.1, §3.4, §4.8 · `F03-S4-truong-tuy-chinh-cau-hinh-hien-thi.md` §3.1
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` §4, §5.13, §6.1
- Màn liên quan: `CRM-04-deals.md` §5.3 · `CRM-06-line-items-san-pham.md` · `CRM-08-sales.md`
- Design system: `../DESIGN-SYSTEM-HUBSPOT.md` §5, §6.6, §6.10, §6.18, §7.4
- Đối chiếu: `../DOI-CHIEU-CHUC-NANG.md` §17

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-10-01 | v1.0 — bản đầu | TTS (qua Claude) |

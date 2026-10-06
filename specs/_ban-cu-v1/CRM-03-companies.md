# CRM-03 — Companies

> **Trạng thái:** 💡 Proposed · v1.1 · 01/10/2026 · chờ review
> **Tính năng sở hữu (10):** CO-01 → CO-10
> **Phụ thuộc:** `CRM-00` §5.1, §5.3, §5.4 (dữ liệu) · `CRM-01` (khung) · `CRM-02` (panel tạo Contact, tab Tổng quan) · `CRM-04` §5 (panel tạo Deal) · `F03-S1` · `F03-S2` · `F03-S3` · `F03-S6`
> **Prototype:** `crm-companies-hubspot.html` (danh sách) · `crm-record-hubspot.html?type=company&id=co13` (trang chi tiết)
> **Nguồn HubSpot:** portal 247428660, màn Companies, khảo sát 29/09/2026 (`DOI-CHIEU-CHUC-NANG.md` §12)

---

## 1. Phạm vi

Companies dùng cùng khung với Contacts (`CRM-01`). File này ghi cấu hình và phần khác so với Contacts (`CRM-02`). Chỗ nào ghi "như CRM-02 §x" thì hành vi giống hệt, chỉ thay tên đối tượng.

| ID | Tính năng | Ưu tiên | Phạm vi sheet | Mục |
|---|---|---|---|---|
| CO-01 | Danh sách Companies | P0 | Chỉ FE | §3.1, §3.2 |
| CO-02 | Bộ lọc nhanh | P0 | Chỉ FE | §3.3 |
| CO-03 | Cột bảng | P0 | Chỉ FE | §3.4 |
| CO-04 | Trường mới cho Company | P0 | FE + BE | §3.5 |
| CO-05 | Mở rộng dòng và Board | P1 | Chỉ FE | §3.6 |
| CO-06 | Thẻ định danh | P0 | Chỉ FE | §5.1 |
| CO-07 | Thông tin chính | P0 | Chỉ FE | §5.2 |
| CO-08 | Tab Tổng quan | P2 | FE + BE | §5.3 |
| CO-09 | Card Contacts | P0 | Chỉ FE | §5.4 |
| CO-10 | Card Deals và Tệp đính kèm | P1 | Chỉ FE | §5.5 |

---

## 2. Cấu hình đối tượng

| Thuộc tính | Giá trị |
|---|---|
| `collection` | `crm_companies` |
| `label` | Company / Companies |
| `icon` | `domain` |
| `displayField` | `name` |
| `avatar` | `logo`: ô vuông bo góc chứa chữ cái đầu của tên. Không tải logo từ internet trong giai đoạn này |
| `views` | `all` "Tất cả companies" · `mine` "Companies của tôi" (không có view "chưa có owner", theo sheet CO-01) |
| `searchFields` | `name`, `domain`, `phone` |
| `quickFilters` | `owner_id` · `_createdAt` (Ngày tạo) · `last_activity_at` · `lead_status` |
| `quickFiltersMore` | `industry` · `lifecycle_stage` · `city` · `country` · trường tự tạo |
| `columns` | `owner_id` · `_createdAt` · `phone` · `last_activity_at` · `city` · `country` · `industry` |
| `columnsMore` | `domain` · `lifecycle_stage` · `lead_status` · `employees` · Số contact · Số deal · trường tự tạo |
| `columnOrder` | `view` |
| `defaultSort` | `_createdAt`, giảm dần |
| `expand` | `jn:crm_contact_companies` "Contacts" · `ref:deals_pipeline.company_id` "Deals" |
| `board` | cột theo `lifecycle_stage`; thẻ ở §3.6 |
| `defaultMode` | `table` |
| `createFields` | §4 |
| `createAssociations` | `jn:crm_contact_companies` (Contact) · `ref:deals_pipeline.company_id` (Deal) |
| `identity.subtitle` | `domain` (§5.1) |
| `keyProps` | "Thông tin chính": §5.2 |
| `rightCards` | `jn:crm_contact_companies` · `ref:deals_pipeline.company_id`. Card Tệp đính kèm luôn nằm cuối, do `attachmentField` bật |
| `overviewTab` | `true` |
| `actions` | như Contacts (CRM-02 §2) |
| `attachmentField` | `attachments` |

`_createdAt` là trường hệ thống Ngày tạo của F03. `last_activity_at` và `last_contacted_at` cần F03-S2 (đợt 3); khi chưa có, bộ lọc nhanh và cột "Ngày hoạt động gần nhất" ẩn, dòng "Liên hệ gần nhất" trong card Thông tin chính không hiện.

Cột ảo: **Số contact** (total của kênh `jn:crm_contact_companies`) và **Số deal** (total của kênh `ref:deals_pipeline.company_id`), lấy bằng F03-S1 §4.3, không sắp xếp, không lọc.

---

## 3. Danh sách

### 3.1 Header

Như CRM-02 §3.1 với "Companies ⌄", "Thêm companies ▾". Menu ⋮ có "Chỉnh sửa thuộc tính" mở Quản lý trường của `crm_companies`.

### 3.2 Tab view (CO-01)

"Tất cả companies" · "Companies của tôi" · view người dùng tạo · "+". Điều kiện lọc theo CRM-01 §4.3.

### 3.3 Bộ lọc nhanh (CO-02)

- Mặc định bốn nút: Company owner · Ngày tạo · Ngày hoạt động gần nhất · Lead status.
- ⊕ thêm được: Ngành · Lifecycle stage · Thành phố · Quốc gia/Khu vực · trường tự tạo.
- "Quốc gia/Khu vực" và "Thành phố" là trường Văn bản nên popover có ô nhập và chọn "Chứa" / "Bằng" (CRM-01 §4.5). Lọc theo danh sách giá trị có sẵn (checkbox) chưa làm, vì hai trường này không có danh mục cố định.

### 3.4 Cột bảng (CO-03)

Cột chính: ô vuông chữ cái + `name` dạng link + nút mở rộng + nút "Xem trước".

| Cột | Hiển thị |
|---|---|
| Company owner | Như Contact owner ở CRM-02 §3.3 |
| Ngày tạo | `dd/mm/yyyy HH:mm` |
| Số điện thoại | Chữ thường |
| Ngày hoạt động gần nhất | `dd/mm/yyyy HH:mm` |
| Thành phố | Chữ thường |
| Quốc gia/Khu vực | Chữ thường |
| Ngành | Pill màu |

Ô trống hiện "--".

### 3.5 Hai trường mới (CO-04)

Thêm `country` (Quốc gia/Khu vực, Văn bản) và `lead_status` (Lead status, Lựa chọn đơn, danh mục D-LEADSTATUS) vào `crm_companies`. Định nghĩa ở CRM-00 §5.1. Vì `crm_companies` là collection mới, hai trường được tạo cùng lúc với collection bằng script khởi tạo, không phải sửa collection đang chạy.

`country` mặc định "Việt Nam" khi tạo từ giao diện (§4). Tạo bằng API hoặc nhập file không có mặc định.

### 3.6 Mở rộng dòng và Board (CO-05)

Bảng con khi mở rộng dòng:

| Kênh | Cột của bảng con |
|---|---|
| Contacts | Tên (link) · Email · Chức danh · tag "Công ty chính" nếu công ty này là Primary của contact |
| Deals | Mã Deal (link) + Tên Deal nhạt · Giai đoạn (pill) · Amount · Ngày dự kiến chốt |

Board theo Lifecycle stage, 7 cột như Contacts. Thẻ công ty:

- Tên dạng link.
- Domain (biểu tượng địa cầu), nếu có.
- "{n} contact · {m} deal" (biểu tượng người).
- Owner, hoặc "Chưa có owner".
- Chân thẻ: nút "Xem trước".

Kéo thẻ đổi `lifecycle_stage`, BE ghi sự kiện (F03-S3, `lifecycle_stage` có trong `timelineFields` của Companies).

Số contact và số deal trên thẻ lấy bằng F03-S1 §4.3 cho các thẻ đang hiện, không gọi từng thẻ.

---

## 4. Panel Tạo company

| # | Trường | Key | Kiểu ô | Mặc định | Ràng buộc |
|---|---|---|---|---|---|
| 1 | Domain | `domain` | Ô nhập | — | Chuẩn hoá trước khi lưu (CRM-00 §5.1); không trùng công ty khác (409) |
| 2 | Tên công ty | `name` | Ô nhập | — | Bắt buộc, xem ghi chú |
| 3 | Company owner | `owner_id` | Chọn nhân viên | Nhân viên gắn với tài khoản đang đăng nhập | Chỉ nhân viên đang làm việc |
| 4 | Ngành | `industry` | Chọn | — | |
| 5 | Thành phố | `city` | Ô nhập | — | |
| 6 | Quốc gia/Khu vực | `country` | Ô nhập | Việt Nam | |
| 7 | Số điện thoại | `phone` | Ô nhập | — | |
| 8 | Lifecycle stage | `lifecycle_stage` | Chọn | — | |
| 9 | Lead status | `lead_status` | Chọn | — | |
| 10 | Số nhân sự | `employees` | Ô số | — | ≥ 0, số nguyên |

Domain đứng đầu như HubSpot. Nếu người dùng chỉ nhập Domain mà để trống Tên công ty, khi rời ô Domain thì **gợi ý** Tên công ty bằng phần trước dấu chấm đầu tiên của domain, viết hoa chữ đầu (ví dụ `thienphucpharma.vn` → "Thienphucpharma"). Người dùng sửa được. Nút "Tạo" vô hiệu khi Tên công ty trống.

Khi rời ô Domain và domain đã tồn tại, báo ngay dưới ô (không đợi bấm Tạo): "Domain này đã có ở công ty {tên}" kèm link, nếu người dùng xem được công ty đó.

Mục "Liên kết Company với":

- **Contact**: chọn nhiều contact có tìm. Contact nào chưa có công ty nào thì công ty mới là Primary của contact đó (quy tắc công ty đầu tiên, CRM-00 §5.3). Contact đã có công ty khác thì không đổi Primary.
- **Deal**: chọn nhiều deal. Trước khi gửi, FE đọc công ty hiện tại của các deal đã chọn (F03-S1 §4.3, kênh `field:company_id`). Có deal đang thuộc công ty khác thì hỏi một lần cho cả nhóm: "{n} deal đang thuộc công ty khác ({danh sách}). Chuyển sang công ty mới?". Chọn "Chuyển" thì các phần tử đó gửi kèm `replace: true`; chọn "Bỏ qua các deal này" thì gỡ chúng khỏi danh sách. Công ty, contact và deal ghi trong một request (F03-S1 §4.7).

---

## 5. Trang chi tiết

### 5.1 Thẻ định danh (CO-06)

- Avatar ô vuông chữ cái đầu.
- Tên = `name`, nút ✎ mở popover một ô "Tên công ty". Không lưu được khi trống.
- Dòng phụ: domain dạng link mở `https://{domain}` trong tab mới, nút ↗ và ⧉. Không có domain thì không có dòng phụ. Prototype trước đây có thêm ngành và thành phố dưới domain; đã bỏ để giống HubSpot (`DOI-CHIEU-CHUC-NANG.md` §12).
- Sáu nút nhanh và menu Thao tác theo CRM-01. "Tìm trên Google" tìm theo "{name} {domain}".

### 5.2 Thông tin chính (CO-07)

| Trường | Key | Sửa tại chỗ |
|---|---|---|
| Company owner | `owner_id` | Có |
| Thành phố | `city` | Có |
| Lifecycle stage | `lifecycle_stage` | Có, pill |
| Lead status | `lead_status` | Có, pill |
| Ngành | `industry` | Có, pill |
| Liên hệ gần nhất | `last_contacted_at` | Không (trường tính) |

Menu "Thao tác" của card (CRM-01 §5.4): Tuỳ chỉnh thuộc tính (mở ⚙ của card Trường bổ sung, CRM-09) · Xem tất cả thuộc tính · Xem lịch sử thuộc tính · vạch ngăn · Làm giàu dữ liệu bản ghi (khoá, "Ngoài phạm vi") · Điền thuộc tính thông minh (khoá, "Ngoài phạm vi").

### 5.3 Tab Tổng quan (CO-08)

Hai mục xếp dọc thu gọn được, giống Contacts (CRM-02 §5.3, §5.4), khác ở nội dung card "Tóm tắt":

| Câu | Mẫu | Khi thiếu dữ liệu |
|---|---|---|
| 1 | "{name} (ngành {industry}, {city}), lifecycle stage {lifecycle_stage}; {n} contact liên kết: {tên kèm chức danh trong ngoặc}." Liệt kê tối đa 3 contact: contact có công ty này là công ty chính trước, sau đó theo thời điểm liên kết mới nhất; còn nữa thì thêm ", và {k} người khác" | Bỏ cụm thiếu. Không có contact: "chưa có contact liên kết" |
| 2 | Như câu 2 của Contacts, tính trên deal có `company_id` là công ty này | Như Contacts |
| 3 | Như câu 3 của Contacts | Như Contacts |

Tiêu đề card: "Tóm tắt từ dữ liệu". Card "Việc sắp tới" và "Tương tác gần đây" như Contacts, với hoạt động gắn với công ty này.

Hoạt động tạo trên một Contact được **gợi ý** gắn kèm Công ty chính của Contact đó, người tạo bỏ chọn được (quy tắc gợi ý A-03, CRM-00 §5.11; máy chủ không tự gắn thêm lúc lưu). Nhờ vậy timeline công ty có hoạt động của người trong công ty mà **không cần gộp** timeline của mọi contact lúc đọc. Người tạo bỏ chọn công ty thì hoạt động đó không hiện ở công ty. Hoạt động tạo trên Contact trước khi Contact thuộc công ty này thì không hiện ở công ty. Bản kế hoạch giai đoạn 2 ban đầu ghi "timeline gộp hoạt động của mọi Contact thuộc công ty"; spec này thay bằng quy tắc gợi ý gắn nói trên (câu hỏi Q2).

Mục "Sức khoẻ": như CRM-02 §5.4. Sheet ghi CO-08 gồm cả Sức khoẻ; nội dung AI của mục này ngoài phạm vi như C-19.

### 5.4 Card Contacts (CO-09)

Card kênh `jn:crm_contact_companies`.

- Header: "Contacts (n)" · "+ Thêm" · ⚙.
- Mỗi thẻ contact:
  - Tên (link).
  - Tên Công ty chính của contact, chữ nhạt (có thể là công ty khác công ty đang xem).
  - "Email: {email}" kèm ⧉.
  - "Số điện thoại: {phone}".
  - Tag **"Contact với công ty chính"** khi công ty đang xem là Primary của contact đó.
  - Nhãn liên kết (D-LABEL-CC) nếu có.
- Thứ tự: contact có công ty này là Primary trước, sau đó theo ngày liên kết giảm dần.
- Menu ⋯: Đặt công ty này làm công ty chính của contact (chỉ khi chưa phải) · Sửa nhãn liên kết · Gỡ liên kết.
- "+ Thêm": Tạo mới (panel tạo Contact của CRM-02 §4, Company điền sẵn và khoá) · Thêm có sẵn (chọn nhiều contact).
- "Xem tất cả Contacts liên kết" khi có hơn 5.
- Trạng thái rỗng: "Chưa có contact nào thuộc công ty này." + nút "Thêm".

### 5.5 Card Deals và Tệp đính kèm (CO-10)

Card Deals kênh `ref:deals_pipeline.company_id`:

- Thẻ deal giống card Deals của Contact (CRM-02 §5.6) nhưng **không có** vai trò (vai trò chỉ có giữa Deal và Contact).
- Menu ⋯: Gỡ liên kết. Gỡ nghĩa là đặt `company_id` của deal về rỗng; deal vẫn còn.
- "+ Thêm":
  - **Tạo mới**: panel tạo Deal (CRM-04 §5) điền sẵn: Tên Deal "{name} - Deal mới", Company = công ty này (khoá), Contacts = contact của công ty, tick sẵn tối đa 20 theo quy tắc ở CRM-04 §5.3, người dùng bỏ tick được; Sale phụ trách = owner của công ty.
  - **Thêm có sẵn**: chọn nhiều deal. Deal đang thuộc công ty khác thì hỏi trước khi chuyển (CRM-01 §5.6).

Card Tệp đính kèm theo CRM-01 §5.7.

---

## 6. Quy tắc nghiệp vụ

- Lifecycle stage, Lead status của Company chỉ đổi khi người dùng đổi; không đồng bộ với Lifecycle stage của các Contact trong công ty.
- Xoá company (xoá mềm):
  - Dòng nối Contact – Company và Activity – Company bị xoá theo. Contact nào mất công ty Primary thì không tự chọn Primary mới (CRM-00 §5.3).
  - Deal có `company_id` là công ty này **giữ nguyên**; trường công ty hiện "(Đã xoá) {tên}" (CRM-00 R5). Card Deals của công ty không còn truy cập được vì công ty đã xoá.
  - Hộp xác nhận xoá ghi rõ: "{n} deal đang thuộc công ty này sẽ vẫn giữ tên công ty ở trạng thái đã xoá."
- Domain chuẩn hoá như CRM-00 §5.1.

---

## 7. Quyền

Theo CRM-01 §7.

---

## 8. Tiêu chí nghiệm thu

**AC-CO01-1 — Danh sách và view**
Given người dùng gắn với nhân viên Lan Lê, Lan Lê sở hữu 4 công ty
When mở Companies và lần lượt chọn hai tab
Then "Tất cả companies" có mọi công ty; "Companies của tôi" có đúng 4 công ty; không có tab "chưa có owner".

**AC-CO01-2 — Dùng chung khung**
Given màn Companies
When dùng tìm kiếm, sắp xếp, bộ lọc nâng cao, xem trước, thao tác hàng loạt
Then hành vi giống màn Contacts (theo các AC của CRM-01).

**AC-CO02-1 — Bộ lọc nhanh mặc định**
Given view "Tất cả companies" chưa chỉnh
When nhìn hàng bộ lọc nhanh
Then có đúng bốn nút Company owner, Ngày tạo, Ngày hoạt động gần nhất, Lead status (ba nút, thiếu Ngày hoạt động gần nhất, khi F03-S2 chưa xong).

**AC-CO02-2 — Thêm lọc Quốc gia**
Given bảng Companies
When bấm ⊕ → Quốc gia/Khu vực, chọn "Bằng", nhập "Việt Nam", Áp dụng
Then chỉ còn công ty có Quốc gia/Khu vực là "Việt Nam".

**AC-CO03-1 — Cột mặc định**
Given view chưa chỉnh
When mở bảng
Then cột theo thứ tự Tên công ty, Company owner, Ngày tạo, Số điện thoại, Ngày hoạt động gần nhất, Thành phố, Quốc gia/Khu vực, Ngành. Khi F03-S2 chưa xong, không có cột Ngày hoạt động gần nhất.

**AC-CO04-1 — Trường mới dùng được ở mọi nơi**
Given collection `crm_companies` đã khởi tạo
When tạo công ty có Quốc gia "Singapore" và Lead status "Mới"
Then hai giá trị hiện ở cột bảng, ở panel xem trước, lọc được bằng bộ lọc nhanh, và có trong "Xem tất cả thuộc tính".

**AC-CO05-1 — Mở rộng dòng Deals**
Given Logistics Tân Cảng Xanh có 1 deal
When bấm › và chọn Deals
Then bảng con có 1 dòng với Mã Deal, Giai đoạn, Amount, Ngày dự kiến chốt.

**AC-CO05-2 — Board**
Given chuyển sang Board
When nhìn thẻ công ty Thiên Phúc (2 contact, 1 deal)
Then thẻ có tên, domain, "2 contact · 1 deal", owner; kéo sang cột khác thì Lifecycle stage đổi và timeline có sự kiện.

**AC-CO06-1 — Thẻ định danh**
Given công ty có domain thienphucpharma.vn
When mở trang chi tiết
Then dưới tên có domain dạng link mở `https://thienphucpharma.vn` ở tab mới, nút mở và nút sao chép; không có dòng ngành, thành phố.

**AC-CO07-1 — Thông tin chính**
Given trang chi tiết công ty
When nhìn card Thông tin chính
Then có đúng 6 trường Company owner, Thành phố, Lifecycle stage, Lead status, Ngành, Liên hệ gần nhất (5 trường khi F03-S2 chưa xong); menu Thao tác của card có hai mục khoá ghi "Ngoài phạm vi".

**AC-CO08-1 — Hai mục xếp dọc**
Given tab Tổng quan của công ty
When nhìn cột giữa
Then có mục "Tổng quan" (mở) và mục "Sức khoẻ" (thu gọn) xếp dọc; bấm tiêu đề thu gọn / mở được từng mục.

**AC-CO08-2 — Tóm tắt công ty**
Given Thiên Phúc ngành "Y tế – Dược", TP. Hồ Chí Minh, lifecycle Opportunity, 2 contact (Hạnh – Giám đốc vận hành, Bảo – Trưởng phòng IT)
When mở tab Tổng quan
Then câu 1 là "Dược phẩm Thiên Phúc (ngành Y tế – Dược, TP. Hồ Chí Minh), lifecycle stage Opportunity; 2 contact liên kết: Nguyễn Thị Hạnh (Giám đốc vận hành), Trần Quốc Bảo (Trưởng phòng IT)."

**AC-CO08-3 — Hoạt động của contact hiện ở công ty**
Given Hạnh có công ty chính Thiên Phúc
When tạo một ghi chú trên trang Hạnh (không bỏ chọn Thiên Phúc)
Then ghi chú hiện trong "Tương tác gần đây" của Thiên Phúc.

**AC-CO09-1 — Card Contacts**
Given Thiên Phúc là Primary của Hạnh, còn Bảo có Primary là công ty khác
When xem card Contacts của Thiên Phúc
Then Hạnh đứng trước và có tag "Contact với công ty chính"; Bảo không có tag này và hiện tên công ty chính của Bảo ở dòng nhạt.

**AC-CO09-2 — Đặt làm công ty chính từ phía công ty**
Given như trên
When chọn ⋯ → "Đặt công ty này làm công ty chính của contact" trên Bảo
Then Thiên Phúc thành Primary của Bảo; công ty chính cũ của Bảo không còn là Primary.

**AC-CO10-1 — Tạo deal từ công ty**
Given Thiên Phúc có 2 contact, owner Minh Trần
When "+ Thêm" ở card Deals, tab Tạo mới, bỏ tick Bảo, bấm Tạo
Then deal mới có Company Thiên Phúc, chỉ có Contact Hạnh, Sale phụ trách Minh Trần, tên mặc định "Dược phẩm Thiên Phúc - Deal mới".

**AC-CO10-2 — Gỡ deal khỏi công ty**
Given DEAL-013 thuộc Thiên Phúc
When chọn ⋯ → Gỡ liên kết trên DEAL-013 và xác nhận
Then DEAL-013 không còn trong card; DEAL-013 vẫn tồn tại và trường Công ty của nó trống.

**AC-CO10-3 — Tệp đính kèm**
Given trang chi tiết công ty
When tải lên một tệp
Then tệp hiện trong card Tệp đính kèm theo CRM-01 §5.7.

---

## 9. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-CRM03-01 | E2E | Tạo công ty chỉ nhập Domain `https://www.abc.vn/` | Domain lưu `abc.vn`; Tên gợi ý "Abc", sửa được |
| TC-CRM03-02 | E2E | Nhập domain đã có rồi rời ô | Báo trùng ngay dưới ô, không đợi bấm Tạo |
| TC-CRM03-03 | API | Tạo công ty qua API không gửi `country` | `country` rỗng (mặc định chỉ áp ở giao diện) |
| TC-CRM03-04 | E2E | Tạo công ty kèm 2 contact, 1 contact chưa có công ty | Contact chưa có công ty nhận công ty mới làm Primary; contact kia giữ Primary cũ |
| TC-CRM03-05 | E2E | Tạo công ty kèm deal đang thuộc công ty khác | Hỏi trước khi chuyển |
| TC-CRM03-06 | E2E | Xoá công ty có 2 deal | Hộp xác nhận nêu 2 deal; sau khi xoá, 2 deal hiện "(Đã xoá) {tên}" ở trường Công ty |
| TC-CRM03-07 | E2E | Khôi phục công ty vừa xoá | Liên kết contact trở lại; trường Công ty của 2 deal hiện bình thường |
| TC-CRM03-08 | E2E | Board: thẻ công ty không có domain | Không có dòng domain |
| TC-CRM03-09 | E2E | Tạo deal từ công ty chưa có contact nào | Danh sách Contacts trong panel trống, vẫn tạo được |
| TC-CRM03-10 | E2E | Công ty có 7 contact | Card hiện 5 và "Xem tất cả Contacts liên kết" |
| TC-CRM03-11 | E2E | Số nhân sự nhập -5 | Báo lỗi, không lưu |
| TC-CRM03-12 | E2E | Tóm tắt khi công ty có 5 contact | Câu 1 liệt kê 3 người theo thứ tự quy định, kèm ", và 2 người khác" |

---

## 10. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Owner là tên | Liên kết tới NhanVien |
| Contact thuộc công ty qua `contact.company` | Bảng nối có Primary |
| Tạo deal từ công ty tự gắn **mọi** contact, không bỏ chọn được | Mọi contact được tick sẵn, bỏ tick được |
| Thiếu Tên công ty thì lấy nguyên domain làm tên, không báo | Gợi ý tên từ domain, người dùng xác nhận |
| Thẻ board đếm contact, deal ở FE trên dữ liệu đã tải | F03-S1 §4.3 |
| Mục Sức khoẻ có 3 card "AI · sắp ra mắt" | Như CRM-02 §5.4 |

---

## 11. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | Có cần tự lấy logo công ty theo domain (dịch vụ ngoài) không? | Khách | §2 `avatar` |
| Q2 | Chấp nhận thay "gộp timeline mọi contact" bằng quy tắc gợi ý gắn hoạt động vào Công ty chính (§5.3)? | PO / khách | Timeline và tab Tổng quan của công ty |
| Q3 | Có cần view "Companies chưa có owner" như Contacts không? Sheet CO-01 chỉ ghi Tất cả / Của tôi | Khách | §3.2 |

---

## Liên kết

- Plan: `00-PLAN-viet-spec.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md`
- Khung: `CRM-01-khung-danh-sach-trang-chi-tiet.md`
- Contacts: `CRM-02-contacts.md` · Deals: `CRM-04-deals.md`
- Đối chiếu chức năng: `../DOI-CHIEU-CHUC-NANG.md` §12

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-09-30 | v1.0 — bản đầu | TTS (qua Claude) |
| 2026-10-01 | v1.1 — §5.3 sửa "tự gắn" thành "gợi ý gắn" hoạt động vào Công ty chính cho khớp CRM-00 §5.11 (người tạo bỏ chọn được, máy chủ không tự gắn); Q2 sửa theo (phát hiện khi viết CRM-10) | TTS (qua Claude) |

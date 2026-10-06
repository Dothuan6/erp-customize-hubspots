# CRM-02 — Contacts

> **Trạng thái:** 💡 Proposed · v1.1 · 30/09/2026 · chờ review
> **Tính năng sở hữu (11):** C-01, C-02, C-06, C-09, C-13, C-14, C-16, C-18, C-19, C-20, C-21
> **Phụ thuộc:** `CRM-00` §5.2, §5.3, §5.5 (dữ liệu) · `CRM-01` (khung) · `F03-S1` (liên kết) · `F03-S2` (trường tính) · `F03-S3` (sự kiện, người theo dõi) · `F03-S6` (hoạt động, cho tab Tổng quan) · `CRM-04` §5 (panel tạo Deal)
> **Prototype:** `crm-contacts-hubspot.html` (danh sách) · `crm-record-hubspot.html?type=contact&id=ct01` (trang chi tiết) · `crm-list.js`, `crm-objects.js`
> **Nguồn HubSpot:** portal 247428660, màn Contacts, khảo sát 29/09/2026 (`DOI-CHIEU-CHUC-NANG.md` §11)

---

## 1. Phạm vi

File này chỉ mô tả phần **riêng** của Contacts. Mọi cơ chế dùng chung (tìm, lọc, bảng, board, xem trước, thao tác hàng loạt, menu Thao tác, card liên kết, panel tạo) ở `CRM-01`; ở đây chỉ ghi cấu hình và chỗ khác.

| ID | Tính năng | Ưu tiên | Phạm vi sheet | Mục |
|---|---|---|---|---|
| C-01 | Header danh sách | P0 | Chỉ FE | §3.1 |
| C-02 | Tab view | P0 | Chỉ FE | §3.2 |
| C-06 | Cột bảng | P0 | Chỉ FE | §3.3 |
| C-09 | Board theo Lifecycle | P1 | Chỉ FE | §3.4 |
| C-13 | Panel Tạo contact | P0 | Chỉ FE | §4 |
| C-14 | Thẻ định danh | P0 | Chỉ FE | §5.1 |
| C-16 | Thông tin chính | P0 | Chỉ FE | §5.2 |
| C-18 | Tab Tổng quan (Catch-up) | P2 | FE + BE | §5.3 |
| C-19 | Mục Sức khoẻ (AI) | P2 | Ngoài phạm vi | §5.4 |
| C-20 | Card Companies | P0 | FE + BE | §5.5 |
| C-21 | Card Deals | P0 | Chỉ FE | §5.6 |

C-03, C-04, C-05, C-07, C-08, C-10, C-11, C-12, C-15, C-17, C-22 nằm trong sheet dưới phân hệ Contacts nhưng thuộc `CRM-01` vì cả ba đối tượng dùng chung.

---

## 2. Cấu hình đối tượng

Giá trị cho `CrmObjectConfig` (CRM-01 §3). Key trường theo CRM-00 §5.2.

| Thuộc tính | Giá trị |
|---|---|
| `collection` | `crm_contacts` |
| `label` | Contact / Contacts |
| `icon` | `person` |
| `displayField` | `full_name` |
| `avatar` | `initials`: chữ cái đầu của hai từ cuối trong `full_name`, viết hoa ("Nguyễn Thị Hạnh" → "TH"); tên một từ thì một chữ ("Hạnh" → "H"). Contact không có họ tên (`full_name` lấy từ email, CRM-00 §5.2) thì lấy chữ cái đầu của email ("an@cty.vn" → "A") |
| `views` | `all` "Tất cả contacts" · `mine` "Contacts của tôi" · `unassigned` "Contacts chưa có owner" |
| `searchFields` | `full_name`, `email`, `phone` |
| `quickFilters` | `owner_id` · `_createdAt` (Ngày tạo) · `last_activity_at` · `lead_status` |
| `quickFiltersMore` | `lifecycle_stage` · `source` · `city` · `job_title` · trường tự tạo (CRM-09) |
| `columns` | `email` · `phone` · `owner_id` · Công ty chính · `last_activity_at` · `lead_status` · `_createdAt` |
| `columnsMore` | `job_title` · `lifecycle_stage` · `source` · `city` · Số deal · trường tự tạo |
| `columnOrder` | `view` (người dùng sắp xếp được, CRM-01 §4.7) |
| `defaultSort` | `_createdAt`, giảm dần |
| `expand` | `jn:crm_contact_companies` "Companies" · `jn:crm_deal_contacts` "Deals" |
| `board` | cột theo `lifecycle_stage`; nội dung thẻ ở §3.4 |
| `defaultMode` | `table` |
| `createFields` | §4 |
| `createAssociations` | `jn:crm_contact_companies` (Company) · `jn:crm_deal_contacts` (Deal) |
| `identity.subtitle` | §5.1 |
| `keyProps` | "Thông tin chính": §5.2 |
| `rightCards` | `jn:crm_contact_companies` · `jn:crm_deal_contacts`. Card Tệp đính kèm luôn nằm cuối, do `attachmentField` bật |
| `overviewTab` | `true` (§5.3) |
| `actions` | Theo dõi · Xem tất cả thuộc tính · Xem lịch sử thuộc tính · Xem lịch sử liên kết · Tìm trên Google · Nhân bản · Gộp · Xoá |
| `attachmentField` | `attachments` |

`_createdAt` là trường hệ thống Ngày tạo của F03. Hai trường tính `last_activity_at`, `last_contacted_at` cần F03-S2 (đợt 3); khi chưa có, bộ lọc nhanh và cột "Ngày hoạt động gần nhất" ẩn (CRM-01 §4.5), dòng "Liên hệ gần nhất" trong card Thông tin chính không hiện.

Hai cột "ảo" (không phải trường của Contacts):

| Cột | Lấy từ | Sắp xếp được | Lọc được |
|---|---|---|---|
| Công ty chính | Dòng Primary của `jn:crm_contact_companies`, F03-S1 §4.3 với `primaryOnly=true` | Không | Không (dùng bộ lọc nâng cao theo liên kết khi có; hiện chưa có) |
| Số deal | `total` của F03-S1 §4.3 kênh `jn:crm_deal_contacts` | Không | Không |

---

## 3. Danh sách

### 3.1 Header (C-01)

- Tiêu đề "Contacts ⌄" mở menu chuyển đối tượng (CRM-01 §4.2).
- Menu ⋮: Import · Export · Kết nối Google Sheet · Ghim vào sidebar · **Chỉnh sửa thuộc tính** (mở Quản lý trường của `crm_contacts`).
- Nút split "Thêm contacts ▾": bấm chữ mở panel tạo (§4); ▾ có "Tạo mới" và "Import".

### 3.2 Tab view (C-02)

- Ba tab hệ thống theo thứ tự: "Tất cả contacts", "Contacts của tôi", "Contacts chưa có owner", rồi view người dùng tự tạo, rồi nút "+".
- Điều kiện lọc của từng tab ở CRM-01 §4.3.
- Tab mặc định khi mở màn: "Tất cả contacts". Mở lại màn thì về tab người dùng đang ở lần trước (lưu theo người dùng, F03-S4).

### 3.3 Cột bảng (C-06)

Cột chính: avatar + `full_name` dạng link + nút mở rộng + nút "Xem trước" (CRM-01 §4.7).

| Cột | Hiển thị |
|---|---|
| Email | Link `mailto:` kèm biểu tượng ↗. Trống: "--" |
| Số điện thoại | Chữ thường. Trống: "--" |
| Contact owner | Avatar nhỏ + tên nhân viên. Nhân viên "Tạm nghỉ" / "Đã nghỉ" có nhãn nhỏ bên cạnh. Trống: "Chưa có owner" màu nhạt |
| Công ty chính | Ô vuông chữ cái đầu tên công ty + tên công ty dạng link. Không có Primary: "--" |
| Ngày hoạt động gần nhất | `dd/mm/yyyy HH:mm`. Trống: "--" |
| Lead status | Pill màu (`OptionPill`) |
| Ngày tạo | `dd/mm/yyyy HH:mm` |

Bảng con khi mở rộng dòng (CRM-01 §4.8):

| Kênh | Cột của bảng con |
|---|---|
| Companies | Tên công ty (link) + tag "Primary" nếu có · Domain · Số điện thoại · Nhãn liên kết |
| Deals | Mã Deal (link) + Tên Deal nhạt bên cạnh · Giai đoạn (pill) · Amount · Vai trò |

### 3.4 Board theo Lifecycle (C-09)

- Cột là 7 giá trị Lifecycle stage theo thứ tự D-LIFECYCLE (CRM-00 §5.12).
- Thẻ contact:
  - Tên dạng link (mở trang chi tiết).
  - Email (biểu tượng thư), nếu có.
  - Công ty chính (biểu tượng toà nhà), nếu có.
  - Owner (biểu tượng người), hoặc "Chưa có owner".
  - Chân thẻ: nút "Xem trước".
- Kéo thẻ sang cột khác đổi `lifecycle_stage`. BE ghi sự kiện "Lifecycle stage: A → B" lên timeline (F03-S3, `lifecycle_stage` nằm trong `timelineFields` của Contacts). Kéo xong hiện toast "Lifecycle stage: Customer".
- Contact chưa có Lifecycle stage không hiện trên board (CRM-01 §4.10).
- Người dùng đổi "Cột theo" sang trường Lựa chọn đơn khác được (ví dụ Lead status), theo CRM-01 §4.10.

---

## 4. Panel Tạo contact (C-13)

Panel phải theo CRM-01 §6. Trường theo thứ tự:

| # | Trường | Key | Kiểu ô | Mặc định | Ràng buộc |
|---|---|---|---|---|---|
| 1 | Email | `email` | Ô nhập email | — | Đúng định dạng email; không trùng contact khác (409) |
| 2 | Tên | `first_name` | Ô nhập | — | |
| 3 | Họ và tên đệm | `last_name` | Ô nhập | — | |
| 4 | Contact owner | `owner_id` | Chọn nhân viên có tìm | Nhân viên gắn với tài khoản đang đăng nhập; không có thì trống | Chỉ nhân viên đang làm việc |
| 5 | Chức danh | `job_title` | Ô nhập | — | |
| 6 | Số điện thoại | `phone` | Ô nhập | — | |
| 7 | Lifecycle stage | `lifecycle_stage` | Chọn | Lead | |
| 8 | Lead status | `lead_status` | Chọn | — | |
| 9 | Nguồn | `source` | Chọn | Nhập tay | |

Ràng buộc chung: phải có **ít nhất một trong** Email, Tên, Họ và tên đệm (CRM-00 §5.2). Không có ô nào bắt buộc riêng lẻ nên không đánh dấu *. Thay vào đó, khi cả ba đều trống, nút "Tạo" vô hiệu và cạnh nút ghi "Nhập email hoặc họ tên của contact".

Mục "Liên kết Contact với":

- **Company**: chọn một công ty có tìm. Dòng nối tạo ra là Primary (vì là công ty đầu tiên, CRM-00 §5.3). Ô nhãn liên kết chỉ hiện khi danh mục D-LABEL-CC có giá trị.
- **Deal**: chọn một deal có tìm, kèm ô Vai trò (D-LABEL-DC, không bắt buộc).

Mở panel từ card Contacts của Company (CRM-03) hoặc của Deal (CRM-04): ô tương ứng được điền sẵn và khoá. Mở từ card của Deal thì Company được điền sẵn bằng Company của Deal (nếu có) nhưng vẫn sửa được.

Tạo xong: toast "Đã tạo contact “Nguyễn Thị Hạnh”". Tạo từ header thì ở lại danh sách, contact mới hiện ở đầu (theo sắp xếp mặc định). Tạo từ card thì card cập nhật.

---

## 5. Trang chi tiết

Bố cục theo CRM-01 §5.

### 5.1 Thẻ định danh (C-14)

- Avatar tròn chữ cái đầu.
- Tên = `full_name`. Nút ✎ khi rê chuột mở popover hai ô "Họ và tên đệm" và "Tên", nút Lưu / Huỷ. Không cho lưu khi cả hai trống **và** contact không có email.
- Dòng phụ 1: "{job_title} tại {Công ty chính}", trong đó tên công ty là link. Chỉ có chức danh: chỉ hiện chức danh. Chỉ có công ty: chỉ hiện tên công ty. Không có cả hai: không hiện dòng này.
- Dòng phụ 2: email dạng link `mailto:`, nút ↗ (mở ứng dụng thư) và nút ⧉ (sao chép, toast "Đã sao chép"). Không có email: không hiện dòng này.
- Sáu nút hành động nhanh và menu Thao tác theo CRM-01 §5.2, §5.3. "Tìm trên Google" tìm theo "{full_name} {tên Công ty chính}".

### 5.2 Thông tin chính (C-16)

Card "Thông tin chính" (CRM-01 §5.4), trường theo thứ tự:

| Trường | Key | Sửa tại chỗ |
|---|---|---|
| Contact owner | `owner_id` | Có (chọn nhân viên đang làm việc) |
| Số điện thoại | `phone` | Có |
| Thành phố | `city` | Có |
| Lifecycle stage | `lifecycle_stage` | Có, hiển thị pill |
| Lead status | `lead_status` | Có, hiển thị pill |
| Liên hệ gần nhất | `last_contacted_at` | Không (trường tính, F03-S2; chỉ hiện khi F03-S2 đã xong). Trống: "--" |

**Không có thanh bước Lifecycle** (Subscriber → … → Evangelist). Bản kế hoạch giai đoạn 2 ban đầu có thanh này, nhưng khảo sát lại HubSpot ngày 29/09 cho thấy HubSpot không có, nên đã bỏ (`DOI-CHIEU-CHUC-NANG.md` §11).

Đổi Lifecycle stage, Lead status hoặc owner sinh sự kiện trên timeline (F03-S3). Đổi owner cũng đổi người theo dõi tự động (F03-S3 §6.1).

### 5.3 Tab Tổng quan (C-18)

Cột giữa có hai tab: **Tổng quan** (mặc định) và **Hoạt động** (CRM-05). Tab Tổng quan gồm hai mục xếp dọc, bấm tiêu đề để thu gọn / mở. Trạng thái thu gọn nhớ theo người dùng.

**Mục "Tổng quan"** gồm ba card:

1. **Tóm tắt contact.** Ba câu dựng từ dữ liệu theo mẫu dưới. Không dùng AI.

   | Câu | Mẫu | Khi thiếu dữ liệu |
   |---|---|---|
   | 1 | "{full_name} là {job_title} tại {Công ty chính}, lifecycle stage {lifecycle_stage}, lead status {lead_status}; owner {owner}." | Bỏ từng cụm thiếu. Không có owner: "chưa có owner" |
   | 2 | "Có {n} deal đang mở với tổng giá trị {tổng Amount} ({mã deal})." Phần mã deal liệt kê tối đa 3 deal có Ngày dự kiến chốt sớm nhất (deal không có ngày chốt xếp sau); còn nữa thì thêm ", và {k} deal khác" | Không có deal mở: "Chưa có deal đang mở." Có deal đã đóng thì thêm "({m} deal đã đóng)" |
   | 3 | "Tương tác gần nhất: {loại} “{tiêu đề hoặc 80 ký tự đầu nội dung}” ngày {dd/mm/yyyy} bởi {người tạo}." | "Chưa có hoạt động nào được ghi nhận." |

   "Deal đang mở" theo định nghĩa ở CRM-00 §5.4.3. "Tương tác gần nhất" là hoạt động mới nhất đã xảy ra, xét Ghi chú, Cuộc gọi, Cuộc họp theo `occurred_at` và Task đã xong theo `completed_at` (CRM-00 §5.10). Cuộc họp có kết quả "Huỷ", "Đổi lịch" hoặc "Không đến" không tính vì không diễn ra.

   Tiêu đề card là "Tóm tắt từ dữ liệu", **không** gắn nhãn "AI". Prototype có nhãn "AI · demo", ô "Đặt câu hỏi…" và nút đánh giá hữu ích / không hữu ích; ba thứ đó cần module AI, **không làm** trong giai đoạn này. Giữ nút ⧉ sao chép tóm tắt.

2. **Việc sắp tới (n).** Task chưa xong (kể cả quá hạn) và cuộc họp "sắp tới" theo định nghĩa ở CRM-00 §5.4.2 (`next_activity_at`), gắn với contact này. Sắp theo hạn / giờ bắt đầu tăng dần, hiện tối đa 5. Mỗi dòng: biểu tượng loại · tiêu đề · "Hạn dd/mm" (task) hoặc "dd/mm HH:mm" (họp) · người thực hiện. Task quá hạn có nhãn "Quá hạn". Không có: "Không có task hay cuộc họp sắp tới."

3. **Tương tác gần đây.** Ba hoạt động gần nhất đã xảy ra (không tính việc sắp tới), cùng định dạng dòng. Góc card có nút "Tạo hoạt động ▾" (Ghi chú · Cuộc gọi · Task · Cuộc họp, mở cửa sổ soạn CRM-05). Cuối card: "Xem tất cả hoạt động" chuyển sang tab Hoạt động. Không có hoạt động nào: trạng thái rỗng "Chưa có hoạt động nào trên contact này." + nút "Tạo hoạt động ▾".

Dữ liệu card 2 lấy từ API timeline với `section=upcoming&limit=5` (số `n` là `meta.total`); card 3 và câu 3 của Tóm tắt lấy với `happened=true&limit=3` (F03-S6 §5.1), để đúng tiêu chí "đã xảy ra" của F03-S2 §6.1. Card 1 dựng ở FE từ dữ liệu bản ghi, card liên kết và API hoạt động; không cần API riêng. Sheet ghi C-18 là "FE + BE" vì phụ thuộc F03-S6.

### 5.4 Mục Sức khoẻ (C-19 — ngoài phạm vi)

HubSpot có mục "Health" gồm Cảm xúc, Thách thức, Phản hồi tích cực, sinh bằng AI từ email và cuộc gọi. ERP chưa có module AI và email nên **không làm** nội dung này.

Trong giai đoạn này: dưới mục Tổng quan có tiêu đề mục "Sức khoẻ", **thu gọn mặc định**, mở ra chỉ có một dòng "Chưa có trong giai đoạn này." Giữ tiêu đề để bố cục giống HubSpot và giống trang Company (CO-08 yêu cầu hai mục xếp dọc). Nếu khách thấy dòng này gây hiểu nhầm thì ẩn hẳn (câu hỏi Q2).

### 5.5 Card Companies (C-20)

Card liên kết kênh `jn:crm_contact_companies` theo CRM-01 §5.6.

- Header: "Companies (n)" · "+ Thêm" · ⚙.
- Mỗi thẻ công ty:
  - Tên công ty (link) + tag "Primary" nếu là công ty chính.
  - "Domain: {domain}" kèm ↗ (mở website trong tab mới) và ⧉ (sao chép).
  - "Số điện thoại: {phone}".
  - Nhãn liên kết dạng tag, hoặc link "Thêm nhãn liên kết" khi dòng chưa có nhãn. Link này chỉ hiện khi danh mục D-LABEL-CC có ít nhất một giá trị.
- Menu ⋯: Đặt làm Primary / Bỏ Primary · Sửa nhãn liên kết · Gỡ liên kết.
- "+ Thêm" mở panel hai tab: Tạo mới (panel tạo Company của CRM-03, liên kết với contact này điền sẵn) và Thêm có sẵn (chọn nhiều công ty).
- Thêm công ty khi contact **chưa có** công ty nào: công ty đó tự là Primary. Chọn nhiều công ty cùng lúc khi contact chưa có công ty: panel hiện thêm ô "Công ty chính" (mặc định công ty chọn đầu tiên) để người dùng chọn lại trước khi lưu.
- Cách gửi khi chọn nhiều công ty: API thêm liên kết (F03-S1 §4.4) nhận một công ty mỗi lần gọi. FE gửi **tuần tự**, công ty được chọn làm Primary trước (kèm `isPrimary: true`), các công ty còn lại sau (`isPrimary: false`). Không gửi song song, để tránh hai request cùng muốn làm Primary. Có lỗi ở giữa thì dừng, panel giữ nguyên các công ty chưa gửi và báo "Đã thêm {n} công ty. Không thêm được {tên}: {lỗi từ API}".
- Đã có công ty: công ty mới không phải Primary, trừ khi người dùng tick "Đặt làm công ty chính" trong panel (chỉ bật được khi chọn đúng một công ty).
- Trạng thái rỗng: "Chưa gắn công ty nào. Thêm công ty để biết contact này làm ở đâu." + nút "Thêm".

### 5.6 Card Deals (C-21)

Card liên kết kênh `jn:crm_deal_contacts`.

- Header: "Deals (n)" · "+ Thêm" · ⚙.
- Mỗi thẻ deal:
  - Mã Deal (link) và Tên Deal chữ nhạt ngay dưới.
  - "Amount: {t_ng_cash_in_d_ki_n}".
  - "Ngày chốt: {ng_y_d_ki_n_ch_t}".
  - "Giai đoạn:" + pill giai đoạn.
  - Vai trò dạng tag, hoặc link "Thêm nhãn liên kết".
- Thứ tự: theo Giai đoạn Pipeline tăng dần, cùng giai đoạn thì theo Ngày dự kiến chốt tăng dần (deal không có ngày chốt xếp cuối nhóm). FE gửi `sort=giai_o_n_pipeline:asc,ng_y_d_ki_n_ch_t:asc` cho F03-S1 §4.2. Vì Won và Lost là hai giai đoạn cuối của D-STAGE (5 và 6), deal đã đóng tự nằm dưới deal đang mở. Đây là thứ tự riêng của card này, khác thứ tự mặc định của F03-S1 §4.2. Nếu sau này thêm giai đoạn mở đứng sau Won/Lost trong danh mục thì quy tắc này phải xem lại.
- Menu ⋯: Sửa vai trò · Gỡ liên kết.
- "+ Thêm" mở panel hai tab:
  - **Tạo mới**: panel tạo Deal (CRM-04 §5), điền sẵn: Tên Deal "{tên Công ty chính} - Deal mới" (không có công ty thì "{full_name} - Deal mới"), Company = Công ty chính của contact, Contact = contact này (vai trò để trống), Sale phụ trách = owner của contact.
  - **Thêm có sẵn**: chọn nhiều deal, ô Vai trò áp cho mọi deal đã chọn.
- Trạng thái rỗng: "Contact này chưa tham gia deal nào." + nút "Thêm".

---

## 6. Quy tắc nghiệp vụ

- **Lifecycle stage và Lead status chỉ đổi khi người dùng đổi.** Không tự đổi khi tạo deal, khi deal thắng hay khi có hoạt động. HubSpot có thể tự chuyển lifecycle sang "Opportunity" khi tạo deal; ERP không làm theo, vì quyết định cố định của dự án là trạng thái nghiệp vụ do người dùng chủ động đổi.
- Email được chuẩn hoá (chữ thường, bỏ khoảng trắng hai đầu) trước khi lưu và trước khi kiểm trùng. Kiểm định dạng ở FE bằng quy tắc: có đúng một `@`, phần sau `@` có ít nhất một dấu chấm, không có khoảng trắng.
- Xoá contact (xoá mềm): các dòng nối Contact – Company, Deal – Contact và Activity – Contact bị xoá theo (F03-S1 §3.4). Hoạt động gắn với contact vẫn còn trên timeline của Company và Deal. Khôi phục contact thì khôi phục các liên kết đó.
- Nhân bản contact theo CRM-01 §5.3.

---

## 7. Quyền

Theo CRM-01 §7. Không có quy tắc riêng.

---

## 8. Tiêu chí nghiệm thu

**AC-C01-1 — Header**
Given người dùng có quyền tạo và nhập contact
When mở màn Contacts
Then thấy tiêu đề "Contacts ⌄" kèm số bản ghi, menu ⋮ có Import, Export, Chỉnh sửa thuộc tính, và nút "Thêm contacts ▾" với hai lựa chọn Tạo mới, Import.

**AC-C01-2 — Đổi đối tượng từ tiêu đề**
Given đang ở Contacts
When bấm "Contacts ⌄" và chọn Deals
Then chuyển sang màn Deals.

**AC-C02-1 — Ba tab hệ thống**
Given có 3 contact chưa có owner và 5 contact của nhân viên gắn với tài khoản đang đăng nhập
When lần lượt mở ba tab
Then "Contacts chưa có owner" có đúng 3 contact; "Contacts của tôi" có đúng 5 contact; "Tất cả contacts" có mọi contact.

**AC-C06-1 — Cột mặc định**
Given view "Tất cả contacts" chưa chỉnh
When mở bảng
Then cột theo thứ tự: Tên, Email, Số điện thoại, Contact owner, Công ty chính, Ngày hoạt động gần nhất, Lead status, Ngày tạo, rồi cột "+". Khi F03-S2 chưa xong, không có cột Ngày hoạt động gần nhất, các cột khác giữ thứ tự.

**AC-C06-2 — Công ty chính**
Given contact Hạnh liên kết 2 công ty, Thiên Phúc là Primary
When xem cột Công ty chính
Then hiện "Dược phẩm Thiên Phúc" dạng link.

**AC-C06-3 — Thêm cột**
Given bảng Contacts
When bấm "+" và chọn "Số deal"
Then cột Số deal xuất hiện, hiện đúng số deal của mỗi contact; tiêu đề cột không có mũi tên sắp xếp.

**AC-C09-1 — Board theo Lifecycle**
Given chuyển sang Board
When nhìn board
Then có 7 cột theo đúng thứ tự Subscriber, Lead, Marketing Qualified Lead, Sales Qualified Lead, Opportunity, Customer, Evangelist; mỗi thẻ có tên, email, công ty chính, owner.

**AC-C09-2 — Kéo thẻ ghi timeline**
Given contact Hạnh ở cột Opportunity
When kéo sang cột Customer
Then Lifecycle stage của Hạnh là Customer; timeline của Hạnh có sự kiện "Lifecycle stage: Opportunity → Customer" do người kéo thực hiện.

**AC-C13-1 — Tạo contact kèm công ty**
Given mở panel Tạo contact
When nhập email hanh@thienphuc.vn, Tên "Hạnh", chọn Company "Dược phẩm Thiên Phúc", bấm Tạo
Then contact được tạo với Lifecycle stage "Lead", Nguồn "Nhập tay", owner là nhân viên của người tạo; Thiên Phúc là công ty Primary của contact.

**AC-C13-2 — Thiếu định danh**
Given panel Tạo contact
When để trống Email, Tên và Họ và tên đệm
Then nút Tạo vô hiệu, cạnh nút ghi "Nhập email hoặc họ tên của contact".

**AC-C13-3 — Email trùng**
Given đã có contact với email hanh@thienphuc.vn
When tạo contact mới với email "Hanh@ThienPhuc.vn"
Then không tạo được; dưới ô Email báo email đã có ở contact khác (kèm link nếu người dùng xem được contact đó).

**AC-C13-4 — Tạo và thêm tiếp**
Given mở panel Tạo contact từ card Contacts của Company Thiên Phúc
When nhập một contact rồi bấm "Tạo và thêm tiếp"
Then contact được tạo và liên kết Thiên Phúc; form trống lại, ô Company vẫn là Thiên Phúc và bị khoá.

**AC-C14-1 — Dòng phụ**
Given contact có chức danh "Giám đốc vận hành", công ty chính Thiên Phúc, email hanh@thienphuc.vn
When mở trang chi tiết
Then dòng phụ là "Giám đốc vận hành tại Dược phẩm Thiên Phúc" (tên công ty là link) và dòng email có nút mở và nút sao chép.

**AC-C14-2 — Đổi tên**
Given contact "Nguyễn Thị Hạnh"
When bấm ✎, sửa Tên từ "Hạnh" thành "Hằng" và lưu
Then tiêu đề, danh sách và card liên kết ở Deal đều hiện "Nguyễn Thị Hằng"; lịch sử thuộc tính có dòng đổi `first_name`.

**AC-C16-1 — Thông tin chính không có thanh bước**
Given trang chi tiết contact
When nhìn cột trái
Then card "Thông tin chính" có đúng 6 trường theo thứ tự Contact owner, Số điện thoại, Thành phố, Lifecycle stage, Lead status, Liên hệ gần nhất (5 trường nếu F03-S2 chưa xong, thiếu Liên hệ gần nhất); không có thanh bước Lifecycle.

**AC-C16-2 — Liên hệ gần nhất chỉ đọc**
Given F03-S2 đã xong; contact có một cuộc gọi ngày 25/09 và một ghi chú ngày 28/09
When xem "Liên hệ gần nhất"
Then hiện 25/09 (ghi chú không tính); bấm vào không mở ô sửa.

**AC-C18-1 — Tóm tắt từ dữ liệu**
Given Hạnh là Giám đốc vận hành tại Thiên Phúc, có 1 deal mở DEAL-013 giá trị 210.000.000 ₫, hoạt động gần nhất là cuộc họp "Demo ERP cho BGĐ Thiên Phúc" ngày 15/09 của Minh Trần
When mở tab Tổng quan
Then card "Tóm tắt từ dữ liệu" có ba câu đúng mẫu §5.3 với các giá trị trên; không có nhãn "AI", không có ô đặt câu hỏi.

**AC-C18-2 — Việc sắp tới**
Given Hạnh có 1 task chưa xong hạn 30/09 và 1 cuộc họp 02/10
When xem card Việc sắp tới
Then card ghi "Việc sắp tới (2)", task đứng trước cuộc họp.

**AC-C18-3 — Rỗng**
Given contact mới tạo, chưa có hoạt động
When mở tab Tổng quan
Then card Tương tác gần đây hiện "Chưa có hoạt động nào trên contact này." và nút "Tạo hoạt động ▾".

**AC-C19-1 — Sức khoẻ không có nội dung AI**
Given trang chi tiết contact
When mở mục Sức khoẻ
Then chỉ có dòng "Chưa có trong giai đoạn này."; không gọi API nào.

**AC-C20-1 — Card Companies**
Given Hạnh liên kết Thiên Phúc (Primary) và Titan Bases
When xem card Companies
Then header ghi "Companies (2)", Thiên Phúc đứng đầu có tag Primary, mỗi thẻ có Domain (mở được, sao chép được) và Số điện thoại.

**AC-C20-2 — Đổi Primary**
Given như trên
When chọn ⋯ → Đặt làm Primary trên Titan Bases
Then Titan Bases có tag Primary và lên đầu; cột Công ty chính ở danh sách và dòng phụ ở thẻ định danh đổi thành Titan Bases.

**AC-C20-3 — Thêm nhãn liên kết**
Given danh mục D-LABEL-CC có "Nhân viên"
When bấm "Thêm nhãn liên kết" trên Thiên Phúc và chọn "Nhân viên"
Then thẻ hiện tag "Nhân viên"; lịch sử liên kết của Hạnh không đổi (sửa nhãn không phải thêm/gỡ liên kết).

**AC-C20-4 — Công ty đầu tiên tự là Primary**
Given contact chưa có công ty nào
When thêm có sẵn công ty Thiên Phúc
Then Thiên Phúc là Primary.

**AC-C21-1 — Card Deals**
Given Hạnh liên kết DEAL-013 (vai trò Người quyết định, đang mở) và DEAL-002 (đã thắng)
When xem card Deals
Then DEAL-013 đứng trước; mỗi thẻ có Amount, Ngày chốt, Giai đoạn dạng pill; DEAL-013 có tag "Người quyết định".

**AC-C21-2 — Tạo deal từ contact**
Given Hạnh có công ty chính Thiên Phúc, owner Minh Trần
When bấm "+ Thêm" ở card Deals, tab Tạo mới
Then panel tạo Deal có Tên Deal "Dược phẩm Thiên Phúc - Deal mới", Company Thiên Phúc, Contact Hạnh, Sale phụ trách Minh Trần; tạo xong deal hiện trong card Deals của Hạnh và card Deals của Thiên Phúc.

---

## 9. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-CRM02-01 | E2E | Tạo contact chỉ có Họ và tên đệm | Tạo được; tên hiển thị là họ và tên đệm |
| TC-CRM02-02 | E2E | Tạo contact chỉ có email | Tạo được; tên hiển thị là email |
| TC-CRM02-03 | E2E | Nhập email "an@cty" | Báo sai định dạng, không gửi |
| TC-CRM02-04 | E2E | Tài khoản chưa gắn nhân viên mở panel tạo | Ô owner trống |
| TC-CRM02-05 | E2E | Chọn owner: nhân viên "Đã nghỉ" | Không có trong danh sách chọn |
| TC-CRM02-06 | E2E | Đổi tên để trống cả họ và tên, contact không có email | Nút Lưu vô hiệu |
| TC-CRM02-07 | E2E | Contact không có chức danh, không có công ty | Không hiện dòng phụ 1 |
| TC-CRM02-08 | E2E | Gỡ công ty Primary, contact còn 1 công ty | Không công ty nào có tag Primary; cột Công ty chính "--" |
| TC-CRM02-09 | E2E | Board: đổi "Cột theo" sang Lead status | Board có 8 cột theo D-LEADSTATUS |
| TC-CRM02-10 | E2E | Xoá contact có 2 liên kết công ty, 1 deal, 3 hoạt động | Contact vào thùng rác; card Contacts ở công ty và deal không còn contact; 3 hoạt động vẫn hiện trên timeline deal |
| TC-CRM02-11 | E2E | Khôi phục contact vừa xoá | Liên kết công ty, deal trở lại |
| TC-CRM02-12 | E2E | Tóm tắt khi contact có 4 deal đang mở | Câu 2 liệt kê 3 mã deal có ngày chốt sớm nhất, kèm ", và 1 deal khác" |
| TC-CRM02-13 | E2E | Thu gọn mục Tổng quan, tải lại trang | Vẫn thu gọn |
| TC-CRM02-14 | E2E | Mở trang chi tiết ở 390 px | Tab Tổng quan nằm dưới thẻ định danh và Thông tin chính; card Companies, Deals ở cuối |
| TC-CRM02-15 | API | Tạo contact kèm Company và Deal trong một request | Một giao dịch; timeline Deal có sự kiện "Đã liên kết với Contact …" (Contacts không lan "Đã tạo" nên Deal chỉ có dòng liên kết, F03-S3 §4.1) |

---

## 10. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Owner là tên; danh sách owner cố định 3 người | Liên kết tới NhanVien, danh sách lấy từ API |
| Mỗi contact có đúng một `company` | Nhiều công ty, một Primary |
| Tag "Primary" luôn hiện trên card Companies của contact (vì chỉ có một công ty) | Chỉ hiện ở dòng có `is_primary` |
| "Thêm nhãn liên kết" Contact – Company chỉ hiện toast | Sửa nhãn thật (F03-S1 §4.5) |
| Tóm tắt gắn nhãn "AI · demo", có ô đặt câu hỏi và nút đánh giá | Tóm tắt từ dữ liệu, không nhãn AI, không ô hỏi, không nút đánh giá |
| Mục Sức khoẻ có 3 card "AI · sắp ra mắt" | Một dòng "Chưa có trong giai đoạn này.", thu gọn mặc định |
| Deal tạo từ contact tự gán vai trò "Người quyết định" | Vai trò để trống, người dùng tự chọn |
| Board ghi sự kiện "Lifecycle stage" ở FE | BE ghi (F03-S3) |
| Key trường `firstname`, `lastname`, `jobtitle`, `lifecycle`, `leadstatus` | `first_name`, `last_name`, `job_title`, `lifecycle_stage`, `lead_status` (CRM-00) |

---

## 11. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | Danh mục nhãn liên kết Contact – Company (D-LABEL-CC) gồm những giá trị nào? Đề xuất: Nhân viên · Người quyết định · Cựu nhân viên · Đối tác tư vấn | Khách | §5.5. Khi danh mục trống, link "Thêm nhãn liên kết" không hiện |
| Q2 | Giữ tiêu đề mục "Sức khoẻ" với dòng "Chưa có trong giai đoạn này" hay ẩn hẳn? | Khách | §5.4 |
| Q3 | Tóm tắt có cần làm lại bằng AI ở giai đoạn sau không? Nếu có, giữ chỗ cho nút "Tạo lại" | PO | §5.3 |
| Q4 | API F03-S1 §4.2 có nhận `sort` nhiều khoá (`giai_o_n_pipeline:asc,ng_y_d_ki_n_ch_t:asc`) không, và giá trị rỗng nằm cuối khi sắp tăng dần không? Trường Lựa chọn đơn sắp theo thứ tự danh mục hay theo chuỗi? | BE | §5.6. Nếu không, FE sắp lại 5 deal đầu ở phía trình duyệt và ghi rõ giới hạn |

---

## Liên kết

- Plan: `00-PLAN-viet-spec.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md`
- Khung: `CRM-01-khung-danh-sach-trang-chi-tiet.md`
- Companies: `CRM-03-companies.md` · Deals: `CRM-04-deals.md`
- Liên kết bản ghi: `ERPMini/features/features/F03-S1-lien-ket-ban-ghi.md`
- Nhật ký & sự kiện: `ERPMini/features/features/F03-S3-nhat-ky-thay-doi-su-kien.md`
- Đối chiếu chức năng: `../DOI-CHIEU-CHUC-NANG.md` §11

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-09-30 | v1.0 — bản đầu | TTS (qua Claude) |
| 2026-09-30 | v1.1 — theo đợt 3: §5.3 nêu rõ card Việc sắp tới, Tương tác gần đây lấy từ API timeline (`section=upcoming`, `happened=true`) | TTS (qua Claude) |

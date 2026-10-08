# CRM-11 — Phân quyền xem / sửa theo owner (Leads, Deals, Sales)

# Product Requirement Document

| | | | |
|---|---|---|---|
| **Project Owner** | TTS | **Update at** | 08-10-2026 |
| **Created by** | TTS (qua Claude) | **Project** | CRM theo UX HubSpot — HarnexAI ERP |
| **Version** | 1.0 | **Features** | P-01 → P-07 |

**CONTENT**

- USER STORIES
- OVERVIEW FLOW
- USE CASE DESCRIPTION
  - UC-1: Xem danh sách Leads / Deals theo quyền
  - UC-2: Mở trang chi tiết Lead / Deal
  - UC-3: Tạo Lead / Deal và giao owner
  - UC-4: Sửa owner trên bản ghi có sẵn
  - UC-5: Dùng màn Sales theo quyền
- BUSINESS RULE
- ACCEPTANCE CRITERIA
- PHỤ LỤC

**VERSION HISTORY**

| **Ver** | **Author** | **Description** | **Updated at** |
|---|---|---|---|
| 1.0 | TTS (qua Claude) | Bản đầu. Chốt với PO: sale thường xem và sửa bản ghi của mình; trưởng nhóm / quản lý xem và sửa tất cả, được giao bản ghi cho sale khác, quản lý đội sale. Prototype đã dựng theo bản này | 08-10-2026 |

---

# USER STORIES

- US-PERM-01: Là sale, tôi muốn danh sách Leads và Deals chỉ hiện bản ghi của mình để tập trung vào việc của mình. (P-01, P-02)
- US-PERM-02: Là sale, tôi muốn tạo lead / deal nhanh mà không phải chọn owner, vì owner mặc định là tôi. (P-04)
- US-PERM-03: Là trưởng nhóm, tôi muốn xem toàn bộ lead / deal của công ty và giao lại cho sale khác khi cần. (P-01, P-04)
- US-PERM-04: Là trưởng nhóm, tôi muốn xem màn Sales theo từng sale hoặc tất cả sales để theo dõi đội. (P-05)
- US-PERM-05: Là quản lý, tôi muốn chỉ quản lý mới được thêm sale, đổi trạng thái sale và chuyển giao bản ghi. (P-05)
- US-PERM-06: Là sale, khi mở link tới bản ghi của người khác, tôi muốn thấy thông báo rõ là không có quyền thay vì trang lỗi. (P-03)
- US-PERM-07: Là quản trị ERP, tôi muốn gán bộ quyền cho từng người dùng thay vì sửa code. (P-01)

# OVERVIEW FLOW

| **Bước** | **Tác nhân** | **Mô tả** |
|---|---|---|
| 1 | Quản trị | Gán bộ quyền CRM cho người dùng: "Quản lý" hoặc "Sale" (Phụ lục B). |
| 2 | Người dùng | Đăng nhập, mở Leads / Deals / Sales. |
| 3 | Máy chủ | Đọc bộ quyền của người dùng, lọc dữ liệu theo phạm vi xem trước khi trả về. |
| 4 | FE | Ẩn các nút, tab, bộ lọc mà người dùng không dùng được. |
| 5 | Sale | Tạo lead / deal; owner tự là chính mình. |
| 6 | Máy chủ | Chặn mọi thao tác ngoài phạm vi (xem, sửa, xoá, đổi owner) bằng lỗi 403, kể cả khi gọi API trực tiếp. |
| 7 | Quản lý | Giao bản ghi cho sale khác, quản lý đội sale, xem số liệu cả công ty. |

# USE CASE DESCRIPTION

## UC-1: Xem danh sách Leads / Deals theo quyền (P-01, P-02, P-06)

| | |
|---|---|
| **Actor** | Sale, Quản lý |
| **Trigger** | Mở trang Leads (`crm-leads-hubspot.html`), Deals (`crm-giao-dich-hubspot.html`), tab Leads / Deals của màn Sales, hoặc Báo cáo. |
| **Pre-condition** | Người dùng đã đăng nhập và có bộ quyền CRM. |
| **Main Flow** | 1. FE gọi API danh sách.<br>2. Máy chủ lọc: phạm vi xem "Của mình" thì chỉ trả bản ghi có owner = người dùng; "Tất cả" thì trả hết.<br>3. FE hiện danh sách, số "N bản ghi" và số ở từng view tính trên dữ liệu đã lọc.<br>4. Với sale, FE ẩn view "Lead của tôi", "Lead chưa có owner" và bộ lọc nhanh owner ("Lead owner", "Sale phụ trách"). |
| **Post-condition** | Sale chỉ thấy bản ghi của mình ở mọi nơi: bảng, board, tìm kiếm, xuất file, báo cáo deal. |
| **Exception Flow** | 2a. Người dùng chưa có bộ quyền → coi như "Sale" (phạm vi "Của mình").<br>3a. Không có bản ghi nào → trạng thái rỗng như hiện tại. |

## UC-2: Mở trang chi tiết Lead / Deal (P-03)

| | |
|---|---|
| **Actor** | Sale, Quản lý |
| **Trigger** | Mở link record (`crm-lead-hubspot.html?id=…`, `crm-record-hubspot.html?type=deal&id=…`), kể cả bấm từ card liên kết trên Contact / Company. |
| **Pre-condition** | Bản ghi tồn tại. |
| **Main Flow** | 1. FE gọi API lấy bản ghi.<br>2. Máy chủ kiểm quyền xem.<br>3. Có quyền → hiện trang như hiện tại. |
| **Post-condition** | Không lộ dữ liệu bản ghi ngoài phạm vi. |
| **Exception Flow** | 2a. Không có quyền → máy chủ trả 403 `CRM_FORBIDDEN`; FE hiện khối khoá: "Bạn không có quyền xem lead này" / "Bạn không có quyền xem deal này", dòng phụ "Bản ghi thuộc sale khác. Liên hệ trưởng nhóm / quản lý nếu cần.", nút về danh sách.<br>2b. Bản ghi không tồn tại → giữ thông báo "Không tìm thấy" như hiện tại (404). |

## UC-3: Tạo Lead / Deal và giao owner (P-04)

| | |
|---|---|
| **Actor** | Sale, Quản lý |
| **Trigger** | Bấm "Tạo lead", "Tạo bản ghi" (Deals), tạo Deal từ card liên kết, hoặc chuyển lead sang "Đạt" → "Tạo Deal". |
| **Pre-condition** | Có quyền tạo đối tượng. |
| **Main Flow** | 1. FE mở form tạo.<br>2. Quản lý: ô "Lead owner" / "Sale phụ trách" là ô chọn, mặc định là mình.<br>3. Sale: ô này hiện dạng chữ tên mình, dòng phụ "Chỉ trưởng nhóm / quản lý được giao cho sale khác", không chọn được.<br>4. Người dùng bấm tạo; máy chủ lưu owner. |
| **Post-condition** | Bản ghi do sale tạo luôn có owner = sale đó. |
| **Exception Flow** | 4a. Sale gửi owner khác mình (gọi API trực tiếp) → máy chủ trả 403 `CRM_ASSIGN_FORBIDDEN`, không tạo. |

## UC-4: Sửa owner trên bản ghi có sẵn (P-04)

| | |
|---|---|
| **Actor** | Sale, Quản lý |
| **Trigger** | Bấm ô "Lead owner" / "Sale phụ trách" ở trang chi tiết, panel xem nhanh, ô bảng; "Gán owner" hàng loạt; "Đổi" / "Thêm" ở card "Sales" của Deal. |
| **Pre-condition** | Có quyền sửa bản ghi. |
| **Main Flow** | 1. Quản lý: mở trình sửa, chọn sale khác, lưu như hiện tại. |
| **Post-condition** | Chỉ quản lý đổi được owner. |
| **Exception Flow** | 1a. Sale bấm ô owner → hiện chữ "Chỉ trưởng nhóm / quản lý được đổi" 1,6 giây rồi trả về giá trị cũ; ở record Lead ô owner là chỉ đọc.<br>1b. Với sale, FE ẩn nút "Gán owner" ở thanh thao tác hàng loạt và nút "Đổi" / "Thêm" ở card "Sales".<br>1c. Gọi API đổi owner khi không có quyền giao → 403 `CRM_ASSIGN_FORBIDDEN`. |

## UC-5: Dùng màn Sales theo quyền (P-05)

| | |
|---|---|
| **Actor** | Sale, Quản lý |
| **Trigger** | Mở `crm-sales-hubspot.html`. |
| **Pre-condition** | Đã đăng nhập. |
| **Main Flow** | 1. Quản lý: như hiện tại. Có nút "xem theo" (mặc định "Tất cả sales"), có tab "Đội sale", mở được hồ sơ mọi sale, có menu "Thao tác" (chuyển giao bản ghi, đánh dấu nghỉ), sửa được thông tin sale.<br>2. Sale: không có nút "xem theo"; mọi tab chỉ tính số liệu của mình.<br>3. Sale: không có tab "Đội sale"; link `?tab=team` mở về "Tổng quan".<br>4. Sale mở hồ sơ của mình: chỉ xem, không có "Thao tác", nút quay lại ghi "Sales". |
| **Post-condition** | Sale không xem được số liệu, hồ sơ của sale khác. |
| **Exception Flow** | 4a. Sale mở `?id=` của sale khác → khối khoá "Bạn không có quyền xem hồ sơ sale này".<br>4b. Gọi API thêm / sửa sale, chuyển giao bản ghi khi không phải quản lý → 403. |

# BUSINESS RULE

| **BR** | **Mô tả** |
|---|---|
| BR-01 | **Mô hình quyền (theo "User permissions" của HubSpot)**<br>- Mỗi đối tượng có 3 quyền: Xem, Sửa, Xoá.<br>- Mỗi quyền có phạm vi "Tất cả" hoặc "Của mình". Không chia nhóm sale nên không có mức "Nhóm".<br>- Thêm 2 quyền riêng: "Giao bản ghi cho sale khác" và "Quản lý đội sale". |
| BR-02 | **Hai bộ quyền mặc định**<br>- "Quản lý": Xem / Sửa / Xoá = Tất cả; Giao bản ghi = có; Quản lý đội sale = có.<br>- "Sale": Xem / Sửa / Xoá = Của mình; Giao bản ghi = không; Quản lý đội sale = không.<br>- Quản trị ERP có toàn quyền như "Quản lý".<br>- Người dùng chưa gán bộ quyền dùng "Sale". |
| BR-03 | **Gán bộ quyền ban đầu theo Vai trò của sale**<br>- "Trưởng nhóm", "Sales Manager" → "Quản lý".<br>- "Sales Executive", "Account Manager" → "Sale".<br>- Sau đó quản trị đổi riêng từng người được, không phụ thuộc Vai trò. |
| BR-04 | **Đối tượng áp dụng đợt này**<br>- Lead: owner = `lead.owner`.<br>- Deal: owner = `deal.sale_ph_tr_ch` ("Sale phụ trách").<br>- Contact, Company, Hoạt động: chưa áp, giữ như hiện tại (xem Phụ lục E). |
| BR-05 | **"Của mình" nghĩa là owner = người dùng hiện tại**<br>- Bản ghi chưa có owner chỉ quản lý thấy.<br>- So bằng id người dùng, không so bằng tên (hiện prototype lưu tên). |
| BR-06 | **Máy chủ là nơi chặn, FE chỉ ẩn**<br>- Mọi API danh sách, đếm, tìm kiếm, xuất file, báo cáo, lấy theo id, cập nhật, xoá, xoá hàng loạt đều kiểm quyền.<br>- Ngoài phạm vi xem: danh sách không trả, lấy theo id trả 403.<br>- Ngoài phạm vi sửa / xoá: 403. |
| BR-07 | **Giao owner**<br>- Không có quyền giao: khi tạo thì owner bị ép = người dùng; khi sửa thì không đổi được owner.<br>- Áp cho mọi đường đổi owner: form tạo, sửa trường, sửa hàng loạt, card "Sales", "Lead đạt — tạo Deal", tạo Deal từ card liên kết, import. |
| BR-08 | **Màn Sales**<br>- Sale: số liệu mọi tab tính theo chính mình; không có "xem theo", không có "Đội sale".<br>- Hồ sơ sale: sale chỉ xem hồ sơ mình, không sửa.<br>- Thêm sale, đổi trạng thái, chuyển giao bản ghi, đánh dấu nghỉ: chỉ "Quản lý đội sale". |
| BR-09 | **Báo cáo**<br>- Dữ liệu deal trong báo cáo lọc theo phạm vi xem (sale chỉ thấy deal của mình).<br>- Bộ lọc "Owners" của sale chỉ có chính mình. |
| BR-10 | **Card liên kết trên Contact / Company**<br>- Prototype vẫn liệt kê lead / deal của sale khác; bấm vào thì gặp khối khoá (UC-2, 2a).<br>- Cách hiện cuối cùng chờ PO chốt (Phụ lục E). |

# ACCEPTANCE CRITERIA

AC-1: Sale chỉ thấy bản ghi của mình (P-01, P-02)
- Dữ liệu mẫu, đăng nhập Lan Lê (Sale): Leads hiện "3 bản ghi", Deals hiện "4 bản ghi".
- Đăng nhập Phương Nguyễn (Quản lý): Leads "12 bản ghi", Deals "13 bản ghi".
- Sale không thấy view "Lead của tôi", "Lead chưa có owner" và bộ lọc nhanh owner.

AC-2: Mở bản ghi của người khác (P-03)
- Lan Lê mở lead `ld01` (owner Phương Nguyễn) → khối "Bạn không có quyền xem lead này".
- Lan Lê mở deal của Minh Trần → khối "Bạn không có quyền xem deal này".
- API trả 403, không trả dữ liệu bản ghi.

AC-3: Tạo và giao owner (P-04)
- Sale mở "Tạo lead": ô "Lead owner" là chữ tên mình, có dòng "Chỉ trưởng nhóm / quản lý được giao cho sale khác".
- Sale mở "Tạo bản ghi" ở Deals: ô "Sale phụ trách" là chữ tên mình.
- Sale bấm ô "Sale phụ trách" trên deal của mình → hiện "Chỉ trưởng nhóm / quản lý được đổi", giá trị không đổi.
- Card "Sales" trên deal: sale không có nút "Đổi" / "Thêm"; danh sách Leads: sale không có "Gán owner".

AC-4: Màn Sales (P-05)
- Sale: tab còn "Tổng quan · Leads · Deals · Tasks · Lịch · Feed", không có nút "xem theo".
- Sale mở `?tab=team` → về "Tổng quan"; mở hồ sơ sale khác → khối khoá; hồ sơ mình không có "Thao tác".
- Quản lý: đủ 7 tab, có "xem theo", có "Thao tác".

AC-5: Chặn ở máy chủ (P-01)
- Gọi API sửa / xoá / đổi owner ngoài phạm vi → 403, dữ liệu không đổi.
- Gọi API danh sách với tham số lọc owner khác mình (sale) → vẫn chỉ trả bản ghi của mình.

# PHỤ LỤC

## A. Câu chữ giao diện

| Chỗ | Câu chữ |
|---|---|
| Khối khoá trang chi tiết | "Bạn không có quyền xem {lead / deal / hồ sơ sale} này" · "Bản ghi thuộc sale khác. Liên hệ trưởng nhóm / quản lý nếu cần." · nút "Về danh sách Leads" / "Về Deals" / "Về Sales" |
| Ô owner bị khoá khi tạo | tên người dùng + "Chỉ trưởng nhóm / quản lý được giao cho sale khác" |
| Bấm sửa owner khi không có quyền | "Chỉ trưởng nhóm / quản lý được đổi" (hiện 1,6 giây) |

## B. Dữ liệu (gợi ý BE)

Bộ quyền gán theo người dùng (bảng RBAC của ERP):

```json
{
  "user_id": "u_123",
  "crm_permission_set": "sale",
  "crm": {
    "lead": { "view": "own", "edit": "own", "delete": "own" },
    "deal": { "view": "own", "edit": "own", "delete": "own" },
    "assign_records": false,
    "manage_sales_team": false
  }
}
```

- `crm_permission_set`: `"manager"` | `"sale"`; bộ "manager" có `view/edit/delete = "all"`, `assign_records = true`, `manage_sales_team = true`.
- Owner nên lưu bằng id: `lead.owner_id`, `deal.sale_id` (hiện ERP lưu tên ở `sale_ph_tr_ch`). Đổi tên sale khi đó không phải cập nhật lại bản ghi.

## C. API

| API | Kiểm quyền |
|---|---|
| `GET /leads`, `GET /deals` (cả đếm, tìm kiếm, xuất file) | Thêm điều kiện `owner_id = me` khi `view = own`. Bỏ qua tham số lọc owner khác của client. |
| `GET /leads/:id`, `GET /deals/:id` | Ngoài phạm vi xem → 403 `CRM_FORBIDDEN`. |
| `PATCH /leads/:id`, `PATCH /deals/:id` | Ngoài phạm vi sửa → 403 `CRM_FORBIDDEN`. Đổi owner khi `assign_records = false` → 403 `CRM_ASSIGN_FORBIDDEN`. |
| `POST /leads`, `POST /deals`, convert lead → deal | `assign_records = false`: owner phải = me, khác thì 403 `CRM_ASSIGN_FORBIDDEN` (hoặc máy chủ tự gán me, chọn một cách và ghi rõ). |
| `DELETE` (đơn và hàng loạt) | Ngoài phạm vi xoá → 403; xoá hàng loạt: từ chối cả lô nếu có bản ghi ngoài phạm vi. |
| Thêm / sửa sale, chuyển giao bản ghi | `manage_sales_team = false` → 403. |
| Báo cáo deal | Lọc dữ liệu như `GET /deals`. |

| Mã lỗi | HTTP | Ý nghĩa |
|---|---|---|
| `CRM_FORBIDDEN` | 403 | Không có quyền xem / sửa / xoá bản ghi |
| `CRM_ASSIGN_FORBIDDEN` | 403 | Không có quyền giao bản ghi cho sale khác |

## D. Lệch so với prototype

- Prototype suy bộ quyền từ "Vai trò" của sale (BR-03); bản thật đọc từ RBAC.
- Prototype có công tắc demo "Đăng nhập là" (nút "⚙ Giao diện" góc trái dưới) để đổi người đang dùng. Chỉ để minh hoạ, không làm ở bản thật.
- Prototype lọc ở FE (`HXC.perm` trong `crm-objects.js`); bản thật bắt buộc lọc ở máy chủ (BR-06).
- Prototype so owner bằng tên.

## E. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai |
|---|---|---|
| 1 | Sale có được xoá lead / deal của mình không? Prototype đang cho xoá. | PO |
| 2 | Lead chưa có owner: sale có được thấy và tự nhận không (HubSpot có mức "Của mình hoặc chưa có owner")? Prototype: chỉ quản lý thấy. | PO |
| 3 | Contact và Company có áp cùng quy tắc "Của mình" không? Prototype: chưa áp. | PO |
| 4 | Card liên kết trên Contact / Company hiện lead / deal của sale khác thế nào: ẩn, hiện tên không có link, hay hiện như prototype? | PO |
| 5 | Hoạt động / task: sale có thấy hoạt động của sale khác trên cùng contact? Báo cáo hoạt động theo sale có hiện số của người khác? Prototype: chưa giới hạn. | PO |
| 6 | Sale có được giao task cho sale khác không? Prototype: có. | PO |

## F. Tài liệu liên quan

- CRM-04 Deals, CRM-08 Sales, CRM-07 Báo cáo.
- Prototype: `crm-objects.js` (khối "Phân quyền"), `crm-leads.js`, `crm-giao-dich-hubspot.html`, `crm-record-hubspot.html`, `crm-sales-hubspot.html`, `crm-bao-cao-hubspot.html`.
- HubSpot: "HubSpot user permissions guide", "Assign access to records" (knowledge.hubspot.com).

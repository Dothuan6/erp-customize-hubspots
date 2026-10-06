# F03-S4 — Trường tuỳ chỉnh và cấu hình hiển thị

> **Trạng thái:** 💡 Proposed · v1.1 · 01/10/2026 · chờ review
> **Loại:** spec nền (tầng A), mở rộng `F03-collections-data-layer.md` (CollectionField, View)
> **Tính năng sở hữu:** không sở hữu ID nào trong sheet; là phần BE của TB-03, TB-04, TB-05, TB-07, L-06, L-07 và phần lưu trạng thái của C-04, C-10, C-15
> **Phục vụ:** TB-01 → TB-07 (giao diện ở `CRM-09`), L-06, L-07 (`CRM-06`), C-04, C-10, C-15, C-18 (`CRM-01`, `CRM-02`)
> **Phụ thuộc:** F03 (`CollectionField`, `View`, API sửa schema, `CollectionSnapshot`) · F01 (quyền `collection.update_schema`)
> **Được dùng bởi:** `CRM-01` §4.4, §4.5, §4.10, §4.11, §5.2, §5.6 · `CRM-02` §3.2, §5.3 · `CRM-06` §4.3, §4.6 · `CRM-09`
> **Nguồn:** prototype `crm-record-hubspot.html` (`drawExtra`, `extraCfg`, `newFieldDlg`), `crm-objects.js` (`extraKeys`, `setExtra`, `addCustomField`, `editCols` của trình sửa line item), `crm-shared.js` (`TYPES`) · `DOI-CHIEU-CHUC-NANG.md` §9.1, §15, §17 · plan QĐ-08

---

## 0. Tóm tắt

Spec này làm bốn việc:

1. **Tạo trường từ ngoài trang Quản lý trường.** Người có quyền tạo trường ngay trên trang chi tiết bản ghi (CRM-09) hoặc trong trình sửa line item (CRM-06). Trường tạo sau bộ trường gốc được đánh dấu "tuỳ chỉnh", có mô tả, để giao diện gắn nhãn "Mới" và nhóm riêng.
2. **Trường đi cặp.** Tạo một thuộc tính line item thì tự tạo trường cùng key trên sản phẩm để làm giá trị mặc định (L-07).
3. **Cấu hình hiển thị dùng chung theo collection.** Danh sách trường hiện trong card "Trường bổ sung" của mọi bản ghi cùng loại (TB-05, TB-07).
4. **Trạng thái giao diện theo người dùng.** Mật độ bảng, ẩn hiện thanh bộ lọc, thứ tự nút nhanh, mục đang thu gọn, cột của trình sửa line item. Kèm hai bổ sung cho View của F03: danh sách bộ lọc nhanh và trường làm cột board.

---

## 1. Vấn đề

| Hiện trạng | Hệ quả |
|---|---|
| Thêm trường chỉ làm được ở trang Quản lý trường của từng collection, qua API sửa schema | Sale muốn thêm "Mã số thuế" cho công ty phải rời trang, tìm tới Quản lý trường |
| `CollectionField` không phân biệt trường gốc với trường người dùng thêm sau, không có mô tả | Không gắn được nhãn "Mới" (TB-04), không có tooltip mô tả |
| Không có cách nói "trường X của sản phẩm là giá trị mặc định cho trường X của line item" | Tự điền từ sản phẩm (L-07) không làm được một cách có quy tắc |
| Không có chỗ lưu cấu hình hiển thị dùng chung cho trang chi tiết | Card "Trường bổ sung" không biết hiện trường nào |
| Mật độ bảng lưu `localStorage` theo trình duyệt (DS-HUBSPOT bản 1.0) | Đổi máy là mất; không nhất quán giữa các màn |
| View của F03 chưa có chỗ cho danh sách bộ lọc nhanh | "Bộ lọc nhanh là một phần của view" (CRM-01 §4.5) không lưu được |

### 1.1 Trong phạm vi

- Thuộc tính mới trên `CollectionField`: nguồn gốc, mô tả, người tạo, trường đi cặp.
- Quy tắc tạo trường tuỳ chỉnh: loại được phép, sinh key, kiểm trùng tên, giới hạn.
- Trường đi cặp: tạo, đổi tên, đổi lựa chọn, xoá.
- Cấu hình "Trường bổ sung" theo collection và API.
- Bảng trạng thái giao diện theo người dùng, danh sách khoá được phép, API.
- Bổ sung `View`: `quickFiltersJSON`, `kanbanFieldSlug`.

### 1.2 Ngoài phạm vi

- Trang Quản lý trường giữ nguyên chức năng; chỉ thêm cột Mô tả và nhãn Tuỳ chỉnh (§6).
- Tuỳ biến bố cục trang chi tiết kiểu "Customize" của HubSpot (CRM-01 §1).
- Trường tính do người dùng tự tạo (F03-S2 §1.2).
- Quyền theo từng trường (ẩn trường với một số vai trò). F03 đã có `audit_only`, không mở rộng thêm.

---

## 2. Khái niệm

| Từ | Nghĩa |
|---|---|
| **Trường gốc** | Trường có trong bộ trường ban đầu của collection. Với collection CRM mới: trường do script CRM-00 tạo. Với `Deals_Pipeline`: 17 trường hiện có cộng trường CRM-00 thêm |
| **Trường tuỳ chỉnh** | Trường được tạo sau đó, từ bất kỳ đâu (trang chi tiết, trình sửa line item, Quản lý trường, API) |
| **Trường đi cặp** | Hai trường cùng key ở hai collection, luôn cùng tên, cùng loại, cùng lựa chọn. Dùng cho thuộc tính line item và giá trị mặc định trên sản phẩm |
| **Trường bổ sung** | Card trên trang chi tiết (CRM-09) hiện các trường không nằm trong card thuộc tính chính |
| **Trạng thái giao diện** | Tuỳ chọn hiển thị của một người, không ảnh hưởng người khác và không phải dữ liệu nghiệp vụ |

---

## 3. Dữ liệu

### 3.1 Bổ sung cho `CollectionField`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| `origin` | `VARCHAR(10)` | `base` hoặc `custom`. Mặc định `custom` cho mọi trường tạo mới. Script CRM-00 đặt `base` cho trường nó tạo. Khi triển khai, mọi trường đang có của mọi collection được đặt `base` |
| `description` | `VARCHAR(500)` null | Mô tả hiện khi rê chuột vào tên trường |
| `createdBy` | UUID null | Tài khoản tạo trường. Trường có trước khi triển khai để trống |
| `pairedWith` | JSON null | `{ "collection": "crm_products", "slug": "cf_so_user" }`. Ghi ở cả hai trường của cặp |

`createdAt` đã có trong F03.

### 3.2 Cấu hình "Trường bổ sung" theo collection

Thêm vào metadata collection thuộc tính `display_config` (JSON):

```json
{
  "extraFields": {
    "pinned": ["ph_thu_tr_tr_c", "ph_kh_i_t_o_setup", "s_ti_n_gi_m_gi"],
    "hidden": ["cf_ghi_chu_noi_bo"]
  }
}
```

Danh sách trường hiện trong card Trường bổ sung, theo thứ tự:

1. Các trường trong `pinned`, đúng thứ tự mảng.
2. Mọi trường `origin = custom` không nằm trong `pinned` và không nằm trong `hidden`, xếp theo `createdAt` tăng dần.

Trường tuỳ chỉnh **tự hiện** trừ khi bị tắt; trường gốc chỉ hiện khi được ghim. Máy chủ trả sẵn danh sách đã tính (§4.3); FE bỏ thêm trường đã có trong card thuộc tính chính (`keyProps`, CRM-01 §3).

Không có `display_config` thì coi như `pinned` và `hidden` rỗng.

### 3.3 Bảng `user_ui_state` — trạng thái giao diện theo người dùng

```prisma
model UserUiState {
  userId     String   @map("user_id") @db.Uuid
  key        String   @db.VarChar(120)
  value      Json                                   // tối đa 16 KB
  updatedAt  DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  @@id([userId, key])
  @@map("user_ui_state")
  @@schema("identity")
}
```

`UserPreferences` của F11 (giao diện sáng/tối, ngôn ngữ, mật độ chung) giữ nguyên. Bảng này dành cho trạng thái theo từng màn, theo từng collection, số lượng khoá nhiều và thay đổi theo tính năng.

**Khoá được phép.** Máy chủ chỉ nhận khoá khớp một mẫu trong bảng dưới. `{c}` là slug collection người dùng đọc được.

| Mẫu khoá | Giá trị | Dùng ở |
|---|---|---|
| `crm.list.{c}.density` | `"comfortable"` hoặc `"compact"` | CRM-01 §4.11 |
| `crm.list.{c}.quickFilterBar` | `{ "hidden": boolean }` | CRM-01 §4.4 |
| `crm.record.quickActions` | `{ "order": ["NOTE","EMAIL","CALL","TASK","MEETING"] }`: đúng 5 mã của 5 nút đầu (Ghi chú, Email, Gọi, Task, Họp), không trùng. Nút "Thêm" luôn đứng cuối, không nằm trong thứ tự | CRM-01 §5.2 |
| `crm.record.{c}.overview` | `{ "collapsed": ["overview","health"] }` | CRM-02 §5.3, CRM-03 §5.3 |
| `crm.record.{c}.cards` | `{ "collapsed": ["keyProps","extraFields","jn:crm_contact_companies", …] }` | CRM-01 §5, CRM-09 §3 |
| `crm.record.{c}.assocCardProps` | `{ "jn:crm_contact_companies": ["domain","phone"], … }`: thuộc tính hiện trên thẻ của từng card liên kết, theo `associationId` | CRM-01 §5.6 (nút ⚙ của card liên kết) |
| `crm.list.{c}.lastView` | `{ "viewId": "…" }`: tab view đang mở lần trước | CRM-02 §3.2 |
| `crm.sales.list` | `{ "period": "month" \| "quarter" \| "year", "view": "all" \| "me" \| "<team>", "sort": { "k": "wonAmount", "dir": "desc" } }` | CRM-08 §4.2, §4.3 |
| `crm.lineItems.editorColumns` | `{ "columns": ["billing_frequency","discount","cf_so_user"] }` | CRM-06 §4.6 |

Nút "Email" bị vô hiệu (A-15) nhưng vẫn là một vị trí trong thứ tự.

### 3.4 Bổ sung cho `View` của F03

| Cột | Kiểu | Ghi chú |
|---|---|---|
| `quickFiltersJSON` | JSON, mặc định `null` | `[{ "field": "owner_id" }, { "field": "_createdAt" }, …]`, đúng thứ tự trên thanh. `null` nghĩa là dùng `quickFilters` mặc định của đối tượng (CRM-01 §3). Giá trị đang chọn của bộ lọc nhanh lưu trong `filterJSON` như mọi điều kiện lọc khác |
| `kanbanFieldSlug` | `VARCHAR(50)` null | Trường làm cột board (CRM-01 §4.10 "Cột theo"). `null` nghĩa là dùng `board.field` của đối tượng. Không dùng `groupJSON` vì F03 dành cột đó cho nhóm dòng của dạng bảng. Nếu Kanban hiện tại của ERP đã lưu trường này ở chỗ khác thì dùng chỗ đó (Q5) |

---

## 4. API

### 4.1 Tạo trường tuỳ chỉnh

Dùng API sửa schema có sẵn của F03 (`PATCH /api/v1/collections/:slug/schema`, thao tác thêm trường), bổ sung các thuộc tính:

```json
{
  "add": [{
    "name": "Mã số thuế",
    "type": "TEXT",
    "description": "Mã số doanh nghiệp in trên hoá đơn",
    "showInExtra": true,
    "pair": null
  }]
}
```

**Loại được phép khi tạo từ trang chi tiết và trình sửa line item** (10 loại): Văn bản · Văn bản dài · Số · Tiền tệ · Ngày · Ngày giờ · Lựa chọn đơn · Hộp kiểm · Người dùng · Đường dẫn.

- **Không có "Lựa chọn nhiều"**, dù hộp tạo trường của prototype có (sheet TB-03 ghi 11 loại). Lựa chọn nhiều lưu một mảng giá trị, trái quyết định cố định của dự án "không dùng kiểu dữ liệu array". Trang Quản lý trường của ERP vẫn giữ loại này cho collection khác; spec không đổi trang đó.
- Không có Liên kết, Tệp đính kèm, Trạng thái, Công thức, Tổng hợp: các loại này cần cấu hình thêm và nên làm ở Quản lý trường.
- Trình sửa line item (CRM-06 §4.6) chỉ đưa ra 5 loại: Văn bản, Số, Ngày, Lựa chọn đơn, Hộp kiểm.
- Loại khác gửi qua đường này trả `422 FIELD_TYPE_NOT_ALLOWED`. Quản lý trường gọi API không kèm `source: "inline"` nên không bị giới hạn.

FE gửi thêm `"source": "inline"` khi tạo từ trang chi tiết hoặc trình sửa line item để máy chủ áp danh sách loại trên.

**Sinh key.** Khi không gửi `slug`, máy chủ sinh `cf_` + tên bỏ dấu, chữ thường, khoảng trắng và ký tự đặc biệt thành `_`, gộp `_` liên tiếp, cắt còn 50 ký tự. Trùng key có sẵn thì thêm `_2`, `_3`… Ví dụ "Mã số thuế" → `cf_ma_so_thue`. Việc này cần API cho phép chỉ định key (CRM-00 Q1); nếu không, dùng key F03 tự sinh và bỏ tiền tố `cf_`, mọi chỗ khác không đổi.

**Kiểm tra**

| Điều kiện | Lỗi |
|---|---|
| Tên trống hoặc dài hơn 60 ký tự | `422 FIELD_NAME_INVALID` |
| Trùng tên trường khác của collection, so không phân biệt hoa thường và bỏ dấu ("Mã số thuế" trùng "ma so thue") | `409 FIELD_NAME_DUPLICATE`, `details.existingSlug` |
| Lựa chọn đơn không có lựa chọn nào; lựa chọn trùng nhau sau khi bỏ khoảng trắng | `422 FIELD_CHOICES_INVALID` |
| Collection đã có 100 trường tuỳ chỉnh | `422 CUSTOM_FIELD_LIMIT` |
| Mô tả dài hơn 500 ký tự | `422 FIELD_DESCRIPTION_TOO_LONG` |

**Kết quả**

- Trường mới có `origin = custom`, `createdBy` là người gọi, `position` cuối cùng.
- Như mọi lần sửa schema của F03: `schemaVersion + 1`, tạo `CollectionSnapshot`, bản ghi cũ đọc được với giá trị `null`.
- `showInExtra = false` thì slug được thêm vào `display_config.extraFields.hidden` trong cùng giao dịch. `true` (mặc định) thì không cần làm gì vì trường tuỳ chỉnh tự hiện (§3.2).
- Phản hồi trả định nghĩa trường đầy đủ để FE mở ngay ô nhập giá trị (TB-03).
- Quyền: `collection.update_schema` trên collection (với cặp: trên cả hai collection).
- Workflow đang chạy trên collection không bị ảnh hưởng: workflow tham chiếu trường theo key, trường mới không có key trùng.

### 4.2 Trường đi cặp

Gửi `pair` khi tạo:

```json
{ "add": [{ "name": "Số user", "type": "NUMBER", "source": "inline",
            "pair": { "collection": "crm_products", "nameSuffix": " (mặc định)" } }] }
```

- Tạo trường trên collection chính **và** trường cùng slug trên collection cặp, trong một giao dịch. Trường cặp tên là tên chính cộng `nameSuffix` ("Số user (mặc định)"), cùng loại, cùng lựa chọn, `origin = custom`, `pairedWith` trỏ qua lại.
- Slug phải trống ở cả hai collection; trùng ở một bên thì thêm hậu tố cho cả hai để giữ cùng key.
- Trùng tên ở collection cặp (sau khi thêm hậu tố): `409 FIELD_NAME_DUPLICATE` kèm `details.collection`.
- Đổi tên, đổi mô tả, thêm, đổi tên, bỏ lựa chọn của một trường: máy chủ áp cùng thay đổi cho trường kia trong cùng giao dịch (tên trường cặp giữ hậu tố).
- Đổi loại trường: không cho với trường đi cặp (`422 PAIRED_FIELD_TYPE_LOCKED`).
- Xoá một trường: trang Quản lý trường hỏi "Trường này đi cặp với {collection}.{tên}. Xoá cả hai?"; API xoá cả hai khi có `cascadePair: true`, không có thì trả `409 PAIRED_FIELD` để giao diện hỏi.
- Collection cặp được phép khai báo trong code, không phải tuỳ ý: giai đoạn này chỉ có `crm_line_items` → `crm_products`. Cặp khác trả `422 PAIR_NOT_ALLOWED`.

Việc dùng giá trị mặc định (chép từ sản phẩm sang line item khi thêm từ thư viện) làm ở CRM-06 §4.3, không phải ở tầng này.

### 4.3 Cấu hình Trường bổ sung

```
GET /api/v1/collections/:slug/display-config/extra-fields
→ { "pinned": [...], "hidden": [...], "resolved": ["ph_thu_tr_tr_c", "cf_ma_so_thue", ...] }

PUT /api/v1/collections/:slug/display-config/extra-fields
{ "pinned": [...], "hidden": [...] }
```

- `resolved` là danh sách đã tính theo §3.2, bỏ trường người gọi không được xem (`audit_only`).
- PUT thay toàn bộ hai mảng. Slug không tồn tại: `422 FIELD_NOT_FOUND` kèm slug. Một slug nằm ở cả hai mảng: `422`. `pinned` tối đa 30.
- Trường bị xoá: máy chủ tự bỏ slug khỏi hai mảng.
- Quyền PUT: `collection.update_schema` (Q2). GET: đọc được collection.
- Mỗi lần PUT ghi `audit.audit_events` (F03) để biết ai đổi cấu hình dùng chung.

### 4.4 Trạng thái giao diện

```
GET    /api/v1/me/ui-state?keys=crm.list.crm_contacts.density,crm.record.quickActions
       → { "crm.list.crm_contacts.density": "compact", "crm.record.quickActions": null }
PUT    /api/v1/me/ui-state/:key        { "value": ... }
DELETE /api/v1/me/ui-state/:key
```

- Chỉ đọc, ghi của chính mình.
- Khoá không khớp mẫu §3.3: `400 UI_STATE_KEY_UNKNOWN`. Giá trị sai dạng: `422 UI_STATE_VALUE_INVALID`. Quá 16 KB: `413`.
- Khoá chưa có giá trị: trả `null`; FE dùng mặc định.
- FE đọc một lượt các khoá cần cho màn khi mở màn, ghi lại mỗi khi người dùng đổi (gộp các lần ghi trong 500 ms). Lỗi đọc, ghi **không** chặn giao diện: dùng mặc định và thử lại ở lần đổi sau.
- Một người tối đa 500 khoá. Vượt thì xoá khoá cũ nhất theo `updatedAt`.

### 4.5 Danh sách trường trả thêm thông tin

`GET /api/v1/collections/:slug/schema` (F03) trả thêm cho mỗi trường: `origin`, `description`, `createdAt`, `createdBy` (tên người tạo), `pairedWith`. Giao diện dùng `origin` để chia nhóm "Trường mới / tuỳ chỉnh" và "Trường có sẵn" (CRM-09 §5), để gắn nhãn "tuỳ chỉnh" ở cột line item (CRM-06 §4.6).

### 4.6 Mã lỗi mới

| HTTP | Code | Khi nào |
|---|---|---|
| 422 | `FIELD_TYPE_NOT_ALLOWED` | Loại không nằm trong danh sách cho tạo nhanh (§4.1) |
| 422 | `FIELD_NAME_INVALID` | Tên trống hoặc quá dài |
| 409 | `FIELD_NAME_DUPLICATE` | Trùng tên (§4.1, §4.2) |
| 422 | `FIELD_CHOICES_INVALID` | Lựa chọn thiếu hoặc trùng |
| 422 | `FIELD_DESCRIPTION_TOO_LONG` | Mô tả quá 500 ký tự |
| 422 | `CUSTOM_FIELD_LIMIT` | Quá 100 trường tuỳ chỉnh |
| 422 | `PAIR_NOT_ALLOWED` | Cặp collection không được khai báo |
| 422 | `PAIRED_FIELD_TYPE_LOCKED` | Đổi loại trường đi cặp |
| 409 | `PAIRED_FIELD` | Xoá trường đi cặp không kèm `cascadePair` |
| 400 | `UI_STATE_KEY_UNKNOWN` | Khoá trạng thái giao diện không hợp lệ |
| 422 | `UI_STATE_VALUE_INVALID` | Giá trị trạng thái giao diện sai dạng |

---

## 5. Triển khai trên dữ liệu có sẵn

- Chạy một lần: đặt `origin = base` cho mọi trường đang có của mọi collection. Trường tạo sau thời điểm này mặc định `custom`.
- Script CRM-00 tạo trường với `origin = base` (kể cả khi chạy sau mốc trên), và ghi `display_config.extraFields.pinned` cho `Deals_Pipeline` theo TB-07: Phí thuê trả trước, Phí khởi tạo, Số tiền giảm giá (CRM-09 §9).
- Mật độ bảng đang lưu `localStorage` (nếu bản ERP hiện tại có) không chuyển sang; người dùng chọn lại một lần.

---

## 6. Giao diện ở tầng nền

Trang Quản lý trường (`crm-quan-ly-truong-hubspot.html`, màn `/data/:id/fields` của ERP):

- Thêm cột "Mô tả" (cắt một dòng, rê chuột hiện đủ) và cho sửa mô tả trong hộp sửa trường.
- Trường `origin = custom` có nhãn nhỏ "Tuỳ chỉnh" cạnh tên; rê chuột hiện "Tạo bởi {tên} ngày {dd/mm/yyyy}".
- Trường đi cặp có dòng nhỏ "Đi cặp với {tên collection}.{tên trường}".
- Không có thay đổi nào khác.

---

## 7. Tiêu chí nghiệm thu

**AC-F03S4-1 — Tạo trường tuỳ chỉnh**
Given người có `collection.update_schema` trên `crm_companies`
When tạo trường "Mã số thuế", loại Văn bản, mô tả "Mã số doanh nghiệp in trên hoá đơn", `source: inline`
Then trường có slug `cf_ma_so_thue`, `origin = custom`, `createdBy` là người gọi; `schemaVersion` tăng 1; `extra-fields.resolved` có `cf_ma_so_thue`.

**AC-F03S4-2 — Trùng tên không phân biệt dấu**
Given `crm_companies` đã có "Mã số thuế"
When tạo "ma so thue"
Then trả `409 FIELD_NAME_DUPLICATE` với `details.existingSlug = cf_ma_so_thue`.

**AC-F03S4-3 — Không có Lựa chọn nhiều khi tạo nhanh**
Given tạo trường với `source: inline`
When gửi loại Lựa chọn nhiều
Then trả `422 FIELD_TYPE_NOT_ALLOWED`.

**AC-F03S4-4 — Tắt hiện ở Trường bổ sung**
Given tạo trường "Ghi chú nội bộ" với `showInExtra: false`
When đọc `extra-fields`
Then slug nằm trong `hidden`, không nằm trong `resolved`.

**AC-F03S4-5 — Trường đi cặp**
Given người có quyền sửa schema cả `crm_line_items` và `crm_products`
When tạo "Số user" loại Số với `pair` tới `crm_products`
Then có `crm_line_items.cf_so_user` "Số user" và `crm_products.cf_so_user` "Số user (mặc định)", `pairedWith` trỏ qua lại; đổi tên thành "Số người dùng" thì bên sản phẩm thành "Số người dùng (mặc định)".

**AC-F03S4-6 — Xoá trường đi cặp**
Given cặp `cf_so_user`
When xoá trường bên line item không kèm `cascadePair`
Then trả `409 PAIRED_FIELD`; gửi lại có `cascadePair: true` thì cả hai bị xoá.

**AC-F03S4-7 — Thứ tự Trường bổ sung**
Given `pinned = [A, B]`, trường tuỳ chỉnh C tạo 01/09, D tạo 15/09, `hidden = [D]`
When đọc `extra-fields.resolved`
Then là `[A, B, C]`.

**AC-F03S4-8 — Trạng thái giao diện theo người dùng**
Given Minh đặt `crm.list.crm_contacts.density = compact` trên máy A
When Minh mở danh sách Contacts trên máy B; Lan mở trên máy của Lan
Then Minh thấy bảng Gọn; Lan thấy bảng Thoáng (mặc định).

**AC-F03S4-9 — Khoá lạ**
Given API trạng thái giao diện
When PUT khoá `abc.xyz`
Then trả `400 UI_STATE_KEY_UNKNOWN`.

**AC-F03S4-10 — Bộ lọc nhanh đi theo view**
Given view "Contacts khu vực HN" lưu `quickFiltersJSON` gồm Contact owner, Thành phố
When người khác mở view đó
Then thanh bộ lọc nhanh có đúng hai nút đó theo thứ tự đó.

---

## 8. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-F03S4-01 | API | Tạo "Kênh ưa thích!!" | slug `cf_kenh_ua_thich` |
| TC-F03S4-02 | API | Tạo hai trường tên khác nhau cùng ra slug `cf_ma_kh` | Trường thứ hai `cf_ma_kh_2` |
| TC-F03S4-03 | API | Tạo Lựa chọn đơn với lựa chọn "A", " A " | 422 FIELD_CHOICES_INVALID |
| TC-F03S4-04 | API | Tạo trường thứ 101 | 422 CUSTOM_FIELD_LIMIT |
| TC-F03S4-05 | API | Tạo trường không có quyền `collection.update_schema` | 403 |
| TC-F03S4-06 | API | Tạo cặp khi chỉ có quyền trên `crm_line_items` | 403, không tạo gì |
| TC-F03S4-07 | API | Tạo cặp tới `crm_contacts` | 422 PAIR_NOT_ALLOWED |
| TC-F03S4-08 | API | Đổi loại trường đi cặp | 422 PAIRED_FIELD_TYPE_LOCKED |
| TC-F03S4-09 | API | Thêm lựa chọn cho trường line item đi cặp | Trường sản phẩm có lựa chọn đó |
| TC-F03S4-10 | API | PUT `extra-fields` có slug ở cả `pinned` và `hidden` | 422 |
| TC-F03S4-11 | API | Xoá trường đang nằm trong `pinned` | Slug tự bỏ khỏi `pinned` |
| TC-F03S4-12 | API | `resolved` với trường `audit_only` mà người gọi không được xem | Không có trường đó |
| TC-F03S4-13 | API | PUT `crm.record.quickActions` có 4 mã | 422 UI_STATE_VALUE_INVALID |
| TC-F03S4-14 | API | PUT giá trị 20 KB | 413 |
| TC-F03S4-15 | API | Người dùng có 500 khoá, ghi khoá thứ 501 | Khoá cũ nhất bị xoá, khoá mới được ghi |
| TC-F03S4-16 | Script | Chạy đánh dấu `origin = base` hai lần | Không đổi gì ở lần hai |
| TC-F03S4-17 | API | `GET schema` | Mỗi trường có `origin`, `description`, `pairedWith` |
| TC-F03S4-18 | E2E | Quản lý trường: trường tuỳ chỉnh | Có nhãn "Tuỳ chỉnh", tooltip người tạo và ngày |

---

## 9. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Trường tự tạo của Contact, Company lưu `db.cf` trong trình duyệt; của Deal gọi `addField` giả | API sửa schema của F03 cho cả ba (§4.1) |
| Hộp tạo trường có 11 loại, gồm Lựa chọn nhiều | 10 loại, bỏ Lựa chọn nhiều (§4.1) |
| Key `cf_` + slug tự sinh ở FE | Máy chủ sinh key (§4.1) |
| Kiểm trùng tên so khớp chữ thường ở FE | Máy chủ kiểm, bỏ dấu (§4.1) |
| Trường "mới" của Deal = không nằm trong danh sách 17 key cứng | Cờ `origin` trên trường (§3.1) |
| `db.extra`, `db.extraOff` lưu trong trình duyệt | `display_config.extraFields` dùng chung (§3.2) |
| Giá trị mặc định sản phẩm lưu `product.defaults` | Trường đi cặp trên `crm_products` (§4.2) |
| Mật độ, cột trình sửa line item, thứ tự nút nhanh lưu `localStorage` hoặc bộ nhớ | `user_ui_state` (§3.3) |

---

## 10. Giả định và câu hỏi

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | QĐ-08: cấu hình Trường bổ sung dùng chung theo đối tượng, trạng thái giao diện theo người dùng (đề xuất mặc định). Đồng ý? | PO / khách | §3.2, §3.3 |
| Q2 | Ai được ghim trường ở card Trường bổ sung: chỉ người quản lý trường (như spec), hay mọi người dùng? | Khách | §4.3 |
| Q3 | Bỏ "Lựa chọn nhiều" khỏi hộp tạo trường nhanh để giữ quyết định không dùng array. Khách có cần loại này không? Nếu cần, phải làm bằng bảng nối | PO | §4.1 |
| Q4 | API sửa schema có cho chỉ định key không? (CRM-00 Q1) | BE | §4.1 |
| Q5 | Kanban hiện tại của ERP lưu trường làm cột ở đâu trong View? | BE | §3.4 |

---

## Liên kết

- Tầng dữ liệu gốc: `F03-collections-data-layer.md` §CollectionField, §View, §Schema
- Giao diện Trường bổ sung: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-09-truong-bo-sung.md`
- Line items: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-06-line-items-san-pham.md` §4.3, §4.6
- Khung CRM: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-01-khung-danh-sach-trang-chi-tiet.md`
- App shell, UserPreferences: `F11-dashboard-system-settings-app-shell.md`

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-09-30 | v1.0 — bản đầu | TTS (qua Claude) |
| 2026-10-01 | v1.1 — thêm khoá `crm.sales.list` (CRM-08) | TTS (qua Claude) |

# F03-S1 — Liên kết bản ghi hai chiều và bảng nối có nhãn

> **Trạng thái:** 💡 Proposed · v1.3 · 01/10/2026 · chờ review
> **Loại:** spec nền (tầng A), mở rộng `F03-collections-data-layer.md`
> **Tính năng sở hữu:** G-03
> **Phục vụ:** C-07, C-20, CO-05, D-05, D-09, QH-02, QH-04, QH-05 (và mọi màn có card liên kết)
> **Khách hàng đầu tiên dùng:** CRM theo UX HubSpot (`TTB/outputs/erp-customize-hubspots/specs/CRM-00-mo-hinh-du-lieu-chuyen-doi.md`)
> **Nguồn:** F03 §Record, §Database Design (`RecordRelation`), §Edge Cases "Record relation target deleted", §MVP Scope · `DOI-CHIEU-CHUC-NANG.md` §3, §4 · prototype `crm-objects.js` (`assoc`, `associate`, `dissociate`)

---

## 0. Tóm tắt

Spec này bổ sung ba chức năng cho lớp dữ liệu, áp dụng cho **mọi collection**, không riêng CRM:

1. **Truy vấn ngược.** Từ một bản ghi, lấy được các bản ghi đang có trường Liên kết trỏ tới nó. Ví dụ: mở Company thấy các Deal có `company_id` là Company đó.
2. **Bảng nối có thuộc tính.** Đánh dấu một collection là bảng nối giữa hai collection khác. Engine tự đảm bảo mỗi cặp chỉ có một dòng, mỗi bản ghi tối đa một dòng Primary, và dòng nối bị xoá theo khi một bên bị xoá.
3. **API liên kết thống nhất.** Một bộ endpoint đọc, thêm, sửa nhãn, gỡ liên kết. Giao diện không cần biết liên kết được lưu bằng trường, bằng truy vấn ngược hay bằng bảng nối.

Kèm theo là cờ **`onDelete`** trên trường Liên kết (giữ / xoá theo / chặn), toán tử lọc **`linked_to_me`** (lọc "của tôi" qua bản ghi nhân viên) và sự kiện liên kết cho nhật ký (F03-S3).

---

## 1. Vấn đề

Hiện trạng trên ERP đang chạy (khảo sát 23/09) và theo F03:

| Hiện trạng | Hệ quả cho CRM |
|---|---|
| Trường Liên kết chỉ có **một chiều**. F03 §MVP Scope ghi rõ "Linked record bidirectional sync — MVP chỉ 1 chiều" | Mở Company không thấy Deal nào, dù Deal đã trỏ tới Company |
| Tab "Liên kết" ở drawer và trang chi tiết đang "sắp ra mắt" | Không có chỗ hiển thị card Contacts / Companies / Deals |
| Không có quan hệ nhiều–nhiều có thuộc tính; quy tắc dự án cấm lưu mảng | Deal – Contact kèm vai trò, Contact – Company kèm Primary không biểu diễn được |
| Trường Liên kết chỉ sửa được ở trang chi tiết | "Thêm Deal có sẵn" từ card của Company không làm được |
| Xoá bản ghi được trỏ tới: F03 chỉ giữ liên kết và hiện "(Đã xoá)" | Xoá Deal thì line item của nó vẫn nằm lại như rác |

F03 đã thiết kế bảng `record_relation` (mỗi giá trị trường Liên kết là một dòng, có index trên `target_record_id` để "reverse lookup cho rollup"). Spec này **dựng tiếp trên bảng đó** thay vì làm cơ chế mới.

### 1.1 Trong phạm vi

- API truy vấn ngược, API liên kết thống nhất, API lấy liên kết cho nhiều bản ghi một lượt.
- Khái niệm collection bảng nối, cấu hình và ràng buộc.
- Tạo bản ghi kèm liên kết trong một giao dịch.
- Cờ `onDelete` cho trường Liên kết.
- Toán tử lọc `linked_to_me` (§4.10).
- Sự kiện liên kết.
- Quyền đọc/ghi liên kết.
- Giao diện tối thiểu ở tầng nền: ô `onDelete` trong Quản lý trường, ẩn bảng nối khỏi menu Dữ liệu.
- API thống kê liên kết theo collection cho Sơ đồ quan hệ (§4.8).

### 1.2 Ngoài phạm vi

- Tự tạo trường ngược khi tạo trường Liên kết. Truy vấn ngược thay thế nhu cầu này.
- Lọc danh sách theo thuộc tính của bản ghi liên kết (ví dụ "Contacts có Deal giá trị > 100 triệu"). F03 đã loại "Cross-collection JOIN trong filter" và spec này giữ nguyên, trừ một trường hợp hẹp là toán tử `linked_to_me` ở §4.10.
- Giao diện tạo bảng nối cho người dùng cuối. Giai đoạn này bảng nối được tạo bằng API hoặc script (CRM-00 §11).
- Giao diện card liên kết kiểu HubSpot: ở `CRM-01`.
- Trường Liên kết **nhiều giá trị**. Spec này không mở rộng nó; nhu cầu nhiều–nhiều đi qua bảng nối.

---

## 2. Khái niệm

### 2.1 Ba cách hai bản ghi liên kết với nhau

| Loại | Lưu ở đâu | Ví dụ (CRM) | Bản số nhìn từ bản ghi đang mở |
|---|---|---|---|
| **Liên kết đi** (`field`) | Trường Liên kết trên chính bản ghi này | Deal → Company qua `Deals_Pipeline.company_id` | Một |
| **Liên kết đến** (`ref`) | Trường Liên kết trên bản ghi khác, trỏ tới bản ghi này | Company ← Deals có `company_id` là company này | Nhiều |
| **Qua bảng nối** (`junction`) | Một dòng trong collection bảng nối | Deal ↔ Contact qua `crm_deal_contacts` | Nhiều |

### 2.2 Mã liên kết (`associationId`)

Mỗi "kênh" đi từ một bản ghi sang một nhóm bản ghi khác có một mã. Giao diện và API chỉ làm việc với mã này.

| Loại | Mã | Ví dụ, nhìn từ một Company |
|---|---|---|
| Liên kết đi | `field:<key trường>` | `field:owner_id` → nhân viên sở hữu công ty |
| Liên kết đến | `ref:<slug collection nguồn>.<key trường>` | `ref:deals_pipeline.company_id` → các Deal của công ty |
| Qua bảng nối | `jn:<slug bảng nối>` | `jn:crm_contact_companies` → các Contact của công ty |

Slug thật của Deals_Pipeline cần BE xác nhận; spec viết tạm `deals_pipeline`.

Với bảng nối, cùng một mã `jn:<slug>` dùng được ở cả hai phía. Engine tự biết phía nào là "bản ghi đang mở" dựa vào collection của bản ghi.

**Trường hợp bảng nối nối một collection với chính nó** (ví dụ Company mẹ – Company con): mã có thêm hướng, `jn:<slug>:left` hoặc `jn:<slug>:right`. CRM chưa dùng trường hợp này. Spec ghi ra để mã không bị mơ hồ về sau.

### 2.3 Bảng nối

Bảng nối là một collection bình thường (có trường, có quyền, xem được trong Dữ liệu nếu cần), được đánh dấu `kind = junction` kèm cấu hình ở §3.1. Vì là collection thường nên:

- Thêm được trường khác ngoài hai trường Liên kết (ví dụ `role`, `is_pinned` ở bảng nối của Activities).
- Workflow trigger được khi có dòng nối mới (sự kiện `record.inserted` của bảng nối).
- Nhập, xuất bằng công cụ sẵn có của ERP.

---

## 3. Dữ liệu

### 3.1 Cấu hình bảng nối

Lưu trong metadata của collection, trường mới `junction_config` (JSON), rỗng với collection thường.

```json
{
  "left":  { "field": "contact_id" },
  "right": { "field": "company_id" },
  "labelField": "label",
  "primaryField": "is_primary",
  "primaryScope": "left",
  "autoPrimaryFirst": true,
  "permissionMode": "inherit",
  "hideInDataMenu": true,
  "pinField": null,
  "pinScope": null
}
```

| Thuộc tính | Bắt buộc | Ý nghĩa |
|---|---|---|
| `left.field`, `right.field` | ✓ | Key hai trường Liên kết. Phải là trường Liên kết **một giá trị**, có cờ Bắt buộc, trỏ tới collection đã tồn tại. Hai key phải khác nhau |
| `labelField` | | Key trường Lựa chọn đơn dùng làm nhãn liên kết. `null` nếu không có nhãn |
| `primaryField` | | Key trường Hộp kiểm đánh dấu Primary. `null` nếu không có Primary |
| `primaryScope` | khi có `primaryField` | `left` nghĩa là mỗi bản ghi bên trái tối đa một dòng Primary (Contact có một công ty chính). `right` ngược lại |
| `autoPrimaryFirst` | | Mặc định `true`. Dòng đầu tiên của một bản ghi phía `primaryScope` tự là Primary (§4.4) |
| `permissionMode` | | `inherit` (mặc định) hoặc `own`. Xem §6.2 |
| `hideInDataMenu` | | Mặc định `true`. Ẩn collection khỏi danh sách trong trang Dữ liệu; admin vẫn mở được bằng bộ lọc "Hiện bảng nối" |
| `pinField`, `pinScope` | | Key trường Hộp kiểm đánh dấu ghim, và phía (`left`/`right`) mà mỗi bản ghi tối đa một dòng ghim. Dùng cho ghim hoạt động trên timeline (F03-S6 §3.6). `null` nếu không có ghim |

Khi lưu cấu hình, engine kiểm các điều kiện trong bảng. Sai điều kiện nào thì trả `422 JUNCTION_CONFIG_INVALID` kèm tên thuộc tính sai.

Sau khi bảng nối đã có dòng, **không đổi được** `left.field`, `right.field`, `primaryScope`. Đổi `labelField`, `primaryField` và `hideInDataMenu` được.

Cấu hình của CRM (từ CRM-00):

| Bảng nối | left | right | labelField | primaryField | primaryScope |
|---|---|---|---|---|---|
| `crm_contact_companies` | `contact_id` | `company_id` | `label` | `is_primary` | `left` |
| `crm_deal_contacts` | `deal_id` | `contact_id` | `label` | — | — |
| `crm_activity_contacts` | `activity_id` | `contact_id` | `role` | — | — |
| `crm_activity_companies` | `activity_id` | `company_id` | — | — | — |
| `crm_activity_deals` | `activity_id` | `deal_id` | — | — | — |

Ba bảng nối hoạt động có thêm `pinField: "is_pinned"`, `pinScope: "right"`.

### 3.2 Bảng hệ thống `junction_pair`

Ràng buộc "mỗi cặp một dòng" cần so sánh hai trường trên cùng một bản ghi. Làm bằng index trên JSON của từng bảng nối thì phải tạo index động theo từng collection. Spec chọn một bảng hệ thống nhỏ, cập nhật cùng giao dịch với dòng nối:

```prisma
model JunctionPair {
  junctionCollectionId String    @map("junction_collection_id") @db.Uuid
  recordId             String    @id @map("record_id") @db.Uuid      // dòng trong bảng nối
  leftRecordId         String    @map("left_record_id") @db.Uuid
  rightRecordId        String    @map("right_record_id") @db.Uuid
  scopeRecordId        String?   @map("scope_record_id") @db.Uuid     // = left hoặc right theo primaryScope; rỗng nếu không có Primary
  isPrimary            Boolean   @default(false) @map("is_primary")
  isPinned             Boolean   @default(false) @map("is_pinned")    // theo pinField; chỉ bảng nối có ghim
  deletedAt            DateTime? @map("deleted_at") @db.Timestamptz(6)

  @@index([junctionCollectionId, leftRecordId])
  @@index([junctionCollectionId, rightRecordId])
  @@map("junction_pair")
  @@schema("data")
}
```

Index duy nhất có điều kiện (Prisma chưa khai báo được, viết trong migration SQL):

```sql
CREATE UNIQUE INDEX junction_pair_unique_active
  ON data.junction_pair (junction_collection_id, left_record_id, right_record_id)
  WHERE deleted_at IS NULL;

-- Mỗi bản ghi phía primaryScope tối đa một dòng Primary đang hoạt động
CREATE UNIQUE INDEX junction_pair_one_primary
  ON data.junction_pair (junction_collection_id, scope_record_id)
  WHERE is_primary AND deleted_at IS NULL;

-- Mỗi bản ghi phía pinScope tối đa một dòng ghim (hiện chỉ dùng pinScope = right)
CREATE UNIQUE INDEX junction_pair_one_pin
  ON data.junction_pair (junction_collection_id, right_record_id)
  WHERE is_pinned AND deleted_at IS NULL;
```

Index thứ hai bảo đảm ràng buộc Primary kể cả khi hai request đặt Primary chạy đồng thời: request đến sau gặp lỗi trùng và được thử lại sau khi bỏ Primary dòng cũ.

`junction_pair` là bản sao để kiểm ràng buộc và đọc nhanh. Nguồn sự thật vẫn là dòng trong bảng nối. Một job đối soát hằng đêm so hai bên và ghi lỗi nếu lệch.

### 3.3 Index bổ sung trên `record_relation`

F03 đã có index `(target_record_id)`. Truy vấn ngược theo từng kênh cần lọc thêm collection nguồn và trường:

```sql
CREATE INDEX record_relation_reverse
  ON data.record_relation (target_record_id, source_collection_id, relation_field_slug);
```

### 3.4 Cờ `onDelete` trên trường Liên kết

Thêm vào `config` của trường Liên kết (F03 `CollectionField.config`):

| Giá trị | Khi bản ghi được trỏ tới bị **xoá mềm** | Khi được khôi phục |
|---|---|---|
| `keep` (mặc định, như hiện nay) | Không làm gì. Trường hiển thị "(Đã xoá) Tên bản ghi" theo F03 | Liên kết hiển thị bình thường trở lại |
| `cascade` | Bản ghi nguồn bị xoá mềm theo, **trong cùng giao dịch**, và được đánh dấu `deleted_by_cascade_of = <id bản ghi bị xoá>` | Chỉ khôi phục các bản ghi nguồn có dấu `deleted_by_cascade_of` trùng id. Bản ghi đã bị xoá riêng từ trước thì không khôi phục |
| `restrict` | Từ chối xoá, trả `409 RELATION_RESTRICT` kèm số bản ghi đang trỏ tới | — |

Trường Liên kết của bảng nối (`left.field`, `right.field`) **luôn** hoạt động như `cascade`, bất kể giá trị cấu hình.

Quy tắc khi khôi phục theo:

- Dòng nối chỉ được khôi phục khi **cả hai đầu** đang hoạt động. Khôi phục A mà đầu kia (B) vẫn trong thùng rác thì dòng nối giữ nguyên trạng thái xoá, và dấu `deleted_by_cascade_of` đổi sang id của B. Sau này khôi phục B thì dòng đó được khôi phục.
- Dòng nối được khôi phục với `is_primary = true` mà bản ghi phía `primaryScope` **đã có dòng Primary khác** (người dùng đặt trong lúc dòng cũ bị xoá): dòng khôi phục về `is_primary = false`. Primary hiện tại được giữ.

`deleted_by_cascade_of` là cột mới trên bảng `record` (UUID, rỗng mặc định). Xoá theo có thể lan nhiều tầng (xoá Deal → xoá dòng nối Deal – Contact). Mỗi tầng ghi id của bản ghi **gốc** của lần xoá, để khôi phục gốc thì khôi phục đủ các tầng.

Xoá vĩnh viễn (dọn thùng rác sau 30 ngày): bản ghi có `deleted_by_cascade_of` bị xoá vĩnh viễn cùng bản ghi gốc. Quy tắc F03 hiện hành cho `keep` (không xoá vĩnh viễn khi còn liên kết đang hoạt động) giữ nguyên. Hệ quả: một Company còn Deal trỏ tới có thể nằm trong thùng rác quá 30 ngày. Câu "có thể khôi phục trong 30 ngày" trên giao diện vẫn đúng vì đó là thời hạn tối thiểu.

Cờ này dùng cho CRM-00: `crm_line_items.deal_id`, `crm_deal_adjustments.deal_id` và `crm_activity_comments.activity_id` là `cascade`; ba trường `owner_id` và `crm_activities.assignee_id` là `restrict`.

---

## 4. API

Tiền tố và định dạng phản hồi theo F03: `/api/v1/collections/:slug/...`, `{ status, data, meta }`, lỗi `{ status: "error", error: { code, message, details } }`.

### 4.1 Liệt kê các kênh liên kết của một bản ghi

```
GET /api/v1/collections/:slug/records/:id/associations
```

Trả mọi kênh mà bản ghi có: trường Liên kết đi, trường Liên kết từ collection khác trỏ tới collection này, bảng nối có collection này ở một bên.

```json
{
  "status": "success",
  "data": [
    {
      "associationId": "jn:crm_contact_companies",
      "kind": "junction",
      "target": { "slug": "crm_companies", "name": "Companies" },
      "cardinality": "many",
      "count": 2,
      "hasLabel": true,
      "hasPrimary": true,
      "canLink": true,
      "canCreate": true
    },
    {
      "associationId": "ref:deals_pipeline.company_id",
      "kind": "ref",
      "target": { "slug": "deals_pipeline", "name": "Deals" },
      "cardinality": "many",
      "count": 3,
      "hasLabel": false,
      "hasPrimary": false,
      "canLink": true,
      "canCreate": true
    }
  ]
}
```

- `count` chỉ đếm bản ghi người gọi **đọc được** (§6), không tính bản ghi đã xoá mềm.
- Kênh tới collection mà người gọi không có quyền đọc thì không trả về.
- `canLink`: người gọi có quyền thêm liên kết với bản ghi có sẵn. `canCreate`: có quyền tạo bản ghi mới ở collection đích.
- Tham số `?associationIds=a,b` để chỉ lấy một số kênh.

### 4.2 Lấy bản ghi của một kênh

```
GET /api/v1/collections/:slug/records/:id/associations/:associationId
    ?limit=20&cursor=...&fields=name,domain,phone&sort=...
```

```json
{
  "status": "success",
  "data": [
    {
      "record": { "_id": "rec_co13", "name": "Dược phẩm Thiên Phúc", "domain": "thienphucpharma.vn", "phone": "028 4021 1481" },
      "link": { "junctionRecordId": "rec_jn_881", "label": null, "isPrimary": true, "createdAt": "2026-09-01T02:00:00Z" }
    }
  ],
  "meta": { "total": 2, "pageSize": 20, "nextCursor": null }
}
```

- `limit` tối đa 200, mặc định 20; vượt thì hạ về 200 (`meta.pageSize` cho biết giá trị thật).
- `fields` giới hạn trường trả về của bản ghi đích. Bỏ trống thì trả cột hiển thị và các trường người gọi xem được.
- Thứ tự mặc định: Primary trước, sau đó theo `link.createdAt` giảm dần. Kênh không có Primary thì chỉ theo `createdAt`. `sort` nhận cú pháp F03 trên trường của bản ghi đích.
- `link` là `null` với kênh `field` và `ref` vì không có dòng nối.
- Bản ghi đích đã xoá mềm không trả về.

### 4.3 Lấy liên kết cho nhiều bản ghi một lượt

Dùng cho các cột lấy qua liên kết trên danh sách (ví dụ "Công ty chính"), để không phải gọi §4.2 cho từng dòng. Mở rộng dòng (C-07, CO-05, D-05) chỉ tải khi người dùng bấm vào một dòng nên dùng §4.2.

```
GET /api/v1/collections/:slug/associations/:associationId
    ?ids=rec_1,rec_2,rec_3&limit=5&fields=name&primaryOnly=false
```

```json
{
  "status": "success",
  "data": {
    "rec_1": { "items": [ { "record": { ... }, "link": { ... } } ], "total": 7 },
    "rec_2": { "items": [], "total": 0 }
  }
}
```

- `ids` tối đa 50; vượt thì trả `400`, vì cắt bớt id sẽ làm thiếu dữ liệu mà client không biết. `limit` là số bản ghi đích mỗi dòng, tối đa 10; vượt thì hạ về 10.
- `primaryOnly=true` chỉ trả dòng Primary (dùng cho cột "Công ty chính").
- `total` là tổng thật, để giao diện hiện "Xem thêm 2".

### 4.4 Thêm liên kết

```
POST /api/v1/collections/:slug/records/:id/associations/:associationId
{ "targetId": "rec_co14", "label": "Người quyết định", "isPrimary": false, "replace": false }
```

Hành vi theo loại kênh:

| Loại | Việc engine làm | Quyền cần |
|---|---|---|
| `field` | Ghi `targetId` vào trường Liên kết của bản ghi đang mở | Ghi trên bản ghi đang mở |
| `ref` | Ghi id bản ghi đang mở vào trường Liên kết của **bản ghi đích**. Ví dụ từ Company thêm Deal có sẵn: ghi `deal.company_id = company` | Ghi trên bản ghi đích |
| `junction` | Tạo một dòng trong bảng nối | §6.2 |

Trường hợp đặc biệt:

- `field` hoặc `ref` mà bản ghi (đang mở hoặc đích) **đã có giá trị khác**: nếu `replace` là `false` thì trả `409 ASSOCIATION_REPLACES` kèm bản ghi hiện tại, để giao diện hỏi "Deal này đang thuộc Công ty A. Chuyển sang Công ty B?". Gửi lại với `replace: true` thì ghi đè.
- `junction` mà cặp đã có dòng đang hoạt động: `409 ASSOCIATION_EXISTS`.
- `junction` mà cặp có dòng **đã xoá mềm**: khôi phục dòng đó (cập nhật nhãn, Primary theo request) thay vì tạo dòng mới. Trả `200` và `restored: true`.
- `isPrimary: true` với kênh có Primary: trong cùng giao dịch, bỏ Primary các dòng khác của cùng bản ghi phía `primaryScope`.
- Kênh có Primary mà bản ghi phía `primaryScope` **chưa có dòng nào**: dòng mới tự là Primary, kể cả khi request gửi `isPrimary: false`. Quy tắc này lấy từ CRM-00 §5.3; muốn tắt thì cấu hình `autoPrimaryFirst: false` trong `junction_config` (mặc định `true`).
- `label` không có trong danh mục của `labelField`: `422 VALIDATION_FAILED`.
- Không gửi `label` mà `labelField` có cờ Bắt buộc: dùng giá trị mặc định của trường (ví dụ `role` mặc định `Liên quan`, CRM-00 §5.11). Trường không có giá trị mặc định thì trả `422`.
- `targetId` không tồn tại, đã xoá mềm, hoặc không thuộc collection đích của kênh: `422 ASSOCIATION_TARGET_INVALID`.

Phản hồi `201` (hoặc `200` khi khôi phục / ghi đè):

```json
{ "status": "success", "data": { "associationId": "jn:crm_deal_contacts", "targetId": "rec_ct02",
  "link": { "junctionRecordId": "rec_jn_902", "label": "Người quyết định", "isPrimary": false }, "restored": false } }
```

### 4.5 Sửa nhãn hoặc Primary

```
PATCH /api/v1/collections/:slug/records/:id/associations/:associationId/:targetId
{ "label": "Kế toán / thanh toán", "isPrimary": true }
```

Chỉ áp dụng cho kênh `junction`. Kênh khác trả `422 ASSOCIATION_NOT_EDITABLE`. Không đổi được hai bản ghi hai đầu của dòng nối; muốn chuyển thì gỡ rồi thêm.

`isPrimary: false` trên dòng đang Primary: bỏ Primary, **không** tự chọn dòng khác (CRM-00 §5.3).

### 4.6 Gỡ liên kết

```
DELETE /api/v1/collections/:slug/records/:id/associations/:associationId/:targetId
```

| Loại | Việc engine làm |
|---|---|
| `field` | Đặt trường Liên kết của bản ghi đang mở về rỗng. Trường có cờ Bắt buộc thì trả `422 ASSOCIATION_REQUIRED` |
| `ref` | Đặt trường Liên kết của bản ghi đích về rỗng. Cùng quy tắc Bắt buộc |
| `junction` | Xoá mềm dòng nối |

Gỡ liên kết **không bao giờ** xoá bản ghi ở hai đầu.

### 4.7 Tạo bản ghi kèm liên kết

Mở rộng `POST /api/v1/collections/:slug/records` (F03) với khoá `_associations`:

```json
{
  "t_n_deal": "Dược phẩm Thiên Phúc - Deal mới",
  "giai_o_n_pipeline": "1. MQL Qualified",
  "_associations": [
    { "associationId": "field:company_id", "targetId": "rec_co13" },
    { "associationId": "jn:crm_deal_contacts", "targetId": "rec_ct01", "label": "Người quyết định" },
    { "associationId": "jn:crm_deal_contacts", "targetId": "rec_ct02" }
  ]
}
```

- Bản ghi và mọi liên kết được ghi trong **một giao dịch**. Một liên kết lỗi thì không có gì được ghi; lỗi trả theo từng phần tử: `details: [{ index: 1, path: "_associations[1]", code: "ASSOCIATION_TARGET_INVALID", ... }]`. Mọi API mới của CRM dùng cùng dạng `index` + `path`.
- Kênh `field` có thể gửi như trường thường (`"company_id": "rec_co13"`) hoặc trong `_associations`; kết quả như nhau. Gửi cả hai với giá trị khác nhau thì trả `422`.
- Mỗi phần tử nhận thêm `label`, `isPrimary`, `replace` với cùng ý nghĩa như API thêm liên kết (§4.4). Kênh `ref` được dùng, ví dụ tạo Company kèm các Deal (CRM-03 §4) qua `ref:deals_pipeline.company_id`: phần tử trỏ tới deal đang thuộc công ty khác mà không có `replace: true` làm cả request trả `409 ASSOCIATION_REPLACES`, `details` ghi từng phần tử bị vướng kèm công ty hiện tại.
- Tối đa 50 phần tử trong `_associations`.
- Dùng cho D-09 (tạo Deal từ card Deals của Contact/Company), C-13 (tạo Contact kèm công ty) và panel tạo Company kèm contact, deal (CRM-03 §4).

### 4.8 Thống kê liên kết theo collection

Dùng cho Sơ đồ quan hệ (QH-02, QH-04, QH-05; giao diện ở CRM-10). Một lần gọi trả cả số bản ghi, số thuộc tính, cách lưu và số liên kết của các kênh được hỏi, để trang sơ đồ không phải gọi từng collection.

```
POST /api/v1/associations/stats
```

```json
{
  "collections": [
    { "slug": "crm_contacts" },
    { "slug": "NhanVien", "where": { "is_sales": { "eq": true } } }
  ],
  "associations": [
    { "from": "NhanVien",     "associationId": "ref:crm_contacts.owner_id" },
    { "from": "crm_contacts", "associationId": "jn:crm_deal_contacts" }
  ]
}
```

| Thuộc tính | Ý nghĩa |
|---|---|
| `collections[].slug` | Tối đa 20 collection |
| `collections[].where` | Bộ lọc cú pháp F03 áp khi đếm số bản ghi của collection đó (ví dụ chỉ đếm nhân viên kinh doanh). Không ảnh hưởng số liên kết. Sai cú pháp, hoặc dùng trường người gọi không được xem: `400 ASSOCIATION_STATS_INVALID` |
| `associations[]` | Tối đa 40 kênh. `from` là collection nhìn sang, `associationId` theo §2.2 |

Phản hồi:

```json
{
  "status": "success",
  "data": {
    "collections": {
      "crm_contacts": { "exists": true, "readable": true, "records": 1248, "fieldCount": 17 },
      "NhanVien":     { "exists": true, "readable": true, "records": 12,   "fieldCount": 11 }
    },
    "associations": [
      { "from": "NhanVien", "associationId": "ref:crm_contacts.owner_id", "exists": true, "readable": true,
        "kind": "ref", "target": "crm_contacts", "cardinality": "1:N",
        "storage": { "collection": "crm_contacts", "field": "owner_id", "fieldName": "Contact owner" },
        "onDelete": "restrict", "count": 1190 },
      { "from": "crm_contacts", "associationId": "jn:crm_deal_contacts", "exists": true, "readable": true,
        "kind": "junction", "target": "deals_pipeline", "cardinality": "N:N",
        "storage": { "junction": "crm_deal_contacts",
                     "left": "deal_id", "leftCollection": "deals_pipeline",
                     "right": "contact_id", "rightCollection": "crm_contacts",
                     "labelField": "label", "primaryField": null, "primaryScope": null },
        "onDelete": "cascade", "count": 2310 }
    ],
    "computedAt": "2026-10-01T02:15:00Z"
  }
}
```

**Cách đếm**

| Mục | Đếm gì |
|---|---|
| `records` | Bản ghi đang hoạt động (không tính thùng rác) khớp `where` |
| `fieldCount` | Trường người gọi được xem, không tính trường hệ thống của F03 (id, ngày tạo, người tạo…); có tính trường tính |
| `count` của kênh `field`, `ref` | Số bản ghi chứa trường đang hoạt động, có giá trị ở trường đó, trỏ tới bản ghi đích đang hoạt động, và người gọi đọc được cả hai bản ghi |
| `count` của kênh `junction` | Số dòng nối đang hoạt động (hai đầu đều đang hoạt động) mà người gọi đọc được cả hai đầu. Bảng nối có `permissionMode: own` (§6.2) thì người gọi còn phải đọc được chính bảng nối, nếu không thì kênh là `readable = false` |

**Thông tin cấu trúc**

- `cardinality` nhìn từ `from`: `field` là `N:1`, `ref` là `1:N`, `junction` là `N:N`. Trang sơ đồ chọn chiều của kênh sao cho đọc tự nhiên (thường hỏi `ref` từ phía "một").
- `storage` với `field`, `ref`: collection và key của trường Liên kết, kèm tên hiển thị. Với `junction`: slug bảng nối, hai trường hai đầu kèm collection của từng đầu (`leftCollection`, `rightCollection`), `labelField`, `primaryField`, `primaryScope` lấy từ `junction_config` (§3.1).
- `onDelete`: giá trị cờ ở §3.4 của trường Liên kết (`keep`, `cascade`, `restrict`). Với `junction` luôn là `cascade` (dòng nối bị xoá theo khi một đầu bị xoá).

**Quyền**

"Đọc được một collection" theo quy tắc F03: có quyền đọc collection, hoặc là chủ sở hữu hệ thống của ít nhất một bản ghi trong đó.

- Collection người gọi không đọc được: chỉ trả `{ "readable": false }`, không trả `exists`, `records`, `fieldCount`. Người gọi không dò được một collection có tồn tại hay không, có bao nhiêu trường.
- Kênh mà người gọi không đọc được **cả hai** đầu: chỉ trả `{ "readable": false }`, không có thông tin cấu trúc.
- Kênh mà người gọi đọc được **một** đầu: `readable = false`, không trả `count`, nhưng vẫn trả `exists`, `kind`, `target`, `cardinality`, `storage`, `onDelete`. Người gọi đã thấy trường hoặc card liên kết đó trên bản ghi mình đọc được, nên cấu trúc không phải thông tin mới.
- Người chỉ đọc được bản ghi mình sở hữu: số đếm chỉ tính các bản ghi đó, như §6.1. Không trả số bị ẩn.

**Collection hoặc kênh chưa có**: `exists = false`, không trả các thuộc tính khác. Không trả lỗi, để trang sơ đồ vẫn vẽ được khi BE mới dựng xong một phần (CRM-10 §3.3).

**Bộ nhớ đệm**: 5 phút. Khoá gồm: mã băm nội dung yêu cầu, mức quyền của người gọi trên **từng** collection trong yêu cầu (không đọc / chỉ bản ghi của mình / toàn collection) và các trường người gọi được xem của từng collection; nếu có collection ở mức "chỉ bản ghi của mình" thì thêm id người gọi. Hai người cùng mức quyền trên mọi collection dùng chung một bản. `computedAt` là lúc tính.

**Lỗi**: quá 20 collection hoặc 40 kênh, `from` không nằm trong `collections`: `400 ASSOCIATION_STATS_INVALID`.

**Hiệu năng**: < 1,5 giây khi không có bộ nhớ đệm với 7 collection, 14 kênh (đúng yêu cầu của CRM-10 §3.2) và dữ liệu ở §8.

### 4.9 Mã lỗi mới

| HTTP | Code | Khi nào |
|---|---|---|
| 404 | `ASSOCIATION_NOT_FOUND` | `associationId` không tồn tại cho collection này |
| 404 | `ASSOCIATION_LINK_NOT_FOUND` | PATCH/DELETE một cặp không có liên kết |
| 409 | `ASSOCIATION_EXISTS` | Cặp đã có dòng nối đang hoạt động |
| 409 | `ASSOCIATION_REPLACES` | Thêm liên kết một giá trị sẽ ghi đè giá trị cũ mà chưa gửi `replace: true` |
| 409 | `RELATION_RESTRICT` | Xoá bản ghi đang bị trỏ tới bởi trường `onDelete = restrict` |
| 422 | `ASSOCIATION_TARGET_INVALID` | Bản ghi đích không tồn tại, đã xoá, hoặc sai collection |
| 422 | `ASSOCIATION_NOT_EDITABLE` | Sửa nhãn/Primary trên kênh không phải bảng nối |
| 422 | `ASSOCIATION_REQUIRED` | Gỡ liên kết của trường Bắt buộc |
| 422 | `JUNCTION_CONFIG_INVALID` | Cấu hình bảng nối sai |
| 400 | `ASSOCIATION_STATS_INVALID` | Yêu cầu thống kê vượt giới hạn hoặc sai (§4.8) |
| 400 | `FILTER_OPERATOR_INVALID` | Dùng `linked_to_me` trên trường không hỗ trợ (§4.10) |

Thông báo (`message`) bằng tiếng Việt, ví dụ: "Contact này đã được liên kết với Deal này", "Không thể xoá: nhân viên còn sở hữu 4 contact".


### 4.10 Toán tử lọc `linked_to_me`

View "Contacts của tôi" cần điều kiện "nhân viên trong `owner_id` có tài khoản là người đang đăng nhập" (CRM-00 §6.3, QĐ-01). Đây là lọc qua bản ghi liên kết mà bộ lọc F03 chưa làm được. Spec thêm một toán tử hẹp cho đúng trường hợp này thay vì mở lọc chéo collection tổng quát.

**Khai báo "trường tài khoản".** Metadata collection có thêm thuộc tính `identityUserField` (key một trường Người dùng). CRM-00 đặt `NhanVien.identityUserField = "tai_khoan"`. Mỗi collection tối đa một trường tài khoản.

**Cú pháp.** Áp cho trường Liên kết trỏ tới collection có `identityUserField`:

```
?filter[owner_id][linked_to_me]=true
?filter[owner_id][linked_to_me]=false     // bản ghi không thuộc về tôi (kể cả chưa có owner)
```

**Cách tính.** BE tìm các bản ghi của collection đích có `identityUserField = người gọi` (thường 0 hoặc 1 bản ghi), rồi đổi điều kiện thành `owner_id in (các id đó)`. Không có bản ghi nào thì điều kiện `true` trả rỗng.

**Trong view đã lưu.** View lưu toán tử, không lưu id. Mỗi người mở cùng một view thấy bản ghi của mình.

**Lỗi.** Dùng `linked_to_me` trên trường Liên kết mà collection đích không có `identityUserField` trả `400 FILTER_OPERATOR_INVALID`.

---

## 5. Sự kiện

Mỗi lần thêm, sửa nhãn/Primary, gỡ liên kết (qua API §4 **hoặc** qua sửa trường Liên kết bằng PATCH thông thường, hoặc do xoá theo), engine phát một sự kiện sau khi giao dịch thành công:

| Sự kiện | Khi nào |
|---|---|
| `record.association_added` | Thêm liên kết, khôi phục dòng nối |
| `record.association_updated` | Đổi nhãn hoặc Primary |
| `record.association_removed` | Gỡ liên kết, dòng nối bị xoá theo |

```json
{
  "event": "record.association_added",
  "associationId": "jn:crm_deal_contacts",
  "kind": "junction",
  "left":  { "collection": "deals_pipeline", "recordId": "rec_r013" },
  "right": { "collection": "crm_contacts",   "recordId": "rec_ct01" },
  "label": "Người quyết định",
  "isPrimary": false,
  "cause": "api" ,
  "actorUserId": "usr_001",
  "at": "2026-09-30T03:10:00Z"
}
```

- `cause`: `api` (người dùng thêm/gỡ), `field_update` (sửa trường Liên kết), `cascade` (bị xoá theo), `restore`.
- Với kênh `field`/`ref`, `left` là bản ghi chứa trường, `right` là bản ghi được trỏ tới.
- **Một** sự kiện cho mỗi thay đổi, mang cả hai đầu. F03-S3 dùng sự kiện này để ghi dòng nhật ký vào **cả hai** bản ghi ("Đã liên kết với Contact Nguyễn Thị Hạnh" trên Deal, và ngược lại trên Contact).
- Webhook ra ngoài của F03 (hiện có 3 sự kiện) **không** phát ba sự kiện mới trong giai đoạn này.
- Thay đổi trên bảng nối vẫn phát thêm `record.inserted` / `record.updated` / `record.deleted` của chính bảng nối như mọi collection. Workflow chọn nghe một trong hai loại; không nghe cả hai cho cùng một mục đích, nếu không sẽ chạy hai lần.

---

## 6. Quyền

### 6.1 Đọc

- Liệt kê kênh (§4.1) và bản ghi của kênh (§4.2, §4.3) cần quyền đọc bản ghi đang mở.
- Bản ghi đích chỉ trả về nếu người gọi đọc được nó theo quy tắc F03 (quyền trên collection, hoặc là chủ sở hữu hệ thống của bản ghi đó).
- `count` và `total` chỉ đếm bản ghi đọc được. Không trả số lượng bản ghi bị ẩn, để không lộ thông tin qua con số.

### 6.2 Ghi trên bảng nối — chế độ kế thừa

Nếu áp quyền F03 nguyên trạng thì admin phải cấp quyền ghi riêng cho từng bảng nối (CRM có 5 bảng). Spec thêm chế độ mặc định `permissionMode: "inherit"` trong `junction_config`:

> Người dùng được thêm, sửa nhãn/Primary, gỡ một dòng nối nếu **ghi được ít nhất một trong hai bản ghi** ở hai đầu **và đọc được bản ghi còn lại**.

Ví dụ: sale ghi được Deal của mình và đọc được mọi Contact thì gắn được Contact vào Deal của mình, không cần quyền trên `crm_deal_contacts`.

`permissionMode: "own"` tắt kế thừa, dùng đúng quyền F03 của bảng nối. Dùng khi bảng nối chứa dữ liệu nhạy cảm riêng.

Sửa dòng nối qua màn Dữ liệu hoặc qua API bản ghi thông thường (`PATCH /collections/crm_deal_contacts/records/:id`) cũng áp đúng chế độ trên.

### 6.3 Ghi trên kênh `field` và `ref`

Theo quyền ghi của bản ghi **chứa trường** (§4.4). Ví dụ: người chỉ đọc được Deal thì không thêm Deal vào Company được, dù ghi được Company.

---

## 7. Giao diện ở tầng nền

Giao diện card liên kết kiểu HubSpot ở CRM-01. Tầng nền chỉ có:

1. **Quản lý trường**, trường Liên kết: thêm ô "Khi bản ghi được liên kết bị xoá" với ba lựa chọn: *Giữ liên kết* (mặc định) · *Xoá theo* · *Không cho xoá*. Dưới ô có một dòng giải thích lựa chọn đang chọn. Đổi từ *Giữ* sang *Không cho xoá* khi đã có bản ghi đích đang bị xoá mềm: cho đổi, không ảnh hưởng bản ghi đã xoá.
2. **Trang Dữ liệu**: collection có `hideInDataMenu = true` không hiện trong danh sách. Có công tắc "Hiện bảng nối" cho người có quyền sửa cấu trúc collection. Bảng nối hiện nhãn "Bảng nối" cạnh tên.
3. **Danh sách liên kết chung** cho collection không có cấu hình CRM: thay cho tab "Liên kết" đang "sắp ra mắt" ở drawer và trang chi tiết. Hiện danh sách kênh từ §4.1, mỗi kênh một nhóm có 5 bản ghi đầu (§4.2) và link "Xem tất cả". Khi bật theme HubSpot, danh sách này nằm ở cột phải của trang chi tiết (CRM-01 §2). Collection CRM thay danh sách này bằng các card theo cấu hình (CRM-01 §5.6).

---

## 8. Hiệu năng

| Thao tác | Mục tiêu (p95, dữ liệu 50.000 bản ghi mỗi collection, 200.000 dòng nối) |
|---|---|
| §4.1 liệt kê kênh | < 150 ms |
| §4.2 một trang 20 bản ghi | < 200 ms |
| §4.3 50 dòng × 5 bản ghi | < 400 ms |
| §4.4 thêm liên kết junction | < 150 ms |

Ghi chú triển khai:

- §4.1 đếm bằng `COUNT` trên `junction_pair` và `record_relation` theo index ở §3.2, §3.3. Khi người gọi không có quyền đọc cả collection đích mà chỉ đọc được bản ghi mình sở hữu, đếm thêm điều kiện chủ sở hữu.
- §4.3 dùng một truy vấn cho cả danh sách `ids` (window function lấy N bản ghi đầu mỗi nhóm), không lặp theo từng id.

---

## 9. Kênh liên kết mà CRM dùng

Bảng này để FE CRM biết gọi mã nào. Nguồn dữ liệu là CRM-00.

| Đang mở | Card / chỗ hiển thị | `associationId` |
|---|---|---|
| Contact | Card Companies (C-20), cột "Công ty chính" | `jn:crm_contact_companies` |
| Contact | Card Deals (C-21), mở rộng dòng | `jn:crm_deal_contacts` |
| Company | Card Contacts (CO-09), mở rộng dòng | `jn:crm_contact_companies` |
| Company | Card Deals (CO-10), mở rộng dòng | `ref:deals_pipeline.company_id` |
| Deal | Card Companies (D-13) | `field:company_id` |
| Deal | Card Contacts có nhãn (D-13), mở rộng dòng | `jn:crm_deal_contacts` |
| Deal | Card Line items (L-01) | `ref:crm_line_items.deal_id` |
| Contact / Company / Deal | Timeline hoạt động | `jn:crm_activity_contacts` / `jn:crm_activity_companies` / `jn:crm_activity_deals` (F03-S6 gộp với nhật ký) |
| Nhân viên | Card bản ghi sở hữu (S-17) | `ref:crm_contacts.owner_id`, `ref:crm_companies.owner_id`, `ref:deals_pipeline.owner_id` |

---

## 10. Tiêu chí nghiệm thu

**AC-G03-1 — Contact có một công ty chính, xem được từ hai phía**
Given Contact "Nguyễn Thị Hạnh" và Company "Dược phẩm Thiên Phúc", chưa liên kết
When thêm liên kết từ trang Contact qua `jn:crm_contact_companies`
Then dòng nối tự là Primary; mở Company thấy Hạnh trong kênh Contacts; mở Hạnh thấy Thiên Phúc trong kênh Companies với `isPrimary = true`.

**AC-G03-2 — Deal nhiều Contact có nhãn**
Given Deal DEAL-013
When thêm Hạnh với nhãn "Người quyết định" và Trần Quốc Bảo không nhãn
Then kênh `jn:crm_deal_contacts` của Deal trả 2 bản ghi kèm nhãn; kênh cùng mã trên trang Hạnh trả DEAL-013 kèm nhãn "Người quyết định".

**AC-G03-3 — Deal một Company, xem được từ Company**
Given DEAL-013 chưa có công ty, Thiên Phúc đang có 2 Deal
When gán `company_id` của DEAL-013 là Thiên Phúc, rồi lấy kênh `ref:deals_pipeline.company_id` của Thiên Phúc
Then DEAL-013 có trong danh sách và `count` là 3.

**AC-F03S1-1 — Không tạo trùng cặp**
Given Hạnh đã liên kết với DEAL-013
When thêm lại Hạnh vào DEAL-013
Then trả `409 ASSOCIATION_EXISTS`, không có dòng nối thứ hai.

**AC-F03S1-2 — Thêm lại cặp đã gỡ thì khôi phục dòng cũ**
Given Hạnh từng liên kết với DEAL-013 rồi bị gỡ
When thêm lại với nhãn "Người ảnh hưởng"
Then dòng nối cũ được khôi phục với nhãn mới, `restored = true`, không tạo dòng mới.

**AC-F03S1-3 — Primary chỉ một**
Given Hạnh có Primary là Thiên Phúc
When PATCH dòng Hạnh – Titan Bases với `isPrimary = true`
Then Thiên Phúc không còn là Primary của Hạnh; hai thay đổi nằm trong cùng giao dịch.

**AC-F03S1-4 — Hỏi trước khi ghi đè liên kết một giá trị**
Given DEAL-013 thuộc Thiên Phúc
When từ trang Titan Bases thêm DEAL-013 qua `ref:deals_pipeline.company_id` không kèm `replace`
Then trả `409 ASSOCIATION_REPLACES` kèm Thiên Phúc; gửi lại với `replace: true` thì DEAL-013 chuyển sang Titan Bases.

**AC-F03S1-5 — Tạo Deal kèm liên kết là một giao dịch**
Given một request tạo Deal với 1 Company và 2 Contact, trong đó Contact thứ hai đã bị xoá
When gửi request
Then trả `422` với `details[0].index = 2`; không có Deal nào được tạo, không có dòng nối nào được tạo.

**AC-F03S1-6 — Xoá theo và khôi phục theo**
Given `crm_line_items.deal_id` có `onDelete = cascade`, DEAL-013 có 3 line item, trong đó 1 line item đã bị xoá riêng từ hôm qua
When xoá mềm DEAL-013, rồi khôi phục DEAL-013
Then khi xoá: 2 line item còn lại bị xoá mềm theo; khi khôi phục: đúng 2 line item đó được khôi phục, line item xoá từ hôm qua vẫn trong thùng rác.

**AC-F03S1-7 — Chặn xoá**
Given `crm_contacts.owner_id` có `onDelete = restrict`, nhân viên Lan Lê sở hữu 4 Contact
When xoá Lan Lê
Then trả `409 RELATION_RESTRICT`, thông báo nêu 4 bản ghi.

**AC-F03S1-8 — Không lộ số lượng qua quyền**
Given người dùng X đọc được Deals nhưng không có quyền đọc collection Contacts, và không sở hữu Contact nào
When X lấy danh sách kênh của DEAL-013
Then không có kênh `jn:crm_deal_contacts` trong kết quả.

**AC-F03S1-9 — Quyền kế thừa trên bảng nối**
Given sale Y ghi được DEAL-020 (chủ sở hữu), chỉ đọc được DEAL-013, đọc được mọi Contact nhưng không ghi được Contact C, không có quyền nào trên `crm_deal_contacts`
When Y thêm Contact C vào DEAL-020
Then thành công.
And Y thêm Contact C vào DEAL-013 thì bị `403` (Y không ghi được đầu nào).

**AC-F03S1-10 — Sự kiện ghi cho cả hai đầu**
Given F03-S3 đang ghi nhật ký
When gắn Hạnh vào DEAL-013
Then phát đúng một `record.association_added`; nhật ký của DEAL-013 và của Hạnh mỗi bên có một dòng.

**AC-F03S1-12 — Khôi phục không tạo hai Primary**
Given Hạnh có Primary là Thiên Phúc; Thiên Phúc bị xoá mềm (dòng nối xoá theo); người dùng đặt Titan Bases làm Primary của Hạnh
When khôi phục Thiên Phúc
Then dòng nối Hạnh – Thiên Phúc được khôi phục với `isPrimary = false`; Titan Bases vẫn là Primary.

**AC-F03S1-13 — Dòng nối chờ đầu còn lại**
Given DEAL-013 và Hạnh đều bị xoá mềm, dòng nối giữa chúng bị xoá theo DEAL-013
When chỉ khôi phục DEAL-013
Then dòng nối vẫn bị xoá; khôi phục tiếp Hạnh thì dòng nối được khôi phục.

**AC-F03S1-14 — Lọc "của tôi"**
Given tài khoản U gắn với nhân viên Lan Lê; Lan Lê sở hữu 4 contact
When U gọi danh sách Contacts với `filter[owner_id][linked_to_me]=true`
Then trả đúng 4 contact; tài khoản chưa gắn nhân viên nào gọi cùng request thì nhận danh sách rỗng.

**AC-F03S1-11 — Lấy cho nhiều dòng một lượt**
Given danh sách 50 Company đang hiển thị
When gọi §4.3 với 50 id, `limit=5`
Then trả kết quả cho cả 50 id trong một phản hồi; id không có liên kết trả `items: []`, `total: 0`.

---

## 11. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-F03S1-01 | Unit | Lưu `junction_config` có `left.field` là trường Văn bản | 422 JUNCTION_CONFIG_INVALID |
| TC-F03S1-02 | Unit | Lưu cấu hình có `primaryField` nhưng thiếu `primaryScope` | 422 |
| TC-F03S1-03 | Unit | Đổi `left.field` khi bảng nối đã có dòng | 422 |
| TC-F03S1-04 | API | 2 request đồng thời thêm cùng một cặp | Một request 201, một request 409; chỉ 1 dòng |
| TC-F03S1-05 | API | 2 request đồng thời đặt Primary cho 2 dòng khác nhau của cùng Contact | Kết thúc với đúng 1 Primary |
| TC-F03S1-06 | API | Thêm dòng nối với `label` ngoài danh mục | 422 |
| TC-F03S1-07 | API | Thêm liên kết tới bản ghi thuộc collection khác collection đích | 422 ASSOCIATION_TARGET_INVALID |
| TC-F03S1-08 | API | Gỡ kênh `field` của trường Bắt buộc | 422 ASSOCIATION_REQUIRED |
| TC-F03S1-09 | API | Gỡ liên kết junction | Dòng nối xoá mềm, hai bản ghi còn nguyên |
| TC-F03S1-10 | API | Xoá mềm Contact có 3 dòng nối | 3 dòng nối xoá mềm theo, `deleted_by_cascade_of` = id Contact |
| TC-F03S1-11 | API | Khôi phục Contact đó | Đúng 3 dòng được khôi phục |
| TC-F03S1-12 | API | Xoá theo 2 tầng: Deal → line item có `onDelete=cascade` → một collection con của line item (nếu có) | Mọi tầng ghi id Deal gốc; khôi phục Deal khôi phục đủ |
| TC-F03S1-13 | API | PATCH trường `company_id` của Deal qua API bản ghi thông thường | Phát `record.association_removed` (công ty cũ) và `record.association_added` (công ty mới), `cause = field_update` |
| TC-F03S1-14 | API | §4.3 với 51 id | 400 |
| TC-F03S1-15 | API | §4.2 với `limit=500` | Trả tối đa 200 |
| TC-F03S1-16 | Quyền | Người không đọc được Contacts gọi §4.2 kênh Contacts | 404 ASSOCIATION_NOT_FOUND (không phải 403, để không xác nhận kênh tồn tại) |
| TC-F03S1-17 | Quyền | `permissionMode = own` trên bảng nối, người dùng ghi được Deal | Thêm dòng nối bị 403 |
| TC-F03S1-18 | Job | Làm lệch `junction_pair` bằng tay | Job đối soát ghi lỗi vào log hệ thống |
| TC-F03S1-19 | Hiệu năng | §4.3 50 id × 5 trên dữ liệu mục tiêu §8 | p95 < 400 ms |
| TC-F03S1-21 | API | `linked_to_me` trên `company_id` (Companies không có `identityUserField`) | 400 FILTER_OPERATOR_INVALID |
| TC-F03S1-22 | API | Hai request đồng thời khôi phục dòng Primary cũ và đặt Primary mới | Kết thúc với đúng 1 Primary |
| TC-F03S1-20 | UI | Đổi ô "Khi bản ghi được liên kết bị xoá" sang *Không cho xoá* rồi xoá bản ghi đích | Hiện thông báo lỗi tiếng Việt kèm số bản ghi |
| TC-F03S1-23 | API | `associations/stats` với `jn:crm_deal_contacts`, bảng có 3 dòng, 1 dòng đã vào thùng rác theo khi deal bị xoá | `count = 2`, `cardinality = N:N`, `onDelete = cascade` |
| TC-F03S1-24 | API | `associations/stats` hỏi kênh `ref:crm_contacts.owner_id` khi trường chưa tạo | `exists = false`, phản hồi 200 |
| TC-F03S1-25 | Quyền | Người đọc được Deals, không đọc được `crm_activities`, hỏi `jn:crm_activity_deals` từ `crm_activities` | `readable = false`, không có `count`, vẫn có `storage` |
| TC-F03S1-26 | API | `associations/stats` với 21 collection | 400 ASSOCIATION_STATS_INVALID |
| TC-F03S1-27 | Quyền | Người không đọc được `luong_nhan_vien` đưa collection này vào `collections` | Chỉ nhận `{ "readable": false }`, không có `exists`, `fieldCount` |
| TC-F03S1-28 | API | `where` của `NhanVien` dùng trường người gọi không được xem | 400 ASSOCIATION_STATS_INVALID |
| TC-F03S1-29 | API | Hai người cùng quyền đọc toàn bộ `crm_contacts` nhưng chỉ một người đọc được `crm_activities`, gửi cùng yêu cầu | Hai bản đệm khác nhau; người không đọc được hoạt động không nhận số của người kia |

---

## 12. Prototype giả lập gì

| Trong prototype (`crm-objects.js`) | Bản thật |
|---|---|
| `assoc.companyOfContact()` trả một công ty duy nhất (`contact.company`) | Kênh `jn:crm_contact_companies` trả nhiều công ty, Primary đứng đầu |
| Liên kết Deal lưu ở object `dealLinks` ngoài bản ghi | `company_id` trên Deal, dòng trong `crm_deal_contacts` |
| `associate()` không kiểm trùng cho cặp Company – Deal, ghi đè im lặng | Hỏi trước khi ghi đè (`409 ASSOCIATION_REPLACES`) |
| `associate()` tự ghi dòng hoạt động hệ thống từ FE | Engine phát sự kiện, F03-S3 ghi nhật ký |
| Xoá Company thì FE tự đặt `contact.company = null` | Dòng nối xoá mềm theo, khôi phục được |
| Không có quyền; ai cũng liên kết được mọi thứ | §6 |

---

## 13. Giả định và câu hỏi

| # | Giả định / câu hỏi | Hỏi ai | Nếu sai thì |
|---|---|---|---|
| A1 | Bản ERP đang chạy có bảng `record_relation` như F03 thiết kế, được ghi mỗi khi trường Liên kết đổi | BE | Phải làm bảng này trước. Tạm thời truy vấn ngược bằng `data->>'field' = id` kèm index biểu thức cho từng trường Liên kết cần dùng |
| A2 | Trường Liên kết hiện tại là một giá trị (lưu một id), không phải mảng | BE | Nếu có trường nhiều giá trị đang dùng, `field`/`ref` phải xử lý mảng; spec cần sửa §4.4, §4.6 |
| Q1 | Slug thật của collection Deals_Pipeline | BE | Chỉ đổi chuỗi trong §2.2, §9 |
| Q2 | Có cần giao diện tạo bảng nối cho admin trong giai đoạn này không | Khách / PO | Nếu cần, thêm một mục vào spec này (hiện để P2) |
| Q3 | Workflow engine có cần node "Thêm liên kết" riêng không, hay dùng node Record Action tạo dòng bảng nối là đủ | PO | Nếu cần node riêng thì viết spec F08-Sx |

---

## Liên kết

- Lớp dữ liệu gốc: `F03-collections-data-layer.md`
- Nhật ký & sự kiện: `F03-S3-nhat-ky-thay-doi-su-kien.md` (đợt 2)
- Activities & timeline: `F03-S6-activities-timeline.md` (đợt 3)
- Mô hình dữ liệu CRM: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-00-mo-hinh-du-lieu-chuyen-doi.md`
- Khung màn CRM: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-01-khung-danh-sach-trang-chi-tiet.md`

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-09-30 | v1.0 — bản đầu | TTS (qua Claude) |
| 2026-09-30 | v1.1 — §4.7: phần tử `_associations` nhận `isPrimary`, `replace`; cho phép kênh `ref` khi tạo (phục vụ panel tạo Company, CRM-03 §4) | TTS (qua Claude) |
| 2026-09-30 | v1.2 — §3.1, §3.2 thêm `pinField`, `pinScope`, cột `isPinned` và index một dòng ghim (ghim hoạt động, F03-S6 §3.6); §3.4 thêm `crm_activity_comments.activity_id` vào danh sách `cascade`; §4.7 lỗi có thêm `path` (đợt 3) | TTS (qua Claude) |
| 2026-10-01 | v1.3 — §4.8 viết đầy đủ API thống kê liên kết cho Sơ đồ quan hệ (CRM-10): `POST`, bộ lọc đếm theo collection, `fieldCount`, thông tin cách lưu và `onDelete`, `exists`/`readable`, bộ nhớ đệm theo phạm vi quyền; mã lỗi `ASSOCIATION_STATS_INVALID`; chặn dò cấu trúc collection không đọc được; khoá đệm theo mức quyền từng collection; TC-23..29 | TTS (qua Claude) |

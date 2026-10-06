# F03-S5 — Thao tác hàng loạt, gộp bản ghi và chuyển giao

> **Trạng thái:** 💡 Proposed · v1.1 · 01/10/2026 · chờ review
> **Loại:** spec nền (tầng A), mở rộng `F03-collections-data-layer.md` §Bulk Operations
> **Tính năng sở hữu:** không sở hữu ID nào trong sheet; là phần BE của C-11, C-17 (mục Gộp), S-12, S-18
> **Phục vụ:** `CRM-01` §4.12 (thao tác hàng loạt), §5.3 (menu Thao tác → Gộp) · `CRM-08` §7, §8 (đổi tên sale, chuyển giao bản ghi)
> **Phụ thuộc:** F03 (bulk update, xoá mềm, quyền) · `F03-S1` (kênh liên kết, `junction_pair`, `onDelete`) · `F03-S3` (`batchId`, nguồn `bulk`/`merge`, người theo dõi, thông báo gộp) · `F03-S2` (tính lại trường tính) · `CRM-06` (line item khi gộp deal)
> **Nguồn:** F03 §Bulk Operations · prototype `crm-list.js` (thanh hàng loạt), `crm-sales-hubspot.html` (`reassign`), `crm-objects.js` (mục "Gộp" đang "Sắp có") · `DOI-CHIEU-CHUC-NANG.md` §17 · HubSpot: merge records, deactivate user và reassign

---

## 0. Tóm tắt

Spec này làm ba việc:

1. **Thao tác hàng loạt.** Đổi giá trị một trường (thường là owner) hoặc xoá mềm cho nhiều bản ghi, chọn theo danh sách id hoặc theo bộ lọc. Chọn tới 200 id thì chạy ngay trong request; từ 201 tới 1.000 id, hoặc chọn theo bộ lọc, thì chạy thành job nền có tiến độ, huỷ được, báo kết quả.
2. **Gộp hai bản ghi trùng.** Chọn bản ghi chính, chọn giá trị cho từng trường khác nhau, chuyển mọi liên kết, hoạt động, người theo dõi, lịch sử timeline của bản ghi phụ sang bản ghi chính, rồi đưa bản ghi phụ vào thùng rác.
3. **Chuyển giao toàn bộ bản ghi của một người.** Đổi owner mọi contact, company, deal đang mở và task chưa xong từ một nhân viên sang nhân viên khác trong một lần, như khi HubSpot vô hiệu hoá một người dùng.

Thao tác hàng loạt và chuyển giao đi qua đường ghi bình thường của F03 nên có đủ kiểm quyền, kiểm dữ liệu, lịch sử (F03-S3), trường tính (F03-S2) và sự kiện cho workflow. Gộp kiểm quyền một lần ở đầu rồi chuyển dữ liệu với quyền hệ thống (§4.3).

---

## 1. Vấn đề

| Hiện trạng | Hệ quả |
|---|---|
| F03 có bulk update, bulk delete theo danh sách bản ghi đã chọn trên màn hình, chạy trong một request | Chọn "tất cả 4.800 contact khớp bộ lọc" không làm được; request dài dễ hết thời gian |
| Không có job theo dõi tiến độ cho thao tác hàng loạt (chỉ có job nhập file) | Người dùng không biết đã xong chưa, bao nhiêu bản ghi bị bỏ qua |
| Không có gộp bản ghi | Contact trùng (nhập file hai lần, hai sale cùng tạo) nằm mãi; prototype để mục "Gộp" là "Sắp có" |
| Chuyển giao trong prototype đổi owner từng bản ghi ở trình duyệt | Không có kiểm quyền, không có lịch sử chung một lần thao tác, dễ dừng giữa chừng khi tắt trình duyệt |

### 1.1 Trong phạm vi

- API bulk update, bulk delete theo id hoặc theo bộ lọc; ngưỡng chạy ngay và chạy nền.
- Bảng job, API tiến độ, huỷ, danh sách job đang chạy của tôi.
- Gộp hai bản ghi cùng collection, API xem trước và API thực hiện, giao diện hộp thoại gộp dùng chung.
- Chuyển giao theo trường owner: API xem trước số lượng và API thực hiện.

### 1.2 Ngoài phạm vi

- Gộp nhiều hơn hai bản ghi một lần. Gộp lần lượt từng đôi.
- Tách lại bản ghi đã gộp (unmerge).
- Tự phát hiện bản ghi trùng (gợi ý "có thể trùng"). Chưa có trong sheet.
- Bulk update nhiều trường khác nhau cho từng bản ghi (đó là nhập file, F03 đã có).
- Hoàn tác thao tác hàng loạt.

---

## 2. Khái niệm

| Từ | Nghĩa |
|---|---|
| **Lựa chọn** | Tập bản ghi bị tác động: danh sách id, hoặc bộ lọc (cú pháp F03, gồm từ khoá tìm kiếm) |
| **Job** | Một lần thao tác hàng loạt chạy nền, có tiến độ và kết quả |
| **`batchId`** | Mã chung của mọi thay đổi trong một lần thao tác (F03-S3 §3.2). Mỗi job có một `batchId`; thao tác chạy ngay cũng có |
| **Bản ghi chính / phụ** | Khi gộp: bản ghi chính được giữ lại; bản ghi phụ bị gộp vào và chuyển vào thùng rác |
| **Chuyển giao** | Đổi owner hàng loạt mọi bản ghi của một nhân viên sang nhân viên khác |

---

## 3. Thao tác hàng loạt

### 3.1 API

```
POST /api/v1/collections/:slug/bulk/update
POST /api/v1/collections/:slug/bulk/delete
```

```json
{
  "selection": { "ids": ["rec_1", "rec_2"] },
  "set": { "owner_id": "emp_12" }
}
```

```json
{
  "selection": { "filter": { "lifecycle_stage": { "eq": "Lead" } }, "q": "thienphuc", "expectedCount": 4812 },
  "set": { "owner_id": "emp_12" }
}
```

| Thuộc tính | Ý nghĩa |
|---|---|
| `selection.ids` | Tối đa 1.000 id |
| `selection.filter`, `selection.q` | Bộ lọc và từ khoá như API danh sách (cùng điều kiện đang áp trên màn hình, CRM-01 §4.1). Không có giới hạn số lượng ở đây; giới hạn ở §3.4 |
| `selection.expectedCount` | Số bản ghi người dùng thấy trên màn hình. Dùng để báo khi số thực tế khác (§3.3) |
| `set` | Chỉ với `bulk/update`. Các trường và giá trị mới. Không nhận trường tính, trường hệ thống, trường có cờ Duy nhất (đặt cùng một giá trị cho nhiều bản ghi sẽ trùng), và trường do BE tự ghi (CRM-00: `closed_at`, `stage_changed_at`, `line_items_version`, các trường nhắc việc của hoạt động) |

Kết quả:

- **Chạy ngay** khi `selection.ids` có ≤ 200 phần tử (đúng một lô, §3.2): phản hồi `200` sau khi xong, `{ batchId, total, succeeded, skipped, failed, errors[] }`.
- **Chạy nền** khi `selection.ids` có 201 – 1.000 phần tử, hoặc chọn theo bộ lọc (bất kể số lượng): phản hồi `202` `{ jobId, batchId, total }`. Theo dõi ở §3.5. Ngưỡng 200 giữ request dưới vài giây kể cả khi mỗi bản ghi kéo theo trường tính và workflow.

Lỗi trước khi chạy: `set` rỗng hoặc có trường không cho phép → `422 BULK_FIELD_NOT_ALLOWED`; người gọi không có `record.write` (update) hoặc `record.delete` (delete) trên collection và cũng không sở hữu bản ghi nào trong lựa chọn → `403 BULK_FORBIDDEN`.

### 3.2 Xử lý từng bản ghi

- Mỗi bản ghi được ghi qua đúng đường sửa, xoá mềm của F03: kiểm quyền **trên từng bản ghi** (quyền collection hoặc chủ sở hữu hệ thống), kiểm dữ liệu, ghi `record_change` với `source = bulk`, `batchId` (F03-S3), phát sự kiện F03 cho workflow, đưa trường tính vào hàng đợi (F03-S2), xoá theo khi xoá (F03-S1 §3.4).
- Bản ghi không có quyền: **bỏ qua**, tính vào `skipped`, không phải lỗi.
- Bản ghi lỗi dữ liệu (ví dụ owner mới là nhân viên đã nghỉ mà trường chỉ nhận người đang làm việc): tính vào `failed`, ghi lỗi; các bản ghi khác vẫn chạy. `errors` giữ tối đa 20 lỗi đầu, mỗi lỗi `{ recordId, label, code, message }`.
- Bản ghi đã đổi sang đúng giá trị mới: tính `succeeded`, không ghi gì (F03-S3 không ghi khi giá trị không đổi).
- Ghi theo lô 200 bản ghi mỗi giao dịch. Một lô lỗi hệ thống thì lô đó thử lại một lần, vẫn lỗi thì các bản ghi trong lô tính `failed` với mã `BULK_SYSTEM_ERROR`, job chạy tiếp lô sau.
- Thông báo cho owner mới gộp theo F03-S3 §6.3, gửi sau khi job xong.

### 3.3 Chốt danh sách khi chọn theo bộ lọc

- Lúc job bắt đầu, máy chủ chạy bộ lọc **một lần** và lưu danh sách id vào bảng `bulk_job_item` (§3.6). Job chỉ xử lý danh sách đã chốt; bản ghi được tạo, sửa trong lúc job chạy không làm danh sách thay đổi.
- Bộ lọc chạy với quyền của người gọi: chỉ chốt bản ghi người gọi đọc được.
- `total` khác `expectedCount` hơn 5% (dữ liệu đã đổi kể từ lúc người dùng xem): job vẫn chạy; phản hồi và thông báo kết quả ghi "Số bản ghi khớp bộ lọc lúc chạy là {total}, khác số bạn đã xem ({expectedCount})".

### 3.4 Giới hạn

- Một job tối đa 50.000 bản ghi. Bộ lọc khớp nhiều hơn: `422 BULK_TOO_MANY` kèm `details.count`, giao diện gợi ý thu hẹp bộ lọc.
- Mỗi người tối đa 2 job đang chạy; job thứ ba xếp hàng (`status = queued`).
- Toàn hệ thống tối đa 4 job chạy cùng lúc; job khác xếp hàng theo thứ tự tạo.
- Tốc độ mục tiêu: 1.000 bản ghi trong 30 giây với owner đổi và workflow không nặng (§10).

### 3.5 Theo dõi job

```
GET  /api/v1/bulk-jobs/:id
GET  /api/v1/bulk-jobs?mine=true&active=true
POST /api/v1/bulk-jobs/:id/cancel
```

```json
{
  "id": "job_7c1", "kind": "update", "collection": "crm_contacts", "label": "Gán owner Lan Lê",
  "status": "running", "total": 4812, "processed": 2200, "succeeded": 2180, "skipped": 20, "failed": 0,
  "batchId": "…", "createdBy": "usr_03", "createdAt": "…", "startedAt": "…", "finishedAt": null, "errors": []
}
```

- `status`: `queued` · `running` · `done` · `cancelled` · `failed` (lỗi không chạy tiếp được, ví dụ collection bị xoá).
- Chỉ người tạo job và quản trị xem được job.
- **Huỷ**: dừng sau lô đang chạy; bản ghi đã xử lý giữ nguyên thay đổi; `status = cancelled`. Huỷ job đã xong trả `409 BULK_JOB_FINISHED`.
- Job xong (kể cả huỷ, lỗi): gửi thông báo chuông cho người tạo, ví dụ "Đã gán owner Lan Lê cho 4.792 contact. Bỏ qua 20 bản ghi bạn không có quyền sửa." Bấm mở danh sách với `?batch=<batchId>` (CRM-01 §4.1).
- Giao diện tiến độ: thanh nhỏ ở góc phải dưới màn hình (CRM-01 §4.12), gọi `GET …?mine=true&active=true` mỗi 3 giây khi có job đang chạy; mở lại trang vẫn thấy.

### 3.6 Dữ liệu

```prisma
model BulkJob {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  kind          String    @db.VarChar(20)          // 'update' | 'delete' | 'transfer'
  collectionId  String?   @map("collection_id") @db.Uuid   // null với 'transfer' (nhiều collection)
  label         String    @db.VarChar(200)         // câu mô tả cho giao diện
  params        Json                               // set, selection gốc, cấu hình chuyển giao
  status        String    @db.VarChar(20)
  total         Int       @default(0)
  processed     Int       @default(0)
  succeeded     Int       @default(0)
  skipped       Int       @default(0)
  failed        Int       @default(0)
  errors        Json      @default("[]")
  batchId       String    @map("batch_id") @db.Uuid
  createdBy     String    @map("created_by") @db.Uuid
  createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  startedAt     DateTime? @map("started_at") @db.Timestamptz(6)
  finishedAt    DateTime? @map("finished_at") @db.Timestamptz(6)
  @@index([createdBy, status])
  @@map("bulk_job")
  @@schema("data")
}

model BulkJobItem {
  jobId         String   @map("job_id") @db.Uuid
  collectionId  String   @map("collection_id") @db.Uuid
  recordId      String   @map("record_id") @db.Uuid
  state         String   @default("pending") @db.VarChar(10)   // 'pending' | 'ok' | 'skipped' | 'failed'
  @@id([jobId, recordId])
  @@map("bulk_job_item")
  @@schema("data")
}
```

`bulk_job_item` của job đã xong được xoá sau 7 ngày; `bulk_job` giữ 90 ngày.

---

## 4. Gộp hai bản ghi

### 4.1 Collection gộp được

Metadata collection có `mergeConfig` mới được gộp:

```json
{ "mergeable": true, "lockedFields": ["m_deal"], "childRefs": ["ref:crm_line_items.deal_id", "ref:crm_deal_adjustments.deal_id"] }
```

- `lockedFields`: trường luôn lấy giá trị của bản ghi chính, không cho chọn (Mã Deal).
- `childRefs`: kênh `ref` của dòng con chỉ thuộc về một bản ghi cha (line item, điều chỉnh); xử lý ở §4.4.
- CRM-00 đặt `mergeConfig` cho `crm_contacts`, `crm_companies` và Deals (`deals_pipeline`, slug tạm chờ BE xác nhận như F03-S1 §3). Collection khác không có thì API trả `422 MERGE_NOT_SUPPORTED`.

### 4.2 Xem trước

```
GET /api/v1/collections/:slug/records/:primaryId/merge-preview?secondaryId=rec_b
```

```json
{
  "status": "success",
  "data": {
    "primary":   { "id": "rec_a", "label": "Nguyễn Thị Hạnh", "updatedAt": "2026-10-01T02:14:07Z" },
    "secondary": { "id": "rec_b", "label": "Hạnh Nguyễn",     "updatedAt": "2026-09-28T09:40:51Z" },
    "fields": [
      { "field": "email", "name": "Email", "primary": "hanh@thienphuc.vn", "secondary": "hanh.nguyen@gmail.com", "default": "primary", "unique": true },
      { "field": "phone", "name": "Số điện thoại", "primary": null, "secondary": "0903 123 456", "default": "secondary" }
    ],
    "moves": {
      "associations": [ { "associationId": "jn:crm_contact_companies", "objectLabel": "Companies", "move": 1, "alreadyLinked": 1 },
                        { "associationId": "jn:crm_deal_contacts", "objectLabel": "Deals", "move": 2, "alreadyLinked": 0 } ],
      "activities": 14, "followers": 2, "timelineEvents": 9
    },
    "blockers": []
  }
}
```

- `fields` chỉ gồm trường nhập tay có giá trị **khác nhau** giữa hai bản ghi, không gồm trường trong `lockedFields`, trường tính, trường hệ thống và trường do BE tự ghi (`closed_at`, `stage_changed_at`, `line_items_version`, các trường nhắc việc của hoạt động).
- Ngoại lệ đi kèm: nếu chọn giai đoạn (`giai_o_n_pipeline`) của bản ghi phụ thì `closed_at` và `stage_changed_at` của bản ghi chính cũng lấy theo bản ghi phụ, để ngày đóng khớp với giai đoạn.
- `updatedAt` của hai bản ghi được gửi lại khi thực hiện (§4.3) để phát hiện có người sửa xen giữa.
- `default`: bản ghi chính, trừ khi bản ghi chính để trống và bản ghi phụ có giá trị.
- `blockers`: lý do không gộp được, mỗi lý do `{ code, message }` (§4.5). Có blocker thì nút Gộp trên giao diện vô hiệu.

### 4.3 Thực hiện

```
POST /api/v1/collections/:slug/records/:primaryId/merge
{ "secondaryId": "rec_b", "choices": { "phone": "secondary" },
  "expectedUpdatedAt": { "primary": "2026-10-01T02:14:07Z", "secondary": "2026-09-28T09:40:51Z" } }
```

**Kiểm trước và khoá**

- Kiểm điều kiện §4.5, trong đó có quyền: người gọi ghi được bản ghi chính và xoá được bản ghi phụ.
- Khoá hai dòng `record` bằng `SELECT … FOR UPDATE`, luôn theo thứ tự id tăng dần (để hai yêu cầu gộp chéo nhau không khoá chết).
- `updatedAt` của một trong hai bản ghi khác `expectedUpdatedAt`: `409 MERGE_STALE` "Bản ghi vừa được sửa. Xem lại trước khi gộp." Giao diện gọi lại xem trước.
- Sau khi kiểm xong, các bước chuyển dữ liệu dưới đây chạy với **quyền hệ thống**: người gọi có thể không đọc được mọi hoạt động, deal liên kết với bản ghi phụ, nhưng các liên kết đó vẫn phải theo sang bản ghi chính. Lịch sử ghi người thực hiện là người gọi, `source = merge`.

Mọi bước trong **một giao dịch**:

1. **Trường**: với mỗi trường trong `choices` chọn `secondary`, ghi giá trị của bản ghi phụ vào bản ghi chính. Trường không có trong `choices` lấy theo `default` của §4.2. Trường Duy nhất lấy giá trị của bản ghi phụ: xoá giá trị đó khỏi bản ghi phụ trước rồi mới ghi vào bản ghi chính, để không vướng ràng buộc trùng.
2. **Liên kết qua bảng nối** (`jn:`): mọi dòng nối của bản ghi phụ được trỏ sang bản ghi chính. Nếu bản ghi chính đã có dòng với cùng bản ghi đầu kia: giữ dòng của bản ghi chính (lấy nhãn của dòng phụ nếu dòng chính chưa có nhãn), xoá mềm dòng của bản ghi phụ. Primary (F03-S1 §3.1): bản ghi chính đã có dòng Primary trong phạm vi thì giữ; chưa có thì dòng Primary của bản ghi phụ (nếu có) thành Primary. Ghim (F03-S6 §3.6): giữ ghim của bản ghi chính; bản ghi chính chưa ghim gì thì nhận ghim của bản ghi phụ.
3. **Liên kết kiểu `ref:`** không nằm trong `childRefs` (ví dụ deal có `company_id` là công ty phụ): đổi trường trỏ sang bản ghi chính.
4. **Liên kết kiểu `field:`** của chính bản ghi (ví dụ `company_id` của deal): là một trường, xử lý ở bước 1.
5. **Dòng con** (`childRefs`): §4.4.
6. **Người theo dõi**: hợp hai danh sách; cờ `isManual`, `isOwner` lấy OR (F03-S3 §3.6). `isOwner` được tính lại theo owner sau khi gộp.
7. **Timeline**: mọi dòng `record_event_subject` của bản ghi phụ được trỏ sang bản ghi chính, để lịch sử của bản ghi phụ hiện trên timeline bản ghi chính.
   - Sự kiện đã có dòng chủ thể cho cả hai bản ghi (ví dụ một deal đổi giai đoạn lan tới cả hai contact): trỏ sang sẽ trùng khoá `(eventId, recordId)`, nên xoá dòng của bản ghi phụ, giữ dòng của bản ghi chính.
   - Sự kiện của chính bản ghi phụ (dòng có `via` rỗng): khi trỏ sang, đặt `via = "merge:<id bản ghi phụ>"`. Timeline của bản ghi chính nhờ đó hiện câu theo dạng lan sự kiện có nhắc tên bản ghi phụ ("Minh Trần đã tạo Contact Hạnh Nguyễn"), không nhầm là sự kiện của bản ghi chính (F03-S3 §3.4).
   - Dòng `record_change` giữ nguyên trên bản ghi phụ (đó là lịch sử của bản ghi phụ, dùng để tra cứu).
8. **Bản ghi phụ**: xoá mềm, ghi `mergedIntoId = primaryId` (cột mới trên bảng `record`, null mặc định), `record_change` loại `deleted` với `source = merge`, `note = "gộp vào {nhãn bản ghi chính}"`.
9. **Sự kiện**: thêm sự kiện loại `merged` trên bản ghi chính (F03-S3 bổ sung loại này): "{người thực hiện} đã gộp {nhãn bản ghi phụ} vào bản ghi này". Phát sự kiện `record.merged` cho workflow với `{ primaryId, secondaryId }`.

Sau giao dịch: trường tính của bản ghi chính và của các bản ghi có liên kết bị chuyển được đưa vào hàng đợi F03-S2.

Phản hồi: bản ghi chính sau khi gộp và số liệu đã chuyển như `moves` của §4.2.

### 4.4 Dòng con khi gộp deal

- Chỉ bản ghi phụ có line item (hoặc điều chỉnh cấp Deal): chuyển sang bản ghi chính, chạy lại handler tổng line item (F03-S2 §6.4); `use_line_items_amount` của bản ghi chính giữ nguyên.
- Chỉ bản ghi chính có: giữ nguyên.
- **Cả hai đều có**: không gộp được, blocker `MERGE_CHILD_CONFLICT` "Cả hai deal đều có line item. Xoá line item ở một deal trước khi gộp." Ghép hai bảng giá tự động dễ sai số liệu báo giá đã gửi khách.

### 4.5 Điều kiện gộp

| Điều kiện | Mã khi không đạt |
|---|---|
| Hai bản ghi khác nhau, cùng collection, đều chưa bị xoá | `422 MERGE_INVALID` |
| Người gọi ghi được bản ghi chính và xoá được bản ghi phụ | `403 MERGE_FORBIDDEN` |
| Hai bản ghi chưa bị sửa kể từ lúc xem trước | `409 MERGE_STALE` |
| Collection có `mergeConfig.mergeable` | `422 MERGE_NOT_SUPPORTED` |
| Không vướng §4.4 | `422 MERGE_CHILD_CONFLICT` |
| Tổng số dòng nối, hoạt động, sự kiện cần chuyển ≤ 20.000 | `422 MERGE_TOO_LARGE` (gộp dữ liệu lớn như vậy cần BE làm tay) |

### 4.6 Khôi phục bản ghi đã gộp

Bản ghi phụ nằm trong thùng rác 30 ngày như mọi bản ghi xoá mềm, xem được ở chế độ chỉ đọc để tra cứu. **Không khôi phục được**: khôi phục trả `422 RECORD_MERGED` "Bản ghi đã được gộp vào {nhãn}. Không khôi phục được." Khôi phục nửa vời (liên kết đã chuyển đi) sẽ cho một bản ghi rỗng gây nhầm lẫn.

### 4.7 Giao diện hộp thoại gộp

Dùng chung cho mọi collection có `mergeConfig`; mở từ "Thao tác ▾ → Gộp" trên trang chi tiết (CRM-01 §5.3). Modal lớn (DS-HUBSPOT §6.11), hai bước:

**Bước 1 — Chọn bản ghi**

- Tiêu đề "Gộp {Contact} {tên}".
- Ô tìm bản ghi cùng loại (tên, email, domain, Mã Deal theo `searchFields` của đối tượng, CRM-01 §3), bỏ chính bản ghi đang mở. Kết quả 10 dòng, mỗi dòng tên và một dòng phụ (email / domain / Tên Deal).
- Chọn một dòng thì sang bước 2. Nút "Huỷ".

**Bước 2 — Chọn giá trị**

- Hai cột: trái là bản ghi đang mở, phải là bản ghi vừa chọn. Trên mỗi cột có ô chọn "Giữ bản ghi này" (radio); mặc định giữ bản ghi đang mở. Đổi bản ghi giữ lại thì gọi lại xem trước với hai id đổi chỗ.
- Bảng các trường khác nhau (`fields`): mỗi hàng tên trường và hai ô giá trị có radio; mặc định theo `default`. Trường Duy nhất có chữ nhỏ "Giá trị không chọn sẽ bị bỏ".
- Không có trường nào khác nhau: dòng "Hai bản ghi có cùng giá trị ở mọi trường."
- Khối "Sẽ chuyển sang bản ghi giữ lại": "1 công ty (đã gắn sẵn với bản ghi giữ lại), 2 deal, 14 hoạt động, 2 người theo dõi." Số trong ngoặc là `alreadyLinked`: các liên kết này không tạo dòng mới.
- Bấm "Gộp" mà nhận `409 MERGE_STALE`: hộp thoại tải lại bước 2 với dữ liệu mới, giữ các lựa chọn còn áp dụng được, hiện dòng "Một trong hai bản ghi vừa được sửa. Kiểm tra lại các giá trị trước khi gộp."
- Có `blockers`: hộp cảnh báo đỏ liệt kê lý do, nút "Gộp" vô hiệu.
- Dòng cảnh báo trên nút: "Không hoàn tác được. {Tên bản ghi bỏ đi} sẽ chuyển vào thùng rác và không khôi phục được."
- Nút "Quay lại" · "Huỷ" · **"Gộp"** (nút đỏ). Gộp xong: đóng hộp thoại, mở trang bản ghi giữ lại, toast "Đã gộp {tên bản ghi bỏ đi} vào {tên bản ghi giữ lại}".

---

## 5. Chuyển giao bản ghi

### 5.1 Xem trước

```
POST /api/v1/ownership/transfer-preview
{ "ownerCollection": "NhanVien", "fromId": "emp_07", "targets": [ … ] }
```

`targets` là danh sách nơi cần đổi, do màn gọi khai báo. CRM-08 dùng:

```json
[
  { "key": "contacts",  "collection": "crm_contacts",   "field": "owner_id",    "where": {} },
  { "key": "companies", "collection": "crm_companies",  "field": "owner_id",    "where": {} },
  { "key": "openDeals", "collection": "deals_pipeline", "field": "owner_id",    "where": { "giai_o_n_pipeline": { "nin": ["5. Closed Won", "6. Closed Lost"] } } },
  { "key": "openTasks", "collection": "crm_activities", "field": "assignee_id", "where": { "activity_type": { "eq": "Task" }, "is_done": { "eq": false } } }
]
```

Phản hồi: `{ counts: { contacts: 42, companies: 17, openDeals: 9, openTasks: 6 }, notPermitted: { … } }`. `notPermitted` là số bản ghi người gọi đọc được nhưng không ghi được, để giao diện báo trước.

Kiểm cấu hình target trước khi đếm: `field` phải là trường Liên kết tới đúng `ownerCollection` trên `collection` của target, `where` theo cú pháp F03. Sai thì `422 TRANSFER_TARGET_INVALID` với `details.key` là target sai. Kiểm này áp cho cả §5.2.

### 5.2 Thực hiện

```
POST /api/v1/ownership/transfer
{ "ownerCollection": "NhanVien", "fromId": "emp_07", "toId": "emp_12", "targets": [ …chỉ các mục được chọn… ] }
```

- Tạo **một** job `kind = transfer` (§3.6) với một `batchId`, chốt danh sách theo từng target rồi xử lý như bulk update (§3.2), trường `field` đặt bằng `toId`.
- Lúc xử lý từng bản ghi, máy chủ kiểm lại `field = fromId` và `where` của target (đọc trong cùng giao dịch ghi). Bản ghi đã đổi owner sang người khác, deal đã chuyển sang Won/Lost, task đã xong kể từ lúc chốt danh sách thì **bỏ qua** (`skipped`), không ghi đè.
- `toId` phải khác `fromId` và là nhân viên đang làm việc (D-WORKSTATUS "Đang làm việc"): sai thì `422 TRANSFER_TARGET_INVALID`.
- Deal đã đóng **không** đổi owner, để doanh số và tỷ lệ thắng trong quá khứ vẫn tính cho đúng người (CRM-08 §6).
- Phản hồi `202 { jobId, batchId, counts }`. Kết quả, thông báo theo §3.5; nhân viên nhận nhận một thông báo gộp "{người thực hiện} đã giao 74 bản ghi của {người cũ} cho bạn" (F03-S3 §6.3).
- Quyền: mỗi target cần quyền ghi trên collection đó; thiếu quyền một collection thì target đó bị bỏ qua và ghi vào kết quả, các target khác vẫn chạy. Người gọi không có quyền ghi trên target nào: `403 BULK_FORBIDDEN`.

### 5.3 Đổi tên ở trường văn bản cũ

Owner là liên kết tới NhanVien (QĐ-01), nên đổi tên nhân viên không cần sửa bản ghi nào: mọi nơi hiển thị tên qua liên kết. Ngoại lệ là trường văn bản `sale_ph_tr_ch` của Deals trong thời gian chuyển tiếp (CRM-00 §8.1): khi Họ và tên của một nhân viên đổi, máy chủ tạo một job `update` cho các deal có `owner_id` là nhân viên đó, đặt `sale_ph_tr_ch` bằng tên mới.

- Job chạy với **quyền hệ thống**, không theo quyền người đổi tên: người đổi tên có thể không ghi được mọi deal của nhân viên đó, nhưng trường văn bản cũ vẫn phải khớp tên mới ở mọi deal.
- `record_change` ghi `source = system` thay vì `bulk` như §3.2. Đây là ngoại lệ có chủ ý: lịch sử của deal không nên hiện như thể người đổi tên đã sửa từng deal.
- Đổi tên lần nữa khi job trước còn `queued` hoặc `running`: job cũ bị huỷ (dừng sau lô đang chạy) rồi mới tạo job mới, để tên cuối cùng luôn thắng.
- Job này không gửi thông báo. Khi đồng bộ của CRM-00 §8.1 đã tắt thì bỏ bước này.

---

## 6. Lỗi mới

| HTTP | Code | Khi nào |
|---|---|---|
| 422 | `BULK_FIELD_NOT_ALLOWED` | `set` rỗng, có trường tính, hệ thống hoặc Duy nhất |
| 422 | `BULK_TOO_MANY` | Lựa chọn quá 50.000 bản ghi, hoặc `ids` quá 1.000 |
| 403 | `BULK_FORBIDDEN` | Không có quyền thao tác hàng loạt hoặc chuyển giao (§3.1, §5.2) |
| 409 | `BULK_JOB_FINISHED` | Huỷ job đã kết thúc |
| 422 | `MERGE_INVALID` | Gộp chính nó, khác collection, bản ghi đã xoá |
| 422 | `MERGE_NOT_SUPPORTED` | Collection không có `mergeConfig` |
| 422 | `MERGE_CHILD_CONFLICT` | Cả hai deal đều có line item (§4.4) |
| 422 | `MERGE_TOO_LARGE` | Quá 20.000 mục cần chuyển |
| 403 | `MERGE_FORBIDDEN` | Không ghi được bản ghi chính hoặc không xoá được bản ghi phụ |
| 409 | `MERGE_STALE` | Một trong hai bản ghi đã bị sửa sau lúc xem trước |
| 422 | `RECORD_MERGED` | Khôi phục bản ghi đã gộp |
| 422 | `TRANSFER_TARGET_INVALID` | Nhân viên nhận không hợp lệ, hoặc cấu hình target sai (§5.1) |

---

## 7. Ảnh hưởng tới workflow

- Bulk update, chuyển giao: mỗi bản ghi phát sự kiện sửa của F03 như sửa tay, nên workflow "khi bản ghi được sửa" chạy cho từng bản ghi. Một job 5.000 bản ghi có thể kích hoạt 5.000 lần chạy workflow. Spec giữ hành vi này để không bỏ sót nghiệp vụ, và ghi rủi ro ở Q2.
- Xoá hàng loạt: phát sự kiện xoá như xoá tay.
- Gộp: phát `record.merged` một lần; các thay đổi trường trên bản ghi chính phát sự kiện sửa một lần (gộp các trường trong một lần sửa).

---

## 8. Thay đổi cho các spec khác

| Spec | Thay đổi |
|---|---|
| F03-S3 | Thêm loại sự kiện `merged` (tiêu đề "Đã gộp bản ghi", thuộc nhóm `S_ASSOC`); `merged` hiện trên timeline của bản ghi chính |
| CRM-00 | Đặt `mergeConfig` cho ba đối tượng; cột `mergedIntoId` ở bảng `record` thuộc F03, không phải trường của collection |
| CRM-01 | §4.12: tới 200 bản ghi chọn tay chạy ngay; 201 – 1.000 bản ghi chọn tay, hoặc chọn theo bộ lọc, chạy job (§3); §5.3 mục "Gộp" mở hộp thoại §4.7 |

---

## 9. Tiêu chí nghiệm thu

Mã AC dùng tiền tố `F03S5`; ID tính năng được phục vụ ghi trong ngoặc.

**AC-F03S5-1 — Gán owner theo bộ lọc chạy nền (phục vụ C-11)**
Given 4.812 contact khớp bộ lọc Lifecycle = Lead, quản lý đọc và ghi được tất cả
When gán owner Lan Lê cho "tất cả 4.812 bản ghi khớp bộ lọc"
Then phản hồi 202 có `jobId`; thanh tiến độ hiện ở góc màn hình; xong thì quản lý nhận "Đã gán owner Lan Lê cho 4.812 contact."; Lan nhận một thông báo gộp.

**AC-F03S5-2 — Bỏ qua bản ghi không có quyền (phục vụ C-11)**
Given 24 contact được chọn, người gọi chỉ ghi được 20
When gán owner
Then kết quả `succeeded` 20, `skipped` 4; 4 bản ghi kia không đổi.

**AC-F03S5-3 — Danh sách chốt khi bắt đầu (phục vụ C-11)**
Given job xoá theo bộ lọc đang chạy
When có contact mới khớp bộ lọc được tạo giữa chừng
Then contact mới không bị xoá.

**AC-F03S5-4 — Huỷ job (phục vụ C-11)**
Given job 5.000 bản ghi đã xử lý 2.200
When bấm huỷ
Then job dừng sau lô đang chạy, `status = cancelled`; khoảng 2.200–2.400 bản ghi đã đổi giữ nguyên thay đổi; thông báo kết quả ghi đúng số đã xử lý.

**AC-F03S5-5 — Gộp contact (phục vụ C-17)**
Given contact A "Nguyễn Thị Hạnh" (email hanh@thienphuc.vn, không có SĐT, Primary Thiên Phúc) và B "Hạnh Nguyễn" (email hanh.nguyen@gmail.com, SĐT 0903 123 456, gắn Thiên Phúc và DEAL-021, 5 hoạt động)
When gộp B vào A, giữ email của A
Then A có SĐT 0903 123 456, vẫn chỉ một dòng nối với Thiên Phúc (Primary), có thêm DEAL-021 và 5 hoạt động trên timeline; B ở thùng rác với `mergedIntoId = A`; timeline A có sự kiện "… đã gộp Hạnh Nguyễn vào bản ghi này".

**AC-F03S5-6 — Không khôi phục bản ghi đã gộp (phục vụ C-17)**
Given B đã được gộp vào A
When khôi phục B từ thùng rác
Then trả `422 RECORD_MERGED` với câu "Bản ghi đã được gộp vào Nguyễn Thị Hạnh. Không khôi phục được."

**AC-F03S5-7 — Gộp deal có line item (phục vụ C-17)**
Given DEAL-013 và DEAL-021 đều có line item
When mở hộp thoại gộp
Then bước 2 có cảnh báo "Cả hai deal đều có line item…", nút "Gộp" vô hiệu.

**AC-F03S5-8 — Chuyển giao (phục vụ S-18)**
Given Minh Trần có 42 contact, 17 company, 9 deal đang mở, 3 deal đã thắng, 6 task chưa xong
When chuyển giao cả bốn mục cho Lan Lê
Then 42 contact, 17 company, 9 deal đang mở có owner Lan Lê, 6 task có người thực hiện Lan Lê; 3 deal đã thắng vẫn của Minh Trần; mọi thay đổi chung một `batchId`.

**AC-F03S5-9 — Không chuyển cho người đã nghỉ (phục vụ S-18)**
Given Phương Nguyễn có trạng thái Đã nghỉ
When chuyển giao cho Phương Nguyễn
Then trả `422 TRANSFER_TARGET_INVALID`.

**AC-F03S5-10 — Đổi tên nhân viên trong thời gian chuyển tiếp (phục vụ S-12)**
Given đồng bộ `sale_ph_tr_ch` (CRM-00 §8.1) đang bật, Minh Trần sở hữu 12 deal
When đổi tên thành "Trần Văn Minh"
Then 12 deal có `sale_ph_tr_ch` = "Trần Văn Minh", lịch sử của các deal ghi `source = system`; owner của mọi contact, company, deal hiển thị tên mới mà không có dòng `record_change` nào cho trường `owner_id`.

---

## 10. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-F03S5-01 | API | `bulk/update` 200 id rồi 201 id | 200 id: `200`, chạy ngay. 201 id: `202` có `jobId` |
| TC-F03S5-02 | API | `bulk/update` 1.001 id | 422 BULK_TOO_MANY |
| TC-F03S5-03 | API | `bulk/update` với `set.email` | 422 BULK_FIELD_NOT_ALLOWED |
| TC-F03S5-04 | API | Bộ lọc khớp 60.000 | 422 BULK_TOO_MANY, `details.count = 60000` |
| TC-F03S5-05 | API | `expectedCount` 4.812, lúc chạy khớp 5.300 | Job chạy; kết quả có câu báo khác số |
| TC-F03S5-06 | API | Người thứ ba tạo job khi đang có 2 job chạy | `status = queued` |
| TC-F03S5-07 | API | Một lô lỗi hệ thống hai lần | 200 bản ghi `failed` mã BULK_SYSTEM_ERROR, job chạy tiếp |
| TC-F03S5-08 | API | Job update có 25 lỗi dữ liệu | `errors` có 20 phần tử, `failed = 25` |
| TC-F03S5-09 | API | Mọi thay đổi của một job | Cùng `batchId`, `source = bulk` trong `record_change` |
| TC-F03S5-10 | API | Người khác xem job | 403 |
| TC-F03S5-11 | API | Gộp bản ghi vào chính nó | 422 MERGE_INVALID |
| TC-F03S5-12 | API | Gộp hai contact, email của bản ghi phụ được chọn | Bản ghi chính nhận email mới; không lỗi trùng |
| TC-F03S5-13 | API | Gộp hai contact cùng là Primary của hai công ty khác nhau | Giữ Primary của bản ghi chính; công ty của bản ghi phụ thành không Primary |
| TC-F03S5-14 | API | Gộp company B vào A, có 3 deal `company_id = B` | 3 deal có `company_id = A` |
| TC-F03S5-15 | API | Gộp deal, chỉ bản ghi phụ có line item | Line item chuyển sang; `line_items_total` tính lại |
| TC-F03S5-16 | API | Gộp khi không có quyền xoá bản ghi phụ | 403 MERGE_FORBIDDEN |
| TC-F03S5-17 | API | Gộp collection không có `mergeConfig` | 422 MERGE_NOT_SUPPORTED |
| TC-F03S5-18 | API | Lỗi giữa giao dịch gộp | Không có gì thay đổi ở cả hai bản ghi |
| TC-F03S5-19 | API | Xem trước gộp: hai bản ghi giống hệt | `fields` rỗng |
| TC-F03S5-20 | API | Chuyển giao khi người gọi không có quyền ghi `crm_activities` | Task bị bỏ qua, các target khác chạy; kết quả ghi rõ |
| TC-F03S5-21 | E2E | Hộp thoại gộp: đổi bản ghi giữ lại sang bên phải | Bảng giá trị tải lại, mặc định đổi theo |
| TC-F03S5-22 | Hiệu năng | Bulk update 1.000 bản ghi chỉ đổi owner | ≤ 30 giây |
| TC-F03S5-23 | API | Xem trước gộp, rồi người khác sửa bản ghi phụ, rồi gọi gộp với `expectedUpdatedAt` cũ | 409 MERGE_STALE, không có gì thay đổi |
| TC-F03S5-24 | API | Gộp hai contact cùng liên kết với một deal đã đổi giai đoạn trước đó | Timeline bản ghi chính có sự kiện đổi giai đoạn đúng một lần; không lỗi trùng khoá |
| TC-F03S5-25 | API | Gộp B vào A; xem timeline A | Sự kiện "đã tạo" của B hiện dạng "… đã tạo Contact Hạnh Nguyễn", `via = merge:<id B>` |
| TC-F03S5-26 | API | Chuyển giao; giữa lúc chốt danh sách và lúc xử lý, một contact được sửa owner sang người thứ ba | Contact đó `skipped`, owner người thứ ba giữ nguyên |
| TC-F03S5-27 | API | Đổi tên nhân viên hai lần liên tiếp khi job đồng bộ lần đầu đang chạy | Job đầu `cancelled`; mọi deal có `sale_ph_tr_ch` là tên thứ hai |
| TC-F03S5-28 | API | Gộp deal, chọn giai đoạn "5. Closed Won" của bản ghi phụ | `closed_at`, `stage_changed_at` của bản ghi chính lấy theo bản ghi phụ |
| TC-F03S5-29 | API | `transfer-preview` với target có `field` là trường văn bản | 422 TRANSFER_TARGET_INVALID, `details.key` đúng target |

---

## 11. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Xoá hàng loạt trên dữ liệu trình duyệt, không giới hạn, không kiểm quyền | API §3 có ngưỡng, kiểm quyền từng bản ghi, job chạy nền |
| Không có "chọn tất cả theo bộ lọc" | Có (§3.3) |
| Mục "Gộp" là "Sắp có" | Gộp đầy đủ (§4) |
| Chuyển giao đổi owner từng bản ghi ở trình duyệt, gồm mọi deal | Một job ở máy chủ; deal đã đóng giữ nguyên owner; có task chưa xong (§5) |
| Đổi tên sale chạy cập nhật hàng loạt owner theo tên | Owner là liên kết nên không cần; chỉ đồng bộ trường văn bản cũ khi còn chuyển tiếp (§5.3) |

---

## 12. Giả định và câu hỏi

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | Ngưỡng 200 bản ghi chạy ngay có phù hợp giới hạn thời gian request hiện tại của ERP không? (cùng CRM-01 Q2) | BE | §3.1 |
| Q2 | Thao tác hàng loạt có nên tắt kích hoạt workflow (tuỳ chọn cho quản trị) để tránh hàng nghìn lần chạy không? | BE / khách | §7 |
| Q3 | Chuyển giao có cần chuyển cả cuộc họp sắp tới (không chỉ task) không? | Khách | §5.1 |
| Q4 | Gộp deal khi cả hai có line item: có cần cho chọn giữ line item của một bên thay vì chặn không? | PO | §4.4 |

---

## Liên kết

- Tầng dữ liệu gốc: `F03-collections-data-layer.md` §Bulk Operations
- Liên kết: `F03-S1-lien-ket-ban-ghi.md` §3, §4
- Nhật ký, thông báo: `F03-S3-nhat-ky-thay-doi-su-kien.md` §3.2, §6.3
- Trường tính: `F03-S2-truong-tinh-rollup.md`
- Khung CRM: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-01-khung-danh-sach-trang-chi-tiet.md` §4.12, §5.3
- Sales: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-08-sales.md`

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-10-01 | v1.0 — bản đầu | TTS (qua Claude) |
| 2026-10-01 | v1.1 — sửa theo review: chạy ngay tới 200 id, 201 – 1.000 id chạy job; chuyển giao kiểm lại điều kiện lúc xử lý và kiểm cấu hình target; gộp khoá hai dòng, `expectedUpdatedAt` và `409 MERGE_STALE`, chuyển dữ liệu với quyền hệ thống, xử lý trùng khoá `record_event_subject`, `via = merge:<id>`; không cho chọn trường BE tự ghi; mã 403 riêng; job đổi tên chạy quyền hệ thống, huỷ job cũ | TTS (qua Claude) |

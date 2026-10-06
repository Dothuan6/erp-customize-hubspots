# F03-S6 — Hoạt động và timeline

> **Trạng thái:** 💡 Proposed · v1.1 · 01/10/2026 · chờ review
> **Loại:** spec nền (tầng A), mở rộng `F03-collections-data-layer.md`
> **Tính năng sở hữu:** không sở hữu ID nào trong sheet; là phần BE của A-02, A-03, A-07, A-10, A-16 và của mọi timeline
> **Phục vụ:** A-01 → A-16 (giao diện ở `CRM-05`), C-18, CO-08 (tab Tổng quan), D-04 (cột Hoạt động tiếp theo), G-04 (qua `F03-S2`), S-07, S-08, S-13, S-15, S-16 (số hoạt động, task quá hạn, việc cần làm, hoạt động gần đây của sale)
> **Phụ thuộc:** `CRM-00` §5.10, §5.11 (collection `crm_activities` và ba bảng nối) · `F03-S1` (bảng nối, `_associations`) · `F03-S3` (sự kiện, người theo dõi, thông báo)
> **Được dùng bởi:** `CRM-05`, `F03-S2` (tính Ngày hoạt động gần nhất, Liên hệ gần nhất, Hoạt động tiếp theo), `CRM-02` §5.3, `CRM-04` §3.4, `CRM-08`
> **Nguồn:** prototype `crm-objects.js` (`composer`, `timeline`, `autoRefs`, `cleanHtml`, `KIND_GROUPS`) · `DOI-CHIEU-CHUC-NANG.md` §10, §14 · F11 "Notification bell" · plan `00-PLAN-viet-spec.md` QĐ-04

---

## 0. Tóm tắt

Hoạt động là việc do **người** ghi lại quanh một khách hàng: Ghi chú, Task, Cuộc gọi, Cuộc họp. Dữ liệu nằm trong collection `crm_activities` và ba bảng nối tới Contact, Company, Deal (CRM-00 §5.10, §5.11). Spec này bổ sung những gì một collection thường chưa có:

1. **Tạo hoạt động kèm liên kết trong một lần gọi**, cùng lúc có thể tạo thêm task theo dõi. Máy chủ gợi ý bản ghi nên liên kết; người dùng bỏ chọn được.
2. **Nội dung có định dạng** được lọc HTML ở máy chủ trên mọi đường ghi.
3. **Timeline gộp** cho một bản ghi: hoạt động gắn với bản ghi đó và sự kiện hệ thống của `F03-S3`, có lọc theo loại, người, khoảng thời gian, có mục "Sắp tới" và mục ghim.
4. **Hoàn thành task** bởi người thực hiện, kể cả khi người đó không có quyền sửa hoạt động.
5. **Job nhắc hạn và lặp task.**
6. **Bình luận** trên hoạt động.
7. **Danh sách task CRM của tôi** để màn "Việc của tôi" đọc chung, không nhân đôi bản ghi (QĐ-04).

Giao diện (cửa sổ soạn, timeline) ở `CRM-05`. Trường tính suy ra từ hoạt động (Ngày hoạt động gần nhất, Liên hệ gần nhất, Hoạt động tiếp theo) ở `F03-S2`.

---

## 1. Vấn đề

| Hiện trạng | Hệ quả |
|---|---|
| ERP chưa có khái niệm hoạt động. Tab "Lịch sử" trên trang chi tiết đang "sắp ra mắt" | Không ghi được cuộc gọi, cuộc họp, ghi chú quanh khách hàng |
| Tạo một bản ghi rồi tạo từng dòng nối là nhiều request tách rời | Ghi chú lưu được nhưng gắn liên kết lỗi thì ghi chú "mồ côi", không hiện ở đâu |
| Trường Văn bản dài lưu chuỗi thô | Lưu HTML do trình duyệt gửi lên mà không lọc là lỗ hổng XSS |
| Không có API gộp dữ liệu từ nhiều nguồn cho một bản ghi | FE phải gọi ba bảng nối, ba lượt hoạt động, rồi sự kiện, rồi tự trộn và phân trang, không làm đúng được khi dữ liệu lớn |
| Task của workflow (F07) hiện ở "Việc của tôi"; task CRM là một collection khác | Nếu không có quy tắc thì sale phải xem việc ở hai nơi |

Prototype làm toàn bộ ở FE: `autoRefs` tự chọn bản ghi liên kết, `cleanHtml` lọc HTML trong trình duyệt, `activitiesOf` trộn hoạt động với sự kiện, ghim lưu `localStorage`, nhắc nhở và lặp lại chỉ là ô chọn không có tác dụng.

### 1.1 Trong phạm vi

- Khai báo collection hoạt động (`activity_config`) để máy chủ biết trường nào là loại, thời điểm, hạn, người thực hiện.
- Tuỳ chọn định dạng HTML cho trường Văn bản dài, lọc ở máy chủ.
- API tạo, sửa, xoá hoạt động kèm liên kết và task theo dõi.
- API gợi ý liên kết.
- API timeline gộp.
- Ghim theo bản ghi.
- Hoàn thành task, mở lại task.
- Job nhắc hạn, job lặp task.
- Bình luận.
- Thông báo liên quan đến hoạt động (gọi hàm thông báo của F03-S3).
- API task CRM của tôi.

### 1.2 Ngoài phạm vi

- Gửi email, SMS, WhatsApp, LinkedIn, gọi qua tổng đài (A-15). Không có loại hoạt động tương ứng.
- Đồng bộ lịch Google, Outlook cho cuộc họp (A-10 chỉ là cuộc họp tương lai lưu trong ERP).
- Đính kèm tệp vào hoạt động. Prototype có nút đính kèm nhưng chỉ hiện toast; giai đoạn này không làm (Q3).
- Nhắc bằng email, Zalo. Chỉ nhắc qua chuông ERP.
- Ngày nghỉ lễ khi tính "ngày làm việc" (Q2).
- Timeline gộp hoạt động của mọi contact lên company lúc đọc. Company thấy hoạt động nhờ quy tắc gợi ý gắn Công ty chính khi tạo (§4.1, CRM-03 §5.3).

---

## 2. Khái niệm

| Từ | Nghĩa |
|---|---|
| **Hoạt động** | Một bản ghi của `crm_activities`. Bốn loại: Ghi chú, Task, Cuộc gọi, Cuộc họp (D-ACTTYPE) |
| **Bản ghi chủ** | Bản ghi đang mở khi người dùng tạo hoạt động (ví dụ trang chi tiết Contact Hạnh). Hoạt động luôn gắn với bản ghi chủ, trừ khi người dùng bỏ chọn |
| **Liên kết của hoạt động** | Các dòng trong ba bảng nối `crm_activity_contacts`, `crm_activity_companies`, `crm_activity_deals`. Một hoạt động có thể gắn với nhiều contact, company, deal |
| **Mục timeline** | Một dòng trên timeline của bản ghi: một hoạt động hoặc một sự kiện F03-S3 |
| **Thời điểm hiển thị** | Mốc dùng để sắp và nhóm mục timeline (§5.2) |
| **Sắp tới** | Task chưa xong (kể cả quá hạn) và cuộc họp có giờ bắt đầu sau hiện tại với kết quả "Đã lên lịch" hoặc trống. Hiện thành một nhóm riêng phía trên |
| **Task theo dõi** | Task tạo cùng lúc với một hoạt động khác, để nhắc liên hệ lại (A-04) |

---

## 3. Dữ liệu

### 3.1 Khai báo collection hoạt động

Thêm vào metadata collection thuộc tính `activity_config` (JSON). Collection có thuộc tính này được máy chủ xử lý như collection hoạt động. CRM chỉ có một: `crm_activities`.

```json
{
  "typeField": "activity_type",
  "titleField": "title",
  "bodyField": "body_html",
  "occurredAtField": "occurred_at",
  "dueField": "due_at",
  "doneField": "is_done",
  "completedAtField": "completed_at",
  "assigneeField": "assignee_id",
  "reminderField": "reminder",
  "repeatField": "repeat_rule",
  "meetingOutcomeField": "meeting_outcome",
  "links": [
    { "associationId": "jn:crm_activity_contacts",  "target": "crm_contacts" },
    { "associationId": "jn:crm_activity_companies", "target": "crm_companies" },
    { "associationId": "jn:crm_activity_deals",     "target": "deals_pipeline" }
  ],
  "types": {
    "Ghi chú":  { "code": "NOTE" },
    "Task":     { "code": "TASK" },
    "Cuộc gọi": { "code": "CALL" },
    "Cuộc họp": { "code": "MEETING" }
  }
}
```

- `links` là các kênh (F03-S1) nối hoạt động với bản ghi. Mỗi collection đích xuất hiện tối đa một lần.
- `types` ánh xạ giá trị danh mục D-ACTTYPE sang mã dùng trong API (`NOTE`, `TASK`, `CALL`, `MEETING`). Đổi chữ hiển thị trong danh mục thì sửa ở đây, mã không đổi.
- Script khởi tạo của CRM-00 ghi cấu hình này (bổ sung vào CRM-00 §5.13).

### 3.2 Trường Văn bản dài định dạng HTML

Thêm tuỳ chọn `format: "html"` cho kiểu Văn bản dài (F03). Trường có tuỳ chọn này:

- Máy chủ lọc giá trị trên **mọi** đường ghi: API bản ghi, API hoạt động (§4), nhập file, workflow, bulk update. Không tin phần lọc ở trình duyệt.
- Danh sách thẻ giữ lại: `b strong i em u br p div ul ol li`. Thẻ khác bị bỏ nhưng giữ chữ bên trong. Mọi thuộc tính (`style`, `class`, `on*`, `href`…) bị bỏ. Chú thích HTML bị bỏ.
- Kết quả rỗng sau khi lọc (chỉ còn khoảng trắng, `<br>`, `<p></p>`) được lưu là `null`.
- Máy chủ lưu thêm bản chữ thuần của nội dung vào cột phụ `text_plain` (không phải trường người dùng thấy) để tìm kiếm và để giao diện cắt 80 ký tự đầu khi cần (CRM-02 §5.3).
- Hiển thị trong bảng dữ liệu: chữ thuần, một dòng. Hiển thị trên timeline: HTML đã lọc.
- Giới hạn 20.000 ký tự HTML sau khi lọc. Quá thì trả `422 HTML_TOO_LONG`.

`crm_activities.body_html` và `crm_activity_comments.body_html` (§3.5) dùng tuỳ chọn này.

### 3.3 Trường bổ sung cho `crm_activities`

CRM-00 §5.10 đã có đủ trường nhập. Spec này thay `is_recurring` và thêm hai trường hệ thống. CRM-00 cập nhật theo.

| Key | Tên hiển thị | Kiểu | Ghi chú |
|---|---|---|---|
| `repeat_rule` | Lặp lại | Lựa chọn đơn | D-REPEAT: Hằng ngày · Hằng tuần · 2 tuần một lần · Hằng tháng · Hằng quý · Nửa năm · Hằng năm. Trống là không lặp. Chỉ dùng cho Task. **Thay cho** `is_recurring` (Hộp kiểm) ở CRM-00, vì một ô tick không đủ để biết lặp theo chu kỳ nào |
| `reminder_sent_at` | Đã nhắc lúc | Ngày giờ | Job nhắc hạn ghi (§7.1). Không sửa tay. Xoá khi hạn hoặc mức nhắc đổi |
| `repeat_source_id` | Lặp từ task | Liên kết → crm_activities | Task kỳ trước sinh ra task này (§7.2). Không sửa tay |

Giá trị hợp lệ theo loại:

| Loại | Bắt buộc | Không được có |
|---|---|---|
| Ghi chú | `body_html` | `due_at`, `assignee_id`, `is_done`, trường cuộc gọi, trường cuộc họp |
| Task | `title`, `due_at`, `assignee_id` | trường cuộc gọi, trường cuộc họp |
| Cuộc gọi | `occurred_at` | `due_at`, `assignee_id`, trường cuộc họp |
| Cuộc họp | `occurred_at`, `duration_minutes` | `due_at`, `assignee_id`, trường cuộc gọi |

Gửi trường "không được có" thì trả `422 ACTIVITY_FIELD_NOT_ALLOWED` kèm tên trường. Kiểm ở máy chủ cho mọi đường ghi vào collection hoạt động, kể cả API bản ghi thông thường.

`title` của Ghi chú và Cuộc gọi do máy chủ ghi để liên kết có chữ hiển thị (CRM-00 §5.10): "Ghi chú" và "Cuộc gọi với {tên contact đầu tiên trong Đã liên hệ}" (không có ai thì "Cuộc gọi"). Cuộc họp không có tiêu đề thì máy chủ ghi "Cuộc họp".

`activity_type` không đổi được sau khi tạo. PATCH đổi loại trả `422 ACTIVITY_TYPE_LOCKED`.

### 3.4 Người trong cuộc gọi, cuộc họp

"Đã liên hệ" của cuộc gọi và "Người tham dự" của cuộc họp **không** là trường riêng. Chúng là dòng `crm_activity_contacts` có `role` = `Đã liên hệ` hoặc `Tham dự` (CRM-00 §5.11). Contact chỉ liên quan có `role` = `Liên quan`.

Hệ quả: một contact tham dự cuộc họp luôn thấy cuộc họp đó trên timeline của mình, và F03-S2 tính "Liên hệ gần nhất" cho đúng người đã nói chuyện.

### 3.5 Collection `crm_activity_comments` — bình luận (A-16)

Collection mới, định nghĩa trường ở CRM-00 §5.10a. Theo sheet A-16, bình luận chỉ có trên **Ghi chú và Task**. A-16 là P2 và QĐ-10 đề xuất để sang đợt sau; spec viết sẵn để khi chốt làm thì không phải chờ.

| Key | Tên hiển thị | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| `activity_id` | Hoạt động | Liên kết → crm_activities | ✓ | `onDelete: cascade` (F03-S1 §3.4): xoá hoạt động thì xoá bình luận theo |
| `body_html` | Nội dung | Văn bản dài, `format: html` | ✓ | Tối đa 5.000 ký tự sau khi lọc |

Người viết và thời điểm là trường hệ thống (người tạo, ngày tạo). Collection không hiện trong menu Dữ liệu. Spec thêm thuộc tính metadata `hideInDataMenu` ở mức collection cho collection thường; bảng nối vẫn dùng `junction_config.hideInDataMenu` của F03-S1 §3.1.

### 3.6 Ghim

Ghim là theo từng bản ghi: cờ `is_pinned` trên dòng bảng nối (CRM-00 §5.11). **Mỗi bản ghi ghim tối đa một hoạt động**, giống HubSpot và prototype. Ghim hoạt động khác thì hoạt động cũ tự bỏ ghim.

Ràng buộc ở cơ sở dữ liệu: dùng bảng `junction_pair` của F03-S1, không tạo index riêng cho từng bảng nối. F03-S1 §3.1 thêm `pinField`, `pinScope` vào `junction_config` (với ba bảng nối hoạt động: `is_pinned`, `right`), và §3.2 thêm cột `isPinned` cùng index duy nhất `(junction_collection_id, right_record_id) WHERE is_pinned AND deleted_at IS NULL`.

---

## 4. API hoạt động

Tiền tố `/api/v1/activities`. Hoạt động vẫn là bản ghi F03 bình thường nên API bản ghi chung (`/collections/crm_activities/records`) vẫn dùng được cho nhập file, xuất file, workflow. API dưới đây dành cho giao diện, gom nhiều bước vào một giao dịch.

Định dạng phản hồi và lỗi theo F03: `{ status, data, meta }`, lỗi `{ status: "error", error: { code, message, details } }`.

### 4.1 Gợi ý liên kết

```
GET /api/v1/activities/suggest-links?from=crm_contacts:rec_ct01
```

```json
{
  "status": "success",
  "data": [
    { "associationId": "jn:crm_activity_contacts",  "targetId": "rec_ct01", "label": "Nguyễn Thị Hạnh",       "objectLabel": "Contact", "reason": "host" },
    { "associationId": "jn:crm_activity_companies", "targetId": "rec_co13", "label": "Dược phẩm Thiên Phúc", "objectLabel": "Company", "reason": "primary_company" },
    { "associationId": "jn:crm_activity_deals",     "targetId": "rec_r013", "label": "DEAL-013",             "objectLabel": "Deal",    "reason": "open_deal" }
  ]
}
```

Quy tắc gợi ý (A-03):

| Bản ghi chủ | Gợi ý |
|---|---|
| Contact | Chính contact đó · Công ty chính của contact · Mọi deal **đang mở** của contact (CRM-00 §5.4.3) |
| Deal | Chính deal đó · Mọi contact của deal · Company của deal |
| Company | Chính company đó |

- Chỉ gợi ý bản ghi người gọi đọc được.
- Tối đa 30 gợi ý. Contact có hơn 30 deal đang mở (hiếm) thì lấy 30 deal có ngày dự kiến chốt gần nhất.
- `reason`: `host` (bản ghi chủ), `primary_company`, `open_deal`, `deal_contact`, `deal_company`. Giao diện không cần hiển thị, dùng để kiểm thử.

Máy chủ **không** tự gắn thêm gì lúc lưu. Danh sách cuối cùng là danh sách FE gửi lên sau khi người dùng bỏ chọn. Phần tử dùng tên `targetId` như F03-S1 §4.7 để FE chuyển thẳng sang request tạo.

### 4.2 Tạo hoạt động

```
POST /api/v1/activities
```

```json
{
  "hostRecord": "crm_contacts:rec_ct01",
  "activity": {
    "activity_type": "Cuộc gọi",
    "occurred_at": "2026-09-30T09:15:00+07:00",
    "call_direction": "Gọi đi",
    "call_outcome": "Đã kết nối",
    "body_html": "<p>Chị Hạnh cần báo giá gói <b>PROFESSIONAL</b> trước 05/10.</p>"
  },
  "links": [
    { "associationId": "jn:crm_activity_contacts",  "targetId": "rec_ct01", "role": "Đã liên hệ" },
    { "associationId": "jn:crm_activity_companies", "targetId": "rec_co13" },
    { "associationId": "jn:crm_activity_deals",     "targetId": "rec_r013" }
  ],
  "followUpTask": {
    "task_kind": "To-do",
    "due_at": "2026-10-05T08:00:00+07:00"
  }
}
```

Phản hồi `201` trả hoạt động vừa tạo (dạng mục timeline, §5.3) và `followUpTaskId` nếu có.

Quy tắc:

- Mọi thứ ghi trong **một giao dịch**: hoạt động, các dòng nối, task theo dõi và các dòng nối của task theo dõi. Một phần lỗi thì không có gì được ghi; lỗi trả theo phần tử như F03-S1 §4.7 (`details: [{ index: 1, path: "links[1]", code: … }]`).
- `links` phải có ít nhất 1 phần tử: `422 ACTIVITY_NO_LINK`. Tối đa 50.
- Dòng nối tới contact không gửi `role` thì là `Liên quan`. Gửi `role` cho company hoặc deal thì trả `422`.
- Quyền gắn liên kết theo chế độ kế thừa của F03-S1 §6.2: người tạo ghi được hoạt động của mình nên chỉ cần **đọc được** bản ghi đích. Không đọc được thì `403 ASSOCIATION_TARGET_FORBIDDEN` cho phần tử đó.
- `occurred_at` của Ghi chú và Task do máy chủ đặt bằng thời điểm tạo; FE có gửi cũng bị bỏ qua.
- Người tạo là tài khoản gọi API (trường hệ thống). Chủ sở hữu hệ thống của hoạt động cũng là tài khoản đó.
- Task không gửi `assignee_id` thì máy chủ đặt bằng nhân viên có `tai_khoan` là người gọi (CRM-00 §5.6). Người gọi không gắn với nhân viên nào thì trả `422 ASSIGNEE_REQUIRED`. Quy tắc này áp cả cho task theo dõi.

**Task theo dõi (A-04).** Có `followUpTask` thì tạo thêm một Task:

- `title` = "Theo dõi: {loại hoạt động viết thường} với {tên bản ghi chủ}", ví dụ "Theo dõi: cuộc gọi với Nguyễn Thị Hạnh". Bản ghi chủ là `hostRecord` trong request (bắt buộc khi có `followUpTask`, phải nằm trong `links`; thiếu hoặc không khớp thì `422`).
- `due_at` theo `followUpTask.due_at`; `task_kind` theo `followUpTask.task_kind`, mặc định To-do.
- `assignee_id` = nhân viên của người tạo. `priority` = Không.
- Liên kết **giống hệt** hoạt động gốc (cùng danh sách, contact có `role` = Liên quan).
- Hoạt động gốc là Task thì không nhận `followUpTask` (`422`).

### 4.3 Sửa hoạt động

```
PATCH /api/v1/activities/:id
{ "activity": { ...trường đổi... }, "links": [ ...danh sách đầy đủ mới... ] }
```

- `activity` chỉ chứa trường thay đổi. `links` nếu có là **danh sách đầy đủ** sau khi sửa: máy chủ tính phần thêm, phần gỡ, phần đổi `role`, và giữ `is_pinned` của dòng còn lại. Không gửi `links` thì liên kết giữ nguyên.
- Danh sách mới rỗng: `422 ACTIVITY_NO_LINK`.
- Dòng nối bị gỡ đang ghim thì mất ghim theo.
- Quyền: như sửa bản ghi F03 (người có `record.write` trên `crm_activities`, hoặc chủ sở hữu hệ thống, tức người tạo). Người chỉ là người thực hiện task **không** sửa được nội dung, chỉ hoàn thành được (§4.5).
- Mỗi thay đổi ghi `record_change` theo F03-S3. `crm_activities` không có `history_config` nên không sinh sự kiện timeline.

### 4.4 Xoá hoạt động

```
DELETE /api/v1/activities/:id
```

- Xoá mềm hoạt động (khôi phục được 30 ngày như mọi bản ghi F03). Dòng nối và bình luận xoá theo (`onDelete: cascade`), khôi phục hoạt động thì khôi phục theo.
- Xoá một lần là mất khỏi **mọi** bản ghi liên kết. Muốn chỉ bỏ khỏi một bản ghi thì sửa liên kết (§4.3).
- Quyền: `record.delete` trên `crm_activities`, hoặc chủ sở hữu hệ thống.
- Xoá một task có `repeat_rule` không xoá các kỳ đã sinh ra trước đó.

### 4.5 Hoàn thành và mở lại task

```
POST /api/v1/activities/:id/complete     → is_done = true, completed_at = now
POST /api/v1/activities/:id/reopen       → is_done = false, completed_at = null
```

- Được gọi bởi: người có quyền sửa hoạt động (§4.3), **hoặc** người thực hiện task (tài khoản của nhân viên trong `assignee_id`).
- Chỉ áp cho Task: loại khác trả `422 ACTIVITY_NOT_TASK`.
- Gọi `complete` khi đã xong, `reopen` khi chưa xong: trả `200`, không đổi gì.
- `complete` một task có `repeat_rule` sinh task kỳ tiếp theo §7.2, trong cùng giao dịch. Phản hồi có `nextTaskId`.
- `reopen` không xoá task kỳ tiếp đã sinh. Phản hồi có `data.warnings: [{ code: "NEXT_TASK_EXISTS", nextTaskId }]` để giao diện báo "Task kỳ tiếp đã được tạo trước đó".
- Hai lời gọi `complete` đồng thời: máy chủ cập nhật có điều kiện (`… WHERE is_done = false`); chỉ lời gọi cập nhật được dòng mới sinh kỳ lặp, lời gọi kia trả `200` như đã xong.
- Sửa `is_done` qua API bản ghi chung cũng chạy đúng các quy tắc trên (máy chủ ghi `completed_at`, sinh kỳ tiếp).

### 4.6 Ghim

```
PUT    /api/v1/collections/:slug/records/:id/timeline/pin   { "activityId": "act_..." }
DELETE /api/v1/collections/:slug/records/:id/timeline/pin
```

- `PUT` đặt `is_pinned = true` trên dòng nối giữa bản ghi `:id` và hoạt động, bỏ ghim dòng cũ nếu có, trong một giao dịch.
- Hoạt động không gắn với bản ghi này: `404 ACTIVITY_NOT_LINKED`.
- Quyền: ghi được bản ghi `:id`, hoặc đọc được bản ghi và là người tạo hoạt động. Người chỉ xem được bản ghi không ghim được, để tránh mỗi người ghim một thứ trên timeline dùng chung.
- Chỉ ghim được hoạt động, không ghim sự kiện hệ thống.

### 4.7 Bình luận

```
GET    /api/v1/activities/:id/comments?limit=20&cursor=...
POST   /api/v1/activities/:id/comments          { "body_html": "<p>Đã gửi báo giá.</p>" }
PATCH  /api/v1/activities/:id/comments/:cid     { "body_html": "..." }
DELETE /api/v1/activities/:id/comments/:cid
```

- Chỉ Ghi chú và Task có bình luận; loại khác trả `422 ACTIVITY_COMMENTS_NOT_ALLOWED`.
- Đọc, viết bình luận cần đọc được hoạt động.
- Sửa, xoá: chỉ người viết, hoặc người có `record.delete` trên `crm_activity_comments`.
- Cũ nhất trước (đọc như một cuộc trao đổi).
- Viết bình luận gửi thông báo theo §8.

### 4.8 Task CRM của tôi (QĐ-04)

```
GET /api/v1/activities/my-tasks?status=open&due=overdue|today|week|all&limit=50&cursor=...
```

- Trả task có `assignee_id` là nhân viên gắn với người gọi (`tai_khoan`, CRM-00 §5.6). Người gọi không gắn với nhân viên nào: danh sách rỗng, không lỗi.
- `status`: `open` (mặc định), `done`, `all`. `due`: lọc theo hạn, tính theo giờ Việt Nam; `overdue` là hạn trước thời điểm hiện tại và chưa xong; `today` là hạn trong ngày hôm nay; `week` là hạn trong tuần lịch hiện tại (thứ Hai đến Chủ nhật).
- Sắp theo `due_at` tăng dần; task đã xong sắp theo `completed_at` giảm dần.
- Mỗi dòng có tên các bản ghi liên kết (tối đa 3, kèm tổng số) để màn "Việc của tôi" hiện "Task · Nguyễn Thị Hạnh, DEAL-013".
- Màn "Việc của tôi" (`features/tasks/MyTasksView.tsx`) thêm nhóm "Task CRM" đọc API này. Bấm một dòng mở trang chi tiết bản ghi đầu tiên ở tab Hoạt động. Tick hoàn thành gọi §4.5. **Không** sao chép task CRM sang bảng task của workflow F07.

Cách làm này phụ thuộc QĐ-04 (plan §5). Nếu khách chọn không hiện task CRM ở "Việc của tôi" thì bỏ phần màn hình, API vẫn giữ cho trang Sales (CRM-08).

### 4.9 Mã lỗi mới

| HTTP | Code | Khi nào |
|---|---|---|
| 422 | `ACTIVITY_NO_LINK` | Hoạt động không có liên kết nào |
| 422 | `ACTIVITY_FIELD_NOT_ALLOWED` | Gửi trường không thuộc loại hoạt động (§3.3) |
| 422 | `ACTIVITY_TYPE_LOCKED` | Đổi loại hoạt động sau khi tạo |
| 422 | `ACTIVITY_NOT_TASK` | Hoàn thành, mở lại một hoạt động không phải Task |
| 422 | `ASSIGNEE_REQUIRED` | Task không có người thực hiện và không suy ra được |
| 422 | `HTML_TOO_LONG` | Nội dung vượt giới hạn sau khi lọc |
| 404 | `ACTIVITY_NOT_LINKED` | Ghim hoạt động không gắn với bản ghi |
| 400 | `TIMELINE_QUERY_INVALID` | Tham số timeline sai (§5.1) |
| 422 | `ACTIVITY_COMMENTS_NOT_ALLOWED` | Bình luận trên Cuộc gọi, Cuộc họp |

---

## 5. Timeline gộp

### 5.1 API

```
GET /api/v1/collections/:slug/records/:id/timeline
    ?tab=ALL|NOTE|TASK|CALL|MEETING|EMAIL
    &kinds=CALL,MEETING,NOTE,TASK,S_STAGE,S_ASSOC,S_PROP,S_CREATED
    &from=2026-09-01&to=2026-09-30
    &actor=emp_07,emp_12
    &q=báo giá
    &limit=30&cursor=...
```

| Tham số | Ý nghĩa |
|---|---|
| `tab` | `ALL` (mặc định): hoạt động và sự kiện. `NOTE`, `TASK`, `CALL`, `MEETING`: chỉ hoạt động loại đó, bỏ qua `kinds`. `EMAIL`: luôn rỗng trong giai đoạn này (A-15) |
| `kinds` | Chỉ dùng khi `tab=ALL`. Mã loại hoạt động và mã nhóm sự kiện của F03-S3 §3.5. Không gửi là lấy tất cả. `EMAIL` được chấp nhận và không trả gì |
| `from`, `to` | Ngày theo giờ Việt Nam, `to` tính hết ngày. Áp lên thời điểm hiển thị (§5.2). **Không** áp cho nhóm Sắp tới và mục ghim |
| `actor` | Id bản ghi NhanVien, nhiều giá trị nối HOẶC. Task: so với người thực hiện. Hoạt động khác: so với nhân viên của người tạo. Sự kiện: so với nhân viên của người thực hiện thay đổi; sự kiện do workflow, hệ thống không khớp giá trị nào |
| `q` | Tìm không phân biệt hoa thường, bỏ dấu. Với hoạt động: tiêu đề và `text_plain`. Với sự kiện: `recordLabel` và các chuỗi trong `payload` (`fieldName`, `from`, `to`, `fromLabel`, `toLabel`, `otherLabel`). Máy chủ không lưu câu hiển thị của sự kiện (F03-S3 §3.4) nên không tìm trên câu đó. Cần extension `unaccent` và index trigram trên `text_plain` |
| `section` | Không gửi (mặc định): trả đủ ba phần ở §5.3. `upcoming`: chỉ trả nhóm Sắp tới trong `data.items`, phân trang bằng `cursor`, thứ tự tăng dần, `meta.total` là tổng số việc sắp tới (dùng cho "Xem tất cả việc sắp tới", CRM-05 §5.4, và card Việc sắp tới, CRM-02 §5.3) |
| `happened` | `true`: chỉ trả hoạt động **đã xảy ra** theo đúng các trường hợp của F03-S2 §6.1 (ghi chú; cuộc gọi, cuộc họp có giờ đã qua, trừ cuộc họp Huỷ, Đổi lịch, Không đến; task đã xong), không có sự kiện, không có phần ghim và Sắp tới. Dùng cho card Tương tác gần đây và câu "Tương tác gần nhất" (CRM-02 §5.3) |
| `limit`, `cursor` | Phân trang phần "đã qua" (§5.3), hoặc nhóm Sắp tới khi `section=upcoming`. `limit` 1–100, mặc định 30 |

Tham số sai (ngày sai định dạng, `from` sau `to`, `kinds` lạ, `limit` ngoài khoảng): `400 TIMELINE_QUERY_INVALID`.

### 5.2 Thời điểm hiển thị

| Mục | Thời điểm hiển thị |
|---|---|
| Ghi chú | `occurred_at` (lúc tạo) |
| Cuộc gọi | `occurred_at` (người dùng nhập) |
| Cuộc họp | `occurred_at` (giờ bắt đầu) |
| Task đã xong | `completed_at` |
| Task chưa xong | `due_at` (chỉ dùng trong nhóm Sắp tới) |
| Sự kiện F03-S3 | `occurredAt` của sự kiện |

### 5.3 Cấu trúc phản hồi

```json
{
  "status": "success",
  "data": {
    "pinned": { "...mục timeline..." },
    "upcoming": { "items": [ "...mục timeline..." ], "total": 3, "nextCursor": null },
    "items": [ "...mục timeline, mới nhất trước..." ]
  },
  "meta": { "pageSize": 30, "nextCursor": "…" }
}
```

- `pinned`: hoạt động đang ghim trên bản ghi này, hoặc `null`. Chỉ có ở trang đầu (không có `cursor`). Có áp `tab`, `kinds`, `actor`, `q`: mục ghim không khớp bộ lọc thì trả `null`.
- `upcoming`: chỉ ở trang đầu. Còn thì có `upcoming.nextCursor`; lấy tiếp bằng `section=upcoming&cursor=<nextCursor>`. Gồm task chưa xong (kể cả quá hạn) và cuộc họp có giờ bắt đầu sau hiện tại với kết quả "Đã lên lịch" hoặc trống. Sắp theo thời điểm hiển thị **tăng dần** (việc gần nhất lên trước, task quá hạn đứng đầu). Tối đa 20 mục, `total` là tổng số. Có áp `tab`, `kinds`, `actor`, `q`.
- `items`: mọi mục còn lại, **mới nhất trước**, phân trang bằng `cursor`. Mục đã ở `pinned` hoặc `upcoming` không lặp lại ở đây.
- FE tự nhóm `items` theo tháng ("Tháng 9 năm 2026") dựa trên thời điểm hiển thị. Máy chủ không cắt trang theo tháng; một trang có thể chứa nhiều tháng hoặc nửa tháng. Plan §2.1 ghi "phân trang theo tháng"; spec đổi sang con trỏ vì một tháng của bản ghi nhiều hoạt động có thể dài hàng trăm mục.

Một mục timeline là hoạt động:

```json
{
  "entry": "activity",
  "id": "act_4821",
  "type": "CALL",
  "title": "Cuộc gọi với Nguyễn Thị Hạnh",
  "bodyHtml": "<p>Chị Hạnh cần báo giá gói <b>PROFESSIONAL</b> trước 05/10.</p>",
  "displayAt": "2026-09-30T02:15:00Z",
  "createdBy": { "userId": "usr_01", "employeeId": "emp_07", "label": "Minh Trần" },
  "fields": { "call_direction": "Gọi đi", "call_outcome": "Đã kết nối" },
  "people": [ { "recordId": "rec_ct01", "label": "Nguyễn Thị Hạnh", "role": "Đã liên hệ" } ],
  "links": { "count": 3, "items": [ { "collection": "crm_companies", "recordId": "rec_co13", "label": "Dược phẩm Thiên Phúc" } ] },
  "isPinned": false,
  "commentCount": 0,
  "can": { "edit": true, "delete": true, "complete": false, "pin": true }
}
```

- `fields` chỉ chứa trường của đúng loại hoạt động (Task: hạn, loại task, ưu tiên, hàng đợi, người thực hiện, nhắc nhở, lặp lại, đã xong; Cuộc họp: thời lượng, kết quả; Cuộc gọi: hướng, kết quả).
- `people`: contact có `role` Đã liên hệ hoặc Tham dự.
- `links.items`: tối đa 10 bản ghi, **bỏ bản ghi đang mở**. Bản ghi người gọi không đọc được thì không có trong danh sách và không tính vào `count`.
- `can` cho FE biết nút nào hiện. FE không tự suy quyền.

Một mục timeline là sự kiện: đúng định dạng của F03-S3 §5.3, thêm `"entry": "event"` và `displayAt`.

### 5.4 Quyền đọc

- Cần đọc được bản ghi `:id`.
- Hoạt động hiện nếu người gọi đọc được nó: có quyền đọc `crm_activities`, hoặc là người tạo, hoặc là người thực hiện của task đó (tài khoản của nhân viên trong `assignee_id`). Quy tắc "người thực hiện luôn đọc được task của mình" áp cho mọi API đọc hoạt động, không chỉ timeline. Đề xuất cấu hình mặc định: vai trò Sales đọc được mọi hoạt động, vì timeline dùng chung cho cả đội.
- Sự kiện theo quy tắc quyền của F03-S3 §5.3.

### 5.5 Cách lấy dữ liệu

Truy vấn hai nguồn rồi trộn ở máy chủ:

1. Hoạt động: các dòng của bảng nối có cột đích là `:id` (ví dụ `crm_activity_contacts.contact_id = :id`), nối sang `crm_activities`. Index cần có: (cột đích, `deleted_at`) trên từng bảng nối; (`activity_type`, `is_done`, `due_at`) và (`occurred_at`), (`completed_at`) trên `crm_activities`.
2. Sự kiện: `record_event_subject` theo `recordId` (F03-S3 §3.3).

Phân trang theo con trỏ ghép (`displayAt`, `entry`, `id`) để hai nguồn trộn không trùng, không sót khi có mục mới chen vào giữa hai lần tải.

---

## 6. Liên kết với các bảng khác

- **F03-S2** nghe sự kiện "hoạt động được tạo, sửa, xoá, khôi phục, hoàn thành, mở lại, đổi liên kết" để tính lại Ngày hoạt động gần nhất, Liên hệ gần nhất, Hoạt động tiếp theo của các bản ghi liên kết. Spec này phát sự kiện nội bộ `activity.changed` sau khi giao dịch thành công, kèm danh sách bản ghi bị ảnh hưởng (liên kết cũ và mới) và danh sách trường đã đổi (`changedFields`), để F03-S2 bỏ qua những lần sửa không liên quan (ví dụ chỉ sửa nội dung).
- **F03-S3**: `crm_activities` không có `history_config`, nên hoạt động không sinh sự kiện timeline. Dòng `record_change` vẫn được ghi (xem lịch sử khi cần kiểm tra ai sửa ghi chú).
- **Workflow**: tạo, sửa hoạt động qua API bản ghi chung vẫn phát sự kiện F03 như mọi collection, nên workflow trigger được trên `crm_activities` (ví dụ "khi có cuộc gọi kết quả Đã kết nối thì đổi Lead status").

---

## 7. Job nền

### 7.1 Nhắc hạn task (A-07)

- Chạy mỗi phút.
- Chọn task chưa xong, `reminder` khác "Không nhắc", `reminder_sent_at` rỗng, và thời điểm nhắc ≤ hiện tại. Thời điểm nhắc = `due_at` trừ độ lệch của mức nhắc: Vào lúc đến hạn (0) · 30 phút trước · 1 giờ trước · 1 ngày trước.
- Gửi thông báo chuông cho tài khoản của người thực hiện: "Nhắc việc: {tiêu đề task} — hạn {HH:mm dd/mm}", link mở bản ghi đầu tiên của task ở tab Hoạt động. Người thực hiện chưa có tài khoản thì bỏ qua.
- Ghi `reminder_sent_at` trong cùng giao dịch với việc xếp thông báo, để chạy lại không nhắc hai lần.
- Đổi `due_at` hoặc `reminder` của task: máy chủ xoá `reminder_sent_at` để nhắc lại theo mốc mới.
- Thời điểm nhắc đã qua quá 24 giờ lúc job chạy (ví dụ máy chủ tắt cả ngày): không gửi, chỉ ghi `reminder_sent_at`. Nhắc muộn một ngày không còn tác dụng mà gây nhiễu.

### 7.2 Lặp task

- Không chạy theo lịch. Task kỳ tiếp được sinh **khi task hiện tại được đánh dấu xong** (§4.5), trong cùng giao dịch.
- Task kỳ tiếp chép từ task vừa xong: tiêu đề, nội dung, loại task, ưu tiên, hàng đợi, người thực hiện, mức nhắc, `repeat_rule`, mọi liên kết (không chép ghim). `repeat_source_id` trỏ về task vừa xong. `is_done = false`.
- Hạn mới = hạn cũ cộng một chu kỳ, giữ giờ. Nếu **ngày** của hạn mới vẫn trước ngày hôm nay (giờ Việt Nam) thì cộng tiếp cho tới khi ngày hạn từ hôm nay trở đi. Ví dụ task "Gọi chăm sóc" lặp hằng tuần, hạn 01/09/2026 08:00, được đánh dấu xong ngày 30/09/2026 thì kỳ tiếp có hạn 06/10/2026 08:00, không phải 08/09.
- Cộng tháng giữ ngày trong tháng; tháng đích không có ngày đó thì lấy ngày cuối tháng (31/01 + 1 tháng = 28/02 hoặc 29/02).
- Người thực hiện của kỳ tiếp đã "Đã nghỉ" (D-WORKSTATUS) thì vẫn sinh task, giữ người cũ, và gửi thông báo cho người tạo task gốc: "Task lặp {tiêu đề} đang giao cho nhân viên đã nghỉ".
- Muốn dừng lặp: xoá `repeat_rule` trước khi đánh dấu xong.

Lý do không sinh theo lịch: sinh sẵn theo lịch thì task hằng ngày bị bỏ quên sẽ chồng thành hàng chục task quá hạn.

---

## 8. Thông báo

Gửi qua hàm thông báo của F03-S3 (chuông ERP), không gửi cho chính người thực hiện hành động.

| Tình huống | Người nhận | Nội dung |
|---|---|---|
| Tạo Ghi chú, Cuộc gọi, Cuộc họp | Người theo dõi của mọi bản ghi được gắn | "{người tạo} đã thêm {loại} vào {tên bản ghi}" |
| Tạo task giao cho người khác, hoặc đổi người thực hiện | Tài khoản người thực hiện mới | "{người tạo} đã giao task cho bạn: {tiêu đề} — hạn {dd/mm}" |
| Người khác hoàn thành task mình tạo | Người tạo task | "{người thực hiện} đã hoàn thành task {tiêu đề}" |
| Bình luận mới | Người tạo hoạt động, người thực hiện (với task), người đã bình luận trước trên hoạt động đó | "{người viết} đã bình luận về {loại} trên {tên bản ghi}" |
| Nhắc hạn | Người thực hiện | §7.1 |

- Một hoạt động gắn với ba bản ghi mà một người theo dõi cả ba: người đó nhận **một** thông báo, tên bản ghi là bản ghi chủ.
- Hoạt động tạo bằng nhập file hoặc workflow không gửi thông báo "đã thêm"; task do workflow giao vẫn gửi "đã giao task cho bạn".
- Sửa nội dung hoạt động không gửi thông báo.

---

## 9. Hiệu năng

| Thao tác | Mục tiêu (p95) |
|---|---|
| Tạo hoạt động kèm 5 liên kết và task theo dõi | < 300 ms |
| Trang đầu timeline (ghim + sắp tới + 30 mục) của bản ghi có 2.000 hoạt động và 5.000 sự kiện | < 400 ms |
| Trang tiếp theo, 30 mục | < 250 ms |
| Gợi ý liên kết | < 150 ms |
| Job nhắc hạn quét 100.000 task | < 2 giây mỗi lần chạy (dùng index ở §5.5 và index một phần trên task chưa xong có nhắc) |

Ước lượng: đội 20 sale, mỗi người 30 hoạt động mỗi ngày, trung bình 3 liên kết mỗi hoạt động → 600 hoạt động và 1.800 dòng nối mỗi ngày, khoảng 150.000 hoạt động mỗi năm.

---

## 10. Tiêu chí nghiệm thu

Spec này không sở hữu ID trong sheet. Mã AC dùng tiền tố `F03S6` để không trùng với AC của CRM-05; ID tính năng được phục vụ ghi trong ngoặc ở tiêu đề.

**AC-F03S6-1 — Gợi ý liên kết từ Contact (phục vụ A-03)**
Given contact Nguyễn Thị Hạnh có công ty chính Dược phẩm Thiên Phúc, hai deal DEAL-013 (đang mở) và DEAL-004 (5. Closed Won)
When gọi gợi ý liên kết với bản ghi chủ là Hạnh
Then kết quả có Hạnh, Thiên Phúc, DEAL-013; không có DEAL-004.

**AC-F03S6-2 — Máy chủ không tự gắn thêm (phục vụ A-03)**
Given gợi ý có Hạnh, Thiên Phúc, DEAL-013
When tạo ghi chú với `links` chỉ gồm Hạnh
Then ghi chú chỉ có một liên kết; không hiện trên timeline Thiên Phúc và DEAL-013.

**AC-F03S6-3 — Một giao dịch (phục vụ A-03)**
Given `links` có một phần tử trỏ tới deal đã bị xoá
When tạo cuộc gọi
Then trả lỗi kèm `path: "links[i]"`; không có cuộc gọi nào được tạo.

**AC-F03S6-4 — Lọc HTML trên mọi đường ghi (phục vụ A-02)**
Given một job nhập file ghi `body_html` = `<p onclick="x()">Chào <script>alert(1)</script><b>chị</b></p>`
When job chạy xong
Then giá trị lưu là `<p>Chào alert(1)<b>chị</b></p>`.

**AC-F03S6-5 — Task theo dõi (phục vụ A-04)**
Given hôm nay thứ Tư 30/09/2026, đang ở trang Contact Hạnh
When ghi lại cuộc gọi có tick "Tạo task To-do để theo dõi sau 3 ngày làm việc"
Then có thêm task "Theo dõi: cuộc gọi với Nguyễn Thị Hạnh" hạn 05/10/2026 08:00, người thực hiện là nhân viên của người tạo, liên kết giống hệt cuộc gọi.

**AC-F03S6-6 — Nhắc hạn một lần (phục vụ A-07)**
Given task hạn 30/09/2026 10:00, mức nhắc "30 phút trước", người thực hiện Lan Lê có tài khoản
When job chạy lúc 09:30 và lúc 09:31
Then Lan nhận đúng một thông báo "Nhắc việc: …"; `reminder_sent_at` được ghi.

**AC-F03S6-7 — Đổi hạn thì nhắc lại (phục vụ A-07)**
Given task ở AC-A07-1 đã nhắc
When đổi hạn sang 01/10/2026 10:00
Then `reminder_sent_at` được xoá; 09:30 ngày 01/10 Lan nhận nhắc lần nữa.

**AC-F03S6-8 — Lặp task khi hoàn thành (phục vụ A-07)**
Given task lặp hằng tuần hạn 01/09/2026 08:00
When đánh dấu xong ngày 30/09/2026
Then có task mới cùng tiêu đề, cùng liên kết, hạn 06/10/2026 08:00, `repeat_source_id` trỏ về task cũ.

**AC-F03S6-9 — Cuộc họp lên lịch nằm ở Sắp tới (phục vụ A-10)**
Given cuộc họp giờ bắt đầu 02/10/2026 10:00, kết quả "Đã lên lịch", gắn DEAL-013
When mở timeline DEAL-013 ngày 30/09/2026
Then cuộc họp ở `upcoming`; sau 10:00 ngày 02/10 nó chuyển sang `items`.

**AC-F03S6-10 — Lọc theo loại và người (phục vụ A-12)**
Given timeline Hạnh có 3 cuộc gọi của Minh Trần, 2 ghi chú của Lan Lê, 1 sự kiện đổi Lifecycle stage
When gọi timeline với `kinds=CALL,S_PROP&actor=<Minh Trần>`
Then trả 3 cuộc gọi; sự kiện đổi Lifecycle chỉ có nếu do Minh Trần thực hiện.

**AC-F03S6-11 — Ghim một hoạt động mỗi bản ghi (phục vụ A-13)**
Given ghi chú N1 đang ghim trên DEAL-013
When ghim ghi chú N2 trên DEAL-013
Then N2 là mục ghim của DEAL-013; N1 về vị trí theo thời gian. Mục ghim trên Contact Hạnh (cũng gắn N1) không bị ảnh hưởng.

**AC-F03S6-12 — Xoá là xoá khỏi mọi bản ghi (phục vụ A-13)**
Given cuộc gọi gắn Hạnh, Thiên Phúc, DEAL-013
When xoá cuộc gọi từ trang Hạnh
Then cuộc gọi biến khỏi cả ba timeline; khôi phục trong 30 ngày thì hiện lại ở cả ba.

**AC-F03S6-13 — Người thực hiện hoàn thành task của người khác (phục vụ A-14)**
Given Minh Trần tạo task giao cho Lan Lê; Lan không có quyền sửa `crm_activities`
When Lan bấm hoàn thành
Then task xong, `completed_at` được ghi; Minh nhận thông báo "Lan Lê đã hoàn thành task …"; Lan vẫn không sửa được tiêu đề.

**AC-F03S6-14 — Bình luận (phục vụ A-16)**
Given ghi chú của Minh Trần trên DEAL-013
When Lan Lê viết bình luận "Đã gửi báo giá"
Then bình luận hiện dưới ghi chú; Minh nhận thông báo; xoá ghi chú thì bình luận bị xoá theo.

**AC-F03S6-15 — Task CRM trong Việc của tôi (phục vụ A-06, QĐ-04)**
Given Lan Lê có 2 task CRM chưa xong và 1 task workflow
When mở "Việc của tôi"
Then nhóm "Task CRM" có 2 task, nhóm task workflow có 1 task; tick hoàn thành task CRM ở đây thì trang chi tiết bản ghi cũng thấy task đã xong.

**AC-F03S6-16 — Không lộ bản ghi không có quyền (phục vụ A-13)**
Given cuộc gọi gắn Hạnh, Thiên Phúc và DEAL-099; người xem đọc được Hạnh, Thiên Phúc nhưng không đọc được DEAL-099
When mở timeline Hạnh
Then cuộc gọi hiện với "1 liên kết" (Thiên Phúc; không tính Hạnh vì đang mở và không tính DEAL-099 vì không đọc được), không có tên DEAL-099.

---

## 11. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-F03S6-01 | API | Tạo Ghi chú có `due_at` | 422 ACTIVITY_FIELD_NOT_ALLOWED, `details.field = due_at` |
| TC-F03S6-02 | API | Tạo Task không có `assignee_id`, người gọi gắn nhân viên Minh Trần | Task giao cho Minh Trần |
| TC-F03S6-03 | API | Như trên nhưng người gọi không gắn nhân viên nào | 422 ASSIGNEE_REQUIRED |
| TC-F03S6-04 | API | Tạo hoạt động `links = []` | 422 ACTIVITY_NO_LINK |
| TC-F03S6-05 | API | PATCH đổi `activity_type` | 422 ACTIVITY_TYPE_LOCKED |
| TC-F03S6-06 | API | Tạo Task kèm `followUpTask` | 422 |
| TC-F03S6-07 | API | Tạo cuộc gọi, contact gửi `role` = Đã liên hệ; company gửi `role` | 422 cho phần tử company |
| TC-F03S6-08 | API | `body_html` chỉ có `<p><br></p>` | Lưu `null`; Ghi chú thì 422 vì thiếu nội dung |
| TC-F03S6-09 | API | `body_html` 25.000 ký tự | 422 HTML_TOO_LONG |
| TC-F03S6-10 | API | PATCH `links` bỏ dòng đang ghim | Dòng bị gỡ, bản ghi đó không còn mục ghim |
| TC-F03S6-11 | API | Hai request ghim hai hoạt động khác nhau trên cùng bản ghi đồng thời | Kết thúc với đúng một mục ghim |
| TC-F03S6-12 | API | `complete` hai lần | Lần hai 200, không sinh thêm kỳ lặp |
| TC-F03S6-13 | API | Task lặp hằng tháng hạn 31/01/2027, đánh dấu xong 31/01 | Kỳ tiếp hạn 28/02/2027 |
| TC-F03S6-14 | API | `reopen` task lặp đã sinh kỳ tiếp | Task mở lại; kỳ tiếp còn; phản hồi có `nextTaskId` |
| TC-F03S6-15 | API | Sửa `is_done = true` qua API bản ghi chung | `completed_at` được ghi; kỳ lặp được sinh |
| TC-F03S6-16 | Job | Máy chủ tắt từ 09:00 đến 11:00 hôm sau; task có mốc nhắc 09:30 hôm trước | Không gửi; `reminder_sent_at` được ghi |
| TC-F03S6-17 | Job | Người thực hiện không có tài khoản | Không gửi, không lỗi |
| TC-F03S6-18 | API | Timeline `tab=EMAIL` | 200, mọi phần rỗng |
| TC-F03S6-19 | API | Timeline `from=2026-09-30&to=2026-09-01` | 400 TIMELINE_QUERY_INVALID |
| TC-F03S6-20 | API | Timeline trang 1 rồi tạo hoạt động mới rồi tải trang 2 | Trang 2 không lặp mục của trang 1, không sót mục cũ |
| TC-F03S6-21 | API | Timeline có task quá hạn 25/09 và task hạn 03/10 | `upcoming` theo thứ tự 25/09, 03/10 |
| TC-F03S6-22 | API | Timeline `q=bao gia` (không dấu) với ghi chú "Gửi báo giá" | Tìm thấy |
| TC-F03S6-23 | API | Cuộc họp tương lai kết quả "Huỷ" | Nằm ở `items`, không ở `upcoming` |
| TC-F03S6-24 | Quyền | Người chỉ đọc bản ghi, không phải người tạo, gọi ghim | 403 |
| TC-F03S6-25 | Quyền | Người không phải người viết sửa bình luận | 403 |
| TC-F03S6-26 | API | `my-tasks?due=overdue` lúc 30/09 09:00 | Chỉ task chưa xong có hạn trước 30/09 09:00 |
| TC-F03S6-27 | API | Tạo ghi chú gắn 3 bản ghi mà Lan theo dõi cả ba | Lan nhận 1 thông báo |
| TC-F03S6-28 | API | Tạo, sửa, xoá hoạt động | Mỗi lần phát đúng một `activity.changed` sau khi giao dịch thành công, kèm liên kết cũ và mới |
| TC-F03S6-29 | Hiệu năng | Timeline trang đầu, bản ghi 2.000 hoạt động + 5.000 sự kiện | p95 < 400 ms |
| TC-F03S6-30 | API | Hai lời gọi `complete` đồng thời trên task lặp | Chỉ một kỳ tiếp được sinh |
| TC-F03S6-31 | API | Timeline `section=upcoming` với 45 việc sắp tới, `limit=20` | 3 trang, tăng dần, không trùng |
| TC-F03S6-32 | API | Timeline `happened=true` có cuộc họp tương lai và cuộc họp đã qua kết quả Huỷ | Không trả hai cuộc họp đó |
| TC-F03S6-33 | Quyền | Lan là người thực hiện task, không có quyền đọc `crm_activities` | Thấy task trên timeline và qua `my-tasks` |
| TC-F03S6-34 | API | Bình luận trên Cuộc gọi | 422 ACTIVITY_COMMENTS_NOT_ALLOWED |

---

## 12. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| `autoRefs` chọn bản ghi liên kết ở FE | Máy chủ gợi ý (§4.1); FE gửi danh sách cuối |
| Hoạt động và task theo dõi lưu hai lần `addActivity` riêng | Một request, một giao dịch (§4.2) |
| `cleanHtml` lọc HTML trong trình duyệt | Máy chủ lọc trên mọi đường ghi (§3.2) |
| `activitiesOf` trộn hoạt động và sự kiện trên mảng đã tải, không phân trang | API timeline gộp có phân trang (§5) |
| Ghim lưu `localStorage` theo trình duyệt | Cờ `is_pinned` trên dòng nối, dùng chung cho mọi người (§3.6) |
| "Người tham dự", "Đã liên hệ" là mảng id trong hoạt động | Dòng bảng nối có `role` (§3.4); không có trường mảng |
| Nhắc nhở và Lặp lại chỉ lưu giá trị, không làm gì | Job nhắc (§7.1), sinh kỳ tiếp khi hoàn thành (§7.2) |
| Ai cũng tick hoàn thành được mọi task | Người thực hiện hoặc người có quyền sửa (§4.5) |
| Xoá hoạt động là xoá hẳn, hộp thoại ghi "Không thể hoàn tác" | Xoá mềm, khôi phục được 30 ngày (§4.4) |
| Người thực hiện là tên người dùng | Liên kết tới NhanVien (CRM-00 §5.10) |
| Không có bình luận | Collection bình luận (§3.5, §4.7) |

---

## 13. Giả định và câu hỏi

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | QĐ-04: task CRM có hiện trong "Việc của tôi" không? Spec viết theo đề xuất mặc định: có, đọc chung qua API §4.8 | PO / khách | §4.8 |
| Q2 | "Ngày làm việc" có trừ ngày nghỉ lễ Việt Nam không? Nếu có, cần danh mục ngày nghỉ do admin nhập | Khách | Mốc "Sau n ngày làm việc" (CRM-05) |
| Q3 | Có cần đính kèm tệp vào hoạt động không? Nếu có, thêm trường Tệp đính kèm vào `crm_activities` (F02) | Khách | §1.2 |
| Q4 | Vai trò Sales có được đọc mọi hoạt động không, hay chỉ hoạt động gắn với bản ghi mình đọc được? Spec đề xuất đọc mọi hoạt động | Khách | §5.4 |
| Q5 | Chuông thông báo của F11 đã có API để module khác gửi thông báo chưa, hay cần bổ sung? | BE | §7.1, §8 |
| Q6 | QĐ-10: làm bình luận (A-16) ngay hay để đợt sau? Spec viết sẵn §3.5, §4.7 | PO | §3.5, §4.7 |

---

## Liên kết

- Mô hình dữ liệu CRM: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-00-mo-hinh-du-lieu-chuyen-doi.md` §5.10, §5.11
- Giao diện: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-05-activities.md`
- Liên kết bản ghi: `F03-S1-lien-ket-ban-ghi.md`
- Nhật ký và sự kiện: `F03-S3-nhat-ky-thay-doi-su-kien.md`
- Trường tính: `F03-S2-truong-tinh-rollup.md`
- Tầng dữ liệu gốc: `F03-collections-data-layer.md`

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-09-30 | v1.0 — bản đầu | TTS (qua Claude) |
| 2026-10-01 | v1.1 — dòng Phục vụ ghi đúng mã tính năng Sales của CRM-08 (S-07, S-08, S-13, S-15, S-16); §1.2 đổi "quy tắc tự gắn" thành "quy tắc gợi ý gắn" cho khớp §4.1 | TTS (qua Claude) |

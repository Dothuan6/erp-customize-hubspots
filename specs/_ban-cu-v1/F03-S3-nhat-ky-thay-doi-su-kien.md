# F03-S3 — Nhật ký thay đổi, sự kiện trên timeline và người theo dõi

> **Trạng thái:** 💡 Proposed · v1.1 · 01/10/2026 · chờ review
> **Loại:** spec nền (tầng A), mở rộng `F03-collections-data-layer.md`
> **Tính năng sở hữu:** G-05
> **Phục vụ:** C-09, C-17, D-08, D-12, A-12, S-18 (và mọi timeline, mọi mục "Xem lịch sử" trên trang chi tiết)
> **Phụ thuộc:** `F03-S1` (sự kiện liên kết, mã `associationId`)
> **Được dùng bởi:** `F03-S6` (timeline gộp hoạt động và sự kiện), `CRM-01` §5.3, `CRM-02`, `CRM-04`, `CRM-05`, `CRM-08`
> **Nguồn:** F03 §Record CRUD Flow (audit before/after), §AC-13 · F01 `AuditEvent` · prototype `crm-objects.js` (`logEvent`, `KIND_GROUPS`, `activitiesOf`) · `DOI-CHIEU-CHUC-NANG.md` §11, §13, §14

---

## 0. Tóm tắt

Spec này làm ba việc cho mọi collection:

1. **Lịch sử thay đổi của bản ghi.** Ghi lại từng lần một trường đổi giá trị hoặc một liên kết được thêm, gỡ: giá trị cũ, giá trị mới, ai đổi, đổi bằng cách nào, lúc nào. Người dùng xem được lịch sử của một trường ("Xem lịch sử thuộc tính") và lịch sử liên kết.
2. **Sự kiện hệ thống trên timeline.** Một số thay đổi quan trọng (tạo bản ghi, đổi giai đoạn Deal, đổi lifecycle, đổi owner, thêm/gỡ liên kết) được đưa lên timeline dưới dạng sự kiện dễ đọc. Sự kiện có thể **hiện cả trên bản ghi liên kết**: đổi giai đoạn Deal thì Contact và Company của Deal đó cũng thấy.
3. **Người theo dõi.** Người dùng theo dõi một bản ghi để nhận thông báo trong ERP khi có thay đổi quan trọng. Owner được tự thêm vào danh sách theo dõi.

Hoạt động do người tạo (Ghi chú, Task, Cuộc gọi, Cuộc họp) **không** thuộc spec này mà ở `F03-S6`. F03-S6 gộp hoạt động với sự kiện của spec này thành một timeline.

---

## 1. Vấn đề

| Hiện trạng | Hệ quả |
|---|---|
| F03 đã ghi audit `before/after` cho mọi thay đổi vào bảng `audit.audit_events` (F03 AC-13), ghi **bất đồng bộ** sau khi giao dịch xong | Nếu hàng đợi sự kiện lỗi thì mất dòng lịch sử mà không ai biết. Với lịch sử nghiệp vụ (ai chuyển Deal sang Closed Won) như vậy là không chấp nhận được |
| `audit_events` là một bản ghi cho cả lần sửa, không có index theo bản ghi và theo trường | Hỏi "Lead status của contact này đã đổi những lần nào" phải quét và bóc JSON |
| Tab "Lịch sử" trên drawer và trang chi tiết đang "sắp ra mắt" | Không xem được lịch sử trên giao diện |
| Không có khái niệm sự kiện hiện trên timeline, cũng không có cách để sự kiện của Deal hiện trên Contact | D-12, C-09, D-08 không làm được |
| Không có người theo dõi bản ghi | Mục "Theo dõi" (C-17) không có chỗ lưu |

Prototype giả lập cả ba việc ở FE (`logEvent` ghi vào `db.events` trong trình duyệt). Bản thật phải làm ở BE.

### 1.1 Trong phạm vi

- Bảng lịch sử thay đổi, ghi trong cùng giao dịch với thay đổi.
- Cấu hình theo collection: trường nào sinh sự kiện timeline, sự kiện nào lan sang bản ghi liên kết.
- Bảng sự kiện timeline và danh sách bản ghi mà sự kiện hiện trên đó.
- API đọc lịch sử trường, lịch sử liên kết, sự kiện.
- Người theo dõi: lưu, API, quy tắc tự thêm, danh sách tình huống gửi thông báo.
- Tạo sự kiện "Đã tạo" cho bản ghi có sẵn khi triển khai.
- Giao diện tối thiểu ở tầng nền: tab Lịch sử cho collection không thuộc CRM.

### 1.2 Ngoài phạm vi

- Hoạt động do người tạo và timeline gộp: `F03-S6`.
- Khôi phục một trường về giá trị cũ từ lịch sử ("hoàn tác"). Chưa có trong sheet.
- Gửi thông báo qua email, Zalo. Chỉ gửi thông báo trong ERP (chuông).
- Trang Audit log của quản trị (`features/audit/AuditLogPage.tsx`) giữ nguyên, tiếp tục đọc `audit.audit_events`.
- Lịch sử thay đổi cấu trúc collection (thêm, xoá trường). Đã có ở F03 `CollectionSnapshot`.

---

## 2. Khái niệm

| Từ | Nghĩa |
|---|---|
| **Dòng thay đổi** | Một bản ghi trong bảng `record_change`: một trường của một bản ghi đổi từ giá trị A sang B, hoặc một liên kết được thêm, gỡ. Mọi thay đổi trên trường nhập tay đều sinh dòng thay đổi |
| **Sự kiện** | Một bản ghi trong bảng `record_event`: một thay đổi đáng hiện lên timeline, kèm câu chữ dễ đọc. Chỉ thay đổi nằm trong cấu hình (§3.1) mới sinh sự kiện |
| **Chủ thể của sự kiện** | Các bản ghi mà sự kiện hiện trên timeline. Luôn gồm bản ghi bị thay đổi; có thể gồm thêm bản ghi liên kết (lan sự kiện) |
| **Nguồn thay đổi** | Cách thay đổi xảy ra: giao diện, API, workflow, nhập file, thao tác hàng loạt, gộp bản ghi, hệ thống, chuyển dữ liệu |
| **Người theo dõi** | Một tài khoản người dùng đăng ký nhận thông báo về một bản ghi |

Dòng thay đổi dùng để **tra cứu** ("ai đổi gì lúc nào"). Sự kiện dùng để **kể lại** trên timeline. Một lần sửa có thể sinh nhiều dòng thay đổi (sửa 3 trường) nhưng chỉ sinh sự kiện cho những trường được cấu hình.

---

## 3. Dữ liệu

### 3.1 Cấu hình theo collection

Thêm vào metadata collection trường `history_config` (JSON).

- Không khai báo (`null`, mặc định cho mọi collection): vẫn có lịch sử thay đổi đầy đủ (bảng `record_change`) nhưng không sinh sự kiện nào, kể cả "Đã tạo".
- Khai báo rỗng (`{}`): chỉ sinh sự kiện "Đã tạo".
- Khai báo có nội dung: như bảng dưới.

```json
{
  "timelineFields": [
    { "field": "giai_o_n_pipeline", "kind": "stage" },
    { "field": "owner_id",          "kind": "property" }
  ],
  "stageEventTitle": "Hoạt động Deal",
  "associationEvents": ["jn:crm_deal_contacts", "field:company_id"],
  "propagate": [
    { "associationId": "jn:crm_deal_contacts", "kinds": ["created", "stage_changed"] },
    { "associationId": "field:company_id",     "kinds": ["created", "stage_changed"] }
  ]
}
```

| Thuộc tính | Ý nghĩa |
|---|---|
| `timelineFields` | Trường nào đổi giá trị thì sinh sự kiện. `kind: "stage"` sinh sự kiện loại `stage_changed` (câu "X đã chuyển … từ A sang B"). `kind: "property"` sinh `property_changed` ("Lifecycle stage: Lead → Customer"). Tối đa một trường `stage` mỗi collection. Chỉ nhận trường nhập tay; trường tính (F03-S2) không sinh sự kiện |
| `stageEventTitle` | Tiêu đề sự kiện `stage_changed` trên timeline. Mặc định "Đổi giai đoạn" |
| `associationEvents` | Danh sách kênh liên kết (mã `associationId` của F03-S1, nhìn từ collection này) mà việc thêm, gỡ liên kết sinh sự kiện `association_added` / `association_removed` **trên timeline của bản ghi thuộc collection này**. Mặc định rỗng. Mỗi đầu của một liên kết đọc cấu hình của chính mình: thêm Hạnh vào DEAL-013 hiện sự kiện trên Deal nếu cấu hình Deals có `jn:crm_deal_contacts`, và hiện trên Hạnh nếu cấu hình Contacts có kênh đó. Kênh `field:<key>` mà `<key>` đã nằm trong `timelineFields` bị bỏ qua, để đổi owner không hiện hai dòng |
| `propagate` | Sự kiện nào của collection này hiện thêm trên bản ghi liên kết qua kênh nào. Kênh dùng mã `associationId` của F03-S1 |

Cấu hình của CRM:

| Collection | `timelineFields` | `associationEvents` | `propagate` |
|---|---|---|---|
| `crm_contacts` | `lifecycle_stage` (property), `lead_status` (property), `owner_id` (property) | `jn:crm_contact_companies`, `jn:crm_deal_contacts` | không |
| `crm_companies` | `lifecycle_stage` (property), `lead_status` (property), `owner_id` (property) | `jn:crm_contact_companies`, `ref:deals_pipeline.company_id` | không |
| `Deals_Pipeline` | `giai_o_n_pipeline` (stage, tiêu đề "Hoạt động Deal"), `owner_id` (property), `t_ng_cash_in_d_ki_n` (property) | `jn:crm_deal_contacts`, `field:company_id` | `created`, `stage_changed` sang `jn:crm_deal_contacts` và `field:company_id` |
| Bảng nối, `crm_line_items`, `crm_deal_adjustments`, `crm_activities` | không | không | không |

Kênh hoạt động (`jn:crm_activity_*`) và line item không có trong `associationEvents`: hoạt động đã tự hiện trên timeline (F03-S6), line item hiện ở card riêng. Bảng nối không có `history_config` nên việc tạo dòng nối không sinh sự kiện "Đã tạo".

Line item không sinh sự kiện riêng. Khi lưu line item làm Amount của Deal thay đổi (L-11), timeline Deal có sự kiện `property_changed` của `t_ng_cash_in_d_ki_n` với nguồn ghi chú "từ line items" (§3.2 `note`).

### 3.2 Bảng `record_change` — dòng thay đổi

```prisma
model RecordChange {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  collectionId    String   @map("collection_id") @db.Uuid
  recordId        String   @map("record_id") @db.Uuid
  changeType      String   @map("change_type") @db.VarChar(20)   // 'created' | 'field' | 'association_added' | 'association_removed' | 'deleted' | 'restored'
  fieldSlug       String?  @map("field_slug") @db.VarChar(50)    // với 'field'
  associationId   String?  @map("association_id") @db.VarChar(120) // với association_*
  oldValue        Json?    @map("old_value")
  newValue        Json?    @map("new_value")
  oldLabel        String?  @map("old_label") @db.VarChar(300)    // chữ hiển thị lúc ghi, xem ghi chú
  newLabel        String?  @map("new_label") @db.VarChar(300)
  actorUserId     String?  @map("actor_user_id") @db.Uuid        // rỗng khi nguồn là system
  source          String   @db.VarChar(20)                       // 'ui' | 'api' | 'workflow' | 'import' | 'bulk' | 'merge' | 'system' | 'migration', xem ghi chú
  sourceRef       String?  @map("source_ref") @db.VarChar(120)   // id workflow run, id job import/bulk, id bản ghi bị gộp
  batchId         String?  @map("batch_id") @db.Uuid             // cùng một thao tác hàng loạt
  note            String?  @db.VarChar(200)                      // ví dụ "từ line items"
  requestId       String   @map("request_id") @db.Uuid           // cùng một request = cùng một lần sửa
  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz(6)

  @@index([recordId, createdAt(sort: Desc)])
  @@index([recordId, fieldSlug, createdAt(sort: Desc)])
  @@index([batchId])
  @@map("record_change")
  @@schema("data")
}
```

Ghi chú:

- **Ghi trong cùng giao dịch** với thay đổi bản ghi. Thay đổi thành công thì chắc chắn có dòng lịch sử; ghi lịch sử lỗi thì cả thay đổi bị huỷ.
- Một request sửa 3 trường sinh 3 dòng `field` cùng `requestId`. Giao diện gộp theo `requestId` khi cần hiện "một lần sửa".
- Trường tính (F03-S2) **không** ghi dòng thay đổi. Giá trị của chúng tính lại được từ nguồn, ghi thì bảng phình rất nhanh mà không giúp gì.
- **`oldLabel` / `newLabel`** lưu chữ hiển thị tại thời điểm ghi, cho trường Liên kết (tên bản ghi được trỏ tới) và Người dùng (tên tài khoản). Sau này bản ghi được trỏ tới đổi tên hay bị xoá, lịch sử vẫn đọc được. Trường khác để rỗng; giao diện tự định dạng từ `oldValue`/`newValue`.
- Trường Văn bản dài: chỉ lưu 2.000 ký tự đầu của mỗi giá trị, đánh dấu `truncated: true` trong JSON. Lịch sử là để biết có thay đổi, không để lưu bản sao mọi phiên bản.
- `created`: một dòng khi tạo bản ghi, `newValue` là toàn bộ giá trị nhập lúc tạo. Không sinh thêm dòng `field` cho từng trường lúc tạo.
- `deleted` / `restored`: một dòng khi xoá mềm và khi khôi phục, `note` ghi "xoá theo {tên bản ghi}" nếu là xoá theo (F03-S1 §3.4).
- **`source`**: `ui` khi request dùng phiên đăng nhập của web app ERP; `api` khi dùng API token (F03 "API Token vs User Session"); `bulk` cho endpoint bulk update, xoá hàng loạt; `import` cho job nhập file; `workflow`, `merge`, `system`, `migration` do chính tiến trình đó đặt. FE không tự khai báo nguồn.
- `audit.audit_events` của F03 **vẫn ghi như cũ** cho trang Audit log của quản trị. Hai bảng phục vụ hai mục đích khác nhau; không bỏ bảng nào.

### 3.3 Bảng `record_event` và `record_event_subject` — sự kiện

```prisma
model RecordEvent {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  kind            String   @db.VarChar(30)                       // 'created' | 'stage_changed' | 'property_changed' | 'association_added' | 'association_removed' | 'merged'
  collectionId    String   @map("collection_id") @db.Uuid        // collection của bản ghi bị thay đổi
  recordId        String   @map("record_id") @db.Uuid
  recordLabel     String   @map("record_label") @db.VarChar(300) // tên bản ghi lúc xảy ra, ví dụ "DEAL-013"
  payload         Json                                           // xem §3.4
  actorUserId     String?  @map("actor_user_id") @db.Uuid
  actorLabel      String   @map("actor_label") @db.VarChar(200)  // "Minh Trần", "Workflow Chăm sóc lead", "Nhập dữ liệu", "Hệ thống"
  source          String   @db.VarChar(20)
  changeId        String?  @map("change_id") @db.Uuid            // dòng record_change sinh ra sự kiện
  occurredAt      DateTime @map("occurred_at") @db.Timestamptz(6)

  subjects        RecordEventSubject[]

  @@index([recordId, occurredAt(sort: Desc)])
  @@map("record_event")
  @@schema("data")
}

model RecordEventSubject {
  eventId         String   @map("event_id") @db.Uuid
  collectionId    String   @map("collection_id") @db.Uuid
  recordId        String   @map("record_id") @db.Uuid
  via             String?  @db.VarChar(120)                      // associationId nếu là lan sự kiện; 'merge:<id>' nếu chuyển từ bản ghi đã gộp (F03-S5 §4.3); rỗng nếu là bản ghi bị thay đổi
  occurredAt      DateTime @map("occurred_at") @db.Timestamptz(6) // chép từ event để sắp xếp không cần join

  event           RecordEvent @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@id([eventId, recordId])
  @@index([recordId, occurredAt(sort: Desc)])
  @@map("record_event_subject")
  @@schema("data")
}
```

**Lan sự kiện được tính lúc ghi, không phải lúc đọc.** Khi Deal đổi giai đoạn, BE đọc các Contact và Company **đang liên kết** với Deal tại thời điểm đó rồi ghi mỗi bản ghi một dòng `record_event_subject`. Hệ quả có chủ đích:

- Contact được gắn vào Deal **sau** khi Deal đổi giai đoạn sẽ không thấy các sự kiện cũ của Deal. Đúng với cách đọc timeline: đó là chuyện xảy ra trước khi người này dính vào Deal.
- Contact bị gỡ khỏi Deal **vẫn giữ** các sự kiện đã lan tới trước đó. Lịch sử không tự biến mất.
- Truy vấn timeline chỉ cần đọc `record_event_subject` theo `recordId`, không phải tìm liên kết lúc đọc.

Lan một tầng: sự kiện của Deal lan sang Contact, không lan tiếp từ Contact sang Company của Contact đó.

Với sự kiện `created` khi tạo bản ghi kèm liên kết (F03-S1 §4.7), chủ thể được tính **sau** khi các liên kết trong cùng request đã ghi. Deal tạo từ card Deals của một Contact vì vậy hiện "Đã tạo" trên timeline của Contact đó.

`record_event_subject` được ghi trong cùng giao dịch với `record_event`. Nếu Deal có quá 200 bản ghi liên kết qua một kênh lan, chỉ ghi 200 bản ghi đầu và log cảnh báo; trường hợp này không xảy ra với dữ liệu CRM bình thường.

### 3.4 Nội dung `payload` và câu hiển thị

BE lưu dữ liệu có cấu trúc; FE dựng câu tiếng Việt từ mẫu dưới đây. Không lưu câu hoàn chỉnh để sau này đổi cách diễn đạt không phải sửa dữ liệu cũ.

| `kind` | `payload` | Tiêu đề | Câu hiển thị |
|---|---|---|---|
| `created` | `{ "objectLabel": "Deal" }` | Đã tạo | "{Deal} này được tạo bởi {actorLabel}" trên chính bản ghi. Trên bản ghi nhận lan: "{actorLabel} đã tạo Deal {recordLabel}" |
| `stage_changed` | `{ "field": "giai_o_n_pipeline", "from": "3. Demo Scheduled", "to": "4. Proposal Sent" }` | `stageEventTitle` | "{actorLabel} đã chuyển {recordLabel} từ “{from}” sang “{to}”." Nếu `from` rỗng: "… sang “{to}”." |
| `property_changed` | `{ "field": "lifecycle_stage", "fieldName": "Lifecycle stage", "from": "Lead", "to": "Customer", "fromLabel": null, "toLabel": null, "note": null }` | Thay đổi thuộc tính | "{fieldName}: {from hoặc —} → {to hoặc —}". Có `note` thì thêm "({note})". Trường Liên kết dùng `fromLabel`/`toLabel` |
| `association_added` | `{ "associationId": "jn:crm_deal_contacts", "otherCollection": "crm_contacts", "otherRecordId": "…", "otherLabel": "Nguyễn Thị Hạnh", "objectLabel": "Contact", "label": "Người quyết định" }` | Thay đổi liên kết | "Đã liên kết với {objectLabel} {otherLabel}" + " ({label})" nếu có |
| `association_removed` | như trên | Thay đổi liên kết | "Đã gỡ liên kết với {objectLabel} {otherLabel}" |
| `merged` | `{ "secondaryId": "…", "secondaryLabel": "Hạnh Nguyễn", "moved": { "associations": 3, "activities": 14 } }` | Đã gộp bản ghi | "{actorLabel} đã gộp {secondaryLabel} vào bản ghi này" (F03-S5 §4.3). Chỉ trên bản ghi chính, không lan |

Sự kiện liên kết là **một** sự kiện cho mỗi lần thêm/gỡ (F03-S1 §5 phát một sự kiện mang cả hai đầu). Spec này ghi **hai** dòng `record_event`, mỗi đầu một dòng, vì câu hiển thị ở hai phía khác nhau ("Đã liên kết với Contact Hạnh" trên Deal, "Đã liên kết với Deal DEAL-013" trên Hạnh). Mỗi dòng chỉ có chủ thể là bản ghi phía mình; sự kiện liên kết không lan.

Liên kết bị gỡ do xoá theo (một đầu bị xoá mềm) **không** sinh sự kiện liên kết, để timeline không đầy những dòng "Đã gỡ liên kết" mỗi khi xoá một bản ghi. Dòng `record_change` vẫn được ghi.

### 3.5 Nhóm hiển thị trên timeline

Bộ lọc timeline (A-12) chia hoạt động và sự kiện thành ba nhóm. Nhóm "Cập nhật" gồm các loại sự kiện của spec này:

| Mã lọc | Tên trên giao diện | Gồm |
|---|---|---|
| `S_STAGE` | Hoạt động Deal (hoặc theo `stageEventTitle`) | `stage_changed` |
| `S_ASSOC` | Thay đổi liên kết | `association_added`, `association_removed`, `merged` |
| `S_PROP` | Thay đổi thuộc tính | `property_changed` |
| `S_CREATED` | Tạo bản ghi | `created` |

Nhóm "Giao tiếp" và "Hoạt động nhóm" thuộc F03-S6.

### 3.6 Bảng `record_follower` — người theo dõi

```prisma
model RecordFollower {
  collectionId    String   @map("collection_id") @db.Uuid
  recordId        String   @map("record_id") @db.Uuid
  userId          String   @map("user_id") @db.Uuid              // tài khoản
  isManual        Boolean  @default(false) @map("is_manual")   // người dùng tự bấm Theo dõi
  isOwner         Boolean  @default(false) @map("is_owner")    // là owner hiện tại của bản ghi (§6.1)
  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz(6)

  @@id([recordId, userId])
  @@index([userId])
  @@map("record_follower")
  @@schema("data")
}
```

Một người có thể vừa tự theo dõi vừa là owner, nên dùng hai cờ thay vì một cột lý do. Dòng bị xoá khi cả hai cờ cùng `false`. API và giao diện gọi chung là "đang theo dõi", không phân biệt lý do.

---

## 4. Quy tắc ghi

### 4.1 Khi nào ghi dòng thay đổi

| Thao tác | Dòng thay đổi | Sự kiện |
|---|---|---|
| Tạo bản ghi (mọi nguồn trừ nhập file) | 1 dòng `created` | `created` nếu collection có `history_config` (lan theo cấu hình) |
| Tạo bản ghi bằng nhập file | 1 dòng `created`, `source = import`, `sourceRef` = id job | `created` với `actorLabel = "Nhập dữ liệu"`. Không lan, để một file 5.000 dòng không làm tràn timeline của bản ghi liên kết |
| Nguồn `import` hoặc `migration` sửa trường, thêm, gỡ liên kết | Ghi như thường | Không sinh sự kiện (kể cả `property_changed`, `association_*`) và không gửi thông báo. Người theo dõi theo owner vẫn được thêm (§6.1), không kèm thông báo |
| Sửa trường nhập tay, giá trị thật sự khác | 1 dòng `field` mỗi trường | Nếu trường có trong `timelineFields` |
| Sửa trường nhưng giá trị mới bằng giá trị cũ | Không ghi | Không |
| Trường tính được cập nhật | Không ghi | Không |
| Thêm, gỡ liên kết (F03-S1) | 1 dòng `association_*` cho mỗi đầu | Mỗi đầu xét riêng: có sự kiện nếu kênh nằm trong `associationEvents` của collection đầu đó, và không phải do xoá theo. Liên kết ghi trong cùng request tạo bản ghi (F03-S1 §4.7): phía bản ghi mới không có sự kiện liên kết (đã có "Đã tạo"). Phía bản ghi có sẵn có sự kiện liên kết, trừ khi sự kiện "Đã tạo" của bản ghi mới đã lan tới nó qua cùng kênh, để một hành động không hiện hai dòng |
| Sửa nhãn hoặc Primary của liên kết | 1 dòng `field` trên **dòng bảng nối** | Không |
| Xoá mềm, khôi phục | 1 dòng `deleted` / `restored` | Không. Bản ghi đã xoá không còn timeline để xem |
| Thao tác hàng loạt (đổi owner cho 24 bản ghi) | Như sửa từng bản ghi, cùng `batchId`. Endpoint bulk update và xoá hàng loạt sinh một `batchId` cho mỗi lần gọi | Như sửa từng bản ghi. Thông báo xử lý theo §6.3 |
| Gộp bản ghi (F03-S5) | Theo F03-S5; nguồn `merge` | Theo F03-S5 |
| Workflow sửa bản ghi | Như sửa tay, `source = workflow`, `sourceRef` = id lần chạy | Như sửa tay, `actorLabel = "Workflow {tên}"` |

"Giá trị thật sự khác" so sánh sau khi chuẩn hoá theo kiểu trường (F03): `"  an@cty.vn"` và `"an@cty.vn"` là như nhau với trường email đã chuẩn hoá; `null` và `""` là như nhau.

### 4.2 Người thực hiện

- Thao tác từ giao diện hoặc API bằng phiên đăng nhập: tài khoản đó.
- API token: tài khoản gắn với token (F03 "API Token vs User Session").
- Workflow: `actorUserId` là người đã kích hoạt lần chạy (nếu có), `actorLabel` là "Workflow {tên workflow}".
- Hệ thống (ví dụ xoá theo, job dọn dẹp): `actorUserId` rỗng, `actorLabel = "Hệ thống"`.

### 4.3 Trường nhạy cảm

- Trường loại `audit_only` (F03): dòng thay đổi vẫn ghi đủ giá trị. API §5 trả `"***"` thay cho giá trị với người không được xem trường đó, theo đúng quy tắc hiển thị của F03.
- Trường có cờ mã hoá: chỉ ghi "đã thay đổi", không ghi giá trị.

### 4.4 Lưu trữ

Dòng thay đổi, sự kiện, người theo dõi được giữ **cùng thời gian với bản ghi**. Khi bản ghi bị xoá vĩnh viễn:

1. Xoá mọi dòng `record_change` và `record_follower` của bản ghi đó.
2. Xoá mọi dòng `record_event_subject` có `recordId` là bản ghi đó, gồm cả chủ thể của sự kiện do chính nó sinh ra và của sự kiện từ bản ghi khác lan tới.
3. `record_event` nào không còn dòng chủ thể nào thì xoá. Sự kiện đã lan sang bản ghi khác vẫn còn chủ thể nên được giữ: câu vẫn đọc được nhờ `recordLabel`, link tới bản ghi gốc hiện "(Đã xoá)".

---

## 5. API

Định dạng theo F03. Tiền tố `/api/v1/collections/:slug/records/:id`.

### 5.1 Lịch sử một trường

```
GET .../history?field=lead_status&limit=50&cursor=...
```

```json
{
  "status": "success",
  "data": [
    { "changeId": "…", "at": "2026-09-20T03:12:00Z", "from": "Đang xử lý", "to": "Có deal",
      "fromLabel": null, "toLabel": null, "actor": { "userId": "usr_01", "label": "Minh Trần" },
      "source": "ui", "note": null, "batchId": null },
    { "changeId": "…", "at": "2026-09-01T02:00:00Z", "from": null, "to": "Mới",
      "actor": { "userId": "usr_01", "label": "Minh Trần" }, "source": "ui", "isCreation": true }
  ],
  "meta": { "field": "lead_status", "fieldName": "Lead status", "pageSize": 50, "nextCursor": null }
}
```

- Mới nhất trước. Dòng cuối cùng (nếu trong trang) là giá trị lúc tạo, lấy từ dòng `created`, đánh dấu `isCreation: true`.
- `field` bắt buộc. Trường không tồn tại: `404 FIELD_NOT_FOUND`.
- Trường tính: trả danh sách rỗng và `meta.computed: true` để giao diện ghi "Trường tự tính, không có lịch sử".
- Quyền: đọc được bản ghi. Giá trị trường nhạy cảm theo §4.3.

### 5.2 Lịch sử liên kết

```
GET .../history/associations?associationId=jn:crm_deal_contacts&limit=50&cursor=...
```

- `associationId` không bắt buộc; bỏ trống thì trả mọi kênh.
- Mỗi dòng: thời điểm, loại (thêm / gỡ), kênh, bản ghi bên kia (`otherLabel` lúc ghi và `otherRecordId`), nhãn, người thực hiện, nguồn, `note` (ví dụ "xoá theo Contact Nguyễn Thị Hạnh").
- Bản ghi bên kia mà người gọi không đọc được: trả `otherLabel: "(Không có quyền xem)"`, không trả id.

### 5.3 Sự kiện của một bản ghi

```
GET .../events?kinds=stage_changed,property_changed&from=2026-09-01&to=2026-09-30&actorUserId=usr_01&limit=50&cursor=...
```

```json
{
  "status": "success",
  "data": [
    { "eventId": "…", "kind": "stage_changed", "title": "Hoạt động Deal",
      "record": { "collection": "deals_pipeline", "recordId": "rec_r013", "label": "DEAL-013" },
      "via": "jn:crm_deal_contacts",
      "payload": { "field": "giai_o_n_pipeline", "from": "3. Demo Scheduled", "to": "4. Proposal Sent" },
      "actor": { "userId": "usr_01", "label": "Minh Trần" }, "source": "ui",
      "occurredAt": "2026-09-22T07:30:00Z" }
  ],
  "meta": { "pageSize": 50, "nextCursor": "…" }
}
```

- Đọc qua `record_event_subject` của bản ghi, nên gồm cả sự kiện lan tới. `via` khác rỗng nghĩa là sự kiện của bản ghi khác lan tới.
- Mới nhất trước. `from`, `to` là ngày theo giờ Việt Nam, `to` tính hết ngày.
- `kinds` nhận mã `kind` hoặc mã lọc nhóm `S_STAGE`, `S_ASSOC`, `S_PROP`, `S_CREATED` (§3.5).
- Sự kiện mà bản ghi gốc người gọi không đọc được (ví dụ Deal lan sang Contact nhưng người gọi không có quyền đọc Deal): không trả về.
- F03-S6 dùng cùng tham số để dựng timeline gộp.

### 5.4 Người theo dõi

```
GET    .../followers                → danh sách { userId, label, isManual, isOwner, createdAt }
PUT    .../followers/me             → theo dõi: đặt isManual = true. Đã theo dõi thì không đổi gì, trả 200
DELETE .../followers/me             → bỏ theo dõi: xoá dòng của mình, kể cả khi isOwner = true
GET    .../followers/me             → { following: true | false }
```

- Theo dõi cần quyền đọc bản ghi.
- Chỉ tự theo dõi hoặc bỏ theo dõi cho mình. Không có API thêm người khác vào danh sách trong giai đoạn này.

### 5.5 Mã lỗi mới

| HTTP | Code | Khi nào |
|---|---|---|
| 404 | `FIELD_NOT_FOUND` | `field` không có trong collection |
| 400 | `HISTORY_QUERY_INVALID` | Tham số sai (ví dụ `from` sau `to`, `kinds` không hợp lệ) |

---

## 6. Người theo dõi và thông báo

### 6.1 Tự thêm

- Khi `owner_id` (hoặc trường owner khai báo trong cấu hình collection, §6.4) được đặt, và nhân viên đó có `tai_khoan` (CRM-00 §5.6): thêm tài khoản đó vào người theo dõi với `isOwner = true` (đã có dòng thì chỉ bật cờ).
- Khi owner đổi sang người khác: tắt `isOwner` của owner cũ (dòng bị xoá nếu `isManual = false`), bật cho owner mới. Owner cũ đã tự bấm theo dõi thì vẫn theo dõi.
- Owner tự bỏ theo dõi thì dòng bị xoá. Hệ thống chỉ thêm lại khi trường owner đổi giá trị và người đó là owner mới; sửa trường khác, hay lưu lại owner với cùng giá trị, không thêm lại.
- Người tạo bản ghi **không** tự theo dõi, để không nhận thông báo cho mọi bản ghi mình nhập hộ người khác.

### 6.2 Khi nào gửi thông báo

Thông báo gửi qua chuông thông báo đang có của ERP (F11 "Notification bell"), không gửi cho chính người thực hiện thay đổi.

| Tình huống | Người nhận | Nội dung |
|---|---|---|
| Owner được đặt cho bạn | Tài khoản của owner mới | "{actor} đã giao {Contact} {tên} cho bạn" |
| Owner đổi | Người theo dõi (trừ owner mới, đã nhận dòng trên) | "{actor} đã đổi owner của {tên}: {cũ} → {mới}" |
| Giai đoạn đổi (`stage_changed`) | Người theo dõi của bản ghi bị đổi | "{actor} đã chuyển {tên} sang “{to}”" |
| Hoạt động mới do người khác tạo | Người theo dõi của các bản ghi gắn với hoạt động | Do F03-S6 gọi hàm gửi thông báo của spec này |
| Task được giao cho bạn | Người thực hiện task | Do F03-S6 |

Sự kiện lan (ví dụ Deal đổi giai đoạn lan sang Contact) **không** gửi thông báo cho người theo dõi Contact. Họ thấy trên timeline; gửi thông báo cho cả hai phía dễ thành trùng lặp.

Mỗi thông báo có link mở đúng bản ghi.

### 6.3 Gộp thông báo khi thao tác hàng loạt

Thông báo sinh từ một thao tác có `batchId` không gửi ngay mà xếp hàng, chờ cả lô ghi xong (với lô chạy nền theo F03-S5: chờ job kết thúc). Sau đó, người nhận nào có nhiều hơn 5 thông báo của lô thì nhận gộp thành một: "{actor} đã giao 24 contact cho bạn", link mở danh sách Contacts lọc theo `batchId`. Link đó mở danh sách với tham số `?batch=<id>` (giao diện ở CRM-01 §4.1).

API danh sách bản ghi nhận thêm tham số này:

```
GET /api/v1/collections/:slug/records?batch=<batchId>&filter[...]
```

- Trả các bản ghi của collection có ít nhất một dòng `record_change` mang `batch_id` đó. Chỉ số `@@index([batchId])` ở §3.2 phục vụ truy vấn này.
- Nối VÀ với mọi bộ lọc khác, áp quyền đọc như thường. Bản ghi đã xoá không trả về.
- `batchId` không tồn tại hoặc không thuộc collection này: trả danh sách rỗng, không báo lỗi.

### 6.4 Cấu hình owner cho người theo dõi

Thêm vào `history_config`:

```json
{ "ownerField": "owner_id" }
```

Collection không khai báo `ownerField` thì không có tự thêm theo §6.1. Trường khai báo phải là trường Liên kết trỏ tới collection có `identityUserField` (F03-S1 §4.10), hoặc trường Người dùng.

---

## 7. Triển khai trên dữ liệu có sẵn

- Chạy một lần khi bật tính năng: với mỗi bản ghi đang có của collection có `history_config`, tạo một sự kiện `created` với `occurredAt` = ngày tạo bản ghi, `actorUserId` = người tạo, `source = migration`, **không lan**. Không tạo dòng `record_change`; lịch sử trường bắt đầu từ lúc bật.
- Giao diện "Xem lịch sử thuộc tính" với bản ghi cũ ghi rõ ở cuối danh sách: "Lịch sử được ghi từ ngày {ngày bật tính năng}."
- Contact chuyển từ Leads (CRM-00 §7): dòng `created` có `source = migration`, `note = "chuyển từ Leads"`. Sự kiện `created` dùng thời điểm tạo của bản ghi Leads nếu script chuyển có giữ (`lead_created_at`), nếu không dùng thời điểm chạy script.
- Tự thêm người theo dõi theo §6.1 cho mọi bản ghi đang có owner, **không** gửi thông báo "đã giao … cho bạn".

---

## 8. Giao diện ở tầng nền

Giao diện CRM (menu Thao tác, timeline) ở CRM-01 và CRM-05. Tầng nền chỉ có:

1. **Tab "Lịch sử"** trên drawer và trang chi tiết mặc định của ERP (đang "sắp ra mắt") cho collection không thuộc CRM: danh sách dòng thay đổi mới nhất trước, gộp theo `requestId`, mỗi nhóm ghi người thực hiện, thời điểm, nguồn, rồi từng trường "Tên trường: cũ → mới". Có ô chọn trường để xem lịch sử một trường.
2. **Nút "Theo dõi"** trên trang chi tiết mặc định, dùng API §5.4.

---

## 9. Hiệu năng

| Thao tác | Mục tiêu (p95) |
|---|---|
| Ghi thêm dòng thay đổi và sự kiện trong một lần sửa | Cộng thêm < 20 ms vào thời gian sửa |
| §5.1 lịch sử một trường, 50 dòng | < 150 ms |
| §5.3 sự kiện của bản ghi, 50 dòng | < 200 ms |
| Thao tác hàng loạt 1.000 bản ghi, mỗi bản ghi 1 trường | Ghi lịch sử theo lô, cộng thêm < 3 giây |

Ước lượng dung lượng: một đội sales 20 người, mỗi người 200 lần sửa mỗi ngày, trung bình 2 trường mỗi lần → khoảng 8.000 dòng thay đổi mỗi ngày, 3 triệu dòng mỗi năm. Postgres xử lý được với index ở §3.2. Khi vượt 20 triệu dòng thì cân nhắc chia bảng theo tháng.

---

## 10. Tiêu chí nghiệm thu

**AC-G05-1 — Lịch sử thuộc tính**
Given contact Hạnh tạo ngày 01/09 với Lead status "Mới"; ngày 10/09 Minh Trần đổi sang "Đang xử lý"; ngày 20/09 Lan Lê đổi sang "Có deal"
When gọi lịch sử trường `lead_status`
Then trả 3 dòng theo thứ tự 20/09, 10/09, 01/09; dòng 01/09 có `isCreation = true`; mỗi dòng có người thực hiện và nguồn.

**AC-G05-2 — Lịch sử liên kết**
Given Hạnh được gắn vào DEAL-007 ngày 05/09 rồi bị gỡ ngày 15/09
When gọi lịch sử liên kết của Hạnh
Then có 2 dòng "gỡ" (15/09) và "thêm" (05/09) với `otherLabel = "DEAL-007"`.

**AC-G05-3 — Lịch sử còn đọc được khi bản ghi kia đổi tên**
Given Hạnh từng có owner "Lan Lê", sau đổi sang Minh Trần; nhân viên Lan Lê sau đó đổi tên thành "Lê Thị Lan"
When xem lịch sử trường `owner_id` của Hạnh
Then dòng cũ vẫn hiện "Lan Lê → Minh Trần" (chữ lúc ghi).

**AC-F03S3-1 — Không mất lịch sử**
Given ghi dòng thay đổi bị lỗi (giả lập lỗi DB ở bước ghi lịch sử)
When sửa Lead status
Then request trả lỗi và Lead status không đổi.

**AC-F03S3-2 — Sửa không đổi giá trị thì không ghi**
Given Lead status đang là "Mới"
When gửi PATCH với Lead status "Mới"
Then không có dòng thay đổi mới, không có sự kiện mới.

**AC-F03S3-3 — Sự kiện đổi giai đoạn lan sang Contact và Company**
Given DEAL-013 có Company Thiên Phúc và 2 Contact
When Minh Trần kéo DEAL-013 từ "3. Demo Scheduled" sang "4. Proposal Sent"
Then có 1 sự kiện `stage_changed` với 4 chủ thể (Deal, Company, 2 Contact); timeline của mỗi bản ghi đều có câu "Minh Trần đã chuyển DEAL-013 từ “3. Demo Scheduled” sang “4. Proposal Sent”."

**AC-F03S3-4 — Gắn sau thì không thấy sự kiện cũ**
Given DEAL-013 đổi giai đoạn ngày 22/09
When ngày 25/09 gắn thêm Contact Bảo vào DEAL-013
Then timeline của Bảo không có sự kiện ngày 22/09, nhưng có sự kiện "Đã liên kết với Deal DEAL-013" ngày 25/09.

**AC-F03S3-5 — Gỡ sau vẫn giữ sự kiện cũ**
Given Hạnh đã thấy sự kiện đổi giai đoạn ngày 22/09 của DEAL-013
When gỡ Hạnh khỏi DEAL-013
Then timeline của Hạnh vẫn có sự kiện ngày 22/09.

**AC-F03S3-6 — Thay đổi thuộc tính theo cấu hình**
Given `timelineFields` của Contacts gồm `lifecycle_stage`, không gồm `city`
When đổi Lifecycle stage từ Lead sang Customer, và đổi Thành phố
Then timeline có đúng một sự kiện "Lifecycle stage: Lead → Customer"; lịch sử thuộc tính vẫn có cả hai trường.

**AC-F03S3-7 — Nhập file không làm tràn timeline**
Given Company Thiên Phúc
When nhập file 500 contact, mỗi contact gắn công ty Thiên Phúc
Then timeline Thiên Phúc không có 500 sự kiện "Đã tạo"; mỗi contact có sự kiện "Đã tạo" với người thực hiện "Nhập dữ liệu".

**AC-F03S3-8 — Tự theo dõi theo owner**
Given nhân viên Lan Lê có tài khoản U
When đặt Lan Lê làm owner của contact Hạnh
Then U có trong danh sách người theo dõi Hạnh với `isOwner = true` và nhận thông báo "… đã giao Contact Nguyễn Thị Hạnh cho bạn".

**AC-F03S3-9 — Đổi owner**
Given Hạnh có owner Lan Lê (theo dõi vì là owner); Minh Trần đang tự theo dõi Hạnh
When Phương Nguyễn đổi owner sang Minh Trần
Then Lan Lê không còn trong danh sách theo dõi; Minh Trần vẫn còn và nhận đúng một thông báo (giao cho bạn), không nhận thêm thông báo "đổi owner".

**AC-F03S3-10 — Không thông báo cho chính mình**
Given Minh Trần theo dõi DEAL-013
When Minh Trần tự đổi giai đoạn DEAL-013
Then Minh Trần không nhận thông báo.

**AC-F03S3-11 — Gộp thông báo hàng loạt**
Given Lan Lê có tài khoản
When quản lý gán Lan Lê làm owner cho 24 contact trong một thao tác
Then Lan Lê nhận đúng 1 thông báo "… đã giao 24 contact cho bạn"; bấm vào mở danh sách đúng 24 contact đó.

**AC-F03S3-12 — Bản ghi cũ có sự kiện "Đã tạo"**
Given DEAL-002 tạo ngày 12/08 trước khi bật tính năng
When bật tính năng và mở timeline DEAL-002
Then có sự kiện "Đã tạo" ngày 12/08; lịch sử thuộc tính ghi "Lịch sử được ghi từ ngày …".

**AC-F03S3-13 — Workflow là người thực hiện**
Given workflow "Chăm sóc lead" đổi Lead status của Hạnh
When xem lịch sử trường
Then dòng đó có nguồn `workflow` và người thực hiện "Workflow Chăm sóc lead".

---

## 11. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-F03S3-01 | API | Sửa 3 trường trong một PATCH | 3 dòng `field` cùng `requestId` |
| TC-F03S3-02 | API | Sửa email `" An@Cty.vn"` khi đang là `an@cty.vn` | Không ghi (giống sau chuẩn hoá) |
| TC-F03S3-03 | API | Sửa trường Văn bản dài 10.000 ký tự | `oldValue`/`newValue` cắt 2.000 ký tự, có `truncated` |
| TC-F03S3-04 | API | Trường tính được cập nhật do hoạt động mới | Không có dòng thay đổi |
| TC-F03S3-05 | API | Đặt `timelineFields` có 2 trường `kind: stage` | 422 |
| TC-F03S3-06 | API | Xoá mềm Deal có 3 line item | 1 dòng `deleted` trên Deal, 3 dòng `deleted` trên line item có `note` "xoá theo DEAL-…"; không có sự kiện |
| TC-F03S3-07 | API | Gỡ liên kết do xoá theo | Có dòng `association_removed`, không có sự kiện |
| TC-F03S3-08 | API | Deal có 250 contact đổi giai đoạn | 201 chủ thể (Deal + 200 contact) và 1 cảnh báo trong log |
| TC-F03S3-09 | API | `/events?kinds=S_STAGE` | Chỉ trả `stage_changed` |
| TC-F03S3-10 | API | `/events` với `from` sau `to` | 400 HISTORY_QUERY_INVALID |
| TC-F03S3-11 | Quyền | Người không đọc được Deals xem timeline Contact có sự kiện lan từ Deal | Không thấy sự kiện đó |
| TC-F03S3-12 | Quyền | Người không xem được trường `audit_only` gọi lịch sử trường đó | Giá trị là `"***"` |
| TC-F03S3-13 | Quyền | Lịch sử liên kết tới bản ghi không có quyền đọc | `otherLabel = "(Không có quyền xem)"`, không có id |
| TC-F03S3-14 | API | `PUT followers/me` hai lần | Lần hai trả 200, vẫn một dòng |
| TC-F03S3-15 | API | Lan (owner) bỏ theo dõi; owner đổi sang Minh rồi đổi lại Lan | Sau lần đổi lại, Lan được thêm lại với `isOwner = true` |
| TC-F03S3-16 | API | Owner là nhân viên chưa có `tai_khoan` | Không thêm người theo dõi, không gửi thông báo, không lỗi |
| TC-F03S3-17 | Job | Chạy tạo sự kiện "Đã tạo" hai lần | Không tạo trùng |
| TC-F03S3-18 | API | Xoá vĩnh viễn Deal đã lan sự kiện sang Contact | Sự kiện còn trên Contact, link Deal hiện "(Đã xoá)" |
| TC-F03S3-19 | Hiệu năng | Thao tác hàng loạt đổi owner 1.000 bản ghi | Thời gian cộng thêm do ghi lịch sử < 3 giây |
| TC-F03S3-20 | UI | Tab Lịch sử của collection không thuộc CRM | Gộp theo lần sửa, có ô chọn trường |
| TC-F03S3-21 | API | Danh sách `?batch=<id>` sau khi đổi owner 24 contact, trong đó 2 contact đã bị xoá sau đó | Trả 22 bản ghi |
| TC-F03S3-22 | API | `?batch=<id>` của một lần thao tác trên Companies, gọi trên Contacts | Danh sách rỗng, HTTP 200 |
| TC-F03S3-23 | API | Đổi owner Contact Hạnh (kênh `field:owner_id` không nằm trong `associationEvents`, `owner_id` nằm trong `timelineFields`) | Đúng một sự kiện `property_changed`, không có sự kiện liên kết |
| TC-F03S3-24 | API | Thêm Contact Hạnh vào Company Thiên Phúc từ card | Một sự kiện trên Hạnh, một sự kiện trên Thiên Phúc |
| TC-F03S3-25 | API | Nhập file 500 contact gắn Thiên Phúc | Thiên Phúc không có sự kiện liên kết nào mới |
| TC-F03S3-26 | API | Tạo Deal kèm Contact Hạnh trong một request | Deal có "Đã tạo", không có "Đã liên kết với Contact Hạnh"; Hạnh chỉ có "… đã tạo Deal …" (lan), không có thêm "Đã liên kết với Deal …" |
| TC-F03S3-27 | API | Minh vừa tự theo dõi vừa được đặt làm owner, sau đó owner đổi sang Lan | Minh vẫn theo dõi (`isManual = true`, `isOwner = false`) |
| TC-F03S3-28 | API | Xoá vĩnh viễn Contact Hạnh đã nhận sự kiện lan từ DEAL-013 | Sự kiện của DEAL-013 còn trên Deal; không còn dòng chủ thể nào của Hạnh |
| TC-F03S3-29 | Script | Chuyển Leads có owner (nguồn `migration`) | Có người theo dõi theo owner; không có thông báo, không có `property_changed` |

---

## 12. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| `logEvent()` ở FE tự ghi sự kiện vào `db.events` trong trình duyệt | BE ghi trong cùng giao dịch với thay đổi |
| Sự kiện lưu câu hoàn chỉnh (`body`) | Lưu dữ liệu có cấu trúc, FE dựng câu |
| Sự kiện "Đã tạo" dựng lại mỗi lần vẽ từ ngày tạo bản ghi | Sự kiện thật, bản ghi cũ được tạo bù một lần (§7) |
| Sự kiện đổi giai đoạn gắn cho các Contact đang liên kết lúc đổi | Giữ đúng hành vi này (§3.3) |
| Loại sự kiện đoán bằng tiêu đề và tìm chữ "liên kết" trong câu (`kindOf`) | Trường `kind` rõ ràng |
| "Xem lịch sử thuộc tính" gắn nhãn "Sắp có" | API §5.1 |
| "Theo dõi" chỉ đổi nhãn nút | Bảng người theo dõi và thông báo |

---

## 13. Giả định và câu hỏi

| # | Giả định / câu hỏi | Hỏi ai | Nếu sai thì |
|---|---|---|---|
| A1 | ERP đang chạy có dịch vụ thông báo trong ERP (chuông) mà BE gọi được để gửi thông báo cho một tài khoản kèm link | BE | Phải làm dịch vụ đó trước §6. Trong lúc chờ, người theo dõi vẫn lưu được nhưng không có thông báo |
| A2 | Mọi thay đổi bản ghi đều đi qua một service chung (`RecordService` theo F03), nên chèn được việc ghi lịch sử vào một chỗ | BE | Nếu còn đường ghi thẳng vào DB (ví dụ job nhập Google Sheet) thì phải liệt kê và sửa từng đường |
| Q1 | Có cần gửi thông báo qua email cho người theo dõi không? | Khách | Nếu có, thêm một mục cài đặt và kênh email |
| Q2 | Có cần lịch sử cho trường tính không (ví dụ biết lúc nào "Ngày hoạt động gần nhất" đổi)? | PO | Spec hiện không ghi |
| Q3 | Giữ lịch sử vô thời hạn hay có hạn (ví dụ 3 năm)? | Khách | §4.4 |

---

## Liên kết

- Lớp dữ liệu gốc: `F03-collections-data-layer.md`
- Liên kết bản ghi: `F03-S1-lien-ket-ban-ghi.md`
- Activities & timeline: `F03-S6-activities-timeline.md` (đợt 3)
- Khung màn CRM: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-01-khung-danh-sach-trang-chi-tiet.md`
- Mô hình dữ liệu CRM: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-00-mo-hinh-du-lieu-chuyen-doi.md`

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-09-30 | v1.0 — bản đầu | TTS (qua Claude) |
| 2026-10-01 | v1.1 — thêm loại sự kiện `merged` cho gộp bản ghi (F03-S5 §4.3), thuộc nhóm `S_ASSOC`; `via` nhận giá trị `merge:<id>` cho sự kiện chuyển từ bản ghi đã gộp | TTS (qua Claude) |

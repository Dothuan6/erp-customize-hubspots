# F03-S2 — Trường tính từ bản ghi liên kết (rollup)

> **Trạng thái:** 💡 Proposed · v1.0 · 30/09/2026 · chờ review
> **Loại:** spec nền (tầng A), mở rộng `F03-collections-data-layer.md` (kiểu trường `rollup`)
> **Tính năng sở hữu:** G-04
> **Phục vụ:** C-04, C-06, C-16, CO-02, CO-03, CO-07, D-02, D-04, D-11 (ba trường ngày) · L-11 (tổng line item → Amount, qua cơ chế handler) · CRM-02 §5.3 (Tóm tắt)
> **Phụ thuộc:** `F03-S1` (mã kênh `associationId`, bảng nối) · `F03-S6` (sự kiện `activity.changed`, định nghĩa thời điểm hiển thị)
> **Được dùng bởi:** `CRM-01` §4.4, §4.5 · `CRM-02` · `CRM-03` · `CRM-04` · `CRM-06` §6
> **Nguồn:** F03 §Field Types (`rollup`, `formula`), §MVP Excluded ("Rollup, Lookup … runtime compute chưa enable") · prototype `crm-objects.js` (`lastContacted`, cột Ngày hoạt động gần nhất tính ở FE) · plan QĐ-05, QĐ-06

---

## 0. Tóm tắt

F03 đã khai báo kiểu trường `rollup` (tổng hợp qua liên kết) nhưng chưa bật phần tính toán. Spec này bật nó, với những gì CRM cần:

1. **Tổng hợp qua mọi loại liên kết** của F03-S1, kể cả bảng nối, với điều kiện được tham chiếu cả trường của dòng nối (ví dụ vai trò của contact trong cuộc gọi).
2. **Giá trị theo trường hợp**: một trường tính lấy mốc khác nhau cho từng loại bản ghi nguồn (task lấy hạn, cuộc họp lấy giờ bắt đầu).
3. **Điều kiện theo thời gian thực** (`$now`) và job tính lại khi giá trị hết hiệu lực, để "cuộc họp sắp tới" không còn là "sắp tới" sau khi đã diễn ra.
4. **Trả kèm bản ghi đạt giá trị** (ví dụ id của hoạt động tiếp theo).
5. **Handler do máy chủ cài sẵn** cho phép tính phức tạp không mô tả được bằng cấu hình (tổng line item có chiết khấu, phí, thuế), chạy đồng bộ trong giao dịch và được phép ghi sang một trường nhập tay (Amount của Deal).

Giá trị được **lưu vào bản ghi**, nên lọc, sắp xếp, xuất file như trường thường. Quyết định này theo đề xuất mặc định của QĐ-06 (làm thật ở máy chủ, không để FE tự ghi).

---

## 1. Vấn đề

| Hiện trạng | Hệ quả |
|---|---|
| F03 khai báo `rollup` nhưng runtime chưa bật | Không có "Ngày hoạt động gần nhất", "Liên hệ gần nhất", "Hoạt động tiếp theo" |
| `rollup` của F03 chỉ đi theo trường Liên kết một chiều (`sourceCollectionId` + `sourceFilter`) | Không đi qua bảng nối được, không lọc được theo vai trò trên dòng nối |
| Điều kiện lọc của F03 không có "thời điểm hiện tại" | "Cuộc họp sắp tới" và "cuộc gọi đã diễn ra" không mô tả được |
| Prototype tính các cột này ở FE mỗi lần vẽ bảng; ghi Amount từ FE khi lưu line item | Không lọc, sắp xếp được ở máy chủ khi có phân trang; hai người lưu cùng lúc thì Amount sai |

### 1.1 Trong phạm vi

- Cấu hình trường tính kiểu tổng hợp (`aggregate`) và kiểu handler.
- Lưu giá trị, đọc, lọc, sắp xếp.
- Tính lại khi nguồn thay đổi, khi hết hiệu lực theo thời gian, đối soát hằng đêm, tính lần đầu khi bật.
- Handler `crm.deal_line_items_total` (khung chạy; công thức ở CRM-06 §6).
- Cấu hình bốn trường ngày của CRM và trường tổng line item.

### 1.2 Ngoài phạm vi

- Giao diện cho admin tự tạo trường tổng hợp. Giai đoạn này trường tính do script CRM-00 tạo. Kiểu `formula`, `lookup` của F03 giữ nguyên như F03 mô tả.
- Trường tính dựa trên trường tính khác qua liên kết (chuỗi nhiều tầng). Chỉ một tầng (§3.4).
- Lịch sử giá trị trường tính (F03-S3 Q2).
- Báo cáo tổng hợp theo nhóm, theo kỳ: `F14-S1`.

---

## 2. Khái niệm

| Từ | Nghĩa |
|---|---|
| **Trường tính** | Trường có giá trị do máy chủ tính, người dùng không sửa. Trong spec này là trường kiểu `rollup` |
| **Bản ghi đích** | Bản ghi chứa trường tính (ví dụ Contact Hạnh) |
| **Bản ghi nguồn** | Các bản ghi liên kết mà trường tính đọc (ví dụ các hoạt động gắn với Hạnh) |
| **Tính lại** | Chạy lại phép tính cho một cặp (bản ghi đích, trường) và ghi kết quả nếu khác |
| **Hạn hiệu lực** | Thời điểm sớm nhất mà giá trị hiện tại có thể sai đi dù không ai sửa gì, vì có điều kiện theo thời gian thực. Ví dụ giờ bắt đầu của cuộc họp sắp tới |

---

## 3. Cấu hình

### 3.1 Khai báo trên trường

Trường kiểu `rollup` có thuộc tính `rollup` (JSON) trong định nghĩa trường của F03. Hai dạng:

```json
{ "kind": "aggregate", "via": "jn:crm_activity_contacts", "fn": "max", "cases": [ ... ], "pickTo": null }
```

```json
{ "kind": "handler", "handler": "crm.deal_line_items_total", "mode": "sync" }
```

Kiểu dữ liệu của trường tính (`resultType`) khai báo như F03: `datetime`, `currency`, `number`, `record_ref`.

### 3.2 Dạng `aggregate`

| Thuộc tính | Ý nghĩa |
|---|---|
| `via` | Mã kênh F03-S1 từ bản ghi đích tới bản ghi nguồn: `field:`, `ref:` hoặc `jn:` |
| `fn` | `max`, `min`, `count`, `sum` |
| `cases` | Danh sách trường hợp, xét lần lượt. Mỗi trường hợp có `when` (điều kiện) và `value` (key trường của bản ghi nguồn cho giá trị). Bản ghi nguồn khớp trường hợp đầu tiên thì dùng `value` của trường hợp đó; không khớp trường hợp nào thì bị bỏ qua. Với `count`, `value` bỏ trống |
| `pickTo` | Tuỳ chọn, chỉ với `max`/`min`. Key một trường tính khác của bản ghi đích, kiểu `record_ref`, nhận id của bản ghi nguồn đạt giá trị. Hai bản ghi cùng giá trị thì lấy bản ghi tạo sau |

**Điều kiện `when`** dùng cú pháp bộ lọc F03 (`{ "field": { "op": value } }`, nối VÀ; `_or` cho HOẶC), thêm:

- `$now`: thời điểm tính. Ví dụ `{ "occurred_at": { "lte": "$now" } }`.
- `link.<key>`: trường của **dòng nối** khi `via` là kênh `jn:`. Ví dụ `{ "link.role": { "in": ["Đã liên hệ", "Tham dự"] } }`.
- `null` trong `in` nghĩa là giá trị trống.

Bản ghi nguồn đã xoá mềm và dòng nối đã xoá mềm không được tính.

**Kết quả rỗng** (không bản ghi nguồn nào khớp): `max`, `min` trả `null`; `count` trả `0`; `sum` trả `0`.

### 3.3 Dạng `handler`

- `handler` là tên một hàm máy chủ đã đăng ký trong code, không phải biểu thức do người dùng nhập. Danh sách handler cố định; tên lạ trả `422 ROLLUP_HANDLER_UNKNOWN` khi lưu cấu hình.
- Mỗi handler khai báo trong code: collection nguồn nó phụ thuộc, trường nó đọc, và các trường của bản ghi đích nó được phép ghi.
- `mode: "sync"`: chạy **trong cùng giao dịch** với thay đổi ở nguồn. Dùng khi người dùng cần thấy kết quả ngay sau khi lưu (tổng line item).
- `mode: "async"`: chạy qua hàng đợi như dạng `aggregate` (§5.2).
- Handler được phép ghi sang **trường nhập tay** nếu có khai báo trong code (`writesManual`). Lần ghi đó đi qua F03-S3 như một lần sửa bình thường: có dòng `record_change` với `source = system` và `note` do handler đặt (ví dụ "từ line items"), có sự kiện timeline nếu trường nằm trong `timelineFields`.

### 3.4 Giới hạn

- Một tầng: `cases.value` và `when` không được tham chiếu trường tính của bản ghi nguồn. Vi phạm trả `422 ROLLUP_NESTED` khi lưu cấu hình.
- Một trường tính kiểu `aggregate` chỉ đi qua một kênh.
- Tối đa 10 trường hợp trong `cases`.

---

## 4. Lưu và đọc

- Giá trị lưu vào `data` của bản ghi đích như trường thường (F03 §Record), nên bộ lọc, sắp xếp, xuất file, API danh sách dùng được không cần gì thêm. Index GIN hiện có của F03 dùng được; với trường hay sắp xếp (ba trường ngày của CRM) nên thêm index biểu thức riêng trên `(collection_id, (data->>'last_activity_at'))`.
- **Chỉ đọc.** Gửi giá trị cho trường tính qua API tạo, sửa trả `422 FIELD_COMPUTED_READ_ONLY`. Nhập file có cột trường tính thì bỏ qua cột đó và ghi cảnh báo trong kết quả nhập.
- Ghi giá trị trường tính:
  - **không** ghi `record_change` (F03-S3 §3.2),
  - **không** đổi `_updatedAt`, `_updatedBy` của bản ghi đích,
  - **không** phát sự kiện `record.updated` của F03, nên không kích hoạt workflow "khi bản ghi được sửa". Nếu cần, workflow đọc trường tính tại thời điểm chạy.
- Trạng thái tính lưu ở bảng hệ thống:

```prisma
model ComputedState {
  collectionId  String    @map("collection_id") @db.Uuid
  recordId      String    @map("record_id") @db.Uuid
  fieldSlug     String    @map("field_slug") @db.VarChar(50)
  computedAt    DateTime  @map("computed_at") @db.Timestamptz(6)
  validUntil    DateTime? @map("valid_until") @db.Timestamptz(6)   // xem §5.3
  @@id([recordId, fieldSlug])
  @@index([validUntil])
  @@map("computed_state")
  @@schema("data")
}
```

- **Quyền**: giá trị tính trên **mọi** bản ghi nguồn, không phụ thuộc người xem đọc được bản ghi nguồn nào. Người đọc được Contact Hạnh thấy "Liên hệ gần nhất 25/09" dù không đọc được cuộc gọi đó. Chấp nhận được vì chỉ lộ một mốc ngày; tính theo từng người xem thì không lưu, không lọc, không sắp xếp được.

---

## 5. Khi nào tính lại

### 5.1 Nguồn thay đổi

Từ cấu hình, máy chủ biết mỗi trường tính phụ thuộc vào đâu. Các thay đổi sau đưa (bản ghi đích, trường) vào hàng đợi tính lại:

| Thay đổi | Bản ghi đích bị ảnh hưởng |
|---|---|
| Bản ghi nguồn được tạo, xoá mềm, khôi phục | Mọi bản ghi đích đang nối với nó qua kênh `via` |
| Bản ghi nguồn đổi một trường có trong `cases` (trong `when` hoặc `value`) | Như trên |
| Dòng nối (kênh `jn:`) được thêm, gỡ, khôi phục, hoặc đổi trường được `link.<key>` tham chiếu | Bản ghi đích ở đầu kia của dòng nối |
| Trường Liên kết (kênh `field:`/`ref:`) đổi giá trị | Bản ghi đích cũ và mới |
| Bản ghi đích được khôi phục | Chính nó |

Với hoạt động, F03-S6 phát `activity.changed` kèm danh sách bản ghi bị ảnh hưởng (liên kết cũ và mới) và `changedFields` (F03-S6 §6). Máy chủ dùng danh sách đó thay vì tự suy ra, và bỏ qua sự kiện khi liên kết không đổi và không trường nào trong `changedFields` có mặt trong `cases` (ví dụ chỉ sửa nội dung ghi chú).

### 5.2 Hàng đợi

- Việc tính lại chạy **sau khi giao dịch thành công**, qua hàng đợi, trừ handler `sync`.
- Gộp trùng: một cặp (bản ghi đích, trường) nằm trong hàng đợi nhiều lần chỉ tính một lần.
- Mục tiêu: 95% cặp được tính xong trong 5 giây sau thay đổi (giống F03 AC-12).
- Tính xong mà giá trị không đổi thì chỉ cập nhật `computed_state.computedAt`, không ghi bản ghi.
- Lỗi khi tính (ví dụ bản ghi đích đã bị xoá hẳn): ghi log, bỏ qua, không thử lại quá 3 lần.

### 5.3 Hết hiệu lực theo thời gian

- Khi tính một trường có `$now` trong điều kiện, máy chủ tính luôn **hạn hiệu lực**: thời điểm sớm nhất trong tương lai mà một bản ghi nguồn sẽ đổi từ khớp sang không khớp một trường hợp, hoặc ngược lại. Trong thực tế đó là giá trị nhỏ nhất trong tương lai của các trường được so với `$now`.
- Ví dụ: Deal có cuộc họp sắp tới lúc 02/10/2026 10:00. `next_activity_at` = 02/10 10:00, hạn hiệu lực = 02/10 10:00. Đến lúc đó, cuộc họp không còn "sắp tới" nên trường phải tính lại.
- Hạn hiệu lực lưu ở `computed_state.validUntil`. Job chạy mỗi phút lấy các cặp có `validUntil ≤ now` và đưa vào hàng đợi.
- Không có mốc tương lai nào thì `validUntil = null`.

### 5.4 Đối soát hằng đêm

- 02:00 mỗi đêm, tính lại toàn bộ trường tính của các collection CRM theo lô 1.000 bản ghi.
- Ghi vào log số cặp có giá trị khác với giá trị đang lưu. Số này khác 0 nghĩa là có đường thay đổi bị sót ở §5.1; đội BE xem log để sửa.
- Dữ liệu CRM ước lượng dưới 200.000 bản ghi đích, chạy trong vài phút. Khi dữ liệu lớn hơn nhiều thì chuyển sang đối soát theo mẫu.

### 5.5 Tính lần đầu

- Khi thêm một trường tính (script CRM-00 hoặc đổi cấu hình), máy chủ đưa mọi bản ghi của collection vào hàng đợi.
- Trong lúc chưa tính xong, giá trị là `null` và `computed_state` chưa có dòng. API danh sách không phân biệt được "chưa tính" với "rỗng"; màn hình hiện "--" như trường rỗng.

---

## 6. Trường tính của CRM

Cấu hình dưới do script CRM-00 ghi. Mã loại hoạt động theo `activity_config.types` (F03-S6 §3.1); điều kiện viết bằng giá trị danh mục hiện tại.

### 6.1 Ngày hoạt động gần nhất — `last_activity_at`

Có trên `crm_contacts`, `crm_companies`, `Deals_Pipeline`. `fn: max`. `via`: `jn:crm_activity_contacts` / `jn:crm_activity_companies` / `jn:crm_activity_deals`.

| # | Khi | Lấy |
|---|---|---|
| 1 | Ghi chú | `occurred_at` |
| 2 | Cuộc gọi và `occurred_at ≤ $now` | `occurred_at` |
| 3 | Cuộc họp và `occurred_at ≤ $now` và kết quả không thuộc {Huỷ, Đổi lịch, Không đến} | `occurred_at` |
| 4 | Task và `is_done = true` | `completed_at` |

Task chưa xong, cuộc gọi, cuộc họp ghi cho tương lai không tính.

### 6.2 Liên hệ gần nhất — `last_contacted_at`

Có trên ba đối tượng như trên. `fn: max`. Chỉ trường hợp 2 và 3 của §6.1. Riêng `crm_contacts` thêm điều kiện `link.role ∈ {Đã liên hệ, Tham dự}` ở cả hai trường hợp: contact chỉ "Liên quan" tới cuộc gọi (không phải người nghe máy) thì không tính là đã liên hệ.

### 6.3 Hoạt động tiếp theo — `next_activity_at`, `next_activity_id`

Chỉ trên `Deals_Pipeline`. `fn: min`, `pickTo: "next_activity_id"`.

| # | Khi | Lấy |
|---|---|---|
| 1 | Task và `is_done = false` | `due_at` |
| 2 | Cuộc họp và `occurred_at > $now` và kết quả thuộc {Đã lên lịch, trống} | `occurred_at` |

Task quá hạn vẫn khớp trường hợp 1 nên thường là hoạt động tiếp theo cho tới khi được hoàn thành. Đây là chủ ý: việc trễ cần được thấy trước.

### 6.4 Tổng line item — `line_items_total` và Amount

Trên `Deals_Pipeline`, thêm trường tính mới `line_items_total` (Tổng line item, Tiền tệ). CRM-00 §5.4.2 bổ sung.

```json
{ "kind": "handler", "handler": "crm.deal_line_items_total", "mode": "sync" }
```

- Phụ thuộc: `crm_line_items` và `crm_deal_adjustments` có `deal_id` là deal đó, và trường `use_line_items_amount` của deal.
- Công thức tổng (chiết khấu từng dòng, định kỳ nhân số kỳ, chiết khấu, phí, thuế cấp Deal): CRM-06 §6.
- Ghi `line_items_total` = tổng; deal không có line item nào thì `null`.
- Được phép ghi trường nhập tay `t_ng_cash_in_d_ki_n` (Amount): khi `use_line_items_amount = true` và deal có ít nhất một line item, ghi Amount = tổng nếu khác giá trị hiện tại, `note = "từ line items"`. Không có line item thì không đụng tới Amount (Amount nhập tay lúc tạo deal được giữ, CRM-04 §5.4).
- Bật `use_line_items_amount` từ `false` sang `true` cũng chạy handler.
- **Khoá Amount ở máy chủ.** Khi `use_line_items_amount = true` và deal có ít nhất một line item, mọi lần ghi Amount không đến từ handler (API bản ghi, nhập file, workflow, bulk update) bị từ chối `422 AMOUNT_LOCKED` với câu "Amount đang tính từ line items. Tắt “Dùng tổng line item làm Amount” để nhập tay." Workflow gặp lỗi này thì bước đó báo lỗi như mọi lỗi ghi khác. Vì Deals_Pipeline đang có workflow chạy, trước khi bật khoá phải rà workflow nào ghi `t_ng_cash_in_d_ki_n` (thêm vào bảng rà ở CRM-00 §9). Khoá ở giao diện (CRM-04 §6.1) chỉ là phần hiển thị của quy tắc này.
- Đối soát hằng đêm (§5.4) chạy cả handler này: `line_items_total` và Amount lệch với line item hiện có thì được sửa lại và ghi vào log.

### 6.5 Tóm tắt

| Collection | Trường | Dạng | Có `$now` |
|---|---|---|---|
| `crm_contacts` | `last_activity_at`, `last_contacted_at` | aggregate | Có |
| `crm_companies` | `last_activity_at`, `last_contacted_at` | aggregate | Có |
| `Deals_Pipeline` | `last_activity_at`, `last_contacted_at` | aggregate | Có |
| `Deals_Pipeline` | `next_activity_at` (+ `next_activity_id`) | aggregate | Có |
| `Deals_Pipeline` | `line_items_total` (+ ghi Amount) | handler sync | Không |

---

## 7. API

Không có API mới cho người dùng thường; trường tính đọc qua API bản ghi của F03.

Cho quản trị và vận hành:

```
POST /api/v1/collections/:slug/fields/:field/recompute        → đưa mọi bản ghi vào hàng đợi, trả { queued: 1234 }
POST /api/v1/collections/:slug/records/:id/recompute          → tính lại mọi trường tính của một bản ghi, đồng bộ, trả giá trị mới
GET  /api/v1/collections/:slug/fields/:field/compute-status   → { pending: 12, lastReconcileAt, lastReconcileMismatch: 0 }
```

Quyền: `collection.update_schema` trên collection.

### 7.1 Mã lỗi mới

| HTTP | Code | Khi nào |
|---|---|---|
| 422 | `FIELD_COMPUTED_READ_ONLY` | Gửi giá trị cho trường tính |
| 422 | `ROLLUP_NESTED` | `cases` tham chiếu trường tính của bản ghi nguồn |
| 422 | `ROLLUP_HANDLER_UNKNOWN` | Tên handler chưa đăng ký |
| 422 | `AMOUNT_LOCKED` | Ghi Amount khi deal đang dùng tổng line item (§6.4) |
| 422 | `ROLLUP_CONFIG_INVALID` | `via` không tồn tại, `fn` lạ, `pickTo` không phải `record_ref`, quá 10 trường hợp |

---

## 8. Hiệu năng

| Thao tác | Mục tiêu |
|---|---|
| Từ lúc lưu hoạt động đến lúc ba trường ngày của mọi bản ghi liên kết đúng | p95 < 5 giây |
| Handler tổng line item trong giao dịch lưu 50 line item | Cộng thêm < 50 ms |
| Job hạn hiệu lực mỗi phút | < 1 giây khi có dưới 1.000 cặp đến hạn |
| Đối soát hằng đêm 200.000 bản ghi đích | < 15 phút |
| Lọc, sắp xếp danh sách 50.000 contact theo `last_activity_at` | p95 < 300 ms (có index §4) |

Một phép tính `aggregate` cho một bản ghi đích đọc các hoạt động của bản ghi đó qua index bảng nối (F03-S6 §5.5). Contact có 2.000 hoạt động vẫn dưới 20 ms.

---

## 9. Tiêu chí nghiệm thu

**AC-G04-1 — Ngày hoạt động gần nhất cập nhật sau khi ghi hoạt động**
Given Contact Hạnh có `last_activity_at` = 20/09/2026
When ghi lại một cuộc gọi lúc 30/09/2026 09:15 gắn Hạnh
Then trong 5 giây `last_activity_at` của Hạnh, của Thiên Phúc và của DEAL-013 (nếu cuộc gọi gắn cả hai) là 30/09/2026 09:15.

**AC-G04-2 — Hoạt động tương lai không tính**
Given Hạnh chưa có hoạt động nào
When lên lịch cuộc họp 02/10/2026 10:00 gắn Hạnh
Then `last_activity_at` vẫn rỗng; sau 10:00 ngày 02/10 (job hạn hiệu lực) nó là 02/10/2026 10:00, trừ khi kết quả đã đổi thành Huỷ, Đổi lịch hoặc Không đến.

**AC-G04-3 — Liên hệ gần nhất theo vai trò**
Given cuộc gọi 25/09 có Hạnh ở vai trò Đã liên hệ và Bảo ở vai trò Liên quan
When tính `last_contacted_at`
Then Hạnh là 25/09; Bảo không đổi (cuộc gọi không tính cho Bảo).

**AC-G04-4 — Hoạt động tiếp theo**
Given DEAL-013 có task chưa xong hạn 05/10 08:00 và cuộc họp đã lên lịch 02/10 10:00
When tính `next_activity_at`
Then là 02/10/2026 10:00 và `next_activity_id` là cuộc họp; sau 10:00 ngày 02/10 nó thành 05/10/2026 08:00 và `next_activity_id` là task.

**AC-G04-5 — Hoàn thành task đổi hoạt động tiếp theo**
Given `next_activity_id` của DEAL-013 là task T hạn 01/10
When T được đánh dấu xong
Then `next_activity_*` chuyển sang hoạt động kế tiếp hoặc rỗng; `last_activity_at` thành thời điểm hoàn thành T.

**AC-G04-6 — Xoá hoạt động**
Given cuộc gọi 30/09 là hoạt động mới nhất của Hạnh
When xoá cuộc gọi đó
Then `last_activity_at` về mốc của hoạt động mới nhất còn lại; khôi phục cuộc gọi thì về lại 30/09.

**AC-G04-7 — Lọc và sắp xếp ở máy chủ**
Given 3.000 contact, danh sách phân trang 25 dòng
When sắp xếp theo Ngày hoạt động gần nhất giảm dần
Then trang 1 là 25 contact có mốc mới nhất trên toàn bộ 3.000, không chỉ trong dữ liệu đã tải.

**AC-G04-8 — Chỉ đọc**
Given API sửa Contact
When gửi `last_activity_at`
Then trả `422 FIELD_COMPUTED_READ_ONLY`; không có gì thay đổi.

**AC-F03S2-1 — Tổng line item ghi Amount trong cùng lần lưu (phục vụ L-11)**
Given DEAL-013 `use_line_items_amount = true`, Amount 200.000.000 ₫ nhập tay, chưa có line item
When lưu hai line item có tổng 243.000.000 ₫
Then ngay trong phản hồi lưu, `line_items_total` = 243.000.000 và Amount = 243.000.000; lịch sử Amount có dòng "từ line items"; timeline Deal có sự kiện Thay đổi thuộc tính của Amount.

**AC-F03S2-2 — Tắt dùng tổng (phục vụ L-11)**
Given DEAL-013 đang dùng tổng line item
When đặt `use_line_items_amount = false` rồi sửa một line item
Then `line_items_total` đổi theo; Amount giữ nguyên.

---

## 10. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-F03S2-01 | API | Tạo ghi chú gắn 3 bản ghi | 3 bản ghi × 1 trường vào hàng đợi, mỗi cặp một lần |
| TC-F03S2-02 | API | Sửa `occurred_at` của cuộc gọi từ 30/09 sang 20/09 | `last_activity_at` tính lại |
| TC-F03S2-03 | API | Sửa `body_html` của ghi chú | Không đưa gì vào hàng đợi (trường không nằm trong `cases`) |
| TC-F03S2-04 | API | Đổi `role` của Bảo trong cuộc gọi từ Liên quan sang Đã liên hệ | `last_contacted_at` của Bảo tính lại |
| TC-F03S2-05 | API | Gỡ DEAL-013 khỏi cuộc gọi | `last_activity_at` của DEAL-013 tính lại |
| TC-F03S2-06 | Job | Cuộc họp sắp tới 02/10 10:00 | `validUntil` = 02/10 10:00; job lúc 10:00:30 tính lại |
| TC-F03S2-07 | Job | Đổi giờ cuộc họp sang 03/10 | `validUntil` cập nhật 03/10 |
| TC-F03S2-08 | Job | Đối soát khi có một cặp bị sửa sai giá trị bằng tay trong DB | Giá trị được sửa lại; log ghi mismatch = 1 |
| TC-F03S2-09 | API | Hai task cùng hạn 05/10 08:00 | `next_activity_id` là task tạo sau |
| TC-F03S2-10 | API | Lưu cấu hình `cases.value` trỏ tới `last_activity_at` của nguồn | 422 ROLLUP_NESTED |
| TC-F03S2-11 | API | Lưu cấu hình `handler: "abc"` | 422 ROLLUP_HANDLER_UNKNOWN |
| TC-F03S2-12 | API | Ghi trường tính không làm đổi `_updatedAt` | `_updatedAt` giữ nguyên, không có `record.updated` |
| TC-F03S2-13 | Import | File nhập có cột Ngày hoạt động gần nhất | Cột bị bỏ qua, kết quả nhập có cảnh báo |
| TC-F03S2-14 | API | PATCH Amount qua API bản ghi khi deal có line item và `use_line_items_amount = true` | 422 AMOUNT_LOCKED; Amount giữ nguyên |
| TC-F03S2-15 | API | Xoá line item cuối cùng của deal | `line_items_total` = null; Amount giữ giá trị cuối |
| TC-F03S2-16 | Hiệu năng | 200 hoạt động tạo trong 1 phút | 95% cặp đúng trong 5 giây |
| TC-F03S2-17 | Quyền | Người không đọc được cuộc gọi xem Contact | Vẫn thấy Liên hệ gần nhất |
| TC-F03S2-18 | API | Bật trường tính mới trên 10.000 contact | `compute-status.pending` giảm về 0; trong lúc chờ, giá trị là null |

---

## 11. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Ngày hoạt động gần nhất, Liên hệ gần nhất tính ở FE mỗi lần vẽ | Máy chủ tính, lưu vào bản ghi (§4) |
| Hoạt động tiếp theo tính ở FE trên mảng đã tải | Trường tính có hạn hiệu lực (§5.3, §6.3) |
| Liên hệ gần nhất tính mọi cuộc gọi, cuộc họp gắn với contact | Contact chỉ tính khi ở vai trò Đã liên hệ, Tham dự (§6.2) |
| Amount ghi từ FE khi bấm Lưu line items | Handler đồng bộ trong giao dịch (§6.4) |
| Lọc, sắp xếp theo các cột này trên dữ liệu đã tải | Lọc, sắp xếp ở máy chủ |

---

## 12. Giả định và câu hỏi

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | QĐ-05: Amount luôn bằng tổng line item, hay có ô "Dùng tổng line item làm Amount" mặc định bật (L-11)? Spec viết theo L-11 | PO / khách | §6.4 |
| Q2 | QĐ-06: đồng ý làm thật ở máy chủ (không để FE ghi tạm)? | PO | Toàn bộ |
| Q3 | "Liên hệ gần nhất" của contact chỉ tính khi contact là người nghe máy, tham dự. Khác prototype. Đồng ý? | PO | §6.2 |
| Q4 | Hàng đợi dùng hạ tầng nào có sẵn trong ERP (BullMQ, pg-boss)? | BE | §5.2 |

---

## Liên kết

- Tầng dữ liệu gốc: `F03-collections-data-layer.md` §Field Types (`rollup`)
- Liên kết: `F03-S1-lien-ket-ban-ghi.md`
- Hoạt động: `F03-S6-activities-timeline.md` §3.1, §6
- Nhật ký: `F03-S3-nhat-ky-thay-doi-su-kien.md` §3.2
- Line items: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-06-line-items-san-pham.md` §6
- Dữ liệu CRM: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-00-mo-hinh-du-lieu-chuyen-doi.md`

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-09-30 | v1.0 — bản đầu | TTS (qua Claude) |

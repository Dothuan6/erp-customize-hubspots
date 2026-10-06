# F14-S1 — API tổng hợp báo cáo và cấu hình dashboard

> **Trạng thái:** 💡 Proposed · v1.1 · 01/10/2026 · chờ review
> **Loại:** spec nền (tầng A), nhóm F14 (báo cáo, dashboard); dùng tầng dữ liệu `F03-collections-data-layer.md`
> **Tính năng sở hữu:** không sở hữu ID nào trong sheet; là phần BE của R-01, R-02, R-03, R-05, R-06, R-07, R-08, R-09, S-07, S-08, S-09, S-13, S-14, S-16
> **Phục vụ:** `CRM-07` (Báo cáo: R-01 → R-10) · `CRM-08` (Sales: S-07, S-08, S-09, S-13, S-14, S-16)
> **Phụ thuộc:** F03 (bộ lọc, quyền đọc bản ghi) · `F03-S1` (kênh liên kết, `linked_to_me`) · `F03-S3` (lịch sử giai đoạn cho phễu) · `F03-S6` (người thực hiện của hoạt động) · `CRM-00` (trường Deals: `closed_at`, `owner_id`, Amount)
> **Nguồn:** prototype `crm-bao-cao-hubspot.html` (`DATE_P`, `range`, `prevRange`, `monthsIn`, `REPORTS`, `drill`), `crm-sales-hubspot.html` (`saleStats`) · `DOI-CHIEU-CHUC-NANG.md` §16, §17 · `F14-S0-benchmark-lark-base-dashboard.md` · plan §7 (rủi ro báo cáo chậm)

---

## 0. Tóm tắt

Báo cáo CRM và bảng Sales cần những phép tính mà API danh sách không làm được: đếm, cộng theo nhóm, theo tháng, so với kỳ trước, tính phễu giai đoạn, thời gian chốt trung bình, rồi bấm vào một con số để xem đúng các bản ghi tạo nên con số đó. Spec này cung cấp:

1. **Một API truy vấn tổng hợp chung**: nguồn (collection), phép đo, bộ lọc, khoảng thời gian, so sánh kỳ trước, nhóm theo trường hoặc theo mốc thời gian.
2. **Hai báo cáo có tên** không mô tả được bằng truy vấn chung: phễu giai đoạn (dựa trên lịch sử) và bảng chỉ số sale.
3. **Drill-down**: mỗi con số đi kèm một mã để lấy danh sách bản ghi và xuất CSV.
4. **Cấu hình dashboard theo người dùng**: yêu thích, xem gần đây, đổi tên, bố cục, thẻ đã gỡ.
5. **Giới hạn và bộ nhớ đệm** để báo cáo không làm chậm hệ thống.

Phép tính cụ thể của từng thẻ báo cáo nằm ở CRM-07 §9, §10 và CRM-08 §6. Spec này chỉ cung cấp công cụ.

---

## 1. Vấn đề

| Hiện trạng | Hệ quả |
|---|---|
| ERP chưa có module Báo cáo | R-08, R-09 (P0) không làm được |
| API danh sách F03 trả bản ghi theo trang; muốn đếm theo nhóm phải tải hết về trình duyệt | Prototype đang làm đúng như vậy: chạy được với 30 bản ghi mẫu, không chạy được với dữ liệu thật |
| Không có khái niệm "kỳ trước" | Thẻ "so với kỳ trước" mỗi màn tự tính một kiểu |
| Deal không lưu giai đoạn đã đi qua | Phễu "đã tới hoặc vượt qua giai đoạn" chỉ đoán được từ giai đoạn hiện tại |
| Cấu hình dashboard (bố cục, yêu thích) lưu `localStorage` | Đổi máy là mất |

### 1.1 Trong phạm vi

- Truy vấn tổng hợp: `count`, `sum`, `avg`, `avg_days`; nhóm tối đa 2 chiều; mốc thời gian ngày, tuần, tháng, quý.
- 14 mốc khoảng thời gian, khoảng tuỳ chọn, so sánh kỳ trước.
- Báo cáo có tên `stage_funnel` và `sales_scorecard`.
- Drill-down và xuất CSV.
- Danh sách dashboard, cấu hình theo người dùng, xuất dữ liệu cả dashboard.
- Giới hạn, bộ nhớ đệm, quyền.

### 1.2 Ngoài phạm vi

- Trình tạo báo cáo, tạo dashboard tự do cho người dùng (HubSpot "Create dashboard", "Explore reports"). Giai đoạn này chỉ có dashboard hệ thống định nghĩa sẵn.
- Báo cáo Tickets (R-10).
- Gửi báo cáo định kỳ qua email.
- Kho dữ liệu riêng cho phân tích (OLAP, bảng tổng hợp sẵn). Truy vấn chạy thẳng trên dữ liệu F03 với giới hạn ở §7.

---

## 2. Khái niệm

| Từ | Nghĩa |
|---|---|
| **Nguồn** | Collection được tổng hợp, ví dụ `crm_contacts`, `deals_pipeline`, `crm_activities` |
| **Phép đo** | Con số cần tính: đếm bản ghi, tổng một trường, trung bình một trường, trung bình số ngày giữa hai trường ngày |
| **Trường thời gian** | Trường ngày giờ dùng để lọc theo khoảng thời gian và để chia mốc, ví dụ `_createdAt`, `closed_at` |
| **Mốc** | Một khoảng con khi chia theo thời gian: một ngày, một tuần (thứ Hai → Chủ nhật), một tháng, một quý |
| **Kỳ trước** | Khoảng thời gian liền trước khoảng đang xem, quy tắc ở §3.3 |
| **Mã drill** | Chuỗi đã ký, mô tả truy vấn và nhóm của một con số, dùng để lấy lại đúng danh sách bản ghi |

Mọi mốc ngày tính theo giờ Asia/Ho_Chi_Minh, tuần bắt đầu thứ Hai, giống CRM-01 §4.5.

---

## 3. Khoảng thời gian

### 3.1 Mốc có sẵn

Ví dụ tính khi hôm nay là thứ Năm 01/10/2026.

| Mã | Tên | Khoảng | Ví dụ |
|---|---|---|---|
| `today` | Hôm nay | Hôm nay | 01/10 |
| `yesterday` | Hôm qua | Hôm qua | 30/09 |
| `week` | Tuần này | Thứ Hai → Chủ nhật tuần này | 28/09 – 04/10 |
| `lastweek` | Tuần trước | Thứ Hai → Chủ nhật tuần trước | 21/09 – 27/09 |
| `month` | Cả tháng này | Ngày 1 → ngày cuối tháng này | 01/10 – 31/10 |
| `lastmonth` | Tháng trước | Cả tháng trước | 01/09 – 30/09 |
| `quarter` | Cả quý này | Ngày đầu → ngày cuối quý này | 01/10 – 31/12 |
| `lastquarter` | Quý trước | Cả quý trước | 01/07 – 30/09 |
| `year` | Cả năm nay | 01/01 → 31/12 năm nay | 01/01 – 31/12/2026 |
| `lastyear` | Năm trước | Cả năm trước | 01/01 – 31/12/2025 |
| `d7` | 7 ngày qua | 6 ngày trước → hôm nay | 25/09 – 01/10 |
| `d30` | 30 ngày qua | 29 ngày trước → hôm nay | 02/09 – 01/10 |
| `d90` | 90 ngày qua | 89 ngày trước → hôm nay | 04/07 – 01/10 |
| `all` | Mọi thời gian | Không giới hạn | — |
| `custom` | Tuỳ chọn | Từ ngày → đến ngày, gồm cả hai ngày | — |

Khoảng gửi lên máy chủ dạng `[từ 00:00, đến ngày kế tiếp 00:00)`. Mốc lưu ở URL, cấu hình **theo mã**, không theo ngày tính sẵn (giống CRM-01 §4.5).

"Cả tháng này", "Cả quý này", "Cả năm nay" gồm cả những ngày chưa tới. Số liệu là số tới thời điểm xem.

### 3.2 Khoảng tuỳ chọn

- `from` ≤ `to`, cả hai là ngày `YYYY-MM-DD`.
- Tối đa 3 năm (1.096 ngày). Dài hơn thì trả `400 REPORT_RANGE_TOO_LONG`. "Mọi thời gian" không bị giới hạn này nhưng chịu giới hạn mốc ở §4.3.

### 3.3 Kỳ trước

| Mốc đang xem | Kỳ trước |
|---|---|
| `today` | Hôm qua |
| `yesterday` | Hôm kia |
| `week`, `lastweek` | Tuần liền trước của tuần đó |
| `month`, `lastmonth` | Tháng liền trước của tháng đó (01/09 – 30/09 khi đang xem tháng 10) |
| `quarter`, `lastquarter` | Quý liền trước |
| `year`, `lastyear` | Năm liền trước |
| `d7`, `d30`, `d90`, `custom` | Khoảng cùng số ngày, ngay trước ngày bắt đầu (`d7` hôm nay 01/10: 18/09 – 24/09) |
| `all` | Không có kỳ trước |

Với mốc "cả tháng này" (chưa hết tháng), kỳ trước vẫn là cả tháng trước. Cách so này giống HubSpot; giao diện ghi rõ "so với tháng trước" để người xem hiểu (CRM-07 §6).

---

## 4. Truy vấn tổng hợp

### 4.1 Yêu cầu

```
POST /api/v1/reports/query
```

```json
{
  "source": "crm_contacts",
  "measure": { "fn": "count" },
  "where": { "lifecycle_stage": { "in": ["Lead", "Customer"] } },
  "owner": { "field": "owner_id", "in": ["emp_07", "emp_12"] },
  "time": { "field": "_createdAt", "range": { "preset": "month" }, "compare": true },
  "groupBy": [ { "field": "source" } ],
  "fillEmpty": true
}
```

| Thuộc tính | Ý nghĩa |
|---|---|
| `source` | Slug collection. Người gọi phải đọc được collection |
| `measure.fn` | `count` · `sum` (cần `field` kiểu Số, Tiền tệ) · `avg` (như `sum`) · `avg_days` (cần `from`, `to` là hai trường ngày; mỗi bản ghi lấy (`to` − `from`) tính bằng giây chia 86.400, rồi lấy trung bình, làm tròn một chữ số thập phân; bản ghi thiếu một trong hai bị bỏ qua) |
| `where` | Bộ lọc theo cú pháp F03, gồm cả toán tử `linked_to_me` (F03-S1 §4.10) |
| `owner` | Lọc theo người phụ trách. `field` là trường Liên kết tới NhanVien, hoặc `$actor` với nguồn hoạt động (§4.4). `in` rỗng hoặc không gửi `owner` nghĩa là không lọc; phần tử `null` trong `in` là "(Chưa có owner)". Viết riêng để giao diện đổi bộ lọc owner mà không phải sửa `where` |
| `time.field` | Trường thời gian, hoặc `{ "coalesce": ["lead_created_at", "_createdAt"] }` để lấy trường đầu tiên có giá trị (dùng cho contact chuyển từ Leads, CRM-00 §7.3). Bắt buộc khi có `time.range` hoặc nhóm theo mốc |
| `time.range` | `{ "preset": "<mã §3.1>" }` hoặc `{ "from": "…", "to": "…" }` |
| `time.compare` | `true` thì trả thêm tổng của kỳ trước (§3.3). Bỏ qua khi `preset = all` |
| `groupBy` | Tối đa 2 phần tử. Mỗi phần tử là một trong ba dạng: `{ "field": "<key>" }` (Lựa chọn đơn, Liên kết, Người dùng, Hộp kiểm); `{ "field": "<key>", "buckets": [ { "label": "Đang mở", "values": ["1. MQL Qualified", …] }, … ] }` gộp các giá trị lựa chọn thành nhóm có tên (giá trị không thuộc nhóm nào bị bỏ qua); `{ "timeBucket": "day" | "week" | "month" | "quarter" | "auto" }`. Với trường Liên kết và trường ảo `$actor` (§4.4) có thể thêm `"include": [id, …]` để luôn trả dòng cho các bản ghi đó kể cả khi bằng 0 |
| `fillEmpty` | `true` thì trả cả nhóm không có bản ghi: mọi lựa chọn của trường Lựa chọn đơn theo thứ tự danh mục, mọi mốc trong khoảng. Giá trị của nhóm rỗng là `0` với `count`, `sum` và là `null` với `avg`, `avg_days`. Mốc nằm hoàn toàn sau hôm nay luôn có giá trị `null` (biểu đồ không vẽ điểm). Mặc định `true` |

### 4.2 Phản hồi

```json
{
  "status": "success",
  "data": {
    "rows": [
      { "key": { "source": "Website" },  "label": { "source": "Website" },  "value": 18, "drill": "drl_9f…" },
      { "key": { "source": "Giới thiệu" }, "label": { "source": "Giới thiệu" }, "value": 7,  "drill": "drl_a1…" },
      { "key": { "source": null },       "label": { "source": "(Trống)" },  "value": 2,  "drill": "drl_b7…" }
    ],
    "total": { "value": 27, "drill": "drl_00…" },
    "compare": { "value": 21, "range": { "from": "2026-09-01", "to": "2026-09-30" } },
    "range": { "from": "2026-10-01", "to": "2026-10-31", "label": "Cả tháng này" }
  },
  "meta": { "computedAt": "2026-10-01T03:12:40Z", "cached": false }
}
```

- `key` là giá trị thô (id bản ghi với trường Liên kết, chuỗi lựa chọn), `label` là chữ hiển thị (tên nhân viên, "(Trống)").
- Nhóm theo trường Liên kết: nhãn là tên bản ghi đích tại thời điểm truy vấn. Bản ghi đích đã xoá có nhãn "(Đã xoá) {tên}".
- `total` là phép đo trên toàn bộ bản ghi khớp, không phải cộng các dòng (khác nhau với `avg`, `avg_days`).
- `range.to` là ngày cuối cùng, gồm cả ngày đó.
- `meta.computedAt` để giao diện ghi "Số liệu tính lúc 10:12".

### 4.3 Chia mốc thời gian

- Mốc `auto` chọn theo độ dài khoảng: ≤ 31 ngày → ngày; 32–92 ngày → tuần; ≤ 24 tháng → tháng; dài hơn → quý.
- Với `all`, khoảng thực là từ bản ghi sớm nhất khớp bộ lọc tới hôm nay.
- Tối đa 400 mốc. Vượt thì trả `400 REPORT_TOO_MANY_BUCKETS` và giao diện gợi ý thu hẹp khoảng.
- Mốc đầu và mốc cuối bị cắt theo khoảng (khoảng 15/05 – 10/11 chia tháng ra bảy mốc: 15/05–31/05, tháng 6 tới tháng 10, 01/11–10/11). Nhãn mốc tháng là "T9/2026", mốc ngày "15/09", mốc tuần "Tuần 28/09", mốc quý "Q4/2026".

### 4.4 Nguồn hoạt động

Với nguồn là collection hoạt động (có `activity_config`, F03-S6 §3.1), có thêm trường ảo:

| Trường ảo | Nghĩa |
|---|---|
| `$actor` | Nhân viên thực hiện: với Task là `assignee_id`; với loại khác là nhân viên gắn với tài khoản người tạo (`tai_khoan`, CRM-00 §5.6). Giống `actor` của timeline (F03-S6 §5.1) |
| `$type` | Mã loại hoạt động (`NOTE`, `TASK`, `CALL`, `MEETING`) |
| `$happenedAt` | Thời điểm "đã diễn ra", đúng bốn trường hợp của F03-S2 §6.1: Ghi chú lấy `occurred_at`; Cuộc gọi lấy `occurred_at` khi `occurred_at ≤ now`; Cuộc họp lấy `occurred_at` khi `occurred_at ≤ now` và kết quả không thuộc {Huỷ, Đổi lịch, Không đến}; Task đã xong lấy `completed_at`. Mọi trường hợp khác là rỗng (không được tính khi lọc theo khoảng thời gian trên trường này) |

Hoạt động tạo bởi người không gắn nhân viên nào có `$actor` rỗng, nhãn "(Không xác định)".

### 4.5 Quyền

- Chỉ tổng hợp trên bản ghi người gọi đọc được, theo đúng quy tắc của API danh sách F03. Người không có quyền đọc collection nhưng là chủ sở hữu hệ thống của một số bản ghi vẫn truy vấn được, chỉ trên các bản ghi đó.
- Trường `audit_only` (F03) không được dùng trong `measure`, `groupBy`, `where`, `owner` với người không được xem trường đó: trả `400 REPORT_FIELD_INVALID`, để không suy ra giá trị bị che qua phép tổng hợp. Hai người khác quyền có thể thấy hai con số khác nhau cho cùng một thẻ; đây là chủ ý.
- Không trả số lượng bản ghi bị ẩn.
- Nhóm theo trường Liên kết mà người gọi không đọc được bản ghi đích: vẫn đếm (vì đọc được bản ghi nguồn), `key = null`, nhãn "(Không có quyền xem)"; các bản ghi đích như vậy gộp chung một dòng.

### 4.6 Lỗi

| HTTP | Code | Khi nào |
|---|---|---|
| 400 | `REPORT_QUERY_INVALID` | Thiếu thuộc tính bắt buộc, `fn` lạ, `groupBy` quá 2 phần tử |
| 400 | `REPORT_FIELD_INVALID` | Trường không tồn tại, sai kiểu cho phép đo hoặc cho nhóm; `details.field` |
| 400 | `REPORT_RANGE_TOO_LONG` | Khoảng tuỳ chọn quá 3 năm |
| 400 | `REPORT_TOO_MANY_BUCKETS` | Quá 400 mốc |
| 403 | `FORBIDDEN` | Không đọc được collection nguồn và không sở hữu bản ghi nào trong đó |
| 429 | `REPORT_RATE_LIMITED` | Vượt giới hạn ở §7 |
| 504 | `REPORT_TIMEOUT` | Truy vấn chạy quá 10 giây; giao diện hiện lỗi của riêng thẻ đó |

---

## 5. Báo cáo có tên

Hai phép tính không viết được bằng §4. Mỗi báo cáo có tên là một hàm máy chủ với tham số riêng mô tả ở từng mục; `stage_funnel` nhận `owner`, `time`, `where` như §4.

### 5.1 `stage_funnel` — phễu giai đoạn

```
POST /api/v1/reports/named/stage_funnel
{ "source": "deals_pipeline", "stageField": "giai_o_n_pipeline", "stages": ["1. MQL Qualified", "2. Discovery Call", "3. Demo Scheduled", "4. Proposal Sent", "5. Closed Won"],
  "owner": { "field": "owner_id", "in": [] }, "time": { "field": "_createdAt", "range": { "preset": "quarter" } } }
```

- Lấy các deal khớp bộ lọc (thường là deal **tạo** trong khoảng).
- Với mỗi deal, tìm **thứ tự cao nhất trong `stages` mà deal đã từng ở**, dựa trên lịch sử `record_change` của `stageField` (F03-S3 §3.2) cộng giá trị hiện tại. Giai đoạn không nằm trong `stages` (ví dụ "6. Closed Lost") không tính vào thứ tự.
- Mỗi giai đoạn i trả số deal có thứ tự cao nhất ≥ i. Deal đã thua sau khi tới "4. Proposal Sent" được tính ở giai đoạn 1 tới 4.
- Deal có trước khi bật F03-S3 (không có lịch sử): dùng giai đoạn hiện tại; deal hiện ở giai đoạn ngoài `stages` (đã thua) thì chỉ tính ở giai đoạn 1.
- Deal chưa từng ở giai đoạn nào trong `stages` (ví dụ tạo thẳng ở Closed Lost) cũng được tính ở giai đoạn 1, để hai trường hợp trên nhất quán. Phản hồi có `meta.approximated` là số deal tính theo cách này để giao diện ghi chú.
- Phản hồi: `rows: [{ stage, value, drill }]`, cộng `conversion` = giá trị giai đoạn cuối ÷ giá trị giai đoạn đầu (phần trăm, làm tròn số nguyên; giai đoạn đầu bằng 0 thì `null`).

### 5.2 `sales_scorecard` — chỉ số sale

```
POST /api/v1/reports/named/sales_scorecard
{ "employees": ["emp_07", "emp_12"], "period": { "preset": "month" } }
```

Trả một dòng cho mỗi nhân viên được hỏi (`employees` rỗng là mọi nhân viên có `is_sales = true` người gọi xem được, CRM-08 §3.1). Công thức của từng chỉ số ở CRM-08 §6; spec này quy định hình dạng:

```json
{ "employeeId": "emp_07", "label": "Minh Trần",
  "contacts": 42, "companies": 17, "openDeals": 9, "pipeline": 1240000000, "forecast": 412000000,
  "wonAmount": 610000000, "wonCount": 4, "lostCount": 2, "winRate": 67,
  "quota": 500000000, "quotaPct": 122,
  "activities30d": 58, "openTasks": 11, "overdueTasks": 3, "rank": 1,
  "drill": { "openDeals": "drl_…", "won": "drl_…", "overdueTasks": "drl_…" } }
```

- `winRate`, `quotaPct` là `null` khi mẫu số bằng 0.
- `rank` tính trên **mọi** nhân viên `is_sales` đang làm việc mà người gọi xem được, không phụ thuộc `employees` đang hỏi; nhân viên không đang làm việc có `rank = null` (CRM-08 §6).
- `POST /api/v1/reports/named/sales_scorecard/export.csv` cùng tham số trả tệp CSV (S-09). Định dạng, chống chèn công thức, giới hạn và ghi nhật ký theo §6.2. Quyền: cần `record.export` trên `NhanVien` (báo cáo này không có một collection nguồn duy nhất), thiếu thì `403`.

---

## 6. Drill-down và xuất dữ liệu

### 6.1 Lấy danh sách bản ghi

```
GET /api/v1/reports/drill/:token?limit=50&cursor=…&sort=_createdAt:desc
```

- `token` là mã `drill` trong phản hồi §4, §5. Mã đã ký, chứa truy vấn và nhóm, hết hạn sau 2 giờ (`410 DRILL_EXPIRED`; giao diện chạy lại truy vấn để lấy mã mới).
- Trả bản ghi theo định dạng API danh sách F03, kèm `count` là số bản ghi **đếm chính xác** (không dùng tổng ước lượng của API danh sách) và `columns` gợi ý theo nguồn.
- `sort` nhận trường của nguồn; với nguồn hoạt động nhận thêm `$happenedAt` (CRM-08 §7.6 dùng `sort=$happenedAt:desc&limit=6`).

Cột gợi ý:

| Nguồn | Cột |
|---|---|
| Contacts | Họ và tên · Email · Contact owner · Nguồn · Lifecycle stage · Ngày tạo |
| Companies | Tên công ty · Company owner · Ngành · Ngày tạo |
| Deals | Mã Deal · Tên Deal · Giai đoạn · Tổng Cash-In Dự Kiến · Ngày dự kiến chốt · Ngày đóng · Sale phụ trách · Ngày tạo |
| Hoạt động | Loại · Tiêu đề / 80 ký tự đầu nội dung · Người thực hiện · Thời điểm · Bản ghi liên kết đầu tiên |

- Quyền đọc kiểm lại lúc drill, không dựa vào lúc tạo mã.

### 6.2 Xuất CSV

```
GET /api/v1/reports/drill/:token/export.csv
```

- UTF-8 có BOM để Excel đọc đúng tiếng Việt; dấu phân cách `,`; ngày `dd/mm/yyyy`, tiền là số nguyên không có dấu chấm ngăn cách.
- Chống chèn công thức: ô chữ bắt đầu bằng `=`, `+`, `-`, `@`, tab hoặc xuống dòng được thêm dấu `'` ở đầu. Áp cho mọi tệp CSV của spec này.
- Tối đa 50.000 dòng; nhiều hơn thì trả `413 EXPORT_TOO_LARGE`, giao diện gợi ý thu hẹp bộ lọc.
- Cần quyền `record.export` trên collection nguồn (như Export của danh sách, CRM-01 §4.13).
- Ghi `audit.audit_events` (ai xuất, nguồn, số dòng).

### 6.3 Xuất cả dashboard

```
POST /api/v1/dashboards/:id/export   { "filters": { ... bộ lọc đang áp ... } }
```

Trả tệp `.zip`, mỗi thẻ một tệp CSV dữ liệu tổng hợp (các dòng nhóm và tổng, không phải bản ghi chi tiết), tên tệp theo tiêu đề thẻ. Thẻ người gọi không có quyền xem nguồn, hoặc chạy quá 10 giây, thì bỏ qua và ghi lý do vào tệp `ghi-chu.txt`. Các thẻ chạy song song; cả yêu cầu dừng sau 20 giây. Mỗi lần xuất ghi `audit.audit_events`.

---

## 7. Giới hạn và bộ nhớ đệm

- **Bộ nhớ đệm**: kết quả `query` và báo cáo có tên được giữ 60 giây theo (người gọi, nội dung truy vấn đã chuẩn hoá). Tham số `?fresh=1` bỏ qua bộ nhớ đệm (nút làm mới trên giao diện), mỗi người tối đa 1 lần mỗi 10 giây cho mỗi truy vấn đã chuẩn hoá; vượt thì trả kết quả trong bộ nhớ đệm kèm `meta.cached = true` thay vì lỗi.
- **Giới hạn tần suất**: 120 truy vấn mỗi phút mỗi người (truy vấn lấy từ bộ nhớ đệm không tính). Giao diện gom các lần đổi bộ lọc trong 500 ms thành một lần tải (CRM-07 §5.1), nên một dashboard 7 thẻ đổi bộ lọc vài lần mỗi phút vẫn dưới mức này.
- **Thời gian chạy**: dừng truy vấn sau 10 giây (`504`).
- **Dòng trả về**: tối đa 500 dòng nhóm; nhóm theo hai chiều mà vượt thì trả 500 dòng có giá trị lớn nhất kèm `meta.truncated = true`.
- **Index khuyến nghị** cho dữ liệu CRM: (`collection_id`, `created_at`) đã có ở F03; thêm index biểu thức cho `closed_at`, `owner_id` của Deals và `occurred_at`, `completed_at` của hoạt động.

---

## 8. Dashboard

### 8.1 Định nghĩa

Dashboard hệ thống được định nghĩa trong code, không lưu trong cơ sở dữ liệu. Mỗi định nghĩa có `id`, `title`, bộ lọc mặc định, và danh sách thẻ; mỗi thẻ có `id`, tiêu đề, mô tả ⓘ, kích thước mặc định (1, 2 hoặc 3 cột), kiểu biểu đồ, truy vấn (§4) hoặc báo cáo có tên (§5), đường dẫn tới danh sách. Giai đoạn này có hai dashboard: `crm-data-overview` và `pipeline-overview` (CRM-07 §9, §10).

### 8.2 Bảng lưu theo người dùng

```prisma
model DashboardUserState {
  userId       String    @map("user_id") @db.Uuid
  dashboardId  String    @map("dashboard_id") @db.VarChar(80)
  title        String?   @db.VarChar(120)        // tên do người dùng đổi; null = tên mặc định
  layout       Json?                              // [{ "cardId": "newc", "size": 1 }, …] theo thứ tự hiển thị
  removed      Json      @default("[]")           // ["team"]: thẻ đã gỡ
  cardTitles   Json      @default("{}")           // { "src": "Kênh có contact" }
  isFavorite   Boolean   @default(false) @map("is_favorite")
  lastViewedAt DateTime? @map("last_viewed_at") @db.Timestamptz(6)
  @@id([userId, dashboardId])
  @@index([userId, lastViewedAt(sort: Desc)])
  @@map("dashboard_user_state")
  @@schema("identity")
}
```

`layout` null nghĩa là dùng thứ tự và kích thước mặc định. Hai cột `layout`, `removed` là JSON trong bảng hệ thống, không phải trường của collection nghiệp vụ, nên không thuộc quy tắc "không dùng kiểu mảng" của dự án. Thẻ có trong định nghĩa nhưng không có trong `layout` (thẻ mới thêm sau) được nối vào cuối.

### 8.3 API

```
GET    /api/v1/dashboards?tab=all|recent|favorites|mine&q=…
GET    /api/v1/dashboards/:id                  → định nghĩa đã gộp với trạng thái của người gọi
PUT    /api/v1/dashboards/:id/my-state         { "title", "layout", "removed", "cardTitles" }
DELETE /api/v1/dashboards/:id/my-state         → khôi phục bố cục và tên mặc định (giữ yêu thích)
PUT    /api/v1/dashboards/:id/favorite         → isFavorite = true
DELETE /api/v1/dashboards/:id/favorite
POST   /api/v1/dashboards/:id/viewed           → lastViewedAt = now
```

- `tab=recent`: dashboard có `lastViewedAt`, mới nhất trước, tối đa 10. `favorites`: `isFavorite`. `mine`: dashboard do người gọi tạo; giai đoạn này luôn rỗng vì chưa có tạo dashboard (§1.2).
- Danh sách chỉ gồm dashboard người gọi xem được: cần đọc được ít nhất một collection nguồn của dashboard.
- `PUT my-state`: `size` chỉ nhận 1, 2, 3; `cardId` phải có trong định nghĩa; `title` 1–120 ký tự. Sai thì `422 DASHBOARD_STATE_INVALID`.
- Đổi tên, bố cục, gỡ thẻ chỉ ảnh hưởng người đó. Liên kết chia sẻ (CRM-07 §4) mở dashboard với tên và bố cục **của người nhận**, chỉ mang theo bộ lọc qua URL.

---

## 9. Hiệu năng

| Thao tác | Mục tiêu (p95) |
|---|---|
| `query` đếm theo một trường Lựa chọn đơn trên 50.000 contact trong một tháng | < 300 ms |
| `query` theo mốc tháng trong 12 tháng trên 20.000 deal | < 400 ms |
| `stage_funnel` trên 5.000 deal tạo trong quý | < 1 giây |
| `sales_scorecard` cho 30 nhân viên, kỳ năm | < 1,5 giây |
| Mở dashboard 7 thẻ (song song) | Thẻ cuối hiện xong < 2 giây |
| Drill 50 dòng | < 300 ms |

---

## 10. Tiêu chí nghiệm thu

Mã AC dùng tiền tố `F14S1`; ID tính năng được phục vụ ghi trong ngoặc.

**AC-F14S1-1 — Đếm theo nhóm có nhóm rỗng (phục vụ R-08)**
Given tháng 10/2026 có 18 contact nguồn Website, 7 Giới thiệu, 2 không có nguồn, 0 Sự kiện
When truy vấn `count` nguồn `crm_contacts`, `time` `_createdAt` mốc `month`, nhóm theo `source`
Then có dòng cho mọi lựa chọn của D-SOURCE theo thứ tự danh mục (Sự kiện = 0) và dòng "(Trống)" = 2; `total` = 27.

**AC-F14S1-2 — So với kỳ trước (phục vụ R-08, R-09)**
Given hôm nay 01/10/2026, tháng 9 có 21 contact mới
When truy vấn như trên với `compare: true`
Then `compare.value` = 21 và `compare.range` là 01/09 – 30/09.

**AC-F14S1-3 — Chia mốc tự động (phục vụ R-08)**
Given khoảng `d30`
When nhóm theo `timeBucket: auto`
Then có 30 mốc ngày từ 02/09 tới 01/10, mốc không có bản ghi có giá trị 0.

**AC-F14S1-4 — Quyền đọc (phục vụ R-08)**
Given Lan chỉ đọc được contact của mình (24 contact tạo trong tháng), quản lý đọc được tất cả (60)
When cả hai mở cùng truy vấn
Then Lan thấy 24, quản lý thấy 60; không phản hồi nào nói có bản ghi bị ẩn.

**AC-F14S1-5 — Phễu dựa trên lịch sử (phục vụ R-09)**
Given deal A tạo trong quý, đi 1 → 2 → 3 → 4 rồi sang 6. Closed Lost; deal B đang ở 2; deal C đã Closed Won
When gọi `stage_funnel`
Then giai đoạn 1 = 3, 2 = 3, 3 = 2, 4 = 2, 5 = 1; `conversion` = 33.

**AC-F14S1-6 — Thời gian chốt trung bình (phục vụ R-09)**
Given hai deal Closed Won có `closed_at` trong tháng 9: một deal tạo trước 20 ngày, một deal tạo trước 41 ngày
When truy vấn `avg_days` từ `_createdAt` tới `closed_at`, nhóm theo mốc tháng
Then mốc T9/2026 có giá trị 30,5.

**AC-F14S1-7 — Drill khớp con số (phục vụ R-07)**
Given dòng "Website" có giá trị 18
When gọi drill bằng mã của dòng đó
Then trả đúng 18 contact; xuất CSV có 18 dòng dữ liệu, mở bằng Excel hiện đúng tiếng Việt.

**AC-F14S1-8 — Cấu hình dashboard theo người dùng (phục vụ R-02, R-06)**
Given Minh gỡ thẻ "Tổng hợp hoạt động theo nhóm" và đổi thẻ "Nguồn contact" sang 3 cột
When Minh mở dashboard trên máy khác; Lan mở cùng dashboard
Then Minh thấy đúng bố cục đã đổi; Lan thấy bố cục mặc định.

**AC-F14S1-9 — Chỉ số sale (phục vụ S-07, S-08)**
Given Minh Trần có 4 deal Closed Won `closed_at` trong tháng 10 tổng 610.000.000 ₫, 2 deal Closed Lost, chỉ tiêu tháng 500.000.000 ₫
When gọi `sales_scorecard` kỳ `month`
Then dòng Minh có `wonAmount` 610.000.000, `winRate` 67, `quota` 500.000.000, `quotaPct` 122.

---

## 11. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-F14S1-01 | Unit | Tính `week` khi hôm nay Chủ nhật 04/10/2026 | 28/09 – 04/10 |
| TC-F14S1-02 | Unit | Kỳ trước của `quarter` khi hôm nay 01/10/2026 | 01/07 – 30/09 |
| TC-F14S1-03 | Unit | Kỳ trước của `d7` khi hôm nay 01/10/2026 | 18/09 – 24/09 |
| TC-F14S1-04 | Unit | Kỳ trước của `custom` 10/09 – 19/09 | 31/08 – 09/09 |
| TC-F14S1-05 | Unit | Mốc `auto` cho khoảng 15/09 – 10/11 (57 ngày) | 9 mốc tuần (tuần bắt đầu 14/09 cắt còn 15/09–20/09 … tuần bắt đầu 09/11 cắt còn 09/11–10/11) |
| TC-F14S1-06 | API | `compare: true` với `all` | Không có `compare` |
| TC-F14S1-07 | API | `sum` trên trường Văn bản | 400 REPORT_FIELD_INVALID |
| TC-F14S1-08 | API | `groupBy` 3 phần tử | 400 REPORT_QUERY_INVALID |
| TC-F14S1-09 | API | Khoảng tuỳ chọn 4 năm | 400 REPORT_RANGE_TOO_LONG |
| TC-F14S1-10 | API | Mốc ngày cho `all` có dữ liệu từ 2023 | 400 REPORT_TOO_MANY_BUCKETS |
| TC-F14S1-11 | API | Cùng truy vấn hai lần trong 60 giây | Lần hai `meta.cached = true` |
| TC-F14S1-12 | API | `?fresh=1` hai lần trong 10 giây cho cùng truy vấn | Lần hai trả bộ nhớ đệm, `meta.cached = true` |
| TC-F14S1-13 | API | Nhóm theo `owner_id` có deal không owner | Dòng "(Trống)" |
| TC-F14S1-14 | API | Nhóm theo `$actor` với ghi chú của người không gắn nhân viên | Dòng "(Không xác định)" |
| TC-F14S1-15 | API | `stage_funnel` với deal không có lịch sử đang ở Closed Lost | Chỉ tính ở giai đoạn 1; `meta.approximated` ≥ 1 |
| TC-F14S1-16 | API | Drill bằng mã đã quá 2 giờ | 410 DRILL_EXPIRED |
| TC-F14S1-17 | API | Xuất CSV không có `record.export` | 403 |
| TC-F14S1-18 | API | Xuất CSV 60.000 dòng | 413 EXPORT_TOO_LARGE |
| TC-F14S1-19 | API | `PUT my-state` với `size: 4` | 422 DASHBOARD_STATE_INVALID |
| TC-F14S1-20 | API | Định nghĩa dashboard thêm thẻ mới, người dùng có `layout` cũ | Thẻ mới nối vào cuối |
| TC-F14S1-21 | API | `dashboards?tab=mine` | Danh sách rỗng |
| TC-F14S1-22 | Hiệu năng | Mở dashboard 7 thẻ với 50.000 contact, 20.000 deal | Thẻ cuối < 2 giây (p95) |
| TC-F14S1-23 | API | `avg_days` theo mốc tháng, một tháng không có deal | Mốc đó `null` |
| TC-F14S1-24 | API | `sum` trên trường `audit_only` bởi người không được xem | 400 REPORT_FIELD_INVALID |
| TC-F14S1-25 | API | Xuất CSV có contact tên `=HYPERLINK("x")` | Ô trong tệp là `'=HYPERLINK("x")` |
| TC-F14S1-26 | API | `groupBy` có `buckets` Đang mở / Thắng / Thua | Ba dòng, mỗi dòng một mã drill |
| TC-F14S1-27 | API | `sales_scorecard` với `employees` = 2 người | `rank` là hạng trên toàn bộ sale đang làm việc |
| TC-F14S1-28 | Quyền | `sales_scorecard/export.csv` khi không có `record.export` trên `NhanVien` | 403 |

---

## 12. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Tải hết bản ghi về trình duyệt rồi lọc, đếm | Máy chủ tổng hợp (§4) |
| Kỳ trước = khoảng cùng độ dài ngay trước, kể cả với "Cả tháng này" | Theo §3.3 (tháng trước, quý trước…) |
| Biểu đồ theo thời gian luôn chia theo tháng, tối đa 12 tháng | Mốc `auto` (§4.3) |
| "Deals đã đóng", "Thời gian chốt" dùng Ngày Dự Kiến Chốt | Dùng `closed_at` (CRM-00 §5.4.2); chi tiết ở CRM-07 |
| Phễu tính theo giai đoạn hiện tại | Theo lịch sử giai đoạn (§5.1) |
| Owner lọc theo tên | Theo id NhanVien |
| Bố cục, yêu thích, tên dashboard lưu `localStorage` | `dashboard_user_state` (§8.2) |
| Drill giữ danh sách trong bộ nhớ trình duyệt | Mã drill đã ký, lấy lại từ máy chủ (§6) |
| "Mọi thời gian" bắt đầu từ 01/01/2026 cố định | Từ bản ghi sớm nhất (§4.3) |

---

## 13. Giả định và câu hỏi

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | QĐ-08: cấu hình dashboard theo người dùng (spec viết theo đề xuất mặc định). Có cần dashboard dùng chung cho cả đội do quản lý sắp xếp không? | PO / khách | §8 |
| Q2 | Mức dữ liệu dự kiến sau 1 năm (contact, deal, hoạt động) để kiểm lại mục tiêu §9 | Khách | §7, §9 |
| Q3 | Truy vấn chạy trên cơ sở dữ liệu chính hay bản sao chỉ đọc? Nếu có bản sao, số liệu có thể trễ vài giây | BE / DevOps | §7 |
| Q4 | Xuất cả dashboard dạng `.zip` nhiều CSV có ổn với khách không, hay cần một tệp Excel nhiều sheet? | Khách | §6.3 |

---

## Liên kết

- Màn Báo cáo: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-07-bao-cao.md`
- Màn Sales: `../../TTB/outputs/erp-customize-hubspots/specs/CRM-08-sales.md`
- Benchmark dashboard: `F14-S0-benchmark-lark-base-dashboard.md`
- Tầng dữ liệu: `F03-collections-data-layer.md` · `F03-S1-lien-ket-ban-ghi.md` · `F03-S3-nhat-ky-thay-doi-su-kien.md` · `F03-S6-activities-timeline.md`

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-10-01 | v1.0 — bản đầu | TTS (qua Claude) |
| 2026-10-01 | v1.1 — sửa theo review: `owner.in` rỗng là không lọc; `time.field` nhận `coalesce`; `groupBy` có `buckets` và `include`; nhóm rỗng của trung bình và mốc tương lai trả `null`; `avg_days` tính theo giây; quy tắc mốc `auto`; `$happenedAt` đúng bốn trường hợp của F03-S2; chặn trường `audit_only`; phễu và `sales_scorecard` (`openTasks`, `rank`, xuất CSV, quyền xuất); drill trả `count` chính xác; chống chèn công thức CSV; bộ nhớ đệm và giới hạn tần suất; TC-23..28 | TTS (qua Claude) |

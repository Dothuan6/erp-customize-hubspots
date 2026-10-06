# CRM-07 — Báo cáo

> **Trạng thái:** 💡 Proposed · v1.2 · 01/10/2026 · chờ review
> **Tính năng sở hữu (10):** R-01 → R-10
> **Phụ thuộc:** `F14-S1` (truy vấn tổng hợp, báo cáo có tên, drill-down, cấu hình dashboard) · `CRM-00` §5.2, §5.4, §5.10 (trường dùng trong phép tính) · `F03-S3` (lịch sử giai đoạn cho phễu) · `F03-S6` (người thực hiện hoạt động) · `CRM-01` §4.5 (popover owner) · `DESIGN-SYSTEM-HUBSPOT.md` §2.5, §6.16, §7.3
> **Prototype:** `crm-bao-cao-hubspot.html` (CRM Data Overview) · `crm-bao-cao-hubspot.html?d=pipe` (Pipeline Overview)
> **Nguồn HubSpot:** portal 247428660, hai dashboard "CRM Data Overview" và "Pipeline Overview", khảo sát 29/09/2026 (chỉ xem, không sửa) — `DOI-CHIEU-CHUC-NANG.md` §16

---

## 1. Phạm vi

| ID | Tính năng | Ưu tiên | Phạm vi sheet | Mục |
|---|---|---|---|---|
| R-01 | Bộ chọn dashboard | P1 | Chỉ FE | §3 |
| R-02 | Header dashboard | P2 | FE + BE | §4 |
| R-03 | Bộ lọc nhanh | P0 | FE + BE | §5.1 |
| R-04 | Bộ lọc nâng cao | P2 | Chỉ FE | §5.2 |
| R-05 | Thẻ báo cáo | P1 | Chỉ FE | §6 |
| R-06 | Bố cục dashboard | P2 | Chỉ FE | §7 |
| R-07 | Drill-down | P1 | Chỉ FE | §8 |
| R-08 | CRM Data Overview | P0 | FE + BE | §9 |
| R-09 | Pipeline Overview | P0 | FE + BE | §10 |
| R-10 | Báo cáo Tickets | P2 | Ngoài phạm vi | §11 |

Lệch so với sheet, cần PO xác nhận:

- R-01, R-05, R-06, R-07 ghi "Chỉ FE" nhưng cần BE: R-01 cần danh sách dashboard, yêu thích, xem gần đây; R-06 cần lưu bố cục; R-07 cần API drill-down và xuất CSV; R-05 cần đổi tên thẻ và xuất dữ liệu (F14-S1 §6, §8). Đề nghị sửa cột Phạm vi thành "FE + BE".
- Tên dashboard trên giao diện dùng tiếng Việt: **"Tổng quan dữ liệu CRM"** (sheet: CRM Data Overview) và **"Tổng quan pipeline"** (sheet: Pipeline Overview), theo quy ước ngôn ngữ sản phẩm.
- Ba phép tính khác prototype vì prototype dùng sai trường hoặc chỉ ước lượng. Chi tiết ở §10:
  - "Deals đã đóng" dùng `closed_at` thay cho Ngày dự kiến chốt.
  - "Thời gian chốt trung bình" dùng `closed_at` thay cho Ngày dự kiến chốt.
  - Phễu tính theo lịch sử giai đoạn, không theo giai đoạn hiện tại.

**Ngoài phạm vi:** tạo dashboard, tạo báo cáo tự do ("Create dashboard", "Explore reports" của HubSpot, F14-S1 §1.2); gửi báo cáo định kỳ; báo cáo của trang Sales (CRM-08).

---

## 2. Vị trí và URL

- Mục **"Báo cáo"** trên sidebar (G-02), ở nhóm menu ERP dưới vạch ngăn, sau Media (DS-HUBSPOT §5). Mở dashboard xem gần nhất; chưa xem lần nào thì mở "Tổng quan dữ liệu CRM".
- URL: `/reports/<dashboardId>?range=month&owners=emp_07,emp_12&lifecycle=Lead&goi=PROFESSIONAL`. Bộ lọc nằm trên URL để chia sẻ, Back của trình duyệt quay về bộ lọc trước. `range` là mã mốc (F14-S1 §3.1) hoặc `custom:2026-09-01:2026-09-30`.
- Bố cục trang theo template T3 của DS-HUBSPOT §7.3: header dashboard · thanh bộ lọc · lưới thẻ.
- Menu "Báo cáo" chỉ hiện với người đọc được ít nhất một trong Contacts, Deals, Activities.

---

## 3. Bộ chọn dashboard (R-01)

- Tiêu đề dashboard là nút "Tổng quan dữ liệu CRM ▾". Bấm mở popover rộng 420 px:
  - Ô tìm theo tên.
  - Bốn tab: **Tất cả** · **Xem gần đây** · **Yêu thích** · **Của tôi** (F14-S1 §8.3 `tab`).
  - Mỗi dòng: ☆ (bấm để thêm, bỏ yêu thích, không đóng popover) · tên dashboard · dòng nhỏ "Xem lần cuối {dd/mm/yyyy HH:mm}" (tab Xem gần đây) hoặc số thẻ.
  - Tab Của tôi luôn rỗng trong giai đoạn này: "Chưa hỗ trợ tạo dashboard riêng."
  - Tab Yêu thích rỗng: "Bấm ☆ cạnh tên dashboard để thêm vào Yêu thích."
- Chọn một dashboard: chuyển sang dashboard đó, **giữ bộ lọc Owner và bộ lọc nâng cao** nếu dashboard mới có các bộ lọc đó, đặt lại khoảng thời gian về mặc định của dashboard mới (§5.1).
- Mỗi lần mở một dashboard, FE gọi `POST /dashboards/:id/viewed`.

---

## 4. Header dashboard (R-02)

Từ trái sang phải: ☆ (yêu thích, F14-S1 §8.3) · nút tiêu đề (§3) · bên phải ba nút:

| Nút | Mục | Hành vi |
|---|---|---|
| **Thao tác ▾** | Đổi tên dashboard | Ô sửa tên tại chỗ trên tiêu đề, Enter lưu, Esc huỷ. Tên chỉ đổi với người đổi (F14-S1 §8.3). Trống thì báo "Nhập tên dashboard" |
| | Xuất dữ liệu (tệp ZIP) | Gọi F14-S1 §6.3 với bộ lọc đang áp; tải tệp `{tên dashboard}-{dd-mm-yyyy}.zip`, trong đó mỗi thẻ một tệp CSV số liệu tổng hợp. Đang tạo tệp: nút xoay, toast "Đang chuẩn bị tệp…". Có thẻ bị bỏ qua: toast "Đã xuất. {n} thẻ không xuất được, xem ghi-chu.txt trong tệp" |
| | Khôi phục bố cục mặc định | Hộp xác nhận "Đưa dashboard về tên, thứ tự, kích thước và các thẻ mặc định?"; gọi `DELETE my-state` |
| **Chia sẻ ▾** | Sao chép liên kết | Chép URL hiện tại (có bộ lọc) vào bộ nhớ tạm, toast "Đã sao chép liên kết". Dưới mục có chữ nhỏ "Người nhận thấy cùng bộ lọc, với quyền xem dữ liệu của họ" |
| **Thêm nội dung ▾** | Danh sách thẻ đã gỡ | Mỗi thẻ một dòng có nút "Thêm"; thêm thì thẻ trở lại cuối dashboard với kích thước mặc định. Không có thẻ đã gỡ: "Mọi báo cáo đều đang hiện" |

Các nút "Explore reports", "Create dashboard", ⚙ của HubSpot **không** hiện (không làm trong giai đoạn này).

---

## 5. Bộ lọc

### 5.1 Bộ lọc nhanh (R-03)

Hàng bộ lọc dưới header, theo thứ tự:

| Dashboard | Bộ lọc nhanh | Khoảng thời gian mặc định |
|---|---|---|
| Tổng quan dữ liệu CRM | Khoảng thời gian ▾ · Owner ▾ | Cả tháng này |
| Tổng quan pipeline | Khoảng thời gian ▾ · Sale phụ trách ▾ | Cả quý này |

**Khoảng thời gian ▾**: popover liệt kê 14 mốc của F14-S1 §3.1 theo đúng thứ tự trong bảng, mỗi mốc kèm dòng nhỏ ghi khoảng ngày thật (ví dụ "01/10 – 31/10"), cuối cùng "Tuỳ chọn…" mở hai ô Từ – Đến và nút "Áp dụng". Nút hiện "Khoảng thời gian: Cả tháng này"; rê chuột hiện "01/10/2026 – 31/10/2026". Tuỳ chọn quá 3 năm: báo "Khoảng thời gian tối đa 3 năm" dưới hai ô.

**Owner ▾ / Sale phụ trách ▾**: popover chọn nhiều nhân viên như popover owner của CRM-01 §4.5 (ô tìm, mục "(Chưa có owner)", chỉ nhân viên `is_sales`, ba nhóm Đang làm việc · Tạm nghỉ · Đã nghỉ). Nút hiện tên khi chọn 1–2 người, "{n} người" khi nhiều hơn. Áp vào thẻ theo cột "Owner áp vào" ở §9, §10.

Thẻ hoạt động lọc theo `$actor` (người thực hiện). Khi không chọn ai, thẻ đếm cả hoạt động của nhân viên không thuộc đội kinh doanh (ví dụ kế toán ghi chú trên contact). Popover chỉ liệt kê nhân viên `is_sales` nên không lọc riêng được những người này (Q6).

**Làm mới** (biểu tượng ↻ cuối hàng): tải lại mọi thẻ, bỏ qua bộ nhớ đệm (`fresh=1`, F14-S1 §7). Cạnh nút có chữ nhỏ "Số liệu tính lúc {HH:mm}" lấy `meta.computedAt` cũ nhất trong các thẻ.

Đổi bộ lọc: FE chờ 500 ms sau lần đổi cuối rồi mới tải lại mọi thẻ (đổi liền nhiều bộ lọc chỉ tải một lần), mỗi thẻ có trạng thái tải riêng. Bộ lọc **không** lưu theo người dùng; mở lại dashboard (không có tham số URL) thì về mặc định.

### 5.2 Bộ lọc nâng cao (R-04)

Nút "Bộ lọc nâng cao ({n})" mở panel phải 460 px:

| Bộ lọc | Áp vào thẻ có nguồn | Giá trị |
|---|---|---|
| Lifecycle stage | Contacts | Checkbox các giá trị D-LIFECYCLE |
| Gói dịch vụ mục tiêu | Deals | Checkbox các giá trị của `g_i_d_ch_v_m_c_ti_u` |

- Nút "Áp dụng" · "Xoá tất cả" · "Huỷ", như bộ lọc nâng cao của danh sách (CRM-01 §4.6).
- `n` là số bộ lọc đang có giá trị.
- Thẻ không chịu bộ lọc nâng cao nào (thẻ hoạt động) không hiện chip "Bộ lọc" cho bộ lọc đó.

---

## 6. Thẻ báo cáo (R-05)

Style theo DS-HUBSPOT §6.16 (card báo cáo), biểu đồ theo bảng màu §2.5.

**Header thẻ**

- Tiêu đề là link tới danh sách tương ứng với bộ lọc đã áp (cột "Link tiêu đề" ở §9, §10). Thẻ không có danh sách đích (thẻ hoạt động) thì tiêu đề là chữ thường.
- ⓘ cạnh tiêu đề: tooltip mô tả phép tính (cột "Mô tả ⓘ").
- Hàng chip dưới tiêu đề:
  - Chip khoảng thời gian, ví dụ "Cả tháng này"; rê chuột hiện ngày cụ thể.
  - Chip so sánh, chỉ ở thẻ có so sánh. Tên kỳ theo F14-S1 §3.3: "So với: hôm qua" (mốc Hôm nay), "So với: hôm kia" (Hôm qua), "So với: tuần trước", "So với: tháng trước", "So với: quý trước", "So với: năm trước". Với 7/30/90 ngày qua và khoảng tuỳ chọn, chip ghi khoảng ngày của kỳ trước, ví dụ "So với: 18/09 – 24/09". Rê chuột lên chip luôn hiện khoảng ngày cụ thể của kỳ trước.
  - Chip "Bộ lọc ({n})" khi có Owner hoặc bộ lọc nâng cao áp vào thẻ; rê chuột liệt kê từng bộ lọc.
- Rê chuột lên thẻ hiện ở góc phải: tay nắm kéo ⋮⋮ (§7) · ↻ làm mới riêng thẻ · ⋮ menu.

**Menu ⋮ của thẻ**

| Mục | Hiện khi | Hành vi |
|---|---|---|
| Đi tới {Contacts / Deals} | Thẻ có danh sách đích | Như bấm tiêu đề |
| Xem bản ghi | Luôn | Mở drill-down của tổng (§8) |
| Đổi tên | Luôn | Sửa tiêu đề tại chỗ; lưu vào `cardTitles` của người dùng. Trống thì về tên mặc định |
| Xuất dữ liệu chi tiết (CSV) | Có `record.export` trên nguồn | Xuất bản ghi của tổng (F14-S1 §6.2) |
| Di chuyển lên trước / Di chuyển ra sau | Không phải thẻ đầu / cuối | Đổi chỗ với thẻ bên cạnh (thay cho kéo thả khi dùng bàn phím) |
| vạch ngăn | | |
| Gỡ khỏi dashboard | Luôn | Gỡ ngay, toast "Đã gỡ “{tên}”" kèm nút "Hoàn tác" 5 giây. Thêm lại bằng "Thêm nội dung" (§4) |

**Thân thẻ** theo kiểu biểu đồ:

| Kiểu | Hiển thị |
|---|---|
| Số (KPI) | Nhãn nhỏ chữ hoa ("SỐ LƯỢNG CONTACTS") · con số lớn là nút mở drill-down · dòng so sánh "▲ 29% so với tháng trước (21)" màu thành công, "▼ …" màu lỗi, "Không đổi so với tháng trước" khi bằng. Tên kỳ trong dòng giống chip; với 7/30/90 ngày và tuỳ chọn ghi "so với kỳ trước". Kỳ trước bằng 0: ghi "Kỳ trước ({khoảng ngày}): 0", ví dụ "Kỳ trước (01/08 – 31/08): 0", không tính phần trăm. Mọi thời gian: không có dòng so sánh |
| Cột đứng | Mỗi nhóm một cột, nhãn giá trị trên đầu cột, trục y 3 vạch; bấm cột mở drill-down nhóm đó |
| Đường | Điểm theo mốc thời gian, nhãn giá trị trên điểm; bấm điểm mở drill-down mốc đó |
| Tròn (donut) | Lát theo nhóm, tổng ở giữa kèm đơn vị; chú thích dưới có số và phần trăm, bấm lát hoặc chú thích mở drill-down |
| Thanh ngang | Mỗi nhóm một thanh, nhãn trái, giá trị phải; bấm thanh mở drill-down |
| Bảng | Như mô tả ở thẻ; ô số khác 0 là nút mở drill-down |

Rê chuột lên cột, điểm, lát, thanh hiện tooltip "{nhóm}: {giá trị}". Mọi biểu đồ có `role="img"` và nhãn là tiêu đề thẻ; dưới biểu đồ có bảng dữ liệu ẩn cho trình đọc màn hình.

**Trạng thái thẻ**

| Trạng thái | Hiển thị |
|---|---|
| Đang tải | Skeleton theo kiểu biểu đồ |
| Không có dữ liệu | Biểu tượng + "Không có dữ liệu trong khoảng thời gian này" |
| Lỗi | "Không tải được báo cáo." + nút "Thử lại" |
| Quá thời gian (`504`) | "Báo cáo chạy quá lâu. Thử thu hẹp khoảng thời gian." + "Thử lại" |
| Quá giới hạn tần suất (`429`) | "Bạn đang tải báo cáo quá nhanh. Thử lại sau ít phút." + "Thử lại". FE không tự gửi lại |
| Không có quyền đọc nguồn | "Bạn chưa có quyền xem dữ liệu {Contacts / Deals / hoạt động}." Thẻ vẫn giữ chỗ trong bố cục |

---

## 7. Bố cục dashboard (R-06)

- Lưới 3 cột từ 1240 px; 2 cột ở 905–1239 px (thẻ 3 cột chiếm 2); 1 cột dưới 905 px.
- **Kéo thả**: kéo tay nắm ⋮⋮ để đổi thứ tự; trong lúc kéo hiện chỗ thả viền đứt. Bàn phím: dùng mục "Di chuyển lên trước / ra sau" (§6).
- **Đổi kích thước**: nút ở góc dưới phải thẻ đổi vòng 1 → 2 → 3 → 1 cột. Tooltip "Đổi kích thước (đang {n} cột)".
- **Gỡ và thêm lại**: §6, §4.
- Mọi thay đổi lưu ngay vào `my-state` của người dùng (F14-S1 §8.3), gộp các lần đổi trong 1 giây thành một lần gửi. Lỗi lưu: toast "Chưa lưu được bố cục", giữ bố cục trên màn hình.
- Đổi bố cục không chạy lại truy vấn của thẻ.

---

## 8. Drill-down (R-07)

- Bấm con số KPI, cột, điểm, lát, thanh, ô bảng, hoặc "Xem bản ghi" mở **panel phải 640 px** có scrim.
- Tiêu đề panel: "{tiêu đề thẻ} · {nhãn nhóm}" (ví dụ "Nguồn contact · Website"), dòng phụ "{n} bản ghi · {khoảng thời gian}".
- Bảng các cột theo nguồn (F14-S1 §6.1). Cột đầu là tên bản ghi dạng link, bấm mở trang chi tiết trong tab hiện tại; Ctrl/⌘ + bấm mở tab mới.
- 50 dòng một lần, nút "Xem thêm" ở cuối. Bấm tiêu đề cột để sắp xếp (gửi `sort`).
- Nút "Xuất CSV" ở header panel (cần `record.export`), gọi F14-S1 §6.2. Quá 50.000 dòng: "Danh sách quá lớn để xuất. Thu hẹp bộ lọc rồi thử lại."
- Mã drill hết hạn (`410`): FE chạy lại truy vấn của thẻ rồi mở lại danh sách, người dùng không phải làm gì.
- Số bản ghi trong panel có thể khác con số trên thẻ nếu dữ liệu vừa thay đổi (thẻ dùng bộ nhớ đệm 60 giây). Khi khác, panel ghi chữ nhỏ "Số liệu đã thay đổi kể từ lúc tính thẻ."

---

## 9. Tổng quan dữ liệu CRM (R-08)

Bảy thẻ, theo thứ tự mặc định. Thẻ Tickets của HubSpot bị bỏ (R-10).

| # | Thẻ (id) | Kích thước | Kiểu | Nguồn · phép đo | Trường thời gian · nhóm | So sánh | Owner áp vào | Nâng cao | Link tiêu đề |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Contacts mới tạo (`newc`) | 1 | Số | Contacts · đếm | Ngày tạo contact¹ trong khoảng | Có | `owner_id` | Lifecycle | Contacts, lọc Ngày tạo + owner |
| 2 | Nguồn contact (`src`) | 2 | Cột đứng | Contacts · đếm | Ngày tạo contact¹ trong khoảng · nhóm `source` (D-SOURCE, có "(Trống)") | Không | `owner_id` | Lifecycle | Contacts, lọc Ngày tạo + owner |
| 3 | Contacts thêm theo thời gian (`cover`) | 1 | Đường | Contacts · đếm | Ngày tạo contact¹ · mốc `auto` | Không | `owner_id` | Lifecycle | Contacts, lọc Ngày tạo + owner |
| 4 | Deals tạo theo thời gian (`dover`) | 2 | Đường | Deals · đếm | `_createdAt` · mốc `auto` | Không | `owner_id` | Gói dịch vụ | Deals, lọc Ngày tạo + sale |
| 5 | Deals theo giai đoạn (`stage`) | 1 | Tròn | Deals · đếm | `_createdAt` trong khoảng · nhóm giai đoạn hiện tại (D-STAGE) | Không | `owner_id` | Gói dịch vụ | Deals, lọc Ngày tạo + sale |
| 6 | Phân loại hoạt động (`atype`) | 1 | Thanh ngang | Hoạt động · đếm | `$happenedAt` trong khoảng · nhóm `$type` (Ghi chú, Task, Cuộc họp, Cuộc gọi) | Không | `$actor` | — | Không có |
| 7 | Tổng hợp hoạt động theo nhóm (`team`) | 2 | Bảng | Hoạt động · đếm | `$happenedAt` trong khoảng · nhóm `$actor` × `$type` | Không | `$actor` | — | Không có |

¹ Ngày tạo contact gửi lên là `time.field = { "coalesce": ["lead_created_at", "_createdAt"] }` (F14-S1 §4.1): contact chuyển từ Leads tính theo ngày tạo lead gốc, contact tạo mới tính theo ngày tạo hệ thống. Không làm vậy thì toàn bộ lead cũ dồn vào đúng ngày chạy script chuyển đổi và thẻ 1, 2, 3 có một cột vọt lên bất thường (Q8).

**Mô tả ⓘ**

1. "Số contact được tạo trong khoảng thời gian, so với kỳ liền trước."
2. "Contact tạo trong khoảng thời gian, chia theo Nguồn."
3. "Số contact tạo mới theo ngày hoặc theo tháng, tuỳ độ dài khoảng thời gian."
4. "Số deal tạo mới theo ngày hoặc theo tháng, tuỳ độ dài khoảng thời gian."
5. "Deal tạo trong khoảng thời gian, chia theo giai đoạn hiện tại."
6. "Hoạt động đã diễn ra trong khoảng thời gian: ghi chú, cuộc gọi, cuộc họp đã qua giờ, task đã xong."
7. "Số hoạt động đã diễn ra của từng người, theo loại."

**Ghi chú phép tính**

- "Đã diễn ra" (thẻ 6, 7) theo `$happenedAt` của F14-S1 §4.4: không tính cuộc gọi, cuộc họp hẹn trong tương lai, cuộc họp có kết quả Huỷ, Đổi lịch, Không đến, và task chưa xong. Prototype đếm theo lúc tạo hoạt động; spec đổi để thẻ khớp với "Ngày hoạt động gần nhất" (F03-S2 §6.1).
- Thẻ 7: mỗi dòng là một nhân viên; cột Ghi chú · Task · Cuộc họp · Cuộc gọi · Tổng; sắp theo Tổng giảm dần. Có bộ lọc Owner thì gửi các id đó vào `include` của nhóm `$actor` (F14-S1 §4.1) để hiện đúng những người được chọn kể cả khi bằng 0; không có thì chỉ hiện người có ít nhất một hoạt động. Dòng "(Không xác định)" cho hoạt động của tài khoản không gắn nhân viên.
- Thẻ 5 dùng 6 màu đầu của bảng phân loại (§2.5) theo thứ tự D-STAGE.
- Link tiêu đề mở danh sách với bộ lọc Ngày tạo bằng mốc đang chọn và owner. Mốc có trong CRM-01 §4.5 thì truyền theo mã; ba mốc CRM-01 không có là Quý trước (`lastquarter`), Năm trước (`lastyear`) thì truyền dạng khoảng tuỳ chọn, còn Mọi thời gian (`all`) thì không thêm bộ lọc Ngày tạo.
- Danh sách Contacts lọc theo Ngày tạo hệ thống, còn thẻ 1, 2, 3 tính theo ngày tạo lead gốc với contact chuyển từ Leads (¹). Vì vậy số dòng trong danh sách có thể khác số trên thẻ ở các khoảng trước ngày chuyển đổi; con số khớp tuyệt đối thì dùng drill-down (§8).

---

## 10. Tổng quan pipeline (R-09)

| # | Thẻ (id) | Kích thước | Kiểu | Nguồn · phép đo | Trường thời gian · nhóm | So sánh | Owner áp vào | Nâng cao | Link tiêu đề |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Deals đã tạo (`dcr`) | 1 | Số | Deals · đếm | `_createdAt` trong khoảng | Có | `owner_id` | Gói dịch vụ | Deals, lọc Ngày tạo + sale |
| 2 | Deals đã đóng (`dcl`) | 1 | Số | Deals · đếm, giai đoạn là 5. Closed Won hoặc 6. Closed Lost | `closed_at` trong khoảng | Có | `owner_id` | Gói dịch vụ | Deals, lọc giai đoạn Won/Lost + Ngày đóng + sale |
| 3 | Deals theo trạng thái (`dst`) | 1 | Tròn | Deals · đếm | `_createdAt` trong khoảng · nhóm `giai_o_n_pipeline` gộp ba nhóm bằng `buckets` (F14-S1 §4.1): Đang mở / Thắng / Thua | Không | `owner_id` | Gói dịch vụ | Deals, lọc Ngày tạo + sale |
| 4 | Hiệu quả sale theo giá trị chốt (`perf`) | 2 | Thanh ngang | Deals · tổng Amount (`t_ng_cash_in_d_ki_n`), giai đoạn 5. Closed Won | `closed_at` trong khoảng · nhóm `owner_id` | Không | `owner_id` | Gói dịch vụ | Deals, lọc Won + Ngày đóng + sale |
| 5 | Tiến trình deal qua các giai đoạn (`fun`) | 2 | Thanh ngang | Báo cáo có tên `stage_funnel` (F14-S1 §5.1), giai đoạn 1 → 5 | `_createdAt` trong khoảng | Không | `owner_id` | Gói dịch vụ | Deals, lọc Ngày tạo + sale |
| 6 | Thời gian chốt trung bình (`ttc`) | 1 | Đường | Deals · `avg_days` từ `_createdAt` tới `closed_at`, giai đoạn 5. Closed Won | `closed_at` · mốc `auto` | Không | `owner_id` | Gói dịch vụ | Deals, lọc Won + Ngày đóng + sale |

**Mô tả ⓘ**

1. "Số deal được tạo trong khoảng thời gian, so với kỳ liền trước."
2. "Số deal chuyển sang Closed Won hoặc Closed Lost trong khoảng thời gian, so với kỳ liền trước."
3. "Deal tạo trong khoảng thời gian: đang mở, đã thắng, đã thua."
4. "Tổng Cash-In Dự Kiến của deal Closed Won, theo ngày đóng, chia theo Sale phụ trách."
5. "Số deal tạo trong khoảng thời gian đã từng tới hoặc vượt qua từng giai đoạn. Deal thua vẫn được tính ở các giai đoạn đã đi qua."
6. "Số ngày trung bình từ lúc tạo deal tới lúc deal chuyển sang Closed Won, theo tháng đóng."

**Ghi chú phép tính**

- **Thời điểm đóng** là `closed_at` (CRM-00 §5.4.2): máy chủ ghi khi deal chuyển vào Won hoặc Lost. Prototype dùng Ngày dự kiến chốt, là ngày do sale đoán và có thể nằm trong tương lai. Deal đóng trước khi có trường `closed_at` không có giá trị; script chuyển đổi CRM-00 điền `closed_at` cho deal đã ở Won/Lost bằng `ng_y_c_p_nh_t_g_n_nh_t` nếu có, không có thì để trống và deal đó không vào thẻ 2, 4, 6 (Q3).
- **"Đang mở / Thắng / Thua"** (thẻ 3): Thắng = 5. Closed Won, Thua = 6. Closed Lost, còn lại là Đang mở (CRM-00 §5.4.3). Màu theo trạng thái của DS-HUBSPOT §2.3.
- **Thẻ 4**: sắp theo giá trị giảm dần; giá trị dạng rút gọn "610 tr ₫", "1,2 tỷ ₫"; tooltip có số đầy đủ. Deal không có sale phụ trách ở dòng "(Trống)".
- **Thẻ 5**: dưới biểu đồ có dòng "Tỷ lệ chuyển từ 1. MQL Qualified sang 5. Closed Won: {conversion}%". Có deal tính gần đúng (`meta.approximated` > 0) thì thêm chữ nhỏ "{n} deal tạo trước khi có lịch sử giai đoạn được tính theo giai đoạn hiện tại."
- **Thẻ 6**: giá trị hiển thị "{x} ngày" (một chữ số thập phân, dấu phẩy). Mốc không có deal thắng thì không vẽ điểm (không phải 0) và đường nối qua.
- **So sánh** (thẻ 1, 2) theo F14-S1 §3.3.
- **Link tiêu đề** của thẻ 2, 4, 6 lọc thêm "Ngày đóng" (`closed_at`) trong khoảng đang chọn, để danh sách Deals ra đúng các deal của thẻ. Quy tắc truyền mốc như §9.

---

## 11. Báo cáo Tickets (R-10 — ngoài phạm vi)

ERP chưa có đối tượng Ticket. Hai thẻ "Open ticket summary", "Ticket status breakdown" của HubSpot **không** có trên dashboard và không có trong "Thêm nội dung". AC của R-10 kiểm rằng không có thẻ nào liên quan tới Tickets.

---

## 12. Quyền

| Hành động | Điều kiện |
|---|---|
| Thấy menu Báo cáo, mở dashboard | Đọc được ít nhất một collection nguồn của dashboard |
| Xem số liệu của một thẻ | Đọc được collection nguồn của thẻ; số liệu chỉ tính trên bản ghi đọc được (F14-S1 §4.5) |
| Drill-down | Như trên |
| Xuất CSV (thẻ, drill-down) | `record.export` trên collection nguồn |
| Xuất dữ liệu cả dashboard | Đọc được ít nhất một nguồn; thẻ không có quyền bị bỏ qua (F14-S1 §6.3) |
| Đổi tên, bố cục, yêu thích | Mọi người mở được dashboard; chỉ ảnh hưởng chính họ |

---

## 13. Tiêu chí nghiệm thu

**AC-R01-1 — Chọn dashboard và yêu thích**
Given đang ở "Tổng quan dữ liệu CRM"
When mở bộ chọn, bấm ☆ ở "Tổng quan pipeline", rồi chọn tab Yêu thích
Then tab Yêu thích có "Tổng quan pipeline"; chọn nó thì chuyển dashboard, khoảng thời gian thành "Cả quý này".

**AC-R01-2 — Xem gần đây**
Given Minh mở "Tổng quan pipeline" lúc 09:00 rồi "Tổng quan dữ liệu CRM" lúc 09:05
When mở tab Xem gần đây
Then "Tổng quan dữ liệu CRM" đứng đầu với "Xem lần cuối 01/10/2026 09:05".

**AC-R02-1 — Đổi tên chỉ với mình**
Given Minh đổi tên dashboard thành "Báo cáo của Minh"
When Lan mở cùng dashboard
Then Lan vẫn thấy "Tổng quan dữ liệu CRM".

**AC-R02-2 — Thêm lại thẻ đã gỡ**
Given đã gỡ thẻ "Nguồn contact"
When mở "Thêm nội dung ▾", bấm "Thêm" ở "Nguồn contact"
Then thẻ trở lại cuối dashboard, kích thước 2 cột.

**AC-R02-3 — Sao chép liên kết**
Given bộ lọc Khoảng thời gian "Quý trước", Owner Minh Trần
When chọn "Chia sẻ ▾ → Sao chép liên kết" và gửi cho Lan
Then Lan mở liên kết thấy đúng hai bộ lọc đó, số liệu theo quyền của Lan.

**AC-R03-1 — Mặc định theo dashboard**
Given hôm nay 01/10/2026
When mở "Tổng quan dữ liệu CRM" không có tham số URL
Then bộ lọc là "Khoảng thời gian: Cả tháng này", rê chuột hiện "01/10/2026 – 31/10/2026"; mở "Tổng quan pipeline" thì là "Cả quý này" (01/10/2026 – 31/12/2026).

**AC-R03-2 — Owner chọn nhiều**
Given Minh Trần có 5 contact, Lan Lê có 3 contact tạo trong tháng
When chọn Owner Minh Trần và Lan Lê
Then thẻ "Contacts mới tạo" hiện 8; nút ghi "Owner: Minh Trần, Lan Lê"; thẻ "Phân loại hoạt động" chỉ đếm hoạt động của hai người.

**AC-R03-3 — Khoảng tuỳ chọn**
Given popover Khoảng thời gian
When chọn "Tuỳ chọn…", nhập 01/09/2026 – 15/09/2026, bấm "Áp dụng"
Then nút ghi "Khoảng thời gian: 01/09/2026 – 15/09/2026"; URL có `range=custom:2026-09-01:2026-09-15`; thẻ "Contacts thêm theo thời gian" chia theo ngày (15 mốc).

**AC-R04-1 — Bộ lọc nâng cao chỉ áp vào đúng nguồn**
Given đang ở "Tổng quan dữ liệu CRM"
When chọn Lifecycle stage = Customer trong bộ lọc nâng cao
Then thẻ 1, 2, 3 có chip "Bộ lọc (1)" và số liệu đổi; thẻ 4, 5, 6, 7 không đổi.

**AC-R05-1 — Chip so sánh và dòng so sánh**
Given tháng 10 có 27 contact mới, tháng 9 có 21
When xem thẻ "Contacts mới tạo"
Then có chip "So với: tháng trước" và dòng "▲ 29% so với tháng trước (21)".

**AC-R05-2 — Menu thẻ**
Given thẻ "Deals đã đóng", người dùng có `record.export`
When mở ⋮
Then có Đi tới Deals · Xem bản ghi · Đổi tên · Xuất dữ liệu chi tiết (CSV) · Di chuyển lên trước · Di chuyển ra sau · Gỡ khỏi dashboard.

**AC-R05-3 — Thẻ không có quyền**
Given Lan không đọc được collection hoạt động
When mở "Tổng quan dữ liệu CRM"
Then thẻ 6, 7 hiện "Bạn chưa có quyền xem dữ liệu hoạt động."; các thẻ khác bình thường.

**AC-R06-1 — Kéo thả và đổi kích thước được nhớ**
Given dashboard mặc định
When kéo thẻ "Deals theo giai đoạn" lên đầu và đổi nó sang 2 cột, rồi tải lại trang
Then thẻ vẫn đứng đầu và rộng 2 cột.

**AC-R06-2 — Khôi phục bố cục**
Given đã đổi thứ tự, gỡ một thẻ, đổi tên dashboard
When chọn "Thao tác ▾ → Khôi phục bố cục mặc định" và xác nhận
Then dashboard về tên, thứ tự, kích thước và đủ 7 thẻ mặc định; ☆ yêu thích giữ nguyên.

**AC-R07-1 — Drill-down từ cột**
Given thẻ "Nguồn contact" có cột Website = 18
When bấm cột Website
Then panel "Nguồn contact · Website" ghi "18 bản ghi · Cả tháng này" và liệt kê 18 contact với các cột Họ và tên, Email, Contact owner, Nguồn, Lifecycle stage, Ngày tạo; bấm "Xuất CSV" tải tệp 18 dòng.

**AC-R08-1 — Đủ bảy thẻ đúng kiểu**
Given mở "Tổng quan dữ liệu CRM"
When xem dashboard
Then có đúng 7 thẻ theo thứ tự và kiểu biểu đồ ở §9; không có thẻ Tickets.

**AC-R08-2 — Hoạt động chỉ đếm việc đã diễn ra**
Given trong tháng có 3 cuộc gọi đã ghi, 1 cuộc họp hẹn ngày 20/10, 2 task chưa xong, 1 task đã xong
When xem thẻ "Phân loại hoạt động" ngày 01/10/2026
Then Cuộc gọi = 3, Cuộc họp = 0, Task = 1.

**AC-R09-1 — Deals đã đóng theo ngày đóng**
Given deal X có Ngày dự kiến chốt 15/12 nhưng đã chuyển sang Closed Won ngày 01/10/2026
When xem thẻ "Deals đã đóng" với "Cả quý này"
Then X được đếm.

**AC-R09-2 — Phễu tính deal đã thua**
Given trong quý có deal A đi tới "4. Proposal Sent" rồi thua, deal B đang ở "2. Discovery Call", deal C đã thắng
When xem thẻ "Tiến trình deal qua các giai đoạn"
Then các thanh là 3 · 3 · 2 · 2 · 1 và dòng "Tỷ lệ chuyển từ 1. MQL Qualified sang 5. Closed Won: 33%".

**AC-R09-3 — Hiệu quả sale**
Given trong quý Minh Trần thắng 2 deal tổng 610.000.000 ₫, Lan Lê thắng 1 deal 240.000.000 ₫
When xem thẻ "Hiệu quả sale theo giá trị chốt"
Then thanh Minh "610 tr ₫" đứng trên thanh Lan "240 tr ₫"; bấm thanh Minh mở 2 deal.

**AC-R10-1 — Không có Tickets**
Given mọi dashboard
When mở "Thêm nội dung ▾" và bộ chọn dashboard
Then không có thẻ hay dashboard nào về Tickets.

---

## 14. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-CRM07-01 | E2E | Mở `/reports/pipeline-overview?range=lastmonth` khi hôm nay 01/10/2026 | Bộ lọc "Tháng trước" (01/09 – 30/09); thẻ KPI có chip "So với: tháng trước" và kỳ so sánh là 01/08 – 31/08 |
| TC-CRM07-02 | E2E | Đổi Owner rồi bấm Back | Bộ lọc Owner về như trước |
| TC-CRM07-03 | E2E | Chọn "Mọi thời gian" | Thẻ KPI không có dòng so sánh, không có chip "So với" |
| TC-CRM07-04 | E2E | Tuỳ chọn 4 năm | Báo "Khoảng thời gian tối đa 3 năm", không gửi truy vấn |
| TC-CRM07-05 | E2E | Một thẻ trả 504, các thẻ khác bình thường | Chỉ thẻ đó hiện "Báo cáo chạy quá lâu…" |
| TC-CRM07-06 | E2E | Bấm ↻ làm mới hai lần trong 5 giây | Lần hai không gửi `fresh=1` (nút vô hiệu tới hết 10 giây) |
| TC-CRM07-07 | E2E | Gỡ thẻ rồi bấm "Hoàn tác" | Thẻ trở lại đúng vị trí cũ |
| TC-CRM07-08 | E2E | Màn 390 px | Một cột, thẻ 3 cột chiếm hết bề ngang |
| TC-CRM07-09 | E2E | Màn 1000 px, thẻ 3 cột | Chiếm 2 cột |
| TC-CRM07-10 | E2E | Drill 120 bản ghi, bấm "Xem thêm" hai lần | Đủ 120, không trùng |
| TC-CRM07-11 | E2E | Drill bằng mã hết hạn | Tự chạy lại, mở được danh sách |
| TC-CRM07-12 | E2E | Bấm tiêu đề "Contacts mới tạo" với "Quý trước" | Danh sách Contacts lọc Ngày tạo khoảng 01/07/2026 – 30/09/2026 |
| TC-CRM07-13 | E2E | Thẻ "Thời gian chốt trung bình" có tháng không có deal thắng | Không có điểm ở tháng đó, đường nối qua |
| TC-CRM07-14 | E2E | Thẻ "Tổng hợp hoạt động theo nhóm" chọn Owner 3 người, 1 người không có hoạt động | Dòng người đó toàn 0 |
| TC-CRM07-15 | Quyền | Người không có `record.export` | Không có "Xuất dữ liệu chi tiết", không có "Xuất CSV" ở drill |
| TC-CRM07-16 | Quyền | Người không đọc được Contacts, Deals, hoạt động | Không thấy menu Báo cáo |
| TC-CRM07-17 | A11y | Đổi thứ tự thẻ chỉ bằng bàn phím | Làm được qua menu ⋮ |
| TC-CRM07-18 | A11y | Trình đọc màn hình đọc biểu đồ cột | Đọc được tiêu đề và bảng dữ liệu ẩn |
| TC-CRM07-19 | E2E | Lỗi lưu bố cục | Toast "Chưa lưu được bố cục", bố cục trên màn hình giữ nguyên |

---

## 15. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Đếm, cộng trên dữ liệu tải về trình duyệt | F14-S1 tổng hợp ở máy chủ |
| Kỳ trước = khoảng cùng độ dài liền trước | Theo F14-S1 §3.3 |
| Biểu đồ theo thời gian luôn theo tháng | Mốc `auto` (F14-S1 §4.3) |
| "Deals đã đóng", "Thời gian chốt" dùng Ngày dự kiến chốt | `closed_at` (§10) |
| Phễu theo giai đoạn hiện tại, bỏ deal thua | Theo lịch sử giai đoạn, tính cả deal thua (§10) |
| Hoạt động đếm theo lúc tạo | Theo thời điểm đã diễn ra (§9) |
| Owner là tên | Id NhanVien |
| Bố cục, yêu thích, tên lưu `localStorage` | `dashboard_user_state` (F14-S1 §8) |
| Xuất CSV dựng ở trình duyệt | Máy chủ xuất, có giới hạn và ghi nhật ký (F14-S1 §6) |
| "Mọi thời gian" bắt đầu 01/01/2026 | Từ bản ghi sớm nhất |

---

## 16. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | Sheet ghi R-01, R-05, R-06, R-07 là "Chỉ FE" nhưng cần BE. Đồng ý sửa cột Phạm vi? | PO | §1 |
| Q2 | Thẻ hoạt động đang bỏ cuộc họp có kết quả Huỷ, Đổi lịch, Không đến (theo "Ngày hoạt động gần nhất"). Khách có muốn đếm riêng những cuộc họp này ở đâu đó không? | Khách | §9 |
| Q3 | Deal đã đóng từ trước khi có `closed_at`: lấy ngày cập nhật gần nhất làm ngày đóng có chấp nhận được không? | Khách | §10 |
| Q4 | Có cần dashboard dùng chung do quản lý sắp xếp cho cả đội không? (F14-S1 Q1) | Khách | §7 |
| Q5 | Đặt tên dashboard tiếng Việt (Tổng quan dữ liệu CRM, Tổng quan pipeline) có được không, hay giữ tên tiếng Anh như portal HubSpot của khách? | Khách | §1 |
| Q6 | Bộ lọc Owner chỉ liệt kê nhân viên `is_sales`, trong khi thẻ hoạt động đếm cả người ngoài đội kinh doanh. Có cần lọc được những người này không? | Khách | §5.1 |
| Q7 | "Cả tháng này" so với cả tháng trước (giống HubSpot) nên đầu tháng con số luôn giảm mạnh. Khách có muốn so cùng số ngày (01/10 – 01/10 với 01/09 – 01/09) không? Nếu có thì sửa F14-S1 §3.3 | Khách | §6 |
| Q8 | Script chuyển Leads có lấy được ngày tạo lead gốc để ghi `lead_created_at` không? Không lấy được thì thẻ contact sẽ có một cột vọt lên ở ngày chuyển đổi | BE (spike chuyển đổi) | §9 |

---

## Liên kết

- Plan: `00-PLAN-viet-spec.md`
- Spec nền: `ERPMini/features/features/F14-S1-api-tong-hop-bao-cao.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` §5.2, §5.4, §5.10, §5.12
- Khung: `CRM-01-khung-danh-sach-trang-chi-tiet.md` §4.5, §4.6
- Design system: `../DESIGN-SYSTEM-HUBSPOT.md` §2.3, §2.5, §6.16, §7.3
- Đối chiếu: `../DOI-CHIEU-CHUC-NANG.md` §16

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-10-01 | v1.0 — bản đầu | TTS (qua Claude) |
| 2026-10-01 | v1.1 — sửa theo review: thẻ hoạt động bỏ cuộc họp Huỷ/Đổi lịch/Không đến cho khớp `$happenedAt`; thẻ 3 pipeline dùng `buckets`; thẻ 7 dùng `include`; thẻ contact tính theo ngày tạo lead gốc; link tiêu đề thẻ deal lọc Ngày đóng; chip và dòng so sánh ghi rõ kỳ; trạng thái 429, chờ 500 ms khi đổi bộ lọc; xuất dashboard ghi rõ tệp ZIP; Q6–Q8 | TTS (qua Claude) |
| 2026-10-01 | v1.2 — §2 vị trí mục Báo cáo trên sidebar theo DS-HUBSPOT §5 (nhóm menu ERP, sau Media), không phải ngay sau Sales (phát hiện khi viết CRM-10) | TTS (qua Claude) |

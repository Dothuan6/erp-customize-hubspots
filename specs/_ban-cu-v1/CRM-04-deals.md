# CRM-04 — Deals

> **Trạng thái:** 💡 Proposed · v1.1 · 30/09/2026 · chờ review
> **Tính năng sở hữu (15):** D-01 → D-15
> **Phụ thuộc:** `CRM-00` §5.4, §5.5 (dữ liệu) · `CRM-01` (khung) · `F03-S1` · `F03-S2` (Ngày hoạt động gần nhất, Hoạt động tiếp theo, Liên hệ gần nhất) · `F03-S3` (sự kiện "Hoạt động Deal") · `CRM-05` (cửa sổ soạn hoạt động) · `CRM-06` (card Line items)
> **Prototype:** `crm-giao-dich-hubspot.html` (danh sách, board) · `crm-record-hubspot.html?type=deal&id=r013` (trang chi tiết) · `crm-shared.js`
> **Nguồn HubSpot:** portal 247428660, màn Deals, khảo sát 24/09 và 29/09/2026 (`DOI-CHIEU-CHUC-NANG.md` §8, §9, §13)

---

## 1. Phạm vi

Deals khác Contacts và Companies ở ba điểm: dùng collection **có sẵn** `Deals_Pipeline` với 10 workflow đang chạy; có board kèm tổng tiền; có line items. Cơ chế chung ở `CRM-01`.

| ID | Tính năng | Ưu tiên | Phạm vi sheet | Mục |
|---|---|---|---|---|
| D-01 | Header và pipeline | P0 | Chỉ FE | §3.1 |
| D-02 | Bộ lọc nhanh | P0 | Chỉ FE | §3.2 |
| D-03 | Cột mặc định | P0 | ERP có sẵn | §3.3 |
| D-04 | Cột Hoạt động tiếp theo | P1 | FE + BE | §3.4 |
| D-05 | Mở rộng dòng | P1 | Chỉ FE | §3.5 |
| D-06 | Thẻ board | P0 | Chỉ FE | §4.1 |
| D-07 | Chân cột board | P1 | ERP có sẵn | §4.2 |
| D-08 | Kéo thả đổi giai đoạn | P0 | ERP có sẵn | §4.3 |
| D-09 | Tạo deal | P0 | FE + BE | §5 |
| D-10 | Thẻ định danh | P0 | Chỉ FE | §6.1 |
| D-11 | Về Deal này | P0 | ERP có sẵn | §6.2 |
| D-12 | Sự kiện Hoạt động Deal | P1 | FE + BE | §6.3 |
| D-13 | Card bên phải | P0 | Chỉ FE | §6.4 |
| D-14 | Workflow và Quản lý trường | P1 | ERP có sẵn | §6.5 |
| D-15 | Nhiều pipeline | P2 | FE + BE | §3.1 (chưa làm) |

"ERP có sẵn" nghĩa là chức năng đã có trên ERP hoặc chỉ tính từ trường đã có; spec chỉ cần giữ cho giao diện mới không làm mất chức năng đó, và có AC hồi quy.

Ba mục sheet ghi "ERP có sẵn" nhưng thực tế cần BE làm thêm. Spec xếp lại như sau và đề nghị sửa cột Phạm vi trong sheet:

| ID | Sheet ghi | Cần làm thêm | Nên ghi |
|---|---|---|---|
| D-03 | ERP có sẵn | Script đặt lại vị trí trường (§2.3) | FE + BE (script) |
| D-07 | ERP có sẵn | API tổng theo nhóm trên toàn bộ dữ liệu khớp bộ lọc (§7.1) | FE + BE |
| D-08 | ERP có sẵn | Kéo thả đã có; sự kiện "Hoạt động Deal", `stage_changed_at`, `closed_at` là mới (F03-S3, CRM-00 §5.4.2) | FE + BE |

**Phụ thuộc F03-S2 (đợt 3).** Ba trường tính `last_activity_at`, `next_activity_at`, `last_contacted_at` do F03-S2 cung cấp. Khi F03-S2 chưa xong: bộ lọc nhanh "Ngày hoạt động gần nhất" ẩn (CRM-01 §4.5), cột "Hoạt động tiếp theo" không có trong cột mặc định và danh sách "+", dòng "Liên hệ gần nhất" không hiện trong card "Về Deal này". Các AC liên quan ghi rõ "khi F03-S2 đã xong".

---

## 2. Cấu hình đối tượng

### 2.1 Giá trị cấu hình

| Thuộc tính | Giá trị |
|---|---|
| `collection` | `Deals_Pipeline` (slug thật chờ BE xác nhận; spec viết `deals_pipeline`) |
| `label` | Deal / Deals |
| `icon` | `handshake` |
| `displayField` | `m_deal` (Mã Deal). Tên Deal hiện dòng phụ |
| `avatar` | `icon` (biểu tượng bắt tay) |
| `views` | `all` "Tất cả deals" · `mine` "Deals của tôi" · view đã lưu trên ERP |
| `searchFields` | `m_deal`, `t_n_deal` |
| `quickFilters` | `owner_id` (Sale phụ trách) · `_createdAt` (Ngày tạo) · `last_activity_at` · `ng_y_d_ki_n_ch_t` |
| `quickFiltersMore` | `giai_o_n_pipeline` · `g_i_d_ch_v_m_c_ti_u` · `th_i_h_n_thanh_to_n` · `l_do_th_t_b_i` · trường tự tạo |
| `futureDateFields` | `ng_y_d_ki_n_ch_t` (có thêm mốc tương lai, CRM-01 §4.5) |
| `columns` | §2.2 |
| `columnOrder` | `field` (§2.3) |
| `defaultSort` | `_createdAt`, giảm dần |
| `expand` | `jn:crm_deal_contacts` "Contacts" · `field:company_id` "Companies" |
| `board` | cột theo `giai_o_n_pipeline`; thẻ ở §4.1 |
| `defaultMode` | `board` |
| `createFields` | §5 |
| `createAssociations` | `field:company_id` (Company) · `jn:crm_deal_contacts` (Contacts) |
| `keyProps` | "Về Deal này": §6.2 |
| `rightCards` | `jn:crm_deal_contacts` · `field:company_id` · `ref:crm_line_items.deal_id` (card Line items, CRM-06). Card Tệp đính kèm luôn nằm cuối, do `attachmentField` bật |
| `overviewTab` | `false` (trang Deal chỉ có tab Hoạt động) |
| `actions` | Kích hoạt Workflow · Quản lý trường dữ liệu · vạch ngăn · Theo dõi · Xem tất cả thuộc tính · Xem lịch sử thuộc tính · Xem lịch sử liên kết · vạch ngăn · Nhân bản · Gộp · Xoá |
| `attachmentField` | `attachments` |

"Deals của tôi" là view hệ thống mới. View người dùng đã lưu trên ERP cho Deals_Pipeline giữ nguyên và hiện thành tab (CRM-01 §4.3).

### 2.2 Cột mặc định (D-03)

Cột chính là **Mã Deal**. Các cột mặc định theo thứ tự:

| # | Cột | Trường |
|---|---|---|
| 1 | Mã Deal (cột chính) | `m_deal` |
| 2 | Tên Deal | `t_n_deal` |
| 3 | Giai đoạn | `giai_o_n_pipeline` |
| 4 | Amount | `t_ng_cash_in_d_ki_n` (tên hiển thị trên ERP: "Tổng Cash-In Dự Kiến") |
| 5 | Ngày dự kiến chốt | `ng_y_d_ki_n_ch_t` |
| 6 | Sale phụ trách | `owner_id` |
| 7 | Hoạt động tiếp theo | `next_activity_at` + `next_activity_id` (§3.4) |
| 8 | Ngày tạo | trường hệ thống |

Các trường còn lại thêm bằng nút "+" (CRM-01 §4.7).

### 2.3 Thứ tự cột theo thứ tự trường

Sheet ghi D-03 là "ERP có sẵn" với ghi chú "thứ tự cột theo thứ tự trường ERP". Trên ERP hiện tại, thứ tự cột của bảng Deals_Pipeline là thứ tự trường trong Quản lý trường, không kéo đổi riêng theo view (`DOI-CHIEU-CHUC-NANG.md` §9.2). Spec giữ quy tắc đó cho Deals bằng `columnOrder: "field"` (CRM-01 §4.7). Contacts và Companies là collection mới nên dùng `columnOrder: "view"` như HubSpot. Việc hai màn sắp cột khác nhau là câu hỏi Q1.

Để cột mặc định ra đúng thứ tự ở §2.2, script khởi tạo đặt vị trí các trường của Deals_Pipeline như sau (vị trí 1 là trên cùng trong Quản lý trường):

| Vị trí | Trường | Ghi chú |
|---|---|---|
| 1 | `m_deal` | Giữ |
| 2 | `t_n_deal` | Giữ |
| 3 | `giai_o_n_pipeline` | Chuyển từ vị trí 6 lên |
| 4 | `t_ng_cash_in_d_ki_n` | Chuyển từ vị trí 9 lên |
| 5 | `ng_y_d_ki_n_ch_t` | Chuyển từ vị trí 13 lên |
| 6 | `owner_id` | Mới |
| 7 | `next_activity_at` | Mới, trường tính |
| 8 | `company_id` | Mới |
| 9 | `g_i_d_ch_v_m_c_ti_u` | |
| 10 | `th_i_h_n_thanh_to_n` | |
| 11 | `t_l_th_nh_c_ng` | |
| 12 | `l_do_th_t_b_i` | |
| 13 | `ph_thu_tr_tr_c` | |
| 14 | `ph_kh_i_t_o_setup` | |
| 15 | `s_ti_n_gi_m_gi` | |
| 16 | `l_do_gi_m` | |
| 17 | `use_line_items_amount` | Mới |
| 18 | `last_activity_at` | Mới, trường tính |
| 19 | `last_contacted_at` | Mới, trường tính |
| 20 | `ng_y_c_p_nh_t_g_n_nh_t` | |
| 21 | `stage_changed_at` | Mới |
| 22 | `closed_at` | Mới |
| 23 | `attachments` | Mới |
| 24 | `next_activity_id` | Mới, trường tính, ẩn khỏi danh sách "+" |
| 25 | `line_items_total` | Mới, trường tính (CRM-06) |
| 26 | `line_items_version` | Mới, hệ thống, ẩn khỏi danh sách "+" |
| 27 | `test` | Chờ xoá (CRM-00 §9) |
| 28 | `sale_ph_tr_ch` | Ngừng dùng, ẩn (CRM-00 §8.1) |
| 29 | `lead_id` | Ngừng dùng, ẩn (CRM-00 §8.2) |

Trường hệ thống `_createdAt` (Ngày tạo) không nằm trong Quản lý trường; với `columnOrder: field`, cột trường hệ thống luôn đứng sau mọi trường thường, theo thứ tự Ngày tạo, Ngày sửa.

Đổi vị trí trường không đổi dữ liệu và không ảnh hưởng workflow (workflow tham chiếu theo key). Việc này vẫn phải ghi vào bảng rà workflow của CRM-00 §9 để người vận hành biết.

---

## 3. Danh sách

### 3.1 Header và pipeline (D-01, D-15)

- Tiêu đề "Deals ⌄", menu ⋮ (Import · Export · Kết nối Google Sheet · Ghim vào sidebar · Chỉnh sửa thuộc tính), như CRM-01 §4.2.
- Nút split "Thêm deals ▾": bấm chữ mở panel tạo (§5); ▾ có "Tạo mới" và "Import". Thay cho hai nút "Tạo mới" và "Import" riêng của ERP hiện tại.
- Trên thanh công cụ, sau nút Sắp xếp, có nút **"Deals_Pipeline ⌄"**. Menu liệt kê pipeline; hiện chỉ có một mục "Deals_Pipeline" đang chọn.
- **D-15 (nhiều pipeline) chưa làm** trong giai đoạn này: cần trường Pipeline và danh mục giai đoạn theo từng pipeline (CRM-00 §5.4.2 giữ chỗ key `pipeline`). Menu không hiện mục "sắp có" để tránh hứa trước với khách.

### 3.2 Bộ lọc nhanh (D-02)

- Mặc định bốn nút: Sale phụ trách · Ngày tạo · Ngày hoạt động gần nhất · Ngày dự kiến chốt.
- Ngày dự kiến chốt có thêm bốn mốc tương lai: Ngày mai · Tuần sau · Tháng sau · 30 ngày tới (CRM-01 §4.5).
- ⊕ thêm được: Giai đoạn · Gói dịch vụ · Thời hạn thanh toán · Lý do thất bại · trường tự tạo.
- **Bộ lọc nâng cao** là bộ lọc điều kiện đang có của ERP, giữ nguyên chức năng (CRM-01 §4.6). Bộ lọc đã lưu trong các view hiện có không bị mất.

### 3.3 Cột (D-03)

| Cột | Hiển thị |
|---|---|
| Mã Deal | Biểu tượng + mã dạng link, nút mở rộng, nút "Xem trước" |
| Tên Deal | Chữ thường |
| Giai đoạn | Pill màu theo thứ tự lựa chọn; "5. Closed Won" xanh lá, "6. Closed Lost" đỏ (DS-HUBSPOT §6.8) |
| Amount | Canh phải, `1.240.000.000 ₫` |
| Ngày dự kiến chốt | `dd/mm/yyyy`. Quá ngày mà deal còn mở: chữ màu cảnh báo kèm biểu tượng |
| Sale phụ trách | Như owner ở CRM-02 §3.3 |
| Hoạt động tiếp theo | §3.4 |
| Ngày tạo | `dd/mm/yyyy HH:mm` |

Sửa tại chỗ theo CRM-01 §4.7. Riêng:

- **Amount** chỉ sửa tại chỗ được khi `use_line_items_amount = false` hoặc deal chưa có line item. Ngược lại ô chỉ đọc, rê chuột hiện "Tính từ line items" (CRM-06, L-11).
- Trường **Test** (Liên kết → NhanVien) chỉ sửa được ở trang chi tiết, giữ đúng hành vi ERP hiện tại (`DOI-CHIEU-CHUC-NANG.md` §1).

### 3.4 Cột Hoạt động tiếp theo (D-04)

- Giá trị lấy từ `next_activity_at` và `next_activity_id` (F03-S2): hoạt động gần nhất trong số **task chưa xong** (theo hạn, kể cả task đã quá hạn) và **cuộc họp sắp tới** (theo giờ bắt đầu; định nghĩa ở CRM-00 §5.4.2), gắn với deal này.
- Giá trị đổi theo thời gian thực: cuộc họp vừa qua giờ bắt đầu thì không còn là "tiếp theo". F03-S2 phải tính lại theo lịch, không chỉ khi hoạt động thay đổi; đó là phần việc của F03-S2, ghi ở đây để khỏi sót.
- Hiển thị:
  - Task: biểu tượng task + "Task · {dd/mm}" (ví dụ "Task · 03/10"). Task quá hạn thêm nhãn "Quá hạn" màu lỗi.
  - Cuộc họp: biểu tượng lịch + "Họp · {dd/mm}".
  - Rê chuột: "{tiêu đề} — hạn {dd/mm/yyyy}" hoặc "{tiêu đề} — {dd/mm/yyyy HH:mm}".
  - Bấm: mở trang chi tiết deal ở tab Hoạt động (`?tab=activities`).
- Không có hoạt động tiếp theo: nút **"Lên lịch ▾"**, menu hai mục "Lên lịch cuộc họp" và "Tạo task". Chọn mục nào thì mở cửa sổ soạn tương ứng (CRM-05) **ngay trên màn danh sách**, đã gắn deal này. Lưu xong ô cập nhật.
- Cột không sắp xếp được trong giai đoạn này (cột ghép từ hai trường tính). Lọc được theo `next_activity_at` ở bộ lọc nâng cao.
- Khi F03-S2 chưa xong: cột ẩn khỏi cấu hình mặc định.

### 3.5 Mở rộng dòng (D-05)

| Kênh | Cột của bảng con |
|---|---|
| Contacts | Tên (link) · Email · Vai trò (tag) |
| Companies | Tên công ty (link) · Domain · Số điện thoại |

Kênh Companies là liên kết một giá trị nên bảng con có tối đa một dòng.

---

## 4. Board

Mặc định mở ở Board (`defaultMode: board`), cột theo Giai đoạn Pipeline. Người dùng đổi "Cột theo" sang trường Lựa chọn đơn khác được (CRM-01 §4.10, chức năng ERP có sẵn).

### 4.1 Thẻ deal (D-06)

Từ trên xuống:

1. Mã Deal dạng link (mở trang chi tiết).
2. Tên Deal, chữ nhạt.
3. Công ty (biểu tượng toà nhà) dạng link, nếu có.
4. Ngày tạo (biểu tượng lịch có dấu tick).
5. Ngày dự kiến chốt (biểu tượng lịch), nếu có.
6. Amount in đậm (biểu tượng tiền), nếu có.
7. Sale phụ trách (biểu tượng người), nếu có.
8. Chân thẻ (có viền trên): nút Ghi chú · nút Task (mở cửa sổ soạn trên màn board) · chữ Hoạt động tiếp theo như §3.4, hoặc "— | Chưa có lịch" khi không có.

Thẻ **không** hiện tỷ lệ thành công; tỷ lệ chỉ dùng ở chân cột (`DOI-CHIEU-CHUC-NANG.md` §13). Thẻ deal đã thắng / đã thua không cần badge riêng vì đã nằm trong cột Won / Lost.

### 4.2 Chân cột (D-07)

Mỗi cột có chân hai dòng:

| Dòng | Công thức | Hiển thị |
|---|---|---|
| Tổng giá trị | Σ Amount của mọi deal trong cột (theo bộ lọc hiện tại) | "{tổng} ₫ \| Tổng giá trị", định dạng tiền như bảng (§3.3) |
| Giá trị có trọng số | Σ (Amount × Tỷ lệ thành công ÷ 100) của mọi deal trong cột | "{tổng trọng số} ₫ ({p}%) \| Giá trị có trọng số", với p = làm tròn (tổng trọng số ÷ tổng giá trị × 100). Tổng giá trị bằng 0 thì p = 0 |

- Amount trống tính là 0. Tỷ lệ thành công trống tính là 0.
- Cột "5. Closed Won" hiện "Thắng (100%)" thay cho dòng trọng số; cột "6. Closed Lost" hiện "Thua (0%)". Chỉ đổi cách hiển thị, **không** đổi dữ liệu Tỷ lệ thành công của deal.
- Biểu tượng ⓘ ở dòng trọng số có tooltip "Tổng Cash-In Dự Kiến × Tỷ Lệ Thành Công (%) của từng deal".
- Khi "Cột theo" không phải Giai đoạn Pipeline: vẫn hiện Tổng giá trị và trọng số, không có dòng "Thắng / Thua".
- Tổng tính **ở server trên toàn bộ deal khớp bộ lọc**, không cộng trên các thẻ đã tải (mỗi cột chỉ tải 20 thẻ đầu, CRM-01 §4.10). API ở §7.1.

### 4.3 Kéo thả đổi giai đoạn (D-08)

- Kéo thẻ sang cột khác cập nhật `giai_o_n_pipeline` (chức năng ERP có sẵn).
- BE ghi sự kiện "Hoạt động Deal" (F03-S3) lên timeline của deal, và lan sang Contacts, Company của deal (§6.3).
- BE ghi `stage_changed_at`; vào hoặc ra khỏi Won/Lost thì ghi hoặc xoá `closed_at` (CRM-00 §5.4.2).
- Chân cột nguồn và cột đích cập nhật lại sau khi lưu.
- Lưu lỗi: thẻ quay về cột cũ, hiện lỗi (CRM-01 §4.10).
- Kéo vào "6. Closed Lost" **không** bắt nhập Lý do thất bại trong giai đoạn này (câu hỏi Q3).

---

## 5. Tạo deal (D-09)

Panel phải theo CRM-01 §6, tiêu đề "Tạo Deal". Mở từ ba nơi: nút "Thêm deals" trên header, "+ Thêm → Tạo mới" ở card Deals của Contact (CRM-02 §5.6), và ở card Deals của Company (CRM-03 §5.5).

### 5.1 Trường

| # | Trường | Key | Kiểu ô | Mặc định | Ràng buộc |
|---|---|---|---|---|---|
| 1 | Tên Deal | `t_n_deal` | Ô nhập | Theo nơi mở (§5.3) | Bắt buộc |
| 2 | Pipeline | — | Chọn, khoá | Deals_Pipeline | Chỉ hiển thị |
| 3 | Giai đoạn Pipeline | `giai_o_n_pipeline` | Chọn | 1. MQL Qualified | Bắt buộc |
| 4 | Amount (Tổng Cash-In Dự Kiến) | `t_ng_cash_in_d_ki_n` | Ô tiền | — | ≥ 0 |
| 5 | Ngày dự kiến chốt | `ng_y_d_ki_n_ch_t` | Chọn ngày | — | |
| 6 | Sale phụ trách | `owner_id` | Chọn nhân viên | Theo nơi mở (§5.3) | Chỉ nhân viên đang làm việc |
| 7 | Gói dịch vụ mục tiêu | `g_i_d_ch_v_m_c_ti_u` | Chọn | — | |
| 8 | Thời hạn thanh toán | `th_i_h_n_thanh_to_n` | Chọn | — | |
| 9 | Tỷ lệ thành công (%) | `t_l_th_nh_c_ng` | Ô số | — | 0–100 |

Dưới các ô trên có link **"Thêm trường khác"** mở ra mọi trường nhập tay còn lại của Deals_Pipeline (Phí thuê trả trước, Phí khởi tạo, Số tiền giảm giá, Lý do giảm, Lý do thất bại, trường tự tạo…). Form tạo bản ghi của ERP hiện có đủ 17 trường; link này giữ chức năng đó mà không làm panel dài.

Tên Deal và Giai đoạn Pipeline bắt buộc **trên panel**. Khảo sát 23/09 không ghi hai trường này có cờ Bắt buộc trên ERP (BA cần kiểm lại). Nếu không có, API và nhập file vẫn tạo được deal thiếu chúng; spec không tự bật cờ vì có thể làm hỏng workflow hoặc job nhập đang chạy. Việc bật cờ để khách quyết sau khi rà (CRM-00 §9).

**Mã Deal** không có trong panel. BE sinh mã khi tạo (§5.2). Sau khi tạo, toast hiện "Đã tạo DEAL-0021 “Dược phẩm Thiên Phúc - Deal mới”" kèm link mở deal.

### 5.2 Sinh Mã Deal

- Khi request tạo không gửi `m_deal`, BE sinh mã dạng `DEAL-{n}` với `n` là số tăng dần, đệm 0 cho đủ 4 chữ số (`DEAL-0021`; từ 10.000 trở đi không đệm).
- `n` lấy từ một bộ đếm riêng của collection, tăng **nguyên tử**, để hai người tạo cùng lúc không bị trùng mã. Giá trị khởi đầu = số lớn nhất trong các Mã Deal dạng `DEAL-{n}` đang có + 1; mã cũ không theo dạng này được giữ nguyên và bỏ qua khi tính (CRM-00 §8.4).
- Request gửi sẵn `m_deal` (nhập file, API) thì dùng giá trị đó; trùng mã có sẵn thì trả `409`. Mã gửi sẵn có dạng `DEAL-{n}` với `n` lớn hơn hoặc bằng giá trị kế tiếp của bộ đếm thì BE nâng bộ đếm lên `n + 1` trong cùng giao dịch, để mã sinh sau này không đụng mã vừa nhập.
- `m_deal` cần cờ Duy nhất trên ERP. Cờ chỉ bật sau khi dữ liệu cũ đã hết mã trùng và mã rỗng (CRM-00 §8.4).
- F03 chưa có bộ đếm nguyên tử (F03 §MVP Excluded "Atomic counter"). Việc này **cần BE xác nhận** trước khi làm (câu hỏi Q2). Nếu chưa làm được, phương án tạm: panel có ô Mã Deal bắt buộc, kiểm trùng khi rời ô.

### 5.3 Điền sẵn theo nơi mở

| Nơi mở | Tên Deal | Company | Contacts | Sale phụ trách |
|---|---|---|---|---|
| Header "Thêm deals" | Trống | Trống, chọn được | Trống, chọn được | Nhân viên gắn với tài khoản đang đăng nhập |
| Card Deals của Contact | "{Công ty chính} - Deal mới", không có công ty thì "{full_name} - Deal mới" | Công ty chính của contact, sửa được | Contact đó, khoá; vai trò trống | Owner của contact; không có thì như header |
| Card Deals của Company | "{name} - Deal mới" | Công ty đó, khoá | Contact của công ty, tick sẵn tối đa 20 (xem dưới), bỏ tick được | Owner của công ty; không có thì như header |

- Owner của contact hoặc công ty đang "Tạm nghỉ" hay "Đã nghỉ" thì ô Sale phụ trách để trống, dưới ô ghi "Owner hiện tại {tên} không còn làm việc", vì ô chỉ cho chọn nhân viên đang làm việc.
- Tick sẵn contact của công ty: tối đa 20 contact, những contact có công ty này là công ty chính trước, sau đó theo thời điểm liên kết mới nhất. Công ty có hơn 20 contact thì dưới danh sách ghi "Còn {n} contact của công ty chưa được chọn" và ô tìm để thêm. Giới hạn này giữ request dưới mức 50 liên kết của F03-S1 §4.7.

### 5.4 Mục "Liên kết Deal với"

- **Company**: chọn một công ty có tìm (kênh một giá trị).
- **Contacts**: danh sách có ô tìm để thêm contact, mỗi dòng có ô Vai trò (D-LABEL-DC, không bắt buộc) và nút gỡ.
- Gửi bằng F03-S1 §4.7: deal và liên kết ghi trong một giao dịch. BE ghi sự kiện "Đã tạo" lên deal và lan sang Company, Contacts đã gắn (F03-S3 §3.3).

### 5.5 Sau khi tạo

- Mở từ header: ở lại danh sách hoặc board; deal mới hiện ở cột giai đoạn đã chọn.
- Mở từ card: card Deals của contact / company cập nhật; nếu tạo từ Company, card Deals của từng contact đã tick cũng có deal mới.
- `use_line_items_amount` mặc định `true` (CRM-00 §5.4.2). Amount nhập lúc tạo được giữ cho đến khi deal có line item đầu tiên được lưu (CRM-06).

---

## 6. Trang chi tiết

Bố cục CRM-01 §5. Cột giữa chỉ có tab **Hoạt động** (CRM-05); Deal không có tab Tổng quan.

### 6.1 Thẻ định danh (D-10)

- Biểu tượng bắt tay thay cho avatar.
- Tiêu đề: **Mã Deal**. Dòng nhỏ ngay dưới: Tên Deal.
- Nút ✎ khi rê chuột: popover một ô "Tên Deal". **Mã Deal không đổi được**; popover ghi dòng nhỏ "Mã Deal là mã định danh, không đổi được."
- Các dòng phụ:
  - **Amount:** giá trị in đậm, bấm để sửa tại chỗ (Enter lưu, Esc huỷ). Khi deal có line item và `use_line_items_amount = true`, ô chỉ đọc, rê chuột hiện "Tính từ line items" (cùng quy tắc với bảng, §3.3). Panel "Xem tất cả thuộc tính" (CRM-01 §5.3) áp cùng quy tắc khoá này cho Amount. Máy chủ cũng từ chối ghi Amount qua mọi đường khác trong trạng thái này (`422 AMOUNT_LOCKED`, F03-S2 §6.4).
  - **Ngày dự kiến chốt:** nút có biểu tượng lịch, bấm mở bộ chọn ngày, chọn là lưu. Có nút "Xoá ngày".
  - **Pipeline:** tag "Deals_Pipeline".
  - **Giai đoạn:** pill giai đoạn, bấm mở popover danh sách giai đoạn (dạng pill, giai đoạn hiện tại có dấu tick). Chọn giai đoạn khác là lưu ngay, có hiệu ứng như kéo thả trên board (§4.3).
- Sáu nút nhanh và menu Thao tác theo CRM-01, với menu theo `actions` ở §2.1.

### 6.2 Về Deal này (D-11)

Card thuộc tính chính tên "Về Deal này". Ánh xạ từ card "About this deal" của HubSpot sang trường ERP:

| HubSpot | Trường ERP | Key | Sửa tại chỗ |
|---|---|---|---|
| Deal owner | Sale phụ trách | `owner_id` | Có |
| Last contacted | Liên hệ gần nhất | `last_contacted_at` | Không (trường tính, F03-S2) |
| Deal type | Gói dịch vụ mục tiêu | `g_i_d_ch_v_m_c_ti_u` | Có |
| Priority | Thời hạn thanh toán | `th_i_h_n_thanh_to_n` | Có |
| — | Tỷ lệ thành công (%) | `t_l_th_nh_c_ng` | Có, 0–100 |
| Closed lost reason | Lý do thất bại | `l_do_th_t_b_i` | Có |

Ánh xạ "Priority → Thời hạn thanh toán" không cùng nghĩa; đó là lựa chọn giữ vị trí trường trong card cho giống HubSpot, dùng trường ERP có sẵn. Amount không nằm trong card này vì đã sửa được ở thẻ định danh (§6.1), đúng như sheet D-10.

"Liên hệ gần nhất" cần F03-S2 (đợt 3). Khi F03-S2 chưa xong, dòng này không hiện; card còn 5 trường.

### 6.3 Sự kiện Hoạt động Deal (D-12)

Cấu hình F03-S3 cho Deals_Pipeline (F03-S3 §3.1):

- `giai_o_n_pipeline` là trường `stage`, tiêu đề sự kiện "Hoạt động Deal".
- `owner_id` và `t_ng_cash_in_d_ki_n` sinh sự kiện "Thay đổi thuộc tính".
- Sự kiện `created` và `stage_changed` lan sang Contacts (`jn:crm_deal_contacts`) và Company (`field:company_id`).

Câu hiển thị:

- Đổi giai đoạn: "**Hoạt động Deal** — {người thực hiện} đã chuyển {Mã Deal} từ “{giai đoạn cũ}” sang “{giai đoạn mới}”."
- Tạo: "**Đã tạo** — Deal này được tạo bởi {người thực hiện}" trên trang Deal; "{người thực hiện} đã tạo Deal {Mã Deal}" trên trang Contact, Company.

Sự kiện hiện ở timeline tab Hoạt động (CRM-05) trong nhóm "Cập nhật", lọc được theo loại "Hoạt động Deal".

### 6.4 Card bên phải (D-13)

Theo thứ tự:

1. **Contacts (n)** — kênh `jn:crm_deal_contacts`. Thẻ: tên (link), tên công ty chính của contact (chữ nhạt), "Email:" kèm ⧉, "Số điện thoại:", vai trò (tag) hoặc "Thêm nhãn liên kết". Menu ⋯: Sửa vai trò · Gỡ liên kết. "+ Thêm": Tạo mới (panel tạo Contact, CRM-02 §4, Deal điền sẵn và khoá, Company điền sẵn bằng Company của deal) · Thêm có sẵn (chọn nhiều, ô vai trò chung).
2. **Companies (0 hoặc 1)** — kênh `field:company_id`. Thẻ: tên (link), "Domain:" kèm ↗ ⧉, "Số điện thoại:". Không có tag Primary (deal chỉ có một công ty). Menu ⋯: Đổi công ty · Gỡ liên kết. Khi đã có công ty, "+ Thêm" đổi thành "Đổi" và hỏi trước khi thay (CRM-01 §5.6).
3. **Line items** — CRM-06.
4. **Tệp đính kèm** — CRM-01 §5.7.

### 6.5 Workflow và Quản lý trường (D-14)

Hai chức năng ERP có sẵn, đặt trên cùng menu Thao tác:

- **Kích hoạt Workflow**: mở hộp chọn trong các workflow đang bật có thể chạy thủ công trên Deals_Pipeline (ERP hiện có 10), bấm "Kích hoạt" để chạy cho deal này. Chạy xong hoặc lỗi hiện toast theo cơ chế đang có của ERP.
- **Quản lý trường dữ liệu**: mở trang Quản lý trường của Deals_Pipeline.

Người không có quyền chạy workflow hoặc sửa cấu trúc collection thì mục tương ứng ẩn.

---

## 7. API cần thêm

### 7.1 Tổng theo nhóm cho board

Board cần số thẻ và tổng tiền của **toàn bộ** deal trong mỗi cột, trong khi mỗi cột chỉ tải 20 thẻ đầu.

Đây là API của tầng dữ liệu F03 và dùng cho mọi board (CRM-01 §4.10). Đặc tả đặt tạm ở đây vì Deals là màn đầu tiên cần tổng tiền; khi có spec nền cho board hoặc F14-S1, phần này chuyển sang đó và giữ nguyên hợp đồng.

```
GET /api/v1/collections/:slug/group-summary
    ?groupBy=giai_o_n_pipeline
    &sumField=t_ng_cash_in_d_ki_n
    &weightField=t_l_th_nh_c_ng
    &filter[...]=...&batch=...   (cùng tham số lọc với danh sách)
```

```json
{
  "status": "success",
  "data": [
    { "value": "1. MQL Qualified", "count": 12, "sum": 540000000, "weightedSum": 54000000 },
    { "value": "5. Closed Won",    "count": 4,  "sum": 612000000, "weightedSum": 612000000 },
    { "value": null,               "count": 3,  "sum": 0,         "weightedSum": 0 }
  ]
}
```

- `groupBy` bắt buộc, phải là trường Lựa chọn đơn.
- Nhận đủ tham số lọc của API danh sách: `filter` (kể cả `linked_to_me` của F03-S1 §4.10 và điều kiện `_or … contains` mà ô tìm kiếm sinh ra, CRM-01 §4.4), `batch` (F03-S3 §6.3). Kết quả luôn khớp với danh sách cùng tham số.
- Lỗi: `groupBy` thiếu hoặc không phải Lựa chọn đơn → `400 GROUP_BY_INVALID`; `sumField` hoặc `weightField` không phải Số/Tiền tệ → `400 SUM_FIELD_INVALID`; trường không tồn tại → `404 FIELD_NOT_FOUND`.
- `count` luôn có. `sum` chỉ có khi gửi `sumField` (trường Số hoặc Tiền tệ). `weightedSum` = Σ(`sumField` × `weightField` ÷ 100), chỉ có khi gửi cả hai; giá trị trống tính là 0.
- Dòng `value: null` là số bản ghi trống trường nhóm, dùng cho dòng "… bản ghi chưa có … không hiển thị trên board" (CRM-01 §4.10).
- Chỉ đếm bản ghi người gọi đọc được.
- Contacts, Companies chỉ cần `count`.
- Câu hỏi Q4: API Kanban hiện có của ERP đã trả số thẻ mỗi cột chưa.

---

## 8. Quy tắc nghiệp vụ

- **Giai đoạn chỉ đổi khi người dùng đổi** (kéo thả, chọn ở thẻ định danh, sửa ô, workflow người dùng cấu hình). Không có tự động đổi giai đoạn trong spec này.
- Đổi giai đoạn **không** tự đổi Tỷ lệ thành công. Chân cột Won/Lost chỉ đổi cách hiển thị (§4.2).
- `closed_at`, `stage_changed_at` do BE ghi (CRM-00 §5.4.2).
- Xoá deal (xoá mềm): line item và điều chỉnh cấp Deal bị xoá theo; dòng nối Deal – Contact, Activity – Deal bị xoá theo (F03-S1 §3.4). Khôi phục thì khôi phục đủ.
- Nhân bản deal: mở panel Tạo Deal điền sẵn mọi trường nhập tay (trừ Mã Deal), Company, Contacts và vai trò; **không** sao chép line item, hoạt động, tệp (CRM-01 §5.3).
- Workflow đang chạy trên Deals_Pipeline không bị ảnh hưởng bởi thay đổi giao diện. Ảnh hưởng do thay đổi dữ liệu (`sale_ph_tr_ch`, `lead_id`) xử lý theo CRM-00 §8, §9.

---

## 9. Quyền

Theo CRM-01 §7, cộng:

| Thao tác | Điều kiện |
|---|---|
| Kích hoạt Workflow | Quyền chạy workflow thủ công trên Deals_Pipeline (theo cơ chế ERP hiện có) |
| Quản lý trường dữ liệu | `collection.update_schema` trên Deals_Pipeline |

---

## 10. Tiêu chí nghiệm thu

**AC-D01-1 — Header**
Given người dùng có quyền tạo và nhập deal
When mở Deals
Then có tiêu đề "Deals ⌄", nút "Thêm deals ▾" với Tạo mới và Import, không còn hai nút Tạo mới / Import riêng; thanh công cụ có nút "Deals_Pipeline ⌄".

**AC-D01-2 — Một pipeline**
Given ERP chỉ có Deals_Pipeline
When mở menu "Deals_Pipeline ⌄"
Then chỉ có một mục Deals_Pipeline đang chọn, không có mục "sắp có".

**AC-D02-1 — Bộ lọc nhanh**
Given view "Tất cả deals" chưa chỉnh
When nhìn hàng bộ lọc nhanh
Then có Sale phụ trách, Ngày tạo, Ngày hoạt động gần nhất (khi F03-S2 đã xong), Ngày dự kiến chốt.

**AC-D02-2 — Mốc tương lai cho Ngày chốt**
Given hôm nay 30/09/2026
When chọn "Ngày dự kiến chốt ▾ → 30 ngày tới"
Then còn các deal có ngày chốt từ 30/09 đến 29/10; bộ lọc Ngày tạo không có mốc "30 ngày tới".

**AC-D02-3 — Bộ lọc nâng cao giữ chức năng ERP**
Given một view Deals đã lưu trên ERP với điều kiện "Gói Dịch Vụ Mục Tiêu Bằng PROFESSIONAL"
When mở view đó
Then điều kiện vẫn áp dụng và hiện trong "Bộ lọc nâng cao (1)".

**AC-D03-1 — Cột mặc định theo thứ tự trường**
Given script khởi tạo đã đặt vị trí trường theo §2.3
When mở dạng bảng của view "Tất cả deals"
Then cột theo thứ tự Mã Deal, Tên Deal, Giai đoạn, Amount, Ngày dự kiến chốt, Sale phụ trách, Hoạt động tiếp theo (khi F03-S2 đã xong), Ngày tạo.

**AC-D03-2 — Không kéo đổi thứ tự cột theo view**
Given hộp "Chỉnh sửa cột" của Deals
When nhìn danh sách cột đang hiện
Then không kéo đổi thứ tự được và có dòng "Đổi thứ tự trong Quản lý trường".

**AC-D04-1 — Hoạt động tiếp theo**
Given F03-S2 đã xong; DEAL-013 có task chưa xong hạn 30/09 và cuộc họp 02/10
When xem cột Hoạt động tiếp theo
Then hiện "Task · 30/09"; rê chuột hiện tiêu đề task và hạn.

**AC-D04-2 — Lên lịch từ danh sách**
Given DEAL-004 không có hoạt động tiếp theo
When bấm "Lên lịch ▾ → Tạo task", nhập tiêu đề, hạn 03/10, lưu
Then ô của DEAL-004 đổi thành "Task · 03/10" mà không rời màn danh sách.

**AC-D04-3 — Task quá hạn**
Given task chưa xong hạn 25/09, hôm nay 30/09
When xem cột
Then hiện "Task · 25/09" kèm nhãn "Quá hạn".

**AC-D05-1 — Mở rộng dòng**
Given DEAL-013 có 2 contact (Hạnh – Người quyết định, Bảo – không vai trò) và công ty Thiên Phúc
When mở rộng dòng chọn Contacts, rồi chọn Companies
Then lần đầu bảng con có 2 dòng kèm vai trò; lần sau có 1 dòng Thiên Phúc.

**AC-D06-1 — Thẻ board**
Given DEAL-013 có công ty, ngày chốt, amount, sale phụ trách, task sắp tới
When xem thẻ trên board
Then thẻ có đủ 8 phần theo thứ tự §4.1 và không có tỷ lệ thành công.

**AC-D06-2 — Ghi chú từ thẻ**
Given thẻ DEAL-013
When bấm nút Ghi chú ở chân thẻ, nhập nội dung, lưu
Then ghi chú được tạo gắn DEAL-013 và các contact, công ty của nó (CRM-05), vẫn đứng ở màn board.

**AC-D07-1 — Tổng theo cột trên toàn bộ dữ liệu**
Given cột "1. MQL Qualified" có 25 deal (board chỉ tải 20 thẻ), tổng Amount 1.000.000.000 ₫, tổng trọng số 150.000.000 ₫
When nhìn chân cột
Then hiện "1.000.000.000 ₫ | Tổng giá trị" và "150.000.000 ₫ (15%) | Giá trị có trọng số".

**AC-D07-2 — Cột Won/Lost**
Given board theo Giai đoạn Pipeline
When nhìn chân cột "5. Closed Won" và "6. Closed Lost"
Then dòng thứ hai lần lượt là "Thắng (100%)" và "Thua (0%)"; Tỷ lệ thành công trong dữ liệu các deal đó không đổi.

**AC-D07-3 — Tổng theo bộ lọc**
Given bộ lọc Sale phụ trách = Lan Lê
When nhìn chân cột
Then tổng chỉ tính deal của Lan Lê.

**AC-D08-1 — Kéo thả**
Given DEAL-013 ở "3. Demo Scheduled"
When kéo sang "4. Proposal Sent"
Then Giai đoạn là "4. Proposal Sent"; chân cả hai cột cập nhật; timeline DEAL-013, Thiên Phúc, Hạnh, Bảo đều có sự kiện "Hoạt động Deal".

**AC-D08-2 — Kéo vào Won**
Given DEAL-013 đang mở
When kéo vào "5. Closed Won"
Then `closed_at` được ghi; kéo ngược về "4. Proposal Sent" thì `closed_at` bị xoá.

**AC-D09-1 — Tạo deal độc lập**
Given người dùng gắn với nhân viên Minh Trần
When "Thêm deals → Tạo mới", nhập Tên Deal "Gói Pro cho An Khang", chọn Company "Thực phẩm An Khang", thêm Contact "Phan Văn Tài" vai trò "Người ảnh hưởng", bấm Tạo
Then deal được tạo với Mã Deal do hệ thống sinh, Giai đoạn "1. MQL Qualified", Sale phụ trách Minh Trần; có trong card Deals của An Khang và của Phan Văn Tài với vai trò đúng.

**AC-D09-2 — Hai người tạo cùng lúc không trùng mã**
Given hai người cùng bấm Tạo deal trong cùng một giây
When cả hai request thành công
Then hai deal có Mã Deal khác nhau.

**AC-D09-3 — Tên Deal bắt buộc**
Given panel Tạo Deal
When xoá trống Tên Deal
Then nút Tạo vô hiệu, cạnh nút ghi "Còn 1 trường bắt buộc chưa nhập".

**AC-D09-4 — Thêm trường khác**
Given panel Tạo Deal
When bấm "Thêm trường khác"
Then hiện thêm các trường nhập tay còn lại của Deals_Pipeline, gồm Phí thuê trả trước, Phí khởi tạo, Số tiền giảm giá, Lý do giảm, Lý do thất bại.

**AC-D10-1 — Mã Deal không đổi được**
Given trang chi tiết DEAL-013
When bấm ✎
Then popover chỉ có ô Tên Deal và dòng "Mã Deal là mã định danh, không đổi được."

**AC-D10-2 — Đổi giai đoạn và ngày chốt tại chỗ**
Given trang chi tiết DEAL-013
When bấm pill giai đoạn chọn "4. Proposal Sent", rồi bấm ngày chốt chọn 15/10/2026
Then hai giá trị được lưu ngay; timeline có sự kiện "Hoạt động Deal"; lịch sử thuộc tính có dòng đổi ngày chốt.

**AC-D10-3 — Sửa Amount ở thẻ định danh**
Given DEAL-013 chưa có line item
When bấm Amount trên thẻ định danh, nhập 250000000, Enter
Then Amount hiện "250.000.000 ₫", timeline có sự kiện "Thay đổi thuộc tính" của Amount. Khi DEAL-013 đã có line item và đang dùng tổng line item, bấm Amount không vào chế độ sửa.

**AC-D11-1 — Về Deal này**
Given trang chi tiết deal
When nhìn card "Về Deal này"
Then có đúng các trường Sale phụ trách, Liên hệ gần nhất (chỉ đọc, chỉ khi F03-S2 đã xong), Gói dịch vụ mục tiêu, Thời hạn thanh toán, Tỷ lệ thành công (%), Lý do thất bại; không có Amount; giá trị giống bảng dữ liệu ERP.

**AC-D12-1 — Hoạt động Deal hiện trên Contact và Company**
Given DEAL-013 liên kết Thiên Phúc và Hạnh
When Minh Trần đổi giai đoạn DEAL-013 từ "3. Demo Scheduled" sang "4. Proposal Sent"
Then timeline của Hạnh và Thiên Phúc có "Hoạt động Deal — Minh Trần đã chuyển DEAL-013 từ “3. Demo Scheduled” sang “4. Proposal Sent”."

**AC-D12-2 — Sự kiện tạo**
Given tạo deal từ card Deals của Hạnh
When mở timeline của Hạnh
Then có sự kiện "{người tạo} đã tạo Deal {Mã Deal}".

**AC-D13-1 — Card bên phải**
Given trang chi tiết DEAL-013
When nhìn cột phải
Then có theo thứ tự card Contacts (kèm vai trò), Companies (một công ty, không tag Primary), Line items, Tệp đính kèm.

**AC-D13-2 — Đổi công ty của deal**
Given DEAL-013 thuộc Thiên Phúc
When ở card Companies chọn ⋯ → Đổi công ty → Titan Bases, xác nhận
Then DEAL-013 thuộc Titan Bases; card Deals của Thiên Phúc không còn DEAL-013.

**AC-D14-1 — Kích hoạt Workflow**
Given có workflow đang bật chạy được trên Deals_Pipeline
When Thao tác → Kích hoạt Workflow → chọn một workflow → Kích hoạt
Then workflow chạy cho DEAL-013 như trên ERP hiện tại.

**AC-D14-2 — Quản lý trường**
Given người dùng có quyền sửa cấu trúc
When Thao tác → Quản lý trường dữ liệu
Then mở trang Quản lý trường của Deals_Pipeline.

**AC-D15-1 — Nhiều pipeline chưa làm**
Given giai đoạn này
When rà màn Deals
Then không có chức năng tạo hay chuyển pipeline; key `pipeline` không được dùng cho trường nào khác.

---

## 11. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-CRM04-01 | API | `group-summary` không có `sumField` | Chỉ trả `count` |
| TC-CRM04-02 | API | `group-summary` với `groupBy` là trường Văn bản | 400 GROUP_BY_INVALID |
| TC-CRM04-03 | API | Deal có Amount trống, Tỷ lệ 50 | Góp 0 vào `sum` và `weightedSum` |
| TC-CRM04-04 | API | Tạo deal gửi sẵn `m_deal` đã tồn tại | 409 |
| TC-CRM04-05 | API | Bộ đếm Mã Deal khi deal lớn nhất là DEAL-0120 | Deal tiếp theo là DEAL-0121 |
| TC-CRM04-05b | API | Nhập file có deal `m_deal = DEAL-0500` khi bộ đếm đang ở 121, rồi tạo deal mới từ giao diện | Deal mới là DEAL-0501 |
| TC-CRM04-06 | API | 50 request tạo deal đồng thời | 50 mã khác nhau, liên tiếp |
| TC-CRM04-07 | E2E | Sửa Amount tại chỗ khi deal có line item và `use_line_items_amount = true` | Ô không vào chế độ sửa, tooltip "Tính từ line items" |
| TC-CRM04-08 | E2E | Sửa trường Test tại ô bảng | Không vào chế độ sửa; ở trang chi tiết thì sửa được |
| TC-CRM04-09 | E2E | Board "Cột theo" đổi sang Gói dịch vụ | Chân cột có Tổng giá trị và trọng số, không có "Thắng/Thua" |
| TC-CRM04-10 | E2E | Kéo thẻ khi API lỗi | Thẻ về cột cũ, chân cột không đổi |
| TC-CRM04-11 | E2E | Tạo deal từ Company có 3 contact, bỏ tick 1 | Deal có 2 contact |
| TC-CRM04-12 | E2E | Tạo deal từ Contact không có công ty | Tên mặc định "{full_name} - Deal mới", Company trống |
| TC-CRM04-12b | E2E | Tạo deal từ Company có 35 contact | Tick sẵn 20 contact, contact có công ty này là công ty chính đứng đầu; dòng "Còn 15 contact của công ty chưa được chọn" |
| TC-CRM04-12c | E2E | Tạo deal từ Contact có owner "Đã nghỉ" | Sale phụ trách trống, có dòng "Owner hiện tại … không còn làm việc" |
| TC-CRM04-13 | E2E | Nhân bản DEAL-013 | Panel tạo điền sẵn trường, Company, Contacts, vai trò; Mã Deal trống; line item không được sao chép |
| TC-CRM04-14 | E2E | Ngày dự kiến chốt đã qua, deal còn mở | Ô ngày có màu cảnh báo |
| TC-CRM04-15 | E2E | Xoá deal có 2 line item rồi khôi phục | Line item mất rồi trở lại |
| TC-CRM04-16 | E2E | Board 390 px | Cột rộng 82% màn hình, cuộn ngang được; chân cột vẫn đọc được |
| TC-CRM04-17 | Hồi quy | Chạy từng workflow trong 10 workflow sau khi đổi vị trí trường | Kết quả như trước khi đổi |

---

## 12. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Mã Deal sinh ở FE bằng số lượng deal + 1 | BE sinh bằng bộ đếm nguyên tử (§5.2) |
| Tạo deal từ Contact tự gán vai trò "Người quyết định" | Vai trò trống |
| Tạo deal từ Company gắn mọi contact, không bỏ chọn được | Tick sẵn, bỏ tick được |
| Chân cột cộng trên dữ liệu đã tải ở trình duyệt | API `group-summary` trên toàn bộ dữ liệu khớp bộ lọc |
| Hoạt động tiếp theo tính ở FE mỗi lần vẽ | Trường tính `next_activity_at`, `next_activity_id` (F03-S2) |
| Sự kiện "Hoạt động Deal" ghi ở FE, gắn contact đang liên kết | BE ghi, lan theo cấu hình (F03-S3) |
| Owner là chuỗi `sale_ph_tr_ch` | `owner_id` |
| Liên kết Deal lưu ở `dealLinks` | `company_id` và `crm_deal_contacts` |
| Card Companies trên Deal có tag "Primary" | Không có tag (một công ty) |
| Tỷ lệ thành công mặc định 10 khi tạo từ card | Để trống |
| Bộ lọc, cột ẩn, bề rộng cột lưu `localStorage` | Bộ lọc, cột ẩn, bề rộng cột lưu trong View của ERP; mật độ bảng lưu theo người dùng (F03-S4) |

---

## 13. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | Deals giữ quy tắc "thứ tự cột = thứ tự trường" (sheet D-03) trong khi Contacts, Companies cho kéo đổi thứ tự theo view. Chấp nhận khác nhau, hay cho Deals kéo đổi luôn? | PO / khách | §2.3, CRM-01 §4.7 |
| Q2 | BE làm được bộ đếm nguyên tử để sinh Mã Deal không? Nếu chưa, dùng phương án ô Mã Deal bắt buộc | BE | §5.2 |
| Q3 | Kéo vào "6. Closed Lost" có cần bắt nhập Lý do thất bại không? | Khách | §4.3 |
| Q4 | API Kanban hiện có của ERP đã trả số bản ghi mỗi cột chưa? Nếu có, `group-summary` chỉ cần bổ sung tổng tiền | BE | §7.1 |
| Q5 | Ánh xạ "Priority → Thời hạn thanh toán" trong card "Về Deal này" có hợp với khách không, hay bỏ vị trí đó? | Khách | §6.2 |

---

## Liên kết

- Plan: `00-PLAN-viet-spec.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` §5.4, §8, §9
- Khung: `CRM-01-khung-danh-sach-trang-chi-tiet.md`
- Contacts: `CRM-02-contacts.md` · Companies: `CRM-03-companies.md`
- Liên kết bản ghi: `ERPMini/features/features/F03-S1-lien-ket-ban-ghi.md`
- Nhật ký & sự kiện: `ERPMini/features/features/F03-S3-nhat-ky-thay-doi-su-kien.md`
- Đối chiếu chức năng: `../DOI-CHIEU-CHUC-NANG.md` §8, §9, §13

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-09-30 | v1.0 — bản đầu | TTS (qua Claude) |
| 2026-09-30 | v1.1 — theo đợt 3: §2.3 thêm vị trí `line_items_total`, `line_items_version`; §6.1 khoá Amount ở máy chủ (F03-S2 §6.4); §10 nói rõ cột, bề rộng lưu trong View | TTS (qua Claude) |

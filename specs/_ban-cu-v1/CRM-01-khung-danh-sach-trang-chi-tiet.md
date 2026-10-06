# CRM-01 — Khung danh sách và trang chi tiết dùng chung

> **Trạng thái:** 💡 Proposed · v1.3 · 01/10/2026 · chờ review
> **Tính năng sở hữu (11):** C-03, C-04, C-05, C-07, C-08, C-10, C-11, C-12, C-15, C-17, C-22
> **Phục vụ:** toàn bộ tính năng danh sách và trang chi tiết của CRM-02 Contacts, CRM-03 Companies, CRM-04 Deals, CRM-08 Sales
> **Phụ thuộc:** `CRM-00` (dữ liệu) · `F03-S1` (liên kết) · `F03-S2` (trường tính, cho bộ lọc "Ngày hoạt động gần nhất") · `F03-S3` (lịch sử, theo dõi) · `F03-S4` (lưu cấu hình view theo người dùng) · `F03-S5` (gộp, thao tác hàng loạt lớn) · `DESIGN-SYSTEM-HUBSPOT.md`
> **Prototype:** `crm-contacts-hubspot.html`, `crm-companies-hubspot.html`, `crm-giao-dich-hubspot.html` (danh sách) · `crm-record-hubspot.html?type=contact|company|deal&id=` (trang chi tiết) · code dùng chung `crm-list.js`, `crm-objects.js`, `crm-shared.js`
> **Nguồn HubSpot:** portal 247428660, màn Contacts / Companies / Deals, khảo sát 28–29/09/2026 (`DOI-CHIEU-CHUC-NANG.md` §11–13)

---

## 1. Phạm vi

Contacts, Companies và Deals dùng **cùng một khung** danh sách và cùng một khung trang chi tiết, chỉ khác cấu hình (cột nào, bộ lọc nào, card nào). File này đặc tả phần giống nhau. Ba spec đối tượng (CRM-02, CRM-03, CRM-04) chỉ điền cấu hình theo mẫu ở §3 và mô tả phần riêng.

Tính năng trong sheet được gán cho file này (sheet ghi dưới phân hệ Contacts vì Contacts là màn làm đầu tiên, nhưng cả ba đối tượng đều dùng):

| ID | Tính năng | Ưu tiên | Mục |
|---|---|---|---|
| C-03 | Tìm kiếm, bộ lọc, sắp xếp | P0 | §4.4 |
| C-04 | Bộ lọc nhanh dạng popover | P0 | §4.5 |
| C-05 | Bộ lọc nâng cao | P1 | §4.6 |
| C-07 | Mở rộng dòng | P1 | §4.8 |
| C-08 | Xem trước | P1 | §4.9 |
| C-10 | Cài đặt view | P1 | §4.11 |
| C-11 | Thao tác hàng loạt | P1 | §4.12 |
| C-12 | Footer danh sách | P2 | §4.13 |
| C-15 | Nút hành động nhanh | P0 | §5.2 |
| C-17 | Menu Thao tác | P1 | §5.3 |
| C-22 | Card Tệp đính kèm | P2 | §5.7 |

**Ngoài phạm vi file này:** nội dung cột, bộ lọc mặc định, board, panel tạo, thẻ định danh và card riêng của từng đối tượng (CRM-02 → CRM-04); cửa sổ soạn hoạt động và timeline (CRM-05); card Trường bổ sung (CRM-09); tuỳ biến bố cục trang chi tiết kiểu nút "Customize" của HubSpot (không có trong sheet, không làm).

### 1.1 Chức năng ERP hiện có phải giữ

Giai đoạn 1 đã chốt "chức năng = 100% ERP". Giai đoạn 2 đổi sang UX HubSpot nhưng **không bỏ** chức năng nào ERP đang có trên màn danh sách (`DOI-CHIEU-CHUC-NANG.md` §2). Bảng dưới cho biết mỗi chức năng cũ nằm ở đâu trong khung mới.

| Chức năng ERP hiện có | Vị trí trong khung mới |
|---|---|
| View đã lưu (tạo, sửa, xoá; loại Danh sách/Kanban) | Hàng tab view (§4.3), menu ⚙ (§4.11) |
| Tìm kiếm | Ô tìm kiếm (§4.4) |
| Bộ lọc điều kiện theo kiểu trường | Bộ lọc nâng cao (§4.6) |
| Sắp xếp theo cột (tăng → giảm → bỏ) | Tiêu đề cột và nút Sắp xếp (§4.4) |
| Ẩn/hiện cột, kéo đổi bề rộng cột | Nút "+" và hộp "Chỉnh sửa cột" (§4.7) |
| Sửa ô tại chỗ | Giữ nguyên (§4.7) |
| Mật độ Thoáng / Gọn | Menu ⚙ (§4.11) |
| Chọn nhiều → Xoá | Thanh hàng loạt (§4.12) |
| Import, Export, Kết nối Google Sheet | Menu ⋮ ở header (cả ba); Import còn ở nút "Thêm … ▾"; Export còn ở footer |
| Làm mới, phân trang, đếm bản ghi | Footer (§4.13) |
| Ghim vào sidebar | Menu ⋮ ở header |
| Mở drawer chi tiết | Xem trước (§4.9) |
| Kanban chọn trường làm cột, kéo thả đổi giá trị | Board (§4.10) |

---

## 2. Nơi triển khai trong code

Tên file theo `DESIGN-SYSTEM-HUBSPOT.md` §8 (ánh xạ màn ERP). Khung CRM là **các component dùng chung của màn Dữ liệu** đổi theo theme `data-brand="crm"`, không phải một bộ màn riêng.

Collection không thuộc CRM cũng dùng khung này khi bật theme, nhưng không có cấu hình §3: danh sách dùng cột và bộ lọc mặc định của ERP; cột phải của trang chi tiết hiện danh sách liên kết chung (F03-S1 §7 mục 3) thay cho các card theo `rightCards`.

**Từ ngữ dùng trong file này**

| Từ | Nghĩa |
|---|---|
| Panel phải | Khung trượt từ mép phải, rộng 460 px (DS-HUBSPOT §6.10) |
| Scrim | Lớp nền tối mờ phủ phía sau panel hoặc hộp thoại; bấm vào scrim thì đóng |
| Dock | Panel nằm cố định trong vùng nội dung, bảng co lại nhường chỗ, không có scrim |
| Nút split | Nút chia hai phần: bấm chữ làm hành động chính, bấm ▾ mở menu lựa chọn khác |
| Segmented | Nhóm nút liền nhau, chọn một (ví dụ Bảng / Board) |
| Toast | Thông báo ngắn góc màn hình, tự ẩn sau vài giây |
| Pill | Nhãn màu bo góc hiển thị giá trị lựa chọn (DS-HUBSPOT §6.8) |

| Phần | File hiện có | Việc làm |
|---|---|---|
| Danh sách | `features/data/RecordListView.tsx` | Dựng theo template T1 |
| Bảng | `features/data/RecordTableView.tsx` | Cột chính dính trái, nút mở rộng, Xem trước, cột "+" |
| Board | `features/data/RecordKanbanView.tsx` | Thẻ theo cấu hình đối tượng |
| Bộ lọc | `features/data/RecordFilterBar.tsx` | Tách thành `QuickFilterBar` (mới) + panel bộ lọc nâng cao giữ logic cũ |
| View đã lưu | `features/data/SavedViewsMenu.tsx` | Hiển thị dạng tab |
| Trang chi tiết | `features/data/RecordDetailPage.tsx` | Template T2, 3 cột |
| Drawer | `features/data/RecordDetailDrawer.tsx` | Thành panel Xem trước (dock) |
| Tạo bản ghi | `features/data/RecordCreateModal.tsx` | Modal → panel phải |
| Component mới | `components/ui/PropertyList.tsx`, `AssociationCard`, `ObjectHeader`, `QuickFilterBar`, `OptionPill` | Theo DS-HUBSPOT §6.2, §6.5, §6.8, §6.9a, §6.9b |

Style không đặc tả lại ở đây. Mọi kích thước, màu, bo góc lấy từ DS-HUBSPOT theo **tên component**.

---

## 3. Cấu hình đối tượng

Mỗi đối tượng CRM khai báo một cấu hình theo mẫu dưới. Khung đọc cấu hình này để dựng màn. Viết dạng TypeScript để rõ kiểu; tên thuộc tính là đề xuất cho FE, có thể đổi khi code nhưng phải giữ đủ ý.

```ts
interface CrmObjectConfig {
  collection: string;                 // slug, ví dụ 'crm_contacts'
  label: { one: string; many: string };      // 'Contact' / 'Contacts'
  icon: string;                       // Material Symbols, ví dụ 'person'
  displayField: string;               // key dùng làm tên bản ghi, ví dụ 'full_name'
  avatar: 'initials' | 'logo' | 'icon';

  views: SystemView[];                // view hệ thống, xem §4.3
  searchFields: string[];             // trường ô tìm kiếm quét, §4.4
  quickFilters: string[];             // bộ lọc nhanh mặc định, theo thứ tự
  quickFiltersMore: string[];         // thêm được bằng ⊕
  futureDateFields?: string[];        // trường ngày có thêm mốc tương lai, §4.5
  columns: string[];                  // cột mặc định sau cột chính
  columnsMore: string[];              // thêm được bằng "+"
  columnOrder: 'view' | 'field';      // ai quyết định thứ tự cột, §4.7
  defaultSort: { field: string; dir: 'asc' | 'desc' };
  expand: { associationId: string; label: string }[];   // mở rộng dòng, §4.8
  board?: { field: string; card: string[] };            // trường làm cột và nội dung thẻ, §4.10
  defaultMode: 'table' | 'board';

  createFields: string[];             // trường trong panel tạo, §6
  createAssociations: string[];       // associationId hiện ở mục "Liên kết với"
  identity: { subtitle: string[] };   // dòng phụ dưới tên, §5.2
  keyProps: { title: string; fields: string[] };        // card thuộc tính chính, §5.4
  rightCards: string[];               // associationId theo thứ tự card bên phải, §5.6
  overviewTab: boolean;               // có tab Tổng quan (Catch-up) hay không
  actions: ActionKey[];               // mục trong menu Thao tác, §5.3
  attachmentField?: string;           // key trường Tệp đính kèm, §5.7
}
```

Giá trị cụ thể cho từng đối tượng nằm ở §2 của CRM-02, CRM-03, CRM-04.

---

## 4. Trang danh sách

### 4.1 Bố cục

Theo template T1 của DS-HUBSPOT §7.1, từ trên xuống:

1. Header đối tượng (`ObjectHeader`)
2. Hàng tab view
3. Thanh công cụ
4. Thanh bộ lọc nhanh (thu gọn được)
5. Thanh hàng loạt (chỉ hiện khi có dòng được chọn)
6. Bảng hoặc board; panel Xem trước dock bên phải khi mở
7. Footer

**Mọi trạng thái của danh sách lưu vào URL query**: view đang chọn, từ khoá, bộ lọc nhanh, bộ lọc nâng cao, sắp xếp, chế độ bảng/board, "Cột theo", trang. Gửi link cho đồng nghiệp là họ thấy đúng cùng danh sách (với quyền của họ). Nút Back của trình duyệt quay về trạng thái trước.

**Tham số `?batch=<id>`.** Link trong thông báo gộp của một thao tác hàng loạt (F03-S3 §6.3) mở danh sách với tham số này. Danh sách chỉ hiện các bản ghi thuộc lần thao tác đó (API lọc theo F03-S3 §6.3). Trên thanh bộ lọc nhanh hiện một nút đặc biệt "Thao tác hàng loạt lúc 14:05 30/09 ✕"; bấm ✕ bỏ tham số. Tham số này không lưu vào view khi bấm Lưu hay Nhân bản view.

### 4.2 Header

- Tiêu đề là **nút** "Contacts ⌄". Bấm mở menu chuyển sang Contacts, Companies, Deals, và "Dữ liệu khác…" (về trang Dữ liệu của ERP).
- Cạnh tiêu đề: số bản ghi của view hiện tại theo trạng thái **đã lưu** của view, không tính những thay đổi chưa lưu (từ khoá, bộ lọc vừa thêm). Footer cho biết số bản ghi sau khi áp thay đổi (§4.13).
- Menu ⋮: Import · Export · Kết nối Google Sheet · Ghim vào sidebar · Chỉnh sửa thuộc tính (mở trang Quản lý trường của collection; tên mục theo sheet C-01). Mục nào người dùng không có quyền thì ẩn.
- Nút chính dạng split "Thêm contacts ▾": bấm phần chữ mở panel tạo (§6); bấm ▾ chọn "Tạo mới" hoặc "Import".

### 4.3 Tab view

- Hàng tab hiện các view hệ thống của đối tượng (cấu hình `views`) rồi các view người dùng đã lưu. View hệ thống không sửa, không xoá được.
- View hệ thống có ba loại dùng lại được:

| Mã | Tên ví dụ | Điều kiện |
|---|---|---|
| `all` | Tất cả contacts | Không lọc |
| `mine` | Contacts của tôi | `owner_id` dùng toán tử `linked_to_me` (F03-S1 §4.10, CRM-00 §6.3) |
| `unassigned` | Contacts chưa có owner | `owner_id` rỗng |

- View `mine` rỗng vì tài khoản chưa nối với nhân viên nào: hiện trạng thái rỗng với câu "Tài khoản của bạn chưa được gắn với nhân viên nào nên chưa có bản ghi 'của tôi'. Liên hệ quản trị viên để gắn."
- Nút "+" cuối hàng: tạo view mới từ trạng thái hiện tại (tên view, chia sẻ cho mọi người hay chỉ mình). Dùng cơ chế View sẵn có của ERP (F03 `View`: bộ lọc, sắp xếp, cột, `isShared`).
- Khi người dùng đổi bộ lọc, sắp xếp hoặc cột trên một view đang mở, view **không tự lưu**. Tab hiện dấu chấm "đã thay đổi". Footer có "Khôi phục view" (về trạng thái đã lưu) và "Nhân bản view" (lưu trạng thái hiện tại thành view mới, mặc định riêng tư). Người tạo view hoặc người có quyền quản lý view chung thấy thêm nút "Lưu" trong menu ⚙.
- Tab tràn chiều ngang thì cuộn ngang; menu "Tất cả view" ở cuối liệt kê đủ.

### 4.4 Tìm kiếm, sắp xếp (C-03)

**Ô tìm kiếm**

- Phím tắt `/` đưa con trỏ vào ô (trừ khi đang gõ trong ô nhập khác).
- Tìm trên các trường trong `searchFields` của đối tượng (ví dụ Contacts: `full_name`, `email`, `phone`), khớp chứa chuỗi, không phân biệt hoa thường.
- Gửi truy vấn sau khi ngừng gõ 300 ms. Chuyển thành bộ lọc F03 dạng `_or` các điều kiện `contains`.
- Kết hợp VÀ với mọi bộ lọc khác đang bật.
- Xoá hết chữ thì bỏ điều kiện tìm.

**Nút Bộ lọc** trên thanh công cụ ẩn/hiện thanh bộ lọc nhanh (nút ⌃ cuối thanh làm cùng việc). Trạng thái ẩn/hiện nhớ theo người dùng.

**Sắp xếp**

- Nút "Sắp xếp" mở popover: chọn trường (danh sách các cột đang hiện và `columnsMore`) và chiều tăng/giảm.
- Bấm tiêu đề cột: tăng → giảm → bỏ sắp xếp (giữ hành vi ERP hiện có).
- Chỉ sắp xếp một trường tại một thời điểm.
- Mặc định theo `defaultSort` của đối tượng (Contacts, Companies: Ngày tạo giảm dần).
- Trường tính (ví dụ Ngày hoạt động gần nhất) sắp xếp được vì F03-S2 lưu giá trị tính vào bản ghi. Cột lấy qua liên kết (ví dụ "Công ty chính") **không** sắp xếp được trong giai đoạn này: tiêu đề cột không có mũi tên, menu cột không có mục sắp xếp.

### 4.5 Bộ lọc nhanh (C-04)

**Hiển thị.** Một hàng các nút chữ đậm có ▾, theo thứ tự `quickFilters` của đối tượng. Ví dụ Contacts: *Contact owner ▾ · Ngày tạo ▾ · Ngày hoạt động gần nhất ▾ · Lead status ▾*. Sau đó là nút ⊕, nút ✎ và "Bộ lọc nâng cao (n)".

Nút đang có giá trị đổi nền và hiện giá trị ngắn gọn: "Owner: Minh Trần, Lan Lê", "Ngày tạo: 30 ngày qua". Quá 2 giá trị thì hiện "Lead status: 3 giá trị".

**Popover theo kiểu trường**

| Kiểu trường | Nội dung popover | Giá trị lọc |
|---|---|---|
| Liên kết tới NhanVien (owner) | Ô tìm + danh sách nhân viên thuộc đội kinh doanh (`is_sales`, CRM-08 §3.1) có checkbox. Mục đầu "(Chưa có owner)". Ba nhóm theo thứ tự: Đang làm việc · Tạm nghỉ · Đã nghỉ; hai nhóm sau có nhãn trạng thái | Nhiều giá trị, nối HOẶC |
| Lựa chọn đơn | Ô tìm (khi > 7 lựa chọn) + checkbox các lựa chọn dạng pill. Mục cuối "(Trống)" | Nhiều giá trị, nối HOẶC |
| Ngày, Ngày giờ | Danh sách mốc thời gian (bảng dưới) + "Tuỳ chọn…" mở hai ô Từ – Đến | Một khoảng |
| Văn bản | Ô nhập + chọn "Chứa" / "Bằng" | Một điều kiện |
| Số | Chọn "Bằng" / "Lớn hơn" / "Nhỏ hơn" + ô nhập | Một điều kiện |

Hộp kiểm, Người dùng, Tiền tệ, Văn bản dài, Đường dẫn (thường gặp ở trường tuỳ chỉnh): CRM-09 §8.

Nút trong popover: "Xoá" (bỏ bộ lọc này) và "Áp dụng". Với kiểu checkbox, tick là áp dụng ngay, không cần bấm Áp dụng; "Áp dụng" chỉ cần cho khoảng ngày tuỳ chọn và kiểu văn bản/số.

**Mốc thời gian.** Tính theo múi giờ Asia/Ho_Chi_Minh. Tuần bắt đầu thứ Hai. Cột "Đến" ghi 23:59 cho dễ đọc; khi gửi API, điều kiện là **trước 00:00 của ngày kế tiếp**, để không sót bản ghi tạo trong giây cuối cùng của ngày.

| Mã | Mốc | Từ | Đến |
|---|---|---|---|
| `today` | Hôm nay | 00:00 hôm nay | 23:59 hôm nay |
| `yesterday` | Hôm qua | 00:00 hôm qua | 23:59 hôm qua |
| `week` | Tuần này | 00:00 thứ Hai tuần này | 23:59 Chủ nhật tuần này |
| `lastweek` | Tuần trước | 00:00 thứ Hai tuần trước | 23:59 Chủ nhật tuần trước |
| `month` | Tháng này | 00:00 ngày 1 tháng này | 23:59 ngày cuối tháng này |
| `lastmonth` | Tháng trước | 00:00 ngày 1 tháng trước | 23:59 ngày cuối tháng trước |
| `d7` | 7 ngày qua | 00:00 của 6 ngày trước | 23:59 hôm nay |
| `d30` | 30 ngày qua | 00:00 của 29 ngày trước | 23:59 hôm nay |
| `d90` | 90 ngày qua | 00:00 của 89 ngày trước | 23:59 hôm nay |
| `quarter` | Quý này | 00:00 ngày đầu quý | 23:59 ngày cuối quý |
| `year` | Năm nay | 00:00 ngày 1/1 | 23:59 ngày 31/12 |
| `custom` | Tuỳ chọn | ngày người dùng chọn | ngày người dùng chọn |

Trường nằm trong `futureDateFields` của đối tượng (ví dụ Ngày dự kiến chốt của Deals) là ngày ở tương lai, nên popover có thêm bốn mốc, đặt trước "Tuỳ chọn":

| Mã | Mốc | Từ | Đến |
|---|---|---|---|
| `tomorrow` | Ngày mai | 00:00 ngày mai | 23:59 ngày mai |
| `nextweek` | Tuần sau | 00:00 thứ Hai tuần sau | 23:59 Chủ nhật tuần sau |
| `nextmonth` | Tháng sau | 00:00 ngày 1 tháng sau | 23:59 ngày cuối tháng sau |
| `n30` | 30 ngày tới | 00:00 hôm nay | 23:59 của 29 ngày sau |

Trường không nằm trong `futureDateFields` chỉ có các mốc ở bảng trên. Bộ lọc nâng cao (§4.6) dùng cùng danh sách mốc với bộ lọc nhanh của trường đó.

"7 ngày qua" gồm cả hôm nay (7 ngày lịch). Dòng phụ dưới mỗi mốc trong popover ghi rõ khoảng ngày thật, ví dụ "24/09 – 30/09" khi hôm nay là 30/09, để người dùng không phải đoán.

Mốc lưu vào URL và view **dưới dạng mã mốc** ở cột đầu bảng (riêng `custom` lưu hai ngày cụ thể) chứ không phải ngày tính sẵn, để view "30 ngày qua" mở vào tuần sau vẫn là 30 ngày tính từ hôm đó.

**Kết hợp.** Các giá trị trong cùng một bộ lọc nối HOẶC. Các bộ lọc khác nhau (và ô tìm kiếm, và bộ lọc nâng cao) nối VÀ.

**Thêm và sửa bộ lọc nhanh**

- ⊕ mở danh sách trường trong `quickFiltersMore` (và trường người dùng tự tạo, CRM-09) có ô tìm. Chọn một trường thì thêm nút vào cuối hàng.
- ✎ mở chế độ sửa: kéo đổi thứ tự, bấm ✕ để gỡ một nút. Bộ lọc mặc định của đối tượng gỡ được nhưng "Khôi phục view" đưa về như cũ.
- Danh sách nút bộ lọc nhanh là một phần của view (lưu cùng view khi lưu).

**"Xoá tất cả"** hiện dạng link khi có ít nhất một bộ lọc nhanh hoặc nâng cao; bỏ mọi bộ lọc, giữ view và sắp xếp.

**Phụ thuộc.** Bộ lọc "Ngày hoạt động gần nhất" cần `last_activity_at` được F03-S2 tính và lưu. Khi F03-S2 chưa xong, nút này ẩn khỏi cấu hình mặc định; không lọc ở phía FE trên dữ liệu đã tải.

### 4.6 Bộ lọc nâng cao (C-05)

- Nút "Bộ lọc nâng cao (n)" mở panel phải 460 px có scrim. `n` là số điều kiện đang bật.
- Dùng lại bộ lọc điều kiện đang có của ERP (chọn trường → điều kiện theo kiểu → giá trị). Chức năng giữ nguyên, chỉ đổi cách trình bày thành danh sách điều kiện dọc, mỗi điều kiện một thẻ có nút xoá.
- Các điều kiện nối **VÀ** (C-05). Nếu component hiện có của ERP đã hỗ trợ nhóm HOẶC thì giữ, nhưng không bắt buộc trong giai đoạn này.
- Điều kiện theo kiểu trường (giữ đúng bộ điều kiện ERP):

| Kiểu | Điều kiện |
|---|---|
| Văn bản, Văn bản dài | Chứa · Bằng · Khác · Trống · Không trống |
| Số, Tiền tệ | Bằng · Lớn hơn · Nhỏ hơn · Trống · Không trống |
| Lựa chọn đơn, Liên kết, Người dùng | Bằng · Khác · Trống · Không trống |
| Ngày, Ngày giờ | Trong khoảng (dùng cùng danh sách mốc §4.5) · Trống · Không trống |
| Hộp kiểm | Có · Không |

- Một trường đã có ở bộ lọc nhanh vẫn thêm được ở bộ lọc nâng cao; hai điều kiện nối VÀ. Panel ghi chú dưới điều kiện đó: "Trường này cũng đang được lọc ở bộ lọc nhanh."
- Nút cuối panel: "Áp dụng" · "Xoá tất cả" · "Huỷ". Đóng panel mà không bấm Áp dụng thì không đổi gì.

### 4.7 Bảng

**Cột**

- Cột checkbox (dính trái) → cột chính (dính trái, tên bản ghi) → các cột trong `columns` → cột "+".
- Cột chính: avatar (theo `avatar` của đối tượng) + tên dạng link (mở trang chi tiết) + nút mở rộng ›(§4.8) + nút "Xem trước" hiện khi rê chuột (§4.9).
- Cột "+": mở danh sách trường chưa hiện (có ô tìm), bấm để thêm cột; mục cuối "Chỉnh sửa cột…".
- Hộp "Chỉnh sửa cột" (modal lớn, DS-HUBSPOT §6.11): trái là mọi trường có ô tìm và checkbox; phải là cột đang hiện, kéo để đổi thứ tự, ✕ để bỏ. Cột chính không bỏ được. Thứ tự và bề rộng cột lưu trong view (`visibleFieldsJSON` của F03 đã có chỗ cho thứ tự và bề rộng).
- Thứ tự cột theo `columnOrder` của đối tượng:
  - `view`: như trên, người dùng kéo đổi thứ tự, lưu trong view.
  - `field`: thứ tự cột là thứ tự trường trong Quản lý trường của collection, giống màn Dữ liệu hiện nay. Cột bên phải của hộp "Chỉnh sửa cột" chỉ có ✕, không kéo được, trên đầu ghi "Thứ tự cột theo thứ tự trường. Đổi thứ tự trong Quản lý trường." (link chỉ hiện với người có quyền quản lý trường). Ẩn/hiện cột và bề rộng cột vẫn lưu trong view. Deals dùng kiểu này (CRM-04 §2.3).
- Menu tiêu đề cột (bấm vào tiêu đề hoặc ⋮ khi rê chuột): Sắp xếp tăng · Sắp xếp giảm · Lọc theo cột này (mở bộ lọc nâng cao với trường đó) · Ẩn cột · Sửa trường (đi tới Quản lý trường, chỉ người có quyền).
- Kéo mép tiêu đề để đổi bề rộng; bấm đúp mép để về mặc định (giữ hành vi ERP).

**Ô**

- Mỗi ô một dòng, quá dài cắt bằng "…", rê chuột hiện đủ (quy tắc bảng của DESIGN-SYSTEM gốc).
- Lựa chọn hiển thị dạng pill màu (`OptionPill`); owner hiển thị avatar nhỏ + tên; email có ↗ mở ứng dụng thư; tiền canh phải, định dạng `1.240.000 ₫`; ngày `dd/mm/yyyy`.
- Bấm ô để sửa tại chỗ (giữ hành vi ERP): Enter lưu, Esc huỷ, bấm ra ngoài là lưu. Lựa chọn mở popover chọn có ô tìm. Trường tính và cột lấy qua liên kết không sửa được (con trỏ bình thường, không viền khi rê).
- Lưu lỗi (ví dụ trùng email): ô trở về giá trị cũ, hiện thông báo lỗi tiếng Việt từ API.

**Phân trang**: 25 / 50 / 100 dòng mỗi trang (mặc định 25), ở footer. Không cuộn vô hạn.

### 4.8 Mở rộng dòng (C-07)

- Nút › cạnh tên bản ghi. Bấm mở popover chọn đối tượng liên kết theo `expand` của đối tượng. Ví dụ Contacts: "Companies", "Deals".
- Chọn một mục: chèn ngay dưới dòng một dòng phụ chứa bảng con các bản ghi liên kết (DS-HUBSPOT §6.6 "Dòng mở rộng"). Nút › xoay 90°.
- Bảng con hiện tối đa 5 bản ghi, mỗi bản ghi 3–4 cột tóm tắt (do spec đối tượng định nghĩa), kèm nhãn liên kết nếu có (ví dụ "Người quyết định"). Còn nhiều hơn thì có link "Xem tất cả n" mở trang chi tiết và cuộn tới card tương ứng (tham số `?card=<associationId>`, §5.1).
- Góc bảng con có "+ Thêm" mở cùng hành vi như "+ Thêm" của card liên kết (§5.6).
- Mỗi dòng chỉ mở một đối tượng liên kết tại một thời điểm; chọn đối tượng khác thì thay bảng con. Nhiều dòng mở cùng lúc được.
- Đổi trang, đổi bộ lọc hay đổi sắp xếp thì đóng mọi dòng đang mở.
- Dữ liệu lấy bằng F03-S1 §4.2 cho dòng đó, `limit=5`.
- Dòng chưa có liên kết nào: bảng con hiện "Chưa có {tên đối tượng} nào" (ví dụ "Chưa có deal nào") + "+ Thêm".

### 4.9 Xem trước (C-08)

- Nút "Xem trước" hiện khi rê chuột vào ô tên (bảng) hoặc trên thẻ (board). Trên thiết bị cảm ứng, nút hiện thường trực ở cột chính.
- Từ 1240 px trở lên: panel **dock** bên phải vùng nội dung, rộng 400 px, bảng co lại, không có scrim. Dưới 1240 px: panel phủ 460 px có scrim.
- Nội dung panel:
  1. Tên + avatar + dòng phụ như trang chi tiết; nút "Mở trang chi tiết".
  2. `PropertyList` các trường trong `keyProps` của đối tượng, sửa tại chỗ.
  3. Tóm tắt liên kết: mỗi card bên phải của trang chi tiết thu thành một dòng "Companies (1): Dược phẩm Thiên Phúc", bấm mở trang chi tiết ở card đó.
- Đang mở panel, bấm "Xem trước" của dòng khác thì panel đổi sang bản ghi đó, không đóng rồi mở lại.
- Esc hoặc nút ✕ đóng panel.
- Sửa trong panel cập nhật luôn dòng tương ứng trên bảng.

### 4.10 Board

- Chuyển bằng segmented Bảng/Board trên thanh công cụ hoặc trong menu ⚙.
- Cột là các lựa chọn của trường `board.field` theo đúng thứ tự trong danh mục. Đầu cột: tên lựa chọn + số thẻ. Deals có thêm tổng tiền (CRM-04).
- Nút "Cột theo ▾" trên thanh công cụ (chỉ hiện ở chế độ Board) cho đổi trường làm cột sang một trường Lựa chọn đơn khác của collection. Đây là chức năng Kanban có sẵn của ERP. Trường đang chọn lưu trong view như một thay đổi chưa lưu (§4.3); "Khôi phục view" đưa về `board.field`.
- Số thẻ mỗi cột và số bản ghi trống lấy từ API `group-summary` (CRM-04 §7.1), tính trên toàn bộ bản ghi khớp bộ lọc chứ không đếm thẻ đã tải. Gọi lại mỗi khi đổi bộ lọc, từ khoá, "Cột theo", hoặc sau khi kéo thẻ.
- Bản ghi có trường đó rỗng không hiện trên board (giữ hành vi ERP). Nếu có, dưới hàng cột hiện một dòng "12 bản ghi chưa có Lifecycle stage không hiển thị trên board" kèm link chuyển sang bảng đã lọc "(Trống)".
- Kéo thẻ sang cột khác: cập nhật trường ngay, thẻ ở lại cột mới. Lưu lỗi thì thẻ quay về cột cũ và hiện thông báo. Việc ghi sự kiện vào timeline do BE làm (F03-S3), FE không tự ghi.
- Mỗi cột tải 20 thẻ đầu, cuộn tới cuối cột thì tải thêm.
- Bộ lọc, tìm kiếm áp dụng cho board như cho bảng.
- Nội dung thẻ do `board.card` của đối tượng quy định.

### 4.11 Cài đặt view (C-10)

Nút ⚙ trên thanh công cụ mở menu:

- Kiểu hiển thị: Bảng / Board. Là thuộc tính của **view** (giữ chức năng view loại Danh sách/Kanban của ERP, F03 `View.viewType`). Đổi trên view đang mở là một thay đổi chưa lưu như đổi bộ lọc
- Mật độ: Thoáng (dòng 44 px) / Gọn (dòng 34 px). Là tuỳ chọn **cá nhân**, lưu theo người dùng cho từng đối tượng (F03-S4), không lưu vào view
- Chỉnh sửa cột… (§4.7)
- Lưu view (chỉ hiện với người được sửa view này, khi view có thay đổi)
- Đổi tên view · Xoá view (chỉ view người dùng tạo; xoá qua hộp xác nhận)
- Khôi phục view mặc định

"Khôi phục view mặc định" với view hệ thống đưa bộ lọc nhanh, cột, sắp xếp, mật độ về cấu hình của đối tượng. Với view người dùng, đưa về trạng thái đã lưu.

DS-HUBSPOT §6.6 bản 1.0 ghi mật độ "lưu localStorage theo bảng". Spec này đổi sang lưu theo người dùng để người dùng đổi máy vẫn giữ lựa chọn; DS-HUBSPOT đã cập nhật theo (bản 1.1).

### 4.12 Thao tác hàng loạt (C-11)

**Chọn**

- Checkbox đầu dòng chọn từng dòng. Checkbox tiêu đề chọn mọi dòng **của trang hiện tại**.
- Đã chọn cả trang và tổng số bản ghi lớn hơn một trang: thanh hàng loạt hiện thêm link "Chọn tất cả 312 bản ghi khớp bộ lọc". Chọn theo bộ lọc cần API thao tác hàng loạt theo bộ lọc của F03-S5; khi F03-S5 chưa có, link này không hiện và chỉ chọn được trong trang.
- Đổi bộ lọc, tìm kiếm hay view thì bỏ chọn hết.

**Thanh hàng loạt** thay thế thanh công cụ trong lúc có lựa chọn: "Đã chọn N" · Gán owner · Xoá · Bỏ chọn.

**Gán owner**

- Popover danh sách nhân viên đang làm việc có `is_sales` (như ô chọn owner, CRM-00 §6.2), có ô tìm, thêm mục "Bỏ owner".
- Chọn xong hiện hộp xác nhận "Gán owner Lan Lê cho 24 contact?".
- Gọi `bulk/update` của F03-S5 §3.1. Mỗi bản ghi đổi owner vẫn ghi sự kiện riêng (F03-S3).
- Tới 200 bản ghi chọn tay: chạy ngay, xong hiện "Đã gán owner cho 24 contact". Từ 201 bản ghi chọn tay (tối đa 1.000), hoặc chọn theo bộ lọc: chạy nền theo F03-S5, thanh tiến độ ở góc màn hình, xong có thông báo.
- Bản ghi người dùng không có quyền sửa bị bỏ qua; kết quả ghi rõ "Đã gán 20. Bỏ qua 4 bản ghi bạn không có quyền sửa."

**Xoá**

- Cùng ngưỡng với Gán owner, gọi `bulk/delete` của F03-S5 §3.1: tới 200 bản ghi chọn tay chạy ngay; từ 201 bản ghi (tối đa 1.000) hoặc chọn theo bộ lọc thì chạy nền.
- Hộp xác nhận nút đỏ, nhãn nêu hành động: "Xoá 24 contact".
- Nội dung: "24 contact sẽ được chuyển vào thùng rác và có thể khôi phục trong 30 ngày. Liên kết của chúng với company, deal sẽ bị gỡ theo và cũng được khôi phục khi khôi phục contact."
- Nếu API từ chối một số bản ghi (ví dụ không có quyền xoá), kết quả ghi số bản ghi đã xoá và số bị bỏ qua, như ở phần Gán owner.

### 4.13 Footer (C-12)

Trái sang phải:

- Pill đếm: "18 bản ghi". Khi view đang có thay đổi chưa lưu (từ khoá, bộ lọc vừa thêm): "Hiển thị 5 / 18 bản ghi", trong đó 18 là số của view đã lưu.
- Phân trang: chọn 25/50/100 và Trước / Sau / "Trang 2 / 8".
- Làm mới (icon): tải lại trang hiện tại, giữ mọi bộ lọc.
- Export: xuất file theo bộ lọc và cột đang hiện, chọn `.xlsx` hoặc `.csv` (chức năng ERP có sẵn, `DOI-CHIEU-CHUC-NANG.md` §2). Cần quyền `record.export`.
- Khôi phục view (icon, §4.3).
- Nhân bản view (icon, §4.3).

Nút chỉ có icon phải có tooltip và nhãn cho trình đọc màn hình.

### 4.14 Trạng thái màn

| Trạng thái | Hiển thị |
|---|---|
| Đang tải lần đầu | Skeleton 8 dòng giữ đúng cột |
| Đang tải lại (đổi bộ lọc, đổi trang) | Giữ dữ liệu cũ mờ đi, thanh tiến độ mảnh trên đầu bảng |
| Collection chưa có bản ghi | EmptyState: "Chưa có contact nào" + nút "Thêm contact" + link "Import từ file" |
| Có bộ lọc nhưng không khớp | "Không có contact nào khớp bộ lọc" + nút "Xoá tất cả bộ lọc" |
| View "của tôi" với tài khoản chưa gắn nhân viên | Câu giải thích ở §4.3 |
| Lỗi tải | Giữ header bảng, hiện Alert "Không tải được danh sách. Thử lại" kèm nút Thử lại |
| Không có quyền đọc collection | Trang thông báo "Bạn chưa có quyền xem Contacts" |

---

## 5. Trang chi tiết bản ghi

### 5.1 Bố cục

Template T2 (DS-HUBSPOT §7.2, chi tiết §6.9):

- Từ 1240 px: ba cột 320 px · giữa co giãn · 320 px.
- 905–1239 px: cột trái và giữa; cột phải xuống dưới, full width.
- Dưới 905 px: một cột theo thứ tự trái → giữa → phải.

| Cột | Nội dung |
|---|---|
| Trái | Card định danh (§5.2) · Card thuộc tính chính (§5.4) · Card Trường bổ sung (CRM-09) |
| Giữa | Tab Tổng quan (nếu `overviewTab`) · Tab Hoạt động (CRM-05) |
| Phải | Card liên kết theo `rightCards` (§5.6) · Card Tệp đính kèm (§5.7) |

URL: `/data/<slug>/records/<id>` (giữ đường dẫn hiện có của ERP). Tab giữa đang mở ghi vào query `?tab=activities` để gửi link mở thẳng tab. Tham số `?card=<associationId>` cuộn tới card liên kết tương ứng và mở nó nếu đang thu gọn.

### 5.2 Card định danh và nút hành động nhanh (C-15)

**Hàng trên cùng**: link "‹ Contacts" quay về danh sách (giữ nguyên bộ lọc lúc rời đi) · nút "Thao tác ▾" (§5.3).

**Định danh**: avatar · tên (chữ lớn) · nút ✎ hiện khi rê chuột để đổi tên (spec đối tượng quy định trường nào đổi được, ví dụ Contacts đổi họ và tên, Deals chỉ đổi Tên Deal không đổi Mã Deal) · dòng phụ theo `identity.subtitle`.

**Sáu nút nhanh** dạng tròn có nhãn: Ghi chú · Email · Gọi · Task · Họp · Thêm.

| Nút | Hành vi |
|---|---|
| Ghi chú | Mở cửa sổ soạn Ghi chú (CRM-05) |
| Email | Gửi email nằm ngoài phạm vi (A-15). Nút vẫn hiện để giữ bố cục HubSpot, ở trạng thái vô hiệu, tooltip "Gửi email chưa có trong giai đoạn này" |
| Gọi | Mở cửa sổ soạn **Ghi lại cuộc gọi**. Không gọi điện thật (A-15) |
| Task | Mở cửa sổ soạn Task |
| Họp | Mở cửa sổ soạn Cuộc họp ở chế độ **Lên lịch** (A-10) |
| Thêm | Mở menu có ô tìm (bảng dưới) |

Menu "Thêm":

| Mục | Trạng thái |
|---|---|
| Ghi lại cuộc gọi | Hoạt động |
| Ghi lại cuộc họp | Hoạt động (cuộc họp đã diễn ra) |
| Ghi lại email · Ghi lại SMS · Ghi lại WhatsApp · Ghi lại tin nhắn LinkedIn | Hiện với nhãn "Ngoài phạm vi", bấm không làm gì |
| Sắp xếp nút… | Mở hộp kéo thả thứ tự 5 nút đầu. Thứ tự lưu theo người dùng (F03-S4), áp cho cả ba đối tượng |

Quyền dùng các nút: người dùng tạo được hoạt động (`record.write` trên `crm_activities`) và đọc được bản ghi là dùng được, kể cả khi chỉ có quyền xem bản ghi. Việc gắn hoạt động vào bản ghi chỉ đọc hợp lệ theo quy tắc kế thừa của F03-S1 §6.2 (người dùng ghi được hoạt động của mình). Không tạo được hoạt động thì năm nút hoạt động vô hiệu, tooltip "Bạn chưa có quyền ghi hoạt động".

### 5.3 Menu Thao tác (C-17)

Mục theo `actions` của đối tượng, thứ tự cố định dưới đây. Đối tượng không dùng mục nào thì bỏ mục đó.

| Mục | Hành vi | Phụ thuộc |
|---|---|---|
| Theo dõi / Bỏ theo dõi | Người theo dõi là **tài khoản**, nhận thông báo trong ERP khi bản ghi đổi owner, có hoạt động mới do người khác tạo, hoặc (Deal) đổi giai đoạn. Khi owner được đặt và nhân viên đó có `tai_khoan`, tài khoản đó tự được thêm vào người theo dõi. Nhân viên chưa có tài khoản thì không ai được thêm tự động | F03-S3 (danh sách người theo dõi và phát thông báo) |
| Xem tất cả thuộc tính | Panel phải 640 px: mọi trường của bản ghi, nhóm "Thông tin chính" / "Trường khác" / "Trường bổ sung", có ô tìm, sửa tại chỗ | — |
| Xem lịch sử thuộc tính | Panel: chọn một trường → danh sách giá trị cũ, giá trị mới, ai đổi, lúc nào | F03-S3. Khi F03-S3 chưa xong, mục hiện nhãn "Sắp có" và không bấm được |
| Xem lịch sử liên kết | Panel: danh sách thêm/gỡ liên kết của bản ghi, lọc theo đối tượng | F03-S3 |
| Tìm trên Google | Mở tab mới tìm theo tên bản ghi (Contact: tên + tên công ty Primary; Company: tên + domain). Không có với Deal | — |
| *(vạch ngăn)* | | |
| Nhân bản | Contact/Company: tạo bản sao với mọi trường nhập tay **trừ** trường Duy nhất (email, domain) và trường tính. Company: `name` thêm hậu tố " (bản sao)". Contact: `first_name` thêm hậu tố " (bản sao)"; nếu `first_name` trống thì ghi "Bản sao", để bản sao luôn thoả ràng buộc CRM-00 §5.2. Contact giữ liên kết công ty Primary. Deal: mở panel Tạo Deal điền sẵn dữ liệu, Mã Deal để trống. Xong mở bản sao | — |
| Gộp | Mở hộp thoại gộp hai bước của F03-S5 §4.7: chọn bản ghi cùng loại, chọn bản ghi giữ lại và giá trị từng trường | F03-S5. Khi chưa xong, nhãn "Sắp có" |
| Xoá | Hộp xác nhận nút đỏ như §4.12, xong quay về danh sách | — |

Deal có thêm hai mục của ERP hiện có, đặt trên cùng: "Kích hoạt Workflow" và "Quản lý trường dữ liệu" (D-14, CRM-04).

Mục người dùng không có quyền (ví dụ Xoá khi không có `record.delete`) thì ẩn, không để vô hiệu.

### 5.4 Card thuộc tính chính

- Tiêu đề theo `keyProps.title` ("Thông tin chính", "Về Deal này"). Header card có ▾ thu gọn và "Thao tác ▾". Card này không có ⚙: chọn thêm trường hiển thị làm ở card Trường bổ sung (CRM-09, TB-05).
- Thân là `PropertyList` các trường trong `keyProps.fields`. Bấm giá trị để sửa tại chỗ; lưu xong toast "Đã lưu 'Lead status'". Trường tính hiển thị chỉ đọc.
- Cuối card: "Xem tất cả thuộc tính" (§5.3) và dòng "Ngày tạo: 12/09/2026".
- Menu "Thao tác" của card: Tuỳ chỉnh thuộc tính (mở ⚙ của card Trường bổ sung, CRM-09; theo sheet CO-07, áp cho cả ba đối tượng) · Xem tất cả thuộc tính · Xem lịch sử thuộc tính. Hai mục của HubSpot "Làm giàu dữ liệu", "Điền thuộc tính thông minh" hiện với biểu tượng khoá và nhãn "Ngoài phạm vi".

### 5.5 Cột giữa

- Tab "Tổng quan" (chỉ khi `overviewTab`): nội dung ở spec đối tượng (Catch-up của Contact, Company).
- Tab "Hoạt động": timeline và cửa sổ soạn ở CRM-05.
- Tab mặc định khi mở trang: "Tổng quan" nếu có, không thì "Hoạt động".

### 5.6 Card liên kết

Mỗi mục trong `rightCards` là một card `AssociationCard` (DS-HUBSPOT §6.9b), dữ liệu qua F03-S1.

**Header**: ▾ thu gọn · "Companies (2)" (số từ F03-S1 §4.1) · "+ Thêm" · ⚙ (chọn thuộc tính hiển thị trên thẻ; lưu theo người dùng, F03-S4).

**Thẻ bản ghi liên kết**, tối đa 5 thẻ, thứ tự theo F03-S1 §4.2 (Primary trước):

- Tên dạng link (mở trang chi tiết bản ghi đó) · tag "Primary" nếu có · menu ⋯.
- 1–3 dòng phụ "Nhãn: giá trị" (spec đối tượng quy định trường nào).
- Nhãn liên kết nếu có (ví dụ "Người quyết định"), hoặc link "Thêm nhãn liên kết" khi kênh có nhãn mà dòng chưa có.

**Menu ⋯ của thẻ** (mục chỉ hiện khi kênh hỗ trợ):

| Mục | Kênh | API F03-S1 |
|---|---|---|
| Đặt làm Primary | có Primary, dòng chưa Primary | §4.5 `isPrimary: true` |
| Bỏ Primary | có Primary, dòng đang Primary | §4.5 `isPrimary: false` |
| Sửa nhãn liên kết | có nhãn | §4.5 `label` |
| Gỡ liên kết | mọi kênh (trừ trường Bắt buộc) | §4.6 |

Gỡ liên kết qua hộp xác nhận: "Gỡ liên kết giữa 'Nguyễn Thị Hạnh' và 'DEAL-013'? Hai bản ghi vẫn được giữ nguyên."

**Nút "+ Thêm"** mở panel phải hai tab:

1. **Tạo mới**: panel tạo của đối tượng đích (§6), liên kết với bản ghi đang mở được điền sẵn và khoá. Spec đối tượng có thể điền sẵn thêm (ví dụ Deal tạo từ Company có tên "<Tên công ty> - Deal mới", CRM-04 §5.3).
2. **Thêm có sẵn**: ô tìm bản ghi của đối tượng đích (tìm theo `searchFields`), danh sách kết quả, ô nhãn liên kết (nếu kênh có nhãn) áp cho mọi bản ghi đã chọn, nút "Lưu". Kênh một giá trị (`field`, ví dụ Công ty của Deal) chọn **một** bản ghi (radio). Kênh nhiều giá trị chọn nhiều (checkbox). Bản ghi đã liên kết hiện sẵn tick và mờ.

Khi thêm sẽ ghi đè một liên kết đang có (API trả `ASSOCIATION_REPLACES`, ví dụ gắn Deal có sẵn vào Company mà Deal đang thuộc công ty khác), giao diện hỏi trước. Một bản ghi: "DEAL-007 đang thuộc Logistics Tân Cảng Xanh. Chuyển sang Dược phẩm Thiên Phúc?". Nhiều bản ghi: một hộp liệt kê mọi bản ghi sẽ bị chuyển ("3 deal đang thuộc công ty khác sẽ được chuyển sang Dược phẩm Thiên Phúc") với nút "Chuyển tất cả" / "Chỉ thêm deal chưa có công ty" / "Huỷ".

**Cuối card**: "Xem tất cả Companies liên kết" (chỉ khi > 5) mở panel phải: danh sách đủ, có ô tìm, phân trang 20, cùng menu ⋯.

**Trạng thái rỗng**: icon + một câu ngắn do spec đối tượng quy định (ví dụ "Contact này chưa tham gia deal nào.") + nút "Thêm".

**Không có quyền đọc đối tượng đích**: card không hiện (F03-S1 không trả kênh đó).

### 5.7 Card Tệp đính kèm (C-22)

- Chỉ hiện khi đối tượng có `attachmentField` (CRM-00: trường `attachments` trên Contacts, Companies, Deals).
- Danh sách tệp: icon theo loại · tên (bấm để xem trước hoặc tải) · dung lượng · người tải lên · ngày.
- Nút "Tải lên" chọn một hoặc nhiều tệp. Tải lên qua F02, xong ghi id tệp vào trường. Giới hạn dung lượng và loại tệp theo cấu hình trường Tệp đính kèm của ERP.
- Menu ⋯ mỗi tệp: Tải xuống · Gỡ khỏi bản ghi (hộp xác nhận; gỡ khỏi trường, tệp vẫn còn trong thư viện Media nếu F02 giữ).
- Người không có quyền ghi bản ghi chỉ xem và tải xuống.
- Rỗng: "Chưa có tệp nào" + nút "Tải lên".

---

## 6. Panel tạo bản ghi

Dùng chung cho nút "Thêm …" ở header, "Tạo mới" ở card liên kết và ở mở rộng dòng. Trường cụ thể do `createFields` của đối tượng quy định (C-13 ở CRM-02, v.v.).

- Panel phải 460 px có scrim. Tiêu đề "Tạo Contact".
- Các trường theo thứ tự `createFields`, đánh dấu * trường bắt buộc.
- Mục "Liên kết với" ở cuối: mỗi kênh trong `createAssociations` là một ô chọn có tìm kiếm (ví dụ Contacts: Company, Deal). Kênh có nhãn thì có thêm ô nhãn. Liên kết đến từ card (§5.6) được điền sẵn và khoá.
- Nút ở footer, canh trái: "Tạo" · "Tạo và thêm tiếp" · "Huỷ". Ctrl/⌘+Enter bằng "Tạo". Enter trong ô nhập **không** gửi form.
- Nút "Tạo" vô hiệu khi còn trường bắt buộc trống; cạnh nút ghi "Còn 1 trường bắt buộc chưa nhập".
- Gửi bằng F03-S1 §4.7 (tạo kèm liên kết trong một giao dịch).
- Lỗi trùng (409, ví dụ email đã có): hiện ngay dưới ô và không đóng panel. Nếu người dùng đọc được bản ghi trùng: "Email này đã có ở contact Nguyễn Thị Hạnh" kèm link mở contact đó. Nếu không: "Email này đã được dùng cho một contact khác". Để làm được, lỗi `409 CONFLICT` của API cần trả thêm `details.existingRecordId` khi người gọi đọc được bản ghi đó (câu hỏi Q6).
- "Tạo và thêm tiếp": tạo xong làm trống form, giữ liên kết đã điền sẵn từ card, toast "Đã tạo contact".
- Đóng panel khi đã nhập dữ liệu: hỏi "Bỏ nội dung đang nhập?".

---

## 7. Quyền

| Thao tác | Điều kiện | Khi không đủ quyền |
|---|---|---|
| Mở danh sách | `record.read` trên collection | Trang thông báo §4.14 |
| Tạo | `record.write` trên collection | Nút "Thêm …" ẩn |
| Sửa ô, sửa thuộc tính, kéo thẻ board | Ghi được bản ghi (quyền collection hoặc là chủ sở hữu hệ thống) | Ô không vào chế độ sửa; thẻ không kéo được |
| Xoá, xoá hàng loạt | `record.delete` | Mục ẩn |
| Export | `record.export` | Nút ẩn |
| Import | `record.bulk_import` | Mục ẩn |
| Lưu view dùng chung, đổi tên/xoá view dùng chung | Người tạo view hoặc `collection.manage_views` | Mục ẩn |
| Thêm/gỡ liên kết | Theo F03-S1 §6 | Nút "+ Thêm", mục ⋯ ẩn |

View "của tôi" là bộ lọc, không phải giới hạn quyền (CRM-00 §6.3).

---

## 8. Hiệu năng và hành vi mạng

- Danh sách 25 dòng kèm cột "Công ty chính": 2 request (danh sách + F03-S1 §4.3 cho 25 id). Khi view có thay đổi chưa lưu thì thêm 1 request đếm số của view đã lưu; kết quả đếm này được lưu đệm 60 giây. Không gọi từng dòng.
- Trang chi tiết: request bản ghi và request danh sách kênh (F03-S1 §4.1) song song; mỗi card gọi §4.2 riêng khi hiện vào màn hình.
- Sửa tại chỗ gửi `PATCH` kèm `If-Match` (F03). Nhận `412` thì hiện "Bản ghi vừa được người khác sửa. Tải lại để xem giá trị mới" kèm nút Tải lại; không ghi đè.
- Mất mạng khi đang sửa: giữ giá trị người dùng vừa nhập trong ô, hiện lỗi, cho thử lại.

---

## 9. Tiêu chí nghiệm thu

**AC-C03-1 — Tìm kiếm**
Given danh sách Contacts có "Nguyễn Thị Hạnh" (email hanh@thienphuc.vn)
When bấm `/` rồi gõ "thienphuc"
Then sau khi ngừng gõ, danh sách chỉ còn các contact có "thienphuc" trong tên, email hoặc SĐT; URL có tham số tìm kiếm.

**AC-C03-2 — Sắp xếp theo cột**
Given danh sách đang sắp xếp mặc định Ngày tạo giảm dần
When bấm tiêu đề cột "Lead status" ba lần
Then lần 1 sắp tăng, lần 2 sắp giảm, lần 3 về mặc định.

**AC-C03-3 — Ẩn/hiện thanh bộ lọc**
Given thanh bộ lọc nhanh đang hiện
When bấm nút "Bộ lọc" trên thanh công cụ
Then thanh ẩn; tải lại trang thanh vẫn ẩn; bấm ⌃ thì thanh hiện lại.

**AC-C03-4 — Popover Sắp xếp**
Given danh sách Contacts
When bấm "Sắp xếp", chọn trường "Ngày hoạt động gần nhất" và chiều giảm dần
Then danh sách sắp theo trường đó, mũi tên hiện ở tiêu đề cột tương ứng; URL có tham số sắp xếp.

**AC-C04-1 — Lọc owner nhiều giá trị**
Given danh sách Contacts
When mở "Contact owner ▾" và tick Minh Trần, Lan Lê
Then chỉ còn contact của hai người này; nút hiện "Owner: Minh Trần, Lan Lê".

**AC-C04-2 — Mốc ngày tính theo giờ Việt Nam**
Given hôm nay là 30/09/2026
When chọn "Ngày tạo ▾ → 7 ngày qua"
Then danh sách gồm contact tạo từ 00:00 ngày 24/09 đến 23:59 ngày 30/09 giờ Việt Nam; dòng phụ trong popover ghi "24/09 – 30/09".

**AC-C04-3 — View lưu mốc tương đối**
Given một view đã lưu với bộ lọc "Ngày tạo: 30 ngày qua"
When mở view đó vào một ngày khác
Then khoảng ngày được tính lại từ ngày mở.

**AC-C04-4 — Thêm bộ lọc nhanh**
Given Contacts
When bấm ⊕ và chọn "Thành phố"
Then nút "Thành phố ▾" xuất hiện cuối hàng; "Khôi phục view" gỡ nút đó.

**AC-C04-5 — Chưa có owner**
Given có 3 contact chưa có owner
When chọn "(Chưa có owner)" trong bộ lọc owner
Then danh sách có đúng 3 contact đó.

**AC-C04-6 — Sửa hàng bộ lọc nhanh**
Given hàng bộ lọc nhanh mặc định của Contacts
When bấm ✎, kéo "Lead status" lên đầu, bấm ✕ trên "Ngày tạo", rồi thoát chế độ sửa
Then hàng còn 3 nút theo thứ tự mới; "Khôi phục view" đưa về 4 nút như ban đầu.

**AC-C04-7 — Tìm trong popover**
Given bộ lọc "Contact owner" có 12 nhân viên
When gõ "lan" vào ô tìm của popover
Then chỉ còn các nhân viên có "lan" trong tên; các nhân viên đã tick trước đó vẫn giữ tick.

**AC-C04-8 — Mốc ngày tương lai**
Given đối tượng Deals có `futureDateFields` gồm Ngày dự kiến chốt, hôm nay là 30/09/2026
When mở bộ lọc nhanh "Ngày dự kiến chốt" và chọn "Tuần sau"
Then danh sách chỉ còn deal có ngày dự kiến chốt từ 05/10 đến 11/10/2026; popover bộ lọc "Ngày tạo" không có mốc "Tuần sau".

**AC-C05-1 — Bộ lọc nâng cao nối VÀ**
Given Contacts
When thêm hai điều kiện "Thành phố Bằng Hà Nội" và "Lifecycle stage Bằng Customer" rồi Áp dụng
Then chỉ còn contact thoả cả hai; nút hiện "Bộ lọc nâng cao (2)".

**AC-C05-2 — Đóng không áp dụng**
Given panel bộ lọc nâng cao đang mở, đã thêm một điều kiện
When đóng panel bằng ✕
Then danh sách không đổi.

**AC-C07-1 — Mở rộng dòng**
Given Company "Logistics Tân Cảng Xanh" có 2 contact
When bấm › trên dòng và chọn "Contacts"
Then dưới dòng hiện bảng con 2 contact kèm nhãn liên kết (nếu có) và nút "+ Thêm".

**AC-C07-2 — Đóng khi đổi trang**
Given một dòng đang mở rộng
When chuyển sang trang 2
Then không còn dòng nào mở rộng.

**AC-C08-1 — Xem trước dạng dock**
Given màn hình rộng 1440 px
When bấm "Xem trước" trên một dòng
Then panel 400 px dock bên phải, bảng co lại, không có scrim; sửa Lead status trong panel thì dòng trên bảng đổi theo.

**AC-C08-2 — Đổi bản ghi trong panel**
Given panel Xem trước đang mở cho contact A
When bấm "Xem trước" trên contact B
Then panel hiện B mà không đóng.

**AC-C10-1 — Mật độ lưu theo người dùng**
Given người dùng chọn mật độ Gọn trên Contacts
When mở Contacts từ máy khác cùng tài khoản
Then vẫn là Gọn; người dùng khác vẫn thấy Thoáng.

**AC-C10-2 — Khôi phục view mặc định**
Given đã thêm 2 cột và 1 bộ lọc nhanh trên view "Tất cả contacts"
When chọn ⚙ → Khôi phục view mặc định
Then cột và bộ lọc về cấu hình gốc của Contacts.

**AC-C10-3 — Chuyển Bảng / Board**
Given đang ở view "Tất cả contacts" dạng bảng
When chọn ⚙ → Kiểu hiển thị: Board
Then hiện board theo Lifecycle stage với cùng bộ lọc; tab view hiện dấu "đã thay đổi".

**AC-C10-4 — Chỉnh sửa cột từ menu ⚙**
Given Contacts
When chọn ⚙ → Chỉnh sửa cột…, bỏ cột "Số điện thoại", kéo "Lead status" lên đầu, Áp dụng
Then bảng không còn cột Số điện thoại và Lead status đứng ngay sau cột tên.

**AC-C10-5 — Thứ tự cột theo trường**
Given đối tượng có `columnOrder: field`
When mở hộp "Chỉnh sửa cột"
Then cột bên phải không kéo được, có dòng "Thứ tự cột theo thứ tự trường"; đổi thứ tự trường trong Quản lý trường thì thứ tự cột trên bảng đổi theo.

**AC-C10-6 — Đổi "Cột theo" trên board**
Given board Contacts đang cột theo Lifecycle stage
When chọn "Cột theo ▾" → Lead status
Then board vẽ lại theo các lựa chọn của Lead status, số thẻ mỗi cột đúng với tổng bản ghi khớp bộ lọc; tab view hiện dấu "đã thay đổi"; bấm "Khôi phục view" về lại Lifecycle stage.

**AC-C11-1 — Gán owner hàng loạt**
Given chọn 24 contact
When Gán owner → Lan Lê → xác nhận
Then 24 contact có owner Lan Lê; mỗi contact có một sự kiện "Đổi owner" trên timeline.

**AC-C11-2 — Chọn tất cả theo bộ lọc**
Given bộ lọc khớp 312 contact, trang 25 dòng
When tick checkbox tiêu đề rồi bấm "Chọn tất cả 312 bản ghi khớp bộ lọc"
Then thanh hàng loạt ghi "Đã chọn 312".

**AC-C11-3 — Xoá hàng loạt là xoá mềm**
Given chọn 3 contact
When Xoá → xác nhận
Then 3 contact biến khỏi danh sách và có trong thùng rác; nội dung hộp xác nhận có câu "có thể khôi phục trong 30 ngày".

**AC-C11-4 — Bỏ qua bản ghi không có quyền**
Given chọn 24 contact, trong đó 4 contact người dùng không có quyền sửa
When gán owner
Then kết quả ghi "Đã gán 20. Bỏ qua 4 bản ghi bạn không có quyền sửa."

**AC-C12-1 — Footer**
Given bộ lọc khớp 5 trên 18 contact
When nhìn footer
Then có "Hiển thị 5 / 18 bản ghi", nút làm mới, Export, khôi phục view, nhân bản view.

**AC-C12-2 — Nhân bản view**
Given đang ở "Tất cả contacts" có thêm một bộ lọc chưa lưu
When bấm "Nhân bản view" và đặt tên "Contacts Hà Nội"
Then có tab mới "Contacts Hà Nội" (riêng tư) mang bộ lọc đó; "Tất cả contacts" không đổi.

**AC-C15-1 — Nút nhanh mở đúng cửa sổ soạn**
Given trang chi tiết một contact
When bấm lần lượt Ghi chú, Gọi, Task, Họp
Then mở lần lượt cửa sổ soạn Ghi chú, Ghi lại cuộc gọi, Task, Cuộc họp chế độ Lên lịch.

**AC-C15-2 — Email ngoài phạm vi**
Given trang chi tiết
When rê chuột vào nút Email
Then nút ở trạng thái vô hiệu, tooltip "Gửi email chưa có trong giai đoạn này".

**AC-C15-3 — Sắp xếp nút theo người dùng**
Given người dùng đổi thứ tự thành Gọi, Ghi chú, Task, Họp, Email
When mở trang chi tiết Company
Then thứ tự nút là thứ tự vừa đặt.

**AC-C15-4 — Menu Thêm**
Given trang chi tiết một contact
When bấm "Thêm" và gõ "họp"
Then chỉ còn mục "Ghi lại cuộc họp"; bấm vào thì mở cửa sổ soạn cuộc họp đã diễn ra. Các mục Ghi lại email, SMS, WhatsApp, LinkedIn (khi không lọc) có nhãn "Ngoài phạm vi" và bấm không mở gì.

**AC-C17-1 — Nhân bản contact**
Given contact có email hanh@thienphuc.vn, công ty Primary Thiên Phúc
When Thao tác → Nhân bản
Then mở bản sao có tên thêm " (bản sao)", email trống, vẫn liên kết Thiên Phúc là Primary.

**AC-C17-2 — Mục chưa sẵn sàng**
Given F03-S5 chưa triển khai
When mở menu Thao tác
Then mục "Gộp" có nhãn "Sắp có" và bấm không làm gì.

**AC-C17-3 — Tìm trên Google**
Given contact Nguyễn Thị Hạnh, công ty Primary Dược phẩm Thiên Phúc
When Thao tác → Tìm trên Google
Then mở tab mới tìm "Nguyễn Thị Hạnh Dược phẩm Thiên Phúc".

**AC-C17-4 — Theo dõi**
Given người dùng X theo dõi Deal DEAL-013, owner là Y
When Y đổi giai đoạn Deal
Then X nhận một thông báo trong ERP; Y không nhận thông báo cho thao tác của chính mình.

**AC-C17-5 — Xem tất cả thuộc tính**
Given contact có 14 trường gốc và 2 trường bổ sung
When Thao tác → Xem tất cả thuộc tính, gõ "thành" vào ô tìm
Then panel liệt kê các trường có "thành" trong tên (ví dụ Thành phố); sửa Thành phố trong panel thì card Thông tin chính đổi theo.

**AC-C17-6 — Lịch sử thuộc tính**
Given F03-S3 đã triển khai; Lead status của contact từng đổi Mới → Đang xử lý → Có deal
When Thao tác → Xem lịch sử thuộc tính → chọn Lead status
Then thấy 3 dòng theo thời gian giảm dần, mỗi dòng có giá trị cũ, giá trị mới, người đổi, thời điểm.

**AC-C17-7 — Lịch sử liên kết**
Given contact từng được gắn rồi gỡ khỏi DEAL-007
When Thao tác → Xem lịch sử liên kết
Then thấy hai dòng "Đã liên kết với DEAL-007" và "Đã gỡ liên kết với DEAL-007" kèm người và thời điểm.

**AC-C17-8 — Xoá từ trang chi tiết**
Given người dùng có quyền xoá
When Thao tác → Xoá → xác nhận
Then quay về danh sách Contacts, contact đó không còn trong danh sách và có trong thùng rác.

**AC-C22-1 — Tải lên và gỡ tệp**
Given trang chi tiết Deal
When tải lên "bao_gia_v2.pdf" rồi gỡ nó
Then sau khi tải lên, card hiện tệp với tên, dung lượng, người tải, ngày; sau khi gỡ, card rỗng và hiện "Chưa có tệp nào".

**AC-CRM01-1 — Trạng thái lưu trên URL**
Given danh sách có từ khoá, 2 bộ lọc nhanh, sắp xếp theo Ngày hoạt động gần nhất, trang 3
When sao chép URL và mở ở tab mới
Then thấy đúng cùng trạng thái đó.

**AC-CRM01-2 — Xung đột khi sửa**
Given người dùng A và B cùng mở một contact
When B đổi Lead status, sau đó A đổi Lead status
Then A nhận thông báo "Bản ghi vừa được người khác sửa…" và giá trị của B không bị ghi đè.

**AC-CRM01-3 — Thêm có sẵn hỏi trước khi chuyển**
Given DEAL-007 thuộc Logistics Tân Cảng Xanh
When từ card Deals của Thiên Phúc chọn "Thêm có sẵn" → DEAL-007 → Lưu
Then hiện câu hỏi chuyển công ty; chọn "Chuyển" thì DEAL-007 thuộc Thiên Phúc và biến khỏi card Deals của Tân Cảng Xanh.

**AC-CRM01-4 — Mở danh sách từ thông báo gộp**
Given Minh vừa gán owner Lan Lê cho 24 contact trong một lần
When Lan bấm thông báo "Minh Trần đã giao 24 contact cho bạn"
Then danh sách Contacts mở với đúng 24 contact đó và nút "Thao tác hàng loạt lúc …"; bấm ✕ trên nút thì về danh sách đầy đủ.

---

## 10. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-CRM01-01 | E2E | Gõ `/` khi đang ở ô nhập khác | Không nhảy sang ô tìm |
| TC-CRM01-02 | E2E | Gõ nhanh 6 ký tự | Chỉ 1 request sau 300 ms |
| TC-CRM01-03 | Unit | Tính mốc "Tuần này" khi hôm nay là Chủ nhật 04/10/2026 | 28/09 00:00 → 04/10 23:59 |
| TC-CRM01-04 | Unit | Tính "Tháng trước" ngày 31/03 | 01/02 → 28/02 (hoặc 29/02 năm nhuận) |
| TC-CRM01-05 | Unit | Tính "Quý này" ngày 30/09 | 01/07 → 30/09 |
| TC-CRM01-06 | E2E | Tick 2 owner + chọn Lead status "Mới" | Bộ lọc gửi đi: owner IN (2 id) VÀ lead_status = Mới |
| TC-CRM01-07 | E2E | Thêm cùng trường ở bộ lọc nhanh và nâng cao | Hai điều kiện nối VÀ, panel có ghi chú |
| TC-CRM01-08 | E2E | Bấm Back sau khi đổi bộ lọc | Về trạng thái bộ lọc trước |
| TC-CRM01-09 | E2E | Mở rộng 3 dòng cùng lúc | Cả 3 hiện bảng con |
| TC-CRM01-10 | E2E | Sửa email trùng tại ô | Ô trở về giá trị cũ, hiện lỗi từ API |
| TC-CRM01-11 | E2E | Kéo thẻ board khi API trả lỗi | Thẻ về cột cũ, hiện lỗi |
| TC-CRM01-12 | E2E | Board có 12 bản ghi rỗng trường cột | Hiện dòng "12 bản ghi … không hiển thị" và link |
| TC-CRM01-13 | E2E | Chọn cả trang rồi đổi bộ lọc | Bỏ chọn hết |
| TC-CRM01-14 | E2E | Gán owner hàng loạt 1.500 bản ghi | Chạy nền, có tiến độ, xong có thông báo |
| TC-CRM01-15 | Quyền | Người không có `record.delete` | Không thấy Xoá ở thanh hàng loạt và menu Thao tác |
| TC-CRM01-16 | Quyền | Người không có `record.export` | Footer không có Export |
| TC-CRM01-17 | E2E | View "Contacts của tôi" với tài khoản chưa gắn nhân viên | Hiện câu giải thích, không hiện bảng rỗng |
| TC-CRM01-18 | E2E | Panel tạo: nhấn Enter trong ô Email | Không gửi form |
| TC-CRM01-19 | E2E | Panel tạo: Ctrl+Enter khi đủ trường bắt buộc | Tạo thành công |
| TC-CRM01-20 | E2E | Đóng panel tạo khi đã nhập | Hỏi "Bỏ nội dung đang nhập?" |
| TC-CRM01-21 | E2E | Tạo contact từ card Contacts của Company | Contact mới có liên kết tới Company đó ngay khi tạo |
| TC-CRM01-22 | E2E | Card liên kết khi người dùng không đọc được đối tượng đích | Card không hiện |
| TC-CRM01-23 | E2E | Trang chi tiết ở 390 px | Một cột, thứ tự trái → giữa → phải, không cuộn ngang trang |
| TC-CRM01-24 | E2E | Danh sách 25 dòng có cột Công ty chính, không có thay đổi chưa lưu | Tổng 2 request dữ liệu |
| TC-CRM01-25 | A11y | Dùng bàn phím mở bộ lọc nhanh, chọn giá trị, đóng popover | Làm được hết bằng Tab, Enter, Space, Esc |
| TC-CRM01-26 | Unit | Tính "Tuần sau" khi hôm nay là Chủ nhật 04/10/2026 | 05/10 00:00 → 11/10 23:59 |
| TC-CRM01-27 | Unit | Tính "30 ngày tới" ngày 30/09/2026 | 30/09 00:00 → 29/10 23:59 |
| TC-CRM01-28 | E2E | `columnOrder: field`, kéo cột trong hộp Chỉnh sửa cột | Không kéo được |
| TC-CRM01-29 | E2E | Board: đổi "Cột theo" rồi bấm Back | Về trường cột trước |
| TC-CRM01-30 | E2E | Board 60 thẻ ở một cột, mới tải 20 | Đầu cột ghi 60, không ghi 20 |
| TC-CRM01-31 | E2E | Mở `?batch=<id>` rồi bấm Nhân bản view | View mới không chứa điều kiện batch |

---

## 11. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Dữ liệu và view lưu trong `localStorage` của trình duyệt | View lưu ở ERP (F03 `View`); tuỳ chọn cá nhân lưu theo người dùng (F03-S4) |
| Lọc, tìm, sắp xếp chạy trên mảng dữ liệu đã tải ở FE | Mọi lọc, tìm, sắp xếp chạy ở API, có phân trang |
| "Ngày hoạt động gần nhất" tính ở FE mỗi lần vẽ bảng | Trường `last_activity_at` do F03-S2 tính và lưu |
| Owner là chuỗi tên; popover owner lấy từ danh sách tên cố định | Liên kết tới NhanVien, danh sách lấy từ API, lọc theo trạng thái làm việc |
| "Công ty chính" lấy từ `contact.company` (một công ty) | Dòng Primary của bảng nối, lấy qua F03-S1 §4.3 |
| Export chỉ hiện toast | Gọi chức năng Export của ERP |
| Nhân bản view chỉ hiện toast | Tạo view thật |
| Hộp xoá ghi "Không thể hoàn tác" | Xoá mềm, khôi phục được 30 ngày |
| "Theo dõi" chỉ đổi nhãn nút | Lưu người theo dõi và phát thông báo (F03-S3) |
| Sự kiện "Đổi owner", "Đổi lifecycle" do FE tự ghi | BE ghi (F03-S3) |
| Tệp đính kèm chỉ hiện toast "sắp ra mắt" | Tải lên qua F02, lưu vào trường `attachments` |

---

## 12. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | Component bộ lọc điều kiện hiện có của ERP đã hỗ trợ nhóm HOẶC chưa? | FE | §4.6: giữ hay chỉ làm VÀ |
| Q2 | Thao tác hàng loạt chạy ngay tới 200 bản ghi, nhiều hơn thì chạy nền (F03-S5 §3.1). Ngưỡng này có phù hợp giới hạn thời gian request hiện tại của ERP không? | BE | §4.12 |
| Q3 | "Theo dõi" có cần gửi email hay chỉ thông báo trong ERP? | Khách | §5.3, F03-S3 |
| Q4 | Trên màn hẹp (< 600 px) có cần giữ bảng cuộn ngang hay chuyển sang danh sách thẻ như F03 mô tả cho mobile? | PO | §4.7 |
| Q5 | Nút Email vô hiệu có gây hiểu nhầm cho khách không, hay nên ẩn hẳn? | Khách | §5.2 |
| Q6 | Lỗi `409 CONFLICT` có trả được id bản ghi bị trùng (khi người gọi đọc được) không? | BE | §6 |
| Q7 | C-04 là P0 nhưng bộ lọc "Ngày hoạt động gần nhất" phụ thuộc F03-S2 (đợt 3). Chấp nhận ra mắt bộ lọc nhanh thiếu mục này, hay kéo phần tính `last_activity_at` của F03-S2 lên sớm? | PO | §4.5 |

---

## Liên kết

- Plan: `00-PLAN-viet-spec.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md`
- Liên kết bản ghi: `ERPMini/features/features/F03-S1-lien-ket-ban-ghi.md`
- Design system theme: `../DESIGN-SYSTEM-HUBSPOT.md` (§6.2–6.12, §7.1–7.2)
- Đối chiếu chức năng: `../DOI-CHIEU-CHUC-NANG.md` §2, §11–13

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-09-30 | v1.0 — bản đầu | TTS (qua Claude) |
| 2026-09-30 | v1.1 — bổ sung theo đợt 2: menu ⋮ đổi tên mục thành "Chỉnh sửa thuộc tính" (§4.2); menu card thuộc tính chính thêm "Tuỳ chỉnh thuộc tính" (§5.4); `futureDateFields` và bốn mốc ngày tương lai (§4.5); `columnOrder` view/field (§4.7); "Cột theo" và số thẻ từ `group-summary` trên board (§4.10); tham số `?batch=<id>` (§4.1); AC-C04-8, AC-C10-5, AC-C10-6, AC-CRM01-4; TC-CRM01-26..31 | TTS (qua Claude) |
| 2026-09-30 | v1.2 — theo đợt 3: §4.5 trỏ sang CRM-09 §8 cho popover của các loại trường còn lại | TTS (qua Claude) |
| 2026-10-01 | v1.3 — theo đợt 4: popover owner (§4.5) và popover Gán owner (§4.12) chỉ gồm nhân viên `is_sales`; ngưỡng chạy ngay của thao tác hàng loạt là 200 bản ghi (§4.12); mục Gộp trỏ tới hộp thoại F03-S5 §4.7 (§5.3) | TTS (qua Claude) |

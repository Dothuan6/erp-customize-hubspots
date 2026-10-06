# CRM-09 — Trường bổ sung

> **Trạng thái:** 💡 Proposed · v1.0 · 30/09/2026 · chờ review
> **Tính năng sở hữu (7):** TB-01 → TB-07
> **Phụ thuộc:** `F03-S4` (tạo trường tuỳ chỉnh, cấu hình Trường bổ sung, trạng thái giao diện) · `CRM-01` §3, §4.5, §4.7, §5.1, §5.4 (khung) · `CRM-00` §5 (bộ trường gốc) · `DESIGN-SYSTEM-HUBSPOT.md` §6.9, §6.9a, §6.11, §6.12
> **Prototype:** `crm-record-hubspot.html?type=contact|company|deal&id=` (card "Trường bổ sung" ở cột trái) · code `crm-record-hubspot.html` (`drawExtra`, `extraCfg`, `newFieldDlg`, `badgeNew`), `crm-objects.js` (`extraKeys`, `setExtra`, `addCustomField`)
> **Nguồn HubSpot:** card thuộc tính tuỳ chỉnh ở cột trái trang chi tiết và "Create property" — `DOI-CHIEU-CHUC-NANG.md` §17

---

## 1. Phạm vi

Khách cần lưu thêm thông tin mà bộ trường gốc không có (Mã số thuế, Hạng khách hàng, Đối thủ cạnh tranh…) và muốn làm ngay trên trang chi tiết, không phải nhờ quản trị vào Quản lý trường. File này đặc tả card "Trường bổ sung" và các chỗ trường mới xuất hiện.

| ID | Tính năng | Ưu tiên | Phạm vi sheet | Mục |
|---|---|---|---|---|
| TB-01 | Card "Trường bổ sung" | P0 | Chỉ FE | §3 |
| TB-02 | Sửa giá trị tại chỗ | P0 | Chỉ FE | §4 |
| TB-03 | Tạo trường mới | P0 | FE + BE | §5 |
| TB-04 | Nhãn "Mới" cho trường tự tạo | P2 | FE + BE | §6 |
| TB-05 | Chọn trường hiển thị (⚙) | P1 | FE + BE | §7 |
| TB-06 | Trường mới dùng ở danh sách | P1 | Chỉ FE | §8 |
| TB-07 | Trường bổ sung cho Deal | P0 | FE + BE | §9 |

Sheet ghi tên phân hệ là "dynamic fieds" (gõ sai). Trong tài liệu dùng tên "Trường bổ sung" (plan §6).

**Ngoài phạm vi:** trang Quản lý trường (giữ nguyên, chỉ thêm mô tả và nhãn theo F03-S4 §6); thuộc tính line item (CRM-06 §4.6); sắp xếp lại thứ tự trường ghim bằng kéo thả (chưa có trong sheet).

---

## 2. Vị trí

Card thứ ba ở cột trái trang chi tiết Contact, Company, Deal, ngay dưới card thuộc tính chính ("Thông tin chính" / "Về Deal này") (CRM-01 §5.1). Style theo DS-HUBSPOT §6.9 dòng "Card Trường bổ sung".

Collection không thuộc CRM không có card này; trang chi tiết mặc định của ERP hiện đủ trường như hiện nay.

---

## 3. Card "Trường bổ sung" (TB-01)

**Header**: nút ▾ thu gọn · "Trường bổ sung ({n})" · bên phải nút "+ Thêm" (mở hộp tạo trường, §5) và nút ⚙ (mở popover chọn trường, §7).

- `n` là số trường đang hiện trong card.
- Trạng thái thu gọn nhớ theo người dùng, theo đối tượng (F03-S4 khoá `crm.record.{c}.cards`, mục `extraFields`).
- Người không có quyền sửa cấu trúc collection (`collection.update_schema`): không có "+ Thêm" và ⚙ (F03-S4 Q2).

**Thân**: `PropertyList` (DS-HUBSPOT §6.9a) các trường theo thứ tự:

1. Lấy `resolved` từ F03-S4 §4.3 (trường ghim, rồi trường tuỳ chỉnh chưa bị tắt).
2. Bỏ trường đã có trong card thuộc tính chính (`keyProps`) và trên thẻ định danh của đối tượng.
3. Bỏ trường ngừng dùng của Deal (`sale_ph_tr_ch`, `lead_id`, `test`; CRM-00 §5.4.1).

**Trạng thái rỗng**: biểu tượng + "Chưa có trường bổ sung. Tạo trường mới để lưu thêm thông tin cho mọi {contact / công ty / deal}, hoặc bấm ⚙ để ghim trường có sẵn." + nút "Tạo trường mới". Người không có quyền sửa cấu trúc chỉ thấy "Chưa có trường bổ sung."

**Đang tải**: skeleton 3 dòng. Lỗi tải cấu hình: hiện card với câu "Không tải được Trường bổ sung." và nút "Thử lại"; các card khác vẫn hoạt động.

---

## 4. Sửa giá trị tại chỗ (TB-02)

Hành vi theo `PropertyList` của CRM-01 §5.4 và DS-HUBSPOT §6.9a:

- Bấm giá trị để sửa bằng trình sửa theo loại trường của ERP (`FieldValueEditor`).
- Lưu: Enter (trừ Văn bản dài), bấm ra ngoài; huỷ: Esc. Lưu xong toast "Đã lưu “{tên trường}”".
- Giá trị trống hiện "--".
- Trường tính, trường hệ thống: chỉ đọc, không có hiệu ứng rê chuột.
- Người chỉ đọc được bản ghi: mọi giá trị chỉ đọc.
- Lỗi từ API (ví dụ sai định dạng đường dẫn, trùng giá trị với trường Duy nhất): giá trị trở về cũ, hiện lỗi tiếng Việt dưới trường.

| Loại | Trình sửa | Kiểm tra ở FE trước khi gửi |
|---|---|---|
| Văn bản | Ô một dòng | Tối đa 255 ký tự |
| Văn bản dài | Ô nhiều dòng, Ctrl+Enter để lưu | Tối đa 5.000 ký tự |
| Số, Tiền tệ | Ô số | Là số; tiền tệ hiển thị `1.240.000 ₫` |
| Ngày, Ngày giờ | Chọn ngày (và giờ) | — |
| Lựa chọn đơn | Popover chọn có tìm, giá trị hiện dạng pill | — |
| Hộp kiểm | Bấm là đổi và lưu luôn | — |
| Người dùng | Chọn tài khoản có tìm | — |
| Đường dẫn | Ô một dòng; hiển thị dạng link mở tab mới | Bắt đầu bằng `http://` hoặc `https://`; thiếu thì FE tự thêm `https://` |

---

## 5. Tạo trường mới (TB-03)

Mở từ "+ Thêm" trên header card, nút "Tạo trường mới" ở trạng thái rỗng, hoặc mục "Tạo trường mới" cuối popover ⚙.

**Hộp thoại** (modal rộng 480 px, DS-HUBSPOT §6.11), tiêu đề "Tạo trường mới cho {Contact / Company / Deal}":

| # | Ô | Ghi chú |
|---|---|---|
| 1 | Tên trường * | Tối đa 60 ký tự. Chữ gợi ý theo đối tượng: "VD: Kênh liên hệ ưa thích" (Contact), "VD: Mã số thuế" (Company), "VD: Đối thủ cạnh tranh" (Deal) |
| 2 | Loại trường | 10 loại theo F03-S4 §4.1: Văn bản (mặc định) · Văn bản dài · Số · Tiền tệ · Ngày · Ngày giờ · Lựa chọn đơn · Hộp kiểm · Người dùng · Đường dẫn |
| 3 | Các lựa chọn | Chỉ hiện với Lựa chọn đơn. Ô nhiều dòng, gợi ý "Mỗi dòng một lựa chọn". Dòng trống bị bỏ |
| 4 | Mô tả | Không bắt buộc. Gợi ý "Hiện khi rê chuột vào tên trường". Tối đa 500 ký tự |
| 5 | ☑ Hiện ở vùng "Trường bổ sung" trên mọi {contact / công ty / deal} | Mặc định tick |

Dưới các ô có dòng giải thích: Contact, Company: "Trường áp dụng cho mọi {contact / công ty}; dùng được làm cột và bộ lọc ở danh sách." Deal: "Trường được thêm vào collection Deals_Pipeline của ERP, như khi thêm ở Quản lý trường; dùng được ở bảng, bộ lọc, báo cáo và workflow."

Nút: "Huỷ" · "Tạo trường". Enter trong ô Tên bấm "Tạo trường".

**Kiểm tra** (FE kiểm trước; máy chủ kiểm lại theo F03-S4 §4.1):

| Lỗi | Thông báo |
|---|---|
| Tên trống | "Nhập tên trường" |
| Trùng tên (không phân biệt hoa thường, bỏ dấu) | "Đã có trường “{tên đang có}” trên {Contact}" |
| Lựa chọn đơn chưa có lựa chọn | "Nhập ít nhất một lựa chọn" |
| Lựa chọn trùng nhau | "Lựa chọn “{x}” bị lặp" |
| Lỗi từ máy chủ khác | Câu lỗi tiếng Việt từ API |

Lỗi hiện ở dòng báo lỗi cuối hộp thoại; con trỏ về ô có lỗi.

**Sau khi tạo**:

1. Đóng hộp thoại, toast "Đã tạo trường “{tên}”. Nhập giá trị ngay trong Trường bổ sung."
2. Card mở ra (nếu đang thu gọn), cuộn tới trường mới và **mở luôn trình sửa giá trị** của trường đó trên bản ghi đang xem.
3. Nếu bỏ tick "Hiện ở vùng Trường bổ sung": không có bước 2; toast thêm "Trường không hiện ở đây; bật lại bằng ⚙."

Trường mới có hiệu lực cho **mọi** bản ghi cùng loại ngay lập tức; bản ghi khác có giá trị trống.

---

## 6. Nhãn "Mới" (TB-04)

- Trường có `origin = custom` (F03-S4 §3.1) có nhãn "Mới" cạnh tên (10/700, nền `#E3F2FD`, chữ `#0B5CAD`, DS-HUBSPOT §6.9).
- Rê chuột vào nhãn hoặc tên: hiện mô tả của trường; không có mô tả thì "Trường mới tạo ngày {dd/mm/yyyy} bởi {tên người tạo}".
- Nhãn hiện ở: card Trường bổ sung, panel "Xem tất cả thuộc tính" (CRM-01 §5.3), popover ⚙ (§7). Không hiện ở tiêu đề cột bảng.
- Theo sheet, nhãn hiện vô thời hạn với mọi trường tuỳ chỉnh. Có nên tắt nhãn sau một khoảng thời gian (ví dụ 30 ngày) là câu hỏi Q1.

---

## 7. Chọn trường hiển thị — ⚙ (TB-05)

Bấm ⚙ mở popover rộng 300 px (DS-HUBSPOT §6.12):

- Ô "Tìm thuộc tính", lọc theo tên, bỏ dấu.
- Nhóm **"Trường mới / tuỳ chỉnh ({n})"**: mọi trường `origin = custom`, xếp theo ngày tạo. Không có thì dòng "Chưa có".
- Nhóm **"Trường có sẵn ({n})"**: trường `origin = base`, xếp theo vị trí trong collection.
- Mỗi dòng: checkbox · tên (kèm nhãn "Mới" nếu có) · loại trường chữ nhạt bên phải. Tick nghĩa là trường đang hiện trong card.
- Vạch ngăn, rồi mục "Tạo trường mới" (§5). Riêng Deal thêm mục "Quản lý trường dữ liệu" mở trang Quản lý trường của Deals_Pipeline.

**Trường không có trong popover**: trường trên thẻ định danh và trong card thuộc tính chính; trường hệ thống; trường ngừng dùng của Deal. Cụ thể theo đối tượng:

| Đối tượng | Bỏ thêm |
|---|---|
| Contact | `email`, `first_name`, `last_name`, `full_name` |
| Company | `name`, `domain` |
| Deal | `m_deal`, `t_n_deal`, `giai_o_n_pipeline`, `ng_y_d_ki_n_ch_t`, `t_ng_cash_in_d_ki_n`, `sale_ph_tr_ch`, `lead_id`, `test` |

**Tick, bỏ tick** (ghi ngay, F03-S4 §4.3):

| Thao tác | Trường tuỳ chỉnh | Trường có sẵn |
|---|---|---|
| Tick | Bỏ khỏi `hidden` | Thêm vào cuối `pinned` |
| Bỏ tick | Bỏ khỏi `pinned` nếu đang được ghim, rồi thêm vào `hidden` | Bỏ khỏi `pinned` |

- Mỗi lần tick gửi PUT với cả hai mảng; card vẽ lại ngay. Lỗi thì trả checkbox về trạng thái cũ và hiện lỗi.
- Lần đầu thay đổi trong một lần mở popover thì hiện toast "Thay đổi áp dụng cho mọi {contact / công ty / deal}", để người dùng biết đây không phải cài đặt riêng.
- Esc hoặc bấm ra ngoài đóng popover.

---

## 8. Trường mới ở danh sách (TB-06)

Trường tuỳ chỉnh của đối tượng tự có mặt ở danh sách, không cần cấu hình:

- Nút "+" cuối hàng tiêu đề bảng và hộp "Chỉnh sửa cột" (CRM-01 §4.7): nhóm "Trường tuỳ chỉnh" đứng đầu danh sách trường chưa hiện.
- Nút ⊕ thêm bộ lọc nhanh (CRM-01 §4.5): như trên.
- Bộ lọc nâng cao (CRM-01 §4.6) và menu "Sắp xếp" (CRM-01 §4.4): có đủ trường tuỳ chỉnh.
- Deal (`columnOrder: field`, CRM-04 §2.3): trường mới nằm cuối danh sách trường nên nếu người dùng bật cột, cột đứng sau các cột có sẵn và trước cột Ngày tạo. Đổi vị trí ở Quản lý trường.

Bộ lọc nhanh cho các loại trường chưa có trong bảng popover của CRM-01 §4.5:

| Loại | Popover | Giá trị lọc |
|---|---|---|
| Hộp kiểm | Hai lựa chọn "Có" · "Không" | Một giá trị |
| Người dùng | Ô tìm + danh sách tài khoản có checkbox, mục đầu "(Trống)" | Nhiều giá trị, nối HOẶC |
| Tiền tệ | Như Số | Một điều kiện |
| Văn bản dài, Đường dẫn | Như Văn bản | Một điều kiện |

---

## 9. Trường bổ sung cho Deal (TB-07)

- Trường tạo mới cho Deal (từ card, từ Quản lý trường, hoặc qua API) là trường của `Deals_Pipeline`, `origin = custom`, nên **tự hiện** trong card như Contact, Company.
- Cấu hình mặc định do script CRM-00 ghi (F03-S4 §5): ghim sẵn **Phí thuê trả trước** (`ph_thu_tr_tr_c`), **Phí khởi tạo (Setup)** (`ph_kh_i_t_o_setup`), **Số tiền giảm giá** (`s_ti_n_gi_m_gi`).
- Sheet TB-07 ghi thêm **Lead Id**. Spec **không** ghim trường này vì `lead_id` đã ngừng dùng và được thay bằng liên kết Deal–Contact (CRM-00 §5.4.1, §8.2); ghim lại sẽ làm người dùng tiếp tục nhập vào trường cũ.
- Trường mới của Deal dùng được ngay trong workflow (danh sách trường của collection), trong bảng Deals và trong báo cáo khi CRM-07 có.

---

## 10. Quyền

| Hành động | Điều kiện | Không đủ quyền |
|---|---|---|
| Xem card, xem giá trị | Đọc được bản ghi | — |
| Sửa giá trị | Ghi được bản ghi | Giá trị chỉ đọc |
| Tạo trường | `collection.update_schema` trên collection | Không có "+ Thêm", nút tạo ở trạng thái rỗng, mục trong ⚙ |
| Đổi trường hiển thị (⚙) | `collection.update_schema` (F03-S4 Q2) | Không có ⚙ |

---

## 11. Tiêu chí nghiệm thu

**AC-TB01-1 — Card hiện dưới Thông tin chính**
Given Company Thiên Phúc, collection có trường tuỳ chỉnh "Mã số thuế" và "Hạng khách hàng"
When mở trang chi tiết
Then cột trái có card "Trường bổ sung (2)" ngay dưới "Thông tin chính", hai trường theo thứ tự ngày tạo.

**AC-TB01-2 — Thu gọn nhớ theo người dùng**
Given card đang mở
When bấm ▾ thu gọn rồi mở một company khác
Then card ở company khác cũng đang thu gọn; người dùng khác vẫn thấy card mở.

**AC-TB01-3 — Trạng thái rỗng**
Given Contact chưa có trường tuỳ chỉnh, chưa ghim trường nào; người dùng có quyền sửa cấu trúc
When mở trang chi tiết contact
Then card ghi "Trường bổ sung (0)" với câu hướng dẫn và nút "Tạo trường mới".

**AC-TB02-1 — Sửa tại chỗ**
Given Thiên Phúc có "Mã số thuế" trống
When bấm "--", nhập 0312345678, Enter
Then giá trị lưu, toast "Đã lưu “Mã số thuế”".

**AC-TB02-2 — Đường dẫn thiếu giao thức**
Given trường "Website tuyển dụng" loại Đường dẫn
When nhập "thienphuc.vn/tuyen-dung"
Then lưu thành "https://thienphuc.vn/tuyen-dung" và hiện dạng link.

**AC-TB03-1 — Tạo trường và nhập ngay**
Given trang chi tiết DEAL-013, người dùng có quyền
When bấm "+ Thêm", nhập "Đối thủ cạnh tranh", loại Lựa chọn đơn, lựa chọn "Base.vn" và "Misa AMIS", bấm "Tạo trường"
Then toast "Đã tạo trường “Đối thủ cạnh tranh”…"; card có trường mới với nhãn "Mới" và trình sửa đang mở trên DEAL-013; các deal khác có trường này để trống.

**AC-TB03-2 — Trùng tên**
Given Company đã có "Mã số thuế"
When tạo trường "ma so thue"
Then dòng lỗi "Đã có trường “Mã số thuế” trên Company"; không tạo.

**AC-TB03-3 — Không có Lựa chọn nhiều**
Given hộp tạo trường
When mở ô Loại trường
Then có đúng 10 loại, không có "Lựa chọn nhiều".

**AC-TB04-1 — Nhãn Mới và mô tả**
Given trường "Mã số thuế" có mô tả "Mã số doanh nghiệp in trên hoá đơn"
When rê chuột vào nhãn "Mới"
Then hiện mô tả đó; trường gốc "Ngành" không có nhãn.

**AC-TB05-1 — Ghim trường có sẵn áp cho mọi bản ghi**
Given card Trường bổ sung của Company đang có 2 trường
When mở ⚙, tick "Số nhân sự" ở nhóm Trường có sẵn
Then card có 3 trường, "Số nhân sự" đứng đầu (trường ghim đứng trước trường tuỳ chỉnh); toast "Thay đổi áp dụng cho mọi công ty"; mở company khác cũng thấy "Số nhân sự".

**AC-TB05-2 — Tắt một trường tuỳ chỉnh**
Given card đang hiện "Hạng khách hàng"
When bỏ tick "Hạng khách hàng" trong ⚙
Then trường biến khỏi card ở mọi company; vẫn có ở "Xem tất cả thuộc tính" và ở danh sách.

**AC-TB05-3 — Trường của card chính không có trong ⚙**
Given trang chi tiết Deal
When mở ⚙
Then không có Mã Deal, Tên Deal, Giai đoạn, Ngày dự kiến chốt, Amount, Sale phụ trách (cũ), Lead Id, Test.

**AC-TB06-1 — Trường mới dùng được ở danh sách Contacts**
Given Contact có trường tuỳ chỉnh "Kênh liên hệ ưa thích" (Lựa chọn đơn)
When ở danh sách Contacts bấm "+" và ⊕
Then cả hai danh sách có nhóm "Trường tuỳ chỉnh" chứa trường đó; thêm bộ lọc nhanh thì popover dạng checkbox các lựa chọn.

**AC-TB06-2 — Trường mới của Deal ở bảng Deals**
Given vừa tạo trường Deal "Đối thủ cạnh tranh"
When mở bảng Deals và bật cột đó bằng "+"
Then cột đứng sau các cột có sẵn và trước cột Ngày tạo.

**AC-TB07-1 — Ghim mặc định của Deal**
Given Deals_Pipeline sau khi chạy script CRM-00, chưa có trường tuỳ chỉnh
When mở trang chi tiết DEAL-013
Then card Trường bổ sung có Phí thuê trả trước, Phí khởi tạo (Setup), Số tiền giảm giá; không có Lead Id.

---

## 12. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-CRM09-01 | E2E | Người không có `collection.update_schema` mở trang chi tiết | Không có "+ Thêm", không có ⚙ |
| TC-CRM09-02 | E2E | Tạo trường, bỏ tick "Hiện ở vùng Trường bổ sung" | Không mở trình sửa; toast có câu hướng dẫn bật lại bằng ⚙ |
| TC-CRM09-03 | E2E | Tạo Lựa chọn đơn với hai dòng "A" và "A" | Báo "Lựa chọn “A” bị lặp" |
| TC-CRM09-04 | E2E | Nhấn Enter trong ô Tên | Bấm "Tạo trường" |
| TC-CRM09-05 | E2E | Tạo trường khi mạng lỗi | Hộp thoại còn, nội dung còn, hiện lỗi |
| TC-CRM09-06 | E2E | Tick trong ⚙ khi API lỗi | Checkbox trở lại trạng thái cũ, hiện lỗi |
| TC-CRM09-07 | E2E | Tìm "so" trong ⚙ | Hiện "Số nhân sự", "Mã số thuế" (bỏ dấu) |
| TC-CRM09-08 | E2E | Trường tuỳ chỉnh đồng thời được ghim | Chỉ hiện một lần trong card, theo vị trí ghim |
| TC-CRM09-09 | E2E | Trường tính trong card | Chỉ đọc, không có hiệu ứng rê chuột |
| TC-CRM09-10 | E2E | Người chỉ đọc bản ghi bấm vào giá trị | Không mở trình sửa |
| TC-CRM09-11 | E2E | Sửa Văn bản dài, nhấn Enter | Xuống dòng, không lưu; Ctrl+Enter mới lưu |
| TC-CRM09-12 | E2E | Hộp kiểm trong card | Bấm đổi và lưu ngay, có toast |
| TC-CRM09-13 | E2E | Bộ lọc nhanh trường Hộp kiểm chọn "Có" | Danh sách chỉ còn bản ghi có giá trị Có |
| TC-CRM09-14 | E2E | Xoá trường đang ghim ở Quản lý trường | Card không còn trường đó, không lỗi |
| TC-CRM09-15 | A11y | Mở ⚙, tick, đóng bằng bàn phím | Làm được; checkbox có nhãn là tên trường |
| TC-CRM09-16 | E2E | Màn 390 px | Card nằm trong cột duy nhất sau Thông tin chính |

---

## 13. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Trường tự tạo lưu trong trình duyệt (`db.cf`) | Trường thật của collection qua API sửa schema (F03-S4 §4.1) |
| 11 loại, có Lựa chọn nhiều | 10 loại (F03-S4 §4.1) |
| Trường "Mới" của Deal suy ra từ danh sách key cứng | Cờ `origin` (F03-S4 §3.1) |
| Danh sách trường ghim, trường tắt lưu trong trình duyệt | `display_config.extraFields` dùng chung (F03-S4 §3.2) |
| Ai cũng tạo trường, đổi ghim được | Cần `collection.update_schema` (§10) |
| TB-07 có Lead Id | Không ghim Lead Id (§9) |
| Trạng thái thu gọn không lưu | Lưu theo người dùng (§3) |

---

## 14. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | Nhãn "Mới" hiện vô thời hạn (theo sheet) hay chỉ trong 30 ngày đầu? | PO / khách | §6 |
| Q2 | Ai được đổi trường hiển thị bằng ⚙: chỉ người quản lý trường, hay mọi người dùng? (F03-S4 Q2) | Khách | §7, §10 |
| Q3 | Bỏ "Lựa chọn nhiều" khỏi hộp tạo trường (F03-S4 Q3). Khách có cần không? | PO | §5 |
| Q4 | Bỏ Lead Id khỏi danh sách ghim mặc định (lệch sheet TB-07). Đồng ý? | PO | §9 |
| Q5 | Sales có được tạo trường không, hay chỉ quản lý? Nếu chỉ quản lý thì sale thường không thấy "+ Thêm" | Khách | §10 |

---

## Liên kết

- Plan: `00-PLAN-viet-spec.md`
- Spec nền: `ERPMini/features/features/F03-S4-truong-tuy-chinh-cau-hinh-hien-thi.md`
- Khung: `CRM-01-khung-danh-sach-trang-chi-tiet.md` §3, §4.5, §4.7, §5.4
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` §5
- Design system: `../DESIGN-SYSTEM-HUBSPOT.md` §6.9, §6.9a, §6.11, §6.12
- Đối chiếu: `../DOI-CHIEU-CHUC-NANG.md` §17

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-09-30 | v1.0 — bản đầu | TTS (qua Claude) |

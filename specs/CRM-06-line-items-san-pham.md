# CRM-06 — Line items và thư viện sản phẩm

# Product Requirement Document

| | | | |
|---|---|---|---|
| **Project Owner** | TTS | **Update at** | 02-10-2026 |
| **Created by** | TTS (qua Claude) | **Project** | CRM theo UX HubSpot — HarnexAI ERP |
| **Version** | 2.0 | **Features** | L-01 → L-11 (line items và thư viện sản phẩm) |

**CONTENT**

- USER STORIES
- OVERVIEW FLOW
- USE CASE DESCRIPTION
  - UC-1: Xem card Line items trên trang Deal
  - UC-2: Mở trình sửa, lưu hoặc huỷ
  - UC-3: Nhập số lượng, giá, chiết khấu và tần suất trên bảng
  - UC-4: Thêm line item từ thư viện sản phẩm
  - UC-5: Tạo line item tuỳ chỉnh và lưu vào thư viện
  - UC-6: Sắp xếp, nhân bản, xoá dòng
  - UC-7: Chỉnh sửa cột và tạo thuộc tính tuỳ chỉnh
  - UC-8: Thêm chiết khấu, phí, thuế cấp Deal và xem doanh thu định kỳ
  - UC-9: Dùng tổng line item làm Amount của Deal
- BUSINESS RULE
- ACCEPTANCE CRITERIA
- PHỤ LỤC

**VERSION HISTORY**

| **Ver** | **Author** | **Description** | **Updated at** |
|---|---|---|---|
| 2.0 | TTS (qua Claude) | Viết lại theo mẫu PRD: user story, use case, business rule, acceptance criteria. Nội dung giữ như bản 1.x | 02-10-2026 |
| 1.x | TTS (qua Claude) | Các bản trước 02-10-2026 (v1.0, bản đầu, 30-09-2026) | 30-09-2026 |

---

# USER STORIES

US-LI-01: Là sale, tôi muốn thấy ngay trên trang Deal các sản phẩm, dịch vụ đang chào và tổng tiền để nắm giá trị deal. (L-01)

US-LI-02: Là sale, tôi muốn mở một trình sửa toàn màn hình để thêm, sửa, xoá line item rồi lưu một lần. (L-02, L-05)

US-LI-03: Là sale, tôi muốn chọn sản phẩm từ thư viện và để hệ thống tự điền giá, tần suất, các trường tuỳ chỉnh để không phải gõ lại. (L-03, L-07)

US-LI-04: Là sale, tôi muốn tạo một line item không có trong thư viện, và lưu nó vào thư viện khi cần dùng lại. (L-04)

US-LI-05: Là sale, tôi muốn kéo thả, nhân bản, xoá dòng để sắp bảng line item theo ý mình. (L-08)

US-LI-06: Là quản trị, tôi muốn tạo thuộc tính tuỳ chỉnh cho line item và chọn cột hiển thị để bảng hợp với cách bán hàng của công ty. (L-06)

US-LI-07: Là sale, tôi muốn thêm chiết khấu, phí, thuế cho cả deal để ra đúng tổng tiền phải thu. (L-09)

US-LI-08: Là quản lý kinh doanh, tôi muốn thấy doanh thu định kỳ hằng năm (ARR) và hằng tháng (MRR) của deal để đánh giá phần doanh thu lặp lại. (L-10)

US-LI-09: Là sale, tôi muốn tổng line item tự thành Amount của Deal để không phải nhập tay hai lần. (L-11)

# OVERVIEW FLOW

| **Bước** | **Tác nhân** | **Mô tả** |
|---|---|---|
| 1 | Sale | Mở trang chi tiết một Deal. |
| 2 | Hệ thống | Hiện card "Line items ({n})" ở cột phải: từng dòng, các điều chỉnh, Tổng và ARR. |
| 3 | Sale | Bấm "Sửa" (hoặc "Thêm" khi chưa có line item). |
| 4 | Hệ thống | Mở trình sửa toàn màn hình: thanh công cụ, bảng line item, phần tổng kết. |
| 5 | Sale | Thêm dòng từ thư viện sản phẩm hoặc tạo dòng tuỳ chỉnh. |
| 6 | Hệ thống | Tự điền dòng mới từ sản phẩm, tính lại Thành tiền và tổng kết ngay trên màn hình. |
| 7 | Sale | Sửa số lượng, đơn giá, chiết khấu, tần suất; sắp xếp dòng; thêm chiết khấu, phí, thuế cấp Deal. |
| 8 | Sale | Chọn có dùng tổng làm Amount của Deal hay không, rồi bấm "Lưu". |
| 9 | FE | Kiểm lỗi các ô. Hợp lệ thì gửi toàn bộ danh sách kèm `version`. |
| 10 | Máy chủ | Tính lại mọi con số, lưu trong một giao dịch, ghi Amount nếu deal đang dùng tổng, tăng `line_items_version`. |
| 11 | Hệ thống | Đóng trình sửa, hiện toast, tải lại card Line items, thẻ định danh và timeline. |

# USE CASE DESCRIPTION

## UC-1: Xem card Line items trên trang Deal (L-01)

| | |
|---|---|
| **Actor** | Người dùng đọc được deal |
| **Trigger** | Mở trang chi tiết Deal |
| **Pre-condition** | Deal tồn tại |
| **Main Flow** | 1. Hệ thống gọi API đọc line item của deal (Phụ lục C).<br>2. Hệ thống hiện card thứ ba ở cột phải, header gồm nút thu gọn ▾, "Line items ({n})" và nút "Sửa".<br>3. Hệ thống hiện mỗi line item một hàng: tên, dòng phụ "{SL} × {đơn giá}", thành tiền in đậm bên phải.<br>4. Deal có điều chỉnh cấp Deal: hệ thống hiện thêm hàng nhỏ "Tạm tính" và từng điều chỉnh.<br>5. Hệ thống hiện hàng "Tổng" in đậm.<br>6. Deal có hàng định kỳ: hệ thống hiện thêm hàng nhỏ "Doanh thu định kỳ hằng năm (ARR)".<br>7. Người dùng bấm "Sửa" để mở trình sửa (UC-2). |
| **Post-condition** | Không thay đổi dữ liệu. Số trên card là số máy chủ trả về, FE không tự tính lại. |
| **Exception Flow** | 2a. Deal chưa có line item → header ghi "Line items (0)", nút là "Thêm"; card hiện biểu tượng hoá đơn và câu "Thêm sản phẩm, dịch vụ vào Deal. Tổng line item sẽ thành Amount của Deal."<br>2b. Deal chưa có line item và `use_line_items_amount = false` → câu thứ hai đổi thành "Amount của Deal đang nhập tay."<br>2c. Người chỉ đọc được deal → không có nút "Sửa", "Thêm".<br>3a. Hàng định kỳ → dòng phụ thêm " · {tần suất viết thường} × {kỳ hạn} kỳ", ví dụ "10 × 250.000 ₫ · hằng tháng × 12 kỳ".<br>3b. Hơn 10 line item → card hiện 10 dòng và link "Xem tất cả {n} line item" mở trình sửa. |

## UC-2: Mở trình sửa, lưu hoặc huỷ (L-02)

| | |
|---|---|
| **Actor** | Người dùng ghi được deal |
| **Trigger** | Bấm "Sửa", "Thêm" hoặc "Xem tất cả {n} line item" trên card Line items |
| **Pre-condition** | Đang ở trang chi tiết Deal |
| **Main Flow** | 1. Hệ thống mở trình sửa toàn màn hình và thêm `?edit=line-items` vào URL.<br>2. Hệ thống hiện thanh trên: nút "Huỷ" bên trái, tiêu đề "Line items · {Mã Deal}" kèm Tên Deal chữ nhạt, nút "Lưu" bên phải.<br>3. Hệ thống hiện thanh công cụ: nút "Thêm line item ▾", nút "Chỉnh sửa cột", chữ "Tiền tệ: VND (₫)".<br>4. Hệ thống hiện bảng line item (cột theo Phụ lục A) và phần tổng kết ở cuối.<br>5. Người dùng sửa bảng và phần tổng kết (UC-3 tới UC-9).<br>6. Người dùng bấm "Lưu".<br>7. FE kiểm lỗi các ô theo Phụ lục A, bảng kiểm lỗi.<br>8. FE gửi toàn bộ line item, điều chỉnh, `useLineItemsAmount` và `version` lên máy chủ (Phụ lục C).<br>9. Máy chủ tính lại và lưu trong một giao dịch.<br>10. Hệ thống đóng trình sửa, hiện toast "Đã lưu {n} line item · Tổng {tổng}".<br>11. Hệ thống tải lại card Line items, thẻ định danh (Amount) và timeline. |
| **Post-condition** | Line item, điều chỉnh và lựa chọn dùng tổng làm Amount được lưu. `line_items_version` tăng 1. |
| **Exception Flow** | 6a. Người dùng bấm "Huỷ" hoặc Esc khi có thay đổi chưa lưu → hệ thống hỏi "Bỏ các thay đổi line item?" với hai nút "Bỏ thay đổi" và "Tiếp tục sửa".<br>6b. Bấm "Huỷ" hoặc Esc khi không có thay đổi → đóng trình sửa.<br>6c. Esc khi panel thư viện đang mở → chỉ đóng panel.<br>6d. Bấm nút Back của trình duyệt → đóng trình sửa; có thay đổi thì hỏi như 6a.<br>7a. Có ô lỗi → không gửi request, hiện lỗi ở từng ô, con trỏ vào ô lỗi đầu tiên, toast "Còn {n} ô cần sửa".<br>9a. Người khác đã lưu trước (`409 LINE_ITEMS_CONFLICT`) → "Line items của deal này vừa được người khác sửa. Tải lại để xem bản mới nhất; thay đổi của bạn chưa được lưu." với nút "Tải lại" (bỏ thay đổi) và "Ở lại" (giữ màn hình để chép lại).<br>9b. Máy chủ trả lỗi ô (`422 LINE_ITEM_INVALID`) → hiện lỗi ở đúng ô theo `details.path`.<br>10a. Amount được cập nhật → toast thêm " → Amount của Deal".<br>4a. Màn hẹp dưới 905 px → bảng cuộn ngang trong vùng làm việc, cột Tên dính trái; panel thư viện phủ toàn màn hình. |

## UC-3: Nhập số lượng, giá, chiết khấu và tần suất trên bảng (L-05)

| | |
|---|---|
| **Actor** | Người dùng ghi được deal |
| **Trigger** | Sửa một ô trên bảng line item |
| **Pre-condition** | Trình sửa đang mở, bảng có ít nhất một dòng |
| **Main Flow** | 1. Người dùng nhập Tên, Số lượng, Đơn giá của dòng.<br>2. Người dùng chọn Tần suất thanh toán (mặc định "Một lần").<br>3. Với dòng định kỳ, người dùng nhập Kỳ hạn (số kỳ). Đơn giá của dòng định kỳ là giá một kỳ.<br>4. Người dùng nhập Chiết khấu và chọn kiểu "₫" hoặc "%".<br>5. Người dùng điền các cột tuỳ chọn khác đang hiện (SKU, Giá vốn / đơn vị, Mô tả, thuộc tính tuỳ chỉnh).<br>6. FE tính lại Thành tiền của dòng và phần tổng kết ngay sau mỗi thay đổi ở ô số, theo công thức ở Phụ lục A.<br>7. Với dòng định kỳ, cột Thành tiền có thêm dòng nhỏ "{thành tiền một kỳ} / {tháng · quý · 6 tháng · năm}". |
| **Post-condition** | Số trên màn hình là số tạm. Số cuối cùng là số máy chủ tính khi lưu. |
| **Exception Flow** | 2a. Tần suất là "Một lần" → ô Kỳ hạn hiện "—", không nhập được.<br>2b. Đổi từ "Một lần" sang định kỳ → Kỳ hạn mặc định 1 (hoặc kỳ hạn mặc định của sản phẩm).<br>3a. Người dùng đã tắt cột Kỳ hạn nhưng bảng có ít nhất một dòng định kỳ → cột Kỳ hạn vẫn hiện.<br>Các lỗi nhập (số lượng, đơn giá, chiết khấu, kỳ hạn) báo khi bấm "Lưu", theo BR-02. |

## UC-4: Thêm line item từ thư viện sản phẩm (L-03, L-07)

| | |
|---|---|
| **Actor** | Người dùng ghi được deal |
| **Trigger** | Chọn "Thêm line item ▾ → Chọn từ thư viện sản phẩm" |
| **Pre-condition** | Trình sửa đang mở |
| **Main Flow** | 1. Hệ thống mở panel phải rộng 400 px, tiêu đề "Thư viện sản phẩm", có nút ✕.<br>2. Hệ thống hiện ô tìm "Tìm theo tên, SKU" và danh sách sản phẩm đang bán, sắp theo tên, tải theo trang 50 dòng.<br>3. Người dùng gõ ô tìm để lọc.<br>4. Người dùng tick một hay nhiều sản phẩm. Dòng được tick hiện bộ chỉnh số lượng "− 1 +".<br>5. Người dùng chỉnh số lượng (tối thiểu 1) và bấm "Thêm ({n})".<br>6. Hệ thống thêm n dòng vào cuối bảng. Mỗi dòng tự điền từ sản phẩm theo Phụ lục A, bảng tự điền.<br>7. Hệ thống đóng panel và hiện toast "Đã thêm {n} line item". |
| **Post-condition** | Bảng có thêm n dòng mang `product_id`, dưới tên ghi "Từ thư viện sản phẩm". Giá trị đã được sao chép vào dòng (BR-01). Chưa có gì được lưu cho tới khi bấm "Lưu". |
| **Exception Flow** | 2a. Cuộn tới cuối danh sách → tải thêm trang tiếp.<br>3a. Không có sản phẩm khớp → "Không tìm thấy sản phẩm".<br>5a. Chưa tick sản phẩm nào → nút "Thêm ({n})" vô hiệu.<br>7a. Có ít nhất một thuộc tính tuỳ chỉnh được tự điền → toast thêm " · trường tuỳ chỉnh đã tự điền từ sản phẩm".<br>2b. Người dùng bấm "+ Tạo sản phẩm" ở chân panel → mở panel tạo sản phẩm chồng lên panel thư viện (các ô theo Phụ lục A). Tạo xong, sản phẩm mới hiện trong danh sách và đã được tick.<br>2c. Người không có quyền tạo sản phẩm → không có link "+ Tạo sản phẩm".<br>2d. Sản phẩm đã ngừng bán (`is_active = false`) → không có trong danh sách. |

## UC-5: Tạo line item tuỳ chỉnh và lưu vào thư viện (L-04)

| | |
|---|---|
| **Actor** | Người dùng ghi được deal. Lưu vào thư viện cần thêm quyền tạo sản phẩm |
| **Trigger** | Chọn "Thêm line item ▾ → Tạo line item tuỳ chỉnh" |
| **Pre-condition** | Trình sửa đang mở |
| **Main Flow** | 1. Hệ thống thêm một dòng trống vào cuối bảng: tên trống, SL 1, đơn giá 0, "Một lần", không có `product_id`. Dưới tên ghi "Line item tuỳ chỉnh".<br>2. Hệ thống đặt con trỏ vào ô Tên.<br>3. Người dùng nhập tên, đơn giá và các ô khác.<br>4. Khi muốn dùng lại, người dùng chọn ⋯ → "Lưu vào thư viện sản phẩm".<br>5. Hệ thống tạo ngay một sản phẩm từ tên, đơn giá, tần suất, kỳ hạn (thành kỳ hạn mặc định), SKU, giá vốn, mô tả của dòng. Giá trị các thuộc tính tuỳ chỉnh của dòng thành giá trị mặc định của sản phẩm.<br>6. Dòng nhận `product_id` mới, chữ nhỏ dưới tên đổi thành "Từ thư viện sản phẩm".<br>7. Hệ thống hiện toast "Đã lưu “{tên}” vào thư viện sản phẩm". |
| **Post-condition** | Thư viện có sản phẩm mới. Sản phẩm này vẫn được giữ kể cả khi sau đó người dùng huỷ trình sửa. |
| **Exception Flow** | 4a. Tên dòng còn trống → toast "Nhập tên trước khi lưu vào thư viện".<br>4b. Không có quyền tạo sản phẩm → mục "Lưu vào thư viện sản phẩm" không hiện.<br>5a. SKU trùng sản phẩm khác → hiện lỗi của API ngay dưới dòng, không tạo sản phẩm.<br>Sau khi đã lưu vào thư viện, người dùng bấm "Huỷ" trình sửa → hộp hỏi ghi thêm "Sản phẩm đã lưu vào thư viện vẫn được giữ." |

## UC-6: Sắp xếp, nhân bản, xoá dòng (L-08)

| | |
|---|---|
| **Actor** | Người dùng ghi được deal |
| **Trigger** | Kéo tay nắm ⋮⋮ của dòng, hoặc mở menu ⋯ của dòng |
| **Pre-condition** | Trình sửa đang mở, bảng có ít nhất một dòng |
| **Main Flow** | 1. Người dùng kéo tay nắm ⋮⋮ để đổi thứ tự dòng.<br>2. Hoặc người dùng mở menu ⋯ và chọn "Chuyển lên", "Chuyển xuống" để đổi chỗ với dòng trên, dòng dưới.<br>3. Người dùng chọn ⋯ → "Nhân bản": hệ thống chèn bản sao ngay dưới dòng, giữ `product_id` và mọi giá trị, không có id.<br>4. Người dùng chọn ⋯ → "Xoá": hệ thống bỏ dòng khỏi bảng ngay, không hỏi.<br>5. Người dùng bấm "Lưu" (UC-2). |
| **Post-condition** | Thứ tự dòng lưu vào `sort_order`. Dòng bị xoá chỉ thật sự xoá khi đã bấm "Lưu". |
| **Exception Flow** | 1a. Dùng bàn phím: khi tay nắm đang được chọn, Alt+↑ / Alt+↓ đổi chỗ với dòng trên, dòng dưới; có thông báo cho trình đọc màn hình.<br>2a. Dòng đầu không có mục "Chuyển lên". Dòng cuối không có mục "Chuyển xuống".<br>5a. Người dùng bấm "Huỷ" và xác nhận bỏ → dòng đã xoá còn nguyên, dòng nhân bản không được tạo, thứ tự như cũ. |

## UC-7: Chỉnh sửa cột và tạo thuộc tính tuỳ chỉnh (L-06)

| | |
|---|---|
| **Actor** | Người dùng ghi được deal. Tạo thuộc tính cần quyền sửa cấu trúc `crm_line_items` |
| **Trigger** | Bấm "Chỉnh sửa cột" trên thanh công cụ của trình sửa |
| **Pre-condition** | Trình sửa đang mở |
| **Main Flow** | 1. Hệ thống mở modal lớn "Chọn cột hiển thị", bố cục theo Phụ lục A.<br>2. Bên trái, người dùng tìm và tick các thuộc tính muốn hiện, trong nhóm "Thuộc tính có sẵn" và "Thuộc tính tuỳ chỉnh ({n})".<br>3. Bên phải, "Cột đang hiển thị ({n})": người dùng kéo để đổi thứ tự hoặc bấm ✕ để bỏ cột.<br>4. Khi cần thuộc tính mới, người dùng điền khối "Tạo thuộc tính line item mới": Tên, Loại, và các lựa chọn nếu loại là Lựa chọn đơn; rồi bấm "Tạo thuộc tính".<br>5. Hệ thống tạo trường trên `crm_line_items` và trường cùng key trên `crm_products` trong một giao dịch.<br>6. Thuộc tính mới vào nhóm tuỳ chỉnh, được tick sẵn. Hệ thống hiện toast "Đã tạo thuộc tính “{tên}”. Điền giá trị ngay trên từng line item."<br>7. Người dùng bấm "Áp dụng".<br>8. Bảng hiện các cột đã chọn theo thứ tự mới. Tiêu đề cột của thuộc tính tuỳ chỉnh có nhãn nhỏ "tuỳ chỉnh". |
| **Post-condition** | Cấu hình cột lưu theo người dùng, áp cho mọi deal. Thuộc tính tuỳ chỉnh mới có trên mọi deal vì là trường của collection. |
| **Exception Flow** | 4a. Người không có quyền sửa cấu trúc `crm_line_items` → không thấy khối "Tạo thuộc tính line item mới".<br>4b. Tên trùng một thuộc tính đã có (không phân biệt hoa thường, bỏ dấu) → "Đã có thuộc tính tên này" dưới ô Tên.<br>4c. Loại Lựa chọn đơn mà không có lựa chọn nào → "Nhập ít nhất một lựa chọn".<br>7a. Người dùng bấm "Huỷ" → đóng modal, cột không đổi.<br>Người dùng chưa từng chỉnh cột → bảng dùng bộ cột mặc định (BR-09). |

## UC-8: Thêm chiết khấu, phí, thuế cấp Deal và xem doanh thu định kỳ (L-09, L-10)

| | |
|---|---|
| **Actor** | Người dùng ghi được deal |
| **Trigger** | Bấm "+ Chiết khấu", "+ Phí" hoặc "+ Thuế" ở phần tổng kết |
| **Pre-condition** | Trình sửa đang mở |
| **Main Flow** | 1. Hệ thống hiện phần tổng kết ở cuối, canh phải, rộng 420 px, dòng đầu là "Tạm tính" (tổng Thành tiền các dòng).<br>2. Người dùng bấm một trong ba link "+ Chiết khấu", "+ Phí", "+ Thuế".<br>3. Hệ thống thêm một dòng điều chỉnh với giá trị mặc định theo Phụ lục A.<br>4. Người dùng sửa loại, tên, giá trị và kiểu "% / ₫" của dòng điều chỉnh.<br>5. Hệ thống hiện số tiền tính được của từng dòng: "− " cho chiết khấu, "+ " cho phí và thuế.<br>6. Hệ thống tính "Tổng" theo thứ tự: mọi chiết khấu, rồi mọi phí, rồi mọi thuế (BR-04).<br>7. Bảng có ít nhất một dòng định kỳ: hệ thống hiện thêm "Doanh thu định kỳ hằng năm (ARR)" và "Doanh thu định kỳ hằng tháng (MRR)", chữ nhỏ.<br>8. Người dùng bấm ✕ ở một dòng điều chỉnh để bỏ dòng đó. |
| **Post-condition** | Các điều chỉnh lưu cùng line item khi bấm "Lưu". ARR, MRR chỉ hiển thị, không lưu. |
| **Exception Flow** | 1a. Có chiết khấu dòng → dưới Tạm tính có dòng chữ nhỏ "Đã gồm chiết khấu dòng  − {số}".<br>4a. Điều chỉnh kiểu % lớn hơn 100 → khi Lưu báo "Phần trăm không được lớn hơn 100" dưới ô.<br>6a. Người dùng thêm thuế trước, chiết khấu sau → kết quả không đổi, vì thứ tự áp dụng không theo thứ tự hiển thị.<br>7a. Không có dòng định kỳ → không hiện ARR, MRR. |

## UC-9: Dùng tổng line item làm Amount của Deal (L-11)

| | |
|---|---|
| **Actor** | Người dùng ghi được deal |
| **Trigger** | Tick hoặc bỏ tick ô "Dùng tổng line item làm Amount của Deal (Tổng Cash-In Dự Kiến)" bên trái phần tổng kết |
| **Pre-condition** | Trình sửa đang mở. Ô tick lấy giá trị `use_line_items_amount` của deal (mặc định bật) |
| **Main Flow** | 1. Người dùng để ô ở trạng thái tick.<br>2. Bảng có ít nhất một dòng và Tổng khác Amount hiện tại: hệ thống hiện chữ nhỏ "Amount hiện tại {Amount} sẽ thành {Tổng} khi lưu."<br>3. Người dùng bấm "Lưu". FE gửi `useLineItemsAmount` cùng request.<br>4. Máy chủ ghi Amount bằng tổng line item trong cùng giao dịch, ghi lịch sử Amount với ghi chú "từ line items".<br>5. Timeline Deal có sự kiện "Thay đổi thuộc tính" của Amount.<br>6. Ô Amount trên thẻ định danh bị khoá. |
| **Post-condition** | Amount của Deal bằng tổng line item. FE không tự ghi Amount. |
| **Exception Flow** | 2a. Tổng bằng Amount hiện tại → không hiện chữ nhỏ.<br>1a. Người dùng bỏ tick → chữ nhỏ "Amount giữ nguyên {Amount}, nhập tay ở thẻ định danh." Sau khi lưu, Amount không đổi và ô Amount ở thẻ định danh sửa được.<br>6a. Có lần ghi Amount khác khi deal có line item và đang dùng tổng → máy chủ từ chối với `422 AMOUNT_LOCKED`. |

# BUSINESS RULE

| **BR** | **Mô tả** |
|---|---|
| BR-01 | **Line item sao chép từ sản phẩm**<br>- Khi thêm từ thư viện, giá trị của sản phẩm được sao chép vào line item.<br>- Sau này đổi giá hay mô tả sản phẩm không làm đổi line item đã có.<br>- Thư viện chỉ liệt kê sản phẩm đang bán (`is_active = true`).<br>- Dòng cũ trỏ tới sản phẩm đã ngừng bán vẫn hợp lệ và giữ nguyên. Thêm dòng mới từ sản phẩm ngừng bán thì máy chủ trả `422 PRODUCT_INACTIVE`. |
| BR-02 | **Ràng buộc ô nhập**<br>- Tên: bắt buộc. Lỗi "Line item cần có tên".<br>- Số lượng: lớn hơn 0, tạm thời cho tối đa 2 chữ số thập phân (câu hỏi Q3). Lỗi "Số lượng phải lớn hơn 0".<br>- Đơn giá: từ 0 trở lên. Lỗi "Đơn giá không được âm".<br>- Chiết khấu dòng: từ 0 trở lên; kiểu % thì không quá 100. Lỗi "Chiết khấu phần trăm không được lớn hơn 100".<br>- Kỳ hạn: số nguyên từ 1 trở lên, bắt buộc với dòng định kỳ. Lỗi "Nhập số kỳ".<br>- Điều chỉnh cấp Deal kiểu %: không quá 100. Lỗi "Phần trăm không được lớn hơn 100".<br>- Một deal có tối đa 200 line item. Lỗi "Một deal có tối đa 200 line item" (toast). |
| BR-03 | **Công thức mỗi dòng (bản tóm tắt, đầy đủ ở Phụ lục A)**<br>- Thành tiền một kỳ = Số lượng × Đơn giá − chiết khấu dòng, không nhỏ hơn 0.<br>- Chiết khấu dòng trừ trên thành tiền một kỳ của cả dòng (SL × đơn giá), không phải trên từng đơn vị (câu hỏi Q1).<br>- Số kỳ = 1 với "Một lần"; bằng Kỳ hạn với dòng định kỳ.<br>- Thành tiền của dòng = thành tiền một kỳ × số kỳ.<br>- Giá vốn / đơn vị chỉ để tham khảo, không vào công thức tổng. |
| BR-04 | **Công thức cả deal: chiết khấu → phí → thuế (bản tóm tắt, đầy đủ ở Phụ lục A)**<br>- Tạm tính = tổng Thành tiền các dòng.<br>- Thứ tự áp dụng không phụ thuộc thứ tự hiển thị: mọi chiết khấu, rồi mọi phí, rồi mọi thuế.<br>- Chiết khấu và phí theo % đều tính trên Tạm tính, không cộng dồn lẫn nhau.<br>- Cơ sở tính thuế = Tạm tính − tổng chiết khấu + tổng phí, không nhỏ hơn 0.<br>- Mỗi dòng thuế tính trên cùng cơ sở đó. Hai dòng thuế không tính thuế chồng thuế.<br>- Tổng = cơ sở tính thuế + tổng thuế, không nhỏ hơn 0.<br>- Chiết khấu cấp Deal lớn hơn Tạm tính cộng phí: cơ sở tính thuế bằng 0, thuế theo % bằng 0, Tổng bằng tổng các thuế theo ₫ (nếu có).<br>- Deal không có line item: `line_items_total = null` và bỏ qua điều chỉnh.<br>- Dưới phần tổng kết có chữ nhỏ "Thuế tính sau chiết khấu và phí." |
| BR-05 | **Làm tròn**<br>- Máy chủ tính với số thập phân và làm tròn tới đồng (nửa lên) ở ba chỗ: thành tiền mỗi dòng, số tiền mỗi dòng điều chỉnh, và tổng.<br>- Ví dụ: SL 1,5 × đơn giá 333.333 → Thành tiền 500.000. |
| BR-06 | **Doanh thu định kỳ**<br>- ARR = tổng (thành tiền một kỳ × số kỳ trong năm) trên các dòng định kỳ. Số kỳ trong năm: Hằng tháng 12, Hằng quý 4, Nửa năm 2, Hằng năm 1.<br>- MRR = ARR ÷ 12.<br>- ARR, MRR làm tròn tới đồng, chỉ hiển thị, không lưu.<br>- ARR, MRR không trừ chiết khấu và thuế cấp Deal.<br>- Chỉ hiện khi có ít nhất một dòng định kỳ. |
| BR-07 | **Số của máy chủ là số cuối cùng**<br>- Trong trình sửa, FE tính theo đúng công thức ở Phụ lục A để phản hồi tức thì.<br>- Khi lưu, máy chủ tự tính `net`, `lineTotal`, số tiền điều chỉnh và tổng; giá trị FE gửi cho các trường tính bị bỏ qua.<br>- Card Line items trên trang Deal dùng số máy chủ trả về, không tự tính lại. |
| BR-08 | **Lưu toàn bộ danh sách và chống ghi đè**<br>- Mỗi lần lưu, FE gửi toàn bộ line item và điều chỉnh sau khi sửa.<br>- Phần tử có `id` là sửa; không có `id` là tạo mới; `id` đang có mà không được gửi là xoá (xoá mềm).<br>- Máy chủ đặt lại `sortOrder` theo thứ tự mảng.<br>- Mọi thay đổi nằm trong một giao dịch: line item, điều chỉnh, `use_line_items_amount`, tổng line item, có thể cả Amount, và `line_items_version + 1`.<br>- `version` gửi lên khác `line_items_version` hiện tại: máy chủ trả `409 LINE_ITEMS_CONFLICT` và không ghi gì.<br>- Sửa line item qua API bản ghi chung vẫn được, dành cho nhập file và workflow; tổng vẫn được tính lại và `line_items_version` vẫn tăng. |
| BR-09 | **Cột của bảng**<br>- Cột luôn hiện: Kéo, Tên, Số lượng, Đơn giá, Thành tiền, ⋯.<br>- Cột tuỳ chọn mặc định: Tần suất thanh toán, Kỳ hạn, Chiết khấu, rồi mọi thuộc tính tuỳ chỉnh.<br>- Danh sách và thứ tự cột tuỳ chọn lưu theo người dùng, áp cho mọi deal.<br>- Cột Kỳ hạn luôn hiện khi bảng có ít nhất một dòng định kỳ, kể cả khi người dùng đã tắt, vì đây là ô bắt buộc với dòng định kỳ. |
| BR-10 | **Thuộc tính tuỳ chỉnh đi cặp**<br>- Tạo thuộc tính line item là tạo trường trên `crm_line_items` và trường cùng key trên `crm_products`, trong một giao dịch.<br>- Key sinh từ tên, tiền tố `cf_`.<br>- Trường trên sản phẩm giữ giá trị mặc định để tự điền khi thêm từ thư viện. Sản phẩm không có giá trị thì ô trên line item để trống.<br>- Tên thuộc tính không được trùng thuộc tính đã có (không phân biệt hoa thường, bỏ dấu). |
| BR-11 | **Lưu dòng tuỳ chỉnh vào thư viện**<br>- Chỉ dòng tuỳ chỉnh (không có `product_id`) mới có mục "Lưu vào thư viện sản phẩm".<br>- Sản phẩm được tạo ngay, không chờ bấm "Lưu" của trình sửa, và vẫn được giữ khi huỷ trình sửa.<br>- SKU lấy từ dòng, có thể trống. SKU trùng sản phẩm khác thì không tạo. |
| BR-12 | **Amount của Deal**<br>- Deal có `use_line_items_amount` bật (mặc định) và có line item: Amount bằng tổng line item, do máy chủ ghi.<br>- Trong trạng thái đó, ô Amount trên thẻ định danh bị khoá và máy chủ từ chối mọi lần ghi Amount khác (`422 AMOUNT_LOCKED`).<br>- Bỏ tick: Amount giữ nguyên, nhập tay ở thẻ định danh.<br>- FE không tự ghi Amount, vì hai người lưu cùng lúc sẽ ra số sai. |
| BR-13 | **Tiền tệ**<br>- Tiền tệ cố định VND (₫), không đổi được. |
| BR-14 | **Quyền**<br>- Xem card Line items: đọc được deal.<br>- Mở trình sửa, lưu: ghi được deal. Không cần quyền riêng trên `crm_line_items`, `crm_deal_adjustments`; API kiểm quyền trên deal rồi ghi thay.<br>- Tạo sản phẩm (từ thư viện hoặc "Lưu vào thư viện sản phẩm"): `record.write` trên `crm_products`.<br>- Tạo thuộc tính line item: `collection.update_schema` trên `crm_line_items` (và `crm_products`, vì trường đi cặp). |

# ACCEPTANCE CRITERIA

AC-1: Card hiện đúng số liệu (L-01)

- DEAL-013 có ba dòng và ba điều chỉnh như ví dụ ở Phụ lục A.
- Card "Line items (3)" có ba hàng với thành tiền 43.200.000 ₫, 3.000.000 ₫, 30.000.000 ₫.
- Hàng "User bổ sung / tháng" ghi "10 × 250.000 ₫ · hằng tháng × 12 kỳ".
- Card có Tạm tính, ba điều chỉnh, Tổng 85.330.800 ₫, ARR 30.000.000 ₫.

AC-2: Deal chưa có line item (L-01)

- DEAL-004 chưa có line item, đang dùng tổng làm Amount.
- Card ghi "Line items (0)", câu "Thêm sản phẩm, dịch vụ vào Deal. Tổng line item sẽ thành Amount của Deal." và nút "Thêm".
- Người chỉ đọc được deal không thấy nút "Sửa", "Thêm".

AC-3: Huỷ, Back, Esc trong trình sửa (L-02)

- Đã đổi số lượng một dòng rồi bấm "Huỷ" → hỏi "Bỏ các thay đổi line item?"; chọn "Bỏ thay đổi" thì đóng, card không đổi.
- Bấm nút Back của trình duyệt khi có thay đổi → hỏi trước khi đóng.
- Esc khi panel thư viện đang mở → chỉ panel đóng.

AC-4: Màn hẹp (L-02)

- Màn 390 px: bảng cuộn ngang, cột Tên dính trái, panel thư viện phủ toàn màn hình.

AC-5: Chọn nhiều từ thư viện (L-03)

- Gõ "HX-ST", tick hai sản phẩm STARTER, tăng số lượng gói 12 tháng lên 2, bấm "Thêm (2)".
- Bảng có thêm hai dòng với đúng tên, đơn giá, SL 1 và 2. Panel đóng.

AC-6: Sản phẩm ngừng bán (L-03)

- Sản phẩm "Đào tạo onsite (buổi)" có `is_active = false` → không có trong thư viện.
- Dòng cũ đã dùng sản phẩm đó ở deal khác vẫn giữ nguyên.
- Gọi PUT thêm dòng mới từ sản phẩm ngừng bán → `422 PRODUCT_INACTIVE`.
- Đổi giá sản phẩm sau khi đã thêm vào deal → line item giữ giá cũ.

AC-7: Line item tuỳ chỉnh và lưu vào thư viện (L-04)

- Ở DEAL-013, tạo line item tuỳ chỉnh "Tích hợp Zalo OA", đơn giá 12.000.000, chọn ⋯ → "Lưu vào thư viện sản phẩm".
- Thư viện có sản phẩm "Tích hợp Zalo OA" giá 12.000.000 ₫; chữ nhỏ của dòng đổi thành "Từ thư viện sản phẩm".
- "Lưu vào thư viện" với SKU trùng → báo lỗi dưới dòng, không tạo sản phẩm.
- Lưu vào thư viện rồi huỷ trình sửa → hộp hỏi nhắc "Sản phẩm đã lưu vào thư viện vẫn được giữ."; thư viện vẫn có sản phẩm.

AC-8: Hàng định kỳ (L-05)

- Dòng "User bổ sung / tháng" SL 10, đơn giá 250.000, Hằng tháng, kỳ hạn 12 → Thành tiền 30.000.000 ₫ với dòng nhỏ "2.500.000 ₫ / tháng".
- Đổi tần suất về "Một lần" → ô kỳ hạn thành "—", Thành tiền 2.500.000 ₫.
- Người dùng đã tắt cột Kỳ hạn, thêm sản phẩm Hằng tháng → cột Kỳ hạn hiện lại.

AC-9: Chiết khấu dòng và làm tròn (L-05)

- Dòng SL 1, đơn giá 48.000.000, chiết khấu 10 kiểu % → Thành tiền 43.200.000 ₫.
- Nhập chiết khấu 120 kiểu % → khi Lưu báo "Chiết khấu phần trăm không được lớn hơn 100".
- Chiết khấu ₫ lớn hơn Số lượng × Đơn giá → thành tiền một kỳ bằng 0, không âm.
- SL 1,5 × 333.333 → Thành tiền 500.000.

AC-10: Tạo thuộc tính tuỳ chỉnh (L-06)

- Người có quyền sửa cấu trúc line item tạo thuộc tính "Số user" loại Số trong "Chỉnh sửa cột", bấm "Áp dụng".
- Bảng có cột "Số user" với nhãn "tuỳ chỉnh", điền được trên từng dòng.
- `crm_products` có trường cùng key.
- Tạo thuộc tính tên "số user" khi đã có "Số user" → báo "Đã có thuộc tính tên này".

AC-11: Cấu hình cột theo người dùng (L-06)

- Minh ẩn cột Chiết khấu trong trình sửa.
- Lan mở trình sửa của cùng deal vẫn thấy cột Chiết khấu.
- Minh mở trình sửa deal khác thì cột Chiết khấu vẫn ẩn.

AC-12: Tự điền giá trị mặc định (L-07)

- Sản phẩm "HarnexAI STARTER – 12 tháng" có mặc định "Số user" = 5 → dòng mới thêm từ thư viện có Số user = 5.
- Toast có "trường tuỳ chỉnh đã tự điền từ sản phẩm".
- Thêm 3 sản phẩm, chỉ 1 sản phẩm có mặc định trường tuỳ chỉnh → toast vẫn có phần "đã tự điền".

AC-13: Sắp xếp dòng (L-08)

- Ba dòng A, B, C. Kéo C lên đầu, rồi ⋯ → "Chuyển xuống" ở C, rồi Lưu → thứ tự lưu là A, C, B.
- Mở lại trình sửa vẫn đúng thứ tự đó.
- Đổi thứ tự bằng Alt+↑ làm được, có thông báo cho trình đọc màn hình.

AC-14: Nhân bản và xoá (L-08)

- Dòng A: chọn ⋯ → "Nhân bản", rồi ⋯ → "Xoá" ở dòng gốc, rồi bấm Huỷ và xác nhận bỏ → dữ liệu đã lưu không đổi.
- Gọi PUT thiếu một `id` đang có → dòng đó bị xoá mềm.

AC-15: Thứ tự chiết khấu, phí, thuế (L-09)

- Tạm tính 76.200.000. Thêm "Thuế VAT 8%" trước, rồi "Chiết khấu Deal 1.000.000 ₫", rồi "Phí triển khai 5%".
- VAT tính trên 79.010.000 (= 76.200.000 − 1.000.000 + 3.810.000) ra 6.320.800.
- Tổng 85.330.800 ₫.
- Hai dòng thuế 8% và 2% → cả hai tính trên cùng cơ sở, không chồng.

AC-16: Chiết khấu Deal vượt tạm tính (L-09)

- Chiết khấu Deal 100% và phí 0 → Tổng 0, kể cả khi có thuế theo %.
- Tạm tính 10.000.000, chiết khấu Deal 12.000.000 ₫, VAT 10% → Tổng 0.

AC-17: ARR, MRR (L-10)

- Deal chỉ có hàng Một lần → không hiện ARR, MRR.
- Thêm dòng Hằng quý SL 1, đơn giá 6.000.000, kỳ hạn 4 → phần tổng kết hiện ARR 24.000.000 ₫ và MRR 2.000.000 ₫.
- Ví dụ DEAL-013: ARR 30.000.000, MRR 2.500.000.

AC-18: Amount theo tổng (L-11)

- DEAL-013 Amount 200.000.000 ₫ nhập tay, ô "Dùng tổng line item làm Amount" đang tick, tổng line item 85.330.800 ₫.
- Trước khi lưu, chữ nhỏ ghi "Amount hiện tại 200.000.000 ₫ sẽ thành 85.330.800 ₫ khi lưu."
- Sau khi lưu: thẻ định danh hiện Amount 85.330.800 ₫, ô Amount bị khoá, timeline có sự kiện "Thay đổi thuộc tính" Amount.

AC-19: Bỏ dùng tổng (L-11)

- DEAL-013 có tổng line item 85.330.800 ₫, Amount 85.330.800 ₫, đang dùng tổng.
- Bỏ tick, sửa một line item làm tổng thành 90.000.000 ₫, rồi lưu → Amount giữ 85.330.800 ₫.
- Ô Amount ở thẻ định danh sửa được.

AC-20: Hai người cùng sửa (L-02)

- Minh và Lan cùng mở trình sửa DEAL-013 (version 7). Minh lưu trước, rồi Lan lưu.
- Lan nhận thông báo "Line items của deal này vừa được người khác sửa…"; dữ liệu là bản của Minh.
- PUT với `version` cũ → `409 LINE_ITEMS_CONFLICT`, không ghi gì.

AC-21: Máy chủ tự tính và giới hạn (L-05, L-09)

- PUT gửi `lineTotal` sai → máy chủ bỏ qua, tự tính.
- PUT 201 dòng → `422 LINE_ITEMS_TOO_MANY`.
- Công thức với ví dụ DEAL-013 ra Tổng 85.330.800, ARR 30.000.000.

AC-22: Quyền (L-01, L-02)

- Người chỉ đọc deal gọi PUT → 403.
- Người ghi được deal nhưng không có quyền trên `crm_line_items` gọi PUT → 200.
- Người không có quyền tạo sản phẩm → không có link "+ Tạo sản phẩm" và mục "Lưu vào thư viện sản phẩm".

# PHỤ LỤC

## A. Màn hình và dữ liệu hiển thị

**Card Line items trên trang Deal**

Card thứ ba ở cột phải trang chi tiết Deal (xem CRM-04, phần card bên phải của Deal; `rightCards` có `ref:crm_line_items.deal_id`).

| Phần | Nội dung |
|---|---|
| Header | ▾ thu gọn · "Line items ({n})" · nút "Sửa" (có line item) hoặc "Thêm" (chưa có). Cả hai mở trình sửa |
| Hàng line item | Trái: tên. Dưới tên, chữ nhạt: "{SL} × {đơn giá}"; hàng định kỳ thêm " · {tần suất viết thường} × {kỳ hạn} kỳ". Phải: thành tiền, in đậm |
| Hàng điều chỉnh | Chỉ khi có điều chỉnh cấp Deal: "Tạm tính" và từng điều chỉnh, ví dụ "Thuế · VAT (8%)  + 6.320.800 ₫", "Chiết khấu · Chiết khấu Deal  − 1.000.000 ₫" |
| Hàng "Tổng" | In đậm |
| Hàng ARR | Chỉ khi có hàng định kỳ: "Doanh thu định kỳ hằng năm (ARR)" |
| Giới hạn | Tối đa 10 line item; nhiều hơn thì "Xem tất cả {n} line item" mở trình sửa |
| Trạng thái rỗng | Biểu tượng hoá đơn + "Thêm sản phẩm, dịch vụ vào Deal. Tổng line item sẽ thành Amount của Deal." + nút "Thêm". Khi `use_line_items_amount = false`, câu thứ hai đổi thành "Amount của Deal đang nhập tay." |

**Khung trình sửa toàn màn hình**

Theo DESIGN-SYSTEM-HUBSPOT, phần trình dựng toàn màn.

- Thanh trên cao 56 px, nền shell: nút "Huỷ" (trái) · tiêu đề "Line items · {Mã Deal}" kèm Tên Deal chữ nhạt · nút "Lưu" (phải).
- Vùng làm việc: thanh công cụ · bảng · phần tổng kết. Panel thư viện sản phẩm mở ở bên phải khi cần.
- Thanh công cụ: nút split "Thêm line item ▾" (Chọn từ thư viện sản phẩm · Tạo line item tuỳ chỉnh) · nút "Chỉnh sửa cột" · chữ "Tiền tệ: **VND (₫)**" (cố định, không đổi được).
- URL thêm `?edit=line-items` để nút Back của trình duyệt đóng trình sửa.
- Toast khi lưu xong: "Đã lưu {n} line item · Tổng {tổng}", thêm " → Amount của Deal" nếu Amount được cập nhật.

**Cột của bảng (theo thứ tự)**

| # | Cột | Luôn hiện | Ô nhập | Ghi chú |
|---|---|---|---|---|
| 1 | Kéo | ✓ | Tay nắm ⋮⋮ | Đổi thứ tự dòng |
| 2 | Tên | ✓ | Ô chữ | Dưới tên chữ nhỏ "Từ thư viện sản phẩm" hoặc "Line item tuỳ chỉnh" |
| 3… | Các cột tuỳ chọn theo cấu hình | | | Mặc định: Tần suất thanh toán, Kỳ hạn, Chiết khấu, rồi mọi thuộc tính tuỳ chỉnh |
| … | Số lượng | ✓ | Ô số | > 0. Số thập phân theo câu hỏi mở về số lượng ở CRM-00; tạm thời cho tối đa 2 chữ số thập phân |
| … | Đơn giá | ✓ | Ô tiền | ≥ 0. Hàng định kỳ là giá một kỳ |
| … | Thành tiền | ✓ | Chỉ đọc | Tính theo công thức bên dưới. Hàng định kỳ có dòng nhỏ "{thành tiền một kỳ} / {tháng · quý · 6 tháng · năm}" |
| cuối | ⋯ | ✓ | Menu dòng | Xem bảng menu dòng |

**Cột tuỳ chọn có sẵn**

| Cột | Ô nhập | Quy tắc |
|---|---|---|
| Tần suất thanh toán | Chọn (D-FREQ) | Mặc định "Một lần" |
| Kỳ hạn (số kỳ) | Ô số nguyên | ≥ 1. Tần suất "Một lần" thì ô hiện "—", không nhập được. Đổi từ "Một lần" sang định kỳ thì kỳ hạn mặc định 1 (hoặc kỳ hạn mặc định của sản phẩm). Luôn hiện khi bảng có ít nhất một dòng định kỳ, kể cả khi người dùng đã tắt cột này, vì đây là ô bắt buộc với dòng định kỳ |
| Chiết khấu | Ô số + chọn "₫ / %" | ≥ 0; kiểu % thì ≤ 100. Chiết khấu trừ trên thành tiền một kỳ của cả dòng (SL × đơn giá), không phải trên từng đơn vị |
| SKU | Ô chữ | Sao chép từ sản phẩm |
| Giá vốn / đơn vị | Ô tiền | Chỉ để tham khảo, không vào công thức tổng |
| Mô tả | Ô chữ | |

Ô nhập của thuộc tính tuỳ chỉnh trên dòng: Văn bản → ô chữ; Số → ô số canh phải; Ngày → chọn ngày; Lựa chọn đơn → ô chọn có mục trống; Hộp kiểm → ô tick giữa ô.

**Panel "Thư viện sản phẩm" (rộng 400 px)**

- Tiêu đề "Thư viện sản phẩm" · nút ✕.
- Ô tìm "Tìm theo tên, SKU", không phân biệt hoa thường, bỏ dấu. Máy chủ cần extension `unaccent`; bộ lọc `contains` của F03 hiện chưa bỏ dấu.
- Danh sách sản phẩm đang bán (`is_active = true`), sắp theo tên. Mỗi dòng: checkbox · tên đậm · "{SKU} · {tần suất}" · mô tả chữ nhạt (1 dòng) · đơn giá bên phải.
- Tick một sản phẩm: hiện bộ chỉnh số lượng "− 1 +" ở dòng đó. Số lượng tối thiểu 1.
- Chân panel: link "+ Tạo sản phẩm" · nút "Thêm ({n})", vô hiệu khi chưa chọn.
- Tải theo trang 50 dòng, cuộn tới cuối tải thêm. Không tìm thấy: "Không tìm thấy sản phẩm".
- Toast sau khi thêm: "Đã thêm {n} line item"; có ít nhất một thuộc tính tuỳ chỉnh được tự điền thì thêm " · trường tuỳ chỉnh đã tự điền từ sản phẩm".

**Bảng tự điền từ sản phẩm (L-07)**

| Line item | Lấy từ sản phẩm |
|---|---|
| `product_id` | id sản phẩm |
| `name`, `sku`, `cost_price`, `description` | cùng tên trường |
| `unit_price` | `unit_price` |
| `billing_frequency` | `billing_frequency` |
| `term` | `default_term` (trống thì 1; tần suất Một lần thì trống) |
| `quantity` | số lượng chọn trong panel |
| `discount_type`, `discount_value` | `₫`, 0 |
| Mỗi thuộc tính tuỳ chỉnh của line item | Giá trị mặc định cùng key trên sản phẩm (F03-S4, trường đi cặp). Sản phẩm không có giá trị thì để trống |

**Panel "+ Tạo sản phẩm"**

Panel tạo bản ghi của `crm_products` (khung panel tạo bản ghi của CRM-01), chồng lên panel thư viện. Các ô: Tên* · SKU · Đơn giá* · Tần suất thanh toán* (mặc định Một lần) · Kỳ hạn mặc định (chỉ hiện khi định kỳ) · Giá vốn · Mô tả · các giá trị mặc định của thuộc tính tuỳ chỉnh. Tạo xong, sản phẩm mới hiện trong danh sách và đã được tick.

**Menu ⋯ của dòng**

| Mục | Hiện khi | Hành vi |
|---|---|---|
| Nhân bản | Luôn | Chèn bản sao ngay dưới dòng (không có id, giữ `product_id` và mọi giá trị) |
| Lưu vào thư viện sản phẩm | Dòng tuỳ chỉnh và có quyền tạo sản phẩm | Theo UC-5 |
| Chuyển lên | Không phải dòng đầu | Đổi chỗ với dòng trên |
| Chuyển xuống | Không phải dòng cuối | Đổi chỗ với dòng dưới |
| vạch ngăn | | |
| Xoá | Luôn | Bỏ dòng khỏi bảng ngay, không hỏi. Chỉ thật sự xoá khi bấm Lưu; Huỷ thì dòng còn nguyên |

Kéo thả: kéo tay nắm ⋮⋮ để đổi thứ tự. Thứ tự lưu vào `sort_order` khi bấm Lưu. Bàn phím: khi tay nắm đang được chọn, Alt+↑ / Alt+↓ đổi chỗ với dòng trên, dưới.

**Modal "Chọn cột hiển thị"**

Modal lớn theo DESIGN-SYSTEM-HUBSPOT, giống hộp Chỉnh sửa cột của danh sách ở CRM-01.

- Trái: ô "Tìm thuộc tính"; nhóm "Thuộc tính có sẵn" (Tần suất thanh toán, Kỳ hạn, Chiết khấu, SKU, Giá vốn / đơn vị, Mô tả) và nhóm "Thuộc tính tuỳ chỉnh ({n})", mỗi mục có checkbox và loại trường chữ nhạt.
- Trái, dưới cùng: khối "Tạo thuộc tính line item mới": ô Tên · chọn Loại (Văn bản · Số · Ngày · Lựa chọn đơn · Hộp kiểm) · ô "Các lựa chọn, mỗi dòng một lựa chọn" (chỉ khi Lựa chọn đơn) · nút "Tạo thuộc tính". Chỉ hiện với người có quyền sửa cấu trúc `crm_line_items`.
- Phải: "Cột đang hiển thị ({n})": dòng cố định "Tên" trên cùng, các cột đã chọn kéo để đổi thứ tự hoặc ✕ để bỏ, dòng cố định "Số lượng · Đơn giá · Thành tiền" cuối cùng.
- Nút "Áp dụng" · "Huỷ".

**Phần tổng kết (cuối trình sửa, canh phải, rộng 420 px)**

1. "Tạm tính": tổng Thành tiền các dòng.
2. "Đã gồm chiết khấu dòng  − {số}" (chữ nhỏ), chỉ khi có chiết khấu dòng.
3. Các dòng điều chỉnh. Mỗi dòng: chọn loại (Chiết khấu · Phí · Thuế) · ô tên (gợi ý "Tên (vd. VAT)") · ô giá trị · chọn "% / ₫" · số tiền tính được ("− " cho chiết khấu, "+ " cho phí, thuế) · nút ✕.
4. Ba link "+ Chiết khấu" · "+ Phí" · "+ Thuế".
5. "Tổng", in đậm.
6. Có ít nhất một dòng định kỳ: "Doanh thu định kỳ hằng năm (ARR)" và "Doanh thu định kỳ hằng tháng (MRR)", chữ nhỏ.

Dưới phần tổng kết có chữ nhỏ "Thuế tính sau chiết khấu và phí."

Bên trái phần tổng kết là ô tick "Dùng tổng line item làm **Amount** của Deal (Tổng Cash-In Dự Kiến)" và chữ nhỏ theo UC-9.

Giá trị mặc định của dòng điều chỉnh mới:

| Loại | Tên | Giá trị | Kiểu |
|---|---|---|---|
| Chiết khấu | Chiết khấu Deal | 0 | % |
| Phí | Phí | 0 | % |
| Thuế | VAT | 10 | % |

VAT mặc định 10% theo prototype; đây chỉ là giá trị gợi ý, người dùng sửa được (câu hỏi Q2).

**Kiểm lỗi khi Lưu**

| Lỗi | Thông báo | Nơi hiện |
|---|---|---|
| Dòng không có tên | "Line item cần có tên" | Viền đỏ ô Tên, con trỏ vào ô lỗi đầu tiên |
| Số lượng ≤ 0 hoặc trống | "Số lượng phải lớn hơn 0" | Dưới ô |
| Đơn giá < 0 hoặc trống | "Đơn giá không được âm" | Dưới ô |
| Chiết khấu % > 100 | "Chiết khấu phần trăm không được lớn hơn 100" | Dưới ô |
| Tần suất định kỳ mà kỳ hạn trống hoặc < 1 | "Nhập số kỳ" | Dưới ô |
| Điều chỉnh % > 100 | "Phần trăm không được lớn hơn 100" | Dưới ô |
| Quá 200 dòng | "Một deal có tối đa 200 line item" | Toast |

Có lỗi thì không gửi request; toast "Còn {n} ô cần sửa". Lỗi trả về từ máy chủ hiện ở đúng ô theo `details.path`.

**Công thức (bản đầy đủ)**

Máy chủ tính với số thập phân, làm tròn tới đồng (nửa lên) ở ba chỗ: thành tiền mỗi dòng, số tiền mỗi dòng điều chỉnh, và tổng. FE dùng đúng công thức này để hiển thị tạm trong lúc sửa.

Mỗi dòng:

```
gross     = quantity × unit_price
discount  = discount_type = "%" ? gross × discount_value ÷ 100 : discount_value
net       = max(0, gross − discount)                     ← thành tiền một kỳ
periods   = billing_frequency = "Một lần" ? 1 : term
lineTotal = round(net × periods)                         ← lưu vào line_total
```

Cả deal:

```
subtotal      = Σ lineTotal
lineDiscount  = Σ (gross × periods) − subtotal
Mỗi chiết khấu: amount = "%" ? subtotal × value ÷ 100 : value
Mỗi phí:        amount = "%" ? subtotal × value ÷ 100 : value
afterDF       = max(0, subtotal − Σ chiết khấu + Σ phí)
Mỗi thuế:       amount = "%" ? afterDF × value ÷ 100 : value
total         = max(0, afterDF + Σ thuế)                 ← line_items_total
```

- Chiết khấu và phí theo % đều tính trên tạm tính, không cộng dồn lẫn nhau.
- Mỗi dòng thuế tính trên cùng một cơ sở (sau chiết khấu và phí). Hai dòng thuế không tính thuế chồng thuế.
- Chiết khấu cấp Deal lớn hơn tạm tính cộng phí: `afterDF` bằng 0, thuế theo % bằng 0, tổng bằng tổng các thuế theo ₫ (nếu có).
- Deal không có line item: `line_items_total = null` và bỏ qua điều chỉnh.

Doanh thu định kỳ (L-10):

```
ARR = Σ net × số kỳ trong năm, trên các dòng định kỳ
      (Hằng tháng 12 · Hằng quý 4 · Nửa năm 2 · Hằng năm 1)
MRR = ARR ÷ 12
```

ARR, MRR làm tròn tới đồng, chỉ hiển thị, không lưu, không trừ chiết khấu và thuế cấp Deal.

**Ví dụ tính** (DEAL-013, số liệu sản phẩm mẫu ở CRM-00, phần dữ liệu mẫu)

| Dòng | SL | Đơn giá | Chiết khấu | Tần suất × kỳ | Thành tiền |
|---|---|---|---|---|---|
| HarnexAI PROFESSIONAL – 12 tháng | 1 | 48.000.000 | 10% | Một lần | 43.200.000 |
| Phí khởi tạo (Setup) | 1 | 3.000.000 | 0 | Một lần | 3.000.000 |
| User bổ sung / tháng | 10 | 250.000 | 0 | Hằng tháng × 12 | 30.000.000 |

| Tổng kết | Số tiền |
|---|---|
| Tạm tính | 76.200.000 |
| Đã gồm chiết khấu dòng | − 4.800.000 |
| Chiết khấu · Chiết khấu Deal (1.000.000 ₫) | − 1.000.000 |
| Phí · Phí triển khai (5%) | + 3.810.000 |
| Thuế · VAT (8%) trên 79.010.000 | + 6.320.800 |
| **Tổng** | **85.330.800** |
| ARR | 30.000.000 |
| MRR | 2.500.000 |

## B. Dữ liệu

| Collection | Vai trò | Định nghĩa |
|---|---|---|
| `crm_products` | Thư viện sản phẩm | CRM-00, phần collection sản phẩm |
| `crm_line_items` | Dòng sản phẩm của Deal | CRM-00, phần collection line item |
| `crm_deal_adjustments` | Chiết khấu, phí, thuế cấp Deal | CRM-00, phần collection điều chỉnh cấp Deal |
| `Deals_Pipeline` | `use_line_items_amount`, `line_items_total` (trường tính, theo F03-S2, phần handler tổng line item), `t_ng_cash_in_d_ki_n` (Amount) | CRM-00, phần collection Deals |

Trường thêm cho spec này, trên `Deals_Pipeline` (CRM-00 bổ sung cùng với `line_items_total`):

| Key | Kiểu | Ghi chú |
|---|---|---|
| `line_items_version` | Số | Trường hệ thống. BE tăng mỗi lần lưu line item, dùng chống ghi đè. Không hiện ở giao diện |

Thuộc tính tuỳ chỉnh của line item: trường thật trên `crm_line_items` và trường đi cặp cùng key trên `crm_products`, key có tiền tố `cf_`, sinh từ tên theo quy tắc của F03-S4.

Cấu hình cột của trình sửa lưu theo người dùng ở khoá `crm.lineItems.editorColumns` (F03-S4, cấu hình hiển thị theo người dùng).

Sản phẩm không có màn quản lý riêng: quản lý ở màn Dữ liệu của ERP như mọi collection (collection `crm_products`).

## C. API

API riêng của màn, tiền tố `/api/v1/deals/:dealId/line-items`. `:dealId` là id bản ghi Deals_Pipeline.

**Đọc**

```
GET /api/v1/deals/:dealId/line-items
```

```json
{
  "status": "success",
  "data": {
    "version": 7,
    "useLineItemsAmount": true,
    "items": [
      { "id": "li_01", "productId": "prd_pro12", "name": "HarnexAI PROFESSIONAL – 12 tháng", "quantity": 1, "unitPrice": 48000000,
        "discountType": "%", "discountValue": 10, "billingFrequency": "Một lần", "term": null,
        "sku": "HX-PRO-12", "costPrice": null, "description": null, "sortOrder": 1,
        "custom": { "cf_so_user": 20 },
        "net": 43200000, "lineTotal": 43200000 }
    ],
    "adjustments": [
      { "id": "adj_01", "kind": "Thuế", "name": "VAT", "valueType": "%", "value": 8, "sortOrder": 3, "amount": 6320800 }
    ],
    "summary": { "subtotal": 76200000, "lineDiscount": 4800000, "total": 85330800, "recurring": true, "arr": 30000000, "mrr": 2500000 },
    "amount": 85330800
  }
}
```

- `net`: thành tiền một kỳ sau chiết khấu dòng. `lineTotal`: thành tiền cả dòng (công thức ở Phụ lục A).
- Quyền: đọc được deal.

**Lưu**

```
PUT /api/v1/deals/:dealId/line-items
{
  "version": 7,
  "useLineItemsAmount": true,
  "items": [ { "id": "li_01", ... }, { "productId": "prd_user", "name": "User bổ sung / tháng", ... } ],
  "adjustments": [ { "id": "adj_01", ... }, { "kind": "Phí", "name": "Phí triển khai", "valueType": "%", "value": 5 } ]
}
```

- Gửi toàn bộ danh sách sau khi sửa. Máy chủ so với dữ liệu hiện có: phần tử có `id` là sửa, không có `id` là tạo mới, `id` hiện có mà không được gửi là xoá (xoá mềm). `sortOrder` do máy chủ đặt lại theo thứ tự mảng.
- Một giao dịch: line item, điều chỉnh, `use_line_items_amount`, handler tổng (F03-S2, phần handler tổng line item: `line_items_total`, có thể cả Amount), `line_items_version + 1`.
- `version` khác `line_items_version` hiện tại: `409 LINE_ITEMS_CONFLICT`, không ghi gì.
- `productId` trỏ tới sản phẩm đã ngừng bán vẫn hợp lệ (dòng cũ giữ nguyên); thêm mới từ sản phẩm ngừng bán thì `422 PRODUCT_INACTIVE`.
- Tính `net`, `lineTotal`, số tiền điều chỉnh, tổng ở máy chủ theo công thức ở Phụ lục A; giá trị FE gửi cho các trường tính bị bỏ qua.
- Khi `useLineItemsAmount` bật: handler ghi Amount trong cùng giao dịch, F03-S3 ghi lịch sử Amount với ghi chú "từ line items".
- Phản hồi: như API đọc, với dữ liệu mới.
- Quyền: ghi được deal. Không cần quyền riêng trên `crm_line_items`, `crm_deal_adjustments`.

**API liên quan**

| Việc | API |
|---|---|
| Sửa line item khi nhập file, chạy workflow | API bản ghi chung `/collections/crm_line_items/records`; handler tổng vẫn chạy và `line_items_version` vẫn tăng |
| Tạo sản phẩm, "Lưu vào thư viện sản phẩm" | API bản ghi của `crm_products` |
| Tạo thuộc tính line item | API tạo trường đi cặp của F03-S4 |
| Danh sách thư viện sản phẩm | API danh sách `crm_products`, lọc `is_active = true`, trang 50 dòng |

**Mã lỗi mới**

| HTTP | Code | Khi nào |
|---|---|---|
| 409 | `LINE_ITEMS_CONFLICT` | `version` cũ |
| 422 | `PRODUCT_INACTIVE` | Thêm line item mới từ sản phẩm ngừng bán |
| 422 | `LINE_ITEM_INVALID` | Vi phạm quy tắc ở bảng kiểm lỗi (Phụ lục A); `details` là danh sách `{ path: "items[2].quantity", message }` |
| 422 | `LINE_ITEMS_TOO_MANY` | Quá 200 dòng |

Mã `422 AMOUNT_LOCKED` do F03-S2 định nghĩa (phần handler tổng line item).

## D. Lệch so với sheet / prototype

**Bảng tính năng và phạm vi theo sheet**

| ID | Tính năng | Ưu tiên | Phạm vi sheet |
|---|---|---|---|
| L-01 | Card Line items | P0 | Chỉ FE |
| L-02 | Trình sửa toàn màn hình | P0 | Chỉ FE |
| L-03 | Thư viện sản phẩm | P0 | FE + BE |
| L-04 | Line item tuỳ chỉnh | P0 | Chỉ FE |
| L-05 | Cột giá | P0 | FE + BE |
| L-06 | Trường tuỳ chỉnh | P0 | FE + BE |
| L-07 | Tự điền từ sản phẩm | P0 | FE + BE |
| L-08 | Thao tác dòng | P1 | Chỉ FE |
| L-09 | Chiết khấu, phí, thuế cấp Deal | P1 | FE + BE |
| L-10 | Doanh thu định kỳ | P2 | Chỉ FE |
| L-11 | Tổng làm Amount | P0 | Chỉ FE |

**Lệch so với sheet, cần PO xác nhận**

- Sheet ghi L-01, L-02, L-04, L-08, L-11 là "Chỉ FE".
- L-01, L-02, L-04 cần collection `crm_line_items` và API lưu.
- L-11 cần handler máy chủ, vì ghi Amount từ FE thì hai người lưu cùng lúc sẽ ra số sai.
- Đề nghị sửa cột Phạm vi của L-01, L-02, L-04, L-11 thành "FE + BE". L-08 (kéo thả, nhân bản trên màn hình) đúng là chỉ FE.

**Lệch so với prototype**

| Trong prototype | Bản thật |
|---|---|
| Line item, điều chỉnh, sản phẩm lưu `localStorage` | Collection ở CRM-00, API ở Phụ lục C |
| Amount ghi từ FE sau khi lưu | Handler máy chủ ghi trong cùng giao dịch |
| Sự kiện "Cập nhật line items: n dòng, tổng …" do FE ghi | Không có sự kiện riêng cho line item; timeline có sự kiện đổi Amount (F03-S3) |
| Nhiều dòng thuế tính chồng (thuế sau tính trên cả thuế trước) | Không chồng (BR-04) |
| Cấu hình cột lưu chung cho mọi người (`db.liCols`) | Theo người dùng (F03-S4) |
| Thuộc tính tuỳ chỉnh chỉ tồn tại trong bộ nhớ trình duyệt; giá trị mặc định ở `product.defaults` | Trường thật trên `crm_line_items` và trường đi cặp trên `crm_products` (F03-S4) |
| "Lưu vào thư viện" tự sinh SKU `CUSTOM-n` | Lấy SKU của dòng, có thể trống |
| "+ Tạo sản phẩm" chỉ hiện toast | Mở panel tạo sản phẩm |
| Không kiểm hai người cùng sửa | `version` và `409` |
| Không làm tròn | Làm tròn tới đồng ở ba chỗ (BR-05) |

**Ngoài phạm vi:** báo giá (Quotes), xuất PDF báo giá, nhiều loại tiền tệ, thanh toán (Payments), màn quản lý sản phẩm riêng.

## E. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai |
|---|---|---|
| Q1 | Chiết khấu dòng trừ trên cả dòng (như prototype) hay trên từng đơn vị (như "Unit discount" của HubSpot)? Spec viết theo prototype | PO / khách |
| Q2 | VAT mặc định 10% (theo prototype) có đúng với mức khách đang xuất hoá đơn không, hay để trống cho người dùng tự nhập? | Khách / kế toán |
| Q3 | Số lượng có cần số thập phân không? (cùng câu hỏi mở về số lượng ở CRM-00) | Khách |
| Q4 | Có cần lưu "tạm tính", "tổng" riêng từng thời điểm để làm báo giá không? Giai đoạn này chỉ lưu `line_items_total` | PO |
| Q5 | Sheet ghi L-01, L-02, L-04, L-11 là "Chỉ FE" nhưng cần BE. Đồng ý sửa cột Phạm vi? | PO |

## F. Tài liệu liên quan

- Prototype: `crm-record-hubspot.html?type=deal&id=r013` (card Line items, nút Sửa mở trình sửa); code `crm-objects.js` (`lineItemsCard`, `lineItemEditor`, `totalsOf`, `saveItems`); CSS `crm-shared.css` (`.lie-*`, `.li-*`)
- Plan: `00-PLAN-viet-spec.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` (collection Deals, sản phẩm, line item, điều chỉnh cấp Deal, dữ liệu mẫu)
- Deals: `CRM-04-deals.md` (thẻ định danh, card bên phải của Deal)
- Khung chung: `CRM-01-khung-danh-sach-trang-chi-tiet.md` (panel tạo bản ghi, hộp Chỉnh sửa cột)
- Spec nền: `F03-S2-truong-tinh-rollup.md` (handler tổng line item → Amount), `F03-S4-truong-tuy-chinh-cau-hinh-hien-thi.md` (trường đi cặp, cấu hình cột theo người dùng), `F03-S3` (lịch sử Amount)
- Design system: `DESIGN-SYSTEM-HUBSPOT.md` (modal lớn, trình dựng toàn màn)
- Đối chiếu HubSpot: `DOI-CHIEU-CHUC-NANG.md` phần Line items. Nguồn: màn "Edit line items" chuẩn và form "Create product" (portal khách chưa có sản phẩm; chỉ mở form rồi thoát, không tạo gì)

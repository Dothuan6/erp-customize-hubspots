# CRM-06 — Line items và thư viện sản phẩm

> **Trạng thái:** 💡 Proposed · v1.0 · 30/09/2026 · chờ review
> **Tính năng sở hữu (11):** L-01 → L-11
> **Phụ thuộc:** `CRM-00` §5.4, §5.7, §5.8, §5.9 (dữ liệu) · `F03-S2` §6.4 (handler tổng line item → Amount) · `F03-S4` (trường tuỳ chỉnh đi cặp, cấu hình cột theo người dùng) · `F03-S3` (lịch sử Amount) · `CRM-04` §6.1, §6.4 (thẻ định danh, card bên phải của Deal)
> **Prototype:** `crm-record-hubspot.html?type=deal&id=r013` (card Line items, nút Sửa mở trình sửa) · code `crm-objects.js` (`lineItemsCard`, `lineItemEditor`, `totalsOf`, `saveItems`) · CSS `crm-shared.css` (`.lie-*`, `.li-*`)
> **Nguồn HubSpot:** màn "Edit line items" chuẩn và form "Create product" (portal khách chưa có sản phẩm; chỉ mở form rồi thoát, không tạo gì) — `DOI-CHIEU-CHUC-NANG.md` §15

---

## 1. Phạm vi

| ID | Tính năng | Ưu tiên | Phạm vi sheet | Mục |
|---|---|---|---|---|
| L-01 | Card Line items | P0 | Chỉ FE | §3 |
| L-02 | Trình sửa toàn màn hình | P0 | Chỉ FE | §4.1 |
| L-03 | Thư viện sản phẩm | P0 | FE + BE | §4.3 |
| L-04 | Line item tuỳ chỉnh | P0 | Chỉ FE | §4.4 |
| L-05 | Cột giá | P0 | FE + BE | §4.2, §6 |
| L-06 | Trường tuỳ chỉnh | P0 | FE + BE | §4.6 |
| L-07 | Tự điền từ sản phẩm | P0 | FE + BE | §4.3 |
| L-08 | Thao tác dòng | P1 | Chỉ FE | §4.5 |
| L-09 | Chiết khấu, phí, thuế cấp Deal | P1 | FE + BE | §4.7, §6 |
| L-10 | Doanh thu định kỳ | P2 | Chỉ FE | §4.7, §6 |
| L-11 | Tổng làm Amount | P0 | Chỉ FE | §4.8, F03-S2 §6.4 |

Sheet ghi L-01, L-02, L-04, L-08, L-11 là "Chỉ FE". L-01, L-02, L-04 cần collection `crm_line_items` và API lưu (§5). L-11 cần handler máy chủ (F03-S2 §6.4), vì ghi Amount từ FE thì hai người lưu cùng lúc sẽ ra số sai. Đề nghị sửa cột Phạm vi của L-01, L-02, L-04, L-11 thành "FE + BE"; L-08 (kéo thả, nhân bản trên màn hình) đúng là chỉ FE.

**Ngoài phạm vi:** báo giá (Quotes), xuất PDF báo giá, nhiều loại tiền tệ, thanh toán (Payments). Màn quản lý sản phẩm riêng: sản phẩm quản lý ở màn Dữ liệu của ERP như mọi collection (collection `crm_products`).

---

## 2. Dữ liệu dùng

| Collection | Vai trò | Định nghĩa |
|---|---|---|
| `crm_products` | Thư viện sản phẩm | CRM-00 §5.7 |
| `crm_line_items` | Dòng sản phẩm của Deal | CRM-00 §5.8 |
| `crm_deal_adjustments` | Chiết khấu, phí, thuế cấp Deal | CRM-00 §5.9 |
| `Deals_Pipeline` | `use_line_items_amount`, `line_items_total` (trường tính, F03-S2 §6.4), `t_ng_cash_in_d_ki_n` (Amount) | CRM-00 §5.4 |

Spec này thêm vào `Deals_Pipeline` trường hệ thống `line_items_version` (Số, BE tăng mỗi lần lưu line item, dùng chống ghi đè ở §5.2; không hiện ở giao diện). CRM-00 §5.4.2 bổ sung cùng với `line_items_total`.

---

## 3. Card Line items trên trang Deal (L-01)

Card thứ ba ở cột phải trang chi tiết Deal (CRM-04 §6.4, `rightCards` có `ref:crm_line_items.deal_id`).

- Header: ▾ thu gọn · "Line items ({n})" · nút "Sửa" (khi có line item) hoặc "Thêm" (khi chưa có). Cả hai mở trình sửa (§4).
- Mỗi line item một hàng:
  - Trái: tên.
  - Dưới tên, chữ nhạt: "{SL} × {đơn giá}"; hàng định kỳ thêm " · {tần suất viết thường} × {kỳ hạn} kỳ". Ví dụ "10 × 250.000 ₫ · hằng tháng × 12 kỳ".
  - Phải: thành tiền, in đậm.
- Có điều chỉnh cấp Deal thì thêm các hàng nhỏ: "Tạm tính" và từng điều chỉnh, ví dụ "Thuế · VAT (8%)  + 6.320.800 ₫", "Chiết khấu · Chiết khấu Deal  − 1.000.000 ₫".
- Hàng "Tổng", in đậm.
- Có hàng định kỳ thì thêm hàng nhỏ "Doanh thu định kỳ hằng năm (ARR)".
- Tối đa 10 line item; nhiều hơn thì "Xem tất cả {n} line item" mở trình sửa.
- Trạng thái rỗng: biểu tượng hoá đơn + "Thêm sản phẩm, dịch vụ vào Deal. Tổng line item sẽ thành Amount của Deal." + nút "Thêm". Khi `use_line_items_amount = false`, câu thứ hai đổi thành "Amount của Deal đang nhập tay."
- Số liệu lấy từ `GET` ở §5.1, không tự tính lại ở FE.
- Người chỉ đọc được deal: không có nút "Sửa"/"Thêm".

---

## 4. Trình sửa line item

### 4.1 Khung toàn màn hình (L-02)

Theo DS-HUBSPOT §7.4 (trình dựng toàn màn):

- Thanh trên cao 56 px, nền shell: nút **"Huỷ"** (trái) · tiêu đề "Line items · {Mã Deal}" kèm Tên Deal chữ nhạt · nút **"Lưu"** (phải).
- Dưới là vùng làm việc: thanh công cụ · bảng · phần tổng kết. Panel thư viện sản phẩm mở ở bên phải khi cần (§4.3).
- Thanh công cụ: nút split **"Thêm line item ▾"** (Chọn từ thư viện sản phẩm · Tạo line item tuỳ chỉnh) · nút **"Chỉnh sửa cột"** · chữ "Tiền tệ: **VND (₫)**" (cố định, không đổi được).
- Mở trình sửa: URL thêm `?edit=line-items` để nút Back của trình duyệt đóng trình sửa (hỏi nếu có thay đổi).
- **Huỷ** hoặc Esc: có thay đổi chưa lưu thì hỏi "Bỏ các thay đổi line item?" với "Bỏ thay đổi" và "Tiếp tục sửa". Esc khi panel thư viện đang mở thì chỉ đóng panel.
- **Lưu**: kiểm lỗi (§4.9); hợp lệ thì gửi PUT (§5.2). Thành công: đóng trình sửa, toast "Đã lưu {n} line item · Tổng {tổng}", thêm " → Amount của Deal" nếu Amount được cập nhật. Card Line items, thẻ định danh (Amount), timeline tải lại.
- Màn hẹp (< 905 px): bảng cuộn ngang trong vùng làm việc, cột Tên dính trái; panel thư viện phủ toàn màn hình.

### 4.2 Bảng và cột giá (L-05)

Thứ tự cột:

| # | Cột | Luôn hiện | Ô nhập | Ghi chú |
|---|---|---|---|---|
| 1 | Kéo | ✓ | Tay nắm ⋮⋮ | §4.5 |
| 2 | Tên | ✓ | Ô chữ | Dưới tên chữ nhỏ "Từ thư viện sản phẩm" hoặc "Line item tuỳ chỉnh" |
| 3… | Các cột tuỳ chọn theo cấu hình (§4.6) | | | Mặc định: Tần suất thanh toán, Kỳ hạn, Chiết khấu, rồi mọi thuộc tính tuỳ chỉnh |
| … | Số lượng | ✓ | Ô số | > 0. Số thập phân theo CRM-00 Q7; tạm thời cho tối đa 2 chữ số thập phân |
| … | Đơn giá | ✓ | Ô tiền | ≥ 0. Hàng định kỳ là giá một kỳ |
| … | Thành tiền | ✓ | Chỉ đọc | Tính ở §6. Hàng định kỳ có dòng nhỏ "{thành tiền một kỳ} / {tháng · quý · 6 tháng · năm}" |
| cuối | ⋯ | ✓ | Menu dòng | §4.5 |

Cột tuỳ chọn có sẵn:

| Cột | Ô nhập | Quy tắc |
|---|---|---|
| Tần suất thanh toán | Chọn (D-FREQ) | Mặc định "Một lần" |
| Kỳ hạn (số kỳ) | Ô số nguyên | ≥ 1. Tần suất "Một lần" thì ô hiện "—", không nhập được. Đổi từ "Một lần" sang định kỳ thì kỳ hạn mặc định 1 (hoặc kỳ hạn mặc định của sản phẩm). **Luôn hiện khi bảng có ít nhất một dòng định kỳ**, kể cả khi người dùng đã tắt cột này, vì đây là ô bắt buộc với dòng định kỳ |
| Chiết khấu | Ô số + chọn "₫ / %" | ≥ 0; kiểu % thì ≤ 100. Chiết khấu trừ trên **thành tiền một kỳ của cả dòng** (SL × đơn giá), không phải trên từng đơn vị (§6) |
| SKU | Ô chữ | Sao chép từ sản phẩm |
| Giá vốn / đơn vị | Ô tiền | Chỉ để tham khảo, không vào công thức tổng |
| Mô tả | Ô chữ | |

Mọi thay đổi ở ô số làm Thành tiền và phần tổng kết cập nhật ngay trên màn hình (tính ở FE theo §6 để phản hồi tức thì). Số cuối cùng là số máy chủ tính khi lưu.

### 4.3 Thư viện sản phẩm và tự điền (L-03, L-07)

"Thêm line item ▾ → Chọn từ thư viện sản phẩm" mở panel phải rộng 400 px:

- Tiêu đề "Thư viện sản phẩm" · nút ✕.
- Ô tìm "Tìm theo tên, SKU", không phân biệt hoa thường, bỏ dấu (máy chủ cần extension `unaccent`; bộ lọc `contains` của F03 hiện chưa bỏ dấu).
- Danh sách sản phẩm **đang bán** (`is_active = true`), sắp theo tên. Mỗi dòng: checkbox · tên đậm · "{SKU} · {tần suất}" · mô tả chữ nhạt (1 dòng) · đơn giá bên phải.
- Tick một sản phẩm: hiện bộ chỉnh số lượng "− 1 +" ở dòng đó. Số lượng tối thiểu 1.
- Chân panel: link "+ Tạo sản phẩm" · nút **"Thêm ({n})"**, vô hiệu khi chưa chọn.
- Danh sách tải theo trang 50 dòng, cuộn tới cuối tải thêm. Không tìm thấy: "Không tìm thấy sản phẩm".
- Người không có quyền tạo sản phẩm: không có link "+ Tạo sản phẩm".

**"Thêm (n)"** thêm n dòng vào cuối bảng, mỗi dòng **tự điền** từ sản phẩm (L-07):

| Line item | Lấy từ sản phẩm |
|---|---|
| `product_id` | id sản phẩm |
| `name`, `sku`, `cost_price`, `description` | cùng tên trường |
| `unit_price` | `unit_price` |
| `billing_frequency` | `billing_frequency` |
| `term` | `default_term` (trống thì 1; tần suất Một lần thì trống) |
| `quantity` | số lượng chọn trong panel |
| `discount_type`, `discount_value` | `₫`, 0 |
| Mỗi thuộc tính tuỳ chỉnh của line item | Giá trị mặc định cùng key trên sản phẩm (F03-S4 trường đi cặp). Sản phẩm không có giá trị thì để trống |

Panel đóng, toast "Đã thêm {n} line item"; có ít nhất một thuộc tính tuỳ chỉnh được tự điền thì thêm " · trường tuỳ chỉnh đã tự điền từ sản phẩm".

Giá trị được **sao chép** vào line item (CRM-00 §5.8). Sau này đổi giá hay mô tả sản phẩm không làm đổi line item đã có.

**"+ Tạo sản phẩm"** mở panel tạo bản ghi của `crm_products` (khung CRM-01 §6) chồng lên panel thư viện: Tên* · SKU · Đơn giá* · Tần suất thanh toán* (mặc định Một lần) · Kỳ hạn mặc định (chỉ hiện khi định kỳ) · Giá vốn · Mô tả · các giá trị mặc định của thuộc tính tuỳ chỉnh. Tạo xong, sản phẩm mới hiện trong danh sách và đã được tick.

### 4.4 Line item tuỳ chỉnh (L-04)

- "Thêm line item ▾ → Tạo line item tuỳ chỉnh" thêm một dòng trống vào cuối: tên trống, SL 1, đơn giá 0, Một lần, không `product_id`. Con trỏ vào ô Tên.
- Dòng tuỳ chỉnh có mục "Lưu vào thư viện sản phẩm" trong menu ⋯ (§4.5):
  - Tên trống: toast "Nhập tên trước khi lưu vào thư viện".
  - Không có quyền tạo sản phẩm: mục này không hiện.
  - Tạo ngay một sản phẩm (API bản ghi của `crm_products`) với tên, đơn giá, tần suất, kỳ hạn (thành kỳ hạn mặc định), SKU, giá vốn, mô tả của dòng, và giá trị các thuộc tính tuỳ chỉnh của dòng làm giá trị mặc định. SKU trùng sản phẩm khác: báo lỗi từ API ngay dưới dòng, không tạo.
  - Tạo xong: dòng nhận `product_id` mới, chữ nhỏ đổi thành "Từ thư viện sản phẩm", toast "Đã lưu “{tên}” vào thư viện sản phẩm". Sản phẩm được tạo ngay cả khi sau đó người dùng bấm Huỷ trình sửa; hộp hỏi khi Huỷ ghi thêm "Sản phẩm đã lưu vào thư viện vẫn được giữ."

### 4.5 Thao tác dòng (L-08)

- **Kéo thả**: kéo tay nắm ⋮⋮ để đổi thứ tự. Thứ tự lưu vào `sort_order` khi bấm Lưu. Bàn phím: khi tay nắm đang được chọn, Alt+↑ / Alt+↓ đổi chỗ với dòng trên, dưới.
- **Menu ⋯** của dòng:

| Mục | Hiện khi | Hành vi |
|---|---|---|
| Nhân bản | Luôn | Chèn bản sao ngay dưới dòng (không có id, giữ `product_id` và mọi giá trị) |
| Lưu vào thư viện sản phẩm | Dòng tuỳ chỉnh và có quyền tạo sản phẩm | §4.4 |
| Chuyển lên | Không phải dòng đầu | Đổi chỗ với dòng trên |
| Chuyển xuống | Không phải dòng cuối | Đổi chỗ với dòng dưới |
| vạch ngăn | | |
| Xoá | Luôn | Bỏ dòng khỏi bảng ngay, không hỏi. Chỉ thật sự xoá khi bấm Lưu; Huỷ thì dòng còn nguyên |

### 4.6 Chỉnh sửa cột và thuộc tính tuỳ chỉnh (L-06)

Nút "Chỉnh sửa cột" mở modal lớn "Chọn cột hiển thị" (DS-HUBSPOT §6.11), giống hộp Chỉnh sửa cột của danh sách (CRM-01 §4.7):

- **Trái**: ô "Tìm thuộc tính"; nhóm "Thuộc tính có sẵn" (Tần suất thanh toán, Kỳ hạn, Chiết khấu, SKU, Giá vốn / đơn vị, Mô tả) và nhóm "Thuộc tính tuỳ chỉnh ({n})", mỗi mục có checkbox và loại trường chữ nhạt.
- **Trái, dưới cùng**: khối "Tạo thuộc tính line item mới": ô Tên · chọn Loại (Văn bản · Số · Ngày · Lựa chọn đơn · Hộp kiểm) · ô "Các lựa chọn, mỗi dòng một lựa chọn" (chỉ khi Lựa chọn đơn) · nút "Tạo thuộc tính". Chỉ hiện với người có quyền sửa cấu trúc `crm_line_items`.
- **Phải**: "Cột đang hiển thị ({n})": dòng cố định "Tên" trên cùng, các cột đã chọn kéo để đổi thứ tự hoặc ✕ để bỏ, dòng cố định "Số lượng · Đơn giá · Thành tiền" cuối cùng.
- Nút "Áp dụng" · "Huỷ".

**Tạo thuộc tính** gọi API tạo trường đi cặp của F03-S4:

- Tạo trường trên `crm_line_items` **và** trường cùng key trên `crm_products` (giá trị mặc định cho L-07), trong một giao dịch. Key sinh từ tên theo quy tắc F03-S4, tiền tố `cf_`.
- Tên trùng một thuộc tính đã có (không phân biệt hoa thường, bỏ dấu): báo "Đã có thuộc tính tên này" dưới ô Tên.
- Lựa chọn đơn không có lựa chọn nào: báo "Nhập ít nhất một lựa chọn".
- Tạo xong: thuộc tính vào nhóm tuỳ chỉnh, được tick sẵn, toast "Đã tạo thuộc tính “{tên}”. Điền giá trị ngay trên từng line item."
- Thuộc tính tuỳ chỉnh tạo ở đây xuất hiện ngay trên mọi deal, vì là trường của collection.
- Tiêu đề cột của thuộc tính tuỳ chỉnh có nhãn nhỏ "tuỳ chỉnh".

**Lưu cấu hình cột**: danh sách và thứ tự cột tuỳ chọn lưu **theo người dùng** (F03-S4 cấu hình hiển thị, khoá `crm.lineItems.editorColumns`), áp cho mọi deal. Người dùng chưa từng chỉnh thì dùng mặc định ở §4.2.

Ô nhập của thuộc tính tuỳ chỉnh trên dòng: Văn bản → ô chữ; Số → ô số canh phải; Ngày → chọn ngày; Lựa chọn đơn → ô chọn có mục trống; Hộp kiểm → ô tick giữa ô.

### 4.7 Tổng kết, điều chỉnh cấp Deal, doanh thu định kỳ (L-09, L-10)

Phần tổng kết ở cuối, canh phải, rộng 420 px:

1. **Tạm tính** — tổng Thành tiền các dòng.
2. "Đã gồm chiết khấu dòng  − {số}" (chữ nhỏ), chỉ khi có chiết khấu dòng.
3. Các dòng điều chỉnh. Mỗi dòng: chọn loại (Chiết khấu · Phí · Thuế) · ô tên (gợi ý "Tên (vd. VAT)") · ô giá trị · chọn "% / ₫" · số tiền tính được ("− " cho chiết khấu, "+ " cho phí, thuế) · nút ✕.
4. Ba link "+ Chiết khấu" · "+ Phí" · "+ Thuế". Dòng mới mặc định:

| Loại | Tên | Giá trị | Kiểu |
|---|---|---|---|
| Chiết khấu | Chiết khấu Deal | 0 | % |
| Phí | Phí | 0 | % |
| Thuế | VAT | 10 | % |

   VAT mặc định 10% theo prototype; đây chỉ là giá trị gợi ý, người dùng sửa được. Có nên đổi mặc định theo mức thuế khách đang áp dụng không là câu hỏi Q2.

5. **Tổng**, in đậm.
6. Có ít nhất một dòng định kỳ: "Doanh thu định kỳ hằng năm (ARR)" và "Doanh thu định kỳ hằng tháng (MRR)" (L-10), chữ nhỏ.

Thứ tự áp dụng điều chỉnh không phụ thuộc thứ tự hiển thị: mọi chiết khấu, rồi mọi phí, rồi mọi thuế (§6). Dưới phần tổng kết có chữ nhỏ "Thuế tính sau chiết khấu và phí."

### 4.8 Dùng tổng làm Amount (L-11)

- Ô tick trái phần tổng kết: "Dùng tổng line item làm **Amount** của Deal (Tổng Cash-In Dự Kiến)". Giá trị theo `use_line_items_amount` của deal (mặc định bật, CRM-00 §5.4.2).
- Khi tick và bảng có ít nhất một dòng: dưới ô có chữ nhỏ "Amount hiện tại {Amount} sẽ thành {Tổng} khi lưu." Hai số bằng nhau thì không hiện.
- Khi bỏ tick: chữ nhỏ "Amount giữ nguyên {Amount}, nhập tay ở thẻ định danh."
- Khi lưu: `useLineItemsAmount` gửi cùng request (§5.2). Handler F03-S2 §6.4 ghi Amount trong cùng giao dịch và F03-S3 ghi lịch sử Amount với ghi chú "từ line items"; timeline Deal có sự kiện "Thay đổi thuộc tính" của Amount. FE không tự ghi Amount.
- Amount trên thẻ định danh bị khoá khi deal có line item và đang dùng tổng (CRM-04 §6.1). Máy chủ cũng từ chối mọi lần ghi Amount khác trong trạng thái này (`422 AMOUNT_LOCKED`, F03-S2 §6.4).

### 4.9 Kiểm lỗi khi Lưu

| Lỗi | Thông báo | Nơi hiện |
|---|---|---|
| Dòng không có tên | "Line item cần có tên" | Viền đỏ ô Tên, con trỏ vào ô lỗi đầu tiên |
| Số lượng ≤ 0 hoặc trống | "Số lượng phải lớn hơn 0" | Dưới ô |
| Đơn giá < 0 hoặc trống | "Đơn giá không được âm" | Dưới ô |
| Chiết khấu % > 100 | "Chiết khấu phần trăm không được lớn hơn 100" | Dưới ô |
| Tần suất định kỳ mà kỳ hạn trống hoặc < 1 | "Nhập số kỳ" | Dưới ô |
| Điều chỉnh % > 100 | "Phần trăm không được lớn hơn 100" | Dưới ô |
| Quá 200 dòng | "Một deal có tối đa 200 line item" | Toast |

Có lỗi thì không gửi request; toast "Còn {n} ô cần sửa". Lỗi trả về từ máy chủ (§5.3) hiện ở đúng ô theo `details.path`.

---

## 5. API

API riêng của màn, tiền tố `/api/v1/deals/:dealId/line-items`. `:dealId` là id bản ghi Deals_Pipeline.

### 5.1 Đọc

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

- `net`: thành tiền một kỳ sau chiết khấu dòng. `lineTotal`: thành tiền cả dòng (§6).
- Quyền: đọc được deal.

### 5.2 Lưu

```
PUT /api/v1/deals/:dealId/line-items
{
  "version": 7,
  "useLineItemsAmount": true,
  "items": [ { "id": "li_01", ... }, { "productId": "prd_user", "name": "User bổ sung / tháng", ... } ],
  "adjustments": [ { "id": "adj_01", ... }, { "kind": "Phí", "name": "Phí triển khai", "valueType": "%", "value": 5 } ]
}
```

- Gửi **toàn bộ** danh sách sau khi sửa. Máy chủ so với dữ liệu hiện có: phần tử có `id` là sửa, không có `id` là tạo mới, `id` hiện có mà không được gửi là xoá (xoá mềm). `sortOrder` do máy chủ đặt lại theo thứ tự mảng.
- Một giao dịch: line item, điều chỉnh, `use_line_items_amount`, handler tổng (F03-S2 §6.4: `line_items_total`, có thể cả Amount), `line_items_version + 1`.
- `version` khác `line_items_version` hiện tại: `409 LINE_ITEMS_CONFLICT`, không ghi gì. Giao diện báo "Line items của deal này vừa được người khác sửa. Tải lại để xem bản mới nhất; thay đổi của bạn chưa được lưu." với nút "Tải lại" (bỏ thay đổi) và "Ở lại" (giữ màn hình để người dùng chép lại).
- `productId` trỏ tới sản phẩm đã ngừng bán vẫn hợp lệ (dòng cũ giữ nguyên); thêm mới từ sản phẩm ngừng bán thì `422 PRODUCT_INACTIVE`.
- Tính `net`, `lineTotal`, số tiền điều chỉnh, tổng ở máy chủ theo §6; giá trị FE gửi cho các trường tính bị bỏ qua.
- Phản hồi: như §5.1 với dữ liệu mới.
- Quyền: **ghi được deal**. Không cần quyền riêng trên `crm_line_items`, `crm_deal_adjustments` (API kiểm quyền trên deal rồi ghi thay).

Sửa line item qua API bản ghi chung (`/collections/crm_line_items/records`) vẫn được, dành cho nhập file và workflow; handler tổng cũng chạy và `line_items_version` cũng tăng.

### 5.3 Mã lỗi mới

| HTTP | Code | Khi nào |
|---|---|---|
| 409 | `LINE_ITEMS_CONFLICT` | `version` cũ (§5.2) |
| 422 | `PRODUCT_INACTIVE` | Thêm line item mới từ sản phẩm ngừng bán |
| 422 | `LINE_ITEM_INVALID` | Vi phạm quy tắc ở §4.9; `details` là danh sách `{ path: "items[2].quantity", message }` |
| 422 | `LINE_ITEMS_TOO_MANY` | Quá 200 dòng |

---

## 6. Công thức

Máy chủ tính với số thập phân, **làm tròn tới đồng** (nửa lên) ở ba chỗ: thành tiền mỗi dòng, số tiền mỗi dòng điều chỉnh, và tổng. FE dùng đúng công thức này để hiển thị tạm trong lúc sửa.

**Mỗi dòng**

```
gross     = quantity × unit_price
discount  = discount_type = "%" ? gross × discount_value ÷ 100 : discount_value
net       = max(0, gross − discount)                     ← thành tiền một kỳ
periods   = billing_frequency = "Một lần" ? 1 : term
lineTotal = round(net × periods)                         ← lưu vào line_total
```

**Cả deal**

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
- Mỗi dòng thuế tính trên cùng một cơ sở (sau chiết khấu và phí). Hai dòng thuế **không** tính thuế chồng thuế.
- Chiết khấu cấp Deal lớn hơn tạm tính cộng phí: `afterDF` bằng 0, thuế theo % bằng 0, tổng bằng tổng các thuế theo ₫ (nếu có).
- Deal không có line item: `line_items_total = null` và bỏ qua điều chỉnh.

**Doanh thu định kỳ (L-10)**

```
ARR = Σ net × số kỳ trong năm, trên các dòng định kỳ
      (Hằng tháng 12 · Hằng quý 4 · Nửa năm 2 · Hằng năm 1)
MRR = ARR ÷ 12
```

ARR, MRR làm tròn tới đồng, chỉ hiển thị, không lưu, không trừ chiết khấu và thuế cấp Deal.

**Ví dụ** (DEAL-013, số liệu sản phẩm mẫu ở CRM-00 §11):

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

---

## 7. Quyền

| Hành động | Điều kiện |
|---|---|
| Xem card Line items | Đọc được deal |
| Mở trình sửa, lưu | Ghi được deal |
| Tạo sản phẩm (từ thư viện hoặc "Lưu vào thư viện") | `record.write` trên `crm_products` |
| Tạo thuộc tính line item | `collection.update_schema` trên `crm_line_items` (và `crm_products`, vì trường đi cặp) |

---

## 8. Tiêu chí nghiệm thu

**AC-L01-1 — Card hiện đúng số liệu**
Given DEAL-013 có ba dòng và ba điều chỉnh như ví dụ §6
When mở trang chi tiết DEAL-013
Then card "Line items (3)" có ba hàng với thành tiền 43.200.000 ₫, 3.000.000 ₫, 30.000.000 ₫; hàng "User bổ sung / tháng" ghi "10 × 250.000 ₫ · hằng tháng × 12 kỳ"; có Tạm tính, ba điều chỉnh, Tổng 85.330.800 ₫, ARR 30.000.000 ₫.

**AC-L01-2 — Deal chưa có line item**
Given DEAL-004 chưa có line item, đang dùng tổng làm Amount
When mở trang chi tiết
Then card ghi "Line items (0)", câu mời "Thêm sản phẩm, dịch vụ vào Deal. Tổng line item sẽ thành Amount của Deal." và nút "Thêm".

**AC-L02-1 — Huỷ có thay đổi**
Given đang ở trình sửa và đã đổi số lượng một dòng
When bấm "Huỷ"
Then hỏi "Bỏ các thay đổi line item?"; chọn "Bỏ thay đổi" thì đóng, card không đổi.

**AC-L03-1 — Chọn nhiều từ thư viện**
Given panel thư viện đang mở
When gõ "HX-ST", tick hai sản phẩm STARTER, tăng số lượng gói 12 tháng lên 2, bấm "Thêm (2)"
Then bảng có thêm hai dòng với đúng tên, đơn giá, SL 1 và 2; panel đóng.

**AC-L03-2 — Sản phẩm ngừng bán không hiện**
Given sản phẩm "Đào tạo onsite (buổi)" có `is_active = false`
When mở thư viện
Then không thấy sản phẩm đó; dòng cũ đã dùng sản phẩm đó ở deal khác vẫn giữ nguyên.

**AC-L04-1 — Line item tuỳ chỉnh và lưu vào thư viện**
Given trình sửa của DEAL-013
When tạo line item tuỳ chỉnh "Tích hợp Zalo OA", đơn giá 12.000.000, rồi chọn ⋯ → "Lưu vào thư viện sản phẩm"
Then thư viện có sản phẩm "Tích hợp Zalo OA" giá 12.000.000 ₫; dòng đổi chữ nhỏ thành "Từ thư viện sản phẩm".

**AC-L05-1 — Hàng định kỳ**
Given dòng "User bổ sung / tháng" SL 10, đơn giá 250.000, Hằng tháng
When đặt kỳ hạn 12
Then Thành tiền 30.000.000 ₫ với dòng nhỏ "2.500.000 ₫ / tháng"; đổi tần suất về "Một lần" thì ô kỳ hạn thành "—" và Thành tiền 2.500.000 ₫.

**AC-L05-2 — Chiết khấu theo %**
Given dòng SL 1, đơn giá 48.000.000
When nhập chiết khấu 10 kiểu %
Then Thành tiền 43.200.000 ₫; nhập 120 thì khi Lưu báo "Chiết khấu phần trăm không được lớn hơn 100".

**AC-L06-1 — Tạo thuộc tính tuỳ chỉnh**
Given người dùng có quyền sửa cấu trúc line item
When trong "Chỉnh sửa cột" tạo thuộc tính "Số user" loại Số, bấm "Áp dụng"
Then bảng có cột "Số user" với nhãn "tuỳ chỉnh", điền được trên từng dòng; `crm_products` có trường cùng key.

**AC-L06-2 — Cấu hình cột theo người dùng**
Given Minh ẩn cột Chiết khấu trong trình sửa
When Lan mở trình sửa của cùng deal
Then Lan vẫn thấy cột Chiết khấu; Minh mở trình sửa deal khác thì cột Chiết khấu vẫn ẩn.

**AC-L07-1 — Tự điền giá trị mặc định**
Given sản phẩm "HarnexAI STARTER – 12 tháng" có mặc định "Số user" = 5
When thêm sản phẩm này từ thư viện
Then dòng mới có Số user = 5; toast có "trường tuỳ chỉnh đã tự điền từ sản phẩm".

**AC-L08-1 — Sắp xếp dòng**
Given ba dòng A, B, C
When kéo C lên đầu, rồi dùng ⋯ → "Chuyển xuống" ở C, rồi Lưu
Then thứ tự lưu là A, C, B; mở lại trình sửa vẫn đúng thứ tự đó.

**AC-L08-2 — Nhân bản và xoá**
Given dòng A
When chọn ⋯ → "Nhân bản" rồi ⋯ → "Xoá" ở dòng gốc, rồi bấm Huỷ và xác nhận bỏ
Then dữ liệu đã lưu không đổi.

**AC-L09-1 — Thứ tự chiết khấu, phí, thuế**
Given tạm tính 76.200.000
When thêm "Thuế VAT 8%" trước, rồi "Chiết khấu Deal 1.000.000 ₫", rồi "Phí triển khai 5%"
Then VAT tính trên 79.010.000 (= 76.200.000 − 1.000.000 + 3.810.000) ra 6.320.800; Tổng 85.330.800 ₫.

**AC-L10-1 — ARR, MRR**
Given deal chỉ có hàng Một lần
When thêm dòng Hằng quý SL 1, đơn giá 6.000.000, kỳ hạn 4
Then phần tổng kết hiện ARR 24.000.000 ₫ và MRR 2.000.000 ₫.

**AC-L11-1 — Amount theo tổng**
Given DEAL-013 Amount 200.000.000 ₫ nhập tay, ô "Dùng tổng line item làm Amount" đang tick
When lưu line items có tổng 85.330.800 ₫
Then chữ nhỏ trước khi lưu ghi "Amount hiện tại 200.000.000 ₫ sẽ thành 85.330.800 ₫ khi lưu."; sau khi lưu thẻ định danh hiện Amount 85.330.800 ₫, ô Amount bị khoá, timeline có sự kiện "Thay đổi thuộc tính" Amount.

**AC-L11-2 — Bỏ dùng tổng**
Given DEAL-013 có line item tổng 85.330.800 ₫, Amount 85.330.800 ₫, đang dùng tổng
When bỏ tick, sửa một line item làm tổng thành 90.000.000 ₫, rồi lưu
Then Amount giữ 85.330.800 ₫; ô Amount ở thẻ định danh sửa được.

**AC-CRM06-1 — Hai người cùng sửa**
Given Minh và Lan cùng mở trình sửa DEAL-013 (version 7)
When Minh lưu trước, rồi Lan lưu
Then Lan nhận thông báo "Line items của deal này vừa được người khác sửa…"; dữ liệu là bản của Minh.

---

## 9. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-CRM06-01 | Unit | Công thức §6 với ví dụ DEAL-013 | Tổng 85.330.800, ARR 30.000.000 |
| TC-CRM06-02 | Unit | Chiết khấu ₫ lớn hơn gross | `net` = 0, không âm |
| TC-CRM06-03 | Unit | Chiết khấu Deal 100% và phí 0 | Tổng 0 kể cả có thuế % |
| TC-CRM06-04 | Unit | Hai dòng thuế 8% và 2% | Cả hai tính trên cùng cơ sở, không chồng |
| TC-CRM06-05 | Unit | SL 1,5 × 333.333 | Thành tiền 500.000 (làm tròn tới đồng) |
| TC-CRM06-06 | API | PUT thiếu một `id` đang có | Dòng đó bị xoá mềm |
| TC-CRM06-07 | API | PUT với `version` cũ | 409 LINE_ITEMS_CONFLICT, không ghi gì |
| TC-CRM06-08 | API | PUT thêm mới từ sản phẩm ngừng bán | 422 PRODUCT_INACTIVE |
| TC-CRM06-09 | API | PUT 201 dòng | 422 LINE_ITEMS_TOO_MANY |
| TC-CRM06-10 | API | PUT gửi `lineTotal` sai | Máy chủ bỏ qua, tự tính |
| TC-CRM06-11 | API | Người chỉ đọc deal gọi PUT | 403 |
| TC-CRM06-12 | API | Người ghi được deal nhưng không có quyền trên `crm_line_items` gọi PUT | 200 |
| TC-CRM06-13 | API | Đổi giá sản phẩm sau khi đã thêm vào deal | Line item giữ giá cũ |
| TC-CRM06-14 | E2E | Tạo thuộc tính tên "số user" khi đã có "Số user" | Báo "Đã có thuộc tính tên này" |
| TC-CRM06-15 | E2E | "Lưu vào thư viện" với SKU trùng | Báo lỗi dưới dòng, không tạo sản phẩm |
| TC-CRM06-16 | E2E | Lưu vào thư viện rồi Huỷ trình sửa | Hộp hỏi nhắc sản phẩm đã lưu vẫn giữ; thư viện vẫn có sản phẩm |
| TC-CRM06-17 | E2E | Nút Back khi đang sửa có thay đổi | Hỏi trước khi đóng |
| TC-CRM06-18 | E2E | Màn 390 px | Bảng cuộn ngang, cột Tên dính trái, panel thư viện toàn màn hình |
| TC-CRM06-19 | E2E | Esc khi panel thư viện mở | Chỉ panel đóng |
| TC-CRM06-20 | A11y | Đổi thứ tự dòng bằng Alt+↑ | Làm được, có thông báo cho trình đọc màn hình |
| TC-CRM06-21 | E2E | Thêm 3 sản phẩm, 1 sản phẩm có mặc định trường tuỳ chỉnh | Toast có phần "đã tự điền" |
| TC-CRM06-22 | Unit | Tạm tính 10.000.000, chiết khấu Deal 12.000.000 ₫, VAT 10% | Tổng 0 |
| TC-CRM06-23 | E2E | Người dùng đã tắt cột Kỳ hạn, thêm sản phẩm Hằng tháng | Cột Kỳ hạn hiện lại |

---

## 10. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Line item, điều chỉnh, sản phẩm lưu `localStorage` | Collection CRM-00 §5.7–5.9, API §5 |
| Amount ghi từ FE sau khi lưu | Handler F03-S2 §6.4 trong cùng giao dịch |
| Sự kiện "Cập nhật line items: n dòng, tổng …" do FE ghi | Không có sự kiện riêng cho line item; timeline có sự kiện đổi Amount (F03-S3) |
| Nhiều dòng thuế tính chồng (thuế sau tính trên cả thuế trước) | Không chồng (§6) |
| Cấu hình cột lưu chung cho mọi người (`db.liCols`) | Theo người dùng (F03-S4) |
| Thuộc tính tuỳ chỉnh chỉ tồn tại trong bộ nhớ trình duyệt; giá trị mặc định ở `product.defaults` | Trường thật trên `crm_line_items` và trường đi cặp trên `crm_products` (F03-S4) |
| "Lưu vào thư viện" tự sinh SKU `CUSTOM-n` | Lấy SKU của dòng, có thể trống |
| "+ Tạo sản phẩm" chỉ hiện toast | Mở panel tạo sản phẩm (§4.3) |
| Không kiểm hai người cùng sửa | `version` và `409` (§5.2) |
| Không làm tròn | Làm tròn tới đồng ở ba chỗ (§6) |

---

## 11. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | Chiết khấu dòng trừ trên cả dòng (như prototype) hay trên từng đơn vị (như "Unit discount" của HubSpot)? Spec viết theo prototype | PO / khách | §4.2, §6 |
| Q2 | VAT mặc định 10% (theo prototype) có đúng với mức khách đang xuất hoá đơn không, hay để trống cho người dùng tự nhập? | Khách / kế toán | §4.7 |
| Q3 | Số lượng có cần số thập phân không? (CRM-00 Q7) | Khách | §4.2 |
| Q4 | Có cần lưu "tạm tính", "tổng" riêng từng thời điểm để làm báo giá không? Giai đoạn này chỉ lưu `line_items_total` | PO | §6 |
| Q5 | Sheet ghi L-01, L-02, L-04, L-11 là "Chỉ FE" nhưng cần BE. Đồng ý sửa cột Phạm vi? | PO | §1 |

---

## Liên kết

- Plan: `00-PLAN-viet-spec.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` §5.4, §5.7–5.9, §11
- Deals: `CRM-04-deals.md` §6.1, §6.4
- Spec nền: `ERPMini/features/features/F03-S2-truong-tinh-rollup.md` §6.4, `F03-S4-truong-tuy-chinh-cau-hinh-hien-thi.md`
- Design system: `../DESIGN-SYSTEM-HUBSPOT.md` §6.11, §7.4
- Đối chiếu: `../DOI-CHIEU-CHUC-NANG.md` §15

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-09-30 | v1.0 — bản đầu | TTS (qua Claude) |

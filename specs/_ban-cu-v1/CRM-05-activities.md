# CRM-05 — Activities: cửa sổ soạn và timeline

> **Trạng thái:** 💡 Proposed · v1.0 · 30/09/2026 · chờ review
> **Tính năng sở hữu (16):** A-01 → A-16
> **Phụ thuộc:** `F03-S6` (API hoạt động, timeline, job nhắc và lặp) · `F03-S3` (sự kiện, người theo dõi) · `CRM-00` §5.10, §5.11 (dữ liệu) · `CRM-01` §5.2, §5.5 (nút nhanh, cột giữa) · `DESIGN-SYSTEM-HUBSPOT.md` §6.8, §6.9c, §6.9d
> **Prototype:** `crm-record-hubspot.html?type=contact|company|deal&id=` (tab Hoạt động) · `crm-giao-dich-hubspot.html` (Lên lịch từ danh sách Deals) · code `crm-objects.js` (`composer`, `timeline`) · CSS `crm-shared.css` (`.composer`, `.cm-*`, `.tl-*`, `.ta`)
> **Nguồn HubSpot:** portal 247428660, Deal 001, khảo sát 29/09/2026 (chỉ mở và đóng cửa sổ soạn, không lưu gì) — `DOI-CHIEU-CHUC-NANG.md` §14

---

## 1. Phạm vi

File này đặc tả **giao diện** của hoạt động: cửa sổ soạn và timeline trên trang chi tiết Contact, Company, Deal. Dữ liệu, API, job nền ở `F03-S6`.

| ID | Tính năng | Ưu tiên | Phạm vi sheet | Mục |
|---|---|---|---|---|
| A-01 | Khung cửa sổ soạn | P0 | Chỉ FE | §3.1 |
| A-02 | Soạn thảo có định dạng | P1 | FE + BE | §3.2 |
| A-03 | Liên kết với N bản ghi | P0 | FE + BE | §3.3 |
| A-04 | Task theo dõi | P1 | Chỉ FE | §3.4 |
| A-05 | Ghi chú | P0 | Chỉ FE | §4.1 |
| A-06 | Task | P0 | Chỉ FE | §4.2 |
| A-07 | Nhắc nhở và lặp lại task | P2 | FE + BE | §4.2, F03-S6 §7 |
| A-08 | Ghi lại cuộc gọi | P0 | Chỉ FE | §4.3 |
| A-09 | Ghi lại cuộc họp | P0 | Chỉ FE | §4.4 |
| A-10 | Lên lịch cuộc họp | P1 | FE + BE | §4.5 |
| A-11 | Tab và nút theo tab | P0 | Chỉ FE | §5.2 |
| A-12 | Bộ lọc timeline | P1 | Chỉ FE | §5.3 |
| A-13 | Thẻ hoạt động | P1 | Chỉ FE | §5.5 |
| A-14 | Hoàn thành task | P0 | Chỉ FE | §5.6 |
| A-15 | Email, SMS, gọi trực tiếp | P2 | Ngoài phạm vi | §5.8 |
| A-16 | Bình luận trên hoạt động | P2 | FE + BE | §5.7 |

Lệch so với sheet, cần PO xác nhận:

- Sheet ghi A-04, A-05, A-06, A-08, A-09, A-11, A-12, A-13, A-14 là "Chỉ FE", nhưng tất cả cần collection `crm_activities` và API của F03-S6 (tạo, timeline, ghim, hoàn thành). Không có BE thì không lưu, không đọc được gì. Đề nghị sửa cột Phạm vi thành "FE + BE" (giống cách xử lý D-03, D-07, D-08 ở CRM-04 §1).
- A-16 (bình luận) theo sheet chỉ áp cho **Ghi chú và Task**; spec giữ đúng phạm vi đó. A-16 là P2 và QĐ-10 đề xuất để sang đợt sau; phần đặc tả ở §5.7 viết sẵn để dùng khi chốt làm.
- Tên tab và mục lọc dùng "Email", "Task" thay cho "Emails", "Tasks" của sheet (A-11, A-12), theo quy ước dùng ngôn ngữ sản phẩm tiếng Việt.

**Ngoài phạm vi file này:** tab Tổng quan (CRM-02 §5.3, CRM-03 §5.3); trường tính Ngày hoạt động gần nhất, Liên hệ gần nhất, Hoạt động tiếp theo (F03-S2); nội dung sự kiện hệ thống (F03-S3 §3.4).

---

## 2. Nơi mở cửa sổ soạn

Cửa sổ soạn là một component dùng chung (`ActivityComposer`), mở được từ nhiều nơi. Nơi mở quyết định **bản ghi chủ** (F03-S6 §2).

| Nơi mở | Bản ghi chủ | Loại |
|---|---|---|
| Sáu nút nhanh trên thẻ định danh (CRM-01 §5.2) | Bản ghi đang mở | Ghi chú · Task · Ghi lại cuộc gọi (nút "Gọi") · Lên lịch cuộc họp (nút "Họp") · Ghi lại cuộc gọi, Ghi lại cuộc họp (menu "Thêm") |
| Nút theo tab trên timeline (§5.2) | Bản ghi đang mở | Theo tab |
| "Tạo hoạt động ▾" ở tab Tổng quan (CRM-02 §5.3) | Bản ghi đang mở | Ghi chú · Cuộc gọi · Task · Cuộc họp |
| "Lên lịch ▾" ở cột Hoạt động tiếp theo của danh sách Deals (CRM-04 §3.4) | Deal của dòng đó | Lên lịch cuộc họp · Task |
| "Sửa" trên thẻ hoạt động (§5.5) | Bản ghi đang mở | Loại của hoạt động |

Mỗi lúc chỉ có **một** cửa sổ soạn. Mở cửa sổ mới khi cửa sổ cũ có nội dung chưa lưu thì hỏi "Bỏ nội dung đang soạn?" như khi đóng (§3.1); cửa sổ cũ rỗng thì thay luôn.

Cửa sổ soạn nằm trên mọi nội dung của trang. Người dùng vẫn cuộn, bấm được trang phía sau (không có scrim), để vừa xem thông tin khách vừa ghi.

---

## 3. Cửa sổ soạn — phần chung

### 3.1 Khung (A-01)

**Vị trí và kích thước** (DS-HUBSPOT §6.9d, lấy từ `crm-shared.css` `.composer`):

| Trạng thái | Vị trí | Rộng | Ghi chú |
|---|---|---|---|
| Bình thường | Dính đáy màn hình, cách mép phải 16 px | 500 px (tối đa bề rộng màn hình trừ 32 px) | Cao theo nội dung, tối đa 86% chiều cao màn hình; phần thân cuộn trong |
| Thu gọn | Như trên | 320 px | Chỉ còn thanh tiêu đề; bấm vào thanh để mở lại |
| Phóng to | Giữa màn hình, cách đáy 4% | 860 px (tối đa bề rộng màn hình trừ 32 px) | Bo đủ bốn góc |
| Màn hẹp (< 600 px) | Toàn màn hình | 100% | Không có nút phóng to |

**Thanh tiêu đề**: nút ⌄ thu gọn (mũi tên lật lên khi đang thu gọn) · tên cửa sổ · nút ⛶ phóng to/thu nhỏ · nút ✕ đóng. Tên cửa sổ: "Ghi chú", "Task", "Ghi lại cuộc gọi", "Ghi lại cuộc họp", "Lên lịch cuộc họp"; khi sửa: "Sửa ghi chú", "Sửa task"…

**Từ trên xuống trong thân**: phần riêng theo loại (§4) · dòng báo lỗi (ẩn khi không có lỗi) · "Liên kết với N bản ghi ▾" (§3.3) · dòng task theo dõi (§3.4, chỉ khi tạo mới và không phải Task) · chân: nút chính (§4) và, khi sửa, nút "Huỷ".

**Đóng và bỏ nội dung**

- Bấm ✕, nhấn Esc, hoặc mở cửa sổ khác: nếu có nội dung chưa lưu thì hỏi "Bỏ nội dung đang soạn? Nội dung chưa lưu sẽ mất." với hai nút "Bỏ" và "Tiếp tục soạn". Không có nội dung thì đóng luôn.
- "Có nội dung" nghĩa là: ô soạn thảo có chữ, hoặc ô tiêu đề có chữ, hoặc (khi sửa) bất kỳ ô nào khác giá trị ban đầu.
- Rời trang (bấm link, đổi trang chi tiết) khi đang có nội dung chưa lưu: hỏi như trên. Tải lại trình duyệt: dùng hộp xác nhận mặc định của trình duyệt.

**Phím tắt**: Ctrl+Enter (⌘+Enter trên Mac) bấm nút chính. Esc như ✕. Enter trong ô soạn thảo là xuống dòng, không gửi.

**Khi lưu**: nút chính chuyển trạng thái đang lưu, không bấm được lần hai. Lưu xong: đóng cửa sổ, toast "Đã lưu {loại}" (có task theo dõi thì "Đã lưu {loại} và task theo dõi"), timeline và các vùng liên quan tải lại (§6). Lưu lỗi: giữ cửa sổ và nội dung, hiện lỗi tiếng Việt từ API ở dòng báo lỗi.

### 3.2 Soạn thảo có định dạng (A-02)

- Ô soạn thảo cao tối thiểu 110 px, tối đa 40% chiều cao màn hình, cuộn trong. Chữ gợi ý theo loại: "Bắt đầu nhập để ghi chú…", "Bắt đầu nhập để ghi lại cuộc gọi…", "Bắt đầu nhập để ghi lại cuộc họp…", "Ghi chú…" (Task).
- Thanh định dạng dưới ô: **Đậm** (Ctrl+B) · *Nghiêng* (Ctrl+I) · Gạch chân (Ctrl+U) · Xoá định dạng · vạch ngăn · Danh sách chấm · Danh sách số.
- **Không có** nút chèn liên kết và nút đính kèm. Prototype có hai nút này nhưng chỉ hiện toast; thẻ `<a>` không nằm trong danh sách thẻ được giữ (F03-S6 §3.2) và đính kèm chưa làm (F03-S6 Q3).
- Dán nội dung từ nơi khác: giữ đậm, nghiêng, gạch chân, danh sách; bỏ màu, cỡ chữ, bảng, ảnh. Việc lọc cuối cùng làm ở máy chủ; FE lọc trước để người dùng thấy đúng cái sẽ được lưu.
- Giới hạn 20.000 ký tự **HTML sau khi lọc** (F03-S6 §3.2). FE chạy cùng quy tắc lọc rồi đếm, để con số khớp với máy chủ. Còn dưới 1.000 ký tự thì hiện bộ đếm "Còn 850 ký tự"; vượt thì nút chính vô hiệu.

### 3.3 Liên kết với N bản ghi (A-03)

- Khi mở cửa sổ (tạo mới), FE gọi gợi ý liên kết (F03-S6 §4.1) với bản ghi chủ. Tất cả gợi ý được tick sẵn.
- Dòng "Liên kết với 3 bản ghi ▾". Bấm mở danh sách: mỗi dòng có checkbox · biểu tượng đối tượng · tên bản ghi · loại (Contact / Company / Deal) chữ nhạt.
- Bỏ tick là bỏ liên kết. Bản ghi chủ cũng bỏ tick được, nhưng khi còn 0 bản ghi thì nút chính vô hiệu và dòng báo lỗi ghi "Chọn ít nhất một bản ghi để liên kết".
- Cuối danh sách có ô "Thêm bản ghi…" tìm theo tên trên cả ba đối tượng (tối đa 10 kết quả mỗi đối tượng) để gắn thêm bản ghi không có trong gợi ý.
- Contact được chọn ở ô "Đã liên hệ" (cuộc gọi) hoặc "Người tham dự" (cuộc họp) luôn nằm trong danh sách liên kết với vai trò tương ứng. Bỏ tick contact đó ở danh sách liên kết thì bỏ luôn ở ô người; tick người mới ở ô người thì thêm vào danh sách liên kết.
- Khi sửa hoạt động, danh sách là liên kết hiện có của hoạt động; không gọi gợi ý lại.

### 3.4 Task theo dõi (A-04)

- Chỉ hiện khi tạo mới Ghi chú, Cuộc gọi, Cuộc họp. Không hiện khi tạo Task và khi sửa.
- Một dòng: ☐ "Tạo task" [loại task ▾: To-do / Gọi điện / Email] "để theo dõi" [mốc ▾].
- Mốc (viết thường vì đứng giữa câu): ngày mai · sau 2 ngày làm việc · sau 3 ngày làm việc ({thứ}) · sau 1 tuần · sau 2 tuần · sau 1 tháng. Mặc định "sau 3 ngày làm việc". Giờ hạn luôn là 08:00.
- Mặc định ô tick **không** được tick.
- Tick và lưu: FE gửi `followUpTask` (F03-S6 §4.2). Tiêu đề, người thực hiện, liên kết do máy chủ đặt.

**Cách tính mốc ngày** (dùng cho cả Task ở §4.2). Tính theo giờ Việt Nam, từ ngày hôm nay:

| Mốc | Cách tính | Ví dụ khi hôm nay là thứ Tư 30/09/2026 |
|---|---|---|
| Hôm nay | Hôm nay | 30/09 |
| Ngày mai | Hôm nay + 1 ngày lịch | 01/10 |
| Sau n ngày làm việc | Đếm tới n ngày, bỏ thứ Bảy và Chủ nhật | Sau 2: thứ Sáu 02/10. Sau 3: thứ Hai 05/10 |
| Sau 1 tuần, 2 tuần | + 7, + 14 ngày lịch | 07/10, 14/10 |
| Sau 1 tháng | Cùng ngày tháng sau; tháng sau không có ngày đó thì ngày cuối tháng | 30/10 |

Chưa trừ ngày nghỉ lễ (F03-S6 Q2). Nhãn "Sau 3 ngày làm việc (Thứ Hai)" ghi thứ của ngày tính được.

---

## 4. Cửa sổ soạn — phần riêng theo loại

Tên trường, danh mục và ràng buộc theo CRM-00 §5.10 và F03-S6 §3.3.

### 4.1 Ghi chú (A-05)

- Dòng đầu: "Cho" + tag tên bản ghi chủ.
- Ô soạn thảo (§3.2).
- Nút chính: **"Tạo ghi chú"**. Nội dung rỗng khi bấm: dòng báo lỗi "Nhập nội dung ghi chú", con trỏ vào ô soạn thảo.

### 4.2 Task (A-06, A-07)

| # | Ô | Kiểu | Mặc định | Ràng buộc |
|---|---|---|---|---|
| 1 | Tên task | Ô chữ lớn không viền, chữ gợi ý "Nhập tên task" | — | Bắt buộc |
| 2 | Ngày thực hiện | Chọn mốc (§3.4, thêm "Hôm nay" và "Chọn ngày…") + ô giờ | Sau 3 ngày làm việc · 08:00 | "Chọn ngày…" hiện ô chọn ngày. Ngày trong quá khứ được phép (ghi lại việc đã trễ), hiện chữ nhỏ "Ngày này đã qua" |
| 3 | Gửi nhắc nhở | Chọn (D-REMINDER) | Không nhắc | |
| 4 | Lặp lại | Chọn: Không lặp · Hằng ngày · Hằng tuần · 2 tuần một lần · Hằng tháng · Hằng quý · Nửa năm · Hằng năm (D-REPEAT) | Không lặp | Prototype là ô tick; bản thật là ô chọn chu kỳ vì máy chủ cần biết chu kỳ (F03-S6 §3.3) |
| 5 | Loại task | Chọn (D-TASKKIND) | To-do | |
| 6 | Ưu tiên | Chọn (D-PRIORITY) | Không | |
| 7 | Hàng đợi | Chọn (danh mục `queue`) | — | **Ẩn khi danh mục rỗng** (hiện tại khách chưa có hàng đợi nào, CRM-00 §5.10) |
| 8 | Người thực hiện | Chọn nhân viên có tìm | Nhân viên gắn với tài khoản đang đăng nhập | Bắt buộc. Chỉ nhân viên "Đang làm việc". Người dùng chưa gắn nhân viên: ô trống, bắt buộc chọn |
| 9 | Ghi chú | Ô soạn thảo (§3.2) | — | |

- Bố cục: tên task một hàng; hàng 2 gồm Ngày thực hiện và Gửi nhắc nhở; hàng 3 là Lặp lại; hàng 4 gồm Loại, Ưu tiên, Hàng đợi, Người thực hiện; cuối là ô Ghi chú.
- Chọn "Gửi nhắc nhở" khác "Không nhắc" khi người thực hiện chưa có tài khoản ERP: chữ nhỏ dưới ô "{tên} chưa có tài khoản ERP nên sẽ không nhận được nhắc".
- Chọn "Lặp lại": chữ nhỏ "Task kỳ tiếp được tạo khi task này được đánh dấu xong" (F03-S6 §7.2), để người dùng không chờ task tự hiện theo lịch.
- Nút chính: **"Tạo"**. Tên trống: "Nhập tên task". Chưa có người thực hiện: "Chọn người thực hiện".

### 4.3 Ghi lại cuộc gọi (A-08)

| # | Ô | Kiểu | Mặc định |
|---|---|---|---|
| 1 | Đã liên hệ | Chọn nhiều contact (§4.6) | Theo §4.6 |
| 2 | Kết quả cuộc gọi | Chọn (D-CALLOUTCOME), mục đầu "Chọn kết quả" | Chưa chọn |
| 3 | Hướng cuộc gọi | Chọn: Gọi đi / Gọi đến, mục đầu "Chọn hướng" | Chưa chọn |
| 4 | Thời điểm | Ngày giờ | Thời điểm mở cửa sổ |
| 5 | Nội dung | Ô soạn thảo | — |

- Ba ô đầu một hàng; Thời điểm một hàng; rồi ô soạn thảo.
- Không ô nào bắt buộc ngoài Thời điểm. Để trống kết quả, hướng là hợp lệ.
- Nút chính: **"Ghi lại cuộc gọi"**.

### 4.4 Ghi lại cuộc họp (A-09)

| # | Ô | Kiểu | Mặc định |
|---|---|---|---|
| 1 | Người tham dự | Chọn nhiều contact (§4.6) | Theo §4.6 |
| 2 | Kết quả cuộc họp | Chọn (D-MEETOUTCOME), mục đầu "Chọn kết quả" | Chưa chọn |
| 3 | Bắt đầu | Ngày giờ | Thời điểm mở cửa sổ |
| 4 | Thời lượng | Chọn: 15 phút · 30 phút · 45 phút · 1 giờ · 1 giờ 30 phút · 2 giờ | 15 phút |
| 5 | Nội dung | Ô soạn thảo | — |

- Không có ô tiêu đề khi ghi lại cuộc họp mới (giống HubSpot). Máy chủ đặt tiêu đề "Cuộc họp" (F03-S6 §3.3). Khi sửa một cuộc họp đã có tiêu đề thì hiện ô tiêu đề.
- Nút chính: **"Ghi lại cuộc họp"**.

### 4.5 Lên lịch cuộc họp (A-10)

Cùng biểu mẫu với §4.4, khác ở:

- Có ô **Tiêu đề cuộc họp** ở trên cùng, bắt buộc. Trống thì "Nhập tiêu đề cuộc họp".
- Kết quả mặc định "Đã lên lịch".
- Bắt đầu mặc định 10:00 ngày mai; thời lượng mặc định 30 phút.
- Bắt đầu trong quá khứ: chữ nhỏ "Thời điểm này đã qua. Nếu cuộc họp đã diễn ra, hãy dùng Ghi lại cuộc họp." Vẫn cho lưu.
- Nút chính: **"Lưu lịch họp"**.
- Không gửi lời mời, không đồng bộ lịch Google, Outlook. Dưới nút chính có chữ nhỏ "Cuộc họp chỉ lưu trong ERP, chưa gửi lời mời cho người tham dự."

### 4.6 Ô chọn người (Đã liên hệ, Người tham dự)

- Nút hiện "{n} contact ▾". Bấm mở danh sách có checkbox.
- Danh sách người và giá trị chọn sẵn theo bản ghi chủ:

| Bản ghi chủ | Danh sách | Cuộc gọi chọn sẵn | Cuộc họp chọn sẵn |
|---|---|---|---|
| Contact | Chính contact đó | Contact đó | Contact đó |
| Deal | Contact của deal, xếp theo thời điểm gắn vào deal, cũ trước | Contact đầu danh sách | Mọi contact của deal |
| Company | Contact của công ty (tối đa 50), xếp theo tên | Không chọn sẵn | Không chọn sẵn |

  Trên trang Company không chọn sẵn ai, vì chọn cả công ty sẽ ghi sai "Liên hệ gần nhất" của những người không dự (F03-S2 §6.2).
- Có ô tìm khi danh sách hơn 7 người.
- Cuối danh sách có ô "Thêm contact khác…" tìm trên toàn bộ Contacts.
- Danh sách người rỗng (ví dụ deal chưa có contact): dòng "Chưa có contact liên kết" và ô tìm.

---

## 5. Timeline

### 5.1 Bố cục

Tab "Hoạt động" ở cột giữa trang chi tiết (CRM-01 §5.5). Từ trên xuống:

1. Hàng tab loại hoạt động (§5.2).
2. Thanh công cụ 1: ô "Tìm hoạt động" · nút theo tab (§5.2) · "Thu gọn tất cả ▾" bên phải.
3. Thanh công cụ 2, **chỉ ở tab Tất cả**: bộ lọc (§5.3).
4. Mục ghim, nhóm "Sắp tới", các nhóm theo tháng (§5.4).
5. Nút "Xem thêm hoạt động" khi còn trang sau.

Style theo DS-HUBSPOT §6.9c. Dữ liệu lấy từ API timeline của F03-S6 §5.

URL: tab con đang mở ghi vào query `?tab=activities&atab=CALL` để gửi link mở thẳng tab Cuộc gọi. Ô tìm và bộ lọc không ghi vào URL và không nhớ khi rời trang.

### 5.2 Tab và nút theo tab (A-11)

| Tab | Mã | Nút trên thanh công cụ |
|---|---|---|
| Tất cả hoạt động | `ALL` | Không có |
| Ghi chú | `NOTE` | "Tạo ghi chú" |
| Email | `EMAIL` | "Ghi lại email", "Soạn email": hiện ở trạng thái vô hiệu, tooltip "Email chưa có trong giai đoạn này" (A-15) |
| Cuộc gọi | `CALL` | "Ghi lại cuộc gọi" · "Gọi điện" (vô hiệu, tooltip "Gọi trực tiếp cần tổng đài, chưa có trong giai đoạn này. Dùng Ghi lại cuộc gọi.") |
| Task | `TASK` | "Tạo task" |
| Cuộc họp | `MEETING` | "Ghi lại cuộc họp" · "Lên lịch cuộc họp" |

- Đổi tab: gọi lại API với `tab` tương ứng, giữ chữ trong ô tìm. Riêng tab Email không gọi API mà hiện câu thông báo (§5.4), vì giai đoạn này không có dữ liệu email.
- Tab khác "Tất cả" không có bộ lọc loại, khoảng thời gian, người thực hiện.

### 5.3 Bộ lọc timeline (A-12)

Chỉ ở tab Tất cả. Một hàng chip lọc (DS-HUBSPOT §6.8 "Chip lọc"):

**"Hoạt động ({x}/9) ▾"** — popover rộng 520 px, có ô tìm, dòng "Chọn tất cả", rồi ba cột nhóm:

| Nhóm | Mục | Mã gửi API |
|---|---|---|
| Giao tiếp | Cuộc gọi · Email | `CALL`, `EMAIL` |
| Hoạt động nhóm | Cuộc họp · Ghi chú · Task | `MEETING`, `NOTE`, `TASK` |
| Cập nhật | Hoạt động Deal · Thay đổi liên kết · Thay đổi thuộc tính · Tạo bản ghi | `S_STAGE`, `S_ASSOC`, `S_PROP`, `S_CREATED` |

- `x` là số mục đang tick. Đủ 9 thì chip ở trạng thái thường; ít hơn thì chip nổi bật và có nút ✕ để về đủ 9.
- Bỏ tick hết: timeline rỗng với câu "Không có hoạt động phù hợp bộ lọc."
- "Email" vẫn có trong danh sách để giữ bố cục HubSpot; tick hay không cũng không thay đổi kết quả trong giai đoạn này.

**"Mọi thời gian ▾"** — Mọi thời gian · Hôm nay · 7 ngày qua · 30 ngày qua · 90 ngày qua · 12 tháng qua · Tuỳ chọn (hai ô Từ – Đến). Cách tính mốc giống CRM-01 §4.5 (giờ Việt Nam, gồm cả hôm nay); "12 tháng qua" là từ cùng ngày năm trước đến hôm nay. Chip đổi chữ theo mốc đang chọn.

**"Người thực hiện ▾"** — danh sách nhân viên có checkbox, người đang đăng nhập đứng đầu kèm "(tôi)"; ô tìm khi hơn 7 người; ba nhóm theo trạng thái làm việc như popover owner (CRM-01 §4.5). Chip hiện "Người thực hiện (2)" khi có chọn. Ý nghĩa "người thực hiện" với từng loại mục theo F03-S6 §5.1 (`actor`).

**"Xoá tất cả"** — link, chỉ hiện khi có ít nhất một bộ lọc khác mặc định; đưa ba chip về mặc định, giữ ô tìm.

Nhóm ghim và nhóm "Sắp tới" cũng chịu bộ lọc loại, người và ô tìm, nhưng không chịu khoảng thời gian (F03-S6 §5.3).

**"Thu gọn tất cả ▾"** — menu một mục đổi qua lại "Thu gọn tất cả" / "Mở rộng tất cả". Áp cho mọi thẻ đang hiện và các thẻ tải thêm sau đó. Bấm một thẻ vẫn mở, đóng riêng thẻ đó.

**Ô tìm** — gửi `q` sau khi ngừng gõ 300 ms. Áp cho mọi tab.

### 5.4 Nhóm và thứ tự

| Thứ tự | Nhóm | Tiêu đề nhóm | Nội dung |
|---|---|---|---|
| 1 | Ghim | Không có tiêu đề; thẻ có dải "📌 Đã ghim" phía trên | `pinned` |
| 2 | Sắp tới | "Sắp tới" | `upcoming.items`, việc gần nhất lên trước. `total` > 20 thì cuối nhóm có "Xem thêm việc sắp tới ({còn lại})", tải tiếp ngay trong nhóm bằng `section=upcoming` (F03-S6 §5.1) |
| 3 | Theo tháng | "Tháng 9 năm 2026" | `items`, mới nhất trước, nhóm theo tháng của thời điểm hiển thị |

- "Xem thêm hoạt động" tải trang tiếp (con trỏ `nextCursor`) và nối vào cuối; mục của tháng đang dở tiếp tục dưới cùng tiêu đề tháng đó.
- Trạng thái:

| Trạng thái | Hiển thị |
|---|---|
| Đang tải lần đầu | Skeleton 4 thẻ |
| Tab Tất cả, không có mục nào, không lọc | "Chưa có hoạt động nào. Ghi lại cuộc gọi, cuộc họp hoặc thêm ghi chú để cả đội cùng theo dõi." |
| Có lọc hoặc tìm, không khớp | "Không có hoạt động phù hợp bộ lọc." + link "Xoá tất cả" |
| Tab loại, không có mục | "Chưa có {cuộc gọi / ghi chú / task / cuộc họp} nào." |
| Tab Email | "Gửi và ghi email chưa có trong giai đoạn này." |
| Lỗi tải | "Không tải được hoạt động." + nút "Thử lại" |

### 5.5 Thẻ hoạt động (A-13)

**Phần đầu thẻ** (luôn hiện, bấm vào vùng trống để thu gọn / mở):

| Loại | Biểu tượng | Tiêu đề |
|---|---|---|
| Ghi chú | `sticky_note_2` | "Ghi chú" + chữ nhạt " bởi {người tạo}" |
| Cuộc gọi | `call` | "Cuộc gọi" + " bởi {người tạo}" |
| Cuộc họp | `event` | Tiêu đề cuộc họp + " bởi {người tạo}" |
| Task | vòng tròn tick (§5.6) | Tiêu đề task; task đã xong thì gạch ngang |
| Sự kiện | `history`; sự kiện Hoạt động Deal thêm biểu tượng bắt tay nhỏ | Tiêu đề sự kiện (F03-S3 §3.4) |

Bên phải: thời điểm hiển thị dạng `30/09/2026 lúc 09:15` · nút "Thao tác ▾" (chỉ với hoạt động, không có ở sự kiện).

**Phần thân** (ẩn khi thẻ thu gọn):

- Dòng thông tin theo loại, dạng "Nhãn: **giá trị**" cách nhau:
  - Task: Hạn: 05/10/2026 08:00 (kèm nhãn **Quá hạn** màu lỗi khi chưa xong và hạn đã qua) · Loại · Ưu tiên · Người thực hiện · biểu tượng lặp "Hằng tuần" nếu có lặp · biểu tượng chuông nếu có nhắc.
  - Cuộc gọi: Hướng · Kết quả · Đã liên hệ: {tên}.
  - Cuộc họp: Bắt đầu · Thời lượng · Kết quả · Tham dự: {tên}.
  - Giá trị trống hiện "—".
- Nội dung HTML đã lọc. Nội dung dài hơn 8 dòng thì cắt kèm "Xem thêm".
- Sự kiện: câu hiển thị theo F03-S3 §3.4. Sự kiện lan từ bản ghi khác có thêm dòng nhỏ "Từ {Deal DEAL-013}" dạng link.
- Chân thẻ:
  - "{n} liên kết ▾" (n từ `links.count`, không tính bản ghi đang mở; ẩn khi n = 0). Bấm hiện danh sách tên bản ghi dạng link, cách nhau bằng " · ".
  - "Bình luận ({n})" (§5.7), chỉ với Ghi chú và Task.

**Menu "Thao tác ▾"** (mục hiện theo `can` của API):

| Mục | Hành vi |
|---|---|
| Ghim lên đầu / Bỏ ghim | F03-S6 §4.6. Toast "Đã ghim lên đầu timeline" / "Đã bỏ ghim". Chỉ ghim được một hoạt động mỗi bản ghi; ghim cái mới thì cái cũ tự bỏ |
| Sửa | Mở cửa sổ soạn ở chế độ sửa (§5.9) |
| Xem liên kết | Mở danh sách liên kết ở chân thẻ |
| vạch ngăn | |
| Xoá | Hộp xác nhận nút đỏ "Xoá": "Hoạt động này sẽ bị xoá khỏi mọi bản ghi liên kết. Có thể khôi phục trong 30 ngày." Không ghi số bản ghi, vì người xem có thể không thấy hết các bản ghi liên kết. Xoá xong toast "Đã xoá hoạt động" |

HubSpot có mục "History" (lịch sử sửa hoạt động). Giai đoạn này không có mục đó trên thẻ.

### 5.6 Hoàn thành task (A-14)

- Vòng tròn tick trước tiêu đề task, trên thẻ ở timeline và ở nhóm Sắp tới.
- Bấm: gọi F03-S6 §4.5 `complete`; vòng tròn thành dấu tick đầy, tiêu đề gạch ngang, nhãn "Quá hạn" biến mất, toast "Đã hoàn thành task". Task rời nhóm Sắp tới và xuống nhóm tháng theo ngày hoàn thành.
- Bấm lại vào task đã xong: `reopen`, toast "Đã mở lại task". Nếu phản hồi báo task kỳ tiếp đã tạo (task lặp): toast "Đã mở lại task. Task kỳ tiếp đã được tạo trước đó, xoá nếu không cần."
- Hoàn thành task lặp: toast "Đã hoàn thành task. Đã tạo task kỳ tiếp hạn {dd/mm/yyyy}."
- Vòng tròn chỉ bấm được khi `can.complete = true` (người thực hiện hoặc người có quyền sửa). Không được: vòng tròn mờ, tooltip "Bạn không phải người thực hiện task này".
- Cập nhật lạc quan: đổi giao diện ngay, lỗi thì trả lại trạng thái cũ và hiện lỗi.

### 5.7 Bình luận (A-16)

- "Bình luận ({n})" ở chân thẻ **Ghi chú và Task** (theo sheet A-16; cuộc gọi, cuộc họp không có). Bấm mở vùng bình luận ngay dưới thẻ.
- Danh sách bình luận cũ nhất trước: avatar chữ cái · tên người viết · thời gian tương đối ("3 phút trước", rê chuột hiện ngày giờ đầy đủ) · nội dung.
- Ô viết bình luận: ô soạn thảo thu nhỏ (cao 60 px), thanh định dạng chỉ có Đậm, Nghiêng, Danh sách chấm. Nút "Gửi" (Ctrl+Enter). Tối đa 5.000 ký tự.
- Bình luận của mình có menu ⋯: Sửa · Xoá (hộp xác nhận "Xoá bình luận này?").
- Không có bình luận trên sự kiện hệ thống.

### 5.8 Email, SMS, gọi trực tiếp (A-15 — ngoài phạm vi)

Không làm gửi, ghi email, SMS, WhatsApp, LinkedIn, gọi qua tổng đài. Những chỗ còn giữ để bố cục giống HubSpot:

| Chỗ | Cách hiện |
|---|---|
| Nút "Email" trong sáu nút nhanh | Vô hiệu (CRM-01 §5.2) |
| Menu "Thêm": Ghi lại email, SMS, WhatsApp, LinkedIn | Nhãn "Ngoài phạm vi" (CRM-01 §5.2) |
| Tab Email | Câu thông báo (§5.4), không gọi API |
| Nút "Gọi điện" ở tab Cuộc gọi | Vô hiệu, tooltip (§5.2) |
| Mục "Email" trong bộ lọc | Có nhưng không có dữ liệu (§5.3) |

AC của A-15 kiểm rằng các chỗ này hiện đúng trạng thái và không gọi API nào.

### 5.9 Sửa hoạt động

- "Sửa" mở cửa sổ soạn cùng loại, điền giá trị hiện có, tên cửa sổ "Sửa {loại}". Nút chính "Lưu", có thêm "Huỷ".
- Không có dòng task theo dõi.
- Danh sách liên kết là liên kết hiện có (§3.3). Lưu gửi PATCH với danh sách đầy đủ (F03-S6 §4.3).
- Task: sửa được mọi ô trong biểu mẫu. Trạng thái xong / chưa xong không có trong biểu mẫu; đổi bằng vòng tròn tick trên thẻ (§5.6).
- Lưu xong toast "Đã lưu thay đổi".

---

## 6. Làm mới sau khi thay đổi

Sau khi tạo, sửa, xoá, hoàn thành hoạt động, FE tải lại:

| Vùng | Khi nào |
|---|---|
| Timeline (trang đầu, giữ tab và bộ lọc) | Luôn |
| Tab Tổng quan: Việc sắp tới, Tương tác gần đây, Tóm tắt (CRM-02 §5.3) | Luôn |
| Card thuộc tính chính (Liên hệ gần nhất) | Khi hoạt động là Cuộc gọi hoặc Cuộc họp |
| Ô Hoạt động tiếp theo trên danh sách Deals | Khi cửa sổ soạn mở từ danh sách (CRM-04 §3.4) |

Trường tính do F03-S2 cập nhật sau giao dịch, thường trong vài giây (p95 < 5 giây). Với các vùng có trường tính, FE tải lại tối đa 3 lần, cách nhau 2 giây, dừng sớm khi giá trị đã đổi; sau đó để nguyên, lần tải sau sẽ đúng.

---

## 7. Quyền trên giao diện

| Hành động | Điều kiện | Không đủ quyền |
|---|---|---|
| Mở cửa sổ soạn | Tạo được bản ghi `crm_activities` và đọc được bản ghi chủ (CRM-01 §5.2) | Năm nút hoạt động vô hiệu, tooltip "Bạn chưa có quyền ghi hoạt động"; nút theo tab ẩn |
| Sửa, xoá, ghim, hoàn thành | Theo `can` trong mỗi mục của API timeline | Mục menu ẩn; vòng tròn tick mờ |
| Bình luận | Đọc được hoạt động | — |
| Xem timeline | Đọc được bản ghi | Trang chi tiết không mở được (CRM-01) |

FE không tự suy quyền từ vai trò; chỉ dựa vào `can` và quyền collection trả về từ API.

---

## 8. Tiêu chí nghiệm thu

**AC-A01-1 — Khung cửa sổ soạn**
Given trang chi tiết Contact Hạnh
When bấm nút "Ghi chú", gõ vài chữ, bấm ⌄, rồi bấm vào thanh tiêu đề
Then cửa sổ hiện ở góc phải dưới, thu còn thanh tiêu đề rộng 320 px, rồi mở lại với nội dung còn nguyên.

**AC-A01-2 — Hỏi trước khi bỏ nội dung**
Given cửa sổ Ghi chú đang có chữ
When bấm ✕
Then hỏi "Bỏ nội dung đang soạn?"; chọn "Tiếp tục soạn" thì cửa sổ còn nguyên; chọn "Bỏ" thì đóng.

**AC-A01-3 — Ctrl+Enter**
Given cửa sổ Ghi chú có nội dung hợp lệ
When nhấn Ctrl+Enter
Then ghi chú được lưu, cửa sổ đóng, toast "Đã lưu ghi chú".

**AC-A01-4 — Một cửa sổ mỗi lúc**
Given cửa sổ Task đang có tên task chưa lưu
When bấm nút "Ghi chú"
Then hỏi "Bỏ nội dung đang soạn?" trước khi mở cửa sổ Ghi chú.

**AC-A02-1 — Định dạng được giữ**
Given cửa sổ Ghi chú
When gõ một dòng in đậm và một danh sách hai chấm, lưu
Then thẻ trên timeline hiện đúng chữ đậm và danh sách.

**AC-A02-2 — Dán từ Word**
Given nội dung Word có chữ màu đỏ cỡ 20 và một bảng
When dán vào ô soạn thảo
Then chữ còn, màu và cỡ chữ bị bỏ, bảng thành các dòng chữ.

**AC-A03-1 — Tự tick liên kết gợi ý**
Given Contact Hạnh có công ty chính Thiên Phúc và DEAL-013 đang mở
When mở cửa sổ Ghi chú từ trang Hạnh
Then dòng ghi "Liên kết với 3 bản ghi"; mở ra thấy Hạnh, Thiên Phúc, DEAL-013 đều được tick.

**AC-A03-2 — Bỏ chọn một bản ghi**
Given như trên
When bỏ tick DEAL-013 rồi lưu ghi chú
Then ghi chú hiện trên timeline Hạnh và Thiên Phúc, không hiện trên DEAL-013.

**AC-A03-3 — Không cho lưu khi không còn liên kết**
Given cửa sổ Ghi chú có nội dung
When bỏ tick cả ba bản ghi
Then nút "Tạo ghi chú" vô hiệu và có dòng "Chọn ít nhất một bản ghi để liên kết".

**AC-A04-1 — Task theo dõi**
Given hôm nay thứ Tư 30/09/2026
When ghi lại cuộc gọi có tick "Tạo task To-do để theo dõi sau 3 ngày làm việc (Thứ Hai)"
Then toast "Đã lưu cuộc gọi và task theo dõi"; nhóm Sắp tới có task "Theo dõi: cuộc gọi với Nguyễn Thị Hạnh" hạn 05/10/2026 08:00.

**AC-A05-1 — Tạo ghi chú**
Given trang Deal DEAL-013
When bấm "Ghi chú", nhập nội dung, bấm "Tạo ghi chú"
Then dòng đầu cửa sổ ghi "Cho DEAL-013"; lưu xong thẻ Ghi chú "bởi {tôi}" đứng đầu tháng hiện tại.

**AC-A05-2 — Ghi chú trống**
Given cửa sổ Ghi chú chưa có chữ
When bấm "Tạo ghi chú"
Then dòng báo lỗi "Nhập nội dung ghi chú"; không gọi API.

**AC-A06-1 — Tạo task đủ trường**
Given trang Contact Hạnh, tôi gắn với nhân viên Minh Trần
When mở Task, nhập "Gửi báo giá", chọn "Sau 2 ngày làm việc", giờ 14:00, ưu tiên Cao, bấm "Tạo"
Then task hạn 02/10/2026 14:00, người thực hiện Minh Trần, nằm ở nhóm Sắp tới.

**AC-A06-2 — Ẩn Hàng đợi khi danh mục rỗng**
Given danh mục Hàng đợi chưa có giá trị
When mở cửa sổ Task
Then không có ô Hàng đợi.

**AC-A07-1 — Nhắc nhở hiện trên thẻ và gửi đúng giờ**
Given task hạn 05/10/2026 08:00, "Gửi nhắc nhở: 1 giờ trước", người thực hiện Lan Lê có tài khoản
When đến 07:00 ngày 05/10
Then Lan nhận thông báo chuông "Nhắc việc: …"; thẻ task có biểu tượng chuông.

**AC-A07-2 — Lặp lại**
Given task "Gọi chăm sóc" lặp hằng tuần, hạn 01/10/2026 08:00
When Lan tick hoàn thành ngày 01/10
Then toast "Đã hoàn thành task. Đã tạo task kỳ tiếp hạn 08/10/2026."; task mới hiện ở nhóm Sắp tới.

**AC-A08-1 — Ghi lại cuộc gọi**
Given trang Deal DEAL-013 có hai contact, Hạnh được gắn vào deal trước Bảo
When mở "Ghi lại cuộc gọi"
Then ô Đã liên hệ có Hạnh được chọn sẵn; chọn thêm Bảo, kết quả "Đã kết nối", hướng "Gọi đi", lưu; thẻ cuộc gọi ghi "Đã liên hệ: Nguyễn Thị Hạnh, Trần Văn Bảo" và cuộc gọi hiện trên timeline của cả Hạnh và Bảo.

**AC-A09-1 — Ghi lại cuộc họp**
Given trang Company Thiên Phúc có 3 contact
When mở "Ghi lại cuộc họp"
Then ô Người tham dự chưa chọn ai, danh sách có đủ 3 contact để chọn; thời lượng mặc định 15 phút; không có ô tiêu đề; lưu xong thẻ có tiêu đề "Cuộc họp".

**AC-A10-1 — Lên lịch cuộc họp**
Given hôm nay 30/09/2026
When bấm nút "Họp" trên thẻ định danh
Then cửa sổ "Lên lịch cuộc họp" có ô Tiêu đề bắt buộc, kết quả "Đã lên lịch", bắt đầu 01/10/2026 10:00, thời lượng 30 phút; lưu xong cuộc họp nằm ở nhóm Sắp tới.

**AC-A11-1 — Nút theo tab**
Given timeline đang ở tab Tất cả
When lần lượt bấm tab Ghi chú, Cuộc gọi, Task, Cuộc họp
Then thanh công cụ lần lượt có "Tạo ghi chú"; "Ghi lại cuộc gọi" và "Gọi điện" (vô hiệu); "Tạo task"; "Ghi lại cuộc họp" và "Lên lịch cuộc họp"; hàng bộ lọc không hiện ở bốn tab này.

**AC-A11-2 — Link mở thẳng tab**
Given link `…/records/rec_r013?tab=activities&atab=MEETING`
When mở link
Then trang chi tiết DEAL-013 mở ở tab Hoạt động, tab con Cuộc họp.

**AC-A12-1 — Lọc theo nhóm Cập nhật**
Given timeline Deal có cuộc gọi, ghi chú và sự kiện đổi giai đoạn
When mở "Hoạt động (9/9)", bỏ tick "Chọn tất cả", tick "Hoạt động Deal"
Then chip ghi "Hoạt động (1/9)" và có nút ✕; timeline chỉ còn sự kiện đổi giai đoạn.

**AC-A12-2 — Xoá tất cả**
Given đang lọc loại 1/9, "30 ngày qua", Người thực hiện (1)
When bấm "Xoá tất cả"
Then ba chip về mặc định; chữ trong ô tìm giữ nguyên.

**AC-A12-3 — Thu gọn tất cả**
Given timeline có 12 thẻ đang mở
When chọn "Thu gọn tất cả"
Then mọi thẻ chỉ còn phần đầu; bấm một thẻ thì chỉ thẻ đó mở; menu đổi thành "Mở rộng tất cả".

**AC-A13-1 — Ghim**
Given ghi chú N1 đang ghim trên DEAL-013
When chọn "Thao tác ▾ → Ghim lên đầu" ở ghi chú N2
Then N2 đứng đầu timeline với dải "Đã ghim"; N1 về vị trí theo thời gian.

**AC-A13-2 — Xem liên kết**
Given cuộc gọi gắn Hạnh, Thiên Phúc, DEAL-013; đang ở trang Hạnh
When bấm "2 liên kết ▾"
Then hiện "Dược phẩm Thiên Phúc · DEAL-013" dạng link.

**AC-A13-3 — Xoá có xác nhận**
Given như trên
When chọn "Xoá"
Then hộp xác nhận ghi "Hoạt động này sẽ bị xoá khỏi mọi bản ghi liên kết. Có thể khôi phục trong 30 ngày."; xác nhận thì thẻ biến mất và toast "Đã xoá hoạt động".

**AC-A13-4 — Sửa hoạt động**
Given ghi chú do tôi tạo
When chọn "Sửa", đổi nội dung, bấm "Lưu"
Then cửa sổ tên "Sửa ghi chú", không có dòng task theo dõi; lưu xong thẻ hiện nội dung mới, toast "Đã lưu thay đổi".

**AC-A14-1 — Tick hoàn thành trên thẻ**
Given task quá hạn 25/09 ở nhóm Sắp tới, tôi là người thực hiện
When bấm vòng tròn
Then tiêu đề gạch ngang, nhãn "Quá hạn" mất, task chuyển xuống nhóm tháng 9 năm 2026 theo ngày hoàn thành 30/09.

**AC-A14-2 — Người không được hoàn thành**
Given task giao cho Lan Lê; tôi không phải Lan và không có quyền sửa hoạt động
When rê chuột lên vòng tròn
Then vòng tròn mờ, tooltip "Bạn không phải người thực hiện task này"; bấm không có tác dụng.

**AC-A15-1 — Các chỗ ngoài phạm vi**
Given trang chi tiết bất kỳ
When bấm tab Email, nút "Gọi điện", nút "Email" trên thẻ định danh
Then tab Email hiện "Gửi và ghi email chưa có trong giai đoạn này."; hai nút vô hiệu có tooltip; không có request nào được gửi.

**AC-A16-1 — Bình luận**
Given ghi chú của Minh Trần trên DEAL-013
When tôi bấm "Bình luận (0)", viết "Đã gửi báo giá", bấm "Gửi"
Then bình luận hiện dưới ghi chú với tên tôi và "vừa xong"; chân thẻ đổi thành "Bình luận (1)".

---

## 9. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-CRM05-01 | Unit | Tính "Sau 3 ngày làm việc" khi hôm nay thứ Sáu 02/10/2026 | Thứ Tư 07/10 |
| TC-CRM05-02 | Unit | Tính "Sau 1 tháng" khi hôm nay 31/01/2027 | 28/02/2027 |
| TC-CRM05-03 | Unit | Tính "Sau 2 ngày làm việc" khi hôm nay Chủ nhật 04/10/2026 | Thứ Ba 06/10 |
| TC-CRM05-04 | E2E | Bấm nút chính hai lần liên tiếp | Chỉ một request |
| TC-CRM05-05 | E2E | Lưu lỗi mạng | Cửa sổ còn, nội dung còn, có dòng lỗi |
| TC-CRM05-06 | E2E | Đang soạn, bấm link sang trang khác | Hỏi "Bỏ nội dung đang soạn?" |
| TC-CRM05-07 | E2E | Màn 390 px mở cửa sổ soạn | Toàn màn hình, không có nút phóng to |
| TC-CRM05-08 | E2E | Bỏ tick Hạnh ở danh sách liên kết khi Hạnh đang ở ô Đã liên hệ | Ô Đã liên hệ bỏ Hạnh theo |
| TC-CRM05-09 | E2E | Thêm "Thêm bản ghi…" một deal không có trong gợi ý | Deal được gắn khi lưu |
| TC-CRM05-10 | E2E | Deal chưa có contact, mở Ghi lại cuộc họp | Ô người hiện "Chưa có contact liên kết" và ô tìm |
| TC-CRM05-11 | E2E | Gõ 19.200 ký tự vào ô soạn thảo | Bộ đếm "Còn 800 ký tự" |
| TC-CRM05-12 | E2E | Chọn Lên lịch cuộc họp, bắt đầu hôm qua | Chữ nhỏ cảnh báo, vẫn lưu được |
| TC-CRM05-13 | E2E | Tìm "báo giá" ở tab Cuộc gọi | Chỉ cuộc gọi có chữ đó |
| TC-CRM05-14 | E2E | Chọn "Tuỳ chọn" 01/09–15/09 | Nhóm Sắp tới và mục ghim vẫn hiện |
| TC-CRM05-15 | E2E | Timeline 75 mục, bấm "Xem thêm hoạt động" hai lần | Đủ 75 mục, không trùng, tiêu đề tháng không lặp |
| TC-CRM05-16 | E2E | Hoàn thành task khi API lỗi | Task trở lại chưa xong, hiện lỗi |
| TC-CRM05-17 | E2E | Mở lại task lặp đã sinh kỳ tiếp | Toast nhắc task kỳ tiếp đã tạo |
| TC-CRM05-18 | E2E | Lưu cuộc gọi từ trang Contact | Card thuộc tính chính cập nhật Liên hệ gần nhất (khi F03-S2 đã xong) |
| TC-CRM05-19 | E2E | Lên lịch cuộc họp từ danh sách Deals | Ô Hoạt động tiếp theo của deal đổi, không rời danh sách |
| TC-CRM05-20 | E2E | Sự kiện lan từ DEAL-013 trên timeline Contact | Thẻ có dòng "Từ Deal DEAL-013" dạng link, không có "Thao tác ▾" |
| TC-CRM05-21 | Quyền | Người không tạo được hoạt động | Năm nút hoạt động vô hiệu, không có nút theo tab |
| TC-CRM05-22 | Quyền | `can.delete = false` | Menu không có "Xoá" |
| TC-CRM05-23 | A11y | Mở, soạn, lưu ghi chú chỉ bằng bàn phím | Làm được; cửa sổ có `role="dialog"` và tên; Esc đóng |
| TC-CRM05-24 | A11y | Vòng tròn tick | Có nhãn "Đánh dấu hoàn thành" / "Đánh dấu chưa xong" |
| TC-CRM05-25 | E2E | Timeline có 26 việc sắp tới, bấm "Xem thêm việc sắp tới (6)" | Nhóm Sắp tới có đủ 26 mục, vẫn tăng dần |
| TC-CRM05-26 | E2E | Thẻ Cuộc gọi | Không có "Bình luận" |

---

## 10. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Hoạt động lưu `localStorage` | `crm_activities` và bảng nối (CRM-00, F03-S6) |
| `autoRefs` chọn liên kết ở FE | Gợi ý từ máy chủ (F03-S6 §4.1) |
| Nút chèn liên kết, đính kèm chỉ hiện toast | Không có hai nút này (§3.2) |
| "Lặp lại" là ô tick, không làm gì | Ô chọn chu kỳ; máy chủ sinh kỳ tiếp (§4.2, F03-S6 §7.2) |
| "Gửi nhắc nhở" chỉ lưu giá trị | Job nhắc gửi thông báo chuông (F03-S6 §7.1) |
| Ghim theo trình duyệt | Ghim theo bản ghi, dùng chung (F03-S6 §3.6) |
| Người thực hiện là danh sách tên cố định | NhanVien đang làm việc (CRM-00 §5.6) |
| Mọi người tick hoàn thành được mọi task | Theo `can.complete` (§5.6) |
| Xoá ghi "Không thể hoàn tác" | Xoá mềm, khôi phục 30 ngày (§5.5) |
| Lọc, tìm, nhóm trên mảng đã tải | API timeline có phân trang (F03-S6 §5) |
| Menu "Thu gọn tất cả" có mục "Mới nhất trước" không làm gì | Bỏ mục đó; thứ tự luôn mới nhất trước |
| Không có bình luận | Có (§5.7) |

---

## 11. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | Mốc "ngày làm việc" có cần trừ ngày nghỉ lễ không? (F03-S6 Q2) | Khách | §3.4 |
| Q2 | Nút "Email" và nút "Gọi điện" vô hiệu có làm khách hiểu nhầm không, hay nên ẩn? (cùng câu CRM-01 Q5) | Khách | §5.2, §5.8 |
| Q3 | Có cần đính kèm tệp vào ghi chú không? (F03-S6 Q3) | Khách | §3.2 |
| Q4 | Sheet ghi A-05, A-06, A-08, A-09 là "Chỉ FE" nhưng cần BE. Đồng ý sửa cột Phạm vi? | PO | §1 |

---

## Liên kết

- Plan: `00-PLAN-viet-spec.md`
- Spec nền: `ERPMini/features/features/F03-S6-activities-timeline.md`, `F03-S3-nhat-ky-thay-doi-su-kien.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` §5.10, §5.11
- Khung: `CRM-01-khung-danh-sach-trang-chi-tiet.md` §5.2, §5.5
- Design system: `../DESIGN-SYSTEM-HUBSPOT.md` §6.8, §6.9c, §6.9d (cửa sổ soạn, thêm ở bản 1.2)
- Đối chiếu: `../DOI-CHIEU-CHUC-NANG.md` §14

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-09-30 | v1.0 — bản đầu | TTS (qua Claude) |

# Hướng dẫn viết lại spec theo mẫu PRD (v2.0)

Mục tiêu: người đọc lần đầu (PO, dev, QA, AI review) đọc một mạch từ trên xuống là hiểu tính năng làm gì, ai làm, hệ thống phản hồi ra sao. Bản cũ đúng về nội dung nhưng khó đọc: nhiều mục lồng nhau, câu dài, trộn nghiệp vụ với kỹ thuật, dày tham chiếu chéo.

## 1. Nguyên tắc số một: KHÔNG đổi nội dung

- Giữ nguyên mọi quyết định, hành vi, con số, ngưỡng, tên trường (key), slug collection, mã lỗi, câu chữ trên giao diện (chữ trong ngoặc kép), mã tính năng (C-01, S-18, QH-02…).
- Không thêm hành vi mới, không bỏ hành vi có trong bản cũ. Chỗ nào bản cũ ghi "câu hỏi còn mở" thì giữ thành câu hỏi.
- Được bỏ: phần lặp lại, lời giải thích dài vì sao, bảng test case (TC), mục "Prototype giả lập gì" (rút còn vài dòng ở Phụ lục E nếu thật sự cần cho dev), lịch sử phiên bản cũ.

## 2. Cấu trúc bắt buộc (đúng thứ tự, đúng tên mục)

```
# {Mã} — {Tên}

# Product Requirement Document

| | | | |
|---|---|---|---|
| **Project Owner** | TTS | **Update at** | 02-10-2026 |
| **Created by** | TTS (qua Claude) | **Project** | CRM theo UX HubSpot — HarnexAI ERP |
| **Version** | 2.0 | **Features** | {mã tính năng sở hữu, vd S-01 → S-19; spec nền ghi "Spec nền — phục vụ …"} |

**CONTENT**

- USER STORIES
- OVERVIEW FLOW
- USE CASE DESCRIPTION
  - UC-1: …
  - UC-2: …
- BUSINESS RULE
- ACCEPTANCE CRITERIA
- PHỤ LỤC

**VERSION HISTORY**

| **Ver** | **Author** | **Description** | **Updated at** |
|---|---|---|---|
| 2.0 | TTS (qua Claude) | Viết lại theo mẫu PRD: user story, use case, business rule, acceptance criteria. Nội dung giữ như bản 1.x | 02-10-2026 |

---

# USER STORIES
# OVERVIEW FLOW
# USE CASE DESCRIPTION
## UC-1: …
# BUSINESS RULE
# ACCEPTANCE CRITERIA
# PHỤ LỤC
```

### USER STORIES

- Mỗi dòng: `US-{MÃ}-01: Là {vai trò}, tôi muốn {việc} để {mục đích}.` MÃ ngắn theo spec (SALES, RPT, CONTACT, DEAL, ACT, LI, …).
- Vai trò thật: sale, quản lý kinh doanh, quản trị, BA; với spec nền có thể là "lập trình viên màn CRM" hoặc "hệ thống".
- 3–10 story, mỗi story một câu. Ghi mã tính năng liên quan trong ngoặc ở cuối: `(S-07, S-08)`.

### OVERVIEW FLOW

- Một bảng `| **Bước** | **Tác nhân** | **Mô tả** |`, 5–12 bước, kể luồng chính từ đầu tới cuối của cả spec.
- Tác nhân: Người dùng / Sale / Quản lý / Hệ thống / Máy chủ / FE.
- Mỗi ô mô tả một câu ngắn.

### USE CASE DESCRIPTION

- Mỗi use case một mục `## UC-n: {Tên} ({mã tính năng})` và một bảng 2 cột, đúng 6 dòng:

```
| | |
|---|---|
| **Actor** | … |
| **Trigger** | … |
| **Pre-condition** | … |
| **Main Flow** | 1. …<br>2. …<br>3. … |
| **Post-condition** | … |
| **Exception Flow** | 2a. … → …<br>4a. … → … |
```

- Main Flow: các bước đánh số, mỗi bước một câu "Ai làm gì". Bước con viết "5.1", "5.2". Xuống dòng trong ô bằng `<br>`.
- Exception Flow: đánh theo số bước chính (`3a.`), dạng "tình huống → hệ thống làm gì / hiện chữ gì".
- Gom tính năng nhỏ liên quan vào một UC (ví dụ header + tab + tìm kiếm của một danh sách là một UC). Mỗi spec khoảng 3–10 UC. Mọi mã tính năng của spec phải xuất hiện ở ít nhất một UC.
- Câu chữ giao diện giữ nguyên trong ngoặc kép.
- Không nhét bảng lớn vào ô. Chi tiết dạng bảng (danh sách cột, danh sách trường, công thức) để ở Phụ lục và UC chỉ ghi "theo Phụ lục A".

### BUSINESS RULE

- Một bảng `| **BR** | **Mô tả** |`. Mỗi BR có tiêu đề đậm rồi các gạch đầu dòng (dùng `<br>- ` trong ô).
- Đưa vào đây: điều kiện, ràng buộc, công thức, ngưỡng, quyền, quy tắc hiển thị, quy tắc khi xoá, giới hạn.
- 4–15 BR. Mỗi BR một chủ đề.

### ACCEPTANCE CRITERIA

- Dạng mẫu: `AC-1: {Tiêu đề} ({mã tính năng})` rồi 2–5 gạch đầu dòng ngắn, kiểm được. Không dùng Given/When/Then.
- Giữ các ví dụ số cụ thể của bản cũ (ví dụ "thắng 610 tr, chỉ tiêu 500 tr → 122%").
- Phủ đủ các AC của bản cũ (được gộp), kể cả AC về lỗi, quyền, màn hẹp.

### PHỤ LỤC (chỉ mục nào có nội dung mới viết)

- **A. Màn hình và dữ liệu hiển thị**: bảng cột, bảng trường, công thức chỉ số, câu chữ trạng thái rỗng / lỗi.
- **B. Dữ liệu**: collection, trường (key, kiểu, ghi chú), cấu hình metadata. Với spec nền: bảng hệ thống (giữ khối `prisma` nếu bản cũ có).
- **C. API**: mỗi API một dòng mô tả + ví dụ request/response rút gọn (giữ khối code của bản cũ nếu dev cần), bảng mã lỗi.
- **D. Lệch so với sheet / prototype**: những chỗ spec khác sheet hoặc prototype, cần PO xác nhận.
- **E. Câu hỏi còn mở**: bảng `| # | Câu hỏi | Hỏi ai |`.
- **F. Tài liệu liên quan**: danh sách file.

## 3. Cách viết

- Câu ngắn, chủ ngữ rõ: "Sale bấm…", "Hệ thống hiện…", "Máy chủ ghi…". Một câu một ý.
- Từ thường dùng, tiếng Việt. Thuật ngữ sản phẩm giữ nguyên như trên giao diện (Contact owner, Lifecycle stage, Closed Won).
- Không viết kiểu AI: không "đảm bảo rằng", "nhằm mục đích", "một cách liền mạch", "toàn diện", "mạnh mẽ"; không mở đầu bằng lời dẫn; không dùng gạch ngang dài để nối ý; không in đậm tràn lan.
- Không dùng ký hiệu § và số mục của bản cũ. Tham chiếu sang spec khác bằng **mã file + tên chủ đề**, ví dụ "xem CRM-01, phần bộ lọc nhanh", "theo F03-S1, API thống kê liên kết". Không ghi số UC/BR của file khác (các file đang được viết song song, số sẽ không khớp).
- Trong cùng file thì được dẫn "BR-03", "UC-2", "Phụ lục A".
- Ngày: `dd-mm-yyyy` ở phần đầu; ví dụ trong nội dung giữ như bản cũ.
- Không thêm emoji.

## 4. Kiểm trước khi nộp

- Đủ 5 mục chính đúng tên, đúng thứ tự, có bảng thông tin đầu file, CONTENT, VERSION HISTORY.
- Mọi mã tính năng của bản cũ có mặt.
- Không còn "§", không còn "Given", "When", "Then", không còn mã TC.
- Mọi câu hỏi mở của bản cũ có ở Phụ lục E.
- Đọc lại phần USER STORIES tới ACCEPTANCE CRITERIA: người chưa biết dự án có hiểu không.

# XBuild ERP — Design System · Lớp theme HubSpot (`data-brand="crm"`)

> **Phạm vi:** đồng bộ giao diện **toàn bộ web ERP hiện tại** (erp.tuoitresoft.com, mã nguồn `systemdesign/`) với prototype hướng HubSpot (repo `erp-customize-hubspots`).
> **Quan hệ với file gốc:** đây là **lớp theme** nằm trên `systemdesign/systemdesign/DESIGN-SYSTEM.md` (v3.3). File gốc vẫn là nguồn-sự-thật cho kiến trúc (component-first §1bis, token 3 tầng §2, breakpoint §7.2, z-index §7.5, trợ năng §12bis, quy ước code §13). File này **chỉ ghi đè giá trị và bổ sung mẫu** — mục nào không nhắc ở đây thì giữ nguyên như file gốc.
> **Phiên bản 1.4** · 06/10/2026 · Trạng thái: 🟡 Đề xuất — chờ team FE duyệt
> **Xem trực quan:** `design-system.html` trong repo prototype (mở cùng các màn `crm-*.html` để so).
> **Nguyên tắc dự án không đổi:** *chức năng = 100% ERP · giao diện & UX = theo HubSpot.* Theme này không thêm/bớt chức năng nào.

---

## Mục lục

| § | Nội dung |
| --- | --- |
| 0 | Đọc trước — 5 quyết định của theme |
| 1 | Cách bật theme & kiến trúc token |
| 2 | Màu sắc (light / dark / shell / phân loại / biểu đồ) |
| 3 | Typography |
| 4 | Spacing · Radius · Shadow · Motion |
| 5 | Khung ứng dụng (topbar · sidebar · frame) |
| 6 | Component — đặc tả theo theme |
| 7 | Mẫu trang (template) — danh sách · chi tiết bản ghi · dashboard · cấu hình |
| 8 | Ánh xạ màn ERP hiện tại → template |
| 9 | Kế hoạch migrate & tiêu chí Done |
| 10 | Dark mode |
| 11 | Trợ năng — điểm cần sửa khi đổi màu |
| 12 | Bảng lệch so với DESIGN-SYSTEM.md (để cập nhật file gốc) |
| 13 | Nhật ký phiên bản |

---

## 0. Đọc trước — 5 quyết định của theme

1. **Khung tối ôm nội dung sáng.** Topbar + sidebar nền `#333333`, nội dung là một "frame" trắng bo 16px cách viền 8px. Đây là dấu hiệu nhận diện HubSpot mạnh nhất — làm cái này trước, cả app đổi cảm giác ngay.
2. **Một màu nhấn duy nhất: xanh teal đậm `#00494B`** (nút chính, tab đang chọn, focus). Link dùng `#006162`. Xanh `#1A73E8` cũ không còn xuất hiện trong theme CRM.
3. **Nút bo tròn hẳn (pill), cao 32px, chữ 13px/600.** Nút nhỏ 28px. Khác file gốc (36px, bo 8px).
4. **Bảng dữ liệu kiểu HubSpot:** header chữ thường 13px/500 nền trắng (bỏ kiểu HOA 11px), dòng 44px, cột tên dính trái có link đậm + nút "Xem trước" khi rê chuột, footer có đếm số bản ghi.
5. **Sửa tại chỗ & popover thay trang mới.** Thuộc tính sửa ngay trong danh sách thuộc tính; chọn lựa chọn qua popover có ô tìm kiếm; xem nhanh bản ghi qua panel phải — không điều hướng khi không cần.

**Không thay đổi:** kiến trúc component-first, 5 mức z-index, thang breakpoint 600 / 905 / 1240, icon Material Symbols Outlined, font Inter + Be Vietnam Pro, định dạng ngày/số/tiền §13.5.

---

## 1. Cách bật theme & kiến trúc token

### 1.1 Bật theme

```html
<html lang="vi" data-brand="crm" data-theme="light">   <!-- data-theme: light | dark (ThemeContext giữ nguyên) -->
```

- `data-brand="crm"` đặt ở `src/app/layout.tsx`. Để trống thuộc tính = giao diện HarnexAI gốc (giữ để so sánh / rollback).
- Toàn bộ theme nằm trong **một khối** ở `src/styles/globals.css`, ngay sau khối `[data-theme="dark"]`:

```css
/* ═══ Theme HubSpot — DESIGN-SYSTEM-HUBSPOT.md ═══ */
[data-brand="crm"]                      { /* §2.1 light  */ }
[data-brand="crm"][data-theme="dark"]   { /* §10 dark    */ }
```

- Tailwind v4 đọc lại `--color-*` / `--radius-*` ⇒ mọi utility `bg-primary`, `rounded-btn`… trong `src/components/ui/**` tự đổi. **JSX của màn hình không cần sửa để đổi màu.**
- ✅ Đặt ở `<html>` là phạm vi gốc nên **không vi phạm** cảnh báo §6.2 file gốc (cấm ghi đè `--radius-*` trong scope con).

### 1.2 Token mới phải thêm vào `@theme` (tầng 1)

Ba khối luôn đi cùng nhau (mẫu §2 file gốc). Giá trị mặc định = giao diện gốc, theme CRM ghi đè.

| Token tầng 1 (`@theme`) | Alias tầng 2 (`:root`) | Mặc định gốc | Theme CRM | Utility sinh ra | Dùng cho |
| --- | --- | --- | --- | --- | --- |
| `--color-link` | `--link` | `#1A73E8` | `#006162` | `text-link` | Link, tên bản ghi, tiêu đề báo cáo |
| `--color-page-bg` | `--page-bg` | `#F1F3F4` | `#F0F0F0` | `bg-page-bg` | Nền sau các card (record page, dashboard) |
| `--color-canvas` | `--canvas` | `#FFFFFF` | `#333333` | `bg-canvas` | Nền `<body>` quanh frame |
| `--color-shell-bg` | `--shell-bg` | `= surface` | `#333333` | `bg-shell-bg` | Topbar, sidebar |
| `--color-shell-fg` | `--shell-fg` | `= on-surface` | `#F5F5F5` | `text-shell-fg` | Chữ / icon trên shell |
| `--color-shell-muted` | `--shell-muted` | `= on-surface-variant` | `#B3B3B3` | `text-shell-muted` | Placeholder ô tìm kiếm, phím tắt |
| `--color-shell-hover` | `--shell-hover` | `= surface-2` | `#444444` | `bg-shell-hover` | Hover mục nav / nút topbar |
| `--color-shell-active` | `--shell-active` | `= primary-container` | `#4D4D4D` | `bg-shell-active` | Mục nav đang chọn |
| `--color-shell-active-fg` | `--shell-active-fg` | `= on-primary-container` | `#FFFFFF` | `text-shell-active-fg` | Chữ mục nav đang chọn |
| `--color-shell-line` | `--shell-line` | `= outline-variant` | `#474747` | `border-shell-line` | Viền dưới topbar, vạch ngăn nav |
| `--color-shell-search` | `--shell-search` | `= surface-variant` | `#262626` | `bg-shell-search` | Ô tìm kiếm topbar |
| `--color-board-col` | `--board-col` | `= surface-2` | `#F0F0F0` | `bg-board-col` | Nền cột Kanban |
| `--color-outline-input` | `--outline-input` | `#DADCE0` | `#8F8F8F` | `border-outline-input` | Viền input (đủ 3:1, xem §11) |
| `--color-cat-1` … `--color-cat-7` + `--color-cat-5-fg` | `--cat-1`… | — | xem §2.4 | `bg-cat-1` | Pill lựa chọn (SELECT) — ngoại lệ phân loại |
| `--radius-btn` | `--btn-radius` | `8px` (= md) | `999px` | `rounded-btn` | Nút, ô tìm kiếm, segmented |
| `--radius-frame` | `--frame-radius` | `0` | `16px` | `rounded-frame` | Frame nội dung |
| `--spacing-frame` | `--frame-gap` | `0` | `8px` | `p-frame` | Khoảng hở frame ↔ shell |

> Sau khi thêm, cập nhật §2/§3/§6 file gốc (xem §12).

---

## 2. Màu sắc

### 2.1 Bảng ghi đè — light

| Token | Gốc (M3) | **Theme CRM** | Ghi chú |
| --- | --- | --- | --- |
| `--primary` | `#1A73E8` | **`#00494B`** | Nút chính, tab chọn, focus ring, brand mark. Tương phản với trắng 10.2:1 |
| `--on-primary` | `#FFFFFF` | `#FFFFFF` | |
| `--primary-container` | `#E8F0FE` | **`#E0F0EF`** | Nền nhạt: bộ lọc đang bật, dòng đã chọn, segmented chọn, thanh hàng loạt |
| `--on-primary-container` | `#1F4E9E` | **`#00494B`** | 8.7:1 trên container |
| `--link` | `#1A73E8` | **`#006162`** | 7.3:1 trên trắng |
| `--on-surface` | `#202124` | **`#333333`** | Chữ chính (HubSpot dùng xám than, không đen) |
| `--on-surface-variant` | `#5F6368` | **`#666666`** | Chữ phụ. 5.7:1 trên trắng, 5.0:1 trên `#F0F0F0` |
| `--outline` | `#DADCE0` | **`#CCCCCC`** | Viền nút phụ, viền ô tìm kiếm (không phải input — xem §11) |
| `--outline-variant` | `#E8EAED` | **`#E3E3E3`** | Viền card, đường kẻ bảng |
| `--surface` · `--surface-variant` · `--surface-2` | | *giữ nguyên* | `#FFF` · `#F8F9FA` · `#F1F3F4` |
| `--success` · `--warning` · `--error` (+ container) | | *giữ nguyên*, **sửa tương phản ở §11** | |

### 2.2 Màu shell (topbar + sidebar)

| Token | Light | Dark | Tương phản |
| --- | --- | --- | --- |
| `--shell-bg` | `#333333` | `#171717` | — |
| `--shell-fg` | `#F5F5F5` | *(giữ)* | 11.6:1 |
| `--shell-muted` | `#B3B3B3` | *(giữ)* | 6.0:1 |
| `--shell-hover` | `#444444` | `#2A2A2A` | |
| `--shell-active` | `#4D4D4D` | `#303030` | |
| `--shell-active-fg` | `#FFFFFF` | *(giữ)* | |
| `--shell-line` | `#474747` | `#2E2E2E` | |
| `--shell-search` | `#262626` | `#0F0F0F` | |
| `--canvas` | `#333333` | `#171717` | nền quanh frame = cùng màu shell |

**Quy tắc:** chữ/icon trên shell **chỉ** dùng `--shell-*`. Không dùng `--on-surface` trên topbar — sẽ ra chữ tối trên nền tối.

### 2.3 Trạng thái → màu (dùng thống nhất)

Giữ bảng ánh xạ §8.3 file gốc cho Badge. Bổ sung cho miền CRM:

| Miền | Giá trị | Hiển thị |
| --- | --- | --- |
| Giai đoạn Deal (pipeline) | các giai đoạn mở | Pill màu phân loại theo thứ tự lựa chọn (§2.4) |
| | `Closed Won` | `Badge tone="success"` trên thẻ board, chip xanh trong bảng |
| | `Closed Lost` | `Badge tone="error"` |
| Lifecycle stage / Lead status | mọi giá trị | Pill phân loại (§2.4) — **không** dùng tone trạng thái |
| Task quá hạn | `OVERDUE` | chữ `--error` 600 + nhãn "Quá hạn" (không chỉ đổi màu) |
| Sale tạm nghỉ / đã nghỉ | | cả dòng `opacity:.55` + Badge neutral |

### 2.4 Bảng màu phân loại — pill lựa chọn (ngoại lệ mới, bổ sung §3.3 file gốc)

HubSpot tô mỗi lựa chọn của trường SELECT/STATUS bằng một màu đặc, chữ trắng đậm. Màu gán **theo thứ tự lựa chọn** trong định nghĩa trường (lựa chọn thứ 8 quay về màu 1). Người dùng không tự chọn màu (giữ chức năng ERP).

| Token | Light | Chữ | Tương phản |
| --- | --- | --- | --- |
| `--cat-1` | `#2D5BD7` | trắng | 5.9:1 |
| `--cat-2` | `#C2410C` | trắng | 5.2:1 |
| `--cat-3` | `#BE2A78` | trắng | 5.5:1 |
| `--cat-4` | `#7447DB` | trắng | 5.7:1 |
| `--cat-5` | `#E3B341` | **`--cat-5-fg` `#3A2A05`** | 7.1:1 |
| `--cat-6` | `#2E7D32` | trắng | 5.1:1 |
| `--cat-7` | `#A61B1B` | trắng | 7.5:1 |

Dark mode: giữ nguyên 7 màu (đều đủ tương phản với chữ trắng, nền pill tự tách khỏi nền tối). **Không dùng các màu này cho bất cứ thứ gì khác** ngoài pill lựa chọn và avatar.

### 2.5 Bảng màu biểu đồ (dashboard / báo cáo)

Dùng riêng trong khối `.viz` của trang báo cáo (không trộn với màu phân loại):

| Token | Light | Dark | Dùng |
| --- | --- | --- | --- |
| `--viz-1` | `#2A78D6` | `#3987E5` | Chuỗi 1 · "Đang mở" |
| `--viz-2` | `#EB6834` | `#D95926` | Chuỗi 2 · "Thua" |
| `--viz-3` | `#1BAF7A` | `#199E70` | Chuỗi 3 · "Thắng" |
| `--viz-4` | `#EDA100` | `#C98500` | |
| `--viz-5` | `#E87BA4` | `#D55181` | |
| `--viz-6` | `#008300` | `#008300` | |
| `--viz-grid` / `--viz-axis` | `#E6E6E3` / `#8A8984` | `#3A3A38` / `#8F8E88` | Lưới, trục |

Quy tắc biểu đồ của file gốc (`bao-cao.html`: thang một hue, khoá kiểu biểu đồ sai ngữ nghĩa) vẫn áp dụng.

---

## 3. Typography

Font, `tabular-nums`, weight 400/500/600/700 giữ như §4 file gốc. Thang chữ **ghi đè** như sau:

| Vai trò | Gốc | **Theme CRM** | Ghi chú |
| --- | --- | --- | --- |
| Tiêu đề trang danh sách (h1) | 22/700 | **24/600** | Kèm `⌄` đổi đối tượng + đếm "18 bản ghi" 13px phụ |
| Tên bản ghi (h1 record page) | 22/700 | **20/700** | Trong card định danh, cho phép xuống dòng |
| Tiêu đề trang cấu hình / dashboard | 22/700 | **22/600** | |
| Tiêu đề panel / drawer | 18/600 | **18/700** | |
| Tiêu đề modal | 18/600 | **17/700** | |
| Tiêu đề card | 15–16/600 | **14–15/600** | Card báo cáo: 15/600 màu `--link` |
| Header bảng | 11/600 HOA | **13/500 chữ thường**, `--on-surface-variant` | Thay đổi lớn nhất về chữ |
| Ô bảng | 14/400 | **13.5/400** | Cột tên: 600 màu `--link` |
| Nội dung | 14/400 | 14/400 | *giữ* |
| Nhãn thuộc tính (property label) | 13 | **12/400** `--on-surface-variant` | Giá trị bên dưới 14/500 |
| Nhãn form | 13/500 | **13/600** | |
| Nút | 14/500 | **13/600** (sm: 12/600) | |
| Tab | 14/500 | **14/600** (tab trang) · **13/600** (view tab) | |
| Bộ lọc nhanh | — | **12.5/600** | |
| Nhãn nhóm HOA (menu, palette) | 11/600 | **11/700** `letter-spacing:.04em` | |
| Số KPI lớn | 28/700 | **40/700** màu `--link` (card báo cáo) · **20/700** (thẻ KPI nhỏ) | |

**12.5px và 13.5px** là hai giá trị mới của thang vi mô — chỉ dùng đúng ba chỗ: bộ lọc nhanh, ô bảng, ghi chú dòng phụ trong card liên kết.

---

## 4. Spacing · Radius · Shadow · Motion

Thang 4px và thang vi mô giữ nguyên (§6.1 file gốc). Thay đổi:

| Hạng mục | Gốc | **Theme CRM** |
| --- | --- | --- |
| Padding trang danh sách | 24px 32px | **16px** mọi phía (header, toolbar), bảng tràn sát mép frame |
| Padding trang record / dashboard | 24px 32px | **12px** lưới card trên nền `--page-bg` |
| Khoảng giữa card | 16px | **12px** |
| Padding card | 16–20px | **14px** ngang · header card `12px 14px` |
| Bo nút / ô tìm kiếm / segmented | 8px | **999px** (`--radius-btn`) |
| Bo input form, select, textarea | 8px | 8px *giữ* |
| Bo ô đang sửa tại chỗ, pill lựa chọn | 4px | 4px *giữ* |
| Bo card, panel dock, cột board, thẻ board, modal | 12px | 12px *giữ* |
| Bo frame nội dung | — | **16px** |
| Shadow | 3 mức | *giữ* — card **không** có bóng; thẻ board chỉ có bóng khi hover (`--shadow-2`) |
| Motion | | *giữ* — panel phải trượt 300ms `--ease-enter` |

---

## 5. Khung ứng dụng

```
┌─────────────────────────────────────────────────────────────────┐ ← topbar 56px, --shell-bg
│ ☰  [H] HarnexAI   [🔍 Tìm kiếm hoặc gõ lệnh…  Ctrl+K]   (+Tạo) 🔔 (PN) │
├──────────┬──────────────────────────────────────────────────────┤
│ sidebar  │ ┌──────────────────────────────────────────────────┐ │ ← 8px --frame-gap
│ --shell  │ │  FRAME  nền --surface, bo 16px, overflow hidden  │ │
│  236px   │ │  (trang danh sách / record / dashboard)          │ │
│          │ └──────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────┘
          nền quanh frame = --canvas (#333)
```

### 5.1 Topbar — `features/shell/AppHeader.tsx`

| Phần tử | Đặc tả |
| --- | --- |
| Khung | cao 56px, padding `0 12px`, gap 8px, nền `--shell-bg`, viền dưới 1px `--shell-line` |
| Brand | ô 28×28 bo 8px nền `--primary` chữ `--on-primary` 13/700 + "HarnexAI" 15/700 |
| Ô tìm kiếm (mở Command Palette) | ẩn <600px · cao 34px · `max-width:440px` · flex 1 · nền `--shell-search` · viền `--shell-line` · bo `--radius-btn` · chữ 13px `--shell-muted` · phím tắt `Ctrl+K` trong khung 11px |
| Nút "+ Tạo" | cao 32px · viền `--shell-line` · 13/600 · mở cùng palette |
| Icon button (thông báo…) | 34×34 bo `--radius-btn`, hover `--shell-hover`; badge đếm 16px nền `--error` chữ trắng 10/700 |
| Avatar | 30px tròn |

### 5.2 Sidebar — `features/shell/UnifiedSidebar.tsx` · `NavRail.tsx` · `SidebarDrawer.tsx`

| Phần tử | Đặc tả |
| --- | --- |
| Khung | nền `--shell-bg`, padding `12px 8px`, gap 2px |
| Mục nav | cao 34px · padding `0 10px` · gap 10px · bo 8px · chữ 14px `--shell-fg` · icon 20px |
| Hover / đang chọn | `--shell-hover` / `--shell-active` + chữ `--shell-active-fg` 600 + `aria-current="page"` |
| Vạch nhóm | 1px `--shell-line`, margin `6px 10px` |
| Thứ tự nhóm | Cowork · Trang chủ · Việc của tôi ─ **Contacts · Companies · Deals · Sales · Sơ đồ quan hệ** ─ Dữ liệu · Workflow · Biểu mẫu · Media · Báo cáo ─ (đẩy xuống đáy) Cài đặt |
| Responsive | ≥1240: 236px có nhãn · 905–1239: rail 72px chỉ icon (tooltip = nhãn) · <905: drawer trượt trái `min(276px,84vw)` + scrim 45% |

Collection "Ghim vào sidebar" (chức năng ERP có sẵn) hiện như mục nav thường ở nhóm CRM.

### 5.3 Frame — `app/(app)/app-shell.tsx`

```css
.main  { padding: var(--frame-gap); min-width:0; min-height:0 }
.frame { height:100%; display:flex; flex-direction:column; min-height:0;
         background:var(--surface); border-radius:var(--frame-radius); overflow:hidden }
```

- Mọi trang con **render bên trong frame**. Trang tự cuộn thì đặt `overflow:auto` trên phần thân của trang, không trên `<body>` (quy tắc khung cuộn §7.4 file gốc).
- ⚠️ Bẫy đã gặp: frame là flex column ⇒ khối có `overflow-x:auto` bên trong (canvas sơ đồ, bảng) **co về 0 chiều cao**. Trang cuộn dọc cả khối thì đặt `.frame > * { flex: none }`.
- Trang toàn màn (workflow editor) tính chiều cao `calc(100dvh - 56px - 2 * var(--frame-gap))`.

---

## 6. Component — đặc tả theo theme

> Mỗi mục: **đặc tả** → **file ERP** → **việc phải làm**. Tên class trong ngoặc là class của prototype để dev đối chiếu trực quan.

### 6.1 Button — `components/ui/Button.tsx` (`.btn`)

| | `md` | `sm` | `iconOnly md` | `iconOnly sm` |
| --- | --- | --- | --- | --- |
| Cao | **32px** | **28px** | 32×32 | 28×28 (26×26 trong hàng bảng/timeline) |
| Padding | `0 14px` | `0 10px` | 0 | 0 |
| Chữ | 13/600 | 12/600 | — | — |
| Bo | `--radius-btn` (pill) | | | |
| Gap icon ↔ chữ | 6px | | | |

| Variant | Nền | Chữ | Viền | Hover |
| --- | --- | --- | --- | --- |
| `primary` | `--primary` | `--on-primary` | — | `opacity:.9` |
| `secondary` | `--surface` | `--on-surface` | 1px `--outline` | nền `--surface-2` |
| `ghost` (= "text" của HubSpot) | trong suốt | `--on-surface` | — | nền `--surface-2` · cao 30px, padding `0 8px` |
| `danger` | **`--error`** | trắng | — | `opacity:.9` — chỉ dùng trong ConfirmDialog/nút xoá cuối cùng |

- **Nút tách (split) "Thêm deals ▾"**: `secondary` + icon `arrow_drop_down` bên phải, mở `Menu`. Không làm 2 nút dính nhau.
- **Link-button** trong card ("Xem tất cả", "Thêm nhãn liên kết"): chữ 13/600 `--link`, không nền, gạch chân khi hover — dùng `<Link>` (§8.28 file gốc), không phải Button.
- Việc phải làm: `SIZE.md` đổi `h-9 px-4 text-sm` → `h-8 px-3.5 text-[13px] font-semibold`; `SIZE.sm` → `h-7 px-2.5 text-xs font-semibold`; bo `rounded-md` → `rounded-btn`; `danger` đổi sang nền đặc. Hai thay đổi đầu **đổi chiều cao mọi nút** — chạy lại test `Button.test.tsx`.

### 6.2 Tiêu đề trang danh sách — `ObjectHeader` (mới, thay `PageHeader` cho trang danh sách)

```
Contacts ⌄  18 bản ghi                               [⋮] [Thêm contacts ▾]
```

| Phần tử | Đặc tả |
| --- | --- |
| Khung | `padding:16px 16px 0`, flex, wrap |
| Tiêu đề | 24/600, là **nút** mở menu đổi đối tượng (Contacts / Companies / Deals / collection khác), hover nền `--surface-2` bo 8px |
| Đếm | 13px `--on-surface-variant` |
| Hành động | canh phải: `⋮` (ghost iconOnly) · nút chính (primary hoặc split) |

Props đề xuất: `title`, `count`, `objectMenu?: {label,href}[]`, `actions`. Trang cấu hình / dashboard vẫn dùng `PageHeader` gốc.

### 6.3 View tabs — `components/ui/Tabs.tsx` variant `view` (`.vtab`)

- Hàng tab có viền dưới 1px `--outline-variant`, `padding:8px 16px 0`, cuộn ngang khi tràn.
- Tab: cao 34px, `padding:0 12px`, 13/600 `--on-surface-variant`, bo `6px 6px 0 0`.
- Đang chọn: chữ `--on-surface`, **viền dưới 2px `--on-surface`** (không phải primary) + nền `--surface-2`.
- Cuối hàng: nút `+` (ghost iconOnly sm) thêm view · menu "Tất cả view".
- Map sang **Saved views** của ERP (`SavedViewsMenu.tsx`) — chức năng giữ nguyên, chỉ đổi cách hiển thị từ dropdown sang tab.

**Tab trang** (record page, panel) giữ `Tabs` mặc định nhưng: cao 48px (panel 42px), 14/600, viền dưới **2px `--primary`** khi chọn.

### 6.4 Thanh công cụ danh sách (`.tools`)

```
[🔍 Tìm kiếm      ] [Bộ lọc nâng cao] [Sắp xếp ▾]            [▦ | ☰] [⚙] [⌃]
```

| Phần tử | Đặc tả |
| --- | --- |
| Khung | `padding:12px 16px 0`, gap 8px, wrap |
| Ô tìm kiếm | cao 32px, rộng 220px (≤100%), viền 1px `--outline`, bo `--radius-btn`, icon 18px `--on-surface-variant`, chữ 13px |
| Segmented Bảng/Board | viền 1px `--outline`, bo `--radius-btn`, ô 34×30, ô chọn nền `--surface-2` |
| Segmented có chữ (kỳ: Tháng/Quý/Năm) | ô cao 30px, `padding:0 12px`, 12.5/600; chọn = nền `--primary-container` chữ `--on-primary-container` |
| ⚙ | mở cài đặt bảng (mật độ gọn, cột) |
| ⌃ | thu gọn / mở thanh bộ lọc nhanh |

### 6.5 Bộ lọc nhanh — `QuickFilterBar` (mới; thay `RecordFilterBar.tsx` phần hiển thị) (`.qfbar .qf`)

- Một hàng chữ đậm có `▾`: **Contact owner ▾ · Ngày tạo ▾ · Ngày hoạt động gần nhất ▾ · Lead status ▾** · `⊕` (thêm bộ lọc nhanh) · `|` · **Bộ lọc nâng cao (n)**.
- Mỗi nút: cao 28px, `padding:0 6px`, 12.5/600, bo 4px, hover `--surface-2`. **Đang có giá trị:** nền `--primary-container`, chữ `--on-primary-container`, hiện giá trị ("Owner: Minh Trần, Lan Lê").
- Bấm mở **popover** 280px: ô tìm kiếm + danh sách checkbox (trường lựa chọn/người dùng) hoặc danh sách preset ngày (Hôm nay · Hôm qua · Tuần này · … · Năm nay · Tuỳ chọn từ–đến) + "Xoá" / "Áp dụng".
- "Xoá tất cả" dạng link 12/600 `--link` xuất hiện khi có ≥1 bộ lọc.
- Bộ lọc nâng cao = **panel phải** (§6.10) chứa `WhereConditionBuilder` của ERP (nhóm AND/OR giữ nguyên chức năng).
- Giữ quy tắc file gốc: **trạng thái lọc lưu vào URL query**.

### 6.6 Bảng dữ liệu — `components/ui/DataTable.tsx` + `features/data/RecordTableView.tsx` (`table.lt`)

Ghi đè §8.7 file gốc:

| Hạng mục | Gốc | **Theme CRM** |
| --- | --- | --- |
| Bọc ngoài | viền 1px, bo 8px | **không viền, không bo** — bảng tràn sát mép frame, chỉ có viền trên 1px `--outline-variant` |
| Header | nền `--surface-variant`, 11/600 HOA | nền **`--surface`**, **13/500 chữ thường** `--on-surface-variant`, cao 44px, dính khi cuộn; hover nền `--surface-variant` + chữ `--on-surface` |
| Icon sắp xếp | `swap_vert` mờ | chỉ hiện `arrow_upward/downward` 16px ở cột đang sắp |
| Dòng | ~34px | **44px** mặc định · **34px** khi bật "Gọn" (lưu **theo người dùng** cho từng đối tượng qua F03-S4, không lưu localStorage — sửa ở bản 1.1) |
| Ô | padding `12px 16px`, 14px | padding `0 12px`, **13.5px**, `max-width:300px` + ellipsis (§8.7a file gốc) |
| Hover / chọn | `--surface-variant` | hover `--surface-2` · dòng chọn `--primary-container` |
| Cột checkbox | 44px | 44px **dính trái** (`left:0`) |
| Cột chính (tên) | đóng băng | **dính trái** `left:44px`, `min-width:260px`, **viền phải 1px** `--outline-variant`; nội dung = avatar 24px + tên 600 `--link` + nút mở rộng `›` (xoay 90° khi mở) + nút **"Xem trước"** hiện khi rê chuột (cao 26px, viền, bo pill, 12/600) |
| Cột cuối | — | ô `+` rộng 44px để thêm cột; bấm tiêu đề cột ⇒ menu (sắp xếp, di chuyển, ẩn, sửa trường) |
| Cột số / tiền | phải, tabular | *giữ* |

**Dòng mở rộng (liên kết lồng)**: bấm `›` ⇒ chèn dòng nền `--surface-2`, thụt trái 56px, chứa một bảng con 34px/13px (vd. Deals của Company) trong khung trắng viền bo 8px, có nút "+ Thêm" góc phải.

**Thanh hàng loạt** (khi chọn ≥1): nằm **ngay trên bảng** (dưới toolbar), cao ~40px, nền `--primary-container`, "Đã chọn N" 600 + nút ghost (Gán owner · Sửa · Xoá — xoá đi qua ConfirmDialog).

**Footer bảng** (`.foot`): cao ~48px, viền trên 1px; trái: pill đếm "18 bản ghi" (12/600 nền `--surface-2`); phải: làm mới · Export · khôi phục view · nhân bản view (secondary, iconOnly trừ Export). Phân trang của file gốc (25/50/100) đặt ở giữa footer.

**Ô sửa tại chỗ**: bấm ô ⇒ editor cao 30px viền 1px `--primary` bo 4px; SELECT mở popover chọn có tìm kiếm (§6.12). Enter lưu, Esc huỷ.

### 6.7 Board (Kanban) — `features/data/RecordKanbanView.tsx` (`.kb .kcol .kc`)

| Phần tử | Đặc tả |
| --- | --- |
| Vùng board | cuộn ngang, `padding:12px 16px`, gap 10px |
| Cột | rộng 280px (≤600: 82vw), nền `--board-col`, bo 12px; header: tên 13/600 + số lượng 12/700 `--on-surface-variant` + tổng tiền (Deals); thân cuộn dọc |
| Thẻ | nền `--surface`, viền `--outline-variant`, bo 12px, padding 12px, gap 5px, bóng `0 1px 2px rgba(0,0,0,.04)`; hover: viền `--outline` + `--shadow-2` |
| Nội dung thẻ | tên link 600 · 2–4 dòng meta 12px có icon 15px · footer (viền trên) 3 icon hành động nhanh 26px (ghi chú, task, gọi) |
| Kéo thả | thẻ đang kéo `opacity:.5`; cột nhận: viền 2px đứt `--primary` inset 4px (ngoại lệ viền đứt thứ hai, cùng FileUpload) |
| Deal Won / Lost | Badge success / error trên thẻ |

### 6.8 Pill · Badge · Tag · Chip — bốn thứ, không lẫn

| Tên | Hình | Dùng cho | Component |
| --- | --- | --- | --- |
| **Pill lựa chọn** (`.pill`) | nền đặc `--cat-n`, chữ trắng 12/700, cao 22px, `padding:0 8px`, **bo 4px** | Giá trị trường SELECT / STATUS / MULTI_SELECT (giai đoạn, lifecycle, lead status…) | `FieldValueDisplay.tsx` — **mới**: `<OptionPill index={i}>` |
| **Badge** (`.chip`) | nền `--{tone}-container`, chữ `--{tone}`, 12/600, cao 22px, bo pill, **chấm 6px** trước chữ | Trạng thái hệ thống (task, workflow run, Won/Lost) | `Badge.tsx` — thêm chấm tròn thay icon khi không truyền `icon` |
| **Tag** (`.tag`) | nền `--surface-2`, chữ `--on-surface-variant` 11.5/600, cao 20px, bo pill; `.pk` = nền `--primary-container` | Nhãn phụ: "Primary", "Deals_Pipeline", tên thuộc tính | `Chip.tsx` variant `tag` |
| **Chip lọc** (`.fchip2`) | nền `--surface-2`, 12.5/600, cao 30px, bo 8px | Bộ lọc timeline, loại hoạt động | `Chip.tsx` (active = nền `--primary-container`) |

Người dùng (USER): avatar 20px tròn + tên — `.uchip`. Checkbox: icon `check_box` màu `--primary`.

### 6.9 Record page — `features/data/RecordDetailPage.tsx`

```
≥1240px:  [ 320px trái ] [ giữa minmax(0,1fr) ] [ 320px phải ]
905–1239: [ 320px trái ] [ giữa ]  ·  cột phải xuống dưới, full width
<905:     1 cột: trái → giữa → phải
```

Nền `--page-bg`, lưới gap 12px padding 12px. Mọi khối là **card**: nền `--surface`, viền 1px `--outline-variant`, bo 12px.

| Khối | Đặc tả |
| --- | --- |
| **Card định danh** (trái, trên cùng) | hàng trên: `‹ Contacts` (link quay lại 14/600) + "Thao tác ▾"; avatar 48px (company: vuông bo 8px; deal: icon) + tên 20/700 + nút ✎ đổi tên hiện khi hover; dòng phụ 13px (chức danh tại công ty · email kèm ↗ ⧉); **6 nút nhanh** tròn 36px viền `--outline` + nhãn 11.5px: Ghi chú · Email · Gọi · Task · Họp · Thêm |
| **Card thuộc tính** "Thông tin chính / Về Deal này" | header card: `▾` thu gọn + tiêu đề 600 + "Thao tác ▾" + ⚙; thân: **PropertyList** (§6.9a); cuối: "Xem tất cả thuộc tính" + meta "Ngày tạo" 12px |
| **Card "Trường bổ sung"** | như card thuộc tính; hiện trường mới tạo (nhãn "Mới" 10/700 nền `#E3F2FD` chữ `#0B5CAD`) + trường ghim; "+ Thêm" mở modal tạo trường; ⚙ popover chọn trường |
| **Giữa** | card có tab "Tổng quan · Hoạt động" (48px) + "Tuỳ chỉnh" bên phải; Tổng quan = các mục thu gọn 18/600 chứa card con viền bo 8px padding 14px |
| **Phải** | card liên kết (§6.9b) cho từng đối tượng + card Tệp đính kèm |

#### 6.9a PropertyList — mới: `components/ui/PropertyList.tsx` (`.props .prop`)

- Mỗi thuộc tính: nhãn 12px `--on-surface-variant` + giá trị 14/500 (min-height 22px), padding `6px 8px`, margin `0 -8px`, bo 8px, `cursor:text`.
- Hover nền `--surface-variant`. **Bấm để sửa** ⇒ thay giá trị bằng `FieldValueEditor` của ERP; lưu xong toast "Đã lưu “Tên trường”".
- Thuộc tính chỉ đọc (tự tính): class `ro`, không hover.
- Dùng chung cho: record page, panel xem trước, drawer bản ghi. Thay các danh sách trường tự viết trong `RecordDetailDrawer.tsx` và `RecordDetailPage.tsx`.

#### 6.9b Card liên kết — mới: `AssociationCard` (`.ac-*`)

- Header: `▾` + "Companies (1)" + "+ Thêm" + ⚙.
- Mỗi bản ghi liên kết: khung viền bo 8px padding `10px 12px`: dòng tên 600 `--link` (+ tag "Primary") + `⋯`; 1–3 dòng phụ 12.5px ("Nhãn: giá trị"); link "Thêm nhãn liên kết".
- Cuối: "Xem tất cả Companies liên kết ↗". Rỗng: icon 28px + câu mời + nút.
- Dữ liệu: trường RELATION của ERP (chức năng giữ nguyên).

#### 6.9c Timeline hoạt động (`.tl-* .ta`)

- Hàng tab loại hoạt động 40px, 13/600, chọn = viền dưới **3px `--on-surface`**.
- Thanh công cụ: chip lọc (§6.8) + ô tìm kiếm + "Thu gọn tất cả".
- Nhóm theo tháng: tiêu đề 14/600. Mục: card viền bo 12px padding `12px 14px`; header icon + tiêu đề + thời gian 12px phải + nút `⋯`; mục hệ thống nền `--surface-variant`.
- Task: vòng tròn tick trước tiêu đề, meta "Hạn · Loại · Ưu tiên · Người thực hiện", nhãn "Quá hạn" `--error`.

#### 6.9d Cửa sổ soạn hoạt động — mới: `ActivityComposer` (`.composer .cm-*`)

Cửa sổ nổi để ghi Ghi chú, Task, Cuộc gọi, Cuộc họp, không che trang phía sau (không có scrim). Nguồn: `crm-shared.css` `.composer`; hành vi ở `specs/CRM-05` §3.

| Trạng thái | Vị trí · kích thước |
| --- | --- |
| Bình thường | `position:fixed`, đáy màn hình, cách phải 16px; rộng `min(500px, 100vw − 32px)`; cao tối đa 86vh, thân cuộn trong; bo `--radius-lg` hai góc trên, không viền đáy; `--shadow-3`; z-index 970 (dưới modal, trên panel dock) |
| Thu gọn | Rộng 320px, chỉ còn header; bấm header để mở; icon ⌄ xoay 180° |
| Phóng to | Rộng `min(860px, 100vw − 32px)`, giữa màn hình, cách đáy 4vh, bo đủ 4 góc |
| < 600px | Toàn màn hình, không có nút phóng to |

- Header: padding `8px 10px`, 15px, tên 600; nút ⌄ · tên · (đẩy phải) ⛶ · ✕; viền dưới `--outline-variant`.
- Ô soạn thảo (`.cm-ed`): cao 110px → 40vh, 14px / 1.55; thanh định dạng (`.cm-tb`) nút 28×28 bo `--radius-sm`, vạch ngăn 1×16px.
- Dòng "Liên kết với N bản ghi ▾" (`.cm-assoc`): padding `8px 14px`, viền trên, chữ 13/600, hover `--link`.
- Footer: padding `10px 14px`, viền trên, nút chính bên trái; dòng lỗi 12.5px `--error`, ẩn khi rỗng.

### 6.10 Panel phải (Drawer) — `components/ui/Drawer.tsx` (`.panel`)

| | Gốc | **Theme CRM** |
| --- | --- | --- |
| Rộng | 480 / 640 | **460px** (xem trước, tạo nhanh, bộ lọc nâng cao) · 640 giữ cho nội dung nhiều |
| Header | 56px, 18/600 | padding `14px 16px`, **18/700**, ellipsis; tab (nếu có) cao 42px ngay dưới |
| Thân | | padding 16px, cuộn dọc |
| Footer | canh phải | **canh trái**: nút chính trước ("Tạo"), "Tạo và thêm tiếp", "Huỷ" (ghost) — kiểu HubSpot |
| Chế độ **dock** (≥1240px) | — | panel xem trước **dính phải trong vùng nội dung**: rộng 400px, bo 16px, viền thay bóng, không scrim, nội dung trang co lại `padding-right:408px` |

"Xem trước" từ bảng / board ⇒ dock; "Tạo" / "Bộ lọc nâng cao" ⇒ panel phủ có scrim.

### 6.11 Modal — `components/ui/Modal.tsx` (`.modal`)

| | Gốc | **Theme CRM** |
| --- | --- | --- |
| `sm` | 420 | **480px** |
| `lg` "chọn cột" | 800 | **980×640** (2 cột: danh sách trường có tìm kiếm ↔ cột đang hiện kéo sắp xếp) |
| Header | 18/600, padding 24 | **17/700**, padding `16px 20px 8px` |
| Thân | padding 24 | `8px 20px 16px`, gap 12px |
| Footer | canh phải | canh phải, **viền trên 1px**, padding `12px 20px`; biến thể `mf.l` canh trái cho modal cấu hình |
| Scrim | `.4` | `.45` |

ConfirmDialog: nút xác nhận `danger` nền đặc, nhãn nêu hành động ("Xoá contact").

### 6.12 Menu · Popover · Chọn có tìm kiếm — `Menu.tsx` · `Popover.tsx` · `Combobox.tsx`

- Khung: nền `--surface`, viền `--outline-variant`, bo 8px, `--shadow-2`, padding 6px, `min-width:220px`, `max-height:min(420px,70vh)` cuộn.
- Mục: cao 34px, `padding:0 10px`, gap 10px, 13px, bo 4px, hover `--surface-2`; icon 18px trước. Mục bị khoá / sắp có: nhãn phải "Sắp có" 10.5/700 `--on-surface-variant`.
- Tiêu đề nhóm: 11/700 HOA `.04em`. Vạch ngăn 1px margin `4px 0`.
- Menu dài ⇒ **ô tìm kiếm** cao 32px ở đầu (bo pill).
- **Popover gắn nút** (bộ lọc nhanh, "Thao tác", ⚙): `position:fixed` theo `getBoundingClientRect` của nút, canh phải khi nút sát mép phải, lật lên khi thiếu chỗ bên dưới; đóng khi cuộn vùng chứa — **bỏ qua sự kiện cuộn trong 400ms đầu** (bẫy đã gặp: popover mở xong đóng ngay).
- **Chọn lựa chọn** (`.selpop`, thay `<select>` gốc ở ô sửa): rộng 240px, ô tìm kiếm + danh sách lựa chọn hiển thị **dạng pill** + "Xoá giá trị".

### 6.13 Form & trường nhập — `Field.tsx` · `RecordFieldInput.tsx` (`.field-form`)

| Phần tử | Đặc tả |
| --- | --- |
| Khoảng cách trường | 14px |
| Nhãn | 13/600, dấu `*` bắt buộc màu `--error`; mô tả phụ 12/400 `--on-surface-variant` |
| Input / select | cao 36px, viền 1px **`--outline-input`**, bo 8px, `padding:0 10px`, chữ 14/400 |
| Textarea | min-height 80px, `padding:8px 10px`, resize dọc |
| Focus | `outline:2px solid var(--primary); outline-offset:-1px`, viền trong suốt |
| Lỗi | chữ 13px `--error` dưới trường, `role="alert"` |
| Khối liên kết trong form tạo | viền **đứt** 1px `--outline`, bo 8px, padding 12px, tiêu đề 13/600 "Liên kết Contact với" |

### 6.14 Toast — `Toast` (`.toast`)

Đáy giữa màn, cách đáy 24px; nền `--on-surface`, chữ `--surface` 13px; padding `8px 14px`; bo 8px; tự ẩn sau 2.2s; `role="status"`. Một toast tại một thời điểm.

### 6.15 EmptyState — `EmptyState.tsx`

Giữ §8.8 file gốc; trong card nhỏ (card liên kết, catch-up) dùng biến thể **compact**: icon 28px, chữ 13px, padding `10px 4px`, nút secondary sm.

### 6.16 Thẻ số liệu & card báo cáo — `StatCard.tsx` · `features/dashboard/KpiCard.tsx`

| Biến thể | Đặc tả |
| --- | --- |
| **KPI nhỏ** (dải KPI đầu trang Sales / danh sách) | viền bo 8px padding `10px 12px`; nhãn 12px + icon 16px; số **20/700**; dòng phụ 11.5px; cảnh báo: số màu `--error` |
| **Card báo cáo** (dashboard) | viền bo 12px padding `14px 16px`; tiêu đề 15/600 `--link` + ⓘ; chip khoảng thời gian / "Bộ lọc (n)"; số KPI **40/700 `--link`** canh giữa, bấm để drill-down; toolbar hiện khi hover (kéo ⠿ · làm mới · bộ lọc · ⋮) góc phải trên; nút đổi kích thước góc phải dưới (1 → 2 → 3 cột) |
| **Thanh tiến độ** (% chỉ tiêu) | rãnh cao 8px bo pill nền `--surface-2`; ≥100% `--success`, 50–99% `--warning`, <50% `--primary`; số % 12.5/700 bên phải |

### 6.17 Command palette — `features/shell/CommandPalette.tsx`

Rộng 600px, cách đỉnh 10vh; ô nhập cao 48px 15px không viền (chỉ viền dưới); nhóm 11/700; mục 38px icon + chữ 13px + nhãn phụ phải.

---

### 6.18 Sơ đồ quan hệ — `RelationDiagram` (mới, bản 1.3)

Dùng cho trang Sơ đồ quan hệ (`specs/CRM-10`). Vẽ bằng SVG trong khung `.cv`, không dùng thư viện đồ thị.

| Phần | Đặc tả |
| --- | --- |
| Khung `.cv` | viền `--outline-variant`, bo `--radius-lg`, nền `--page-bg` + chấm lưới `radial-gradient(--outline-variant 1px)` bước 18px; `overflow-x:auto`, SVG `min-width:760px`. Nhớ bẫy flex ở §5 (`.frame > * { flex:none }`) |
| Thẻ đối tượng | 200 × 88, bo 10, nền `--surface`, viền 1.2px `--outline-variant`; dải màu đối tượng cao 5 ở mép trên; vòng tròn r=17 màu đối tượng chứa biểu tượng trắng 20px; tên 15/700 `--on-surface`; dòng phụ 12/500 `--on-surface-variant`. Hover / focus / đang chọn: viền 2px `--primary` |
| Thẻ chưa có trên hệ thống | nền `--surface-2`, viền đứt `--outline`, dòng phụ "Chưa tạo trên hệ thống" |
| Đường liên kết | 1.6px `--on-surface-variant`, liền |
| Đường nhân viên (owner, người thực hiện) | 1.6px `--obj-sale`, liền |
| Đường hoạt động | 1.6px `--on-surface-variant`, `stroke-dasharray: 6 5` |
| Đường chưa có trên hệ thống | 1.6px `--outline`, `stroke-dasharray: 2 4` |
| Chip trên đường | cao 22, bo 11, nền `--surface`, viền `--outline-variant` (đường nhân viên: viền `--obj-sale` 40% độ đậm); chữ 11.5/600; phần bản số 700 `--primary` |
| Làm nổi | phần không liên quan `opacity:.18`; đường được làm nổi dày 2.6px; chuyển tiếp 150ms, tắt khi `prefers-reduced-motion` |

Màu đối tượng (token mới, chỉ dùng trong sơ đồ quan hệ và biểu tượng đối tượng; mọi màu ≥ 3:1 với biểu tượng trắng):

| Token | Light | Dark | Đối tượng |
| --- | --- | --- | --- |
| `--obj-contact` | `#D4532B` | *(giữ)* | Contact |
| `--obj-sale` | `#7447DB` | `#9B7BF2` | Sale / nhân viên, đường nhân viên (bản tối 5.2:1 trên nền tối) |
| `--obj-company` | `#00788F` | *(giữ)* | Company |
| `--obj-deal` | `#00855A` | *(giữ)* | Deal |
| `--obj-activity` | `#516F90` | *(giữ)* | Hoạt động |
| `--obj-lineitem` | `#A86A00` | *(giữ)* | Line item |
| `--obj-product` | `#64788C` | *(giữ)* | Sản phẩm |

Prototype `crm-quan-he-hubspot.html` dùng màu mã cứng (`#FF7A59`, `#F5A623`, `#99AFC4` chỉ đạt 2.0–2.6:1 với biểu tượng trắng); bản thật dùng bảng trên. Khi xuất SVG, các token được thay bằng giá trị bản sáng (CRM-10 §9).

### 6.19 Thanh giai đoạn — `StageBar` (mới, bản 1.4) (`.sb .sb-s`)

Dùng cho đối tượng có pipeline ngắn mà người dùng chuyển bước ngay trên bản ghi: hiện là **Lead** (`crm-lead-hubspot.html`, panel Xem trước của `crm-leads-hubspot.html`). Contact và Company **không** dùng (lifecycle vẫn là pill, xem §6.9).

| Phần | Đặc tả |
| --- | --- |
| Khung `.sb` | `display:flex`, `gap:4px`, rộng 100%; mỗi bước `flex:1`, `min-width:0` |
| Bước `.sb-s` | `<button>` cao 32px, bo `--radius-sm`, chữ 12.5/600, nền `--surface-2`, chữ `--on-surface-variant`; nhãn cắt bằng `…`; `title` = tên đầy đủ |
| Bước đã qua `.done` | nền `--primary-container`, chữ `--on-primary-container`, có biểu tượng `check` 16px ở đầu |
| Bước hiện tại `.on` | nền `--primary`, chữ `--on-primary`, `aria-current="step"` |
| Kết thúc không đạt `.on.bad` | nền `--error`, chữ trắng |
| Bản gọn `.sb.sm` | cao 26px, chữ 11.5px, ẩn biểu tượng; dùng trong panel dock 400px |
| Số bước | các bước mở + **một** bước kết thúc: khi bản ghi còn mở hiện bước "Đạt"; khi đã đóng hiện đúng trạng thái đóng ("Đạt" hoặc "Không đạt") |
| Hành vi | bấm một bước = chuyển giai đoạn. Bước kết thúc không đổi ngay: "Đạt" mở hộp tạo Deal, "Không đạt" mở hộp chọn lý do (Modal `sm`, §6.11) |
| Ghi chú dưới thanh `.sb-note` | 13px, biểu tượng 20px ở đầu; `.ok` biểu tượng `--success`, `.bad` biểu tượng `--error` |

Trợ năng: cả thanh là `role="group"` có `aria-label`; trạng thái không chỉ thể hiện bằng màu (bước đã qua có dấu `check`, bước hiện tại có `aria-current`).

---

## 7. Mẫu trang (template)

Mọi màn ERP phải rơi vào **một trong bốn template** dưới đây. Không tự bố cục trang mới.

### 7.1 T1 — Trang danh sách (List)

```
┌ ObjectHeader (§6.2) ─────────────────────────────────────────────┐
├ View tabs (§6.3) ────────────────────────────────────────────────┤
├ Toolbar (§6.4) ──────────────────────────────────────────────────┤
├ Quick filter bar (§6.5) ─────────────────────────────────────────┤
├ Bulk bar (khi chọn) ─────────────────────────────────────────────┤
│ DataTable (§6.6)  hoặc  Board (§6.7)       │ [Preview dock 400] │
├ Footer bảng ─────────────────────────────────────────────────────┤
```
Nguồn tham chiếu: `crm-contacts-hubspot.html`, `crm-companies-hubspot.html`, `crm-giao-dich-hubspot.html`, `crm-sales-hubspot.html`.

### 7.2 T2 — Trang chi tiết bản ghi (Record)

3 cột như §6.9. Nguồn: `crm-record-hubspot.html?type=contact|company|deal`, chi tiết sale `crm-sales-hubspot.html?id=`.

### 7.3 T3 — Dashboard / báo cáo

```
┌ Header: ☆ Tên dashboard ▾ · Thao tác ▾ · Chia sẻ ▾ · Thêm nội dung ▾ ┐
├ Tab dashboard ───────────────────────────────────────────────────────┤
├ Bộ lọc: Khoảng thời gian ▾ · Owner ▾ · Bộ lọc nâng cao · ⟳ ─────────┤
│ Lưới card báo cáo 1–3 cột trên --page-bg, gap 12, kéo sắp / đổi cỡ │
```
Nguồn: `crm-bao-cao-hubspot.html`.

### 7.4 T4 — Trang cấu hình / công cụ (Settings, builder, editor)

- Tiêu đề `PageHeader` gốc (22/600) + mô tả 13px; nội dung trong frame, padding 16–24px.
- Menu cấu hình con: cột trái 236px dạng nav (mục 34px bo 8px, chọn = `--primary-container`).
- Danh sách cấu hình (thành viên, trường dữ liệu, connector…) **dùng DataTable §6.6**, không tự vẽ bảng.
- Trình dựng toàn màn (Workflow editor, Form builder, Line item editor): thanh trên 56px **nền shell** với "Huỷ · tiêu đề · Lưu" (kiểu trình sửa line item), canvas bên dưới.
- Nguồn: `crm-quan-ly-truong-hubspot.html` (quản lý trường), trình sửa line item trong `crm-record-hubspot.html?type=deal`.

---

## 8. Ánh xạ màn ERP hiện tại → template

| Khu vực ERP | File chính | Template | Việc cần làm chính |
| --- | --- | --- | --- |
| Shell | `features/shell/*`, `app/(app)/app-shell.tsx` | §5 | Topbar/sidebar dùng `--shell-*`, thêm frame |
| **Dữ liệu — danh sách collection** | `features/data/CollectionsHub.tsx` | T1 | Hub collection = bảng (tên · số bản ghi · cập nhật · owner), bỏ lưới card |
| **Dữ liệu — bản ghi** | `RecordListView.tsx`, `RecordTableView.tsx`, `RecordKanbanView.tsx`, `RecordFilterBar.tsx`, `SavedViewsMenu.tsx` | T1 | ObjectHeader + view tabs + quick filter + DataTable/Board theme; bulk bar |
| Dữ liệu — chi tiết | `RecordDetailPage.tsx`, `RecordDetailDrawer.tsx` | T2 · Drawer dock | PropertyList, AssociationCard (trường RELATION), timeline |
| Dữ liệu — trường | `FieldBuilder.tsx`, `FieldEditorPanel.tsx` | T4 | Bảng trường + panel phải 460 |
| Tạo bản ghi | `RecordCreateModal.tsx` | Panel phải | Đổi modal → panel "Tạo X" (Tạo · Tạo và thêm tiếp · Huỷ) |
| Trang chủ | `features/dashboard/*` | T3 | KpiStrip → KPI nhỏ; ActivityFeed → timeline card |
| Việc của tôi | `features/tasks/MyTasksView.tsx`, `TaskDetailDrawer.tsx` | T1 · Drawer | Bảng task + quick filter (Hạn · Ưu tiên · Người thực hiện); drawer 460 |
| Phê duyệt | `features/approvals/*` | T1 · Drawer | như trên |
| Workflow — danh sách / lượt chạy | `WorkflowList.tsx`, `WorkflowRunsList.tsx` | T1 | Bỏ lưới card, dùng DataTable + Badge trạng thái |
| Workflow — editor | `WorkflowEditor.tsx`, `WorkflowCanvas.tsx`, `NodeConfigPanel*.tsx` | T4 | Thanh trên nền shell; panel cấu hình node = Drawer 460; **giữ** màu node §3.3 gốc |
| Biểu mẫu | `features/form/*` | T1 + T4 | Danh sách = bảng; builder = T4 |
| Media | `features/media/*` | T1 | Bảng + chế độ lưới giữ làm "Board" thay thế |
| Báo cáo | `app/(app)/reports` | T3 | Dùng card báo cáo §6.16 |
| Cài đặt | `features/settings/*` | T4 | Nav con trái + DataTable |
| Nhật ký | `features/audit/AuditLogPage.tsx` | T1 | |
| Cowork (AI) | `features/cowork/*` | **Ngoại lệ** | Chỉ nhận token màu + shell; bố cục 4 cột giữ nguyên (§8.20 gốc) |
| Đăng nhập / mời / form công khai | `features/auth/*`, `PublicFormRenderer.tsx` | Ngoài shell | Chỉ đổi token màu + nút |

---

## 9. Kế hoạch migrate & tiêu chí Done

| Đợt | Nội dung | Ảnh hưởng | Done khi |
| --- | --- | --- | --- |
| **P0 — Token & shell** | Khối `[data-brand="crm"]` + token mới §1.2; `layout.tsx` gắn `data-brand`; AppHeader / Sidebar / frame | Cả app đổi màu + khung | Đổi qua lại brand không vỡ màn nào; dark mode đọc được; `next build` xanh |
| **P1 — Component nền** | Button (32/28, pill, danger đặc) · Badge (chấm) · Chip/Tag · Tabs (`view`) · Menu/Popover (tìm kiếm, fixed) · Modal · Drawer (460, footer trái, dock) · Field (`--outline-input`) · Toast | Mọi nút, hộp thoại | Test component cập nhật và pass; §8.22 file gốc cập nhật |
| **P2 — Danh sách** | ObjectHeader · QuickFilterBar · DataTable theme · Board · OptionPill · bulk bar · footer | Dữ liệu, Việc của tôi, Phê duyệt, Workflow list, Forms, Media, Audit | Mọi trang danh sách khớp T1; 0 bảng tự vẽ |
| **P3 — Chi tiết** | PropertyList · AssociationCard · timeline · RecordDetailPage 3 cột · panel tạo | Chi tiết bản ghi, task | Record page khớp T2 |
| **P4 — Dashboard & cấu hình** | Card báo cáo · KPI · Settings T4 · editor thanh trên | Trang chủ, Báo cáo, Cài đặt, Workflow editor | Khớp T3/T4 |

**Thí điểm trước khi nhân rộng** (theo bài học §0 file gốc): làm trọn **Dữ liệu → Deals_Pipeline** (P2 + P3) rồi so pixel với `crm-giao-dich-hubspot.html` + `crm-record-hubspot.html?type=deal`, ghi lại lệch vào §12 rồi mới làm các màn khác.

### Checklist review PR giao diện (bổ sung §11.6 file gốc)

- [ ] Không có màu `#1A73E8` / `--color-primary` cứng trong code mới; link dùng `text-link`.
- [ ] Nút cao 32 (sm 28), bo `rounded-btn`, tối đa **1 nút primary** trong khung nhìn.
- [ ] Bảng: header chữ thường 13/500, cột tên dính trái có viền phải, footer có đếm.
- [ ] Giá trị SELECT hiển thị bằng `OptionPill`, trạng thái hệ thống bằng `Badge` — không lẫn.
- [ ] Sửa tại chỗ dùng `PropertyList` / ô bảng, không mở trang mới.
- [ ] Panel phải 460px, footer canh trái; modal 480px, footer có viền trên.
- [ ] Kiểm cả `data-brand=""` (gốc) lẫn `crm`, cả light lẫn dark, ở 390 / 1024 / 1440px.

---

## 10. Dark mode

`[data-brand="crm"][data-theme="dark"]` — **chỉ ghi đè những gì khác bản dark gốc**:

| Token | Dark CRM |
| --- | --- |
| `--primary` | `#5CC2C0` |
| `--on-primary` | `#0B2A2A` (7.2:1) |
| `--primary-container` | `#123C3C` |
| `--on-primary-container` | `#BFE8E6` |
| `--link` | `#7AD3D1` (9.3:1 trên `#202124`) |
| `--shell-*`, `--canvas` | theo §2.2 |
| `--page-bg` | `#18191B` |
| `--board-col` | `#28292C` |
| `--outline-input` | `#6B6B6B` (3.0:1 trên `#202124`) |
| Surface / text / outline / trạng thái | dùng bản dark gốc |

Lưu ý: `--on-surface` / `--on-surface-variant` của bản dark gốc (`#E8EAED` / `#9AA0A6`) giữ nguyên — **không** kéo `#333`/`#666` của light sang dark.

---

## 11. Trợ năng — điểm cần sửa khi đổi màu

Đã tính tỉ lệ tương phản (WCAG 2.1) cho mọi cặp mới — đều đạt ≥4.5:1 với chữ thường. Ba điểm **đang không đạt** (có sẵn từ bảng màu gốc, theme này đề xuất sửa luôn):

| Cặp | Hiện tại | Đề xuất | Sau sửa |
| --- | --- | --- | --- |
| Chữ Badge `success` trên container | `#1E8E3E` / `#E6F4EA` = **3.7:1** | chữ badge dùng `#137333` | 5.2:1 |
| Chữ Badge `warning` trên container | `#B06000` / `#FEF7E0` = 4.3:1 | `#8A4B00` | 6.4:1 |
| Chữ Badge `error` trên container | `#D93025` / `#FCE8E6` = 4.1:1 | `#B3261E` | 5.6:1 |
| Viền input trên trắng (WCAG 1.4.11 cần 3:1) | `#CCCCCC` = 1.6:1 | token mới `--outline-input` `#8F8F8F` | 3.2:1 |

Cách sửa gọn: thêm cặp token `--{tone}-on-container` cho chữ badge thay vì đổi `--success` (vì `--success` còn dùng cho icon/đường viền, nơi 3:1 là đủ).

Giữ nguyên 6 yêu cầu §12bis file gốc. Bổ sung cho theme:

- Nút "Xem trước" chỉ hiện khi hover ⇒ **phải hiện khi focus bàn phím** (`:focus-visible`), và dòng bảng phải có đường vào bằng Enter.
- Popover bộ lọc nhanh: `aria-haspopup`, `aria-expanded`, Esc đóng và trả focus về nút.
- Pill lựa chọn luôn có **chữ** — màu chỉ để quét nhanh.
- Sidebar rail (905–1239px): `title` + `aria-label` = nhãn mục.

---

## 12. Bảng lệch so với DESIGN-SYSTEM.md (để cập nhật file gốc)

Theo RULE 2b của dự án — mọi lệch/bổ sung phải ghi vào file gốc. Khi theme được duyệt, cập nhật các mục sau:

| § gốc | Loại | Nội dung cần thêm / sửa |
| --- | --- | --- |
| §2 Kiến trúc token | Bổ sung | Tầng "brand": khối `[data-brand]` ở `<html>`; bảng token mới §1.2 |
| §3.1 Bảng màu | Bổ sung | Cột "Theme CRM" (§2.1) + màu shell (§2.2) |
| §3.3 Màu phân loại | Bổ sung ngoại lệ | `--cat-1…7` cho pill lựa chọn (§2.4); `--viz-*` cho biểu đồ (§2.5) |
| §4.2 Thang chữ | Sửa theo brand | Header bảng 13/500 chữ thường; h1 danh sách 24/600; thêm 12.5 / 13.5 vào thang vi mô |
| §6.1 Spacing | Sửa theo brand | Padding trang danh sách 16px; lưới card 12px |
| §6.2 Radius | Bổ sung | `--radius-btn`, `--radius-frame` |
| §6.3bis Viền | Bổ sung ngoại lệ | Viền đứt: vùng thả cột Kanban + khối liên kết trong form tạo |
| §7.1 Khung ứng dụng | Sửa theo brand | Frame 16px / gap 8px trên canvas tối |
| §8.1 PageHeader | Bổ sung | `ObjectHeader` cho trang danh sách |
| §8.2 Button | Sửa theo brand | 32/28px, 13/600, pill, `danger` đặc |
| §8.3 Badge | Sửa | Chấm tròn 6px khi không có icon; màu chữ `--{tone}-on-container` |
| §8.4 Modal | Sửa theo brand | `sm` 480px, header 17/700, footer có viền trên |
| §8.6 Drawer | Sửa theo brand | 460px, footer canh trái, chế độ dock 400px |
| §8.7 DataTable | Sửa theo brand | §6.6 (header, 44px, cột tên dính, "Xem trước", dòng mở rộng, footer, bulk bar trên bảng) |
| §8.12 Tabs | Bổ sung | Variant `view` |
| §8.13 Menu | Bổ sung | Ô tìm kiếm, `position:fixed`, bẫy cuộn 400ms |
| §8.22 Tổng hợp | Bổ sung component mới | `ObjectHeader` · `QuickFilterBar` · `OptionPill` · `PropertyList` · `AssociationCard` · `Timeline` · `ReportCard` |
| §8.30 KanbanBoard | Sửa theo brand | §6.7 |
| §7.4 Khung cuộn | Bổ sung bẫy | Flex column co khối `overflow-x:auto` về 0 ⇒ `.frame > * { flex:none }` |
| §8.22 Tổng hợp | Bổ sung component mới (bản 1.2) | `ActivityComposer` — cửa sổ soạn nổi góc phải dưới (§6.9d). Nguồn: `specs/CRM-05` §3.1 |
| §3.3 Màu phân loại | Bổ sung ngoại lệ (bản 1.3) | `--obj-*` màu đối tượng CRM, chỉ dùng trong sơ đồ quan hệ (§6.18) |
| §8.22 Tổng hợp | Bổ sung component mới (bản 1.3) | `RelationDiagram` — sơ đồ quan hệ SVG: thẻ đối tượng, ba kiểu đường, chip bản số, làm nổi (§6.18). Nguồn: `specs/CRM-10` §4, §5 |
| §8.7 DataTable | Sửa (bản 1.1) | Mật độ Thoáng/Gọn là tuỳ chọn cá nhân lưu theo người dùng (không localStorage); kiểu Bảng/Board là thuộc tính của view. Nguồn: `specs/CRM-01` §4.11 |
| §8.22 Tổng hợp | Bổ sung component mới (bản 1.4) | `StageBar` — thanh giai đoạn bấm được cho Lead pipeline (§6.19). Nguồn: prototype `crm-leads.js` |

---

## 13. Nhật ký phiên bản

| Phiên bản | Ngày | Nội dung | Tác giả |
| --- | --- | --- | --- |
| 1.4 | 06/10/2026 | §6.19: thêm component `StageBar` (thanh giai đoạn của Lead) theo `crm-shared.css`; thêm dòng vào §12. Phát sinh khi dựng màn Leads (`crm-leads-hubspot.html`, `crm-lead-hubspot.html`) | Claude (Cowork) cho TTS |
| 1.3 | 01/10/2026 | §6.18: thêm component `RelationDiagram` (sơ đồ quan hệ) và bảng màu đối tượng `--obj-*` thay cho màu mã cứng của prototype (3 màu không đủ tương phản); thêm hai dòng vào §12. Phát sinh khi viết `specs/CRM-10-so-do-quan-he.md` | Claude (Cowork) cho TTS |
| 1.2 | 30/09/2026 | §6.9d: thêm component `ActivityComposer` (cửa sổ soạn hoạt động) theo `crm-shared.css`; thêm dòng vào §12. Phát sinh khi viết `specs/CRM-05-activities.md` | Claude (Cowork) cho TTS |
| 1.1 | 30/09/2026 | §6.6: mật độ bảng lưu theo người dùng thay cho localStorage; thêm dòng tương ứng vào §12. Phát sinh khi viết `specs/CRM-01-khung-danh-sach-trang-chi-tiet.md` | Claude (Cowork) cho TTS |
| 1.0 | 30/09/2026 | Tạo lớp theme HubSpot từ prototype giai đoạn 2 (Phần 1–7): token, shell, 17 component, 4 template, ánh xạ màn ERP, kế hoạch migrate P0–P4, trợ năng, bảng lệch với DESIGN-SYSTEM.md v3.3 | Claude (Cowork) cho TTS |

/* ═══════════════════════════════════════════════════════════════
   HarnexAI CRM mockup — phần dùng chung cho 2 màn Deals_Pipeline.
   Schema (17 trường, kiểu, lựa chọn) lấy ĐÚNG từ collection Deals_Pipeline
   trên erp.tuoitresoft.com (API /collections/:id, 23/09/2026).
   Dữ liệu bản ghi là dữ liệu mẫu. Lưu tạm trong localStorage để 2 màn
   dùng chung; lỗi storage thì chạy trong bộ nhớ.
   ═══════════════════════════════════════════════════════════════ */
const HX = (() => {
  const COLLECTION = { id: 'qwxvgrdlf0ly7v2cywzxgzch', name: 'Deals_Pipeline' };
  const STAGES = ['1. MQL Qualified','2. Discovery Call','3. Demo Scheduled','4. Proposal Sent','5. Closed Won','6. Closed Lost'];
  // Thứ tự = displayOrder trên ERP. primary = cột đầu (Mã Deal)
  const FIELDS = [
    {key:'m_deal', name:'Mã Deal', type:'TEXT', primary:true},
    {key:'t_n_deal', name:'Tên Deal', type:'TEXT'},
    {key:'lead_id', name:'Lead Id', type:'TEXT'},
    {key:'g_i_d_ch_v_m_c_ti_u', name:'Gói Dịch Vụ Mục Tiêu', type:'SELECT', choices:['STARTER','PROFESSIONAL','ENTERPRISE BYOC']},
    {key:'th_i_h_n_thanh_to_n', name:'Thời Hạn Thanh Toán', type:'SELECT', choices:['6 Months (6T)','12 Months (12T)','Monthly']},
    {key:'giai_o_n_pipeline', name:'Giai Đoạn Pipeline', type:'SELECT', choices:STAGES},
    {key:'ph_thu_tr_tr_c', name:'Phí Thuê Trả Trước', type:'NUMBER'},
    {key:'ph_kh_i_t_o_setup', name:'Phí Khởi Tạo (Setup)', type:'NUMBER'},
    {key:'t_ng_cash_in_d_ki_n', name:'Tổng Cash-In Dự Kiến', type:'NUMBER'},
    {key:'s_ti_n_gi_m_gi', name:'Số tiền giảm giá', type:'NUMBER'},
    {key:'l_do_gi_m', name:'Lý do giảm', type:'LONG_TEXT'},
    {key:'t_l_th_nh_c_ng', name:'Tỷ Lệ Thành Công (%)', type:'NUMBER'},
    {key:'ng_y_d_ki_n_ch_t', name:'Ngày Dự Kiến Chốt', type:'DATE'},
    {key:'sale_ph_tr_ch', name:'Sale phụ trách', type:'TEXT'},
    {key:'l_do_th_t_b_i', name:'Lý do thất bại', type:'SELECT', choices:['Giá cao','Chưa có ngân sách','Dùng đối thủ','Không liên lạc được','Tính năng chưa đáp ứng']},
    {key:'ng_y_c_p_nh_t_g_n_nh_t', name:'Ngày cập nhật gần nhất', type:'DATETIME'},
    {key:'test', name:'Test', type:'RELATION'},
  ];
  const F = Object.fromEntries(FIELDS.map(f => [f.key, f]));
  // Danh sách workflow — đúng tên đang có trên ERP (hộp "Kích hoạt Workflow")
  const WORKFLOWS = ['(1) SALE LIÊN HỆ & PHÂN BỔ LEADS','(2) TỰ ĐỘNG XẾP LỊCH DEMO & NHẮC LỊCH QUA ZALO/SMS','Tiếp nhận Lead từ HarnexAI',
    '(3) TỰ ĐỘNG TẠO BÁO GIÁ & HỢP ĐỒNG STARTER 6T KÈM MÃ VIETQR','Quy trình chăm sóc Lead mới','(5) CẢNH BÁO DEAL TẮC NGHẼN & TỰ ĐỘNG NUÔI DƯỠNG LẠI (RE-ENGAGEMENT)',
    '(6) BÁO CÁO KPI & BẢNG XẾP HẠNG SALES TỰ ĐỘNG MỖI CUỐI TUẦN','Test','QUY TRÌNH TUYỂN DỤNG','Check Thông Tin Website'];

  const S = (m, t, l, g, h, st, pre, setup, cash, disc, why, rate, close, sale, lost, upd, created) => ({
    m_deal:m, t_n_deal:t, lead_id:l, g_i_d_ch_v_m_c_ti_u:g, th_i_h_n_thanh_to_n:h, giai_o_n_pipeline:st,
    ph_thu_tr_tr_c:pre, ph_kh_i_t_o_setup:setup, t_ng_cash_in_d_ki_n:cash, s_ti_n_gi_m_gi:disc, l_do_gi_m:why,
    t_l_th_nh_c_ng:rate, ng_y_d_ki_n_ch_t:close, sale_ph_tr_ch:sale, l_do_th_t_b_i:lost, ng_y_c_p_nh_t_g_n_nh_t:upd, test:null, __created:created });
  const SEED = [
    S('DEAL-0013','Dược phẩm Thiên Phúc — Enterprise','LEAD20260910007','ENTERPRISE BYOC','12 Months (12T)','4. Proposal Sent',180000000,30000000,210000000,0,null,70,'2026-10-31','Minh Trần',null,'2026-09-23T02:30:00Z','2026-09-10T03:12:00Z'),
    S('DEAL-0012','Du lịch Biển Xanh — gia hạn','LEAD20260908004','PROFESSIONAL','12 Months (12T)','4. Proposal Sent',48000000,6000000,54000000,0,null,65,'2026-09-29','Lan Lê',null,'2026-09-21T09:05:00Z','2026-09-08T08:40:00Z'),
    S('DEAL-0011','Xây dựng Hưng Thịnh — Pro + setup','LEAD20260905002','PROFESSIONAL','6 Months (6T)','3. Demo Scheduled',70000000,16000000,86000000,4000000,'Khách giới thiệu từ đối tác',50,'2026-10-10','Lan Lê',null,'2026-09-22T04:15:00Z','2026-09-05T02:20:00Z'),
    S('DEAL-0010','Thời trang Mộc Lan','LEAD20260904006','STARTER','12 Months (12T)','3. Demo Scheduled',28000000,4000000,32000000,0,null,45,'2026-10-20','Phương Nguyễn',null,'2026-09-18T07:00:00Z','2026-09-04T06:10:00Z'),
    S('DEAL-0009','In ấn Phương Đông','LEAD20260902003','STARTER','12 Months (12T)','3. Demo Scheduled',28000000,4000000,32000000,0,null,40,'2026-10-18','Minh Trần',null,'2026-09-23T01:10:00Z','2026-09-02T04:00:00Z'),
    S('DEAL-0008','Mầm non Hoa Sen','LEAD20260829001','STARTER','6 Months (6T)','2. Discovery Call',15000000,3000000,18000000,0,null,30,'2026-10-05','Lan Lê',null,'2026-09-20T03:30:00Z','2026-08-29T02:00:00Z'),
    S('DEAL-0007','Logistics Tân Cảng Xanh — 20 user','LEAD20260827005','PROFESSIONAL','Monthly','2. Discovery Call',57000000,8000000,65000000,0,null,30,'2026-10-28','Phương Nguyễn',null,'2026-09-19T08:45:00Z','2026-08-27T09:30:00Z'),
    S('DEAL-0006','Nha khoa Nụ Cười Việt','LEAD20260825002','STARTER','6 Months (6T)','2. Discovery Call',15000000,3000000,18000000,0,null,20,'2026-09-30','Minh Trần',null,'2026-09-11T02:00:00Z','2026-08-25T03:15:00Z'),
    S('DEAL-0005','Nội thất Minh Phát','LEAD20260822004','PROFESSIONAL','12 Months (12T)','1. MQL Qualified',42000000,6000000,48000000,0,null,10,'2026-10-15','Phương Nguyễn',null,'2026-09-23T04:00:00Z','2026-08-22T07:05:00Z'),
    S('DEAL-0004','Thực phẩm An Khang — ERP','LEAD20260820001','ENTERPRISE BYOC','12 Months (12T)','1. MQL Qualified',100000000,20000000,120000000,0,null,10,'2026-11-30','Minh Trần',null,'2026-09-22T09:20:00Z','2026-08-20T01:50:00Z'),
    S('DEAL-0003','Kế toán Sao Việt','LEAD20260815003','STARTER','6 Months (6T)','5. Closed Won',15000000,3000000,18000000,0,null,100,'2026-09-12','Phương Nguyễn',null,'2026-09-12T10:00:00Z','2026-08-15T02:30:00Z'),
    S('DEAL-0002','Cơ khí Đại Phong','LEAD20260814002','PROFESSIONAL','12 Months (12T)','5. Closed Won',64000000,8000000,72000000,0,null,100,'2026-09-05','Minh Trần',null,'2026-09-05T08:00:00Z','2026-08-14T04:10:00Z'),
    S('DEAL-0001','Spa Ngọc Trai','LEAD20260813001','STARTER','6 Months (6T)','6. Closed Lost',15000000,3000000,18000000,0,null,0,'2026-09-08','Lan Lê','Dùng đối thủ','2026-09-08T05:00:00Z','2026-08-13T04:17:00Z'),
  ].map((v, i) => ({ id: 'r' + String(13 - i).padStart(3, '0'), createdAt: v.__created, values: (delete v.__created, v) }));
  // Bảng liên kết của trường RELATION "Test" (bản ghi mẫu)
  const RELATED = [{id:'t1',label:'Bản ghi liên kết #1'},{id:'t2',label:'Bản ghi liên kết #2'},{id:'t3',label:'Bản ghi liên kết #3'}];

  const KEY = 'hx-crm-deals-v2', VKEY = 'hx-crm-views-v2';
  const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  let records = load(KEY, SEED);
  let views = load(VKEY, [{id:'v1',name:'Table',type:'TABLE'},{id:'v2',name:'Kanban',type:'KANBAN'}]);

  const api = {
    list: () => records,
    get: id => records.find(r => r.id === id),
    update(id, key, value) { const r = api.get(id); if (!r) return; r.values[key] = value; r.values.ng_y_c_p_nh_t_g_n_nh_t = new Date().toISOString(); save(KEY, records); },
    create(values) { const r = { id: 'r' + Date.now(), createdAt: new Date().toISOString(), values }; records.unshift(r); save(KEY, records); return r; },
    remove(ids) { records = records.filter(r => !ids.includes(r.id)); save(KEY, records); },
    views: () => views,
    saveViews(v) { views = v; save(VKEY, views); },
    reset() { try { localStorage.removeItem(KEY); localStorage.removeItem(VKEY); } catch {} location.reload(); },
  };

  /* ── Định dạng (giống formatCellValue của ERP) ── */
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const empty = v => v === null || v === undefined || v === '';
  function fmt(v, f) {
    if (empty(v)) return '';
    switch (f.type) {
      case 'NUMBER': return typeof v === 'number' ? v.toLocaleString('vi-VN') : String(v);
      case 'DATE': case 'DATETIME': return new Date(v).toLocaleDateString('vi-VN');
      case 'LONG_TEXT': return String(v).length > 60 ? String(v).slice(0, 60) + '...' : String(v);
      case 'RELATION': return (RELATED.find(x => x.id === v) || {label: String(v)}).label;
      default: return String(v);
    }
  }
  const chipCls = v => v === '5. Closed Won' ? 'won' : v === '6. Closed Lost' ? 'lost' : '';
  function display(v, f) {
    if (empty(v)) return '<span class="nil">—</span>';
    if (f.type === 'SELECT') return `<span class="chip ${chipCls(v)}">${esc(v)}</span>`;
    if (f.type === 'RELATION') return `<span class="chip muted">${esc(fmt(v, f))}</span>`;
    return esc(fmt(v, f));
  }
  const createdFmt = iso => { const d = new Date(iso), p = n => String(n).padStart(2, '0'); return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`; };
  const title = r => r.values.m_deal || r.values.t_n_deal || '—';

  /* ── Trình sửa theo kiểu trường (FieldValueEditor): Enter/blur lưu, Esc huỷ ── */
  function editor(f, value, onSave, onCancel, where = 'table') {
    if (f.type === 'RELATION' && where === 'table') {
      const d = document.createElement('div'); d.className = 'ed-note'; d.textContent = 'Chỉnh sửa trực tiếp tại trang chi tiết';
      setTimeout(onCancel, 1600); return d;
    }
    let el;
    if (f.type === 'SELECT' || f.type === 'RELATION') {
      el = document.createElement('select'); el.className = 'ed';
      const opts = f.type === 'SELECT' ? f.choices.map(c => [c, c]) : RELATED.map(x => [x.id, x.label]);
      el.innerHTML = `<option value="">— Chọn —</option>` + opts.map(([v, l]) => `<option value="${esc(v)}" ${v === value ? 'selected' : ''}>${esc(l)}</option>`).join('');
      el.addEventListener('change', () => { done = true; onSave(el.value || null); });
    } else if (f.type === 'LONG_TEXT') {
      el = document.createElement('textarea'); el.className = 'ed'; el.value = value ?? '';
    } else {
      el = document.createElement('input'); el.className = 'ed';
      el.type = f.type === 'NUMBER' ? 'number' : f.type === 'DATE' ? 'date' : f.type === 'DATETIME' ? 'datetime-local' : 'text';
      el.value = empty(value) ? '' : f.type === 'DATETIME' ? String(value).slice(0, 16) : String(value);
    }
    let done = false;
    const commit = () => { if (done) return; done = true; let v = el.value; if (f.type === 'NUMBER') v = v === '' ? null : Number(v);
      if (f.type === 'DATETIME' && v) v = new Date(v).toISOString(); if (v === '') v = null; onSave(v); };
    el.addEventListener('keydown', e => { if (e.key === 'Escape') { done = true; onCancel(); } if (e.key === 'Enter' && f.type !== 'LONG_TEXT') commit(); });
    el.addEventListener('blur', () => setTimeout(commit, 60));
    el.addEventListener('click', e => e.stopPropagation());
    setTimeout(() => el.focus(), 0);
    return el;
  }

  /* ── Tiện ích UI ── */
  const $ = (s, r = document) => r.querySelector(s);
  let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2400); }
  function modal(html, onMount) {
    const bg = $('#modal'); bg.innerHTML = html; bg.classList.add('open');
    const close = () => { bg.classList.remove('open'); bg.innerHTML = ''; };
    bg.onclick = e => { if (e.target === bg || e.target.closest('[data-close]')) close(); };
    onMount && onMount(bg, close); return close;
  }
  function confirmBox(titleTxt, body, okTxt, onOk) {
    modal(`<div class="modal" role="dialog" aria-modal="true"><div class="mh">${titleTxt}</div><div class="mb">${body}</div>
      <div class="mf"><button class="btn btn--secondary" data-close>Huỷ</button><button class="btn btn--danger" id="okBtn">${okTxt}</button></div></div>`,
      (bg, close) => { $('#okBtn', bg).onclick = () => { close(); onOk(); }; });
  }

  /* ── Shell: topbar + sidebar đúng menu ERP ── */
  const NAV = [['forum','Cowork'],['home','Trang chủ'],['task_alt','Việc của tôi'],['table_chart','Dữ liệu','cur'],['account_tree','Workflow'],['description','Biểu mẫu'],['image','Media'],['bar_chart','Báo cáo']];
  function shell() {
    $('#topbar').innerHTML = `
      <button class="icon-btn navbtn" id="navBtn" aria-label="Mở điều hướng"><span class="ms">menu</span></button>
      <a class="brand" href="index.html"><span class="brand-mark">H</span><span>HarnexAI</span></a>
      <button class="tb-search" data-palette><span class="ms sm">search</span><span class="t">Tìm kiếm hoặc gõ lệnh…</span><span class="kbd">Ctrl+K</span></button>
      <div class="tb-right">
        <button class="tb-create" data-palette><span class="ms sm">add</span>Tạo</button>
        <button class="icon-btn" aria-label="Thông báo: 86 chưa đọc" title="Thông báo"><span class="ms">notifications</span><span class="badge-count">86</span></button>
        <span class="avatar" title="Tài khoản">PN</span>
      </div>`;
    $('#sidebar').innerHTML = NAV.map(([i, l, c]) => `<a class="nav-i" href="${c ? 'crm-giao-dich-hubspot.html' : '#'}" ${c ? 'aria-current="page"' : ''} title="${l}"><span class="ms">${i}</span><span class="lbl">${l}</span></a>`).join('')
      + `<div class="nav-sp"></div><a class="nav-i" href="#" title="Cài đặt"><span class="ms">settings</span><span class="lbl">Cài đặt</span></a>`;
    $('#navBtn').onclick = () => document.body.classList.add('nav-open');
    $('#scrim').addEventListener('click', () => { document.body.classList.remove('nav-open'); closePanel(); });
    document.addEventListener('click', e => { if (e.target.closest('[data-palette]')) palette(); });
    document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette(); } });
    $('#demo').innerHTML = `<button class="dtog" aria-expanded="false">⚙ Giao diện</button>
      <button aria-pressed="true" data-brand="crm">Tông HubSpot</button><button aria-pressed="false" data-brand="">HarnexAI gốc</button>
      <button aria-pressed="false" data-dark>Tối</button><button data-reset title="Xoá thay đổi đã lưu trong trình duyệt">Dữ liệu mẫu</button>`;
    $('#demo').onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('dtog')) { $('#demo').classList.toggle('open'); return; }
      if (b.hasAttribute('data-dark')) { const on = document.documentElement.dataset.theme !== 'dark'; document.documentElement.dataset.theme = on ? 'dark' : 'light'; b.setAttribute('aria-pressed', on); return; }
      if (b.hasAttribute('data-reset')) { api.reset(); return; }
      $('#demo').querySelectorAll('[data-brand]').forEach(x => x.setAttribute('aria-pressed', x === b));
      if (b.dataset.brand) document.documentElement.dataset.brand = b.dataset.brand; else delete document.documentElement.dataset.brand;
    };
  }
  function palette() {
    modal(`<div class="modal pal" role="dialog" aria-label="Tìm kiếm hoặc gõ lệnh"><input placeholder="Tìm kiếm hoặc gõ lệnh…" id="palQ"><div class="list" id="palL"></div></div>`, (bg, close) => {
      const items = [['HÀNH ĐỘNG NHANH', [['add_circle','Tạo quy trình mới (Workflow)','Workflow'],['add_circle','Tạo biểu mẫu mới (Form)','Forms'],['task_alt','Xem danh sách công việc','Tasks']]],
        ['QUY TRÌNH & WORKFLOW', WORKFLOWS.map(w => ['account_tree', w, ''])],
        ['DỮ LIỆU', [['table_chart', COLLECTION.name, 'Collection']]]];
      const draw = q => { $('#palL', bg).innerHTML = items.map(([g, arr]) => { const a = arr.filter(x => !q || x[1].toLowerCase().includes(q)); return a.length ? `<div class="grp">${g}</div>` + a.map(([i, t, s]) => `<button class="it" data-close><span class="ms sm">${i}</span>${esc(t)}<small>${s}</small></button>`).join('') : ''; }).join(''); };
      draw(''); const q = $('#palQ', bg); q.focus(); q.oninput = () => draw(q.value.trim().toLowerCase());
      q.onkeydown = e => { if (e.key === 'Escape') close(); };
    });
  }

  /* ── Panel xem nhanh (RecordDetailDrawer): Thông tin · Lịch sử · Liên kết ── */
  let panelRecord = null, onChange = () => {};
  function openPanel(id) {
    const r = api.get(id); if (!r) return; panelRecord = id;
    const p = $('#panel');
    p.innerHTML = `<div class="pn-h"><h2>${esc(title(r))}</h2>
        <a class="btn btn--text sm" href="#" data-cols title="Quản lý cột dữ liệu"><span class="ms xs">settings</span>Cột</a>
        <a class="btn btn--text sm" href="crm-deal-chi-tiet-hubspot.html?id=${r.id}">Mở trang đầy đủ<span class="ms xs">arrow_forward</span></a>
        <button class="btn btn--text btn--icon" data-pclose aria-label="Đóng"><span class="ms">close</span></button></div>
      <div class="pn-tabs" role="tablist"><button class="pn-tab" role="tab" aria-selected="true" data-t="info">Thông tin</button><button class="pn-tab" role="tab" aria-selected="false" data-t="hist">Lịch sử</button><button class="pn-tab" role="tab" aria-selected="false" data-t="link">Liên kết</button></div>
      <div class="pn-b" id="pnBody"></div>`;
    const body = $('#pnBody', p);
    const tab = t => {
      p.querySelectorAll('.pn-tab').forEach(b => b.setAttribute('aria-selected', b.dataset.t === t));
      if (t === 'info') { body.innerHTML = '<div class="props" id="pnProps"></div>'; propList($('#pnProps', p), r, 'panel'); }
      else body.innerHTML = `<div class="soon"><span class="ms">${t === 'hist' ? 'history' : 'link'}</span>${t === 'hist' ? 'Lịch sử thay đổi (sắp ra mắt)' : 'Liên kết (sắp ra mắt)'}</div>`;
    };
    p.onclick = e => { const t = e.target.closest('.pn-tab'); if (t) tab(t.dataset.t); if (e.target.closest('[data-pclose]')) closePanel(); if (e.target.closest('[data-cols]')) { e.preventDefault(); toast('Mở trang quản lý cột (Fields) của collection'); } };
    tab('info'); p.classList.add('open'); document.body.classList.add('panel-open');
  }
  function closePanel() { $('#panel')?.classList.remove('open'); document.body.classList.remove('panel-open'); panelRecord = null; }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panelRecord && !document.activeElement.classList.contains('ed')) closePanel(); });

  /* Danh sách thuộc tính: bấm để sửa (giống drawer / trang đầy đủ ERP) */
  function propList(box, r, where, keys) {
    const list = keys ? keys.map(k => F[k]) : FIELDS;
    box.innerHTML = list.map(f => `<div class="prop" data-k="${f.key}"><label>${esc(f.name)}</label><div class="v">${display(r.values[f.key], f)}</div></div>`).join('');
    box.onclick = e => {
      const pr = e.target.closest('.prop'); if (!pr || pr.querySelector('.ed')) return;
      const f = F[pr.dataset.k], v = pr.querySelector('.v');
      v.replaceChildren(editor(f, r.values[f.key], nv => {
        if (nv !== r.values[f.key]) { api.update(r.id, f.key, nv); toast(`Đã lưu “${f.name}”`); onChange(); }
        propList(box, r, where, keys);
      }, () => propList(box, r, where, keys), where));
    };
  }

  /* ── Panel tạo bản ghi (RecordCreateModal → panel phải kiểu HubSpot) ── */
  function openCreate(onCreated) {
    const p = $('#panel'); panelRecord = 'new';
    p.innerHTML = `<div class="pn-h"><h2>Tạo bản ghi mới</h2><button class="btn btn--text btn--icon" data-pclose aria-label="Đóng"><span class="ms">close</span></button></div>
      <form class="pn-b field-form" id="crForm">${FIELDS.map(f => {
        const id = 'cf_' + f.key;
        let input;
        if (f.type === 'SELECT') input = `<select class="in" id="${id}"><option value="">— Chọn —</option>${f.choices.map(c => `<option>${esc(c)}</option>`).join('')}</select>`;
        else if (f.type === 'RELATION') input = `<select class="in" id="${id}"><option value="">— Chọn —</option>${RELATED.map(x => `<option value="${x.id}">${esc(x.label)}</option>`).join('')}</select>`;
        else if (f.type === 'LONG_TEXT') input = `<textarea class="in" id="${id}"></textarea>`;
        else input = `<input class="in" id="${id}" type="${f.type === 'NUMBER' ? 'number' : f.type === 'DATE' ? 'date' : f.type === 'DATETIME' ? 'datetime-local' : 'text'}">`;
        return `<label for="${id}">${esc(f.name)}${input}</label>`;
      }).join('')}</form>
      <div class="pn-f"><button class="btn btn--primary" id="crSave" title="Tạo bản ghi (Ctrl+Enter)">Tạo bản ghi</button><button class="btn btn--secondary" data-pclose>Huỷ</button><small style="margin-left:auto;align-self:center;color:var(--on-surface-variant)">Ctrl+Enter</small></div>`;
    const submit = () => {
      const values = {};
      FIELDS.forEach(f => { let v = $('#cf_' + f.key, p).value; if (v === '') v = null; else if (f.type === 'NUMBER') v = Number(v); else if (f.type === 'DATETIME') v = new Date(v).toISOString(); values[f.key] = v; });
      const r = api.create(values); closePanel(); toast('Đã tạo bản ghi'); onCreated && onCreated(r);
    };
    p.onclick = e => { if (e.target.closest('[data-pclose]')) closePanel(); if (e.target.closest('#crSave')) submit(); };
    p.onkeydown = e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); submit(); } };
    p.classList.add('open'); document.body.classList.add('panel-open'); setTimeout(() => $('#cf_m_deal', p).focus(), 50);
  }

  /* ── Hộp thoại đúng ERP ── */
  function importDialog() {
    modal(`<div class="modal" role="dialog" aria-modal="true"><div class="mh">Nhập dữ liệu (Import)<button class="btn btn--text btn--icon x" data-close aria-label="Đóng"><span class="ms">close</span></button></div>
      <div class="mb"><p style="color:var(--on-surface-variant)">Tải lên tệp Excel (.xlsx) hoặc CSV để cập nhật danh sách</p>
      <label class="drop"><span class="ms">upload_file</span><b>Kéo thả tệp vào đây hoặc chọn từ máy tính</b><small>Hỗ trợ định dạng .xlsx, .csv</small><input type="file" accept=".xlsx,.csv" hidden id="impFile"></label><div id="impName" class="nil"></div></div>
      <div class="mf"><button class="btn btn--secondary" data-close>Hủy bỏ</button><button class="btn btn--primary" id="impGo" disabled>Bắt đầu nhập</button></div></div>`,
      (bg, close) => { $('#impFile', bg).onchange = e => { const f = e.target.files[0]; $('#impName', bg).textContent = f ? f.name : ''; $('#impGo', bg).disabled = !f; };
        $('#impGo', bg).onclick = () => { close(); toast('Mockup: tệp sẽ được nhập vào Deals_Pipeline'); }; });
  }
  function sheetDialog() {
    modal(`<div class="modal" role="dialog" aria-modal="true"><div class="mh">Kết nối Google Sheet<button class="btn btn--text btn--icon x" data-close aria-label="Đóng"><span class="ms">close</span></button></div>
      <div class="mb" id="gsB"><p style="color:var(--on-surface-variant)">Kết nối bảng tính Google Sheet để tự động đồng bộ dữ liệu</p>
      <div class="acct"><span class="avatar">G</span><div>Tài khoản Google đã kết nối<br><small class="nil">email của workspace</small></div></div></div>
      <div class="mf" id="gsF"><button class="btn btn--primary" id="gsNext">Tiếp tục</button></div></div>`,
      (bg, close) => { $('#gsNext', bg).onclick = () => { $('#gsB', bg).innerHTML = '<p><b>Chọn Google Sheet</b></p><button class="btn btn--secondary" id="gsDrive"><span class="ms sm">add_to_drive</span>Chọn từ Google Drive</button>';
        $('#gsF', bg).innerHTML = '<button class="btn btn--secondary" data-close>Đóng</button>'; $('#gsDrive', bg).onclick = () => { close(); toast('Mockup: mở trình chọn tệp Google Drive'); }; }; });
  }
  function workflowDialog(r) {
    modal(`<div class="modal" role="dialog" aria-modal="true"><div class="mh">Kích hoạt Workflow</div>
      <div class="mb"><select class="ed" id="wfSel" style="height:36px"><option value="">— Chọn workflow —</option>${WORKFLOWS.map(w => `<option>${esc(w)}</option>`).join('')}</select></div>
      <div class="mf"><button class="btn btn--secondary" data-close>Huỷ</button><button class="btn btn--primary" id="wfGo" disabled>Kích hoạt</button></div></div>`,
      (bg, close) => { const s = $('#wfSel', bg); s.onchange = () => $('#wfGo', bg).disabled = !s.value; $('#wfGo', bg).onclick = () => { close(); toast('Workflow đã được kích hoạt'); }; });
  }

  return { COLLECTION, FIELDS, F, STAGES, WORKFLOWS, api, esc, empty, fmt, display, chipCls, createdFmt, title, editor, toast, modal, confirmBox,
    shell, openPanel, closePanel, propList, openCreate, importDialog, sheetDialog, workflowDialog, $, set onChange(fn) { onChange = fn; } };
})();

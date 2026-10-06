/* ═══════════════════════════════════════════════════════════════
   HarnexAI CRM — Leads (06/10/2026)
   Mô hình như HubSpot: Lead là đối tượng riêng nhưng BẮT BUỘC gắn với một Contact hoặc một Company.
   Một Contact / Company có thể có nhiều Lead (mỗi cơ hội bán hàng một lead). Lead "Đạt" thì tạo Deal từ lead đó.
   Pipeline mặc định của HubSpot: New → Attempting → Connected → Qualified / Disqualified
     = Mới → Đang liên hệ → Đã kết nối → Đạt / Không đạt.
   Lưu ở localStorage "hx-crm-leads-v1". Cần nạp sau crm-shared.js và crm-objects.js.
     HXL            dữ liệu + hộp thoại dùng chung (tạo lead, tạo Deal từ lead, đánh dấu không đạt)
     HXLeadList()   trang danh sách  (crm-leads-hubspot.html)
     HXLeadRecord() trang chi tiết   (crm-lead-hubspot.html?id=…)
   ═══════════════════════════════════════════════════════════════ */
const HXL = (() => {
  const { esc, display, toast, modal, $, USERS } = HX;
  const ME = HXC.ME;

  /* ── Danh mục ── */
  const STAGES = ['Mới', 'Đang liên hệ', 'Đã kết nối', 'Đạt', 'Không đạt'];
  const QUAL = 'Đạt', DISQ = 'Không đạt';
  const OPEN = STAGES.filter(s => s !== QUAL && s !== DISQ);
  const STAGE_EN = { 'Mới':'New', 'Đang liên hệ':'Attempting', 'Đã kết nối':'Connected', 'Đạt':'Qualified', 'Không đạt':'Disqualified' };
  const LABELS = ['Nóng', 'Ấm', 'Lạnh'];
  const TYPES = ['Khách hàng mới', 'Bán thêm (upsell)', 'Liên hệ lại'];
  const REASONS = ['Không có ngân sách', 'Chưa đúng thời điểm', 'Không phù hợp nhu cầu', 'Không liên lạc được', 'Chọn đối thủ', 'Khác'];
  const CALL_OUT = ['Đã kết nối', 'Không nghe máy', 'Để lại tin nhắn', 'Sai số'];
  const FIELDS = [
    { key:'name', name:'Tên lead', type:'TEXT' },
    { key:'stage', name:'Giai đoạn lead', type:'SELECT', choices:STAGES },
    { key:'owner', name:'Lead owner', type:'USER' },
    { key:'label', name:'Nhãn lead', type:'SELECT', choices:LABELS },
    { key:'type', name:'Loại lead', type:'SELECT', choices:TYPES },
    { key:'source', name:'Nguồn', type:'SELECT', choices:HXC.SOURCES },
    { key:'code', name:'Mã lead', type:'TEXT' },
    { key:'reason', name:'Lý do không đạt', type:'SELECT', choices:REASONS },
  ];
  const F = k => FIELDS.find(f => f.key === k);
  const ACT = { NOTE:['sticky_note_2', 'Ghi chú'], CALL:['call', 'Cuộc gọi'], TASK:['task_alt', 'Task'], MEETING:['event', 'Cuộc họp'], SYSTEM:['sync', 'Hệ thống'] };

  /* ── Store ── */
  const KEY = 'hx-crm-leads-v1';
  const iso = (d, h = 9) => new Date(`${d}T${String(h).padStart(2, '0')}:00:00+07:00`).toISOString();
  const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const codeOf = (d, n) => { const x = new Date(d); return `LEAD${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, '0')}${String(x.getDate()).padStart(2, '0')}${String(n).padStart(3, '0')}`; };
  function seed() {
    // [id, tên, contact, company, deal, giai đoạn, owner, nhãn, loại, nguồn, ngày tạo, giờ, lý do, hoạt động[]]
    const S = [
      ['ld01', 'Titan Bases — Nguyễn Long', 'ct16', 'co14', null, 'Mới', ME, 'Nóng', TYPES[0], 'Sự kiện', '2026-09-26', 15, null,
        [['NOTE', '2026-09-26', 15, ME, 'Gặp ở sự kiện SaaS Việt, đang tìm ERP cho đội 8 người.']]],
      ['ld02', 'Kiều Anh Thư', 'ct17', null, null, 'Mới', null, 'Lạnh', TYPES[0], 'Website', '2026-09-27', 10, null, []],
      ['ld11', 'Logistics Tân Cảng Xanh — chi nhánh Đà Nẵng', null, 'co07', null, 'Mới', 'Minh Trần', 'Ấm', TYPES[1], 'Giới thiệu', '2026-09-25', 11, null, []],
      ['ld03', 'Tạ Hoàng Nam', 'ct18', null, null, 'Đang liên hệ', ME, 'Ấm', TYPES[0], 'Import', '2026-08-19', 15, null,
        [['CALL', '2026-08-28', 10, ME, 'Không liên lạc được.', { outcome:'Không nghe máy' }], ['CALL', '2026-09-24', 16, ME, 'Máy bận, sẽ gọi lại đầu tuần sau.', { outcome:'Không nghe máy' }]]],
      ['ld04', 'Mầm non Hoa Sen — cơ sở 2', 'ct07', 'co08', null, 'Đang liên hệ', 'Lan Lê', 'Ấm', TYPES[1], 'Giới thiệu', '2026-09-20', 9, null,
        [['CALL', '2026-09-22', 9, 'Lan Lê', 'Để lại lời nhắn cho hiệu trưởng.', { outcome:'Để lại tin nhắn' }]]],
      ['ld12', 'Dược phẩm Thiên Phúc — module nhân sự', 'ct02', 'co13', null, 'Đang liên hệ', 'Minh Trần', 'Nóng', TYPES[1], 'Giới thiệu', '2026-09-23', 14, null,
        [['TASK', '2026-09-29', 9, 'Minh Trần', 'Gửi tài liệu module nhân sự', { due:'2026-09-29' }]]],
      ['ld05', 'Du lịch Biển Xanh — thêm 5 user', 'ct03', 'co12', null, 'Đã kết nối', 'Lan Lê', 'Nóng', TYPES[1], 'Website', '2026-09-12', 11, null,
        [['CALL', '2026-09-21', 10, 'Lan Lê', 'Khách xác nhận cần thêm 5 user cho mùa cao điểm.', { outcome:'Đã kết nối' }]]],
      ['ld06', 'Cơ khí Đại Phong — module bảo trì', 'ct14', 'co02', null, 'Đã kết nối', 'Minh Trần', 'Ấm', TYPES[1], 'Giới thiệu', '2026-09-16', 10, null,
        [['MEETING', '2026-09-19', 14, 'Minh Trần', 'Khảo sát quy trình bảo trì tại xưởng.', { title:'Khảo sát xưởng' }]]],
      ['ld07', 'Nội thất Minh Phát', 'ct11', 'co05', 'r005', 'Đạt', ME, 'Nóng', TYPES[0], 'Sự kiện', '2026-08-22', 9, null,
        [['NOTE', '2026-08-22', 9, ME, 'MQL từ webinar tháng 8, quan tâm module kho.']]],
      ['ld08', 'Thực phẩm An Khang — ERP', 'ct12', 'co04', 'r004', 'Đạt', 'Minh Trần', 'Nóng', TYPES[0], 'Sự kiện', '2026-08-20', 9, null, []],
      ['ld09', 'Kế toán Sao Việt — thêm chi nhánh', 'ct13', 'co03', null, 'Không đạt', ME, 'Lạnh', TYPES[1], 'Website', '2026-09-08', 13, 'Chưa đúng thời điểm',
        [['CALL', '2026-09-10', 15, ME, 'Khách hoãn mở chi nhánh sang năm sau.', { outcome:'Đã kết nối' }]]],
      ['ld10', 'Spa Ngọc Trai — liên hệ lại', 'ct15', 'co01', null, 'Không đạt', 'Lan Lê', 'Lạnh', TYPES[2], 'Quảng cáo', '2026-09-15', 10, 'Chọn đối thủ', []],
    ];
    return { leads: S.map(([id, name, contact, company, deal, stage, owner, label, type, source, day, h, reason, acts], i) => {
      const d = deal ? HXC.get('deal', deal) : null;
      return { id, createdAt: iso(day, h), contact: contact && HXC.get('contact', contact) ? contact : null, company: company && HXC.get('company', company) ? company : null, deal: d ? deal : null,
        values:{ name, stage, owner, label, type, source, code: (d && d.values.lead_id) || codeOf(day, i + 1), reason },
        acts: acts.map(([t, ad, ah, by, body, x], j) => ({ id:`${id}a${j}`, type:t, at: iso(ad, ah), by, body, ...(x || {}) })) };
    }) };
  }
  const load = () => { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch { return null; } };
  let db = load() || seed();
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {} };

  /* ── Truy vấn ── */
  const list = () => db.leads;
  const get = id => db.leads.find(l => l.id === id);
  const url = id => `crm-lead-hubspot.html?id=${id}`;
  const LIST_URL = 'crm-leads-hubspot.html';
  const contactOf = l => l.contact ? HXC.get('contact', l.contact) : null;
  const companyOf = l => l.company ? HXC.get('company', l.company) : null;
  const dealOf = l => l.deal ? HXC.get('deal', l.deal) : null;
  const ofContact = id => db.leads.filter(l => l.contact === id);
  const ofCompany = id => db.leads.filter(l => l.company === id);
  const isOpen = l => OPEN.includes(l.values.stage);
  const lastAct = l => { const now = new Date(Math.max(Date.now(), +HXC.TODAY)).toISOString(); const a = l.acts.filter(x => x.type !== 'SYSTEM' && x.type !== 'TASK' && x.at <= now).sort((x, y) => y.at.localeCompare(x.at))[0]; return a ? a.at : null; };

  /* ── Ghi ── */
  const sys = (l, body) => l.acts.unshift({ id: uid('s'), type:'SYSTEM', at: new Date().toISOString(), by: ME, body });
  function update(id, key, value) {
    const l = get(id); if (!l) return; const old = l.values[key]; if (old === value) return;
    l.values[key] = value;
    if (key === 'stage') { sys(l, `Giai đoạn lead: ${old || '—'} → ${value || '—'}`); if (value !== DISQ) l.values.reason = null; }
    if (key === 'owner') sys(l, `Đổi owner: ${old || '—'} → ${value || '—'}`);
    persist();
  }
  function create(values, links) {
    const l = { id: uid('ld'), createdAt: new Date().toISOString(), contact: links.contact || null, company: links.company || null, deal: null,
      values:{ label:null, type:null, source:null, reason:null, ...values, code: codeOf(new Date(), db.leads.length + 1) }, acts:[] };
    db.leads.unshift(l); persist(); return l;
  }
  const remove = ids => { db.leads = db.leads.filter(l => !ids.includes(l.id)); persist(); };
  // Ghi hoạt động + tự chuyển giai đoạn như "lead pipeline automation" của HubSpot:
  // có hoạt động liên hệ đầu tiên → Đang liên hệ; cuộc gọi "Đã kết nối" hoặc cuộc họp → Đã kết nối.
  function addAct(id, a) {
    const l = get(id); l.acts.unshift({ id: uid('a'), at: new Date().toISOString(), by: ME, ...a }); let moved = null;
    const st = l.values.stage, connected = (a.type === 'CALL' && a.outcome === 'Đã kết nối') || a.type === 'MEETING';
    if (connected && (st === 'Mới' || st === 'Đang liên hệ')) moved = 'Đã kết nối';
    else if (a.type === 'CALL' && st === 'Mới') moved = 'Đang liên hệ';
    persist(); if (moved) update(id, 'stage', moved); return moved;
  }
  const toggleTask = (id, aid) => { const a = get(id).acts.find(x => x.id === aid); if (a) { a.done = !a.done; persist(); } };

  /* ── Hiển thị ── */
  const dShort = s => { const d = new Date(s); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const nil = '<span class="nil">--</span>';
  const contactLink = l => { const c = contactOf(l); return c ? `<span class="obj"><span class="av xs">${esc(HXC.initials(HXC.fullName(c)))}</span><a class="lk b" href="${HXC.url('contact', c.id)}">${esc(HXC.fullName(c))}</a></span>` : nil; };
  const companyLink = l => { const c = companyOf(l); return c ? `<span class="obj"><span class="av sq xs">${esc(HXC.initials(c.values.name))}</span><a class="lk b" href="${HXC.url('company', c.id)}">${esc(c.values.name)}</a></span>` : nil; };
  const dealLink = l => { const d = dealOf(l); return d ? `<a class="lk b" href="${HXC.url('deal', d.id)}">${esc(HX.title(d))}</a>` : nil; };
  // Thanh giai đoạn (StageBar): 3 bước mở + bước kết thúc. Bấm một bước để chuyển giai đoạn.
  function stageBar(l, compact) {
    const cur = l.values.stage, i = STAGES.indexOf(cur), closed = !isOpen(l);
    const steps = [...OPEN, closed ? cur : QUAL];
    return `<div class="sb ${compact ? 'sm' : ''}" role="group" aria-label="Giai đoạn lead">${steps.map((s, j) => { const done = closed ? j < 3 : j < i, on = s === cur;
      return `<button class="sb-s ${done ? 'done' : ''} ${on ? 'on' : ''} ${on && cur === DISQ ? 'bad' : ''}" data-stage="${esc(s)}" ${on ? 'aria-current="step"' : ''} title="${esc(s)} (${STAGE_EN[s]})">${done ? '<span class="ms xs">check</span>' : ''}<span class="t">${esc(s)}</span></button>`; }).join('')}</div>`;
  }

  /* ── Chuyển giai đoạn có quy tắc ── */
  function moveStage(id, stage, done = () => {}) {
    const l = get(id); if (!l || l.values.stage === stage) return done();
    if (stage === QUAL) return convertDialog(id, done);
    if (stage === DISQ) return disqualifyDialog(id, done);
    update(id, 'stage', stage); toast(`Giai đoạn lead: ${stage}`); done();
  }
  function disqualifyDialog(id, done = () => {}) {
    const l = get(id);
    modal(`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="dqT"><div class="mh" id="dqT">Đánh dấu lead không đạt<button class="btn btn--text btn--icon x" data-close aria-label="Đóng"><span class="ms">close</span></button></div>
      <div class="mb"><p>Lead <b>${esc(l.values.name)}</b> sẽ chuyển sang giai đoạn “Không đạt”. Lead vẫn được giữ lại để báo cáo và có thể mở lại sau.</p>
        <form class="field-form" id="dqF"><label>Lý do không đạt <span class="req">*</span><select class="in" id="dqR"><option value="">— Chọn lý do —</option>${REASONS.map(r => `<option>${esc(r)}</option>`).join('')}</select></label>
        <label>Ghi chú thêm<textarea class="in" id="dqN" placeholder="Không bắt buộc"></textarea></label><p class="err" id="dqE" role="alert"></p></form></div>
      <div class="mf"><button class="btn btn--secondary" data-close>Huỷ</button><button class="btn btn--primary" id="dqOk">Đánh dấu không đạt</button></div></div>`, (bg, close) => {
      $('#dqOk', bg).onclick = () => { const r = $('#dqR', bg).value; if (!r) { $('#dqE', bg).textContent = 'Chọn lý do không đạt'; $('#dqR', bg).focus(); return; }
        update(id, 'stage', DISQ); l.values.reason = r; const n = $('#dqN', bg).value.trim(); if (n) l.acts.unshift({ id: uid('a'), type:'NOTE', at: new Date().toISOString(), by: ME, body: n });
        persist(); close(); toast('Đã đánh dấu lead không đạt'); done(); }; });
  }
  // Lead "Đạt" → tạo Deal (gắn sẵn Contact, Company và Mã lead), hoặc chỉ đánh dấu đạt mà chưa tạo Deal.
  function convertDialog(id, done = () => {}) {
    const l = get(id), co = companyOf(l), ct = contactOf(l), S = HXC;
    if (l.deal && dealOf(l)) { update(id, 'stage', QUAL); toast('Lead đã đạt'); return done(); }
    modal(`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="cvT"><div class="mh" id="cvT">Lead đạt — tạo Deal<button class="btn btn--text btn--icon x" data-close aria-label="Đóng"><span class="ms">close</span></button></div>
      <div class="mb"><form class="field-form" id="cvF">
        <label>Tên Deal <span class="req">*</span><input class="in" id="cv_name" value="${esc(co ? co.values.name : l.values.name)}"></label>
        <label>Pipeline<select class="in" disabled><option>Deals_Pipeline</option></select></label>
        <label>Giai Đoạn Pipeline <span class="req">*</span><select class="in" id="cv_stage">${HX.STAGES.filter(s => ![S.WON, S.LOST].includes(s)).map(s => `<option>${esc(s)}</option>`).join('')}</select></label>
        <label>Tổng Cash-In Dự Kiến (Amount)<input class="in" id="cv_amt" type="number" min="0"></label>
        <label>Ngày Dự Kiến Chốt<input class="in" id="cv_close" type="date"></label>
        <label>Sale phụ trách<select class="in" id="cv_owner">${USERS.map(u => `<option ${u === (l.values.owner || ME) ? 'selected' : ''}>${esc(u)}</option>`).join('')}</select></label>
        <div class="assoc-sec"><b>Deal sẽ được liên kết với</b><div style="font-size:13px">Lead: <b>${esc(l.values.name)}</b> (${esc(l.values.code)})${ct ? `<br>Contact: <b>${esc(S.fullName(ct))}</b>` : ''}${co ? `<br>Company: <b>${esc(co.values.name)}</b>` : ''}</div></div>
        <p class="err" id="cvE" role="alert"></p></form></div>
      <div class="mf l"><button class="btn btn--primary" id="cvOk">Tạo Deal</button><button class="btn btn--secondary" data-close>Huỷ</button><button class="lk" id="cvSkip">Đạt, chưa tạo Deal</button></div></div>`, (bg, close) => {
      const qualify = () => { update(id, 'stage', QUAL); if (ct && S.LIFECYCLE.indexOf(ct.values.lifecycle) < S.LIFECYCLE.indexOf('Opportunity')) S.update('contact', ct.id, 'lifecycle', 'Opportunity'); };
      $('#cvSkip', bg).onclick = () => { qualify(); close(); toast('Lead đã đạt (chưa có Deal)'); done(); };
      $('#cvOk', bg).onclick = () => { const name = $('#cv_name', bg).value.trim(); if (!name) { $('#cvE', bg).textContent = 'Nhập tên Deal'; $('#cv_name', bg).focus(); return; }
        const values = {}; HX.FIELDS.forEach(f => values[f.key] = null);
        Object.assign(values, { m_deal:'DEAL-' + String(S.list('deal').length + 1).padStart(4, '0'), t_n_deal: name, [S.STAGE]: $('#cv_stage', bg).value, [S.CASH]: $('#cv_amt', bg).value ? Number($('#cv_amt', bg).value) : null,
          [S.CLOSE]: $('#cv_close', bg).value || null, [S.SALE]: $('#cv_owner', bg).value, t_l_th_nh_c_ng: 10, ng_y_c_p_nh_t_g_n_nh_t: new Date().toISOString() });
        if ('lead_id' in values) values.lead_id = l.values.code;
        const d = HX.api.create(values);
        if (co) S.associate('deal', d.id, 'company', co.id); if (ct) S.associate('deal', d.id, 'contact', ct.id, 'Người quyết định');
        l.deal = d.id; qualify(); sys(l, `Đã tạo Deal “${HX.title(d)} — ${name}” từ lead này`); persist(); close(); toast(`Đã tạo Deal ${HX.title(d)} từ lead`); done(d); }; });
  }

  /* ── Panel tạo lead (HubSpot "Create lead": lead phải có liên kết chính) ── */
  function createPanel(opts = {}) {
    const p = $('#panel'), S = HXC, contacts = S.list('contact'), companies = S.list('company');
    const sel = (id, arr, cur, none = '— Chọn —') => `<select class="in" id="${id}"><option value="">${none}</option>${arr.map(c => `<option ${c === cur ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>`;
    p.innerHTML = `<div class="pn-h"><h2>Tạo Lead</h2><button class="btn btn--text btn--icon" data-pclose aria-label="Đóng"><span class="ms">close</span></button></div>
      <form class="pn-b field-form" id="lf">
        <div class="assoc-sec" style="margin-top:0"><b>Liên kết Lead với <span class="req">*</span></b><small>Lead phải gắn với một Contact hoặc một Company. Chọn Contact thì Company chính của contact được điền sẵn.</small>
          <label>Contact<select class="in" id="lf_contact"><option value="">— Không —</option>${contacts.map(c => `<option value="${c.id}" ${c.id === opts.contact ? 'selected' : ''}>${esc(S.fullName(c))}${c.values.email ? ' · ' + esc(c.values.email) : ''}</option>`).join('')}</select></label>
          <label>Company<select class="in" id="lf_company"><option value="">— Không —</option>${companies.map(c => `<option value="${c.id}" ${c.id === opts.company ? 'selected' : ''}>${esc(c.values.name)}</option>`).join('')}</select></label></div>
        <label for="lf_name">Tên lead <span class="req">*</span><input class="in" id="lf_name" placeholder="Tự điền theo contact / công ty"></label>
        <label>Pipeline<select class="in" disabled><option>Lead pipeline</option></select></label>
        <label>Giai đoạn lead <span class="req">*</span>${sel('lf_stage', OPEN, 'Mới')}</label>
        <label>Lead owner<select class="in" id="lf_owner"><option value="">— Chưa có owner —</option>${USERS.map(u => `<option ${u === ME ? 'selected' : ''}>${esc(u)}</option>`).join('')}</select></label>
        <label>Nhãn lead${sel('lf_label', LABELS)}</label>
        <label>Loại lead${sel('lf_type', TYPES, TYPES[0])}</label>
        <label>Nguồn${sel('lf_source', S.SOURCES)}</label>
        <p class="err" id="lfErr" role="alert"></p></form>
      <div class="pn-f"><button class="btn btn--primary" id="lfSave">Tạo</button><button class="btn btn--secondary" id="lfMore">Tạo và thêm tiếp</button><button class="btn btn--text" data-pclose>Huỷ</button></div>`;
    let touched = false;
    const auto = () => { const ct = S.get('contact', $('#lf_contact', p).value), co = S.get('company', $('#lf_company', p).value);
      if (!touched) $('#lf_name', p).value = [co && co.values.name, ct && S.fullName(ct)].filter(Boolean).join(' — '); };
    $('#lf_contact', p).onchange = e => { const ct = S.get('contact', e.target.value); if (ct && ct.company) $('#lf_company', p).value = ct.company; auto(); };
    $('#lf_company', p).onchange = auto; $('#lf_name', p).oninput = () => { touched = true; }; auto();
    const submit = more => { const v = k => $('#lf_' + k, p).value.trim() || null;
      if (!v('contact') && !v('company')) { $('#lfErr', p).textContent = 'Chọn Contact hoặc Company để liên kết với lead'; $('#lf_contact', p).focus(); return; }
      if (!v('name')) { $('#lfErr', p).textContent = 'Nhập tên lead'; $('#lf_name', p).focus(); return; }
      const l = create({ name: v('name'), stage: v('stage') || 'Mới', owner: v('owner'), label: v('label'), type: v('type'), source: v('source') }, { contact: v('contact'), company: v('company') });
      toast(`Đã tạo lead “${l.values.name}”`); opts.onCreated && opts.onCreated(l); if (more) createPanel(opts); else HX.closePanel(); };
    p.onclick = e => { if (e.target.closest('[data-pclose]')) HX.closePanel(); if (e.target.closest('#lfSave')) submit(false); if (e.target.closest('#lfMore')) submit(true); };
    p.onkeydown = e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); submit(false); } };
    document.body.classList.remove('dock'); p.classList.add('open'); document.body.classList.add('panel-open'); setTimeout(() => $('#lf_contact', p).focus(), 60);
  }

  /* ── Thuộc tính sửa tại chỗ ── */
  function props(box, l, keys, onChange = () => {}) {
    const fs = keys.map(F).filter(f => f && (f.key !== 'reason' || l.values.stage === DISQ));
    box.innerHTML = fs.map(f => `<div class="prop ${f.key === 'code' ? 'ro' : ''}" data-k="${f.key}"><label>${esc(f.name)}</label><div class="v">${f.key === 'owner' && !l.values.owner ? '<span class="nil">Chưa có owner</span>' : display(l.values[f.key], f)}</div></div>`).join('');
    box.onclick = e => { const pr = e.target.closest('.prop'); if (!pr || pr.classList.contains('ro') || pr.querySelector('.ed,.selcell')) return;
      const f = F(pr.dataset.k), v = pr.querySelector('.v'), back = () => props(box, l, keys, onChange);
      v.replaceChildren(HX.editor(f, l.values[f.key], nv => { if (nv === l.values[f.key]) return back();
        if (f.key === 'stage') return moveStage(l.id, nv, () => { back(); onChange(); });
        update(l.id, f.key, nv); toast(`Đã lưu “${f.name}”`); back(); onChange(); }, back, 'page')); };
  }

  return { STAGES, OPEN, QUAL, DISQ, STAGE_EN, LABELS, TYPES, REASONS, CALL_OUT, FIELDS, F, ACT, LIST_URL, list, get, url, contactOf, companyOf, dealOf, ofContact, ofCompany, isOpen, lastAct,
    update, create, remove, addAct, toggleTask, moveStage, convertDialog, disqualifyDialog, createPanel, props, stageBar, contactLink, companyLink, dealLink, dShort, nil,
    reset() { try { localStorage.removeItem(KEY); } catch {} db = seed(); } };
})();

/* ═══ Trang danh sách Leads — cùng khung với Contacts / Companies (T1) ═══ */
function HXLeadList() {
  const { esc, display, toast, confirmBox, $ } = HX; const L = HXL, ME = HXC.ME, NOW = HXC.TODAY;
  HX.shell('leads'); document.title = 'Leads — HarnexAI CRM (mockup)';
  const VF = { _contact:{ key:'_contact', name:'Contact', type:'TEXT' }, _company:{ key:'_company', name:'Company', type:'TEXT' }, _deal:{ key:'_deal', name:'Deal', type:'TEXT' },
    _lastact:{ key:'_lastact', name:'Ngày hoạt động gần nhất', type:'DATE' }, _created:{ key:'_created', name:'Ngày tạo', type:'DATE' } };
  const F = k => VF[k] || L.F(k);
  const VIEWS = [['open', 'Lead đang mở'], ['mine', 'Lead của tôi'], ['un', 'Lead chưa có owner'], ['all', 'Tất cả leads']];
  const QUICK = ['owner', 'stage', 'label', '_created'], QUICK_MORE = ['type', 'source', 'reason', '_lastact'];
  const COLS = ['stage', '_contact', '_company', 'owner', 'label', '_lastact', '_created'], COLS_MORE = ['type', 'source', 'code', '_deal', 'reason'];
  const DATE_P = [['today', 'Hôm nay'], ['week', 'Tuần này'], ['month', 'Tháng này'], ['d7', '7 ngày qua'], ['d30', '30 ngày qua'], ['d90', '90 ngày qua'], ['year', 'Năm nay']];
  const st = { view:'open', q:'', f:{}, sort:{ key:'_created', dir:'desc' }, sel:new Set(), mode:'TABLE', quick:[...QUICK], cols:[...COLS], fcollapsed:false };

  const val = (l, k) => k === '_created' ? l.createdAt : k === '_lastact' ? L.lastAct(l) : k === '_contact' ? (c => c ? HXC.fullName(c) : null)(L.contactOf(l))
    : k === '_company' ? (c => c ? c.values.name : null)(L.companyOf(l)) : k === '_deal' ? (d => d ? HX.title(d) : null)(L.dealOf(l)) : k === 'stage' ? L.STAGES.indexOf(l.values.stage) : l.values[k];
  const dRange = p => { const d0 = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate()), day = 864e5, wd = (d0.getDay() + 6) % 7;
    return { today:[+d0, +d0 + day], week:[+d0 - wd * day, +d0 + day], month:[+new Date(d0.getFullYear(), d0.getMonth(), 1), +d0 + day], d7:[+d0 - 6 * day, +d0 + day], d30:[+d0 - 29 * day, +d0 + day], d90:[+d0 - 89 * day, +d0 + day], year:[+new Date(d0.getFullYear(), 0, 1), +d0 + day] }[p]; };
  const isDate = k => k === '_created' || k === '_lastact';
  function rows() {
    let l = L.list().slice();
    if (st.view === 'open') l = l.filter(L.isOpen);
    if (st.view === 'mine') l = l.filter(x => x.values.owner === ME);
    if (st.view === 'un') l = l.filter(x => !x.values.owner);
    Object.entries(st.f).forEach(([k, v]) => { if (!v || (Array.isArray(v) && !v.length)) return;
      if (isDate(k)) { const R = dRange(v); l = l.filter(x => { const t = val(x, k); return t && +new Date(t) >= R[0] && +new Date(t) < R[1]; }); }
      else l = l.filter(x => v.some(o => o === '__none' ? !x.values[k] : x.values[k] === o)); });
    if (st.q) l = l.filter(x => [x.values.name, x.values.code, val(x, '_contact'), val(x, '_company'), (L.contactOf(x) || { values:{} }).values.email].some(s => String(s || '').toLowerCase().includes(st.q)));
    const d = st.sort.dir === 'asc' ? 1 : -1, k = st.sort.key;
    return l.sort((a, b) => { const x = val(a, k), y = val(b, k); if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
      return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'vi')) * d; });
  }
  function cell(l, k) {
    if (isDate(k)) { const v = val(l, k); return v ? L.dShort(v) : L.nil; }
    if (k === '_contact') return L.contactLink(l); if (k === '_company') return L.companyLink(l); if (k === '_deal') return L.dealLink(l);
    if (k === 'owner') return l.values.owner ? `<span class="obj"><span class="av xs">${esc(HXC.initials(l.values.owner))}</span>${esc(l.values.owner)}</span>` : '<span class="nil">Chưa có owner</span>';
    const v = l.values[k]; return v == null || v === '' ? L.nil : display(v, F(k));
  }

  /* ── Vẽ ── */
  function drawTabs() {
    const n = k => k === 'open' ? L.list().filter(L.isOpen).length : k === 'mine' ? L.list().filter(x => x.values.owner === ME).length : k === 'un' ? L.list().filter(x => !x.values.owner).length : L.list().length;
    $('#vtabs').innerHTML = VIEWS.map(([k, l]) => `<button class="vtab" role="tab" aria-selected="${st.view === k}" data-view="${k}"><span class="ms sm">${st.mode === 'BOARD' ? 'view_kanban' : 'table_rows'}</span>${l}<span class="vn">${n(k)}</span></button>`).join('')
      + `<button class="btn btn--text btn--icon" data-toast="Tạo view mới: đặt tên, chọn kiểu Bảng/Board (như màn Deals)" aria-label="Tạo view"><span class="ms sm">add</span></button>`;
  }
  const on = k => st.f[k] && (!Array.isArray(st.f[k]) || st.f[k].length);
  function qLabel(k) { const f = F(k), v = st.f[k]; if (!on(k)) return esc(f.name);
    if (isDate(k)) return `${esc(f.name)}: <b>${DATE_P.find(p => p[0] === v)[1]}</b>`;
    return `${esc(f.name)}: <b>${esc(v.map(o => o === '__none' ? 'Chưa có' : o === ME ? 'Tôi' : o).join(', '))}</b>`; }
  function drawQuick() {
    $('#qf').innerHTML = st.quick.map(k => `<button class="qf ${on(k) ? 'on' : ''}" data-qf="${k}">${qLabel(k)}<span class="ms xs">arrow_drop_down</span></button>`).join('')
      + `<span class="qsep"></span><button class="btn btn--text btn--icon qa" data-qadd title="Thêm bộ lọc nhanh" aria-label="Thêm bộ lọc nhanh"><span class="ms sm">add_circle</span></button>`
      + (Object.keys(st.f).some(on) ? `<button class="fclear" id="qfClear">Xoá tất cả</button>` : '');
  }
  function drawTable(list) {
    const s = k => st.sort.key === k ? `<span class="ms xs srt">${st.sort.dir === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>` : '';
    $('#body').innerHTML = `<div class="tw"><table class="lt"><thead><tr><th class="cb"><input type="checkbox" id="all" aria-label="Chọn tất cả" ${list.length && list.every(r => st.sel.has(r.id)) ? 'checked' : ''}></th>
      <th data-sort="name" class="nmcol">Tên lead${s('name')}</th>${st.cols.map(k => `<th data-sort="${k}">${esc(F(k).name)}${s(k)}</th>`).join('')}
      <th class="addc"><button class="btn btn--text btn--icon" id="colAdd" title="Thêm cột" aria-label="Thêm cột"><span class="ms sm">add</span></button></th></tr></thead>
      <tbody>${list.length ? list.map(l => `<tr class="${st.sel.has(l.id) ? 'sel' : ''}"><td class="cb"><input type="checkbox" data-sel="${l.id}" ${st.sel.has(l.id) ? 'checked' : ''} aria-label="Chọn"></td>
        <td class="nmcol"><span class="pri"><span class="av sm lead"><span class="ms xs">filter_alt</span></span><a href="${L.url(l.id)}">${esc(l.values.name)}</a><button class="pvb" data-pv="${l.id}" title="Xem trước" aria-label="Xem trước"><span class="ms xs">vertical_split</span></button></span></td>
        ${st.cols.map(k => `<td>${cell(l, k)}</td>`).join('')}<td></td></tr>`).join('')
        : `<tr><td colspan="${st.cols.length + 3}" class="empty"><span class="ms">search_off</span><b>Không có lead phù hợp</b><br>${st.q ? `Không tìm thấy kết quả cho “${esc(st.q)}”. ` : ''}${st.view === 'open' ? 'Thử xem view “Tất cả leads” hoặc bỏ bớt bộ lọc.' : 'Thử bỏ bớt bộ lọc.'}</td></tr>`}</tbody></table></div>`;
  }
  function drawBoard(list) {
    const f = F('stage');
    $('#body').innerHTML = `<div class="kb">${L.STAGES.map(c => { const items = list.filter(l => l.values.stage === c);
      return `<section class="kcol"><div class="kh">${display(c, f)}<span class="n">${items.length}</span></div><div class="kcards" data-drop="${esc(c)}">${items.map(l => { const ct = L.contactOf(l), co = L.companyOf(l);
        return `<article class="kc" draggable="true" data-card="${l.id}"><a class="tt" href="${L.url(l.id)}">${esc(l.values.name)}</a>
        ${ct ? `<span class="ln"><span class="ms">person</span><span class="t">${esc(HXC.fullName(ct))}</span></span>` : ''}${co ? `<span class="ln"><span class="ms">domain</span><span class="t">${esc(co.values.name)}</span></span>` : ''}
        <span class="ln"><span class="ms">account_circle</span><span class="t">${esc(l.values.owner || 'Chưa có owner')}</span></span>
        ${l.values.stage === L.DISQ && l.values.reason ? `<span class="ln"><span class="ms">block</span><span class="t">${esc(l.values.reason)}</span></span>` : ''}
        <div class="kf">${l.values.label ? display(l.values.label, F('label')) : ''}<button class="qi" data-pv="${l.id}" title="Xem trước" aria-label="Xem trước" style="margin-left:auto"><span class="ms sm">vertical_split</span></button></div></article>`; }).join('') || '<div class="kempty">Không có lead</div>'}</div></section>`; }).join('')}</div>`;
  }
  function draw() {
    drawTabs(); drawQuick();
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === st.mode));
    document.body.classList.toggle('fcollapsed', st.fcollapsed); $('#filterBtn').setAttribute('aria-pressed', !st.fcollapsed); $('#colIc').textContent = st.fcollapsed ? 'expand_more' : 'expand_less';
    const list = rows(); st.mode === 'BOARD' ? drawBoard(list) : drawTable(list);
    $('#count').textContent = `${L.list().length} bản ghi`; $('#footCount').textContent = `${list.length} leads`;
    $('#bulk').classList.toggle('on', st.sel.size > 0); $('#bulkN').textContent = `Đã chọn ${st.sel.size} lead`;
  }

  /* ── Popover ── */
  const closePops = except => document.querySelectorAll('.pop.open').forEach(p => p !== except && p.classList.remove('open'));
  function openPop(anchor, html, w = 280) {
    const p = $('#pop'), r = anchor.getBoundingClientRect(), fr = document.querySelector('.frame').getBoundingClientRect();
    p.style.width = w + 'px'; p.style.left = Math.max(8, Math.min(r.left - fr.left, fr.width - w - 8)) + 'px'; p.style.top = (r.bottom - fr.top + 4) + 'px';
    p.innerHTML = html; p.onchange = null; closePops(p); p.classList.add('open'); return p;
  }
  function quickPop(btn, k) {
    const f = F(k);
    if (isDate(k)) { const p = openPop(btn, `<div class="qp"><div class="qp-l">${DATE_P.map(([v, l]) => `<button class="qp-d ${st.f[k] === v ? 'cur' : ''}" data-qpd="${v}"><b>${l}</b></button>`).join('')}</div>${st.f[k] ? '<button class="fclear" data-qpclr style="margin:6px 8px">Bỏ bộ lọc này</button>' : ''}</div>`, 220);
      p.onclick = e => { e.stopPropagation(); const d = e.target.closest('[data-qpd]'); if (d) { st.f[k] = d.dataset.qpd; p.classList.remove('open'); draw(); } if (e.target.closest('[data-qpclr]')) { delete st.f[k]; p.classList.remove('open'); draw(); } }; return; }
    const cur = new Set(st.f[k] || []);
    const opts = f.type === 'USER' ? [['__none', 'Chưa có owner'], [ME, 'Tôi (' + ME + ')'], ...HX.USERS.filter(u => u !== ME).map(u => [u, u])] : [['__none', 'Không có giá trị'], ...f.choices.map(o => [o, o])];
    const p = openPop(btn, `<div class="qp"><label class="srch2"><input id="qpQ" placeholder="Tìm"><span class="ms sm">search</span></label><div class="qp-l" id="qpL"></div>
      <div class="qp-f"><button class="fclear" data-qpclr>Bỏ chọn</button><button class="btn btn--primary sm" data-qpok>Áp dụng</button></div></div>`, 280);
    const drawL = q => { $('#qpL', p).innerHTML = opts.filter(o => !q || o[1].toLowerCase().includes(q)).map(([v, l]) => `<label class="mi"><input type="checkbox" value="${esc(v)}" ${cur.has(v) ? 'checked' : ''}>${esc(l)}</label>`).join(''); };
    drawL(''); $('#qpQ', p).oninput = e => drawL(e.target.value.trim().toLowerCase()); $('#qpQ', p).focus();
    p.onchange = e => { if (e.target.type === 'checkbox') e.target.checked ? cur.add(e.target.value) : cur.delete(e.target.value); };
    p.onclick = e => { e.stopPropagation(); if (e.target.closest('[data-qpok]')) { st.f[k] = [...cur]; p.classList.remove('open'); draw(); } if (e.target.closest('[data-qpclr]')) { delete st.f[k]; p.classList.remove('open'); draw(); } };
  }
  /* ── Xem trước (panel dock) ── */
  function preview(id) {
    const l = L.get(id), p = $('#panel'); if (!l) return;
    const acts = l.acts.slice().sort((a, b) => b.at.localeCompare(a.at)).slice(0, 3);
    p.innerHTML = `<div class="pn-h"><span class="av lead"><span class="ms sm">filter_alt</span></span><h2>${esc(l.values.name)}</h2><button class="btn btn--text btn--icon" data-pclose aria-label="Đóng"><span class="ms">close</span></button></div>
      <div class="pn-b"><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px"><a class="btn btn--secondary sm" href="${L.url(id)}">Xem bản ghi<span class="ms xs">arrow_forward</span></a>
        ${L.isOpen(l) ? `<button class="btn btn--primary sm" data-go="${esc(L.QUAL)}"><span class="ms xs">check</span>Đạt</button><button class="btn btn--secondary sm" data-go="${esc(L.DISQ)}">Không đạt</button>` : `<button class="btn btn--secondary sm" data-go="Mới"><span class="ms xs">undo</span>Mở lại lead</button>`}</div>
        ${L.stageBar(l, true)}
        <h3 class="pvh">Thông tin lead</h3><div class="props" id="pvProps"></div>
        <h3 class="pvh">Liên kết</h3><div class="pva"><div><b>Contact</b>${L.contactLink(l)}</div><div><b>Company</b>${L.companyLink(l)}</div><div><b>Deal</b>${L.dealLink(l)}</div></div>
        <h3 class="pvh">Hoạt động gần đây</h3><div class="pva">${acts.length ? acts.map(a => `<div><b><span class="ms xs" style="vertical-align:-3px">${L.ACT[a.type][0]}</span> ${L.ACT[a.type][1]} · ${L.dShort(a.at)}</b><span>${esc(a.title || a.body || '')}</span></div>`).join('') : '<span class="nil">Chưa có hoạt động</span>'}</div></div>`;
    const re = () => { draw(); if (L.get(id)) preview(id); };
    L.props($('#pvProps', p), l, ['stage', 'owner', 'label', 'type', 'source', 'reason', 'code'], re);
    p.onkeydown = null; p.onclick = e => { if (e.target.closest('[data-pclose]')) HX.closePanel(); const g = e.target.closest('[data-go],[data-stage]'); if (g) L.moveStage(id, g.dataset.go || g.dataset.stage, re); };
    p.classList.add('open'); document.body.classList.add('panel-open', 'dock');
  }

  /* ── Sự kiện ── */
  $('#objPop').innerHTML = `<div class="hd">Đối tượng</div>` + [['Contacts', HXC.OBJ.contact.list], ['Companies', HXC.OBJ.company.list], ['Leads', L.LIST_URL], ['Deals', HXC.OBJ.deal.list]]
    .map(([n, h]) => `<a class="mi" href="${h}" ${n === 'Leads' ? 'style="font-weight:700"' : ''}><span class="ms sm" style="${n === 'Leads' ? '' : 'visibility:hidden'}">check</span>${n}</a>`).join('');
  $('#vtabs').onclick = e => { const v = e.target.closest('[data-view]'); if (v) { st.view = v.dataset.view; st.sel.clear(); draw(); } };
  $('#q').oninput = e => { st.q = e.target.value.trim().toLowerCase(); draw(); };
  $('#qf').addEventListener('click', e => {
    const q = e.target.closest('[data-qf]'); if (q) { e.stopPropagation(); quickPop(q, q.dataset.qf); return; }
    if (e.target.closest('[data-qadd]')) { e.stopPropagation(); const more = [...QUICK, ...QUICK_MORE].filter(k => !st.quick.includes(k));
      const p = openPop(e.target.closest('[data-qadd]'), `<div class="hd">Thêm bộ lọc nhanh</div>${more.map(k => `<button class="mi" data-qnew="${k}">${esc(F(k).name)}</button>`).join('') || '<div class="nil" style="padding:8px">Đã thêm tất cả</div>'}`, 240);
      p.onclick = ev => { ev.stopPropagation(); const n = ev.target.closest('[data-qnew]'); if (n) { st.quick.push(n.dataset.qnew); p.classList.remove('open'); draw(); } }; return; }
    if (e.target.closest('#qfClear')) { st.f = {}; draw(); }
  });
  $('#sortBtn').onclick = e => { e.stopPropagation(); const fields = [L.F('name'), ...[...COLS, ...COLS_MORE].map(F)];
    const p = openPop($('#sortBtn'), `<div class="pop-form"><label>Sắp xếp theo<select id="sKey">${fields.map(f => `<option value="${f.key}" ${f.key === st.sort.key ? 'selected' : ''}>${esc(f.name)}</option>`).join('')}</select></label>
      <label>Thứ tự<select id="sDir"><option value="asc" ${st.sort.dir === 'asc' ? 'selected' : ''}>Tăng dần (A → Z, cũ → mới)</option><option value="desc" ${st.sort.dir === 'desc' ? 'selected' : ''}>Giảm dần (Z → A, mới → cũ)</option></select></label>
      <div class="row"><button class="btn btn--primary sm" id="sOk">Áp dụng</button></div></div>`, 280);
    p.onclick = ev => { ev.stopPropagation(); if (ev.target.closest('#sOk')) { st.sort = { key:$('#sKey', p).value, dir:$('#sDir', p).value }; p.classList.remove('open'); draw(); } }; };
  $('#filterBtn').onclick = $('#colBtn2').onclick = () => { st.fcollapsed = !st.fcollapsed; draw(); };
  document.querySelector('.seg').onclick = e => { const b = e.target.closest('[data-mode]'); if (b) { st.mode = b.dataset.mode; if (st.mode === 'BOARD' && st.view === 'open') st.view = 'all'; draw(); } };
  $('#body').addEventListener('click', e => {
    const pv = e.target.closest('[data-pv]'); if (pv) { e.preventDefault(); preview(pv.dataset.pv); return; }
    if (e.target.closest('a[href]')) return;
    if (e.target.closest('#colAdd')) { e.stopPropagation(); const more = [...COLS, ...COLS_MORE].filter(k => !st.cols.includes(k));
      const p = openPop(e.target.closest('#colAdd'), `<div class="hd">Thêm cột</div>${more.map(k => `<button class="mi" data-cadd="${k}">${esc(F(k).name)}</button>`).join('') || '<div class="nil" style="padding:8px">Đã hiện tất cả</div>'}`, 240);
      p.onclick = ev => { ev.stopPropagation(); const a = ev.target.closest('[data-cadd]'); if (a) { st.cols.push(a.dataset.cadd); p.classList.remove('open'); draw(); } }; return; }
    const th = e.target.closest('th[data-sort]'); if (th) { const k = th.dataset.sort; st.sort = st.sort.key === k ? { key:k, dir: st.sort.dir === 'asc' ? 'desc' : 'asc' } : { key:k, dir:'asc' }; draw(); }
  });
  $('#body').addEventListener('change', e => {
    if (e.target.id === 'all') { rows().forEach(r => e.target.checked ? st.sel.add(r.id) : st.sel.delete(r.id)); draw(); }
    else if (e.target.dataset.sel) { e.target.checked ? st.sel.add(e.target.dataset.sel) : st.sel.delete(e.target.dataset.sel); draw(); }
  });
  // Board: kéo thẻ sang cột khác = đổi giai đoạn. Thả vào "Đạt" mở hộp tạo Deal; thả vào "Không đạt" hỏi lý do.
  const B = $('#body');
  B.addEventListener('dragstart', e => { const c = e.target.closest('[data-card]'); if (c) { c.classList.add('dragging'); e.dataTransfer.setData('text/plain', c.dataset.card); } });
  B.addEventListener('dragend', e => e.target.closest('[data-card]')?.classList.remove('dragging'));
  B.addEventListener('dragover', e => { const z = e.target.closest('[data-drop]'); if (z) { e.preventDefault(); z.classList.add('drop'); } });
  B.addEventListener('dragleave', e => e.target.closest('[data-drop]')?.classList.remove('drop'));
  B.addEventListener('drop', e => { const z = e.target.closest('[data-drop]'); if (!z) return; e.preventDefault(); z.classList.remove('drop'); L.moveStage(e.dataTransfer.getData('text/plain'), z.dataset.drop, draw); });

  $('#addBtn').onclick = () => { closePops(); L.createPanel({ onCreated: draw }); };
  $('#objBtn').onclick = e => { e.stopPropagation(); closePops(); $('#objPop').classList.toggle('open'); };
  $('#moreBtn').onclick = e => { e.stopPropagation(); closePops(); $('#morePop').classList.toggle('open'); };
  document.addEventListener('click', e => { const t = e.target.closest('[data-toast]'); if (t) { toast(t.dataset.toast); closePops(); return; }
    if (e.target.closest('[data-imp]')) { closePops(); HX.importDialog(); return; } if (!e.target.closest('.pop')) closePops(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePops(); if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); } });
  $('#exportBtn').onclick = () => toast(`Mockup: xuất ${rows().length} leads ra tệp .xlsx`);
  $('#refresh').onclick = () => { draw(); toast('Đã làm mới'); };
  $('#resetBtn').onclick = () => { Object.assign(st, { f:{}, q:'', sort:{ key:'_created', dir:'desc' }, quick:[...QUICK], cols:[...COLS] }); $('#q').value = ''; draw(); toast('Đã khôi phục view mặc định'); };
  $('#bulkCancel').onclick = () => { st.sel.clear(); draw(); };
  $('#bulkOwner').onclick = e => { e.stopPropagation(); const p = openPop($('#bulkOwner'), `<div class="hd">Gán owner cho ${st.sel.size} lead</div>${HX.USERS.map(u => `<button class="mi" data-bo="${esc(u)}">${esc(u)}</button>`).join('')}`, 240);
    p.onclick = ev => { ev.stopPropagation(); const b = ev.target.closest('[data-bo]'); if (b) { [...st.sel].forEach(id => L.update(id, 'owner', b.dataset.bo)); p.classList.remove('open'); toast(`Đã gán ${b.dataset.bo} cho ${st.sel.size} lead`); st.sel.clear(); draw(); } }; };
  $('#bulkStage').onclick = e => { e.stopPropagation(); const p = openPop($('#bulkStage'), `<div class="hd">Chuyển ${st.sel.size} lead sang</div>${L.OPEN.map(s => `<button class="mi" data-bs="${esc(s)}">${esc(s)}</button>`).join('')}<div class="sep"></div><div class="nil" style="padding:6px 10px;font-size:12px">“Đạt” và “Không đạt” cần xử lý từng lead (tạo Deal / chọn lý do).</div>`, 260);
    p.onclick = ev => { ev.stopPropagation(); const b = ev.target.closest('[data-bs]'); if (b) { [...st.sel].forEach(id => L.update(id, 'stage', b.dataset.bs)); p.classList.remove('open'); toast(`Đã chuyển ${st.sel.size} lead sang “${b.dataset.bs}”`); st.sel.clear(); draw(); } }; };
  $('#bulkDel').onclick = () => confirmBox('Xoá lead', `Xoá ${st.sel.size} lead đã chọn? Contact, Company và Deal liên kết không bị xoá. Không thể hoàn tác.`, 'Xoá', () => { const n = st.sel.size; L.remove([...st.sel]); st.sel.clear(); draw(); toast(`Đã xoá ${n} lead`); });
  draw();
}

/* ═══ Trang chi tiết Lead — khung record 3 cột (T2) + thanh giai đoạn ═══ */
function HXLeadRecord() {
  const { esc, display, toast, confirmBox, modal, $ } = HX; const L = HXL, S = HXC;
  HX.shell('leads');
  const id = new URLSearchParams(location.search).get('id') || (L.list()[0] || {}).id; const l = L.get(id);
  if (!l) { $('#grid').innerHTML = `<div class="card" style="grid-column:1/-1;padding:32px;text-align:center"><span class="ms" style="font-size:36px">search_off</span><p><b>Không tìm thấy lead</b></p><a class="btn btn--secondary" href="${L.LIST_URL}">Về danh sách Leads</a></div>`; return; }
  let tab = 'ALL';
  const KEYS = ['stage', 'owner', 'label', 'type', 'source', 'reason', 'code'];

  function drawLeft() {
    const ct = L.contactOf(l);
    $('#idCard').innerHTML = `<div class="top"><a class="back" href="${L.LIST_URL}"><span class="ms sm">chevron_left</span>Leads</a>
        <button class="btn btn--text sm" id="actBtn">Thao tác<span class="ms xs">arrow_drop_down</span></button></div>
      <div class="idt"><span class="ic sq"><span class="ms">filter_alt</span></span><div><h1 id="nm">${esc(l.values.name)}</h1><button class="ren" id="ren" title="Đổi tên" aria-label="Đổi tên"><span class="ms xs">edit</span></button></div></div>
      <div class="sub"><div class="kv"><span>Mã lead:</span><b>${esc(l.values.code)}</b></div>${ct && ct.values.email ? `<div class="kv"><span>Email:</span><a href="mailto:${esc(ct.values.email)}">${esc(ct.values.email)}</a></div>` : ''}${ct && ct.values.phone ? `<div class="kv"><span>Điện thoại:</span><b>${esc(ct.values.phone)}</b></div>` : ''}</div>
      <div class="qa">${[['NOTE', 'edit_note', 'Ghi chú'], ['CALL', 'call', 'Gọi'], ['TASK', 'task_alt', 'Task'], ['MEETING', 'event', 'Họp']].map(([t, i, n]) => `<button data-compose="${t}"><span class="o"><span class="ms sm">${i}</span></span>${n}</button>`).join('')}</div>`;
    L.props($('#props'), l, KEYS, drawAll);
    $('#meta').innerHTML = `<div class="props" style="padding:0 14px 12px"><div class="prop ro"><label>Ngày tạo</label><div class="v">${L.dShort(l.createdAt)}</div></div><div class="prop ro"><label>Hoạt động gần nhất</label><div class="v">${(v => v ? L.dShort(v) : L.nil)(L.lastAct(l))}</div></div></div>`;
  }
  function drawStage() {
    const open = L.isOpen(l), d = L.dealOf(l), st = l.values.stage;
    $('#stageCard').innerHTML = `<div class="ch"><span>Lead pipeline</span><span class="r">${open ? `<button class="btn btn--primary sm" data-go="${esc(L.QUAL)}"><span class="ms xs">check</span>Đạt — tạo Deal</button><button class="btn btn--secondary sm" data-go="${esc(L.DISQ)}">Không đạt</button>`
        : `<button class="btn btn--secondary sm" data-go="Mới"><span class="ms xs">undo</span>Mở lại lead</button>`}</span></div>
      <div class="cb">${L.stageBar(l)}
        ${st === L.QUAL ? `<p class="sb-note ok"><span class="ms sm">check_circle</span>${d ? `Lead đã đạt và chuyển thành Deal <a class="lk b" href="${S.url('deal', d.id)}">${esc(HX.title(d))}</a>.` : `Lead đã đạt nhưng chưa có Deal. <button class="lk b" data-go="${esc(L.QUAL)}" id="mkDeal">Tạo Deal</button>`}</p>` : ''}
        ${st === L.DISQ ? `<p class="sb-note bad"><span class="ms sm">block</span>Không đạt${l.values.reason ? ` — lý do: <b>${esc(l.values.reason)}</b>` : ''}.</p>` : ''}
        ${open ? `<p class="sb-note"><span class="ms sm">info</span>Giai đoạn tự chuyển khi ghi hoạt động: có cuộc gọi đầu tiên → “Đang liên hệ”; cuộc gọi “Đã kết nối” hoặc cuộc họp → “Đã kết nối”.</p>` : ''}</div>`;
  }
  function drawTimeline() {
    const ct = L.contactOf(l);
    // Hoạt động của lead + hoạt động của Contact liên kết (HubSpot đồng bộ hoạt động giữa lead và contact)
    const fromCt = ct ? S.activitiesOf('contact', ct.id).filter(a => a.type !== 'SYSTEM').map(a => ({ ...a, _ct:true })) : [];
    const all = [...l.acts, ...fromCt, { id:'created', type:'SYSTEM', at: l.createdAt, by: l.values.owner || S.ME, body:`Lead này được tạo${l.values.source ? ` từ nguồn “${l.values.source}”` : ''}` }].sort((a, b) => b.at.localeCompare(a.at));
    const TABS = [['ALL', 'Tất cả'], ['NOTE', 'Ghi chú'], ['CALL', 'Cuộc gọi'], ['TASK', 'Task'], ['MEETING', 'Cuộc họp']];
    const shown = all.filter(a => tab === 'ALL' || a.type === tab);
    $('#tabs').innerHTML = TABS.map(([k, n]) => `<button class="tab" role="tab" aria-selected="${tab === k}" data-tab="${k}">${n}${k === 'ALL' ? '' : ` <span class="nil">${all.filter(a => a.type === k).length}</span>`}</button>`).join('');
    $('#tl').innerHTML = shown.length ? `<div class="ltl">${shown.map(a => { const sysA = a.type === 'SYSTEM';
      return `<article class="ta ${sysA ? 'sys' : ''}"><div class="ta-h" style="cursor:default"><span class="ms sm ic">${L.ACT[a.type][0]}</span>
        ${a.type === 'TASK' && !a._ct ? `<input type="checkbox" data-task="${a.id}" ${a.done ? 'checked' : ''} aria-label="Hoàn thành task" style="accent-color:var(--primary)">` : ''}
        <b>${sysA ? esc(a.title || 'Hệ thống') : `${L.ACT[a.type][1]}${a.title ? ' · ' + esc(a.title) : ''}`}</b><span class="nil">${esc(a.by || '')}</span>${a._ct ? '<span class="tag">Từ contact</span>' : ''}<time>${L.dShort(a.at)}</time></div>
        <div class="ta-b">${a.outcome || a.due ? `<div class="tm">${a.outcome ? `<span>Kết quả: <b>${esc(a.outcome)}</b></span>` : ''}${a.due ? `<span>Hạn: <b>${esc(a.due.split('-').reverse().join('/'))}</b></span>` : ''}</div>` : ''}${a.body ? `<div class="ta-x ${a.done ? 'strike' : ''}">${esc(a.body)}</div>` : ''}</div></article>`; }).join('')}</div>`
      : `<div class="ac-empty"><span class="ms">forum</span>Chưa có hoạt động loại này.</div>`;
  }
  function drawRight() {
    const ct = L.contactOf(l), co = L.companyOf(l), d = L.dealOf(l);
    const others = [...(ct ? L.ofContact(ct.id) : []), ...(co ? L.ofCompany(co.id) : [])].filter((x, i, a) => x.id !== l.id && a.findIndex(y => y.id === x.id) === i);
    const card = (title, n, body, empty) => `<section class="card"><div class="ch"><span>${title} (${n})</span></div><div class="cb">${n ? body : `<div class="ac-empty"><span class="ms">link_off</span>${empty}</div>`}</div></section>`;
    $('#right').innerHTML =
      card('Contact', ct ? 1 : 0, ct ? `<div class="ac-it"><div class="ac-top"><span class="av sm">${esc(S.initials(S.fullName(ct)))}</span><a class="ac-name" href="${S.url('contact', ct.id)}">${esc(S.fullName(ct))}</a><span class="tag pk">Primary</span></div>
        <div class="ac-ln">${esc(ct.values.jobtitle || '')}</div><div class="ac-ln"><span>Email:</span> ${esc(ct.values.email || '--')}</div><div class="ac-ln"><span>Điện thoại:</span> ${esc(ct.values.phone || '--')}</div><div class="ac-ln"><span>Lifecycle:</span> ${esc(ct.values.lifecycle || '--')}</div></div>` : '', 'Lead này gắn với Company, chưa có Contact.')
      + card('Company', co ? 1 : 0, co ? `<div class="ac-it"><div class="ac-top"><span class="av sm sq">${esc(S.initials(co.values.name))}</span><a class="ac-name" href="${S.url('company', co.id)}">${esc(co.values.name)}</a></div>
        <div class="ac-ln"><span>Domain:</span> ${esc(co.values.domain || '--')}</div><div class="ac-ln"><span>Ngành:</span> ${esc(co.values.industry || '--')}</div><div class="ac-ln"><span>Thành phố:</span> ${esc(co.values.city || '--')}</div></div>` : '', 'Contact của lead này chưa thuộc công ty nào.')
      + card('Deal', d ? 1 : 0, d ? `<div class="ac-it"><div class="ac-top"><span class="av sm sq"><span class="ms xs">handshake</span></span><a class="ac-name" href="${S.url('deal', d.id)}">${esc(HX.title(d))}</a></div>
        <div class="ac-ln">${esc(d.values.t_n_deal || '')}</div><div class="ac-ln"><span>Giai đoạn:</span> ${HX.F[S.STAGE] ? display(d.values[S.STAGE], HX.F[S.STAGE]) : '--'}</div><div class="ac-ln"><span>Amount:</span> ${HX.F[S.CASH] ? esc(HX.fmt(d.values[S.CASH], HX.F[S.CASH]) || '--') : '--'}</div></div>` : '', 'Deal được tạo khi lead chuyển sang “Đạt”.')
      + card('Lead khác cùng contact / công ty', others.length, others.map(x => `<div class="ac-it"><div class="ac-top"><a class="ac-name" href="${L.url(x.id)}">${esc(x.values.name)}</a></div><div class="ac-ln">${display(x.values.stage, L.F('stage'))} <span>· ${L.dShort(x.createdAt)}</span></div></div>`).join(''), 'Không có lead nào khác.');
  }
  function drawAll() { document.title = `${l.values.name} — Lead — HarnexAI CRM (mockup)`; drawLeft(); drawStage(); drawTimeline(); drawRight(); }

  /* ── Soạn hoạt động ── */
  function compose(type) {
    const [, name] = L.ACT[type];
    modal(`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="cmT"><div class="mh" id="cmT">${type === 'CALL' ? 'Ghi nhận cuộc gọi' : type === 'MEETING' ? 'Ghi nhận cuộc họp' : 'Thêm ' + name.toLowerCase()}<button class="btn btn--text btn--icon x" data-close aria-label="Đóng"><span class="ms">close</span></button></div>
      <div class="mb"><form class="field-form" id="cmF">
        ${type === 'TASK' || type === 'MEETING' ? `<label>Tiêu đề <span class="req">*</span><input class="in" id="cm_title"></label>` : ''}
        ${type === 'CALL' ? `<label>Kết quả cuộc gọi<select class="in" id="cm_out">${L.CALL_OUT.map(o => `<option>${esc(o)}</option>`).join('')}</select></label>` : ''}
        ${type === 'TASK' ? `<label>Hạn<input class="in" id="cm_due" type="date"></label>` : ''}
        <label>${type === 'NOTE' ? 'Nội dung <span class="req">*</span>' : 'Ghi chú'}<textarea class="in" id="cm_body"></textarea></label><p class="err" id="cmE" role="alert"></p></form></div>
      <div class="mf"><button class="btn btn--secondary" data-close>Huỷ</button><button class="btn btn--primary" id="cmOk">Lưu</button></div></div>`, (bg, close) => {
      setTimeout(() => $('#cmF .in', bg).focus(), 40);
      $('#cmOk', bg).onclick = () => { const g = k => { const el = $('#cm_' + k, bg); return el ? el.value.trim() : ''; };
        if ((type === 'TASK' || type === 'MEETING') && !g('title')) { $('#cmE', bg).textContent = 'Nhập tiêu đề'; return; }
        if (type === 'NOTE' && !g('body')) { $('#cmE', bg).textContent = 'Nhập nội dung ghi chú'; return; }
        const moved = L.addAct(l.id, { type, body: g('body'), ...(g('title') ? { title: g('title') } : {}), ...(type === 'CALL' ? { outcome: g('out') } : {}), ...(g('due') ? { due: g('due') } : {}) });
        close(); toast(moved ? `Đã lưu ${name.toLowerCase()} · lead tự chuyển sang “${moved}”` : `Đã lưu ${name.toLowerCase()}`); drawAll(); }; });
  }

  /* ── Sự kiện ── */
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-compose]'); if (c) return compose(c.dataset.compose);
    const g = e.target.closest('[data-go],[data-stage]'); if (g && !e.target.closest('#panel')) return L.moveStage(l.id, g.dataset.go || g.dataset.stage, drawAll);
    const t = e.target.closest('[data-tab]'); if (t) { tab = t.dataset.tab; return drawTimeline(); }
    if (e.target.closest('#ren')) { const h = $('#nm'); const inp = document.createElement('input'); inp.className = 'ed'; inp.value = l.values.name; inp.style.cssText = 'height:34px;font-size:18px;font-weight:700;width:100%';
      const done = ok => { const v = inp.value.trim(); if (ok && v && v !== l.values.name) { L.update(l.id, 'name', v); toast('Đã đổi tên lead'); } drawAll(); };
      inp.onkeydown = ev => { if (ev.key === 'Enter') done(true); if (ev.key === 'Escape') done(false); }; inp.onblur = () => done(true); h.replaceWith(inp); inp.focus(); inp.select(); return; }
    if (e.target.closest('#actBtn')) { e.stopPropagation(); const p = $('#fpop'), r = e.target.closest('#actBtn').getBoundingClientRect();
      p.innerHTML = `<button class="mi" data-newlead><span class="ms sm">add</span>Tạo lead khác cho contact này</button><button class="mi" data-dellead><span class="ms sm">delete</span>Xoá lead</button>`;
      p.style.cssText = `position:fixed;top:${r.bottom + 4}px;left:${Math.max(8, r.right - 260)}px;width:260px`; p.classList.add('open'); return; }
    if (e.target.closest('[data-newlead]')) { $('#fpop').classList.remove('open'); return L.createPanel({ contact: l.contact, company: l.company, onCreated: n => { location.href = L.url(n.id); } }); }
    if (e.target.closest('[data-dellead]')) { $('#fpop').classList.remove('open'); return confirmBox('Xoá lead', `Xoá lead “${esc(l.values.name)}”? Contact, Company và Deal liên kết không bị xoá. Không thể hoàn tác.`, 'Xoá', () => { L.remove([l.id]); location.href = L.LIST_URL; }); }
    if (!e.target.closest('.pop')) $('#fpop').classList.remove('open');
  });
  document.addEventListener('change', e => { if (e.target.dataset.task) { L.toggleTask(l.id, e.target.dataset.task); drawTimeline(); } });
  drawAll();
}

/* ═══ Danh sách Contacts / Companies — clone UX trang danh sách HubSpot (khảo sát portal 247428660, 29/09/2026) ═══
   Header "Contacts ⌄" · ⋮ · Add contacts ▾ | view tabs + "+" | Search · Filter · Sort by · Board/Table · ⚙ · ⌃
   Bộ lọc nhanh dạng popover (owner, ngày tạo, ngày hoạt động gần nhất, lead status) + ⊕ thêm bộ lọc nhanh + Advanced filters
   Bảng: tên có avatar, mũi tên mở "đối tượng liên kết" ngay trong dòng, nút Xem trước; "+" thêm cột; footer đếm · làm mới · Export · reset view.
   Gọi HXList('contact' | 'company'). */
function HXList(T) {
  const { esc, display, toast, confirmBox, $ } = HX;
  const O = HXC.OBJ[T], ME = HXC.ME, NOW = HXC.TODAY;
  HX.shell(T === 'contact' ? 'contacts' : 'companies');
  document.title = `${O.plural} — HarnexAI CRM (mockup)`;
  const F = k => VF[k] || O.fields.find(f => f.key === k);
  // Trường ảo (tính từ liên kết / hoạt động)
  const VF = {
    _created:{ key:'_created', name:'Ngày tạo', type:'DATE' }, _lastact:{ key:'_lastact', name:'Ngày hoạt động gần nhất', type:'DATE' },
    _company:{ key:'_company', name:'Công ty chính', type:'TEXT' }, _contacts:{ key:'_contacts', name:'Số contact', type:'NUMBER' }, _deals:{ key:'_deals', name:'Số deal', type:'NUMBER' },
    _name:{ key:'_name', name: T === 'contact' ? 'Tên' : 'Tên công ty', type:'TEXT' },
  };
  const CFG = T === 'contact' ? {
    views:[['all','Tất cả contacts'],['mine','Contacts của tôi'],['un','Contacts chưa có owner']],
    quick:['owner','_created','_lastact','leadstatus'], quickMore:['lifecycle','source','city','jobtitle'],
    cols:['email','phone','owner','_company','_lastact','leadstatus','_created'], colsMore:['jobtitle','lifecycle','source','city','_deals'],
    expand:[['company','Companies'],['deal','Deals']], board:'lifecycle',
  } : {
    views:[['all','Tất cả companies'],['mine','Companies của tôi']],
    quick:['owner','_created','_lastact','leadstatus'], quickMore:['industry','lifecycle','city','country'],
    cols:['owner','_created','phone','_lastact','city','country','industry'], colsMore:['domain','lifecycle','leadstatus','employees','_contacts','_deals'],
    expand:[['contact','Contacts'],['deal','Deals']], board:'lifecycle',
  };
  // Phần 7: trường tự tạo (vùng "Trường bổ sung") dùng được làm cột & bộ lọc nhanh
  O.fields.filter(f => f.custom).forEach(f => { if (!CFG.colsMore.includes(f.key)) CFG.colsMore.push(f.key); if (!['LONG_TEXT','URL'].includes(f.type) && !CFG.quickMore.includes(f.key)) CFG.quickMore.push(f.key); });
  const DATE_P = [['today','Hôm nay','Cả ngày hôm nay'],['yesterday','Hôm qua','24 giờ của ngày trước'],['week','Tuần này','Từ thứ Hai tuần này'],['lastweek','Tuần trước','Thứ Hai – Chủ nhật tuần trước'],
    ['month','Tháng này','Từ ngày 1 tháng này'],['lastmonth','Tháng trước','Cả tháng trước'],['d7','7 ngày qua','7 ngày gần nhất'],['d30','30 ngày qua','30 ngày gần nhất'],['d90','90 ngày qua','90 ngày gần nhất'],['quarter','Quý này','Từ đầu quý'],['year','Năm nay','Từ ngày 1/1']];
  const st = { view:'all', q:'', f:{}, adv:[], sort:{ key:'_created', dir:'desc' }, sel:new Set(), mode:'BOARD', quick:[...CFG.quick], cols:[...CFG.cols], exp:{}, fcollapsed:false, compact:false };

  /* ── Giá trị ── */
  const lastAct = r => { const a = HXC.activitiesOf(T, r.id).find(x => x.type !== 'SYSTEM' && x.at <= NOW.toISOString()); return a ? a.at : null; };
  const val = (r, k) => k === '_created' ? r.createdAt : k === '_lastact' ? lastAct(r) : k === '_name' ? HXC.titleOf(T, r)
    : k === '_company' ? ((HXC.assoc.companyOfContact(r.id) || { values:{} }).values.name || null)
    : k === '_contacts' ? HXC.assoc.contactsOfCompany(r.id).length : k === '_deals' ? HXC.related(T, r.id, 'deal').length : r.values[k];
  const dRange = p => { const d0 = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate()), day = 864e5, wd = (d0.getDay() + 6) % 7;
    return { today:[d0, +d0 + day], yesterday:[+d0 - day, d0], week:[+d0 - wd * day, +d0 + day], lastweek:[+d0 - (wd + 7) * day, +d0 - wd * day], month:[new Date(d0.getFullYear(), d0.getMonth(), 1), +d0 + day],
      lastmonth:[new Date(d0.getFullYear(), d0.getMonth() - 1, 1), new Date(d0.getFullYear(), d0.getMonth(), 1)], d7:[+d0 - 6 * day, +d0 + day], d30:[+d0 - 29 * day, +d0 + day], d90:[+d0 - 89 * day, +d0 + day],
      quarter:[new Date(d0.getFullYear(), Math.floor(d0.getMonth() / 3) * 3, 1), +d0 + day], year:[new Date(d0.getFullYear(), 0, 1), +d0 + day] }[p]; };
  const OPS = { TEXT:[['contains','Chứa'],['eq','Bằng'],['neq','Khác'],['is_empty','Trống'],['is_not_empty','Không trống']], NUMBER:[['eq','Bằng'],['gt','Lớn hơn'],['lt','Nhỏ hơn'],['is_empty','Trống'],['is_not_empty','Không trống']],
    SELECT:[['eq','Bằng'],['neq','Khác'],['is_empty','Trống'],['is_not_empty','Không trống']], DATE:[['in','Trong khoảng'],['is_empty','Trống'],['is_not_empty','Không trống']] };
  const opsOf = f => OPS[f.type === 'USER' ? 'SELECT' : f.type] || OPS.TEXT;
  const optsOf = f => f.type === 'USER' ? HX.USERS : f.choices || [];
  function passAdv(r, c) { const f = F(c.key), v = val(r, c.key);
    if (c.op === 'is_empty') return v == null || v === ''; if (c.op === 'is_not_empty') return !(v == null || v === '');
    if (c.op === 'in') { const R = dRange(c.value); return v && new Date(v) >= new Date(R[0]) && new Date(v) < new Date(R[1]); }
    if (c.op === 'contains') return String(v || '').toLowerCase().includes(String(c.value).toLowerCase());
    if (c.op === 'gt') return Number(v) > Number(c.value); if (c.op === 'lt') return Number(v) < Number(c.value);
    const eq = String(v ?? '') === String(c.value); return c.op === 'neq' ? !eq : eq; void f; }
  function rows() {
    let l = HXC.list(T).slice();
    if (st.view === 'mine') l = l.filter(r => r.values.owner === ME);
    if (st.view === 'un') l = l.filter(r => !r.values.owner);
    Object.entries(st.f).forEach(([k, v]) => { if (!v || (Array.isArray(v) && !v.length)) return;
      if (k === '_created' || k === '_lastact') { const R = dRange(v); l = l.filter(r => { const x = val(r, k); return x && new Date(x) >= new Date(R[0]) && new Date(x) < new Date(R[1]); }); }
      else l = l.filter(r => v.some(o => o === '__none' ? !r.values[k] : r.values[k] === o)); });
    st.adv.forEach(c => { l = l.filter(r => passAdv(r, c)); });
    if (st.q) l = l.filter(r => [HXC.titleOf(T, r), r.values.email, r.values.domain, r.values.phone, r.values.jobtitle].some(x => String(x || '').toLowerCase().includes(st.q)));
    const d = st.sort.dir === 'asc' ? 1 : -1, k = st.sort.key;
    return l.sort((a, b) => { const x = val(a, k), y = val(b, k);
      if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
      return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'vi')) * d; });
  }

  /* ── Ô bảng ── */
  const dtShort = iso => { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  function cell(r, k) {
    if (k === '_created' || k === '_lastact') { const v = val(r, k); return v ? dtShort(v) : '<span class="nil">--</span>'; }
    if (k === '_company') { const co = HXC.assoc.companyOfContact(r.id); return co ? `<span class="obj"><span class="av sq xs">${esc(HXC.initials(co.values.name))}</span><a class="lk b" href="${HXC.url('company', co.id)}">${esc(co.values.name)}</a></span>` : '<span class="nil">--</span>'; }
    if (k === '_contacts' || k === '_deals') return String(val(r, k));
    if (k === 'email') return r.values.email ? `<a class="lk" href="mailto:${esc(r.values.email)}">${esc(r.values.email)}</a><span class="ms xs ext">open_in_new</span>` : '<span class="nil">--</span>';
    if (k === 'domain') return r.values.domain ? `<a class="lk" href="https://${esc(r.values.domain)}" target="_blank" rel="noopener">${esc(r.values.domain)}</a><span class="ms xs ext">open_in_new</span>` : '<span class="nil">--</span>';
    if (k === 'owner') return r.values.owner ? `<span class="obj"><span class="av xs">${esc(HXC.initials(r.values.owner))}</span>${esc(r.values.owner)}</span>` : '<span class="nil">Chưa có owner</span>';
    const f = F(k); const v = r.values[k];
    return v == null || v === '' ? '<span class="nil">--</span>' : display(v, f);
  }
  const colName = k => F(k).name;

  /* ── Vẽ ── */
  function drawTabs() {
    $('#vtabs').innerHTML = CFG.views.map(([k, l]) => `<button class="vtab" role="tab" aria-selected="${st.view === k}" data-view="${k}"><span class="ms sm">${st.mode === 'BOARD' ? 'view_kanban' : 'table_rows'}</span>${l}</button>`).join('')
      + `<button class="btn btn--text btn--icon" data-toast="Tạo view mới: đặt tên, chọn kiểu Bảng/Board (như màn Deals)" aria-label="Tạo view"><span class="ms sm">add</span></button>`;
  }
  function qLabel(k) { const f = F(k), v = st.f[k];
    if (!v || (Array.isArray(v) && !v.length)) return esc(f.name);
    if (k === '_created' || k === '_lastact') return `${esc(f.name)}: <b>${DATE_P.find(p => p[0] === v)[1]}</b>`;
    return `${esc(f.name)}: <b>${esc(v.map(o => o === '__none' ? 'Chưa có' : o === ME ? 'Tôi' : o).join(', '))}</b>`; }
  function drawQuick() {
    const on = k => st.f[k] && (!Array.isArray(st.f[k]) || st.f[k].length);
    $('#qf').innerHTML = st.quick.map(k => `<button class="qf ${on(k) ? 'on' : ''}" data-qf="${k}">${qLabel(k)}<span class="ms xs">arrow_drop_down</span></button>`).join('')
      + `<span class="qsep"></span><button class="btn btn--text btn--icon qa" data-qadd title="Thêm bộ lọc nhanh" aria-label="Thêm bộ lọc nhanh"><span class="ms sm">add_circle</span></button>`
      + `<button class="btn btn--text btn--icon qa" data-qedit title="Chỉnh bộ lọc nhanh" aria-label="Chỉnh bộ lọc nhanh"><span class="ms sm">edit</span></button>`
      + `<button class="qf" data-adv><span class="ms xs">filter_list</span>Bộ lọc nâng cao${st.adv.length ? ` (${st.adv.length})` : ''}</button>`
      + (Object.keys(st.f).some(on) || st.adv.length ? `<button class="fclear" id="qfClear">Xoá tất cả</button>` : '');
  }
  function expandRow(r) {
    const t = st.exp[r.id]; const [ot, ol] = CFG.expand.find(x => x[0] === t);
    const rel = HXC.related(T, r.id, ot);
    const cols = ot === 'company' ? [['Tên công ty', x => `<a class="lk b" href="${HXC.url('company', x.id)}">${esc(x.values.name)}</a>`], ['Domain', x => esc(x.values.domain || '--')], ['Số điện thoại', x => esc(x.values.phone || '--')]]
      : ot === 'contact' ? [['Tên', x => `<a class="lk b" href="${HXC.url('contact', x.id)}">${esc(HXC.fullName(x))}</a>`], ['Email', x => esc(x.values.email || '--')], ['Chức danh', x => esc(x.values.jobtitle || '--')]]
      : [['Tên Deal', x => `<a class="lk b" href="${HXC.url('deal', x.id)}">${esc(HX.title(x))}</a> <span class="nil">${esc(x.values.t_n_deal || '')}</span>`], ['Giai đoạn', x => HX.F[HXC.STAGE] ? display(x.values[HXC.STAGE], HX.F[HXC.STAGE]) : '--'], ['Amount', x => HX.F[HXC.CASH] ? esc(HX.fmt(x.values[HXC.CASH], HX.F[HXC.CASH]) || '--') : '--']];
    return `<tr class="xrow"><td colspan="${st.cols.length + 2}"><div class="xin"><div class="xh"><button class="qf" data-xswitch="${r.id}">${ol} liên kết (${rel.length})<span class="ms xs">arrow_drop_down</span></button>
      <a class="btn btn--text sm" href="${HXC.url(T, r.id)}">Mở ${O.label.toLowerCase()}<span class="ms xs">open_in_new</span></a></div>
      ${rel.length ? `<table class="xt"><thead><tr>${cols.map(c => `<th>${c[0]}</th>`).join('')}</tr></thead><tbody>${rel.map(x => `<tr>${cols.map(c => `<td>${c[1](x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`
        : `<div class="nil" style="padding:10px 4px">Chưa có ${ol.toLowerCase()} liên kết.</div>`}</div></td></tr>`;
  }
  function drawTable(list) {
    const s = k => st.sort.key === k ? `<span class="ms xs srt">${st.sort.dir === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>` : '';
    $('#body').innerHTML = `<div class="tw"><table class="lt"><thead><tr><th class="cb"><input type="checkbox" id="all" aria-label="Chọn tất cả" ${list.length && list.every(r => st.sel.has(r.id)) ? 'checked' : ''}></th>
      <th data-sort="_name" class="nmcol">${colName('_name')}${s('_name')}</th>${st.cols.map(k => `<th data-sort="${k}">${esc(colName(k))}${s(k)}</th>`).join('')}
      <th class="addc"><button class="btn btn--text btn--icon" id="colAdd" title="Thêm cột" aria-label="Thêm cột"><span class="ms sm">add</span></button></th></tr></thead>
      <tbody>${list.length ? list.map(r => `<tr class="${st.sel.has(r.id) ? 'sel' : ''}"><td class="cb"><input type="checkbox" data-sel="${r.id}" ${st.sel.has(r.id) ? 'checked' : ''} aria-label="Chọn"></td>
        <td class="nmcol"><span class="pri"><button class="xbtn ${st.exp[r.id] ? 'on' : ''}" data-exp="${r.id}" aria-label="Hiện đối tượng liên kết"><span class="ms sm">chevron_right</span></button><span class="av sm ${T === 'company' ? 'sq' : ''}">${esc(HXC.initials(HXC.titleOf(T, r)))}</span>
          <a href="${HXC.url(T, r.id)}">${esc(HXC.titleOf(T, r))}</a><button class="pvb" data-pv="${r.id}" title="Xem trước" aria-label="Xem trước"><span class="ms xs">vertical_split</span></button></span></td>
        ${st.cols.map(k => `<td class="${['_contacts','_deals','employees'].includes(k) ? 'num' : ''}">${cell(r, k)}</td>`).join('')}<td></td></tr>${st.exp[r.id] ? expandRow(r) : ''}`).join('')
        : `<tr><td colspan="${st.cols.length + 3}" class="empty"><span class="ms">search_off</span><b>Không có ${O.plural.toLowerCase()} phù hợp</b><br>${st.q ? `Không tìm thấy kết quả cho “${esc(st.q)}”. ` : ''}Thử bỏ bớt bộ lọc.</td></tr>`}</tbody></table></div>`;
  }
  function drawBoard(list) {
    const f = F(CFG.board);
    $('#body').innerHTML = `<div class="kb">${f.choices.map(c => { const items = list.filter(r => r.values[CFG.board] === c);
      return `<section class="kcol"><div class="kh">${display(c, f)}<span class="n">${items.length}</span></div><div class="kcards" data-drop="${esc(c)}">${items.map(r => `<article class="kc" draggable="true" data-card="${r.id}">
        <a class="tt" href="${HXC.url(T, r.id)}">${esc(HXC.titleOf(T, r))}</a>
        ${T === 'contact' ? `${r.values.email ? `<span class="ln"><span class="ms">mail</span><span class="t">${esc(r.values.email)}</span></span>` : ''}${(co => co ? `<span class="ln"><span class="ms">domain</span><span class="t">${esc(co.values.name)}</span></span>` : '')(HXC.assoc.companyOfContact(r.id))}`
          : `${r.values.domain ? `<span class="ln"><span class="ms">language</span><span class="t">${esc(r.values.domain)}</span></span>` : ''}<span class="ln"><span class="ms">person</span><span class="t">${HXC.assoc.contactsOfCompany(r.id).length} contact · ${HXC.assoc.dealsOfCompany(r.id).length} deal</span></span>`}
        <span class="ln"><span class="ms">account_circle</span><span class="t">${esc(r.values.owner || 'Chưa có owner')}</span></span>
        <div class="kf"><button class="qi" data-pv="${r.id}" title="Xem trước" aria-label="Xem trước"><span class="ms sm">vertical_split</span></button></div></article>`).join('') || '<div class="kempty">Không có bản ghi</div>'}</div></section>`; }).join('')}</div>`;
  }
  function draw() {
    drawTabs(); drawQuick();
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === st.mode));
    document.body.classList.toggle('fcollapsed', st.fcollapsed); $('#filterBtn').setAttribute('aria-pressed', !st.fcollapsed); $('#colIc').textContent = st.fcollapsed ? 'expand_more' : 'expand_less'; document.body.classList.toggle('compact', st.compact);
    const list = rows();
    st.mode === 'BOARD' ? drawBoard(list) : drawTable(list);
    $('#count').textContent = `${HXC.list(T).length} bản ghi`; $('#footCount').textContent = `${list.length} ${O.plural.toLowerCase()}`;
    $('#bulk').classList.toggle('on', st.sel.size > 0); $('#bulkN').textContent = `Đã chọn ${st.sel.size} bản ghi`;
  }

  /* ── Popover ── */
  const closePops = except => document.querySelectorAll('.pop.open').forEach(p => p !== except && p.classList.remove('open'));
  function openPop(anchor, html, w = 280) {
    const p = $('#pop'); const r = anchor.getBoundingClientRect(), fr = document.querySelector('.frame').getBoundingClientRect();
    p.style.width = w + 'px'; p.style.left = Math.max(8, Math.min(r.left - fr.left, fr.width - w - 8)) + 'px'; p.style.top = (r.bottom - fr.top + 4) + 'px';
    p.innerHTML = html; closePops(p); p.classList.add('open'); return p;
  }
  function quickPop(btn, k) {
    const f = F(k);
    if (k === '_created' || k === '_lastact') {
      const p = openPop(btn, `<div class="qp"><div class="qp-op">là<span class="ms xs">arrow_drop_down</span></div><label class="srch2"><input id="qpQ" placeholder="Tìm"><span class="ms sm">search</span></label>
        <div class="qp-l" id="qpL"></div>${st.f[k] ? '<button class="fclear" data-qpclr style="margin:6px 8px">Bỏ bộ lọc này</button>' : ''}</div>`, 260);
      const drawL = q => { $('#qpL', p).innerHTML = DATE_P.filter(d => !q || d[1].toLowerCase().includes(q)).map(([v, l, d]) => `<button class="qp-d ${st.f[k] === v ? 'cur' : ''}" data-qpd="${v}"><b>${l}</b><small>${d}</small></button>`).join(''); };
      drawL(''); $('#qpQ', p).oninput = e => drawL(e.target.value.trim().toLowerCase()); $('#qpQ', p).focus();
      p.onclick = e => { e.stopPropagation(); const d = e.target.closest('[data-qpd]'); if (d) { st.f[k] = d.dataset.qpd; p.classList.remove('open'); draw(); }
        if (e.target.closest('[data-qpclr]')) { delete st.f[k]; p.classList.remove('open'); draw(); } };
      return;
    }
    const cur = new Set(st.f[k] || []);
    const opts = [...(f.type === 'USER' ? [['__none','Chưa có owner'], [ME, 'Tôi (' + ME + ')'], ...HX.USERS.filter(u => u !== ME).map(u => [u, u])] : [['__none','Không có giá trị'], ...optsOf(f).map(o => [o, o])])];
    const p = openPop(btn, `<div class="qp"><label class="srch2"><input id="qpQ" placeholder="Tìm"><span class="ms sm">search</span></label><div class="qp-l" id="qpL"></div>
      <div class="qp-f"><button class="fclear" data-qpclr>Bỏ chọn</button><button class="btn btn--primary sm" data-qpok>Áp dụng</button></div></div>`, 280);
    const drawL = q => { $('#qpL', p).innerHTML = opts.filter(o => !q || o[1].toLowerCase().includes(q)).map(([v, l]) => `<label class="mi"><input type="checkbox" value="${esc(v)}" ${cur.has(v) ? 'checked' : ''}>${esc(l)}</label>`).join(''); };
    drawL(''); $('#qpQ', p).oninput = e => drawL(e.target.value.trim().toLowerCase()); $('#qpQ', p).focus();
    p.onchange = e => { if (e.target.type === 'checkbox') e.target.checked ? cur.add(e.target.value) : cur.delete(e.target.value); };
    p.onclick = e => { e.stopPropagation(); if (e.target.closest('[data-qpok]')) { st.f[k] = [...cur]; p.classList.remove('open'); draw(); }
      if (e.target.closest('[data-qpclr]')) { delete st.f[k]; p.classList.remove('open'); draw(); } };
  }
  function advPanel() {
    const p = $('#panel'); const fields = [VF._name, ...O.fields.filter(f => !['firstname','lastname','name'].includes(f.key)), VF._created, VF._lastact, ...(T === 'company' ? [VF._contacts] : []), VF._deals];
    let conds = st.adv.map(c => ({ ...c }));
    const drawC = () => { $('#advB', p).innerHTML = (conds.length ? conds.map((c, i) => { const f = fields.find(x => x.key === c.key); const ops = opsOf(f);
        const needV = !['is_empty','is_not_empty'].includes(c.op);
        const vIn = !needV ? '' : c.op === 'in' ? `<select class="in" data-cv="${i}">${DATE_P.map(([v, l]) => `<option value="${v}" ${c.value === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`
          : (f.type === 'SELECT' || f.type === 'USER') ? `<select class="in" data-cv="${i}">${optsOf(f).map(o => `<option ${c.value === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`
          : `<input class="in" data-cv="${i}" type="${f.type === 'NUMBER' ? 'number' : 'text'}" value="${esc(c.value ?? '')}" placeholder="Giá trị">`;
        return `${i ? '<div class="and">VÀ</div>' : ''}<div class="cond"><div class="ch2"><b>${esc(f.name)}</b><button class="btn btn--text btn--icon" data-crm="${i}" aria-label="Xoá điều kiện"><span class="ms sm">delete</span></button></div>
          <select class="in" data-co="${i}">${ops.map(([v, l]) => `<option value="${v}" ${c.op === v ? 'selected' : ''}>${l}</option>`).join('')}</select>${vIn}</div>`; }).join('') : '<p class="nil">Chưa có điều kiện. Thêm bộ lọc theo bất kỳ thuộc tính nào.</p>')
      + `<div class="addcond"><select class="in" id="advAdd"><option value="">+ Thêm bộ lọc…</option>${fields.map(f => `<option value="${f.key}">${esc(f.name)}</option>`).join('')}</select></div>`; };
    p.innerHTML = `<div class="pn-h"><h2>Bộ lọc nâng cao</h2><button class="btn btn--text btn--icon" data-pclose aria-label="Đóng"><span class="ms">close</span></button></div><div class="pn-b" id="advB"></div>
      <div class="pn-f"><button class="btn btn--primary" id="advOk">Áp dụng</button><button class="btn btn--secondary" data-pclose>Huỷ</button><button class="btn btn--text" id="advClr" style="margin-left:auto">Xoá tất cả</button></div>`;
    drawC();
    p.onchange = e => { const t = e.target;
      if (t.id === 'advAdd' && t.value) { const f = fields.find(x => x.key === t.value); const op = opsOf(f)[0][0]; conds.push({ key:f.key, op, value: op === 'in' ? 'd30' : (f.type === 'SELECT' || f.type === 'USER') ? optsOf(f)[0] : '' }); drawC(); }
      if (t.dataset.co) { conds[t.dataset.co].op = t.value; if (t.value === 'in') conds[t.dataset.co].value = 'd30'; drawC(); }
      if (t.dataset.cv) conds[t.dataset.cv].value = t.value; };
    p.oninput = e => { if (e.target.dataset.cv) conds[e.target.dataset.cv].value = e.target.value; };
    p.onclick = e => { if (e.target.closest('[data-pclose]')) HX.closePanel(); const rm = e.target.closest('[data-crm]'); if (rm) { conds.splice(+rm.dataset.crm, 1); drawC(); }
      if (e.target.closest('#advClr')) { conds = []; drawC(); }
      if (e.target.closest('#advOk')) { st.adv = conds.filter(c => ['is_empty','is_not_empty'].includes(c.op) || String(c.value ?? '').trim() !== ''); HX.closePanel(); draw(); toast(st.adv.length ? `Đang lọc theo ${st.adv.length} điều kiện` : 'Đã bỏ bộ lọc nâng cao'); } };
    p.onkeydown = null; document.body.classList.remove('dock'); p.classList.add('open'); document.body.classList.add('panel-open');
  }
  function preview(id) {
    const r = HXC.get(T, id), p = $('#panel');
    p.innerHTML = `<div class="pn-h"><span class="av ${T === 'company' ? 'sq' : ''}">${esc(HXC.initials(HXC.titleOf(T, r)))}</span><h2>${esc(HXC.titleOf(T, r))}</h2><button class="btn btn--text btn--icon" data-pclose aria-label="Đóng"><span class="ms">close</span></button></div>
      <div class="pn-b"><a class="btn btn--secondary sm" href="${HXC.url(T, id)}" style="margin-bottom:12px">Xem bản ghi<span class="ms xs">arrow_forward</span></a>
        <h3 class="pvh">${T === 'contact' ? 'Thông tin chính' : 'Về công ty này'}</h3><div class="props" id="pvProps"></div>
        <h3 class="pvh">Liên kết</h3><div id="pvAssoc" class="pva"></div></div>`;
    HXC.props($('#pvProps', p), T, r, T === 'contact' ? ['email','phone','owner','lifecycle','leadstatus','jobtitle'] : ['domain','owner','city','lifecycle','leadstatus','industry'], draw);
    $('#pvAssoc', p).innerHTML = CFG.expand.map(([k, l]) => { const rel = HXC.related(T, id, k); return `<div><b>${l} (${rel.length})</b>${rel.length ? rel.map(x => `<a class="lk b" href="${HXC.url(k, x.id)}">${esc(HXC.titleOf(k, x))}</a>`).join('') : '<span class="nil">--</span>'}</div>`; }).join('');
    p.onclick = e => { if (e.target.closest('[data-pclose]')) HX.closePanel(); };
    p.classList.add('open'); document.body.classList.add('panel-open', 'dock');
  }

  /* ── Sự kiện ── */
  $('#objName').textContent = O.plural;
  $('#addBtn').innerHTML = `Thêm ${O.plural.toLowerCase()}<span class="ms xs">arrow_drop_down</span>`;
  $('#objPop').innerHTML = `<div class="hd">Đối tượng</div>` + ['contact','company','deal'].map(k => `<a class="mi" href="${HXC.OBJ[k].list}" ${k === T ? 'style="font-weight:700"' : ''}><span class="ms sm" style="${k === T ? '' : 'visibility:hidden'}">check</span>${HXC.OBJ[k].plural}</a>`).join('')
    + `<a class="mi" href="crm-leads-hubspot.html"><span class="ms sm" style="visibility:hidden">check</span>Leads</a>`;
  $('#vtabs').onclick = e => { const v = e.target.closest('[data-view]'); if (v) { st.view = v.dataset.view; st.sel.clear(); draw(); } };
  $('#q').oninput = e => { st.q = e.target.value.trim().toLowerCase(); draw(); };
  $('#qf').addEventListener('click', e => {
    const q = e.target.closest('[data-qf]'); if (q) { e.stopPropagation(); quickPop(q, q.dataset.qf); return; }
    if (e.target.closest('[data-qadd]')) { e.stopPropagation(); const more = [...CFG.quick, ...CFG.quickMore].filter(k => !st.quick.includes(k));
      const p = openPop(e.target.closest('[data-qadd]'), `<div class="hd">Thêm bộ lọc nhanh</div>${more.map(k => `<button class="mi" data-qnew="${k}">${esc(F(k).name)}</button>`).join('') || '<div class="nil" style="padding:8px">Đã thêm tất cả</div>'}`, 240);
      p.onclick = ev => { ev.stopPropagation(); const n = ev.target.closest('[data-qnew]'); if (n) { st.quick.push(n.dataset.qnew); p.classList.remove('open'); draw(); } }; return; }
    if (e.target.closest('[data-qedit]')) { e.stopPropagation(); const p = openPop(e.target.closest('[data-qedit]'), `<div class="hd">Bộ lọc nhanh đang hiện</div>${st.quick.map(k => `<label class="mi"><input type="checkbox" data-qk="${k}" checked>${esc(F(k).name)}</label>`).join('')}`, 240);
      p.onclick = ev => ev.stopPropagation(); p.onchange = ev => { const k = ev.target.dataset.qk; if (k && !ev.target.checked) { st.quick = st.quick.filter(x => x !== k); delete st.f[k]; drawQuick(); draw(); } }; return; }
    if (e.target.closest('[data-adv]')) { advPanel(); return; }
    if (e.target.closest('#qfClear')) { st.f = {}; st.adv = []; draw(); }
  });
  $('#sortBtn').onclick = e => { e.stopPropagation(); const fields = [VF._name, ...O.fields, VF._created, VF._lastact];
    const p = openPop($('#sortBtn'), `<div class="pop-form"><label>Sắp xếp theo<select id="sKey">${fields.map(f => `<option value="${f.key}" ${f.key === st.sort.key ? 'selected' : ''}>${esc(f.name)}</option>`).join('')}</select></label>
      <label>Thứ tự<select id="sDir"><option value="asc" ${st.sort.dir === 'asc' ? 'selected' : ''}>Tăng dần (A → Z, cũ → mới)</option><option value="desc" ${st.sort.dir === 'desc' ? 'selected' : ''}>Giảm dần (Z → A, mới → cũ)</option></select></label>
      <div class="row"><button class="btn btn--secondary sm" id="sRst">Mặc định</button><button class="btn btn--primary sm" id="sOk">Áp dụng</button></div></div>`, 280);
    p.onclick = ev => { ev.stopPropagation(); if (ev.target.closest('#sOk')) { st.sort = { key:$('#sKey', p).value, dir:$('#sDir', p).value }; p.classList.remove('open'); draw(); }
      if (ev.target.closest('#sRst')) { st.sort = { key:'_created', dir:'desc' }; p.classList.remove('open'); draw(); } }; };
  $('#filterBtn').onclick = () => { st.fcollapsed = !st.fcollapsed; draw(); };
  $('#colBtn2').onclick = () => { st.fcollapsed = !st.fcollapsed; draw(); };
  document.querySelector('.seg').onclick = e => { const b = e.target.closest('[data-mode]'); if (b) { st.mode = b.dataset.mode; draw(); } };
  $('#setBtn').onclick = e => { e.stopPropagation();
    const p = openPop($('#setBtn'), `<div class="hd">Cài đặt view</div>
      <div class="setrow">Kiểu hiển thị<span class="segtxt"><button data-sm="TABLE" aria-pressed="${st.mode === 'TABLE'}">Bảng</button><button data-sm="BOARD" aria-pressed="${st.mode === 'BOARD'}">Board</button></span></div>
      <div class="setrow">Chiều cao dòng<span class="segtxt"><button data-sd="0" aria-pressed="${!st.compact}">Thoáng</button><button data-sd="1" aria-pressed="${st.compact}">Gọn</button></span></div>
      <div class="sep"></div><button class="mi" data-scol><span class="ms sm">view_column</span>Chỉnh sửa cột</button><button class="mi" data-srst><span class="ms sm">undo</span>Khôi phục view mặc định</button>`, 280);
    p.onclick = ev => { ev.stopPropagation(); const m = ev.target.closest('[data-sm]'); if (m) { st.mode = m.dataset.sm; p.classList.remove('open'); draw(); }
      const d = ev.target.closest('[data-sd]'); if (d) { st.compact = d.dataset.sd === '1'; p.classList.remove('open'); draw(); }
      if (ev.target.closest('[data-scol]')) { p.classList.remove('open'); editCols(); } if (ev.target.closest('[data-srst]')) { p.classList.remove('open'); resetView(); } }; };
  function resetView() { Object.assign(st, { f:{}, adv:[], q:'', sort:{ key:'_created', dir:'desc' }, quick:[...CFG.quick], cols:[...CFG.cols], exp:{}, compact:false }); $('#q').value = ''; draw(); toast('Đã khôi phục view mặc định'); }
  function editCols() {
    let shown = [...st.cols]; const all = [...CFG.cols, ...CFG.colsMore.filter(k => !CFG.cols.includes(k))];
    HX.modal(`<div class="modal xl" role="dialog" aria-modal="true" aria-labelledby="ecT" style="height:min(560px,92vh)"><div class="mh" id="ecT">Chọn cột hiển thị<button class="btn btn--text btn--icon x" data-close aria-label="Đóng"><span class="ms">close</span></button></div>
      <div class="ec"><div class="ec-l"><div class="grp">Thuộc tính ${O.label.toLowerCase()} (${all.length})</div><div class="lst" id="ecL"></div></div>
      <div class="ec-r"><div class="top"><span id="ecN"></span></div><div class="sel fixed"><span class="nm">${colName('_name')}</span><span class="nil" style="font-size:12px">Cố định</span></div><div class="lst" id="ecR"></div></div></div>
      <div class="mf l"><button class="btn btn--primary" id="ecOk">Áp dụng</button><button class="btn btn--secondary" data-close>Huỷ</button><button class="lk" id="ecClr" style="font-weight:600;color:var(--link)">Bỏ chọn tất cả</button></div></div>`, (bg, close) => {
      const drawR = () => { $('#ecL', bg).innerHTML = all.map(k => `<label><input type="checkbox" data-k="${k}" ${shown.includes(k) ? 'checked' : ''}>${esc(colName(k))}</label>`).join('');
        $('#ecN', bg).textContent = `Cột đang hiển thị (${shown.length + 1})`;
        $('#ecR', bg).innerHTML = shown.map((k, i) => `<div class="sel"><span class="ms sm">drag_indicator</span><span class="nm">${esc(colName(k))}</span>${i ? `<button class="rm" data-up="${i}" aria-label="Chuyển lên"><span class="ms xs">arrow_upward</span></button>` : ''}<button class="rm" data-rm="${k}" aria-label="Bỏ cột"><span class="ms xs">close</span></button></div>`).join(''); };
      drawR();
      $('#ecL', bg).onchange = e => { const k = e.target.dataset.k; shown = e.target.checked ? [...shown, k] : shown.filter(x => x !== k); drawR(); };
      $('#ecR', bg).onclick = e => { const rm = e.target.closest('[data-rm]'); if (rm) { shown = shown.filter(x => x !== rm.dataset.rm); drawR(); }
        const up = e.target.closest('[data-up]'); if (up) { const i = +up.dataset.up; [shown[i - 1], shown[i]] = [shown[i], shown[i - 1]]; drawR(); } };
      $('#ecClr', bg).onclick = () => { shown = []; drawR(); };
      $('#ecOk', bg).onclick = () => { st.cols = shown; close(); draw(); toast('Đã cập nhật cột'); }; });
  }
  $('#body').addEventListener('click', e => {
    const pv = e.target.closest('[data-pv]'); if (pv) { e.preventDefault(); preview(pv.dataset.pv); return; }
    if (e.target.closest('a[href]')) return;
    if (e.target.closest('#colAdd')) { e.stopPropagation(); const more = [...CFG.cols, ...CFG.colsMore].filter(k => !st.cols.includes(k));
      const p = openPop(e.target.closest('#colAdd'), `<div class="colsrch"><span class="ms xs">search</span><input id="caQ" placeholder="Tìm thuộc tính"></div><div id="caL">${more.map(k => `<button class="mi" data-cadd="${k}">${esc(colName(k))}</button>`).join('') || '<div class="nil" style="padding:8px">Đã hiện tất cả</div>'}</div>
        <div class="sep"></div><button class="mi" data-cedit><span class="ms sm">view_column</span>Chỉnh sửa cột…</button>`, 260);
      $('#caQ', p).focus(); $('#caQ', p).oninput = ev => p.querySelectorAll('[data-cadd]').forEach(b => b.hidden = !b.textContent.toLowerCase().includes(ev.target.value.toLowerCase()));
      p.onclick = ev => { ev.stopPropagation(); const a = ev.target.closest('[data-cadd]'); if (a) { st.cols.push(a.dataset.cadd); p.classList.remove('open'); draw(); } if (ev.target.closest('[data-cedit]')) { p.classList.remove('open'); editCols(); } }; return; }
    const ex = e.target.closest('[data-exp]'); if (ex) { e.stopPropagation(); const id = ex.dataset.exp;
      if (st.exp[id]) { delete st.exp[id]; draw(); return; }
      const p = openPop(ex, `<div class="hd">Hiện đối tượng liên kết</div>${CFG.expand.map(([k, l]) => `<button class="mi" data-xo="${k}"><span class="ms sm">${HXC.OBJ[k].icon}</span>${l} (${HXC.related(T, id, k).length})</button>`).join('')}`, 240);
      p.onclick = ev => { ev.stopPropagation(); const o = ev.target.closest('[data-xo]'); if (o) { st.exp[id] = o.dataset.xo; p.classList.remove('open'); draw(); } }; return; }
    const xs = e.target.closest('[data-xswitch]'); if (xs) { e.stopPropagation(); const id = xs.dataset.xswitch;
      const p = openPop(xs, CFG.expand.map(([k, l]) => `<button class="mi" data-xo="${k}">${l} (${HXC.related(T, id, k).length})</button>`).join(''), 220);
      p.onclick = ev => { ev.stopPropagation(); const o = ev.target.closest('[data-xo]'); if (o) { st.exp[id] = o.dataset.xo; p.classList.remove('open'); draw(); } }; return; }
    const th = e.target.closest('th[data-sort]'); if (th) { const k = th.dataset.sort; st.sort = st.sort.key === k ? { key:k, dir: st.sort.dir === 'asc' ? 'desc' : 'asc' } : { key:k, dir:'asc' }; draw(); }
  });
  $('#body').addEventListener('change', e => {
    if (e.target.id === 'all') { rows().forEach(r => e.target.checked ? st.sel.add(r.id) : st.sel.delete(r.id)); draw(); }
    else if (e.target.dataset.sel) { e.target.checked ? st.sel.add(e.target.dataset.sel) : st.sel.delete(e.target.dataset.sel); draw(); }
  });
  // Board: kéo thẻ sang cột khác = đổi Lifecycle stage (ghi vào timeline)
  $('#body').addEventListener('dragstart', e => { const c = e.target.closest('[data-card]'); if (c) { c.classList.add('dragging'); e.dataTransfer.setData('text/plain', c.dataset.card); } });
  $('#body').addEventListener('dragend', e => e.target.closest('[data-card]')?.classList.remove('dragging'));
  $('#body').addEventListener('dragover', e => { const z = e.target.closest('[data-drop]'); if (z) { e.preventDefault(); z.classList.add('drop'); } });
  $('#body').addEventListener('dragleave', e => e.target.closest('[data-drop]')?.classList.remove('drop'));
  $('#body').addEventListener('drop', e => { const z = e.target.closest('[data-drop]'); if (!z) return; e.preventDefault(); const id = e.dataTransfer.getData('text/plain'), r = HXC.get(T, id);
    if (r && r.values[CFG.board] !== z.dataset.drop) { HXC.update(T, id, CFG.board, z.dataset.drop); toast(`Lifecycle stage: ${z.dataset.drop}`); } draw(); });

  $('#addBtn').onclick = e => { e.stopPropagation(); closePops(); $('#addPop').classList.toggle('open'); };
  $('#objBtn').onclick = e => { e.stopPropagation(); closePops(); $('#objPop').classList.toggle('open'); };
  $('#moreBtn').onclick = e => { e.stopPropagation(); closePops(); $('#morePop').classList.toggle('open'); };
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-toast]'); if (t) { toast(t.dataset.toast); closePops(); return; }
    if (e.target.closest('[data-new]')) { closePops(); HXC.createPanel(T, { onCreated: draw }); return; }
    if (e.target.closest('[data-imp]')) { closePops(); HX.importDialog(); return; }
    if (!e.target.closest('.pop')) closePops();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePops(); if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); } });
  $('#exportBtn').onclick = () => toast(`Mockup: xuất ${rows().length} ${O.plural.toLowerCase()} ra tệp .xlsx`);
  $('#refresh').onclick = () => { draw(); toast('Đã làm mới'); };
  $('#resetBtn').onclick = resetView;
  $('#cloneBtn').onclick = () => toast('Nhân bản view thành view mới (mockup)');
  $('#bulkCancel').onclick = () => { st.sel.clear(); draw(); };
  $('#bulkOwner').onclick = e => { e.stopPropagation(); const p = openPop($('#bulkOwner'), `<div class="hd">Gán owner cho ${st.sel.size} bản ghi</div>${HX.USERS.map(u => `<button class="mi" data-bo="${u}">${u}</button>`).join('')}`, 240);
    p.onclick = ev => { ev.stopPropagation(); const b = ev.target.closest('[data-bo]'); if (b) { [...st.sel].forEach(id => HXC.update(T, id, 'owner', b.dataset.bo)); p.classList.remove('open'); toast(`Đã gán ${b.dataset.bo} cho ${st.sel.size} bản ghi`); st.sel.clear(); draw(); } }; };
  $('#bulkDel').onclick = () => confirmBox('Xoá bản ghi', `Xoá ${st.sel.size} ${O.plural.toLowerCase()} đã chọn? Liên kết với bản ghi khác sẽ bị gỡ. Không thể hoàn tác.`, 'Xoá', () => { const n = st.sel.size; HXC.remove(T, [...st.sel]); st.sel.clear(); draw(); toast(`Đã xoá ${n} bản ghi`); });
  HX.onChange = draw;
  draw();
}

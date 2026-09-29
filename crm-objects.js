/* ═══════════════════════════════════════════════════════════════
   HarnexAI CRM — giai đoạn 2: Contacts · Companies · liên kết · Activities · Line items
   Mô hình dữ liệu theo "Kế hoạch triển khai giai đoạn 2" (28/09/2026):
     Companies 1:N Contacts · Companies 1:N Deals · Deals N:N Contacts (bảng nối Deal_Contacts + nhãn)
     Deals 1:N Line_Items · Products 1:N Line_Items · Activities N:N Contact/Company/Deal
   Deals vẫn nằm trong store của giai đoạn 1 (HX.api). Mọi thứ khác lưu ở localStorage "hx-crm-p2-v1".
   Cần nạp sau crm-shared.js.
   ═══════════════════════════════════════════════════════════════ */
const HXC = (() => {
  const { esc, empty, fmt, display, editor, toast, modal, confirmBox, $, USERS, STAGES } = HX;
  const deals = HX.api;
  const ME = 'Phương Nguyễn';
  const TODAY = new Date('2026-09-28T09:00:00+07:00');

  /* ── Danh mục ── */
  const LIFECYCLE = ['Subscriber','Lead','Marketing Qualified Lead','Sales Qualified Lead','Opportunity','Customer','Evangelist'];
  const LEAD_STATUS = ['Mới','Đang mở','Đang xử lý','Có deal','Không phù hợp','Đã thử liên hệ','Đã kết nối','Chưa đúng thời điểm'];
  const SOURCES = ['Website','Giới thiệu','Sự kiện','Quảng cáo','Nhập tay','Import'];
  const INDUSTRIES = ['Y tế – Dược','Du lịch','Xây dựng','Bán lẻ – Thời trang','In ấn','Giáo dục','Logistics','Nội thất','Thực phẩm','Dịch vụ tài chính','Sản xuất','Làm đẹp','Công nghệ'];
  const ASSOC_LABELS = ['Người quyết định','Người ảnh hưởng','Người dùng chính','Kế toán / thanh toán'];
  const STAGE = 'giai_o_n_pipeline', CASH = 't_ng_cash_in_d_ki_n', CLOSE = 'ng_y_d_ki_n_ch_t', SALE = 'sale_ph_tr_ch';
  const WON = '5. Closed Won', LOST = '6. Closed Lost';

  const CONTACT_FIELDS = [
    {key:'email', name:'Email', type:'TEXT'},
    {key:'firstname', name:'Tên', type:'TEXT'},
    {key:'lastname', name:'Họ và tên đệm', type:'TEXT'},
    {key:'jobtitle', name:'Chức danh', type:'TEXT'},
    {key:'phone', name:'Số điện thoại', type:'TEXT'},
    {key:'owner', name:'Contact owner', type:'USER'},
    {key:'lifecycle', name:'Lifecycle stage', type:'SELECT', choices:LIFECYCLE},
    {key:'leadstatus', name:'Lead status', type:'SELECT', choices:LEAD_STATUS},
    {key:'city', name:'Thành phố', type:'TEXT'},
    {key:'source', name:'Nguồn', type:'SELECT', choices:SOURCES},
  ];
  const COMPANY_FIELDS = [
    {key:'name', name:'Tên công ty', type:'TEXT'},
    {key:'domain', name:'Domain', type:'TEXT'},
    {key:'industry', name:'Ngành', type:'SELECT', choices:INDUSTRIES},
    {key:'phone', name:'Số điện thoại', type:'TEXT'},
    {key:'owner', name:'Company owner', type:'USER'},
    {key:'city', name:'Thành phố', type:'TEXT'},
    {key:'lifecycle', name:'Lifecycle stage', type:'SELECT', choices:LIFECYCLE},
    {key:'country', name:'Quốc gia/Khu vực', type:'TEXT'},
    {key:'leadstatus', name:'Lead status', type:'SELECT', choices:LEAD_STATUS},
    {key:'employees', name:'Số nhân sự', type:'NUMBER'},
  ];

  /* ── Store ── */
  const KEY = 'hx-crm-p2-v1';
  const load = () => { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch { return null; } };
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {} };
  const iso = (d, h = 9) => new Date(`${d}T${String(h).padStart(2, '0')}:00:00+07:00`).toISOString();
  const addDays = (isoStr, n) => new Date(new Date(isoStr).getTime() + n * 864e5).toISOString();

  function seed() {
    // 1 công ty cho mỗi Deal mẫu (tên lấy từ "Tên Deal") + 1 công ty chưa có Deal
    const CO = {
      '01':['Spa Ngọc Trai','spangoctrai.vn','Làm đẹp','Đà Nẵng',12],
      '02':['Cơ khí Đại Phong','daiphong-mech.vn','Sản xuất','Bình Dương',180],
      '03':['Kế toán Sao Việt','saovietacc.vn','Dịch vụ tài chính','Hà Nội',25],
      '04':['Thực phẩm An Khang','ankhangfood.vn','Thực phẩm','Long An',420],
      '05':['Nội thất Minh Phát','minhphat-furniture.vn','Nội thất','TP. Hồ Chí Minh',60],
      '06':['Nha khoa Nụ Cười Việt','nucuoiviet.vn','Y tế – Dược','TP. Hồ Chí Minh',18],
      '07':['Logistics Tân Cảng Xanh','tancangxanh.vn','Logistics','Hải Phòng',95],
      '08':['Mầm non Hoa Sen','mnhoasen.edu.vn','Giáo dục','Cần Thơ',30],
      '09':['In ấn Phương Đông','inphuongdong.vn','In ấn','Hà Nội',45],
      '10':['Thời trang Mộc Lan','moclanfashion.vn','Bán lẻ – Thời trang','TP. Hồ Chí Minh',38],
      '11':['Xây dựng Hưng Thịnh','hungthinhcons.vn','Xây dựng','Đồng Nai',150],
      '12':['Du lịch Biển Xanh','bienxanhtravel.vn','Du lịch','Nha Trang',55],
      '13':['Dược phẩm Thiên Phúc','thienphucpharma.vn','Y tế – Dược','TP. Hồ Chí Minh',250],
    };
    const companies = [], contacts = [], dealLinks = {};
    Object.entries(CO).forEach(([n, [name, domain, industry, city, emp]]) => {
      const d = deals.get('r0' + n); const st = d ? d.values[STAGE] : null;
      const created = d ? addDays(d.createdAt, -2) : iso('2026-07-15');
      companies.push({ id:'co' + n, createdAt: created, values:{ name, domain, industry, phone:'028 ' + (3800 + Number(n) * 17) + ' ' + (1000 + Number(n) * 37), owner: d ? d.values[SALE] : ME, city,
        lifecycle: st === WON ? 'Customer' : st === LOST ? 'Lead' : 'Opportunity', employees: emp, country:'Việt Nam', leadstatus: st === WON ? null : st === LOST ? 'Không phù hợp' : 'Có deal' } });
      if (d) dealLinks[d.id] = { company:'co' + n, contacts:[] };
    });
    companies.push({ id:'co14', createdAt: iso('2026-09-26', 14), values:{ name:'Titan Bases', domain:'titanbases.com', industry:'Công nghệ', phone:'', owner: ME, city:'TP. Hồ Chí Minh', lifecycle:'Lead', employees: 8, country:'Việt Nam', leadstatus:'Mới' } });
    // [id, họ, tên, chức danh, công ty, nguồn, deal, nhãn]
    const CT = [
      ['01','Nguyễn Thị','Hạnh','Giám đốc vận hành','13','Giới thiệu','r013','Người quyết định'],
      ['02','Trần Quốc','Bảo','Trưởng phòng IT','13','Giới thiệu','r013','Người dùng chính'],
      ['03','Lê Minh','Châu','Giám đốc kinh doanh','12','Website','r012','Người quyết định'],
      ['04','Phạm Đức','Anh','Chủ doanh nghiệp','11','Sự kiện','r011','Người quyết định'],
      ['05','Võ Thị','Lan','Quản lý cửa hàng','10','Quảng cáo','r010','Người dùng chính'],
      ['06','Đặng Văn','Hùng','Giám đốc','09','Website','r009','Người quyết định'],
      ['07','Bùi Thu','Trang','Hiệu trưởng','08','Sự kiện','r008','Người quyết định'],
      ['08','Hoàng Gia','Huy','Trưởng phòng điều phối','07','Website','r007','Người dùng chính'],
      ['09','Ngô Thanh','Tâm','Kế toán trưởng','07','Website','r007','Kế toán / thanh toán'],
      ['10','Đỗ Minh','Khoa','Bác sĩ, chủ phòng khám','06','Quảng cáo','r006','Người quyết định'],
      ['11','Huỳnh Ngọc','Mai','Giám đốc','05','Giới thiệu','r005','Người quyết định'],
      ['12','Phan Văn','Tài','Giám đốc tài chính','04','Sự kiện','r004','Người ảnh hưởng'],
      ['13','Trịnh Thu','Hà','Kế toán trưởng','03','Website','r003','Kế toán / thanh toán'],
      ['14','Lý Quang','Vinh','Giám đốc sản xuất','02','Giới thiệu','r002','Người quyết định'],
      ['15','Mai Phương','Thảo','Chủ spa','01','Quảng cáo','r001','Người quyết định'],
      ['16','Nguyễn','Long','CEO','14','Nhập tay',null,null],
      ['17','Kiều Anh','Thư','Marketing Executive',null,'Website',null,null],
      ['18','Tạ Hoàng','Nam','Trưởng phòng kinh doanh',null,'Import',null,null],
    ];
    const noAccent = s => HX.slug(s).replace(/_/g, '');
    CT.forEach(([n, last, first, job, co, source, dealId, label], i) => {
      const company = co ? companies.find(c => c.id === 'co' + co) : null;
      const d = dealId ? deals.get(dealId) : null; const st = d ? d.values[STAGE] : null;
      const lifecycle = st === WON ? 'Customer' : st === LOST ? 'Lead' : d ? (st === '1. MQL Qualified' ? 'Marketing Qualified Lead' : 'Opportunity') : n === '16' ? 'Lead' : 'Subscriber';
      const leadstatus = st === WON ? null : st === LOST ? 'Không phù hợp' : d ? 'Có deal' : n === '16' ? 'Mới' : n === '18' ? 'Đã thử liên hệ' : null;
      const created = company ? addDays(company.createdAt, i % 2) : n === '17' ? iso('2026-07-08', 10) : iso('2026-08-19', 15);
      contacts.push({ id:'ct' + n, createdAt: created, company: company ? company.id : null, values:{
        email: `${noAccent(first)}.${noAccent(last.split(' ')[0])}@${company ? company.values.domain : n === '17' ? 'gmail.com' : 'vietsales.vn'}`,
        firstname:first, lastname:last, jobtitle:job, phone:'09' + String(12345678 + i * 7654321).slice(0, 8), owner: company ? company.values.owner : ME,
        lifecycle, leadstatus, city: company ? company.values.city : 'TP. Hồ Chí Minh', source } });
      if (d) dealLinks[d.id].contacts.push({ id:'ct' + n, label });
    });
    const products = [
      {id:'p1', name:'HarnexAI STARTER – 6 tháng', sku:'HX-ST-6', price:15000000, desc:'Gói Starter, trả trước 6 tháng'},
      {id:'p2', name:'HarnexAI STARTER – 12 tháng', sku:'HX-ST-12', price:28000000, desc:'Gói Starter, trả trước 12 tháng'},
      {id:'p3', name:'HarnexAI PROFESSIONAL – 12 tháng', sku:'HX-PRO-12', price:48000000, desc:'Gói Professional, trả trước 12 tháng'},
      {id:'p4', name:'HarnexAI ENTERPRISE BYOC – 12 tháng', sku:'HX-ENT-12', price:180000000, desc:'Triển khai trên hạ tầng khách hàng'},
      {id:'p5', name:'Phí khởi tạo (Setup)', sku:'HX-SETUP', price:3000000, desc:'Cấu hình, nhập dữ liệu ban đầu'},
      {id:'p6', name:'User bổ sung / tháng', sku:'HX-USER', price:250000, desc:'Tính theo user theo tháng'},
      {id:'p7', name:'Đào tạo onsite (buổi)', sku:'HX-TRAIN', price:5000000, desc:'1 buổi 4 giờ tại văn phòng khách'},
    ];
    const liFields = [{key:'thoi_han', name:'Thời hạn (tháng)', type:'NUMBER'}, {key:'ghi_chu', name:'Ghi chú', type:'TEXT'}];
    const L = (id, deal, product, qty, price, disc, custom) => ({ id, deal, product, name: products.find(p => p.id === product).name, qty, price, disc, discType:'₫', custom });
    const lineItems = [
      L('li1','r013','p4',1,180000000,0,{thoi_han:12}), L('li2','r013','p5',1,30000000,0,{ghi_chu:'Tích hợp hệ thống kho'}),
      L('li3','r012','p3',1,48000000,0,{thoi_han:12}), L('li4','r012','p5',1,6000000,0,{}),
      L('li5','r002','p3',1,64000000,0,{thoi_han:12, ghi_chu:'Gói 20 user'}), L('li6','r002','p5',1,8000000,0,{}),
    ];
    // Hoạt động mẫu: [loại, ngày, giờ, người, liên kết contact, deal, nội dung, thêm]
    const A = [
      ['NOTE','2026-09-10',10,'Minh Trần','ct01','r013','Khách cần triển khai BYOC vì dữ liệu dược phải nằm trên máy chủ riêng.',{}],
      ['MEETING','2026-09-15',14,'Minh Trần','ct01','r013','Demo quy trình duyệt đơn hàng cho ban giám đốc.',{title:'Demo ERP cho BGĐ Thiên Phúc', dur:60, outcome:'Đã hoàn thành', attendees:['ct01','ct02']}],
      ['CALL','2026-09-22',16,'Minh Trần','ct02','r013','Trao đổi yêu cầu tích hợp kho, hẹn gửi báo giá trước 25/9.',{outcome:'Đã kết nối', dir:'Gọi đi'}],
      ['TASK','2026-09-30',9,'Minh Trần','ct01','r013','Gửi báo giá ENTERPRISE BYOC bản chỉnh sửa',{title:'Gửi báo giá bản chỉnh sửa', due:'2026-09-30', done:false, prio:'Cao', assignee:'Minh Trần'}],
      ['NOTE','2026-09-12',11,'Lan Lê','ct03','r012','Khách gia hạn gói, muốn thêm 5 user cho mùa cao điểm.',{}],
      ['CALL','2026-09-21',10,'Lan Lê','ct03','r012','Chốt phương án thanh toán 12 tháng.',{outcome:'Đã kết nối', dir:'Gọi đến'}],
      ['TASK','2026-09-29',9,'Lan Lê','ct03','r012','Chuẩn bị hợp đồng gia hạn',{title:'Chuẩn bị hợp đồng gia hạn', due:'2026-09-29', done:false, prio:'Trung bình', assignee:'Lan Lê'}],
      ['MEETING','2026-09-18',9,'Lan Lê','ct04','r011','Buổi demo tại công trường, khách quan tâm module tiến độ.',{title:'Demo tại công trường', dur:90, outcome:'Đã hoàn thành', attendees:['ct04']}],
      ['MEETING','2026-10-02',14,'Phương Nguyễn','ct05','r010','Demo cho chuỗi cửa hàng.',{title:'Demo quản lý bán hàng', dur:60, outcome:'Đã lên lịch', attendees:['ct05']}],
      ['CALL','2026-09-17',15,'Minh Trần','ct06','r009','Khách hỏi về in hoá đơn theo mẫu riêng.',{outcome:'Để lại tin nhắn', dir:'Gọi đi'}],
      ['NOTE','2026-09-20',8,'Lan Lê','ct07','r008','Trường cần phân quyền cho 3 cơ sở.',{}],
      ['CALL','2026-09-19',11,'Phương Nguyễn','ct08','r007','Discovery call: 20 user, cần tích hợp Zalo OA.',{outcome:'Đã kết nối', dir:'Gọi đi'}],
      ['TASK','2026-09-25',9,'Phương Nguyễn','ct09','r007','Gửi tài liệu API Zalo OA',{title:'Gửi tài liệu API Zalo OA', due:'2026-09-25', done:true, prio:'Thấp', assignee:'Phương Nguyễn'}],
      ['CALL','2026-09-11',10,'Minh Trần','ct10','r006','Khách chưa rõ ngân sách, hẹn gọi lại cuối tháng.',{outcome:'Không nghe máy', dir:'Gọi đi'}],
      ['NOTE','2026-09-23',13,'Phương Nguyễn','ct11','r005','MQL từ webinar tháng 8, quan tâm module kho.',{}],
      ['TASK','2026-10-01',9,'Phương Nguyễn','ct11','r005','Đặt lịch discovery call',{title:'Đặt lịch discovery call', due:'2026-10-01', done:false, prio:'Trung bình', assignee:'Phương Nguyễn'}],
      ['NOTE','2026-09-22',9,'Minh Trần','ct12','r004','Doanh nghiệp lớn, cần báo giá ENTERPRISE.',{}],
      ['MEETING','2026-09-02',10,'Phương Nguyễn','ct13','r003','Kick-off triển khai sau khi ký hợp đồng.',{title:'Kick-off triển khai', dur:60, outcome:'Đã hoàn thành', attendees:['ct13']}],
      ['NOTE','2026-09-05',16,'Minh Trần','ct14','r002','Đã ký hợp đồng 12 tháng, 20 user.',{}],
      ['CALL','2026-09-06',9,'Lan Lê','ct15','r001','Khách chọn đối thủ vì giá thấp hơn.',{outcome:'Đã kết nối', dir:'Gọi đến'}],
      ['NOTE','2026-09-26',15,'Phương Nguyễn','ct16',null,'Lead tạo tay sau buổi gặp ở sự kiện SaaS Việt.',{}],
      ['TASK','2026-09-30',10,'Phương Nguyễn','ct16',null,'Gọi giới thiệu HarnexAI',{title:'Gọi giới thiệu HarnexAI', due:'2026-09-30', done:false, prio:'Cao', assignee:'Phương Nguyễn'}],
      ['CALL','2026-08-28',10,'Phương Nguyễn','ct18',null,'Không liên lạc được.',{outcome:'Không nghe máy', dir:'Gọi đi'}],
    ];
    const activities = A.map(([type, day, h, by, ct, dl, body, x], i) => {
      const c = contacts.find(v => v.id === ct);
      return { id:'a' + (i + 1), type, at: iso(day, h), by, body, ...x, contacts:[ct], companies: c && c.company ? [c.company] : [], deals: dl ? [dl] : [] };
    });
    return { companies, contacts, dealLinks, products, lineItems, liFields, activities, events:[] };
  }
  let db = load() || seed();
  // Nâng cấp dữ liệu cũ trong trình duyệt (Phần 2: thêm Quốc gia, Lead status cho Company)
  db.companies.forEach(c => { if (!('country' in c.values)) c.values.country = 'Việt Nam'; if (!('leadstatus' in c.values)) c.values.leadstatus = c.values.lifecycle === 'Customer' ? null : c.values.lifecycle === 'Opportunity' ? 'Có deal' : 'Mới'; });
  if (!load()) persist();

  /* ── Truy vấn & liên kết ── */
  const coll = t => t === 'contact' ? db.contacts : t === 'company' ? db.companies : null;
  const get = (t, id) => t === 'deal' ? deals.get(id) : (coll(t) || []).find(r => r.id === id);
  const list = t => t === 'deal' ? deals.list() : coll(t);
  const link = id => db.dealLinks[id] || (db.dealLinks[id] = { company:null, contacts:[] });
  const assoc = {
    companyOfContact: id => { const c = get('contact', id); return c && c.company ? get('company', c.company) : null; },
    contactsOfCompany: id => db.contacts.filter(c => c.company === id),
    dealsOfCompany: id => deals.list().filter(d => link(d.id).company === id),
    dealsOfContact: id => deals.list().filter(d => link(d.id).contacts.some(x => x.id === id)),
    contactsOfDeal: id => link(id).contacts.map(x => ({ ...get('contact', x.id), label: x.label })).filter(x => x.id),
    companyOfDeal: id => link(id).company ? get('company', link(id).company) : null,
  };
  function related(fromType, fromId, toType) {
    if (fromType === 'contact') return toType === 'company' ? [assoc.companyOfContact(fromId)].filter(Boolean) : toType === 'deal' ? assoc.dealsOfContact(fromId) : [];
    if (fromType === 'company') return toType === 'contact' ? assoc.contactsOfCompany(fromId) : toType === 'deal' ? assoc.dealsOfCompany(fromId) : [];
    if (fromType === 'deal') return toType === 'contact' ? assoc.contactsOfDeal(fromId) : toType === 'company' ? [assoc.companyOfDeal(fromId)].filter(Boolean) : [];
    return [];
  }
  function associate(aT, aId, bT, bId, label) {
    const pair = [aT, bT].sort().join('-'); const x = aT < bT ? [aId, bId] : [bId, aId]; // x theo thứ tự tên loại
    if (pair === 'company-contact') { get('contact', x[1]).company = x[0]; }
    if (pair === 'company-deal') { link(x[1]).company = x[0]; }
    if (pair === 'contact-deal') { const l = link(x[1]); if (!l.contacts.some(c => c.id === x[0])) l.contacts.push({ id:x[0], label: label || null }); }
    persist(); logEvent(aT, aId, `Đã liên kết với ${OBJ[bT].label.toLowerCase()} “${titleOf(bT, get(bT, bId))}”`, [[bT, bId]]);
  }
  function dissociate(aT, aId, bT, bId) {
    const pair = [aT, bT].sort().join('-'); const x = aT < bT ? [aId, bId] : [bId, aId];
    if (pair === 'company-contact') { const c = get('contact', x[1]); if (c.company === x[0]) c.company = null; }
    if (pair === 'company-deal') { if (link(x[1]).company === x[0]) link(x[1]).company = null; }
    if (pair === 'contact-deal') { const l = link(x[1]); l.contacts = l.contacts.filter(c => c.id !== x[0]); }
    persist();
  }
  const setLabel = (dealId, contactId, label) => { const c = link(dealId).contacts.find(x => x.id === contactId); if (c) { c.label = label || null; persist(); } };

  /* ── Tên hiển thị ── */
  const fullName = c => [c.values.lastname, c.values.firstname].filter(Boolean).join(' ') || c.values.email || '—';
  const titleOf = (t, r) => !r ? '—' : t === 'contact' ? fullName(r) : t === 'company' ? (r.values.name || '—') : HX.title(r);
  const initials = s => String(s).split(/\s+/).filter(Boolean).slice(-2).map(w => w[0]).join('').toUpperCase();

  const OBJ = {
    contact:{ label:'Contact', plural:'Contacts', icon:'person', list:'crm-contacts-hubspot.html', fields:CONTACT_FIELDS },
    company:{ label:'Company', plural:'Companies', icon:'domain', list:'crm-companies-hubspot.html', fields:COMPANY_FIELDS },
    deal:{ label:'Deal', plural:'Deals', icon:'handshake', list:'crm-giao-dich-hubspot.html', fields:HX.FIELDS },
  };
  const url = (t, id) => `crm-record-hubspot.html?type=${t}&id=${id}`;

  /* ── Ghi / sửa bản ghi ── */
  function update(t, id, key, value) {
    if (t === 'deal') { deals.update(id, key, value); return; }
    const r = get(t, id); const old = r.values[key]; r.values[key] = value; persist();
    if (key === 'lifecycle' && old !== value) logEvent(t, id, `Lifecycle stage: ${old || '—'} → ${value || '—'}`);
    if (key === 'owner' && old !== value) logEvent(t, id, `Đổi owner: ${old || '—'} → ${value || '—'}`);
  }
  function create(t, values, links = []) {
    const r = { id: (t === 'contact' ? 'ct' : 'co') + Date.now().toString(36), createdAt: new Date().toISOString(), values, company:null };
    coll(t).unshift(r); persist(); links.forEach(([bt, bid, label]) => bid && associate(t, r.id, bt, bid, label)); return r;
  }
  function remove(t, ids) {
    if (t === 'contact') { db.contacts = db.contacts.filter(c => !ids.includes(c.id)); Object.values(db.dealLinks).forEach(l => l.contacts = l.contacts.filter(c => !ids.includes(c.id))); }
    if (t === 'company') { db.companies = db.companies.filter(c => !ids.includes(c.id)); db.contacts.forEach(c => { if (ids.includes(c.company)) c.company = null; }); Object.values(db.dealLinks).forEach(l => { if (ids.includes(l.company)) l.company = null; }); }
    persist();
  }

  /* ── Activities ── */
  function logEvent(t, id, text, extra = [], title) {
    const refs = { contacts:[], companies:[], deals:[] }; const add = (tt, ii) => refs[tt === 'contact' ? 'contacts' : tt === 'company' ? 'companies' : 'deals'].push(ii);
    add(t, id); extra.forEach(([tt, ii]) => add(tt, ii));
    db.events.unshift({ id:'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), type:'SYSTEM', at:new Date().toISOString(), by: ME, body:text, ...(title ? { title } : {}), ...refs }); persist();
  }
  // Ghi lại mọi lần đổi giai đoạn Deal (từ board, bảng, panel, trang chi tiết)
  const origUpdate = deals.update.bind(deals);
  deals.update = (id, key, value) => { const r = deals.get(id), old = r ? r.values[key] : undefined; origUpdate(id, key, value);
    if (key === STAGE && old !== value) logEvent('deal', id, old ? `${ME} đã chuyển ${HX.title(r)} từ “${old}” sang “${value || '—'}”.` : `${ME} đã chuyển ${HX.title(r)} sang “${value}”.`, [...link(id).contacts.map(c => ['contact', c.id]), ...(link(id).company ? [['company', link(id).company]] : [])], 'Hoạt động Deal'); };
  const refKey = t => t === 'contact' ? 'contacts' : t === 'company' ? 'companies' : 'deals';
  function activitiesOf(t, id) {
    const k = refKey(t);
    const own = [...db.activities, ...db.events].filter(a => (a[k] || []).includes(id));
    const r = get(t, id);
    const created = r ? [{ id:'created-' + id, type:'SYSTEM', at: r.createdAt, by: t === 'deal' ? (r.values[SALE] || ME) : r.values.owner || ME, body:`${OBJ[t].label} này được tạo bởi ${t === 'deal' ? (r.values[SALE] || ME) : r.values.owner || ME}`, title:'Đã tạo' }] : [];
    return [...own, ...created].sort((a, b) => b.at.localeCompare(a.at));
  }
  // Liên kết tự động khi tạo hoạt động (như HubSpot): Contact → + Company + Deal đang mở; Deal → + Contacts + Company
  function autoRefs(t, id) {
    const refs = { contacts:[], companies:[], deals:[] }; refs[refKey(t)].push(id);
    if (t === 'contact') { const co = assoc.companyOfContact(id); if (co) refs.companies.push(co.id); assoc.dealsOfContact(id).filter(d => ![WON, LOST].includes(d.values[STAGE])).forEach(d => refs.deals.push(d.id)); }
    if (t === 'deal') { assoc.contactsOfDeal(id).forEach(c => refs.contacts.push(c.id)); const co = assoc.companyOfDeal(id); if (co) refs.companies.push(co.id); }
    return refs;
  }
  function addActivity(a) { const x = { id:'a' + Date.now().toString(36), at:new Date().toISOString(), by: ME, ...a }; db.activities.unshift(x); persist(); return x; }
  function updateActivity(id, patch) { const a = db.activities.find(x => x.id === id); if (a) { Object.assign(a, patch); persist(); } }
  function removeActivity(id) { db.activities = db.activities.filter(x => x.id !== id); persist(); }
  const lastContacted = (t, id) => { const a = activitiesOf(t, id).find(x => ['CALL','MEETING'].includes(x.type) && x.at <= new Date().toISOString()); return a ? a.at : null; };

  /* ── Line items ── */
  const liTotal = li => { const gross = (Number(li.qty) || 0) * (Number(li.price) || 0); const d = Number(li.disc) || 0; return Math.max(0, gross - (li.discType === '%' ? gross * d / 100 : d)); };
  const itemsOf = dealId => db.lineItems.filter(li => li.deal === dealId);
  function saveItems(dealId, items) {
    db.lineItems = [...db.lineItems.filter(li => li.deal !== dealId), ...items.map(li => ({ ...li, deal: dealId }))]; persist();
    const total = items.reduce((s, li) => s + liTotal(li), 0);
    if (HX.F[CASH]) deals.update(dealId, CASH, items.length ? total : deals.get(dealId).values[CASH]);
    logEvent('deal', dealId, `Cập nhật line items: ${items.length} dòng, tổng ${money(total)}`);
    return total;
  }
  const money = v => (Math.round(Number(v) || 0)).toLocaleString('vi-VN') + ' ₫';

  /* ── Định dạng ngày ── */
  const p2 = n => String(n).padStart(2, '0');
  const dt = s => { const d = new Date(s); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} lúc ${p2(d.getHours())}:${p2(d.getMinutes())}`; };
  const dOnly = s => { const d = new Date(s); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; };
  const monthLabel = s => { const d = new Date(s); return `Tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`; };

  /* ═══ UI dùng chung ═══ */

  /* Danh sách thuộc tính sửa tại chỗ (dùng HX.editor để giữ đúng trình sửa theo loại trường) */
  function props(box, t, r, keys, onChange = () => {}) {
    const fields = keys ? keys.map(k => OBJ[t].fields.find(f => f.key === k)).filter(Boolean) : OBJ[t].fields;
    box.innerHTML = fields.map(f => `<div class="prop" data-k="${f.key}"><label>${esc(f.name)}</label><div class="v">${display(r.values[f.key], f)}</div></div>`).join('');
    box.onclick = e => {
      const pr = e.target.closest('.prop'); if (!pr || pr.querySelector('.ed,.selcell')) return;
      const f = fields.find(x => x.key === pr.dataset.k), v = pr.querySelector('.v');
      v.replaceChildren(editor(f, r.values[f.key], nv => { if (nv !== r.values[f.key]) { update(t, r.id, f.key, nv); toast(`Đã lưu “${f.name}”`); onChange(f.key); } props(box, t, r, keys, onChange); }, () => props(box, t, r, keys, onChange), 'page'));
    };
  }

  /* Panel tạo Contact / Company (HubSpot "Create Contact"), có mục "Liên kết với" */
  function createPanel(t, opts = {}) {
    const p = $('#panel'); const o = OBJ[t];
    const fields = t === 'contact' ? ['email','firstname','lastname','owner','jobtitle','phone','lifecycle','leadstatus','source'] : ['domain','name','owner','industry','city','country','phone','lifecycle','leadstatus','employees'];
    const inp = f => f.type === 'SELECT' || f.type === 'USER'
      ? `<select class="in" id="cf_${f.key}"><option value="">— Chọn —</option>${(f.type === 'USER' ? USERS : f.choices).map(c => `<option ${c === (opts.preset || {})[f.key] || (f.type === 'USER' && c === ME && !(opts.preset || {})[f.key]) || (f.key === 'lifecycle' && c === 'Lead' && !(opts.preset || {})[f.key]) ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>`
      : `<input class="in" id="cf_${f.key}" type="${f.type === 'NUMBER' ? 'number' : f.key === 'email' ? 'email' : 'text'}" value="${esc((opts.preset || {})[f.key] || '')}">`;
    const other = t === 'contact' ? 'company' : 'contact';
    const af = opts.assocFrom; // mở từ card liên kết → giữ 2 tab Tạo mới / Thêm có sẵn như HubSpot
    p.innerHTML = `<div class="pn-h"><h2>${af ? 'Thêm ' + o.label : 'Tạo ' + o.label}</h2><button class="btn btn--text btn--icon" data-pclose aria-label="Đóng"><span class="ms">close</span></button></div>
      ${af ? `<div class="pn-tabs" role="tablist"><button class="pn-tab" role="tab" aria-selected="true" data-t="new">Tạo mới</button><button class="pn-tab" role="tab" aria-selected="false" data-t="ex">Thêm có sẵn</button></div>` : ''}
      <form class="pn-b field-form" id="cf">${fields.map(k => { const f = o.fields.find(x => x.key === k); return `<label for="cf_${k}">${esc(f.name)}${k === (t === 'contact' ? 'email' : 'name') ? ' <span class="req">*</span>' : ''}${inp(f)}</label>`; }).join('')}
        <div class="assoc-sec"><b>Liên kết ${o.label} với</b>
          ${t === 'contact' ? `<label>Company<select class="in" id="cf__company"><option value="">— Không —</option>${db.companies.map(c => `<option value="${c.id}" ${c.id === opts.company ? 'selected' : ''}>${esc(c.values.name)}</option>`).join('')}</select></label>` : ''}
          <label>Deal<select class="in" id="cf__deal"><option value="">— Không —</option>${deals.list().map(d => `<option value="${d.id}" ${d.id === opts.deal ? 'selected' : ''}>${esc(HX.title(d))} — ${esc(d.values.t_n_deal || '')}</option>`).join('')}</select></label>
        </div><p class="err" id="cfErr" role="alert"></p></form>
      <div class="pn-f"><button class="btn btn--primary" id="cfSave">Tạo</button><button class="btn btn--secondary" id="cfMore">Tạo và thêm tiếp</button><button class="btn btn--text" data-pclose>Huỷ</button></div>`;
    const submit = more => {
      const values = {}; fields.forEach(k => { const f = o.fields.find(x => x.key === k); let v = $('#cf_' + k, p).value.trim(); values[k] = v === '' ? null : f.type === 'NUMBER' ? Number(v) : v; });
      const need = t === 'contact' ? 'email' : 'name';
      if (t === 'contact' && !values.email && !values.firstname && !values.lastname) { $('#cfErr', p).textContent = 'Nhập email hoặc họ tên của Contact'; return; }
      if (t === 'company' && !values.name && !values.domain) { $('#cfErr', p).textContent = 'Nhập tên công ty hoặc domain'; return; }
      if (t === 'company' && !values.name) values.name = values.domain;
      const links = [];
      if (t === 'contact' && $('#cf__company', p).value) links.push(['company', $('#cf__company', p).value]);
      if ($('#cf__deal', p).value) links.push(['deal', $('#cf__deal', p).value]);
      const r = create(t, values, links); toast(`Đã tạo ${o.label.toLowerCase()} “${titleOf(t, r)}”`); opts.onCreated && opts.onCreated(r);
      if (more) createPanel(t, opts); else HX.closePanel();
      void need;
    };
    p.onclick = e => { if (e.target.closest('[data-pclose]')) HX.closePanel(); if (e.target.closest('#cfSave')) submit(false); if (e.target.closest('#cfMore')) submit(true);
      if (af && e.target.closest('.pn-tab[data-t="ex"]')) addAssocPanel(af[0], af[1], t, af[2], 'ex'); };
    p.onkeydown = e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); submit(false); } };
    document.body.classList.remove('dock'); p.classList.add('open'); document.body.classList.add('panel-open'); setTimeout(() => $('#cf .in', p).focus(), 60);
  }

  /* Panel "+ Add" trên card liên kết: Create new / Add existing (HubSpot) */
  function addAssocPanel(fromT, fromId, toT, onDone, startTab = 'new') {
    if (toT !== 'deal' && startTab === 'new') { createPanel(toT, { company: fromT === 'company' ? fromId : toT === 'contact' && fromT === 'deal' ? link(fromId).company : null, deal: fromT === 'deal' ? fromId : null,
      assocFrom:[fromT, fromId, onDone], onCreated: r => { if (fromT === 'contact' && toT === 'company') associate('contact', fromId, 'company', r.id); onDone && onDone(); } }); return; }
    const p = $('#panel'); const o = OBJ[toT]; const from = get(fromT, fromId);
    const already = new Set(related(fromT, fromId, toT).map(x => x.id));
    p.innerHTML = `<div class="pn-h"><h2>${toT === 'deal' ? 'Tạo Deal' : 'Thêm ' + o.label}</h2><button class="btn btn--text btn--icon" data-pclose aria-label="Đóng"><span class="ms">close</span></button></div>
      <div class="pn-tabs" role="tablist"><button class="pn-tab" role="tab" aria-selected="true" data-t="new">Tạo mới</button><button class="pn-tab" role="tab" aria-selected="false" data-t="ex">Thêm có sẵn</button></div>
      <div class="pn-b" id="aaB"></div><div class="pn-f" id="aaF"></div>`;
    const tabNew = () => {
      if (toT === 'deal') {
        const co = fromT === 'company' ? from : fromT === 'contact' ? assoc.companyOfContact(fromId) : null;
        $('#aaB', p).innerHTML = `<form class="field-form" id="adF">
          <label>Tên Deal <span class="req">*</span><input class="in" id="ad_name" value="${esc((co ? co.values.name : titleOf(fromT, from)) + ' - New Deal')}"></label>
          <label>Pipeline <span class="req">*</span><select class="in" disabled><option>Deals_Pipeline</option></select></label>
          <label>Giai Đoạn Pipeline <span class="req">*</span><select class="in" id="ad_stage">${STAGES.map(s => `<option>${esc(s)}</option>`).join('')}</select></label>
          <label>Tổng Cash-In Dự Kiến (Amount)<input class="in" id="ad_amt" type="number" min="0"></label>
          <label>Ngày Dự Kiến Chốt<input class="in" id="ad_close" type="date"></label>
          <label>Sale phụ trách<select class="in" id="ad_owner">${USERS.map(u => `<option ${u === (from.values.owner || ME) ? 'selected' : ''}>${u}</option>`).join('')}</select></label>
          <div class="assoc-sec"><b>Liên kết Deal với</b><div class="nil" style="font-size:13px">${co ? `Company: <b>${esc(co.values.name)}</b>` : ''}${fromT === 'contact' ? `${co ? ' · ' : ''}Contact: <b>${esc(fullName(from))}</b>` : ''}${fromT === 'company' ? ` · ${assoc.contactsOfCompany(fromId).length} contact của công ty` : ''}</div></div></form>`;
        $('#aaF', p).innerHTML = `<button class="btn btn--primary" id="adGo">Tạo</button><button class="btn btn--text" data-pclose>Huỷ</button>`;
        $('#adGo', p).onclick = () => {
          const name = $('#ad_name', p).value.trim(); if (!name) { $('#ad_name', p).focus(); return; }
          const num = String(deals.list().length + 1).padStart(4, '0');
          const values = {}; HX.FIELDS.forEach(f => values[f.key] = null);
          Object.assign(values, { m_deal:'DEAL-' + num, t_n_deal:name, [STAGE]: $('#ad_stage', p).value, [CASH]: $('#ad_amt', p).value ? Number($('#ad_amt', p).value) : null, [CLOSE]: $('#ad_close', p).value || null, [SALE]: $('#ad_owner', p).value, t_l_th_nh_c_ng: 10, ng_y_c_p_nh_t_g_n_nh_t: new Date().toISOString() });
          const d = deals.create(values);
          if (co) associate('deal', d.id, 'company', co.id);
          if (fromT === 'contact') associate('deal', d.id, 'contact', fromId, 'Người quyết định');
          if (fromT === 'company') assoc.contactsOfCompany(fromId).forEach(c => associate('deal', d.id, 'contact', c.id));
          HX.closePanel(); toast(`Đã tạo Deal “${name}”`); onDone && onDone();
        };
      } else { addAssocPanel(fromT, fromId, toT, onDone, 'new'); }
    };
    const tabEx = () => {
      $('#aaB', p).innerHTML = `<label class="srch2"><span class="ms sm">search</span><input id="aaQ" placeholder="Tìm ${o.plural.toLowerCase()}" aria-label="Tìm"></label>
        ${toT === 'contact' && fromT === 'deal' ? `<label class="field-form" style="margin-top:10px"><span style="font-size:13px;font-weight:600">Nhãn liên kết</span><select class="in" id="aaLbl"><option value="">— Không nhãn —</option>${ASSOC_LABELS.map(l => `<option>${l}</option>`).join('')}</select></label>` : ''}
        <div class="aa-list" id="aaL"></div>`;
      const draw = q => { const rows = list(toT).filter(r => !already.has(r.id) && (!q || titleOf(toT, r).toLowerCase().includes(q) || (r.values.email || r.values.domain || r.values.t_n_deal || '').toLowerCase().includes(q))).slice(0, 60);
        $('#aaL', p).innerHTML = rows.length ? rows.map(r => `<label class="aa-it"><input type="checkbox" value="${r.id}"><span><b>${esc(titleOf(toT, r))}</b><small>${esc(toT === 'contact' ? (r.values.email || '') : toT === 'company' ? (r.values.domain || '') : (r.values.t_n_deal || ''))}</small></span></label>`).join('') : '<div class="nil" style="padding:16px 0">Không có kết quả</div>'; };
      draw(''); $('#aaQ', p).oninput = e => draw(e.target.value.trim().toLowerCase()); $('#aaQ', p).focus();
      $('#aaF', p).innerHTML = `<button class="btn btn--primary" id="aaGo">Lưu</button><button class="btn btn--text" data-pclose>Huỷ</button>`;
      $('#aaGo', p).onclick = () => { const ids = [...p.querySelectorAll('#aaL input:checked')].map(i => i.value); if (!ids.length) { toast('Chọn ít nhất 1 bản ghi'); return; }
        if (toT === 'company' && fromT === 'contact' && ids.length > 1) { toast('Contact chỉ có 1 công ty chính — chọn 1 công ty'); return; }
        ids.forEach(i => associate(fromT, fromId, toT, i, $('#aaLbl', p) ? $('#aaLbl', p).value : null)); HX.closePanel(); toast(`Đã liên kết ${ids.length} ${o.label.toLowerCase()}`); onDone && onDone(); };
    };
    p.onclick = e => { const tb = e.target.closest('.pn-tab'); if (tb) { p.querySelectorAll('.pn-tab').forEach(b => b.setAttribute('aria-selected', b === tb)); tb.dataset.t === 'new' ? tabNew() : tabEx(); }
      if (e.target.closest('[data-pclose]')) HX.closePanel(); };
    p.onkeydown = null; if (startTab === 'ex') { p.querySelectorAll('.pn-tab').forEach(b => b.setAttribute('aria-selected', b.dataset.t === 'ex')); tabEx(); } else tabNew();
    document.body.classList.remove('dock'); p.classList.add('open'); document.body.classList.add('panel-open');
  }

  /* Card liên kết ở cột phải của record page */
  function assocCard(el, fromT, fromId, toT, refresh) {
    const rows = related(fromT, fromId, toT); const o = OBJ[toT];
    const item = r => {
      const cco = toT === 'contact' ? assoc.companyOfContact(r.id) : null;
      const lines = toT === 'contact' ? [...(cco ? [['', esc(cco.values.name)]] : []), ['Email', r.values.email ? `<a class="lk" href="mailto:${esc(r.values.email)}">${esc(r.values.email)}</a><button class="ac-cp" data-accp="${esc(r.values.email)}" aria-label="Sao chép email"><span class="ms xs">content_copy</span></button>` : '—'], ['Số điện thoại', esc(r.values.phone || '—')]]
        : toT === 'company' ? [['Domain công ty', r.values.domain ? `<a class="lk" href="https://${esc(r.values.domain)}" target="_blank" rel="noopener">${esc(r.values.domain)}<span class="ms xs" style="vertical-align:-3px">open_in_new</span></a><button class="ac-cp" data-accp="${esc(r.values.domain)}" aria-label="Sao chép domain"><span class="ms xs">content_copy</span></button>` : '—'], ['Số điện thoại', esc(r.values.phone || '—')]]
        : [['Amount', HX.F[CASH] ? esc(fmt(r.values[CASH], HX.F[CASH]) || '—') : '—'], ['Ngày chốt', r.values[CLOSE] ? dOnly(r.values[CLOSE]) : '—'], ['Giai đoạn', HX.F[STAGE] ? display(r.values[STAGE], HX.F[STAGE]) : '—']];
      const primary = (fromT === 'contact' && toT === 'company') || (fromT === 'deal' && toT === 'company');
      return `<div class="ac-it"><div class="ac-top"><span class="av sm">${esc(initials(titleOf(toT, r)))}</span><a href="${url(toT, r.id)}" class="ac-name">${esc(titleOf(toT, r))}</a>${primary ? '<span class="tag pk">Primary</span>' : ''}
          <button class="btn btn--text btn--icon ac-more" data-acm="${r.id}" aria-label="Tuỳ chọn liên kết"><span class="ms sm">more_horiz</span></button></div>
        ${lines.map(([k, v]) => `<div class="ac-ln">${k ? `<span>${k}:</span> ` : ''}${v}</div>`).join('')}
        ${fromT === 'deal' && toT === 'contact' ? `<button class="ac-lbl" data-lbl="${r.id}">${r.label ? `<span class="tag">${esc(r.label)}</span>` : 'Thêm nhãn liên kết'}</button>` : fromT === 'company' && toT === 'contact' && cco && cco.id === fromId ? `<span class="tag" style="align-self:flex-start;margin-top:4px">Contact với công ty chính</span>` : toT !== 'deal' ? `<button class="ac-lbl" data-toast="Nhãn liên kết Contact ↔ Company (vd. Nhân viên, Người quyết định) — cần bảng liên kết có cột nhãn ở ERP">Thêm nhãn liên kết</button>` : ''}</div>`;
    };
    el.innerHTML = `<div class="ch"><span class="ms sm">expand_more</span>${o.plural} (${rows.length})<span class="r"><button class="btn btn--text sm" data-acadd><span class="ms xs">add</span>Thêm</button><button class="btn btn--text btn--icon" data-toast="Chọn thuộc tính hiển thị trên card ${o.plural} (mockup)" aria-label="Cài đặt card"><span class="ms sm">settings</span></button></span></div>
      <div class="cb">${rows.length ? rows.map(item).join('') : `<div class="ac-empty"><span class="ms">${o.icon}</span>${toT === 'deal' ? 'Theo dõi cơ hội doanh thu liên kết với bản ghi này.' : toT === 'company' ? 'Xem doanh nghiệp liên kết với bản ghi này.' : 'Xem những người liên kết với bản ghi này.'}</div>`}
      ${rows.length ? `<a class="ac-all" href="${o.list}">Xem tất cả ${o.plural} liên kết <span class="ms xs">open_in_new</span></a>` : ''}</div><div class="pop" id="acPop-${toT}"></div>`;
    el.onclick = e => {
      if (e.target.closest('[data-acadd]')) { addAssocPanel(fromT, fromId, toT, refresh); return; }
      const cp = e.target.closest('[data-accp]'); if (cp) { navigator.clipboard?.writeText(cp.dataset.accp).catch(() => {}); toast('Đã sao chép'); return; }
      const lb = e.target.closest('[data-lbl]'); if (lb) { const pop = el.querySelector('.pop'); place(pop, lb, el); pop.innerHTML = `<div class="hd">Nhãn liên kết</div>` + ['', ...ASSOC_LABELS].map(l => `<button class="mi" data-setlbl="${esc(l)}" data-cid="${lb.dataset.lbl}">${l || '— Không nhãn —'}</button>`).join(''); pop.classList.add('open'); e.stopPropagation(); return; }
      const sl = e.target.closest('[data-setlbl]'); if (sl) { setLabel(fromId, sl.dataset.cid, sl.dataset.setlbl); refresh(); toast('Đã cập nhật nhãn'); return; }
      const m = e.target.closest('[data-acm]'); if (m) { const pop = el.querySelector('.pop'); place(pop, m, el);
        pop.innerHTML = `<a class="mi" href="${url(toT, m.dataset.acm)}"><span class="ms sm">open_in_new</span>Mở bản ghi</a><button class="mi" data-unlink="${m.dataset.acm}" style="color:var(--error)"><span class="ms sm">link_off</span>Gỡ liên kết</button>`; pop.classList.add('open'); e.stopPropagation(); return; }
      const ul = e.target.closest('[data-unlink]'); if (ul) { const r = get(toT, ul.dataset.unlink);
        confirmBox('Gỡ liên kết', `Gỡ liên kết giữa “${esc(titleOf(fromT, get(fromT, fromId)))}” và “${esc(titleOf(toT, r))}”? Hai bản ghi vẫn được giữ nguyên.`, 'Gỡ liên kết', () => { dissociate(fromT, fromId, toT, ul.dataset.unlink); refresh(); toast('Đã gỡ liên kết'); }); }
    };
  }
  function place(pop, anchor, host) { const r = anchor.getBoundingClientRect(), h = host.getBoundingClientRect(); pop.style.left = Math.max(4, Math.min(r.left - h.left, h.width - 230)) + 'px'; pop.style.top = (r.bottom - h.top + 4) + 'px'; pop.style.right = 'auto'; }
  document.addEventListener('click', e => { if (!e.target.closest('.pop')) document.querySelectorAll('.card .pop.open, .tl .pop.open').forEach(p => p.classList.remove('open')); });

  /* ── Timeline hoạt động (cột giữa) ── */
  const ICON = { NOTE:'sticky_note_2', TASK:'task_alt', MEETING:'event', CALL:'call', SYSTEM:'history', EMAIL:'mail' };
  const TNAME = { NOTE:'Ghi chú', TASK:'Task', MEETING:'Cuộc họp', CALL:'Cuộc gọi', SYSTEM:'Hoạt động hệ thống', EMAIL:'Email' };
  const TABS = [['ALL','Tất cả hoạt động'],['NOTE','Ghi chú'],['EMAIL','Emails'],['CALL','Cuộc gọi'],['TASK','Tasks'],['MEETING','Cuộc họp']];
  function timeline(el, t, id, onChange = () => {}) {
    const st = { tab:'ALL', q:'', range:0, types:new Set(['NOTE','TASK','MEETING','CALL','SYSTEM']), collapsed:false };
    const refsName = a => { const out = []; (a.contacts || []).forEach(i => { const r = get('contact', i); if (r) out.push(fullName(r)); }); (a.companies || []).forEach(i => { const r = get('company', i); if (r) out.push(r.values.name); }); (a.deals || []).forEach(i => { const r = get('deal', i); if (r) out.push(HX.title(r)); }); return out; };
    const card = a => {
      const who = a.type === 'SYSTEM' ? '' : ` bởi <b>${esc(a.by)}</b>`;
      const head = a.type === 'TASK' ? `<button class="tk ${a.done ? 'on' : ''}" data-done="${a.id}" aria-label="${a.done ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}"><span class="ms sm">${a.done ? 'check_circle' : 'radio_button_unchecked'}</span></button><b class="${a.done ? 'strike' : ''}">${esc(a.title || a.body)}</b>`
        : a.type === 'MEETING' ? `<b>${esc(a.title || 'Cuộc họp')}</b>` : a.type === 'SYSTEM' && a.title ? `<b>${esc(a.title)}</b>${a.title === 'Hoạt động Deal' ? '<span class="ms xs" style="color:var(--on-surface-variant)">handshake</span>' : ''}` : `<b>${TNAME[a.type]}</b><span class="nil">${who}</span>`;
      const meta = a.type === 'TASK' ? `<div class="tm">Hạn: <b>${a.due ? dOnly(a.due) : '—'}</b> · Ưu tiên: ${esc(a.prio || 'Không')} · Người làm: ${esc(a.assignee || a.by)}${!a.done && a.due && a.due < TODAY.toISOString().slice(0, 10) ? ' · <span class="od">Quá hạn</span>' : ''}</div>`
        : a.type === 'MEETING' ? `<div class="tm">${dt(a.at)} · ${a.dur || 30} phút · Kết quả: <b>${esc(a.outcome || '—')}</b>${(a.attendees || []).length ? ' · Tham dự: ' + a.attendees.map(i => get('contact', i)).filter(Boolean).map(fullName).map(esc).join(', ') : ''}</div>`
        : a.type === 'CALL' ? `<div class="tm">${esc(a.dir || 'Gọi đi')} · Kết quả: <b>${esc(a.outcome || '—')}</b></div>` : '';
      const rn = refsName(a);
      return `<article class="ta ${a.type === 'SYSTEM' ? 'sys' : ''}" data-aid="${a.id}"><div class="ta-h"><span class="ms sm ic">${ICON[a.type]}</span>${head}<time>${dt(a.at)}</time>
          ${a.type === 'SYSTEM' ? '' : `<button class="btn btn--text btn--icon" data-amenu="${a.id}" aria-label="Tuỳ chọn hoạt động"><span class="ms sm">more_horiz</span></button>`}</div>
        <div class="ta-b">${meta}${a.type === 'TASK' ? (a.body && a.body !== a.title ? `<p>${esc(a.body)}</p>` : '') : `<p>${esc(a.body || '')}</p>`}
          ${rn.length > 1 ? `<div class="ta-f"><span class="ms xs">link</span>${rn.length} liên kết: ${rn.map(esc).join(', ')}</div>` : ''}</div></article>`;
    };
    const draw = () => {
      let all = activitiesOf(t, id);
      const total = all.length;
      if (st.tab !== 'ALL') all = all.filter(a => a.type === st.tab);
      all = all.filter(a => st.types.has(a.type) || st.tab !== 'ALL');
      if (st.range) all = all.filter(a => new Date(a.at) >= new Date(TODAY.getTime() - st.range * 864e5));
      if (st.q) all = all.filter(a => `${a.title || ''} ${a.body || ''} ${a.by || ''}`.toLowerCase().includes(st.q));
      const up = all.filter(a => (a.type === 'TASK' && !a.done) || (a.type === 'MEETING' && a.at > TODAY.toISOString()));
      const past = all.filter(a => !up.includes(a));
      const groups = []; past.forEach(a => { const m = monthLabel(a.at); const g = groups.find(x => x.m === m); g ? g.items.push(a) : groups.push({ m, items:[a] }); });
      el.querySelector('.tl-body').innerHTML = (st.tab === 'EMAIL' ? `<div class="soon"><span class="ms">mail</span>Gửi và ghi email nằm ngoài phạm vi giai đoạn 2 (chờ khách chốt).</div>` : '')
        + (up.length ? `<h4 class="tl-m">Sắp tới</h4>${up.map(card).join('')}` : '')
        + groups.map(g => `<h4 class="tl-m">${g.m}</h4>${g.items.map(card).join('')}`).join('')
        + (!all.length && st.tab !== 'EMAIL' ? `<div class="soon"><span class="ms">history</span>Chưa có hoạt động phù hợp.</div>` : '');
      el.querySelector('#tlCount').textContent = `Hoạt động (${st.types.size}/5)`;
      el.classList.toggle('collapsed', st.collapsed);
      void total;
    };
    el.innerHTML = `<div class="tl-tabs" role="tablist">${TABS.map(([k, l]) => `<button role="tab" aria-selected="${k === 'ALL'}" data-tt="${k}">${l}</button>`).join('')}</div>
      <div class="tl-tools"><label class="srch2"><input id="tlQ" placeholder="Tìm hoạt động" aria-label="Tìm hoạt động"><span class="ms sm">search</span></label>
        <button class="btn btn--secondary sm" id="tlCol">Thu gọn tất cả</button></div>
      <div class="tl-tools"><button class="fchip2" id="tlTypes"><span id="tlCount"></span><span class="ms xs">arrow_drop_down</span></button>
        <select class="fchip2" id="tlRange" aria-label="Khoảng thời gian"><option value="0">Mọi thời gian</option><option value="7">7 ngày qua</option><option value="30">30 ngày qua</option><option value="90">90 ngày qua</option></select></div>
      <div class="tl-body"></div><div class="pop" id="tlPop"></div>`;
    el.classList.add('tl');
    el.onclick = e => {
      const tb = e.target.closest('[data-tt]'); if (tb) { st.tab = tb.dataset.tt; el.querySelectorAll('[data-tt]').forEach(b => b.setAttribute('aria-selected', b === tb)); draw(); return; }
      if (e.target.closest('#tlCol')) { st.collapsed = !st.collapsed; e.target.closest('#tlCol').textContent = st.collapsed ? 'Mở rộng tất cả' : 'Thu gọn tất cả'; draw(); return; }
      if (e.target.closest('#tlTypes')) { const pop = $('#tlPop', el); place(pop, e.target.closest('#tlTypes'), el);
        pop.innerHTML = `<div class="hd">Loại hoạt động</div>${['NOTE','TASK','MEETING','CALL','SYSTEM'].map(k => `<label class="mi"><input type="checkbox" data-ty="${k}" ${st.types.has(k) ? 'checked' : ''}>${TNAME[k]}</label>`).join('')}`; pop.classList.add('open'); e.stopPropagation(); return; }
      const dn = e.target.closest('[data-done]'); if (dn) { const a = db.activities.find(x => x.id === dn.dataset.done); updateActivity(a.id, { done: !a.done }); toast(a.done ? 'Đã hoàn thành task' : 'Đã mở lại task'); draw(); onChange(); return; }
      const am = e.target.closest('[data-amenu]'); if (am) { const pop = $('#tlPop', el); place(pop, am, el); pop.innerHTML = `<button class="mi" data-adel="${am.dataset.amenu}" style="color:var(--error)"><span class="ms sm">delete</span>Xoá hoạt động</button>`; pop.classList.add('open'); e.stopPropagation(); return; }
      const ad = e.target.closest('[data-adel]'); if (ad) { $('#tlPop', el).classList.remove('open'); confirmBox('Xoá hoạt động', 'Xoá hoạt động này khỏi mọi bản ghi liên kết?', 'Xoá', () => { removeActivity(ad.dataset.adel); draw(); onChange(); toast('Đã xoá hoạt động'); }); }
    };
    el.addEventListener('change', e => { const ty = e.target.dataset.ty; if (ty) { e.target.checked ? st.types.add(ty) : st.types.delete(ty); draw(); } if (e.target.id === 'tlRange') { st.range = Number(e.target.value); draw(); } });
    el.querySelector('#tlQ').oninput = e => { st.q = e.target.value.trim().toLowerCase(); draw(); };
    draw();
    return { draw, show: tab => { const b = el.querySelector(`[data-tt="${tab}"]`); b && b.click(); } };
  }

  /* ── Cửa sổ soạn hoạt động (góc phải dưới như HubSpot) ── */
  function composer(t, id, type, onSaved) {
    if (type === 'EMAIL') { toast('Gửi / ghi email nằm ngoài phạm vi giai đoạn 2'); return; }
    document.querySelector('.composer')?.remove();
    const refs = autoRefs(t, id);
    const ctx = t === 'deal' ? assoc.contactsOfDeal(id) : t === 'company' ? assoc.contactsOfCompany(id) : [get('contact', id)];
    const today = TODAY.toISOString().slice(0, 10);
    const F = {
      NOTE: `<textarea class="in" id="cmBody" rows="6" placeholder="Bắt đầu ghi chú…"></textarea>`,
      TASK: `<input class="in" id="cmTitle" placeholder="Nhập tên task"><div class="cm-row"><label>Ngày đến hạn<input class="in" type="date" id="cmDue" value="${addDays(TODAY.toISOString(), 3).slice(0, 10)}"></label>
        <label>Loại<select class="in" id="cmKind"><option>To-do</option><option>Gọi điện</option><option>Email</option></select></label><label>Ưu tiên<select class="in" id="cmPrio"><option>Không</option><option>Thấp</option><option selected>Trung bình</option><option>Cao</option></select></label></div>
        <label>Người thực hiện<select class="in" id="cmAs">${USERS.map(u => `<option ${u === ME ? 'selected' : ''}>${u}</option>`).join('')}</select></label><textarea class="in" id="cmBody" rows="3" placeholder="Ghi chú…"></textarea>`,
      MEETING: `<input class="in" id="cmTitle" placeholder="Tiêu đề cuộc họp"><div class="cm-row"><label>Ngày<input class="in" type="date" id="cmDay" value="${today}"></label><label>Giờ<input class="in" type="time" id="cmTime" value="10:00"></label>
        <label>Thời lượng<select class="in" id="cmDur"><option>15</option><option selected>30</option><option>45</option><option>60</option><option>90</option></select></label></div>
        <label>Kết quả<select class="in" id="cmOut"><option>Đã lên lịch</option><option>Đã hoàn thành</option><option>Đổi lịch</option><option>Không đến</option><option>Huỷ</option></select></label>
        <div class="cm-att"><b>Người tham dự</b>${ctx.filter(Boolean).map(c => `<label><input type="checkbox" value="${c.id}" checked>${esc(fullName(c))}</label>`).join('') || '<span class="nil">Chưa có contact liên kết</span>'}</div>
        <textarea class="in" id="cmBody" rows="3" placeholder="Mô tả…"></textarea>`,
      CALL: `<div class="cm-row"><label>Kết quả cuộc gọi<select class="in" id="cmOut"><option>Đã kết nối</option><option>Bận</option><option>Không nghe máy</option><option>Để lại tin nhắn</option><option>Sai số</option></select></label>
        <label>Hướng<select class="in" id="cmDir"><option>Gọi đi</option><option>Gọi đến</option></select></label></div><div class="cm-row"><label>Ngày<input class="in" type="date" id="cmDay" value="${today}"></label><label>Giờ<input class="in" type="time" id="cmTime" value="${p2(new Date().getHours())}:${p2(new Date().getMinutes())}"></label></div>
        <textarea class="in" id="cmBody" rows="4" placeholder="Mô tả cuộc gọi…"></textarea>`,
    };
    const names = [...refs.contacts.map(i => get('contact', i)).filter(Boolean).map(fullName), ...refs.companies.map(i => get('company', i)).filter(Boolean).map(c => c.values.name), ...refs.deals.map(i => get('deal', i)).filter(Boolean).map(HX.title)];
    const w = document.createElement('section'); w.className = 'composer'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', TNAME[type]);
    w.innerHTML = `<header><span class="ms sm">${ICON[type]}</span><b>${type === 'CALL' ? 'Ghi lại cuộc gọi' : type === 'MEETING' ? 'Ghi lại / lên lịch cuộc họp' : type === 'TASK' ? 'Tạo task' : 'Ghi chú'}</b><button class="btn btn--text btn--icon" data-cmx aria-label="Đóng"><span class="ms sm">close</span></button></header>
      <div class="cm-b field-form">${F[type]}<div class="cm-assoc"><span class="ms xs">link</span>Liên kết với ${names.length} bản ghi: ${names.map(esc).join(', ')}</div><p class="err" id="cmErr"></p></div>
      <footer><button class="btn btn--primary" id="cmSave">${type === 'TASK' ? 'Tạo' : type === 'NOTE' ? 'Lưu ghi chú' : 'Lưu'}</button><button class="btn btn--text" data-cmx>Huỷ</button></footer>`;
    document.body.appendChild(w);
    const v = s => { const e = w.querySelector(s); return e ? e.value.trim() : ''; };
    w.querySelector('.in').focus();
    w.onclick = e => {
      if (e.target.closest('[data-cmx]')) { w.remove(); return; }
      if (!e.target.closest('#cmSave')) return;
      const body = v('#cmBody'), title = v('#cmTitle');
      if (type === 'NOTE' && !body) { w.querySelector('#cmErr').textContent = 'Nhập nội dung ghi chú'; return; }
      if ((type === 'TASK' || type === 'MEETING') && !title) { w.querySelector('#cmErr').textContent = type === 'TASK' ? 'Nhập tên task' : 'Nhập tiêu đề cuộc họp'; w.querySelector('#cmTitle').focus(); return; }
      const at = (type === 'MEETING' || type === 'CALL') ? new Date(`${v('#cmDay')}T${v('#cmTime') || '09:00'}:00+07:00`).toISOString() : new Date().toISOString();
      const a = { type, at, body, ...refs };
      if (type === 'TASK') Object.assign(a, { title, due: v('#cmDue'), prio: v('#cmPrio'), kind: v('#cmKind'), assignee: v('#cmAs'), done:false });
      if (type === 'MEETING') Object.assign(a, { title, dur: Number(v('#cmDur')), outcome: v('#cmOut'), attendees: [...w.querySelectorAll('.cm-att input:checked')].map(i => i.value) });
      if (type === 'CALL') Object.assign(a, { outcome: v('#cmOut'), dir: v('#cmDir') });
      addActivity(a); w.remove(); toast(`Đã lưu ${TNAME[type].toLowerCase()}`); onSaved && onSaved(type);
    };
    w.onkeydown = e => { if (e.key === 'Escape') w.remove(); };
  }

  /* ── Line items: card + trình sửa ── */
  function lineItemsCard(el, dealId, refresh) {
    const items = itemsOf(dealId); const total = items.reduce((s, li) => s + liTotal(li), 0);
    el.innerHTML = `<div class="ch"><span class="ms sm">expand_more</span>Line items (${items.length})<span class="r"><button class="btn btn--text sm" data-liedit>${items.length ? '<span class="ms xs">edit</span>Sửa' : '<span class="ms xs">add</span>Thêm'}</button></span></div>
      <div class="cb">${items.length ? items.map(li => `<div class="li-r"><span class="nm">${esc(li.name)}</span><span class="nil">${li.qty} × ${money(li.price).replace(' ₫', '')}</span><b>${money(liTotal(li))}</b></div>`).join('') + `<div class="li-t"><span>Tổng</span><b>${money(total)}</b></div>`
        : `<div class="ac-empty"><span class="ms">receipt_long</span>Thêm sản phẩm, dịch vụ vào Deal. Tổng line item sẽ thành Amount của Deal.</div>`}</div>`;
    el.onclick = e => { if (e.target.closest('[data-liedit]')) lineItemEditor(dealId, refresh); };
  }
  function lineItemEditor(dealId, refresh) {
    let items = itemsOf(dealId).map(li => ({ ...li, custom:{ ...(li.custom || {}) } }));
    let shown = db.liFields.map(f => f.key);
    const d = deals.get(dealId);
    HX.modal(`<div class="modal xl lie" role="dialog" aria-modal="true" aria-labelledby="lieT">
      <div class="mh" id="lieT">Line items · ${esc(HX.title(d))}<button class="btn btn--text btn--icon x" data-close aria-label="Đóng"><span class="ms">close</span></button></div>
      <div class="lie-bar"><div style="position:relative"><button class="btn btn--primary sm" id="lieLib"><span class="ms xs">inventory_2</span>Chọn từ thư viện sản phẩm</button><div class="pop" id="liePop" style="top:34px;left:0;width:340px"></div></div>
        <button class="btn btn--secondary sm" id="lieCustom"><span class="ms xs">add</span>Tạo line item tùy chỉnh</button>
        <div style="position:relative;margin-left:auto"><button class="btn btn--secondary sm" id="lieCols"><span class="ms xs">view_column</span>Chỉnh sửa cột</button><div class="pop" id="lieColPop" style="top:34px;right:0;width:300px"></div></div></div>
      <div class="lie-tw"><table class="lie-t"><thead id="lieH"></thead><tbody id="lieB"></tbody></table></div>
      <div class="lie-sum" id="lieSum"></div>
      <div class="mf"><span class="nil" style="margin-right:auto;font-size:12px">Lưu xong: Amount (Tổng Cash-In Dự Kiến) của Deal = Tổng</span><button class="btn btn--secondary" data-close>Huỷ</button><button class="btn btn--primary" id="lieSave">Lưu</button></div></div>`, (bg, close) => {
      const cf = () => db.liFields.filter(f => shown.includes(f.key));
      const drawH = () => { $('#lieH', bg).innerHTML = `<tr><th>Tên</th><th class="n">SL</th><th class="n">Đơn giá (₫)</th><th class="n">Chiết khấu</th>${cf().map(f => `<th>${esc(f.name)}</th>`).join('')}<th class="n">Thành tiền</th><th></th></tr>`; };
      const cell = (li, i, f) => f.type === 'NUMBER' ? `<input class="ed" type="number" data-i="${i}" data-c="${f.key}" value="${li.custom[f.key] ?? ''}">` : f.type === 'DATE' ? `<input class="ed" type="date" data-i="${i}" data-c="${f.key}" value="${li.custom[f.key] ?? ''}">`
        : f.type === 'SELECT' ? `<select class="ed" data-i="${i}" data-c="${f.key}"><option value=""></option>${(f.choices || []).map(c => `<option ${c === li.custom[f.key] ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>` : `<input class="ed" data-i="${i}" data-c="${f.key}" value="${esc(li.custom[f.key] ?? '')}">`;
      const drawB = () => {
        $('#lieB', bg).innerHTML = items.length ? items.map((li, i) => `<tr><td><input class="ed nm" data-i="${i}" data-k="name" value="${esc(li.name)}" aria-label="Tên line item">${li.product ? `<small class="nil">${esc((db.products.find(p => p.id === li.product) || {}).sku || '')}</small>` : '<small class="nil">Tùy chỉnh</small>'}</td>
          <td class="n"><input class="ed" type="number" min="0" data-i="${i}" data-k="qty" value="${li.qty}" aria-label="Số lượng"></td>
          <td class="n"><input class="ed" type="number" min="0" data-i="${i}" data-k="price" value="${li.price}" aria-label="Đơn giá"></td>
          <td class="n"><span class="disc"><input class="ed" type="number" min="0" data-i="${i}" data-k="disc" value="${li.disc || 0}" aria-label="Chiết khấu"><select class="ed" data-i="${i}" data-k="discType" aria-label="Kiểu chiết khấu"><option ${li.discType !== '%' ? 'selected' : ''}>₫</option><option ${li.discType === '%' ? 'selected' : ''}>%</option></select></span></td>
          ${cf().map(f => `<td>${cell(li, i, f)}</td>`).join('')}<td class="n"><b>${money(liTotal(li))}</b></td>
          <td><button class="btn btn--text btn--icon" data-rm="${i}" aria-label="Xoá dòng"><span class="ms sm">delete</span></button></td></tr>`).join('')
          : `<tr><td colspan="${6 + cf().length}" class="nil" style="text-align:center;padding:28px">Chưa có line item. Chọn từ thư viện sản phẩm hoặc tạo line item tùy chỉnh.</td></tr>`;
        const gross = items.reduce((s, li) => s + (Number(li.qty) || 0) * (Number(li.price) || 0), 0), net = items.reduce((s, li) => s + liTotal(li), 0);
        $('#lieSum', bg).innerHTML = `<div><span>Tạm tính</span><b>${money(gross)}</b></div><div><span>Chiết khấu</span><b>− ${money(gross - net)}</b></div><div class="tot"><span>Tổng</span><b>${money(net)}</b></div>`;
      };
      drawH(); drawB();
      const refreshTotals = () => { const pos = document.activeElement && document.activeElement.dataset ? [document.activeElement.dataset.i, document.activeElement.dataset.k || document.activeElement.dataset.c] : null; drawB();
        if (pos && pos[0] !== undefined) { const el2 = bg.querySelector(`[data-i="${pos[0]}"][data-k="${pos[1]}"],[data-i="${pos[0]}"][data-c="${pos[1]}"]`); if (el2) { el2.focus(); try { const L = el2.value.length; el2.setSelectionRange && el2.type !== 'number' && el2.setSelectionRange(L, L); } catch {} } } };
      bg.querySelector('.lie').addEventListener('input', e => { const i = e.target.dataset.i; if (i === undefined) return; const li = items[i];
        if (e.target.dataset.k) { const k = e.target.dataset.k; li[k] = ['qty','price','disc'].includes(k) ? Number(e.target.value) : e.target.value; }
        if (e.target.dataset.c) { const f = db.liFields.find(x => x.key === e.target.dataset.c); li.custom[f.key] = f.type === 'NUMBER' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value; }
        if (['qty','price','disc','discType'].includes(e.target.dataset.k)) refreshTotals(); });
      bg.querySelector('.lie').addEventListener('change', e => { if (e.target.dataset.k === 'discType') { items[e.target.dataset.i].discType = e.target.value; refreshTotals(); } });
      bg.querySelector('.lie').addEventListener('click', e => {
        const rm = e.target.closest('[data-rm]'); if (rm) { items.splice(+rm.dataset.rm, 1); drawB(); return; }
        if (e.target.closest('#lieCustom')) { items.push({ id:'li' + Date.now().toString(36), product:null, name:'Line item tùy chỉnh', qty:1, price:0, disc:0, discType:'₫', custom:{} }); drawB(); bg.querySelector(`[data-i="${items.length - 1}"][data-k="name"]`).select(); return; }
        if (e.target.closest('#lieLib')) { const pop = $('#liePop', bg); if (pop.classList.contains('open')) { pop.classList.remove('open'); return; }
          pop.innerHTML = `<div class="hd">Thư viện sản phẩm</div><input class="in" id="lieQ" placeholder="Tìm theo tên hoặc SKU" style="width:100%;height:32px;margin:4px 0 6px"><div id="lieP" style="max-height:260px;overflow:auto"></div><div class="row" style="display:flex;justify-content:flex-end;gap:6px;padding-top:6px"><button class="btn btn--primary sm" id="lieAdd">Thêm</button></div>`;
          const drawP = q => { $('#lieP', bg).innerHTML = db.products.filter(p => !q || (p.name + p.sku).toLowerCase().includes(q)).map(p => `<label class="mi" style="align-items:flex-start;padding:6px 8px"><input type="checkbox" value="${p.id}" style="margin-top:3px"><span><b style="font-weight:600">${esc(p.name)}</b><br><small class="nil">${esc(p.sku)} · ${money(p.price)}</small></span></label>`).join(''); };
          drawP(''); $('#lieQ', bg).oninput = ev => drawP(ev.target.value.trim().toLowerCase()); pop.classList.add('open'); $('#lieQ', bg).focus(); e.stopPropagation(); return; }
        if (e.target.closest('#lieAdd')) { [...bg.querySelectorAll('#lieP input:checked')].forEach(i => { const p = db.products.find(x => x.id === i.value); items.push({ id:'li' + Date.now().toString(36) + p.id, product:p.id, name:p.name, qty:1, price:p.price, disc:0, discType:'₫', custom:{} }); });
          $('#liePop', bg).classList.remove('open'); drawB(); return; }
        if (e.target.closest('#lieCols')) { const pop = $('#lieColPop', bg); if (pop.classList.contains('open')) { pop.classList.remove('open'); return; }
          const drawC = () => { pop.innerHTML = `<div class="hd">Thuộc tính line item</div>${db.liFields.map(f => `<label class="mi"><input type="checkbox" data-sc="${f.key}" ${shown.includes(f.key) ? 'checked' : ''}>${esc(f.name)}<small class="nil" style="margin-left:auto">${HX.TYPE[f.type].name}</small></label>`).join('')}
            <div class="sep"></div><div class="hd">Tạo thuộc tính mới</div><div style="display:flex;flex-direction:column;gap:6px;padding:4px 8px 8px"><input class="in" id="nfName" placeholder="Tên thuộc tính" style="height:32px"><select class="in" id="nfType" style="height:32px"><option value="TEXT">Văn bản</option><option value="NUMBER">Số</option><option value="DATE">Ngày</option><option value="SELECT">Lựa chọn đơn</option></select>
            <input class="in" id="nfOpts" placeholder="Lựa chọn, cách nhau bằng dấu phẩy" style="height:32px;display:none"><button class="btn btn--primary sm" id="nfGo">Tạo thuộc tính</button></div>`;
            $('#nfType', bg).onchange = ev => { $('#nfOpts', bg).style.display = ev.target.value === 'SELECT' ? '' : 'none'; }; };
          drawC(); pop.classList.add('open'); pop._redraw = drawC; e.stopPropagation(); return; }
        if (e.target.closest('#nfGo')) { const name = $('#nfName', bg).value.trim(); if (!name) { $('#nfName', bg).focus(); return; }
          const type = $('#nfType', bg).value; const key = HX.slug(name) || 'tt' + db.liFields.length; if (db.liFields.some(f => f.key === key)) { toast('Đã có thuộc tính này'); return; }
          const f = { key, name, type }; if (type === 'SELECT') f.choices = $('#nfOpts', bg).value.split(',').map(s => s.trim()).filter(Boolean);
          db.liFields.push(f); persist(); shown.push(key); drawH(); drawB(); $('#lieColPop', bg)._redraw(); toast(`Đã tạo thuộc tính “${name}”`); return; }
        if (!e.target.closest('.pop')) bg.querySelectorAll('.lie .pop.open').forEach(p => p.classList.remove('open'));
      });
      bg.querySelector('.lie').addEventListener('change', e => { const sc = e.target.dataset.sc; if (sc) { shown = e.target.checked ? [...shown, sc] : shown.filter(x => x !== sc); drawH(); drawB(); } });
      $('#lieSave', bg).onclick = () => { if (items.some(li => !String(li.name).trim())) { toast('Line item cần có tên'); return; } const tot = saveItems(dealId, items); close(); toast(`Đã lưu ${items.length} line item · Amount = ${money(tot)}`); refresh && refresh(); };
    });
  }

  /* ── Liên kết trong form "Tạo bản ghi" của Deals (HX.openCreate) ── */
  const dealAssocForm = () => `<div class="assoc-sec"><b>Liên kết Deal với</b><label>Company<select class="in" id="cf__company"><option value="">— Không —</option>${db.companies.map(c => `<option value="${c.id}">${esc(c.values.name)}</option>`).join('')}</select></label>
    <label>Contact<select class="in" id="cf__contact"><option value="">— Không —</option>${db.contacts.map(c => `<option value="${c.id}">${esc(fullName(c))}${c.company ? ' · ' + esc((get('company', c.company) || {values:{}}).values.name || '') : ''}</option>`).join('')}</select></label></div>`;
  function saveDealAssoc(dealId, p) { const co = p.querySelector('#cf__company'), ct = p.querySelector('#cf__contact');
    if (ct && ct.value) { associate('deal', dealId, 'contact', ct.value, 'Người quyết định'); const c = get('contact', ct.value); if (c.company && !(co && co.value)) associate('deal', dealId, 'company', c.company); }
    if (co && co.value) associate('deal', dealId, 'company', co.value); }

  return { ME, TODAY, LIFECYCLE, LEAD_STATUS, SOURCES, INDUSTRIES, ASSOC_LABELS, CONTACT_FIELDS, COMPANY_FIELDS, OBJ, STAGE, CASH, CLOSE, SALE, WON, LOST,
    db: () => db, get, list, related, assoc, associate, dissociate, update, create, remove, activitiesOf, addActivity, lastContacted, itemsOf, liTotal, saveItems, money,
    titleOf, fullName, initials, url, dt, dOnly, props, createPanel, addAssocPanel, assocCard, timeline, composer, lineItemsCard, lineItemEditor, dealAssocForm, saveDealAssoc,
    reset() { try { localStorage.removeItem(KEY); } catch {} } };
})();

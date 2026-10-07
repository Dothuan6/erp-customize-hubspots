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
      {id:'p1', name:'HarnexAI STARTER – 6 tháng', sku:'HX-ST-6', price:15000000, desc:'Gói Starter, trả trước 6 tháng', defaults:{thoi_han:6}},
      {id:'p2', name:'HarnexAI STARTER – 12 tháng', sku:'HX-ST-12', price:28000000, desc:'Gói Starter, trả trước 12 tháng', defaults:{thoi_han:12}},
      {id:'p3', name:'HarnexAI PROFESSIONAL – 12 tháng', sku:'HX-PRO-12', price:48000000, desc:'Gói Professional, trả trước 12 tháng', defaults:{thoi_han:12}},
      {id:'p4', name:'HarnexAI ENTERPRISE BYOC – 12 tháng', sku:'HX-ENT-12', price:180000000, desc:'Triển khai trên hạ tầng khách hàng', defaults:{thoi_han:12}},
      {id:'p5', name:'Phí khởi tạo (Setup)', sku:'HX-SETUP', price:3000000, desc:'Cấu hình, nhập dữ liệu ban đầu'},
      {id:'p6', name:'User bổ sung / tháng', sku:'HX-USER', price:250000, desc:'Tính theo user theo tháng', freq:'Hằng tháng', term:12},
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
  // Nâng cấp dữ liệu cũ (Phần 5: line item có tần suất / kỳ hạn; điều chỉnh cấp Deal; mặc định trường tuỳ chỉnh của sản phẩm)
  db.liAdj = db.liAdj || {}; db.liUseAmount = db.liUseAmount || {};
  db.lineItems.forEach(li => { if (!li.freq) li.freq = 'Một lần'; if (!li.term) li.term = 1; });
  db.products.forEach(p => { if (!p.defaults && /– (6|12) tháng/.test(p.name)) p.defaults = { thoi_han: Number(p.name.match(/– (6|12) tháng/)[1]) }; if (p.id === 'p6' && !p.freq) { p.freq = 'Hằng tháng'; p.term = 12; } });
  // Nâng cấp dữ liệu cũ trong trình duyệt (Phần 2: thêm Quốc gia, Lead status cho Company)
  db.companies.forEach(c => { if (!('country' in c.values)) c.values.country = 'Việt Nam'; if (!('leadstatus' in c.values)) c.values.leadstatus = c.values.lifecycle === 'Customer' ? null : c.values.lifecycle === 'Opportunity' ? 'Có deal' : 'Mới'; });
  if (!load()) persist();

  /* ── Phần 7: Sales (nhân viên kinh doanh = owner của Contact / Company / Deal) ── */
  // BE: collection "NhanVien" của ERP (đã có) + thêm cột Team, Vai trò, Chỉ tiêu tháng. Tên sale = giá trị của Contact owner / Company owner / "Sale phụ trách".
  const TEAMS = ['Sales HCM','Sales HN','Key Account'];
  const ROLES = ['Sales Executive','Trưởng nhóm','Sales Manager','Account Manager'];
  const SALE_FIELDS = [
    {key:'name', name:'Họ và tên', type:'TEXT'},
    {key:'email', name:'Email', type:'TEXT'},
    {key:'phone', name:'Số điện thoại', type:'TEXT'},
    {key:'team', name:'Team', type:'SELECT', choices:TEAMS},
    {key:'role', name:'Vai trò', type:'SELECT', choices:ROLES},
    {key:'quota', name:'Chỉ tiêu tháng (₫)', type:'NUMBER'},
    {key:'status', name:'Trạng thái', type:'SELECT', choices:['Đang làm việc','Tạm nghỉ','Đã nghỉ']},
    {key:'joined', name:'Ngày vào làm', type:'DATE'},
  ];
  if (!db.sales) {
    db.sales = [
      { id:'s1', createdAt: iso('2024-03-01'), values:{ name:'Minh Trần', email:'minh.tran@harnex.ai', phone:'0901 234 567', team:'Sales HCM', role:'Trưởng nhóm', quota:150000000, status:'Đang làm việc', joined:'2024-03-01' } },
      { id:'s2', createdAt: iso('2025-01-06'), values:{ name:'Lan Lê', email:'lan.le@harnex.ai', phone:'0912 345 678', team:'Sales HCM', role:'Sales Executive', quota:80000000, status:'Đang làm việc', joined:'2025-01-06' } },
      { id:'s3', createdAt: iso('2023-08-14'), values:{ name:'Phương Nguyễn', email:'phuong.nguyen@harnex.ai', phone:'0987 654 321', team:'Sales HN', role:'Sales Manager', quota:100000000, status:'Đang làm việc', joined:'2023-08-14' } },
    ];
    persist();
  }
  db.sales.forEach(s => { if (!USERS.includes(s.values.name)) USERS.push(s.values.name); });

  /* ── Phần 7: Trường bổ sung (thuộc tính tuỳ chỉnh) ── */
  // db.cf = trường tự tạo của Contact / Company (Deal dùng Quản lý trường ERP: HX.api.addField). db.extra = key hiển thị trong vùng "Trường bổ sung".
  const DEAL_BASE = ['m_deal','t_n_deal','lead_id','g_i_d_ch_v_m_c_ti_u','th_i_h_n_thanh_to_n','giai_o_n_pipeline','ph_thu_tr_tr_c','ph_kh_i_t_o_setup','t_ng_cash_in_d_ki_n','s_ti_n_gi_m_gi','l_do_gi_m','t_l_th_nh_c_ng','ng_y_d_ki_n_ch_t','sale_ph_tr_ch','l_do_th_t_b_i','ng_y_c_p_nh_t_g_n_nh_t','test'];
  if (!db.cf) {
    db.cf = {
      contact:[{ key:'cf_kenh_lien_he', name:'Kênh liên hệ ưa thích', type:'SELECT', choices:['Zalo','Điện thoại','Email','Gặp trực tiếp'], custom:true, createdAt:iso('2026-09-27') },
               { key:'cf_ngay_sinh', name:'Ngày sinh', type:'DATE', custom:true, createdAt:iso('2026-09-27') }],
      company:[{ key:'cf_mst', name:'Mã số thuế', type:'TEXT', custom:true, createdAt:iso('2026-09-27') },
               { key:'cf_hang_kh', name:'Hạng khách hàng', type:'SELECT', choices:['A – Chiến lược','B – Tiềm năng','C – Thường'], custom:true, createdAt:iso('2026-09-27') }],
    };
    db.extra = { contact:['cf_kenh_lien_he','cf_ngay_sinh','jobtitle','source'], company:['cf_mst','cf_hang_kh','domain','employees'], deal:['ph_thu_tr_tr_c','ph_kh_i_t_o_setup','s_ti_n_gi_m_gi','lead_id'] };
    const v = (t, id, k, x) => { const r = (t === 'contact' ? db.contacts : db.companies).find(c => c.id === id); if (r) r.values[k] = x; };
    v('contact','ct01','cf_kenh_lien_he','Zalo'); v('contact','ct03','cf_kenh_lien_he','Điện thoại'); v('contact','ct05','cf_kenh_lien_he','Email');
    v('company','co01','cf_mst','0312 456 789'); v('company','co01','cf_hang_kh','A – Chiến lược'); v('company','co02','cf_hang_kh','B – Tiềm năng');
    persist();
  }
  db.extra = db.extra || { contact:[], company:[], deal:[] };
  const FIELDS_OF = { contact:CONTACT_FIELDS, company:COMPANY_FIELDS };
  ['contact','company'].forEach(t => db.cf[t].forEach(f => { if (!FIELDS_OF[t].some(x => x.key === f.key)) FIELDS_OF[t].push(f); }));

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
  // Thành tiền 1 kỳ = SL × đơn giá − chiết khấu; định kỳ: × số kỳ (như Total của HubSpot)
  const liNet = li => { const gross = (Number(li.qty) || 0) * (Number(li.price) || 0); const d = Number(li.disc) || 0; return Math.max(0, gross - (li.discType === '%' ? gross * d / 100 : d)); };
  const liTotal = li => liNet(li) * (li.freq && li.freq !== 'Một lần' ? Math.max(1, Number(li.term) || 1) : 1);
  const PERY = { 'Hằng tháng':12, 'Hằng quý':4, 'Nửa năm':2, 'Hằng năm':1 };
  function totalsOf(items, adj = []) {
    const sub = items.reduce((s, li) => s + liTotal(li), 0);
    const gross = items.reduce((s, li) => s + (Number(li.qty) || 0) * (Number(li.price) || 0) * (li.freq && li.freq !== 'Một lần' ? Math.max(1, Number(li.term) || 1) : 1), 0);
    let run = sub; const out = [];
    // Thứ tự như HubSpot: chiết khấu → phí → thuế (thuế tính trên số sau chiết khấu + phí)
    ['discount','fee','tax'].forEach(ty => adj.forEach((a, j) => { if (a.type !== ty) return; const base = ty === 'tax' ? run : sub; const amt = a.mode === '₫' ? Number(a.value) || 0 : base * (Number(a.value) || 0) / 100;
      out[j] = { label: `${ty === 'discount' ? 'Chiết khấu' : ty === 'fee' ? 'Phí' : 'Thuế'}${a.name ? ' · ' + a.name : ''}${a.mode === '₫' ? '' : ` (${a.value || 0}%)`}`, amount: amt, sign: ty === 'discount' ? -1 : 1 }; run += ty === 'discount' ? -amt : amt; }));
    const arr = items.reduce((s, li) => s + (PERY[li.freq] ? liNet(li) * PERY[li.freq] : 0), 0);
    return { sub, lineDisc: Math.max(0, gross - sub), adj: out, adjTotal: out.filter(Boolean).length, total: Math.max(0, run), recurring: items.some(li => PERY[li.freq]), arr };
  }
  const dealTotals = dealId => { const T = totalsOf(itemsOf(dealId), db.liAdj[dealId] || []); return { ...T, adj: T.adj.filter(Boolean) }; };
  const itemsOf = dealId => db.lineItems.filter(li => li.deal === dealId);
  function saveItems(dealId, items, useAmount = true) {
    db.lineItems = [...db.lineItems.filter(li => li.deal !== dealId), ...items.map(li => ({ ...li, deal: dealId }))]; persist();
    const total = totalsOf(items, db.liAdj[dealId] || []).total;
    if (HX.F[CASH] && useAmount && items.length) deals.update(dealId, CASH, total);
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
  function place(pop, anchor, host) { const r = anchor.getBoundingClientRect(), h = host.getBoundingClientRect(); const pw = parseInt(pop.style.width) || 230; pop.style.left = Math.max(4, Math.min(r.left - h.left, h.width - pw - 4)) + 'px'; pop.style.top = (r.bottom - h.top + 4) + 'px'; pop.style.right = 'auto'; }
  document.addEventListener('click', e => { if (!e.target.closest('.pop')) document.querySelectorAll('.card .pop.open, .tl .pop.open').forEach(p => p.classList.remove('open')); });

  /* ── Timeline hoạt động (cột giữa) — clone tab Activities của HubSpot (khảo sát 29/09/2026) ──
     Tab: Tất cả · Ghi chú · Emails · Cuộc gọi · Tasks · Cuộc họp; mỗi tab có nút tạo/ghi riêng.
     Bộ lọc: Hoạt động (x/y) ▾ nhóm Giao tiếp / Hoạt động nhóm / Cập nhật · Mọi thời gian ▾ · Người thực hiện ▾ · Xoá tất cả.
     Thẻ hoạt động: ghim · sửa · lịch sử liên kết · xoá; bấm để thu gọn / mở rộng. */
  const ICON = { NOTE:'sticky_note_2', TASK:'task_alt', MEETING:'event', CALL:'call', SYSTEM:'history', EMAIL:'mail' };
  const TNAME = { NOTE:'Ghi chú', TASK:'Task', MEETING:'Cuộc họp', CALL:'Cuộc gọi', SYSTEM:'Hoạt động hệ thống', EMAIL:'Email' };
  const TABS = [['ALL','Tất cả hoạt động'],['NOTE','Ghi chú'],['EMAIL','Emails'],['CALL','Cuộc gọi'],['TASK','Tasks'],['MEETING','Cuộc họp']];
  // Loại chi tiết dùng cho bộ lọc "Hoạt động (x/y)"
  const KIND_GROUPS = [['Giao tiếp', [['CALL','Cuộc gọi'],['EMAIL','Emails']]], ['Hoạt động nhóm', [['MEETING','Cuộc họp'],['NOTE','Ghi chú'],['TASK','Tasks']]],
    ['Cập nhật', [['S_DEAL','Hoạt động Deal'],['S_ASSOC','Thay đổi liên kết'],['S_PROP','Thay đổi thuộc tính'],['S_CREATED','Tạo bản ghi']]]];
  const ALL_KINDS = KIND_GROUPS.flatMap(g => g[1].map(k => k[0]));
  const kindOf = a => a.type !== 'SYSTEM' ? a.type : a.title === 'Hoạt động Deal' ? 'S_DEAL' : a.title === 'Đã tạo' ? 'S_CREATED' : /liên kết/i.test(a.body || '') ? 'S_ASSOC' : 'S_PROP';
  const RANGES = [[0,'Mọi thời gian'],[1,'Hôm nay'],[7,'7 ngày qua'],[30,'30 ngày qua'],[90,'90 ngày qua'],[365,'12 tháng qua']];
  const PIN_KEY = 'hx-crm-pins-v1';
  let PINS = {}; try { PINS = JSON.parse(localStorage.getItem(PIN_KEY) || '{}'); } catch {}
  const savePins = () => { try { localStorage.setItem(PIN_KEY, JSON.stringify(PINS)); } catch {} };
  const richOf = a => a.html || esc(a.body || '').replace(/\n/g, '<br>');
  function timeline(el, t, id, onChange = () => {}) {
    const st = { tab:'ALL', q:'', range:0, kinds:new Set(ALL_KINDS), who:new Set(), collapsedAll:false, open:new Set(), closed:new Set() };
    const pinKey = `${t}:${id}`;
    const refsName = a => { const out = []; (a.contacts || []).forEach(i => { const r = get('contact', i); if (r) out.push(['contact', i, fullName(r)]); }); (a.companies || []).forEach(i => { const r = get('company', i); if (r) out.push(['company', i, r.values.name]); }); (a.deals || []).forEach(i => { const r = get('deal', i); if (r) out.push(['deal', i, HX.title(r)]); }); return out; };
    const isOpen = a => st.collapsedAll ? st.open.has(a.id) : !st.closed.has(a.id);
    const card = (a, pinned) => {
      const sys = a.type === 'SYSTEM';
      const head = a.type === 'TASK' ? `<button class="tk ${a.done ? 'on' : ''}" data-done="${a.id}" aria-label="${a.done ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}"><span class="ms sm">${a.done ? 'check_circle' : 'radio_button_unchecked'}</span></button><span class="ta-t"><b class="${a.done ? 'strike' : ''}">${esc(a.title || a.body)}</b></span>`
        : sys ? `<span class="ta-t"><b>${esc(a.title || TNAME.SYSTEM)}</b>${a.title === 'Hoạt động Deal' ? '<span class="ms xs" style="color:var(--on-surface-variant)">handshake</span>' : ''}</span>`
        : `<span class="ta-t"><b>${a.type === 'MEETING' ? esc(a.title || 'Cuộc họp') : TNAME[a.type]}</b><span class="nil"> bởi ${esc(a.by)}</span></span>`;
      const meta = a.type === 'TASK' ? `<div class="tm"><span>Hạn: <b>${a.due ? dOnly(a.due) + (a.dueTime ? ' ' + a.dueTime : '') : '—'}</b>${!a.done && a.due && a.due < TODAY.toISOString().slice(0, 10) ? ' <span class="od">Quá hạn</span>' : ''}</span><span>Loại: <b>${esc(a.kind || 'To-do')}</b></span><span>Ưu tiên: <b>${esc(a.prio || 'Không')}</b></span><span>Người thực hiện: <b>${esc(a.assignee || a.by)}</b></span>${a.repeat ? '<span><span class="ms xs">repeat</span>Lặp lại</span>' : ''}</div>`
        : a.type === 'MEETING' ? `<div class="tm"><span>Bắt đầu: <b>${dt(a.at)}</b></span><span>Thời lượng: <b>${a.dur || 30} phút</b></span><span>Kết quả: <b>${esc(a.outcome || '—')}</b></span>${(a.attendees || []).length ? `<span>Tham dự: <b>${a.attendees.map(i => get('contact', i)).filter(Boolean).map(fullName).map(esc).join(', ')}</b></span>` : ''}</div>`
        : a.type === 'CALL' ? `<div class="tm"><span>Hướng: <b>${esc(a.dir || 'Gọi đi')}</b></span><span>Kết quả: <b>${esc(a.outcome || '—')}</b></span>${(a.contacted || []).length ? `<span>Đã liên hệ: <b>${a.contacted.map(i => get('contact', i)).filter(Boolean).map(fullName).map(esc).join(', ')}</b></span>` : ''}</div>` : '';
      const rn = refsName(a), open = isOpen(a);
      const text = a.type === 'TASK' ? (a.body && a.body !== a.title ? richOf(a) : '') : sys ? esc(a.body || '') : richOf(a);
      return `<article class="ta ${sys ? 'sys' : ''} ${open ? '' : 'shut'} ${pinned ? 'pin' : ''}" data-aid="${a.id}">
        ${pinned ? '<div class="ta-pin"><span class="ms xs">push_pin</span>Đã ghim</div>' : ''}
        <div class="ta-h" data-tog="${a.id}"><span class="ms sm ic">${ICON[a.type]}</span>${head}<time>${dt(a.at)}</time>
          ${sys ? '' : `<button class="btn btn--text sm ta-act" data-amenu="${a.id}" aria-label="Thao tác hoạt động">Thao tác<span class="ms xs">arrow_drop_down</span></button>`}</div>
        <div class="ta-b">${meta}${text ? `<div class="ta-x">${text}</div>` : ''}
          ${rn.length > 1 || !sys ? `<div class="ta-f"><button class="ta-as" data-asl="${a.id}"><span class="ms xs">link</span>${rn.length} liên kết<span class="ms xs">arrow_drop_down</span></button><span class="ta-asl" id="asl-${a.id}" hidden>${rn.map(([ty, i, n]) => `<a class="lk" href="${url(ty, i)}">${esc(n)}</a>`).join(' · ')}</span></div>` : ''}</div></article>`;
    };
    const draw = () => {
      let all = activitiesOf(t, id);
      if (st.tab !== 'ALL') all = all.filter(a => a.type === st.tab);
      else all = all.filter(a => st.kinds.has(kindOf(a)));
      if (st.range) { const d0 = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()), from = st.range === 1 ? d0 : new Date(TODAY.getTime() - st.range * 864e5); all = all.filter(a => new Date(a.at) >= from); }
      if (st.who.size) all = all.filter(a => st.who.has(a.type === 'TASK' ? (a.assignee || a.by) : a.by));
      if (st.q) all = all.filter(a => `${a.title || ''} ${a.body || ''} ${a.by || ''}`.toLowerCase().includes(st.q));
      const pins = PINS[pinKey] || []; const pinned = all.filter(a => pins.includes(a.id));
      const rest = all.filter(a => !pins.includes(a.id));
      const up = rest.filter(a => (a.type === 'TASK' && !a.done) || (a.type === 'MEETING' && a.at > TODAY.toISOString()));
      const past = rest.filter(a => !up.includes(a));
      const groups = []; past.forEach(a => { const m = monthLabel(a.at); const g = groups.find(x => x.m === m); g ? g.items.push(a) : groups.push({ m, items:[a] }); });
      const ACT = { NOTE:[['NOTE','Tạo ghi chú']], CALL:[['CALL','Ghi lại cuộc gọi'],['_dial','Gọi điện']], TASK:[['TASK','Tạo task']], MEETING:[['MEETING','Ghi lại cuộc họp'],['MEETING_S','Lên lịch cuộc họp']], EMAIL:[['EMAIL','Ghi lại email'],['EMAIL','Soạn email']] }[st.tab] || [];
      el.querySelector('#tlActs').innerHTML = ACT.map(([k, l]) => `<button class="btn btn--secondary sm" data-tlnew="${k}"><span class="ms xs">${k === 'NOTE' ? 'edit_note' : k.startsWith('CALL') || k === '_dial' ? 'call' : k === 'TASK' ? 'task_alt' : k.startsWith('MEETING') ? 'event' : 'mail'}</span>${l}</button>`).join('');
      el.querySelector('#tlF').hidden = st.tab !== 'ALL';
      el.querySelector('.tl-body').innerHTML = (st.tab === 'EMAIL' ? `<div class="soon"><span class="ms">mail</span>Gửi và ghi email nằm ngoài phạm vi giai đoạn 2 (chờ khách chốt).</div>` : '')
        + (pinned.length ? pinned.map(a => card(a, true)).join('') : '')
        + (up.length ? `<h4 class="tl-m">Sắp tới</h4>${up.map(a => card(a)).join('')}` : '')
        + groups.map(g => `<h4 class="tl-m">${g.m}</h4>${g.items.map(a => card(a)).join('')}`).join('')
        + (!all.length && st.tab !== 'EMAIL' ? `<div class="soon"><span class="ms">manage_search</span>${st.tab === 'ALL' ? 'Không có hoạt động phù hợp bộ lọc.' : `Chưa có ${TNAME[st.tab].toLowerCase()} nào.`}</div>` : '');
      el.querySelector('#tlCount').textContent = `Hoạt động (${st.kinds.size}/${ALL_KINDS.length})`;
      el.querySelector('#tlKx').hidden = st.kinds.size === ALL_KINDS.length;
      el.querySelector('#tlRangeL').textContent = RANGES.find(r => r[0] === st.range)[1];
      el.querySelector('#tlWhoL').textContent = st.who.size ? `Người thực hiện (${st.who.size})` : 'Người thực hiện';
      el.querySelector('#tlClr').hidden = st.kinds.size === ALL_KINDS.length && !st.range && !st.who.size;
      el.querySelector('#tlCol').innerHTML = `${st.collapsedAll ? 'Mở rộng tất cả' : 'Thu gọn tất cả'}<span class="ms xs">arrow_drop_down</span>`;
    };
    el.innerHTML = `<div class="tl-tabs" role="tablist">${TABS.map(([k, l]) => `<button role="tab" aria-selected="${k === 'ALL'}" data-tt="${k}">${l}</button>`).join('')}</div>
      <div class="tl-tools"><label class="srch2 tl-q"><input id="tlQ" placeholder="Tìm hoạt động" aria-label="Tìm hoạt động"><span class="ms sm">search</span></label>
        <span id="tlActs" class="tl-acts"></span><button class="btn btn--text sm" id="tlCol"></button></div>
      <div class="tl-tools" id="tlF"><span class="fchip2"><button id="tlTypes"><span id="tlCount"></span><span class="ms xs">arrow_drop_down</span></button><button id="tlKx" aria-label="Bỏ lọc loại hoạt động"><span class="ms xs">close</span></button></span>
        <button class="fchip2 ghost" id="tlRange"><span id="tlRangeL"></span><span class="ms xs">arrow_drop_down</span></button>
        <button class="fchip2 ghost" id="tlWho"><span id="tlWhoL"></span><span class="ms xs">arrow_drop_down</span></button>
        <button class="btn btn--text sm" id="tlClr">Xoá tất cả</button></div>
      <div class="tl-body"></div><div class="pop" id="tlPop"></div>`;
    el.classList.add('tl');
    const pop = () => $('#tlPop', el);
    const openPop = (anchor, html, w) => { const p = pop(); p.style.width = (w || 240) + 'px'; place(p, anchor, el); p.innerHTML = html; p.classList.add('open'); return p; };
    el.onclick = e => {
      const tb = e.target.closest('[data-tt]'); if (tb) { st.tab = tb.dataset.tt; el.querySelectorAll('[data-tt]').forEach(b => b.setAttribute('aria-selected', b === tb)); draw(); return; }
      const nw = e.target.closest('[data-tlnew]'); if (nw) { const k = nw.dataset.tlnew; if (k === '_dial') { toast('Gọi điện trực tiếp cần tổng đài (ngoài phạm vi) — dùng “Ghi lại cuộc gọi”'); return; }
        composer(t, id, k === 'MEETING_S' ? 'MEETING' : k, () => { draw(); onChange(); }, k === 'MEETING_S' ? { schedule:true } : {}); return; }
      if (e.target.closest('#tlCol')) { e.stopPropagation(); openPop(e.target.closest('#tlCol'), `<button class="mi" data-cl="all">${st.collapsedAll ? 'Mở rộng tất cả' : 'Thu gọn tất cả'}</button><div class="sep"></div><div class="hd">Hiển thị</div><button class="mi" data-cl="newest">Mới nhất trước</button>`, 200); return; }
      const cl = e.target.closest('[data-cl]'); if (cl) { pop().classList.remove('open'); if (cl.dataset.cl === 'all') { st.collapsedAll = !st.collapsedAll; st.open.clear(); st.closed.clear(); } draw(); return; }
      if (e.target.closest('#tlKx')) { st.kinds = new Set(ALL_KINDS); draw(); return; }
      if (e.target.closest('#tlClr')) { st.kinds = new Set(ALL_KINDS); st.range = 0; st.who.clear(); draw(); return; }
      if (e.target.closest('#tlTypes')) { e.stopPropagation();
        const p = openPop(e.target.closest('#tlTypes'), `<label class="srch2" style="height:32px;margin-bottom:6px"><input id="tkQ" placeholder="Tìm"><span class="ms sm">search</span></label>
          <label class="mi"><input type="checkbox" data-kall ${st.kinds.size === ALL_KINDS.length ? 'checked' : ''}><b>Chọn tất cả</b></label>
          <div class="tk-g">${KIND_GROUPS.map(([g, ks]) => `<div><div class="hd">${g}</div>${ks.map(([k, l]) => `<label class="mi" data-kl="${l.toLowerCase()}"><input type="checkbox" data-ty="${k}" ${st.kinds.has(k) ? 'checked' : ''}>${l}</label>`).join('')}</div>`).join('')}</div>`, 520);
        $('#tkQ', p).oninput = ev => p.querySelectorAll('[data-kl]').forEach(x => x.hidden = !x.dataset.kl.includes(ev.target.value.trim().toLowerCase())); return; }
      if (e.target.closest('#tlRange')) { e.stopPropagation(); openPop(e.target.closest('#tlRange'), RANGES.map(([v, l]) => `<button class="mi ${st.range === v ? 'cur' : ''}" data-rg="${v}">${l}</button>`).join(''), 200); return; }
      const rg = e.target.closest('[data-rg]'); if (rg) { st.range = Number(rg.dataset.rg); pop().classList.remove('open'); draw(); return; }
      if (e.target.closest('#tlWho')) { e.stopPropagation(); openPop(e.target.closest('#tlWho'), `<div class="hd">Người thực hiện</div>${USERS.map(u => `<label class="mi"><input type="checkbox" data-who="${esc(u)}" ${st.who.has(u) ? 'checked' : ''}>${esc(u)}${u === ME ? ' (tôi)' : ''}</label>`).join('')}`, 240); return; }
      const asl = e.target.closest('[data-asl]'); if (asl) { e.stopPropagation(); const s = el.querySelector('#asl-' + asl.dataset.asl); s.hidden = !s.hidden; return; }
      const dn = e.target.closest('[data-done]'); if (dn) { e.stopPropagation(); const a = db.activities.find(x => x.id === dn.dataset.done); updateActivity(a.id, { done: !a.done }); toast(a.done ? 'Đã hoàn thành task' : 'Đã mở lại task'); draw(); onChange(); return; }
      const am = e.target.closest('[data-amenu]'); if (am) { e.stopPropagation(); const aid = am.dataset.amenu, pinned = (PINS[pinKey] || []).includes(aid);
        openPop(am, `<button class="mi" data-apin="${aid}"><span class="ms sm">push_pin</span>${pinned ? 'Bỏ ghim' : 'Ghim lên đầu'}</button><button class="mi" data-aedit="${aid}"><span class="ms sm">edit</span>Sửa</button>
          <button class="mi" data-aasl="${aid}"><span class="ms sm">link</span>Xem liên kết</button><div class="sep"></div><button class="mi" data-adel="${aid}" style="color:var(--error)"><span class="ms sm">delete</span>Xoá</button>`, 200); return; }
      const ap = e.target.closest('[data-apin]'); if (ap) { const l = PINS[pinKey] || []; PINS[pinKey] = l.includes(ap.dataset.apin) ? l.filter(x => x !== ap.dataset.apin) : [ap.dataset.apin]; savePins(); pop().classList.remove('open'); toast(l.includes(ap.dataset.apin) ? 'Đã bỏ ghim' : 'Đã ghim lên đầu timeline'); draw(); return; }
      const ae = e.target.closest('[data-aedit]'); if (ae) { pop().classList.remove('open'); const a = db.activities.find(x => x.id === ae.dataset.aedit); composer(t, id, a.type, () => { draw(); onChange(); }, { edit:a }); return; }
      const aa = e.target.closest('[data-aasl]'); if (aa) { pop().classList.remove('open'); const s = el.querySelector('#asl-' + aa.dataset.aasl); if (s) s.hidden = false; return; }
      const ad = e.target.closest('[data-adel]'); if (ad) { pop().classList.remove('open'); confirmBox('Xoá hoạt động', 'Xoá hoạt động này khỏi mọi bản ghi liên kết? Không thể hoàn tác.', 'Xoá', () => { removeActivity(ad.dataset.adel); draw(); onChange(); toast('Đã xoá hoạt động'); }); return; }
      const tg = e.target.closest('[data-tog]'); if (tg && !e.target.closest('button,a')) { const aid = tg.dataset.tog; const a = { id: aid };
        if (isOpen(a)) { st.open.delete(aid); st.closed.add(aid); } else { st.closed.delete(aid); st.open.add(aid); } draw(); return; }
      if (!e.target.closest('#tlPop')) pop().classList.remove('open');
    };
    el.addEventListener('change', e => { const ty = e.target.dataset.ty; if (ty) { e.target.checked ? st.kinds.add(ty) : st.kinds.delete(ty); const all = el.querySelector('[data-kall]'); if (all) all.checked = st.kinds.size === ALL_KINDS.length; draw(); }
      if (e.target.dataset.kall !== undefined) { st.kinds = e.target.checked ? new Set(ALL_KINDS) : new Set(); el.querySelectorAll('[data-ty]').forEach(x => x.checked = e.target.checked); draw(); }
      const w = e.target.dataset.who; if (w) { e.target.checked ? st.who.add(w) : st.who.delete(w); draw(); } });
    document.addEventListener('click', e => { if (!el.contains(e.target)) pop().classList.remove('open'); });
    el.querySelector('#tlQ').oninput = e => { st.q = e.target.value.trim().toLowerCase(); draw(); };
    draw();
    return { draw, show: tab => { const b = el.querySelector(`[data-tt="${tab}"]`); b && b.click(); } };
  }

  /* ── Cửa sổ soạn hoạt động — clone composer HubSpot (Note / Task / Log call / Log meeting) ──
     ⌄ thu gọn · ⛶ phóng to · ✕ | "Cho: [bản ghi]" | soạn thảo có B I U · danh sách | "Liên kết với N bản ghi ▾" (bỏ chọn được)
     | ☐ Tạo task [To-do ▾] để theo dõi sau [3 ngày làm việc ▾] | nút Tạo / Ghi lại. opts: { edit: activity } để sửa, { schedule:true } để lên lịch họp. */
  const bizDays = n => { let d = new Date(TODAY); let k = 0; while (k < n) { d.setDate(d.getDate() + 1); if (d.getDay() % 6 !== 0) k++; } return d; };
  const WD = ['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
  const ymd = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  const DUE_P = () => [['0','Hôm nay', ymd(TODAY)], ['1','Ngày mai', ymd(new Date(TODAY.getTime() + 864e5))], ['b2','Sau 2 ngày làm việc', ymd(bizDays(2))], ['b3',`Sau 3 ngày làm việc (${WD[bizDays(3).getDay()]})`, ymd(bizDays(3))],
    ['w1','Sau 1 tuần', ymd(new Date(TODAY.getTime() + 7 * 864e5))], ['w2','Sau 2 tuần', ymd(new Date(TODAY.getTime() + 14 * 864e5))], ['m1','Sau 1 tháng', ymd(new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, TODAY.getDate()))], ['c','Chọn ngày…', '']];
  const OK_TAGS = ['B','STRONG','I','EM','U','BR','DIV','P','UL','OL','LI'];
  function cleanHtml(node) { return [...node.childNodes].map(n => n.nodeType === 3 ? esc(n.textContent) : n.nodeType === 1 ? (OK_TAGS.includes(n.tagName) ? (n.tagName === 'BR' ? '<br>' : `<${n.tagName.toLowerCase()}>${cleanHtml(n)}</${n.tagName.toLowerCase()}>`) : cleanHtml(n)) : '').join(''); }
  const nowLocal = () => { const d = new Date(); return `${ymd(d)}T${p2(d.getHours())}:${p2(d.getMinutes())}`; };
  function composer(t, id, type, onSaved, opts = {}) {
    if (type === 'EMAIL') { toast('Gửi / ghi email nằm ngoài phạm vi giai đoạn 2'); return; }
    document.querySelector('.composer')?.remove();
    const ed = opts.edit || null;
    const base = ed ? { contacts:[...(ed.contacts || [])], companies:[...(ed.companies || [])], deals:[...(ed.deals || [])] } : autoRefs(t, id);
    const recs = [...base.contacts.map(i => ['contact', i]), ...base.companies.map(i => ['company', i]), ...base.deals.map(i => ['deal', i])].filter(([ty, i]) => get(ty, i));
    const on = new Set(recs.map(([ty, i]) => ty + ':' + i));
    const people = (t === 'deal' ? assoc.contactsOfDeal(id) : t === 'company' ? assoc.contactsOfCompany(id) : [get('contact', id)]).filter(Boolean);
    const self = get(t, id);
    const sel = (idd, list, cur) => `<select class="cm-sel" id="${idd}">${list.map(o => `<option ${o === cur ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    const pplPick = (idd, label, chosen) => `<div class="cm-f"><label>${label}</label><button class="cm-pp" data-pp="${idd}"><span id="${idd}N">${chosen.length} contact</span><span class="ms xs">arrow_drop_down</span></button><div class="cm-ppl" id="${idd}" hidden>${people.map(c => `<label><input type="checkbox" value="${c.id}" ${chosen.includes(c.id) ? 'checked' : ''}>${esc(fullName(c))}</label>`).join('') || '<span class="nil">Chưa có contact liên kết</span>'}</div></div>`;
    const follow = ed ? '' : `<div class="cm-fu"><label><input type="checkbox" id="fuOn"> Tạo task</label>${sel('fuKind', ['To-do','Gọi điện','Email'], 'To-do')}<span>để theo dõi sau</span><select class="cm-sel" id="fuDue">${DUE_P().filter(d => d[0] !== 'c' && d[0] !== '0').map(d => `<option value="${d[2]}" ${d[0] === 'b3' ? 'selected' : ''}>${d[1]}</option>`).join('')}</select></div>`;
    const editor = ph => `<div class="cm-ed" contenteditable="true" id="cmBody" data-ph="${ph}">${ed ? richOf(ed) : ''}</div>
      <div class="cm-tb" role="toolbar" aria-label="Định dạng"><button data-x="bold" aria-label="Đậm"><b>B</b></button><button data-x="italic" aria-label="Nghiêng"><i>I</i></button><button data-x="underline" aria-label="Gạch chân"><u>U</u></button><button data-x="removeFormat" aria-label="Xoá định dạng"><span class="ms xs">format_clear</span></button><span class="sp"></span>
        <button data-x="insertUnorderedList" aria-label="Danh sách"><span class="ms xs">format_list_bulleted</span></button><button data-x="insertOrderedList" aria-label="Danh sách số"><span class="ms xs">format_list_numbered</span></button><span class="sp"></span>
        <button data-tbt="Chèn liên kết (mockup)" aria-label="Liên kết"><span class="ms xs">link</span></button><button data-tbt="Đính kèm tệp — dùng trường Tệp của ERP (sắp có)" aria-label="Đính kèm"><span class="ms xs">attach_file</span></button></div>`;
    const dueSel = () => { const cur = ed && ed.due; return `<select class="cm-sel" id="cmDueP">${DUE_P().map(d => `<option value="${d[0]}" ${cur ? (d[0] === 'c' ? 'selected' : '') : d[0] === 'b3' ? 'selected' : ''}>${d[1]}</option>`).join('')}</select><input class="cm-in sm" type="date" id="cmDue" value="${cur || ymd(bizDays(3))}" ${cur ? '' : 'hidden'}>`; };
    const toLocal = iso => { const d = new Date(iso); return `${ymd(d)}T${p2(d.getHours())}:${p2(d.getMinutes())}`; };
    const B = {
      NOTE: editor('Bắt đầu nhập để ghi chú…'),
      TASK: `<input class="cm-title" id="cmTitle" placeholder="Nhập tên task" value="${esc(ed ? ed.title || '' : '')}">
        <div class="cm-grid"><div class="cm-f"><label>Ngày thực hiện</label><div class="cm-inl">${dueSel()}<input class="cm-in sm" type="time" id="cmDueT" value="${ed && ed.dueTime || '08:00'}"></div></div>
          <div class="cm-f"><label>Gửi nhắc nhở</label>${sel('cmRem', ['Không nhắc','Vào lúc đến hạn','30 phút trước','1 giờ trước','1 ngày trước'], ed && ed.reminder || 'Không nhắc')}</div></div>
        <label class="cm-chk"><input type="checkbox" id="cmRep" ${ed && ed.repeat ? 'checked' : ''}> Lặp lại</label>
        <div class="cm-grid4"><div class="cm-f"><label>Loại task</label>${sel('cmKind', ['To-do','Gọi điện','Email'], ed && ed.kind || 'To-do')}</div><div class="cm-f"><label>Ưu tiên</label>${sel('cmPrio', ['Không','Thấp','Trung bình','Cao'], ed && ed.prio || 'Không')}</div>
          <div class="cm-f"><label>Hàng đợi</label>${sel('cmQ', ['Không'], 'Không')}</div><div class="cm-f"><label>Người thực hiện</label>${sel('cmAs', USERS, ed && ed.assignee || ME)}</div></div>
        ${editor('Ghi chú…')}`,
      CALL: `<div class="cm-grid3">${pplPick('cmWho', 'Đã liên hệ', ed ? ed.contacted || [] : people.slice(0, 1).map(c => c.id))}<div class="cm-f"><label>Kết quả cuộc gọi</label>${sel('cmOut', ['Chọn kết quả','Đã kết nối','Bận','Không nghe máy','Để lại tin nhắn thoại','Để lại tin nhắn trực tiếp','Sai số'], ed && ed.outcome || 'Chọn kết quả')}</div>
          <div class="cm-f"><label>Hướng cuộc gọi</label>${sel('cmDir', ['Chọn hướng','Gọi đi','Gọi đến'], ed && ed.dir || 'Chọn hướng')}</div></div>
        <div class="cm-f"><label>Thời điểm</label><input class="cm-in" type="datetime-local" id="cmAt" value="${ed ? toLocal(ed.at) : nowLocal()}"></div>${editor('Bắt đầu nhập để ghi lại cuộc gọi…')}`,
      MEETING: `${opts.schedule || (ed && ed.title) ? `<input class="cm-title" id="cmTitle" placeholder="Tiêu đề cuộc họp" value="${esc(ed ? ed.title || '' : '')}">` : ''}
        <div class="cm-grid3">${pplPick('cmWho', 'Người tham dự', ed ? ed.attendees || [] : people.map(c => c.id))}<div class="cm-f"><label>Kết quả cuộc họp</label>${sel('cmOut', ['Chọn kết quả','Đã lên lịch','Đã hoàn thành','Đổi lịch','Không đến','Huỷ'], ed ? ed.outcome : opts.schedule ? 'Đã lên lịch' : 'Chọn kết quả')}</div>
          <div class="cm-f"><label>Bắt đầu</label><input class="cm-in" type="datetime-local" id="cmAt" value="${ed ? toLocal(ed.at) : opts.schedule ? ymd(new Date(TODAY.getTime() + 864e5)) + 'T10:00' : nowLocal()}"></div></div>
        <div class="cm-f" style="max-width:180px"><label>Thời lượng</label>${sel('cmDur', ['15 phút','30 phút','45 phút','1 giờ','1 giờ 30 phút','2 giờ'], ed ? ({15:'15 phút',30:'30 phút',45:'45 phút',60:'1 giờ',90:'1 giờ 30 phút',120:'2 giờ'})[ed.dur] || '30 phút' : opts.schedule ? '30 phút' : '15 phút')}</div>${editor('Bắt đầu nhập để ghi lại cuộc họp…')}`,
    };
    const TITLE = { NOTE:'Ghi chú', TASK:'Task', CALL:'Ghi lại cuộc gọi', MEETING: opts.schedule ? 'Lên lịch cuộc họp' : 'Ghi lại cuộc họp' };
    const BTN = { NOTE:'Tạo ghi chú', TASK:'Tạo', CALL:'Ghi lại cuộc gọi', MEETING: opts.schedule ? 'Lưu lịch họp' : 'Ghi lại cuộc họp' };
    const w = document.createElement('section'); w.className = 'composer'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', TITLE[type]);
    const assocHtml = () => `<button class="cm-as" data-cmas>Liên kết với ${on.size} bản ghi<span class="ms xs">arrow_drop_down</span></button><div class="cm-asl" id="cmAsl" hidden>${recs.map(([ty, i]) => `<label><input type="checkbox" data-rk="${ty}:${i}" ${on.has(ty + ':' + i) ? 'checked' : ''}><span class="ms xs">${OBJ[ty].icon}</span>${esc(titleOf(ty, get(ty, i)))}<small class="nil">${OBJ[ty].label}</small></label>`).join('')}</div>`;
    w.innerHTML = `<header><button class="cm-hb" data-cmmin aria-label="Thu gọn"><span class="ms sm">expand_more</span></button><b>${ed ? 'Sửa ' + TNAME[type].toLowerCase() : TITLE[type]}</b>
        <button class="cm-hb" data-cmmax aria-label="Phóng to" style="margin-left:auto"><span class="ms sm">open_in_full</span></button><button class="cm-hb" data-cmx aria-label="Đóng"><span class="ms sm">close</span></button></header>
      <div class="cm-body">${type === 'NOTE' ? `<div class="cm-for">Cho <span class="tag">${esc(titleOf(t, self))}</span></div>` : ''}<div class="cm-b">${B[type]}<p class="err" id="cmErr"></p></div>
        <div class="cm-assoc" id="cmAssoc">${assocHtml()}</div>${follow}
        <footer><button class="btn btn--primary" id="cmSave">${ed ? 'Lưu' : BTN[type]}</button>${ed ? '<button class="btn btn--text" data-cmx>Huỷ</button>' : ''}</footer></div>`;
    document.body.appendChild(w);
    const v = s => { const e = w.querySelector(s); return e ? e.value.trim() : ''; };
    (w.querySelector('#cmTitle') || w.querySelector('#cmBody')).focus();
    const dirty = () => !!(w.querySelector('#cmBody')?.innerText.trim() || v('#cmTitle'));
    const close = () => { if (!ed && dirty()) { confirmBox('Bỏ nội dung đang soạn?', 'Nội dung chưa lưu sẽ mất.', 'Bỏ', () => w.remove()); } else w.remove(); };
    w.addEventListener('mousedown', e => { if (e.target.closest('[data-x]')) e.preventDefault(); });
    w.onclick = e => {
      const x = e.target.closest('[data-x]'); if (x) { document.execCommand(x.dataset.x); w.querySelector('#cmBody').focus(); return; }
      const tbt = e.target.closest('[data-tbt]'); if (tbt) { toast(tbt.dataset.tbt); return; }
      if (e.target.closest('[data-cmx]')) { close(); return; }
      if (e.target.closest('[data-cmmin]')) { w.classList.toggle('min'); return; }
      if (e.target.closest('[data-cmmax]')) { w.classList.toggle('max'); return; }
      if (e.target.closest('.composer.min header')) { w.classList.remove('min'); return; }
      if (e.target.closest('[data-cmas]')) { const l = w.querySelector('#cmAsl'); l.hidden = !l.hidden; return; }
      const pp = e.target.closest('[data-pp]'); if (pp) { const l = w.querySelector('#' + pp.dataset.pp); l.hidden = !l.hidden; return; }
      if (!e.target.closest('#cmSave')) return;
      const bodyEl = w.querySelector('#cmBody'), body = bodyEl ? bodyEl.innerText.trim() : '', html = bodyEl ? cleanHtml(bodyEl) : '', title = v('#cmTitle');
      const err = m => { w.querySelector('#cmErr').textContent = m; };
      if (type === 'NOTE' && !body) { err('Nhập nội dung ghi chú'); bodyEl.focus(); return; }
      if (type === 'TASK' && !title) { err('Nhập tên task'); w.querySelector('#cmTitle').focus(); return; }
      if (w.querySelector('#cmTitle') && type === 'MEETING' && opts.schedule && !title) { err('Nhập tiêu đề cuộc họp'); w.querySelector('#cmTitle').focus(); return; }
      if (!on.size) { err('Chọn ít nhất 1 bản ghi để liên kết'); return; }
      const refs = { contacts:[], companies:[], deals:[] }; [...on].forEach(k => { const [ty, i] = k.split(':'); refs[ty === 'contact' ? 'contacts' : ty === 'company' ? 'companies' : 'deals'].push(i); });
      const at = (type === 'MEETING' || type === 'CALL') ? new Date(v('#cmAt')).toISOString() : ed ? ed.at : new Date().toISOString();
      const pick = idd => [...w.querySelectorAll('#' + idd + ' input:checked')].map(i => i.value);
      const clean = s => /^Chọn /.test(s) ? '' : s;
      const a = { type, at, body, html, ...refs };
      if (type === 'TASK') { const dp = v('#cmDueP'); Object.assign(a, { title, due: dp === 'c' ? v('#cmDue') : DUE_P().find(d => d[0] === dp)[2], dueTime: v('#cmDueT'), reminder: v('#cmRem'), repeat: w.querySelector('#cmRep').checked, prio: v('#cmPrio'), kind: v('#cmKind'), assignee: v('#cmAs'), done: ed ? ed.done : false }); }
      if (type === 'MEETING') Object.assign(a, { title: title || (ed && ed.title) || '', dur: ({'15 phút':15,'30 phút':30,'45 phút':45,'1 giờ':60,'1 giờ 30 phút':90,'2 giờ':120})[v('#cmDur')], outcome: clean(v('#cmOut')), attendees: pick('cmWho') });
      if (type === 'CALL') Object.assign(a, { outcome: clean(v('#cmOut')), dir: clean(v('#cmDir')), contacted: pick('cmWho') });
      if (ed) { updateActivity(ed.id, a); w.remove(); toast('Đã lưu thay đổi'); onSaved && onSaved(type); return; }
      addActivity(a);
      if (w.querySelector('#fuOn')?.checked) addActivity({ type:'TASK', at:new Date().toISOString(), title:`Theo dõi: ${TNAME[type].toLowerCase()} với ${titleOf(t, self)}`, body:'', due: v('#fuDue'), dueTime:'08:00', kind: v('#fuKind'), prio:'Không', assignee: ME, done:false, ...refs });
      w.remove(); toast(`Đã lưu ${TNAME[type].toLowerCase()}${w.querySelector('#fuOn')?.checked ? ' + task theo dõi' : ''}`); onSaved && onSaved(type);
    };
    w.onchange = e => {
      const rk = e.target.dataset.rk; if (rk) { e.target.checked ? on.add(rk) : on.delete(rk); w.querySelector('[data-cmas]').innerHTML = `Liên kết với ${on.size} bản ghi<span class="ms xs">arrow_drop_down</span>`; }
      if (e.target.id === 'cmDueP') w.querySelector('#cmDue').hidden = e.target.value !== 'c';
      const pl = e.target.closest('.cm-ppl'); if (pl) w.querySelector('#' + pl.id + 'N').textContent = `${pl.querySelectorAll('input:checked').length} contact`;
    };
    w.onkeydown = e => { if (e.key === 'Escape') close(); if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') w.querySelector('#cmSave').click(); };
  }

  /* ── Line items: card + trình sửa toàn màn hình — clone "Edit line items" của HubSpot ──
     Thanh trên: Huỷ · tiêu đề · Lưu | "Thêm line item ▾" (Chọn từ thư viện sản phẩm / Tạo line item tuỳ chỉnh) · Chỉnh sửa cột · Tiền tệ
     Bảng: kéo để sắp xếp · Tên + mô tả · Tần suất thanh toán · Kỳ hạn · SL · Đơn giá · Chiết khấu (₫/%) · [trường tuỳ chỉnh] · Thành tiền · ⋯
     Tổng kết: Tạm tính · Chiết khấu / Phí / Thuế cấp Deal · Tổng · doanh thu định kỳ; “Dùng tổng line item làm Amount của Deal”.
     Trường tuỳ chỉnh: tạo ngay trong "Chỉnh sửa cột"; khi thêm từ thư viện, giá trị mặc định của sản phẩm tự điền vào line item. */
  function lineItemsCard(el, dealId, refresh) {
    const items = itemsOf(dealId), T = dealTotals(dealId);
    el.innerHTML = `<div class="ch"><span class="ms sm">expand_more</span>Line items (${items.length})<span class="r"><button class="btn btn--text sm" data-liedit>${items.length ? '<span class="ms xs">edit</span>Sửa' : '<span class="ms xs">add</span>Thêm'}</button></span></div>
      <div class="cb">${items.length ? items.map(li => `<div class="li-r"><span class="nm">${esc(li.name)}</span><span class="nil">${li.qty} × ${money(li.price)}${li.freq && li.freq !== 'Một lần' ? ` · ${esc(li.freq.toLowerCase())} × ${li.term || 1} kỳ` : ''}</span><b>${money(liTotal(li))}</b></div>`).join('')
          + (T.adjTotal ? `<div class="li-t sm"><span>Tạm tính</span><span>${money(T.sub)}</span></div>${T.adj.map(a => `<div class="li-t sm"><span>${esc(a.label)}</span><span>${a.sign < 0 ? '− ' : '+ '}${money(a.amount)}</span></div>`).join('')}` : '')
          + `<div class="li-t"><span>Tổng</span><b>${money(T.total)}</b></div>${T.recurring ? `<div class="li-t sm nil"><span>Doanh thu định kỳ hằng năm (ARR)</span><span>${money(T.arr)}</span></div>` : ''}`
        : `<div class="ac-empty"><span class="ms">receipt_long</span>Thêm sản phẩm, dịch vụ vào Deal. Tổng line item sẽ thành Amount của Deal.</div>`}</div>`;
    el.onclick = e => { if (e.target.closest('[data-liedit]')) lineItemEditor(dealId, refresh); };
  }
  const FREQ = ['Một lần','Hằng tháng','Hằng quý','Nửa năm','Hằng năm'];
  const PER_YEAR = { 'Hằng tháng':12, 'Hằng quý':4, 'Nửa năm':2, 'Hằng năm':1 };
  // Thuộc tính line item có sẵn (bật/tắt ở "Chỉnh sửa cột") — cột cố định: Tên, SL, Đơn giá, Thành tiền
  const LI_STD = [{key:'freq', name:'Tần suất thanh toán', type:'SELECT', std:true}, {key:'term', name:'Kỳ hạn (số kỳ)', type:'NUMBER', std:true}, {key:'disc', name:'Chiết khấu', type:'NUMBER', std:true},
    {key:'sku', name:'SKU', type:'TEXT', std:true}, {key:'cost', name:'Giá vốn / đơn vị', type:'NUMBER', std:true}, {key:'desc', name:'Mô tả', type:'TEXT', std:true}];
  function lineItemEditor(dealId, refresh) {
    document.querySelector('.lie-full')?.remove();
    let items = itemsOf(dealId).map(li => ({ freq:'Một lần', term:1, ...li, custom:{ ...(li.custom || {}) } }));
    let adj = (db.liAdj[dealId] || []).map(a => ({ ...a }));
    let useAmount = db.liUseAmount[dealId] !== false;
    let cols = db.liCols ? [...db.liCols] : ['freq','disc', ...db.liFields.map(f => f.key)];
    const d = deals.get(dealId);
    const allProps = () => [...LI_STD, ...db.liFields];
    const P = k => allProps().find(f => f.key === k);
    const w = document.createElement('div'); w.className = 'lie-full'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Sửa line items');
    w.innerHTML = `<header class="lie-top"><button class="btn lie-x" data-liex>Huỷ</button><h2>Line items · ${esc(HX.title(d))}${d.values.t_n_deal ? ` <span>${esc(d.values.t_n_deal)}</span>` : ''}</h2><button class="btn btn--primary" id="lieSave">Lưu</button></header>
      <div class="lie-main"><div class="lie-wrap">
        <div class="lie-bar"><div style="position:relative"><button class="btn btn--primary sm" id="lieAddB">Thêm line item<span class="ms xs">arrow_drop_down</span></button>
          <div class="pop" id="lieAddP" style="top:36px;left:0;width:260px"><button class="mi" data-lib><span class="ms sm">inventory_2</span>Chọn từ thư viện sản phẩm</button><button class="mi" data-cust><span class="ms sm">add</span>Tạo line item tuỳ chỉnh</button></div></div>
          <button class="btn btn--secondary sm" id="lieCols"><span class="ms xs">view_column</span>Chỉnh sửa cột</button>
          <span class="lie-cur">Tiền tệ: <b>VND (₫)</b></span></div>
        <div class="lie-tw"><table class="lie-t"><thead id="lieH"></thead><tbody id="lieB"></tbody></table></div>
        <div class="lie-foot"><label class="lie-use"><input type="checkbox" id="lieUse" ${useAmount ? 'checked' : ''}> Dùng tổng line item làm <b>Amount</b> của Deal (Tổng Cash-In Dự Kiến)</label><div class="lie-sum" id="lieSum"></div></div>
      </div><aside class="lie-lib" id="lieLib" hidden></aside></div><div class="pop" id="lieRowP" style="width:240px"></div>`;
    document.body.appendChild(w); document.body.classList.add('lie-open');
    const $w = s => w.querySelector(s);
    const drawH = () => { $w('#lieH').innerHTML = `<tr><th class="dg"></th><th>Tên</th>${cols.filter(k => P(k)).map(k => `<th class="${['term','disc','cost'].includes(k) || P(k).type === 'NUMBER' ? 'n' : ''}">${esc(P(k).name)}${P(k).std ? '' : ' <span class="cfb" title="Thuộc tính tuỳ chỉnh">tuỳ chỉnh</span>'}</th>`).join('')}<th class="n">Số lượng</th><th class="n">Đơn giá</th><th class="n">Thành tiền</th><th></th></tr>`; };
    const inp = (i, k, v, type, extra = '') => `<input class="ed" data-i="${i}" data-k="${k}" type="${type}" value="${esc(v ?? '')}" ${extra}>`;
    const cellOf = (li, i, k) => {
      const f = P(k); if (!f) return '';
      if (k === 'freq') return `<td><select class="ed" data-i="${i}" data-k="freq">${FREQ.map(x => `<option ${x === li.freq ? 'selected' : ''}>${x}</option>`).join('')}</select></td>`;
      if (k === 'term') return `<td class="n">${li.freq === 'Một lần' ? '<span class="nil">—</span>' : inp(i, 'term', li.term || 1, 'number', 'min="1" aria-label="Số kỳ"')}</td>`;
      if (k === 'disc') return `<td class="n"><span class="disc">${inp(i, 'disc', li.disc || 0, 'number', 'min="0" aria-label="Chiết khấu"')}<select class="ed" data-i="${i}" data-k="discType" aria-label="Kiểu chiết khấu"><option ${li.discType !== '%' ? 'selected' : ''}>₫</option><option ${li.discType === '%' ? 'selected' : ''}>%</option></select></span></td>`;
      if (k === 'sku') return `<td>${inp(i, 'sku', li.sku ?? ((db.products.find(p => p.id === li.product) || {}).sku || ''), 'text', 'aria-label="SKU"')}</td>`;
      if (k === 'cost') return `<td class="n">${inp(i, 'cost', li.cost ?? '', 'number', 'min="0" aria-label="Giá vốn"')}</td>`;
      if (k === 'desc') return `<td>${inp(i, 'desc', li.desc ?? ((db.products.find(p => p.id === li.product) || {}).desc || ''), 'text', 'aria-label="Mô tả"')}</td>`;
      const v = li.custom[k];
      if (f.type === 'SELECT') return `<td><select class="ed" data-i="${i}" data-c="${k}"><option value=""></option>${(f.choices || []).map(c => `<option ${c === v ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></td>`;
      if (f.type === 'CHECKBOX') return `<td style="text-align:center"><input type="checkbox" data-i="${i}" data-c="${k}" ${v ? 'checked' : ''} aria-label="${esc(f.name)}"></td>`;
      return `<td class="${f.type === 'NUMBER' ? 'n' : ''}"><input class="ed" data-i="${i}" data-c="${k}" type="${f.type === 'NUMBER' ? 'number' : f.type === 'DATE' ? 'date' : 'text'}" value="${esc(v ?? '')}" aria-label="${esc(f.name)}"></td>`;
    };
    const drawB = () => {
      const vc = cols.filter(k => P(k));
      $w('#lieB').innerHTML = items.length ? items.map((li, i) => `<tr draggable="true" data-row="${i}"><td class="dg" title="Kéo để sắp xếp"><span class="ms sm">drag_indicator</span></td>
          <td class="nmc">${inp(i, 'name', li.name, 'text', 'class="ed nm" aria-label="Tên line item"')}<small class="nil">${li.product ? 'Từ thư viện sản phẩm' : 'Line item tuỳ chỉnh'}</small></td>
          ${vc.map(k => cellOf(li, i, k)).join('')}
          <td class="n">${inp(i, 'qty', li.qty, 'number', 'min="0" aria-label="Số lượng" style="width:80px"')}</td>
          <td class="n">${inp(i, 'price', li.price, 'number', 'min="0" aria-label="Đơn giá"')}</td>
          <td class="n"><b>${money(liTotal(li))}</b>${li.freq !== 'Một lần' ? `<small class="nil">${money(liNet(li))} / ${li.freq === 'Hằng tháng' ? 'tháng' : li.freq === 'Hằng quý' ? 'quý' : li.freq === 'Nửa năm' ? '6 tháng' : 'năm'}</small>` : ''}</td>
          <td><button class="btn btn--text btn--icon" data-rowm="${i}" aria-label="Thao tác dòng"><span class="ms sm">more_horiz</span></button></td></tr>`).join('')
        : `<tr><td colspan="${6 + vc.length}"><div class="lie-empty"><span class="ms">receipt_long</span><b>Chưa có line item</b>Thêm sản phẩm từ thư viện hoặc tạo line item tuỳ chỉnh.<span><button class="btn btn--primary sm" data-lib>Chọn từ thư viện</button> <button class="btn btn--secondary sm" data-cust>Tạo tuỳ chỉnh</button></span></div></td></tr>`;
      const T = totalsOf(items, adj);
      $w('#lieSum').innerHTML = `<div><span>Tạm tính</span><b>${money(T.sub)}</b></div>${T.lineDisc ? `<div class="ls-sub"><span>Đã gồm chiết khấu dòng</span><span>− ${money(T.lineDisc)}</span></div>` : ''}
        ${adj.map((a, j) => `<div class="adj"><select class="ed sm" data-aj="${j}" data-ak="type"><option value="discount" ${a.type === 'discount' ? 'selected' : ''}>Chiết khấu</option><option value="fee" ${a.type === 'fee' ? 'selected' : ''}>Phí</option><option value="tax" ${a.type === 'tax' ? 'selected' : ''}>Thuế</option></select>
          <input class="ed sm" data-aj="${j}" data-ak="name" value="${esc(a.name || '')}" placeholder="Tên (vd. VAT)"><input class="ed sm n" type="number" min="0" data-aj="${j}" data-ak="value" value="${a.value ?? 0}"><select class="ed sm" data-aj="${j}" data-ak="mode"><option ${a.mode !== '₫' ? 'selected' : ''}>%</option><option ${a.mode === '₫' ? 'selected' : ''}>₫</option></select>
          <span class="amt">${T.adj[j].sign < 0 ? '− ' : '+ '}${money(T.adj[j].amount)}</span><button class="btn btn--text btn--icon" data-ajrm="${j}" aria-label="Xoá"><span class="ms xs">close</span></button></div>`).join('')}
        <div class="addadj"><button class="lk" data-ajadd="discount">+ Chiết khấu</button><button class="lk" data-ajadd="fee">+ Phí</button><button class="lk" data-ajadd="tax">+ Thuế</button></div>
        <div class="tot"><span>Tổng</span><b>${money(T.total)}</b></div>${T.recurring ? `<div class="ls-sub"><span>Doanh thu định kỳ hằng năm (ARR)</span><span>${money(T.arr)}</span></div><div class="ls-sub"><span>Doanh thu định kỳ hằng tháng (MRR)</span><span>${money(T.arr / 12)}</span></div>` : ''}`;
    };
    drawH(); drawB();
    const keepFocus = fn => { const a = document.activeElement, ds = a && a.dataset ? { ...a.dataset } : {}; fn();
      const sel = ds.i !== undefined ? `[data-i="${ds.i}"][data-${ds.k ? 'k' : 'c'}="${ds.k || ds.c}"]` : ds.aj !== undefined ? `[data-aj="${ds.aj}"][data-ak="${ds.ak}"]` : null;
      const el2 = sel && w.querySelector(sel); if (el2) { el2.focus(); try { if (el2.type === 'text') el2.setSelectionRange(el2.value.length, el2.value.length); } catch {} } };
    /* Thư viện sản phẩm — panel bên phải */
    const libSel = new Map();
    const drawLib = (q = '') => { const L = $w('#lieLib'); L.hidden = false;
      L.innerHTML = `<div class="ll-h"><b>Thư viện sản phẩm</b><button class="btn btn--text btn--icon" data-libx aria-label="Đóng"><span class="ms sm">close</span></button></div>
        <label class="srch2" style="height:34px;flex:none"><input id="libQ" placeholder="Tìm theo tên, SKU" value="${esc(q)}"><span class="ms sm">search</span></label>
        <div class="ll-l">${db.products.filter(p => !q || (p.name + ' ' + p.sku).toLowerCase().includes(q.toLowerCase())).map(p => `<label class="ll-p"><input type="checkbox" data-pid="${p.id}" ${libSel.has(p.id) ? 'checked' : ''}><span class="ll-i"><b>${esc(p.name)}</b><small>${esc(p.sku)} · ${esc(p.freq || 'Một lần')}</small><small class="nil">${esc(p.desc || '')}</small></span><span class="ll-r"><b>${money(p.price)}</b>${libSel.has(p.id) ? `<span class="qty"><button data-pq="${p.id}" data-d="-1" aria-label="Giảm">−</button><span>${libSel.get(p.id)}</span><button data-pq="${p.id}" data-d="1" aria-label="Tăng">+</button></span>` : ''}</span></label>`).join('') || '<div class="nil" style="padding:12px">Không tìm thấy sản phẩm</div>'}</div>
        <div class="ll-f"><button class="lk" data-toast="Tạo sản phẩm mới trong thư viện (collection Sản phẩm của ERP)">+ Tạo sản phẩm</button><button class="btn btn--primary sm" id="libAdd" ${libSel.size ? '' : 'disabled'}>Thêm${libSel.size ? ` (${libSel.size})` : ''}</button></div>`;
      const qi = $w('#libQ'); qi.oninput = () => { drawLib(qi.value); const n = $w('#libQ'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }; };
    const addFromLib = () => { libSel.forEach((qty, pid) => { const p = db.products.find(x => x.id === pid);
        items.push({ id:'li' + Date.now().toString(36) + pid, product:p.id, name:p.name, qty, price:p.price, disc:0, discType:'₫', freq:p.freq || 'Một lần', term:p.term || 1, custom:{ ...(p.defaults || {}) } }); });
      const n = libSel.size, filled = [...libSel.keys()].some(pid => Object.keys((db.products.find(x => x.id === pid) || {}).defaults || {}).length);
      libSel.clear(); $w('#lieLib').hidden = true; drawB(); toast(`Đã thêm ${n} line item${filled ? ' · trường tuỳ chỉnh đã tự điền từ sản phẩm' : ''}`); };
    const closeAll = () => w.querySelectorAll('.pop.open').forEach(p => p.classList.remove('open'));
    const exit = () => { w.remove(); document.body.classList.remove('lie-open'); };
    w.addEventListener('input', e => { const t = e.target;
      if (t.dataset.i !== undefined && t.type !== 'checkbox') { const li = items[t.dataset.i];
        if (t.dataset.k) { const k = t.dataset.k; li[k] = ['qty','price','disc','term','cost'].includes(k) ? (t.value === '' ? (k === 'cost' ? null : 0) : Number(t.value)) : t.value; if (['qty','price','disc','term'].includes(k)) keepFocus(drawB); }
        if (t.dataset.c) { const f = P(t.dataset.c); li.custom[f.key] = f.type === 'NUMBER' ? (t.value === '' ? null : Number(t.value)) : t.value; } }
      if (t.dataset.aj !== undefined && t.tagName === 'INPUT') { adj[t.dataset.aj][t.dataset.ak] = t.dataset.ak === 'value' ? Number(t.value) : t.value; if (t.dataset.ak === 'value') keepFocus(drawB); } });
    w.addEventListener('change', e => { const t = e.target;
      if (t.dataset.k === 'discType' || t.dataset.k === 'freq') { items[t.dataset.i][t.dataset.k] = t.value; keepFocus(drawB); }
      if (t.dataset.c && t.type === 'checkbox') items[t.dataset.i].custom[t.dataset.c] = t.checked;
      if (t.dataset.c && t.tagName === 'SELECT') items[t.dataset.i].custom[t.dataset.c] = t.value;
      if (t.dataset.aj !== undefined && t.tagName === 'SELECT') { adj[t.dataset.aj][t.dataset.ak] = t.value; drawB(); }
      if (t.dataset.pid) { t.checked ? libSel.set(t.dataset.pid, 1) : libSel.delete(t.dataset.pid); drawLib($w('#libQ').value); }
      if (t.id === 'lieUse') useAmount = t.checked; });
    w.addEventListener('click', e => {
      const t = e.target;
      if (t.closest('[data-toast]')) { toast(t.closest('[data-toast]').dataset.toast); return; }
      if (t.closest('[data-liex]')) { exit(); return; }
      if (t.closest('#lieAddB')) { e.stopPropagation(); $w('#lieAddP').classList.toggle('open'); return; }
      if (t.closest('[data-lib]')) { closeAll(); drawLib(); $w('#libQ').focus(); return; }
      if (t.closest('[data-libx]')) { libSel.clear(); $w('#lieLib').hidden = true; return; }
      const pq = t.closest('[data-pq]'); if (pq) { e.preventDefault(); const id = pq.dataset.pq; libSel.set(id, Math.max(1, libSel.get(id) + Number(pq.dataset.d))); drawLib($w('#libQ').value); return; }
      if (t.closest('#libAdd')) { addFromLib(); return; }
      if (t.closest('[data-cust]')) { closeAll(); items.push({ id:'li' + Date.now().toString(36), product:null, name:'', qty:1, price:0, disc:0, discType:'₫', freq:'Một lần', term:1, custom:{} }); drawB(); w.querySelector(`[data-i="${items.length - 1}"][data-k="name"]`).focus(); return; }
      if (t.closest('#lieCols')) { editCols(); return; }
      const rm = t.closest('[data-rowm]'); if (rm) { e.stopPropagation(); const i = +rm.dataset.rowm, p = $w('#lieRowP'), r = rm.getBoundingClientRect();
        p.style.position = 'fixed'; p.style.left = Math.min(r.right - 240, innerWidth - 248) + 'px'; p.style.top = (r.bottom + 4) + 'px';
        p.innerHTML = `<button class="mi" data-rcl="${i}"><span class="ms sm">content_copy</span>Nhân bản</button>${items[i].product ? '' : `<button class="mi" data-rsv="${i}"><span class="ms sm">inventory_2</span>Lưu vào thư viện sản phẩm</button>`}
          ${i > 0 ? `<button class="mi" data-rmv="${i}" data-d="-1"><span class="ms sm">arrow_upward</span>Chuyển lên</button>` : ''}${i < items.length - 1 ? `<button class="mi" data-rmv="${i}" data-d="1"><span class="ms sm">arrow_downward</span>Chuyển xuống</button>` : ''}
          <div class="sep"></div><button class="mi" data-rdel="${i}" style="color:var(--error)"><span class="ms sm">delete</span>Xoá</button>`; p.classList.add('open'); return; }
      const rcl = t.closest('[data-rcl]'); if (rcl) { const i = +rcl.dataset.rcl; items.splice(i + 1, 0, { ...items[i], id:'li' + Date.now().toString(36), custom:{ ...items[i].custom } }); closeAll(); drawB(); return; }
      const rsv = t.closest('[data-rsv]'); if (rsv) { const li = items[+rsv.dataset.rsv]; if (!String(li.name).trim()) { toast('Nhập tên trước khi lưu vào thư viện'); return; }
        const p = { id:'p' + Date.now().toString(36), name:li.name, sku:'CUSTOM-' + (db.products.length + 1), price:li.price, desc:li.desc || '', freq:li.freq, term:li.term, defaults:{ ...li.custom } }; db.products.push(p); persist(); li.product = p.id; closeAll(); drawB(); toast(`Đã lưu “${li.name}” vào thư viện sản phẩm`); return; }
      const rmv = t.closest('[data-rmv]'); if (rmv) { const i = +rmv.dataset.rmv, j = i + Number(rmv.dataset.d); [items[i], items[j]] = [items[j], items[i]]; closeAll(); drawB(); return; }
      const rd = t.closest('[data-rdel]'); if (rd) { items.splice(+rd.dataset.rdel, 1); closeAll(); drawB(); return; }
      const aa = t.closest('[data-ajadd]'); if (aa) { const ty = aa.dataset.ajadd; adj.push({ type:ty, name: ty === 'tax' ? 'VAT' : ty === 'fee' ? 'Phí' : 'Chiết khấu Deal', value: ty === 'tax' ? 10 : 0, mode:'%' }); drawB(); return; }
      const ar = t.closest('[data-ajrm]'); if (ar) { adj.splice(+ar.dataset.ajrm, 1); drawB(); return; }
      if (t.closest('#lieSave')) {
        const bad = items.findIndex(li => !String(li.name).trim()); if (bad >= 0) { toast('Line item cần có tên'); w.querySelector(`[data-i="${bad}"][data-k="name"]`).focus(); return; }
        db.liAdj[dealId] = adj; db.liUseAmount[dealId] = useAmount; db.liCols = cols;
        const tot = saveItems(dealId, items, useAmount); exit(); toast(`Đã lưu ${items.length} line item · Tổng ${money(tot)}${useAmount ? ' → Amount của Deal' : ''}`); refresh && refresh(); return; }
      if (!t.closest('.pop')) closeAll();
    });
    // Kéo thả sắp xếp dòng
    let dragI = null;
    w.addEventListener('dragstart', e => { const r = e.target.closest('[data-row]'); if (!r) return; if (!e.target.closest('.dg') && document.activeElement && document.activeElement.closest && document.activeElement.closest('[data-row]') === r) {} dragI = +r.dataset.row; r.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(dragI)); });
    w.addEventListener('dragover', e => { const r = e.target.closest('[data-row]'); if (r && dragI !== null) { e.preventDefault(); w.querySelectorAll('.dropb').forEach(x => x.classList.remove('dropb')); r.classList.add('dropb'); } });
    w.addEventListener('drop', e => { const r = e.target.closest('[data-row]'); if (!r || dragI === null) return; e.preventDefault(); const j = +r.dataset.row; const [m] = items.splice(dragI, 1); items.splice(j, 0, m); dragI = null; drawB(); });
    w.addEventListener('dragend', () => { dragI = null; w.querySelectorAll('.dragging,.dropb').forEach(x => x.classList.remove('dragging', 'dropb')); });
    w.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$w('#lieLib').hidden) { $w('#lieLib').hidden = true; return; } exit(); } });
    /* "Chỉnh sửa cột" — chọn cột hiển thị + tạo thuộc tính line item tuỳ chỉnh (HubSpot: Choose which columns you see / Create property) */
    function editCols() {
      let shown = [...cols];
      HX.modal(`<div class="modal xl" role="dialog" aria-modal="true" aria-labelledby="lcT" style="height:min(600px,92vh);z-index:1100"><div class="mh" id="lcT">Chọn cột hiển thị<button class="btn btn--text btn--icon x" data-close aria-label="Đóng"><span class="ms">close</span></button></div>
        <div class="ec"><div class="ec-l"><label class="srch2" style="height:34px;flex:none;margin-bottom:8px"><input id="lcQ" placeholder="Tìm thuộc tính"><span class="ms sm">search</span></label><div class="lst" id="lcL"></div>
          <div class="lc-new"><div class="grp">Tạo thuộc tính line item mới</div><input class="in" id="nfName" placeholder="Tên thuộc tính (vd. Số user, Ngày bắt đầu)">
            <select class="in" id="nfType"><option value="TEXT">Văn bản</option><option value="NUMBER">Số</option><option value="DATE">Ngày</option><option value="SELECT">Lựa chọn đơn</option><option value="CHECKBOX">Hộp kiểm</option></select>
            <input class="in" id="nfOpts" placeholder="Các lựa chọn, cách nhau bằng dấu phẩy" hidden><button class="btn btn--secondary sm" id="nfGo"><span class="ms xs">add</span>Tạo thuộc tính</button></div></div>
        <div class="ec-r"><div class="top"><span id="lcN"></span></div><div class="sel fixed"><span class="nm">Tên</span><span class="nil" style="font-size:12px">Cố định</span></div><div class="lst" id="lcR"></div>
          <div class="sel fixed"><span class="nm">Số lượng · Đơn giá · Thành tiền</span><span class="nil" style="font-size:12px">Cố định</span></div></div></div>
        <div class="mf l"><button class="btn btn--primary" id="lcOk">Áp dụng</button><button class="btn btn--secondary" data-close>Huỷ</button></div></div>`, (bg, close) => {
        let q = '';
        const draw = () => { $('#lcL', bg).innerHTML = `<div class="grp">Thuộc tính có sẵn</div>${LI_STD.filter(f => !q || f.name.toLowerCase().includes(q)).map(f => `<label><input type="checkbox" data-k="${f.key}" ${shown.includes(f.key) ? 'checked' : ''}>${esc(f.name)}</label>`).join('')}
            <div class="grp">Thuộc tính tuỳ chỉnh (${db.liFields.length})</div>${db.liFields.filter(f => !q || f.name.toLowerCase().includes(q)).map(f => `<label><input type="checkbox" data-k="${f.key}" ${shown.includes(f.key) ? 'checked' : ''}>${esc(f.name)}<small class="nil" style="margin-left:auto">${HX.TYPE[f.type] ? HX.TYPE[f.type].name : f.type}</small></label>`).join('') || '<div class="nil" style="font-size:13px">Chưa có</div>'}`;
          $('#lcN', bg).textContent = `Cột đang hiển thị (${shown.length + 4})`;
          $('#lcR', bg).innerHTML = shown.filter(k => P(k)).map((k, i) => `<div class="sel"><span class="ms sm">drag_indicator</span><span class="nm">${esc(P(k).name)}</span>${i ? `<button class="rm" data-up="${i}" aria-label="Chuyển lên"><span class="ms xs">arrow_upward</span></button>` : ''}<button class="rm" data-rm="${k}" aria-label="Bỏ cột"><span class="ms xs">close</span></button></div>`).join(''); };
        draw();
        $('#lcQ', bg).oninput = e => { q = e.target.value.trim().toLowerCase(); draw(); };
        $('#lcL', bg).onchange = e => { const k = e.target.dataset.k; if (!k) return; shown = e.target.checked ? [...shown, k] : shown.filter(x => x !== k); draw(); };
        $('#lcR', bg).onclick = e => { const r = e.target.closest('[data-rm]'); if (r) { shown = shown.filter(x => x !== r.dataset.rm); draw(); }
          const up = e.target.closest('[data-up]'); if (up) { const i = +up.dataset.up; [shown[i - 1], shown[i]] = [shown[i], shown[i - 1]]; draw(); } };
        $('#nfType', bg).onchange = e => { $('#nfOpts', bg).hidden = e.target.value !== 'SELECT'; };
        $('#nfGo', bg).onclick = () => { const name = $('#nfName', bg).value.trim(); if (!name) { $('#nfName', bg).focus(); return; }
          const type = $('#nfType', bg).value, key = 'cf_' + (HX.slug(name) || db.liFields.length); if (db.liFields.some(f => f.key === key)) { toast('Đã có thuộc tính này'); return; }
          const f = { key, name, type }; if (type === 'SELECT') { f.choices = $('#nfOpts', bg).value.split(',').map(s => s.trim()).filter(Boolean); if (!f.choices.length) { $('#nfOpts', bg).focus(); toast('Nhập ít nhất 1 lựa chọn'); return; } }
          db.liFields.push(f); persist(); shown.push(key); $('#nfName', bg).value = ''; $('#nfOpts', bg).value = ''; draw(); toast(`Đã tạo thuộc tính “${name}” — điền giá trị ngay trên từng line item`); };
        $('#lcOk', bg).onclick = () => { cols = shown; close(); drawH(); drawB(); };
      });
    }
  }

  /* ── Phần 7: API Trường bổ sung ── */
  const fieldsOf = t => OBJ[t].fields;
  const isNewField = (t, f) => t === 'deal' ? !DEAL_BASE.includes(f.key) : !!f.custom;
  function extraKeys(t) {
    const all = fieldsOf(t), has = k => all.some(f => f.key === k), off = (db.extraOff || {})[t] || [];
    const auto = all.filter(f => isNewField(t, f) && !db.extra[t].includes(f.key) && !off.includes(f.key)).map(f => f.key);
    return [...db.extra[t].filter(has), ...auto];
  }
  function setExtra(t, keys) {
    db.extra[t] = [...keys]; db.extraOff = db.extraOff || {};
    db.extraOff[t] = fieldsOf(t).filter(f => isNewField(t, f) && !keys.includes(f.key)).map(f => f.key); persist();
  }
  function addCustomField(t, def) {
    const clean = { name: def.name.trim(), type: def.type, ...(def.choices && def.choices.length ? { choices: def.choices } : {}), ...(def.desc ? { desc: def.desc } : {}) };
    let f;
    if (t === 'deal') f = deals.addField(clean);
    else { const base = 'cf_' + (HX.slug(clean.name) || 'truong'); let key = base, n = 2; while (fieldsOf(t).some(x => x.key === key)) key = base + '_' + n++;
      f = { ...clean, key, custom:true, createdAt:new Date().toISOString() }; db.cf[t].push(f); FIELDS_OF[t].push(f); }
    if (def.show !== false && !db.extra[t].includes(f.key)) db.extra[t].push(f.key);
    persist(); return f;
  }

  /* ── Phần 7: API Sales ── */
  const sales = () => db.sales;
  const saleById = id => db.sales.find(s => s.id === id);
  const saleByName = n => db.sales.find(s => s.values.name === n);
  const saleUrl = n => { const s = saleByName(n); return s ? `crm-sales-hubspot.html?id=${s.id}` : null; };
  function createSale(values) {
    const s = { id:'s' + Date.now().toString(36), createdAt:new Date().toISOString(), values:{ status:'Đang làm việc', ...values } };
    db.sales.push(s); if (!USERS.includes(s.values.name)) USERS.push(s.values.name); persist(); return s;
  }
  function updateSale(id, key, value) {
    const s = saleById(id); if (!s) return; const old = s.values[key]; s.values[key] = value;
    if (key === 'name' && old && value && old !== value) { // đổi tên → đổi theo ở mọi bản ghi đang sở hữu
      db.contacts.concat(db.companies).forEach(r => { if (r.values.owner === old) r.values.owner = value; });
      deals.list().forEach(d => { if (d.values[SALE] === old) deals.update(d.id, SALE, value); });
      const i = USERS.indexOf(old); if (i >= 0) USERS[i] = value; else USERS.push(value);
    }
    persist();
  }
  // KPI của 1 sale trong khoảng [from, to) (Date / ms)
  function saleStats(name, from, to) {
    const inR = d => { const x = +new Date(d); return x >= +from && x < +to; };
    const ds = deals.list().filter(d => d.values[SALE] === name);
    const open = ds.filter(d => ![WON, LOST].includes(d.values[STAGE])), won = ds.filter(d => d.values[STAGE] === WON && d.values[CLOSE] && inR(d.values[CLOSE])), lost = ds.filter(d => d.values[STAGE] === LOST && d.values[CLOSE] && inR(d.values[CLOSE]));
    const cash = d => Number(d.values[CASH]) || 0;
    const acts = [...db.activities].filter(a => a.by === name || a.assignee === name);
    const today = TODAY.toISOString().slice(0, 10);
    const tasks = db.activities.filter(a => a.type === 'TASK' && (a.assignee || a.by) === name && !a.done);
    const q = Number((saleByName(name) || { values:{} }).values.quota) || 0;
    const months = Math.max(1, Math.round((+to - +from) / (30.44 * 864e5)));
    const wonSum = won.reduce((s, d) => s + cash(d), 0);
    return {
      contacts: db.contacts.filter(c => c.values.owner === name), companies: db.companies.filter(c => c.values.owner === name),
      deals: ds, open, won, lost, pipeline: open.reduce((s, d) => s + cash(d), 0),
      forecast: open.reduce((s, d) => s + cash(d) * (Number(d.values.t_l_th_nh_c_ng) || 0) / 100, 0),
      wonSum, quota: q * months, pct: q ? Math.round(wonSum / (q * months) * 100) : null,
      winRate: won.length + lost.length ? Math.round(won.length / (won.length + lost.length) * 100) : null,
      acts30: acts.filter(a => a.type !== 'TASK' && +new Date(a.at) > +TODAY - 30 * 864e5 && a.at <= TODAY.toISOString()).length,
      tasks, overdue: tasks.filter(a => a.due && a.due < today), dueToday: tasks.filter(a => a.due === today),
      upcoming: [...tasks.filter(a => !a.due || a.due >= today), ...db.activities.filter(a => a.type === 'MEETING' && a.by === name && a.at > TODAY.toISOString())].sort((a, b) => String(a.due || a.at).localeCompare(String(b.due || b.at))),
      recent: acts.filter(a => a.at <= TODAY.toISOString() && a.type !== 'TASK').sort((a, b) => b.at.localeCompare(a.at)),
    };
  }

  /* ── Liên kết trong form "Tạo bản ghi" của Deals (HX.openCreate) ── */
  const dealAssocForm = () => `<div class="assoc-sec"><b>Liên kết Deal với</b><label>Company<select class="in" id="cf__company"><option value="">— Không —</option>${db.companies.map(c => `<option value="${c.id}">${esc(c.values.name)}</option>`).join('')}</select></label>
    <label>Contact<select class="in" id="cf__contact"><option value="">— Không —</option>${db.contacts.map(c => `<option value="${c.id}">${esc(fullName(c))}${c.company ? ' · ' + esc((get('company', c.company) || {values:{}}).values.name || '') : ''}</option>`).join('')}</select></label></div>`;
  function saveDealAssoc(dealId, p) { const co = p.querySelector('#cf__company'), ct = p.querySelector('#cf__contact');
    if (ct && ct.value) { associate('deal', dealId, 'contact', ct.value, 'Người quyết định'); const c = get('contact', ct.value); if (c.company && !(co && co.value)) associate('deal', dealId, 'company', c.company); }
    if (co && co.value) associate('deal', dealId, 'company', co.value); }

  return { ME, TODAY, LIFECYCLE, LEAD_STATUS, SOURCES, INDUSTRIES, ASSOC_LABELS, CONTACT_FIELDS, COMPANY_FIELDS, OBJ, STAGE, CASH, CLOSE, SALE, WON, LOST,
    db: () => db, get, list, related, assoc, associate, dissociate, update, create, remove, activitiesOf, addActivity, updateActivity, lastContacted, itemsOf, liTotal, liNet, totalsOf, dealTotals, saveItems, money,
    SALE_FIELDS, TEAMS, ROLES, sales, saleById, saleByName, saleUrl, createSale, updateSale, saleStats, DEAL_BASE, isNewField, extraKeys, setExtra, addCustomField,
    titleOf, fullName, initials, url, dt, dOnly, props, createPanel, addAssocPanel, assocCard, timeline, composer, lineItemsCard, lineItemEditor, dealAssocForm, saveDealAssoc,
    reset() { try { localStorage.removeItem(KEY); } catch {} } };
})();

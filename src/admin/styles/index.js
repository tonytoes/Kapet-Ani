const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brand-dark:        #8B5A2B;
    --brand-mid:         #C9873A;
    --brand-light:       #f0c27c;
    --brand-gradient:    linear-gradient(180deg, #8B5A2B 0%, #C9873A 100%);
    --brand-progress:    linear-gradient(90deg, #8B5A2B, #C9873A);
    --bg-page:           #F2F4F7;
    --bg-card:           #FFFFFF;
    --text-primary:      #1A1A2E;
    --text-secondary:    #6B7280;
    --text-muted:        #9CA3AF;
    --text-sidebar:      rgba(255,255,255,0.80);
    --color-green:       #22C55E;
    --color-green-bg:    #DCFCE7;
    --color-red:         #EF4444;
    --color-red-bg:      #FEE2E2;
    --color-orange:      #F97316;
    --color-blue:        #3B82F6;
    --color-blue-bg:     #EFF6FF;
    --border-light:      #EAECF0;
    --shadow-card:       0 2px 16px rgba(0,0,0,0.07);
    --shadow-sidebar:    4px 0 24px rgba(0,0,0,0.12);
    --shadow-panel:      -4px 0 24px rgba(0,0,0,0.08);
    --sidebar-width:     240px;
    --topbar-height:     58px;
    --panel-width:       380px;
    --radius-card:       16px;
    --radius-input:      10px;
    --radius-badge:      20px;
    --radius-btn:        10px;
    --font-body:         'DM Sans', sans-serif;
    --font-display:      'Playfair Display', serif;
  }

  body { font-family: var(--font-body); background: var(--bg-page); color: var(--text-primary); font-size: 14px; -webkit-font-smoothing: antialiased; }

  .kp-wrapper { display: flex; min-height: 100vh; }
  .kp-content { margin-left: var(--sidebar-width); flex: 1; min-width: 0; display: flex; flex-direction: column; transition: margin-left 0.3s ease; }
  .kp-content.expanded { margin-left: 0; }

  /* Sidebar */
  .kp-sidebar { width: var(--sidebar-width); background: var(--brand-gradient); color: var(--text-sidebar); min-height: 100vh; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; z-index: 200; transition: transform 0.3s ease; box-shadow: var(--shadow-sidebar); }
  .kp-sidebar.collapsed { transform: translateX(calc(-1 * var(--sidebar-width))); }
  .sidebar-header { display: flex; align-items: center; gap: 10px; padding: 22px 20px 18px; border-bottom: 1px solid rgba(255,255,255,0.12); }
  .sidebar-header h4 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: #fff; }
  .sidebar-logo-img { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
  .sidebar-logo-img img { width: 100%; height: 700%; object-fit: contain; }
  .kp-sidebar-nav { flex: 1; padding: 16px 12px; list-style: none; }
  .kp-sidebar-nav li { margin-bottom: 3px; }
  .kp-sidebar-nav a { display: flex; align-items: center; gap: 11px; padding: 9px 13px; border-radius: 9px; color: var(--text-sidebar); text-decoration: none; font-size: 0.855rem; font-weight: 500; transition: background 0.15s, color 0.15s; cursor: pointer; }
  .kp-sidebar-nav a i { font-size: 0.95rem; width: 17px; text-align: center; opacity: 0.75; }
  .kp-sidebar-nav a:hover { background: rgba(255,255,255,0.14); color: #fff; }
  .kp-sidebar-nav a.active { background: rgba(255,255,255,0.22); color: #fff; font-weight: 600; }
  .sidebar-profile { padding: 14px 18px; border-top: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; gap: 11px; }
  .profile-avatar { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.22); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; color: #fff; font-weight: 700; flex-shrink: 0; cursor: pointer; }
  .profile-name { font-size: 0.78rem; font-weight: 600; color: #fff; line-height: 1.2; }
  .profile-role { font-size: 0.68rem; color: rgba(255,255,255,0.6); }

  /* Topbar */
  .kp-topbar { background: var(--bg-card); height: var(--topbar-height); padding: 0 26px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-light); position: sticky; top: 0; z-index: 100; flex-shrink: 0; }
  .topbar-left { display: flex; align-items: center; gap: 14px; }
  .topbar-right { display: flex; align-items: center; gap: 8px; }
  .toggle-btn { width: 34px; height: 34px; border: 1.5px solid var(--border-light); border-radius: 9px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-primary); font-size: 1.05rem; transition: background 0.14s; }
  .toggle-btn:hover { background: #F9FAFB; }
  .page-title { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); }
  .topbar-icon-btn { width: 34px; height: 34px; border-radius: 9px; background: #F9FAFB; border: 1.5px solid var(--border-light); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); font-size: 0.95rem; position: relative; transition: background 0.14s; }
  .topbar-icon-btn:hover { background: #F3F4F6; }
  .notif-dot { width: 7px; height: 7px; background: var(--color-orange); border-radius: 50%; position: absolute; top: 6px; right: 6px; border: 1.5px solid #fff; }
  .topbar-avatar { width: 34px; height: 34px; border-radius: 50%; background: rgba(139,90,43,0.15); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; color: var(--brand-dark); font-weight: 700; cursor: pointer; }

  /* Cards */
  .card { background: var(--bg-card); border-radius: var(--radius-card); box-shadow: var(--shadow-card); }
  .card-padded { padding: 22px 24px; }
  .page-body { padding: 22px 26px 40px; flex: 1; }

  /* Dashboard grids */
  .dash-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 20px; }
  .dash-row-2 { display: grid; grid-template-columns: 1fr 2fr; gap: 18px; margin-bottom: 20px; align-items: start; }

  /* Stat cards */
  .stat-icon-wrap { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; margin-bottom: 12px; }
  .stat-icon-wrap.sales      { background: #FFF5E6; color: var(--brand-mid); }
  .stat-icon-wrap.users      { background: #EFF6FF; color: #3B82F6; }
  .stat-icon-wrap.complaints { background: #FFF5E6; color: var(--brand-mid); }
  .stat-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-secondary); margin-bottom: 5px; }
  .stat-value { font-size: 1.85rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; line-height: 1; margin-bottom: 7px; }
  .stat-meta { display: flex; align-items: center; gap: 7px; font-size: 0.76rem; color: var(--text-secondary); }
  .up-badge { background: #DCFCE7; color: #16A34A; padding: 2px 8px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
  .stat-divider { margin: 13px 0; border-top: 1px solid #F3F4F6; }
  .stat-sub-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .sub-lbl { font-size: 0.7rem; color: var(--text-secondary); display: flex; align-items: center; gap: 4px; margin-bottom: 3px; }
  .sub-val { font-size: 0.93rem; font-weight: 700; color: var(--text-primary); }
  .complaint-list { list-style: none; display: flex; flex-direction: column; gap: 9px; }
  .complaint-item { display: flex; align-items: center; gap: 10px; }
  .complaint-thumb { width: 34px; height: 34px; border-radius: 9px; background: #F3F4F6; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .complaint-info { flex: 1; font-size: 0.82rem; font-weight: 500; }
  .section-hd { font-size: 0.93rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 7px; margin-bottom: 16px; }
  .section-hd i { color: var(--brand-mid); }
  .selling-list { display: flex; flex-direction: column; gap: 13px; }
  .sell-row-label { display: flex; justify-content: space-between; margin-bottom: 4px; }
  .sell-name { font-size: 0.82rem; font-weight: 500; color: var(--text-primary); }
  .sell-pct { font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); }
  .sell-track { height: 6px; background: #E5E7EB; border-radius: 99px; overflow: hidden; }
  .sell-fill { height: 100%; border-radius: 99px; background: var(--brand-progress); transition: width 0.6s ease; }
  .selling-list > div { display: flex; flex-direction: column; gap: 4px;
}
  .stock-low { color: var(--color-red); font-weight: 700; }
  .stock-ok  { color: var(--brand-mid); font-weight: 700; }

  /* Tables */
  .dash-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
  .dash-table th { padding: 10px 14px; text-align: left; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); border-bottom: 1px solid var(--border-light); white-space: nowrap; }
  .dash-table td { padding: 12px 14px; border-bottom: 1px solid #F3F4F6; vertical-align: middle; }
  .dash-table tr:last-child td { border-bottom: none; }
  .dash-table tbody tr { transition: background 0.12s; }
  .dash-table tbody tr:hover { background: #FAFAFA; }
  .dash-table tbody tr.selected { background: #FFF8F0; }
  .dash-table tbody tr.clickable { cursor: pointer; }
  .cell-id { font-size: 0.76rem; color: var(--text-muted); font-weight: 500; }
  .cell-bold { font-weight: 600; color: var(--text-primary); }
  .cell-muted { color: var(--text-secondary); }
  .cell-amount { font-weight: 700; color: var(--text-primary); }
  .table-scroll { overflow-x: auto; }

  /* Badges */
  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: var(--radius-badge); font-size: 0.7rem; font-weight: 700; white-space: nowrap; }
  .badge-paid        { background: #EFF6FF; color: #3B82F6; }
  .badge-resolved    { background: var(--color-green-bg); color: var(--color-green); }
  .badge-confirmed    { background: var(--color-green-bg); color: var(--color-green); }
  .badge-pending     { background: #FFF7ED; color: var(--color-orange); }
  .badge-shipped     { background: #fffb0034; color: #b8b16c; }
  .badge-available   { background: var(--color-green-bg); color: var(--color-green); }
  .badge-unavailable { background: var(--color-red-bg); color: var(--color-red); }
  .badge-admin       { background: #F3E8FF; color: #9333EA; }
  .badge-customer    { background: var(--color-blue-bg); color: var(--color-blue); }

  /* Page header */
  .page-header { display: flex; align-items: center; gap: 12px; padding: 20px 26px 0; flex-shrink: 0; }
  .page-header-title { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 10px; flex: 1; }
  .page-header-controls { display: flex; align-items: center; gap: 10px; }
  .add-btn { width: 28px; height: 28px; border-radius: 50%; background: var(--brand-mid); color: #fff; border: none; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; cursor: pointer; transition: background 0.15s, transform 0.15s; flex-shrink: 0; }
  .add-btn:hover { background: var(--brand-dark); transform: scale(1.07); }
  .header-icon-btn { width: 34px; height: 34px; border: 1.5px solid var(--border-light); border-radius: 9px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); font-size: 0.95rem; }
  .header-icon-btn:hover { background: #F3F4F6; }

  .categories-btn { appearance:none; -webkit-appearance:none; -moz-appearance:none; position:relative; display:flex; align-items:center; padding:7px 36px 7px 14px; border:1.5px solid var(--border-light); border-radius:10px; background-color:#fff; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='gray'%3E%3Cpath d='M3 5l4 4 4-4'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; background-size:12px; font-family:var(--font-body); font-size:0.82rem; font-weight:500; color:var(--text-secondary); cursor:pointer; transition:background-color 0.18s ease, border-color 0.18s ease; white-space:nowrap; line-height:1; }
  .categories-btn:focus { outline:none; border-color:var(--brand-mid); box-shadow:0 0 0 3px rgba(201,135,58,0.15); }

  .search-box { display: flex; align-items: center; gap: 8px; padding: 7px 12px; border: 1.5px solid var(--border-light); border-radius: 9px; background: #fff; transition: border-color 0.14s; }
  .search-box:focus-within { border-color: var(--brand-mid); }
  .search-box i { color: var(--text-muted); font-size: 0.85rem; }
  .search-box input { border: none; outline: none; font-family: var(--font-body); font-size: 0.83rem; color: var(--text-primary); width: 160px; background: transparent; }
  .search-box input::placeholder { color: var(--text-muted); }

  /* Split layout (inventory / users) */
  .page-area { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
  .split-layout { display: flex; flex: 1; overflow: hidden; padding: 16px 26px 26px; gap: 20px; }
  .split-table-wrap { flex: 1; background: var(--bg-card); border-radius: var(--radius-card); box-shadow: var(--shadow-card); overflow: hidden; display: flex; flex-direction: column; }
  .split-table-wrap .table-scroll { flex: 1; overflow: auto; }

  /* Slide panel */
  .kp-slide-panel { width: var(--panel-width); background: var(--bg-card); border-left: 1px solid var(--border-light); box-shadow: var(--shadow-panel); display: flex; flex-direction: column; position: fixed; top: 0; right: 0; height: 100vh; z-index: 300; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
  .kp-slide-panel.open { transform: translateX(0); }
  .panel-scroll { flex: 1; overflow-y: auto; padding: 22px; }
  .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
  .panel-title { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }
  .panel-close-btn { width: 28px; height: 28px; border-radius: 7px; border: 1.5px solid var(--border-light); background: #F9FAFB; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); font-size: 1rem; }
  .panel-close-btn:hover { background: #F3F4F6; }
  .panel-image-block { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; }
  .panel-img-placeholder { width: 72px; height: 72px; border-radius: 12px; background: #F3F4F6; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--text-muted); flex-shrink: 0; overflow: hidden; }
  .panel-img-actions { display: flex; flex-direction: column; gap: 7px; }
  .panel-footer { padding: 16px 22px; border-top: 1px solid var(--border-light); display: flex; gap: 10px; flex-shrink: 0; }
  .panel-footer.add-mode { border-top: 2px solid var(--brand-mid); }

  /* Forms */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; }
  .form-control { width: 100%; padding: 9px 12px; border: 1.5px solid var(--border-light); border-radius: var(--radius-input); font-family: var(--font-body); font-size: 0.83rem; color: var(--text-primary); background: #fff; outline: none; transition: border-color 0.14s; }
  .form-control:focus { border-color: var(--brand-mid); }
  .form-control::placeholder { color: var(--text-muted); }
  textarea.form-control { resize: vertical; min-height: 80px; }
  .form-row { display: grid; gap: 12px; }
  .form-row.cols-2 { grid-template-columns: 1fr 1fr; }
  .input-addon-wrap { display: flex; align-items: center; border: 1.5px solid var(--border-light); border-radius: var(--radius-input); overflow: hidden; transition: border-color 0.14s; }
  .input-addon-wrap:focus-within { border-color: var(--brand-mid); }
  .input-addon-wrap .form-control { border: none; border-radius: 0; }
  .input-addon { padding: 0 10px; background: #F9FAFB; color: var(--text-secondary); font-size: 0.83rem; font-weight: 600; border-left: 1.5px solid var(--border-light); height: 100%; display: flex; align-items: center; }
  .input-addon.left { border-left: none; border-right: 1.5px solid var(--border-light); }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 9px 20px; border-radius: var(--radius-btn); font-family: var(--font-body); font-size: 0.83rem; font-weight: 600; border: none; cursor: pointer; transition: opacity 0.15s, transform 0.12s, background 0.15s; white-space: nowrap; }
  .btn:hover { opacity: 0.88; }
  .btn:active { transform: scale(0.97); }
  .btn-cancel  { background: #E5E7EB; color: var(--text-primary); flex: 1; }
  .btn-delete  { background: var(--color-red-bg); color: var(--color-red); flex: 1; }
  .btn-delete:hover { opacity: 1; background: #FECACA; }
  .btn-update  { background: var(--color-green-bg); color: var(--color-green); flex: 1; }
  .btn-update:hover { opacity: 1; background: #BBF7D0; }
  .btn-primary { background: var(--brand-gradient); color: #fff; flex: 1; }
  .btn-primary:hover { opacity: 0.9; }
  .btn-sm { padding: 6px 14px; font-size: 0.76rem; border-radius: 8px; flex: unset; }
  .btn-outline { background: #F9FAFB; border: 1.5px solid var(--border-light); color: var(--text-primary); }

  /* Full-page table layout */
  .full-table-wrap { flex: 1; margin: 16px 26px 26px; background: var(--bg-card); border-radius: var(--radius-card); box-shadow: var(--shadow-card); overflow: hidden; display: flex; flex-direction: column; }
  .full-table-wrap .table-scroll { flex: 1; overflow: auto; }

  /* Complaint detail view */
  .complaint-detail-wrap { flex: 1; margin: 0 26px 26px; background: var(--bg-card); border-radius: var(--radius-card); box-shadow: var(--shadow-card); overflow: hidden; display: flex; flex-direction: column; }
  .complaint-detail-topbar { padding: 18px 24px 0; display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
  .back-btn { width: 32px; height: 32px; border-radius: 9px; border: 1.5px solid var(--border-light); background: #F9FAFB; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); font-size: 1rem; transition: background 0.14s, color 0.14s; }
  .back-btn:hover { background: #F3F4F6; color: var(--text-primary); }
  .complaint-sender { padding: 16px 24px 14px; display: flex; align-items: center; gap: 14px; border-bottom: 1px solid var(--border-light); flex-shrink: 0; }
  .complaint-sender-avatar { width: 42px; height: 42px; border-radius: 50%; background: #E5E7EB; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 700; color: var(--text-secondary); flex-shrink: 0; }
  .complaint-sender-name { font-size: 0.93rem; font-weight: 700; color: var(--text-primary); }
  .complaint-sender-email { font-size: 0.78rem; color: var(--text-secondary); }
  .complaint-message-body { flex: 1; padding: 24px 24px 0; overflow-y: auto; }
  .complaint-message-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border-light); }
  .complaint-message-text { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.7; }
  .complaint-detail-footer { padding: 18px 24px; border-top: 1px solid var(--border-light); display: flex; gap: 12px; justify-content: flex-end; flex-shrink: 0; }
  .btn-resolve { background: #E5E7EB; color: var(--text-primary); min-width: 160px; }
  .btn-resolve:hover { background: #D1D5DB; opacity: 1; }
  .btn-resolve.resolved { background: var(--color-green-bg); color: var(--color-green); }
  .btn-reply { background: #E5E7EB; color: var(--text-primary); min-width: 100px; }
  .btn-reply:hover { background: #D1D5DB; opacity: 1; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 99px; }
`;

export default STYLES;

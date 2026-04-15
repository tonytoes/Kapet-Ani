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
  /* BUTTON ENHANCED */
  .kp-sidebar-nav a { display: flex; align-items: center; gap: 11px; padding: 9px 13px; border-radius: 9px; color: var(--text-sidebar); text-decoration: none; font-size: 0.855rem; font-weight: 500; cursor: pointer; transition: all 0.18s ease; position: relative; overflow: hidden; }
  .kp-sidebar-nav a i { font-size: 0.95rem; width: 17px; text-align: center; opacity: 0.75; transition: transform 0.2s ease, opacity 0.2s ease; }
  /* hover = lift + glow */
  .kp-sidebar-nav a:hover { background: rgba(255,255,255,0.16); color: #fff; transform: translateX(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .kp-sidebar-nav a:hover i { transform: scale(1.15); opacity: 1; }
  /* active = stronger + inset glow */
  .kp-sidebar-nav a.active { background: rgba(255,255,255,0.22); color: #fff; font-weight: 600; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15), 0 4px 14px rgba(0,0,0,0.18); }
  /* subtle shine effect */
  .kp-sidebar-nav a::after { content: ""; position: absolute; top: 0; left: -75%; width: 50%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent); transform: skewX(-20deg); transition: 0.4s; }
  .kp-sidebar-nav a:hover::after { left: 130%; }
  /* click feedback */
  .kp-sidebar-nav a:active { transform: scale(0.96); box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
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
  .kp-settings-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(17, 24, 39, 0.42);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
  .kp-settings-modal {
    width: min(620px, 100%);
    max-height: 90vh;
    overflow: hidden;
    border-radius: 16px;
    background: #fff;
    border: 1px solid var(--border-light);
    box-shadow: 0 28px 64px rgba(2, 6, 23, 0.22);
    display: flex;
    flex-direction: column;
  }
  .kp-settings-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    padding: 16px 18px 14px;
    border-bottom: 1px solid var(--border-light);
  }
  .kp-settings-title { font-size: 1rem; font-weight: 800; color: var(--text-primary); }
  .kp-settings-subtitle { margin-top: 4px; font-size: 0.78rem; color: var(--text-secondary); }
  .kp-settings-close {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    border: 1.5px solid var(--border-light);
    background: #F9FAFB;
    color: var(--text-secondary);
    cursor: pointer;
  }
  .kp-settings-close:hover { background: #F3F4F6; }
  .kp-settings-tabs {
    padding: 12px 16px 0;
    display: flex;
    gap: 8px;
    border-bottom: 1px solid var(--border-light);
  }
  .kp-settings-tab {
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 700;
    padding: 10px 2px;
    cursor: pointer;
  }
  .kp-settings-tab.active { color: var(--brand-dark); border-bottom-color: var(--brand-mid); }
  .kp-settings-body {
    padding: 16px;
    overflow: auto;
  }
  .kp-settings-form { display: grid; gap: 8px; }
  .kp-settings-password-wrap { position: relative; }
  .kp-settings-password-input { padding-right: 40px; }
  .kp-settings-password-toggle {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: #8B7A69;
    padding: 0;
    line-height: 0;
    cursor: pointer;
    z-index: 2;
  }
  .kp-settings-password-toggle:hover { color: var(--brand-mid); }
  .kp-settings-password-toggle svg { display: block; }
  .kp-settings-note { font-size: 0.76rem; color: var(--text-muted); margin-top: 2px; margin-bottom: 6px; }
  .kp-settings-alert {
    border-radius: 10px;
    border: 1px solid;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 9px 10px;
    margin-bottom: 12px;
  }
  .kp-settings-alert.success { background: #ECFDF3; color: #047857; border-color: #A7F3D0; }
  .kp-settings-alert.error { background: #FEF2F2; color: #B91C1C; border-color: #FECACA; }

  /* Cards */
  .card { background: var(--bg-card); border-radius: var(--radius-card); box-shadow: var(--shadow-card); }
  .card-padded { padding: 22px 24px; }
  .page-body { padding: 22px 26px 40px; flex: 1; }

  /* Dashboard (current design) */
  .db-wrap { padding: 22px 26px 40px; display: flex; flex-direction: column; gap: 20px; flex: 1; }
  .db-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  @media (max-width: 1100px) { .db-kpi-row { grid-template-columns: repeat(2, 1fr); } }
  .db-mid-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; align-items: start; }
  @media (max-width: 1000px) { .db-mid-row { grid-template-columns: 1fr; } }
  .db-bot-row { display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 16px; align-items: start; }
  @media (max-width: 1100px) { .db-bot-row { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 760px)  { .db-bot-row { grid-template-columns: 1fr; } }
  .db-table-row { display: grid; grid-template-columns: 1.6fr 1fr; gap: 16px; }
  @media (max-width: 1100px) { .db-table-row { grid-template-columns: 1fr; } }
  .db-card { background: var(--bg-card); border-radius: 16px; box-shadow: var(--shadow-card); padding: 22px 24px; }
  .db-nav-card { cursor: pointer; transition: transform 0.18s, box-shadow 0.18s; }
  .db-nav-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.10); }
  .db-nav-card:focus { outline: none; box-shadow: 0 0 0 2px rgba(201,135,58,0.16), 0 8px 28px rgba(0,0,0,0.10); }
  .db-card-title { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
  .db-card-title i { color: var(--brand-mid); font-size: 0.95rem; }
  .db-card-title-sub { font-size: 0.72rem; font-weight: 400; color: var(--text-muted); margin-left: auto; }

  .db-kpi { background: var(--bg-card); border-radius: 16px; box-shadow: var(--shadow-card); padding: 20px 22px; display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden; transition: transform 0.18s, box-shadow 0.18s; }
  .db-kpi:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.10); }
  .db-kpi-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 16px 16px 0 0; }
  .db-kpi-accent-skeleton { opacity: 0.5; background: linear-gradient(90deg, #E5E7EB, #F3F4F6, #E5E7EB); }
  .db-kpi-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; margin-bottom: 10px; }
  .db-kpi-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted); }
  .db-kpi-value { font-size: 1.7rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; line-height: 1.1; margin: 2px 0; }
  .db-kpi-sub { font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
  .db-kpi-badge-up   { background: #DCFCE7; color: #16A34A; padding: 2px 7px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; }
  .db-kpi-badge-down { background: #FEE2E2; color: #DC2626; padding: 2px 7px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; }
  .db-kpi-badge-neu  { background: #F3F4F6; color: var(--text-secondary); padding: 2px 7px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; }

  .db-chart-wrap { position: relative; width: 100%; }
  .db-chart-tabs { display: flex; gap: 6px; margin-bottom: 14px; }
  .db-chart-tab { padding: 5px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border-light); background: transparent; color: var(--text-muted); transition: all 0.15s; font-family: var(--font-body); }
  .db-chart-tab.active { background: var(--brand-mid); color: #fff; border-color: var(--brand-mid); }
  .db-donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .db-donut-canvas { max-width: 180px; max-height: 180px; }
  .db-legend { width: 100%; display: flex; flex-direction: column; gap: 7px; margin-top: 4px; }
  .db-legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; }
  .db-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .db-legend-label { color: var(--text-secondary); flex: 1; }
  .db-legend-val { font-weight: 700; color: var(--text-primary); }
  .db-legend-display { font-size: 0.72rem; }

  .db-sell-item { margin-bottom: 14px; }
  .db-sell-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
  .db-sell-name { font-size: 0.82rem; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; }
  .db-sell-meta { font-size: 0.72rem; color: var(--text-muted); }
  .db-rank-badge { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: #F3F4F6; color: #9CA3AF; font-size: 0.65rem; font-weight: 800; margin-right: 6px; }
  .db-rank-badge.is-top { background: #FFF5E6; color: #C9873A; }
  .db-sell-track { height: 8px; background: #F3F4F6; border-radius: 99px; overflow: hidden; }
  .db-sell-fill { height: 100%; border-radius: 99px; background: var(--brand-progress); transition: width 1s cubic-bezier(0.4,0,0.2,1); position: relative; overflow: visible; box-shadow: 0 0 8px rgba(255, 120, 0, 0.25), 0 0 18px rgba(255, 90, 0, 0.15); animation: emberPulse 2.4s ease-in-out infinite; }
  .db-sell-fill::after { content: ""; position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; border-radius: 50%; animation: matchFlicker 1.6s infinite ease-in-out; }
  @keyframes emberPulse {
    0%   { box-shadow: 0 0 6px rgba(255, 110, 0, 0.18), 0 0 14px rgba(255, 80, 0, 0.12); filter: brightness(1); }
    50%  { box-shadow: 0 0 12px rgba(255, 140, 0, 0.4), 0 0 26px rgba(255, 90, 0, 0.2); filter: brightness(1.1); }
    100% { box-shadow: 0 0 6px rgba(255, 110, 0, 0.18), 0 0 14px rgba(255, 80, 0, 0.12); filter: brightness(1); }
  }
  @keyframes matchFlicker {
    0%   { opacity: 1; transform: translateY(-50%) scale(1); }
    50%  { opacity: 0.85; transform: translateY(-50%) scale(1.15); }
    100% { opacity: 1; transform: translateY(-50%) scale(1); }
  }

  .db-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .db-table th { padding: 9px 12px; text-align: left; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); border-bottom: 1px solid var(--border-light); white-space: nowrap; }
  .db-table td { padding: 11px 12px; border-bottom: 1px solid #F9FAFB; vertical-align: middle; }
  .db-table tr:last-child td { border-bottom: none; }
  .db-table tbody tr { transition: background 0.1s; }
  .db-table tbody tr:hover { background: #FAFAFA; }
  .db-table-card { padding: 0; overflow: hidden; }
  .db-table-head { padding: 18px 22px 14px; }
  .db-table-title { margin-bottom: 0; }
  .db-table-scroll { overflow-x: auto; }
  .db-cell-id { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
  .db-cell-muted { color: var(--text-secondary); }
  .db-cell-strong { font-weight: 700; }
  .db-empty-table { padding: 24px 0; }
  .db-empty-icon-success { color: #22C55E; }
  .db-warn-icon { color: #F97316 !important; }

  .db-pending-item { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid #F9FAFB; }
  .db-pending-item:last-child { border-bottom: none; }
  .db-pending-icon { width: 34px; height: 34px; border-radius: 9px; background: #FFF7ED; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
  .db-pending-name { flex: 1; font-size: 0.82rem; font-weight: 500; color: var(--text-primary); }
  .db-pending-more { margin-top: 12px; font-size: 0.75rem; color: var(--text-muted); text-align: center; }
  .db-glance-grid { margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--border-light); display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .db-glance-card { background: #FAFAFA; border-radius: 10px; padding: 10px 12px; border: 1px solid var(--border-light); }
  .db-glance-label { font-size: 0.7rem; color: var(--text-muted); margin-bottom: 4px; display: flex; align-items: center; gap: 4px; }
  .db-glance-value { font-weight: 800; font-size: 0.95rem; color: var(--text-primary); }

  .db-empty { text-align: center; padding: 30px 0; color: var(--text-muted); font-size: 0.82rem; }
  .db-empty i { font-size: 1.6rem; display: block; margin-bottom: 8px; }
  .db-qty-pill { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
  .db-qty-zero { background: #FEE2E2; color: #DC2626; }
  .db-qty-low  { background: #FFF7ED; color: #C2410C; }

  /* Dashboard skeleton */
  @keyframes dashboardShimmer { 0% { background-position: -220% 0; } 100% { background-position: 220% 0; } }
  .db-skel {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    background: linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 45%, #F3F4F6 100%);
    background-size: 220% 100%;
    animation: dashboardShimmer 1.6s linear infinite;
  }
  .db-skeleton-card { min-height: 280px; }
  .db-skeleton-bot-card { min-height: 320px; }
  .db-skel-kpi-icon { width: 40px; height: 40px; margin-bottom: 10px; border-radius: 11px; }
  .db-skel-kpi-label { width: 52%; height: 11px; margin-bottom: 8px; border-radius: 7px; }
  .db-skel-kpi-value { width: 70%; height: 30px; margin-bottom: 8px; border-radius: 8px; }
  .db-skel-kpi-sub { width: 62%; height: 11px; border-radius: 7px; }
  .db-skel-title { width: 52%; height: 14px; margin-bottom: 16px; border-radius: 7px; }
  .db-skel-tab-row { width: 38%; height: 28px; margin-bottom: 14px; border-radius: 20px; }
  .db-skel-chart { width: 100%; height: 190px; border-radius: 12px; }
  .db-skel-line { width: 100%; height: 12px; margin-bottom: 11px; border-radius: 7px; }
  .db-skel-grid { width: 100%; height: 82px; margin-top: 10px; border-radius: 10px; }
  .db-skel-donut { width: 180px; height: 180px; border-radius: 50%; margin: 0 auto 16px; }
  .db-skel-table-title { width: 42%; height: 16px; border-radius: 8px; }
  .db-skel-row { width: calc(100% - 24px); height: 14px; margin: 14px 12px; border-radius: 7px; }

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
  .badge-confirmed    { background: var(--color-green-bg); color: var(--color-green); }
  .badge-pending     { background: #FFF7ED; color: var(--color-orange); }
  .badge-available   { background: var(--color-green-bg); color: var(--color-green); }
  .badge-unavailable { background: var(--color-red-bg); color: var(--color-red); }
  .badge-user        { background: #FFF7ED; color: #F97316; }
  .badge-staff       { background: #FEF9C3; color: #A16207; }
  .badge-admin       { background: #DBEAFE; color: #2563EB; }
  .badge-superadmin  { background: #F3E8FF; color: #9333EA; }
  .badge-customer    { background: var(--color-blue-bg); color: var(--color-blue); }
  .badge-outofstock { background: var(--color-red-bg); color: var(--color-red); }
  .badge-lowstock { background: var(--color-red-bg); color: #ff4c4c; }
  .badge-cancelled { background: var(--color-red-bg); color: var(--color-red); }

  /* Page header */
  .page-header { display: flex; align-items: center; gap: 12px; padding: 20px 26px 0; flex-shrink: 0; }
  .page-header-title { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 10px; flex: 1; }
  .page-header-controls { display: flex; align-items: center; gap: 10px; }
  .add-btn { width: 28px; height: 28px; border-radius: 50%; background: var(--brand-mid); color: #fff; border: none; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; cursor: pointer; transition: background 0.15s, transform 0.15s; flex-shrink: 0; }
  .add-btn:hover { background: var(--brand-dark); transform: scale(1.07); }
  .header-icon-btn { width: 34px; height: 34px; border: 1.5px solid var(--border-light); border-radius: 9px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); font-size: 0.95rem; }
  .header-icon-btn:hover { background: #F3F4F6; }

  .categories-btn {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    position: relative;
    display: flex;
    align-items: center;
    min-width: 140px;
    padding: 8px 38px 8px 14px;
    border: 1.5px solid var(--border-light);
    border-radius: 11px;
    background-color: #fff;
    background-image:
      linear-gradient(180deg, rgba(255,255,255,0.97), rgba(248,250,252,0.97)),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'%3E%3Cpath d='M3.5 5.25L7 8.75L10.5 5.25' stroke='%236B7280' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat, no-repeat;
    background-position: center, right 12px center;
    background-size: auto, 14px;
    font-family: var(--font-body);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.18s ease;
    white-space: nowrap;
    line-height: 1;
    box-shadow: 0 1px 2px rgba(16,24,40,0.03);
  }
  .categories-btn:hover {
    border-color: #D8DDE5;
    box-shadow: 0 3px 10px rgba(16,24,40,0.06);
    transform: translateY(-1px);
  }
  .categories-btn:focus {
    outline: none;
    border-color: var(--brand-mid);
    box-shadow: 0 0 0 2px rgba(201,135,58,0.12), 0 2px 8px rgba(16,24,40,0.04);
  }
  .categories-btn option {
    color: var(--text-primary);
    background: #FFFFFF;
    font-weight: 500;
    padding: 8px 10px;
  }
  .categories-btn option:checked {
    background: #F3E8D8 linear-gradient(0deg, #F3E8D8 0%, #F3E8D8 100%);
    color: #8B5A2B;
  }

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
  .kp-admin-password-wrap { position: relative; }
  .kp-admin-password-input { padding-right: 40px; }
  .kp-admin-password-toggle {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: #8B7A69;
    padding: 0;
    line-height: 0;
    cursor: pointer;
    z-index: 2;
  }
  .kp-admin-password-toggle:hover { color: var(--brand-mid); }
  .kp-admin-password-toggle svg { display: block; }
  .kp-admin-phone-wrap { display: grid; grid-template-columns: 120px 1fr; gap: 10px; align-items: center; }
  .kp-admin-phone-country {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr);
    column-gap: 8px;
    align-items: center;
    height: 40px;
    border: 1.5px solid var(--border-light);
    border-radius: 12px;
    background: #F9FAFB;
    padding: 0 8px;
  }
  .kp-admin-phone-flag {
    width: 24px;
    height: 18px;
    object-fit: cover;
    border-radius: 2px;
    border: none;
    pointer-events: none;
  }
  .kp-admin-phone-cc {
    height: 40px;
    border: none;
    border-radius: 12px;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    color: var(--text-muted);
    font-weight: 800;
    display: block;
    cursor: pointer;
    padding: 0;
    font-size: 0.82rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    user-select: none;
  }
  .kp-admin-phone-input { font-variant-numeric: tabular-nums; letter-spacing: 0.08em; }
  select.form-control {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: 36px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'%3E%3Cpath d='M3.5 5.25L7 8.75L10.5 5.25' stroke='%236B7280' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 14px;
    border: none;
  }

  .kp-admin-phone-cc:focus {
  outline: none;
  box-shadow: none;
  border: none;
  }

  select.form-control:focus {
    box-shadow: 0 0 0 2px rgba(201,135,58,0.12);
    border: none;
  }
  select.form-control option {
    background: #FFFFFF;
    color: var(--text-primary);
    font-weight: 500;
    padding: 8px 10px;
  }
  select.form-control option:checked {
    background: #EADBC8 linear-gradient(0deg, #EADBC8 0%, #EADBC8 100%);
    color: #8B5A2B;
  }
  .kp-select { position: relative; width: 100%; }
  .kp-select-trigger {
    width: 100%;
    height: 40px;
    border: 1.5px solid var(--border-light);
    border-radius: 12px 12px 20px 20px;
    background: #fff;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 0.83rem;
    font-weight: 600;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.16s ease;
  }
  .kp-select-trigger:disabled {
    cursor: not-allowed;
    opacity: 0.72;
    background: #F9FAFB;
  }
  .kp-select.open .kp-select-trigger,
  .kp-select-trigger:focus {
    outline: none;
    border-color: var(--brand-mid);
    box-shadow: 0 0 0 2px rgba(201,135,58,0.12);
  }
  .kp-select-trigger i {
    font-size: 0.82rem;
    color: var(--text-muted);
    transition: transform 0.16s ease;
  }
  .kp-select.open .kp-select-trigger i { transform: rotate(180deg); }
  .kp-select-menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #E7EAF0;
    border-radius: 12px 12px 20px 20px;
    box-shadow: 0 10px 24px rgba(15,23,42,0.12);
    overflow: hidden;
    z-index: 600;
  }
  .kp-select-option {
    width: 100%;
    border: none;
    background: #fff;
    color: var(--text-primary);
    text-align: left;
    font-family: var(--font-body);
    font-size: 0.83rem;
    font-weight: 500;
    padding: 10px 12px;
    cursor: pointer;
    transition: background 0.12s ease, color 0.12s ease;
  }
  .kp-select-option:hover {
    background: #F8FAFC;
  }
  .kp-select-option.active {
    background: #EFE4D5;
    color: #8B5A2B;
    font-weight: 700;
  }
  .kp-select-option:disabled {
    color: var(--text-muted);
    cursor: not-allowed;
    background: #fff;
  }
  .header-select {
    width: auto;
    min-width: 160px;
  }
  .header-select-trigger {
    height: 34px;
    border-radius: 10px;
    padding: 0 10px 0 12px;
    font-size: 0.82rem;
    font-weight: 500;
  }
  .header-select-menu {
    border-radius: 0 0 18px 18px;
  }
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
  .btn-sm { padding: 6px 14px; font-size: 0.76rem; border-radius: 8px; flex: unset; }
  .btn-outline { background: #F9FAFB; border: 1.5px solid var(--border-light); color: var(--text-primary); }

  .btn-primary { background: linear-gradient(135deg, #D89A4C, #B8742C); color: #fff; flex: 1; border-radius: 8px; box-shadow: 0 3px 10px rgba(139,90,43,0.18); transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.3s ease; position: relative; overflow: hidden; }
  .btn-primary:hover { background: linear-gradient(135deg, #E2A65A, #C17E35); transform: translateY(-2px) scale(1.01); box-shadow: 0 10px 22px rgba(139,90,43,0.28); }
  .btn-primary:active { transform: translateY(0px) scale(0.98); box-shadow: 0 4px 10px rgba(0,0,0,0.18); }
  .btn-primary:disabled { background: linear-gradient(135deg, #E6C6A3, #D6B08A); cursor: not-allowed; box-shadow: none; transform: none; }
  .btn-primary::after { content: ""; position: absolute; top: 0; left: -75%; width: 50%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent); transform: skewX(-20deg); transition: 0.5s; }
  .btn-primary:hover::after { left: 130%; }


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

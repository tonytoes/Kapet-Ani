/* ═══════════════════════════════════════════════════════
   KAPET PAMANA — SLIDE PANEL UTILITY
   Fixed right-sidebar panel.
   Click row → panel slides in from right, page-area resizes.
   Click same row again → panel slides out.
   ═══════════════════════════════════════════════════════ */

class SlidePanel {
  /**
   * @param {object} opts
   * @param {string}   opts.panelId      — id of .slide-panel element
   * @param {string}   opts.tableId      — id of .dash-table element
   * @param {string}   [opts.pageAreaId] — id of .page-area wrapper (header + table resize together)
   * @param {Function} opts.onOpen       — called with (rowData, rowEl) when panel opens
   * @param {Function} [opts.onClose]    — called when panel closes
   */
  constructor(opts) {
    this.panel       = document.getElementById(opts.panelId);
    this.table       = document.getElementById(opts.tableId);
    this.pageArea    = opts.pageAreaId ? document.getElementById(opts.pageAreaId) : null;
    this.onOpen      = opts.onOpen  || (() => {});
    this.onClose     = opts.onClose || (() => {});
    this.selectedRow = null;
    this.isOpen      = false;

    this._bindRows();
    this._bindCloseBtn();
  }

  _bindRows() {
    if (!this.table) return;
    this.table.querySelectorAll("tbody tr").forEach((row) => {
      row.addEventListener("click", () => this._handleRowClick(row));
    });
  }

  _bindCloseBtn() {
    const closeBtn = this.panel?.querySelector(".panel-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", () => this.close());
  }

  _handleRowClick(row) {
    if (this.selectedRow === row && this.isOpen) {
      this.close();
      return;
    }
    this._selectRow(row);
    this.open(row);
  }

  _selectRow(row) {
    if (this.selectedRow) this.selectedRow.classList.remove("selected");
    this.selectedRow = row;
    row.classList.add("selected");
  }

  open(row) {
    if (!this.panel) return;
    const rowData = this._extractRowData(row);
    this.onOpen(rowData, row);
    this.panel.classList.add("open");
    if (this.pageArea) this.pageArea.classList.add("panel-open");
    this.isOpen = true;
  }

  close() {
    if (!this.panel) return;
    this.panel.classList.remove("open");
    if (this.pageArea) this.pageArea.classList.remove("panel-open");
    this.isOpen = false;
    if (this.selectedRow) {
      this.selectedRow.classList.remove("selected");
      this.selectedRow = null;
    }
    this.onClose();
  }

  _extractRowData(row) {
    const data = {};
    row.querySelectorAll("td[data-field]").forEach((td) => {
      data[td.dataset.field] = td.dataset.value ?? td.textContent.trim();
    });
    return data;
  }

  rebind() {
    this._bindRows();
  }
}

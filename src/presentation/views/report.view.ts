import { renderLayout } from './layout.view';
import { escapeHtml, formatNumber } from './view-helpers';

export interface ReportSummaryView {
  id: number;
  companyName: string;
  quarter: number;
  year: number;
  reportType: string;
  indicatorCount: number;
}

export interface IndicatorView {
  name: string;
  value: number | string;
  currency: string;
}

export interface ReportDetailView {
  id: number;
  companyName: string;
  industry: string;
  quarter: number;
  year: number;
  reportType: string;
  indicators: IndicatorView[];
}

export interface CompanyOptionView {
  id: number;
  name: string;
}

export function renderReportList(reports: ReportSummaryView[]): string {
  const rows = reports
    .map(report => `
      <tr>
        <td>${report.id}</td>
        <td>${escapeHtml(report.companyName)}</td>
        <td>Q${report.quarter} ${report.year}</td>
        <td>${escapeHtml(report.reportType)}</td>
        <td>${report.indicatorCount}</td>
        <td class="actions">
          <a class="btn" href="/reports/${report.id}">View</a>
          <a class="btn" href="/reports/${report.id}/edit">Edit</a>
          <form method="post" action="/reports/${report.id}/delete">
            <button class="btn btn-danger" type="submit">Delete</button>
          </form>
        </td>
      </tr>
    `)
    .join('');

  const content = `
    <div class="card">
      <div class="actions">
        <a class="btn btn-primary" href="/reports/new">Add report</a>
      </div>
    </div>
    <div class="card">
      <h1>Financial reports</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Company</th>
            <th>Period</th>
            <th>Type</th>
            <th>Indicators</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="6">No data available.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  return renderLayout('Financial reports', content);
}

export function renderReportDetail(report: ReportDetailView): string {
  const indicators = report.indicators
    .map(indicator => `
      <tr>
        <td>${escapeHtml(indicator.name)}</td>
        <td>${formatNumber(indicator.value)}</td>
        <td>${escapeHtml(indicator.currency)}</td>
      </tr>
    `)
    .join('');

  const content = `
    <div class="card">
      <h1>Report #${report.id}</h1>
      <p><strong>Company:</strong> ${escapeHtml(report.companyName)}</p>
      <p><strong>Industry:</strong> ${escapeHtml(report.industry)}</p>
      <p><strong>Period:</strong> Q${report.quarter} ${report.year}</p>
      <p><strong>Type:</strong> ${escapeHtml(report.reportType)}</p>
      <div class="actions">
        <a class="btn" href="/reports/${report.id}/edit">Edit</a>
        <form method="post" action="/reports/${report.id}/delete">
          <button class="btn btn-danger" type="submit">Delete</button>
        </form>
        <a class="btn" href="/reports">Back to list</a>
      </div>
    </div>
    <div class="card">
      <h2>Indicators</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
          ${indicators || '<tr><td colspan="3">No indicators yet.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  return renderLayout(`Report #${report.id}`, content);
}

export function renderReportForm(options: {
  title: string;
  action: string;
  submitLabel: string;
  companies: CompanyOptionView[];
  report?: {
    id: number;
    companyId: number;
    quarter: number;
    year: number;
    reportType: string;
    indicatorsText: string;
  };
}): string {
  const { title, action, submitLabel, companies, report } = options;
  const companyOptions = companies
    .map(company => {
      const selected = report?.companyId === company.id ? 'selected' : '';
      return `<option value="${company.id}" ${selected}>${escapeHtml(company.name)}</option>`;
    })
    .join('');

  const content = `
    <div class="card">
      <h1>${escapeHtml(title)}</h1>
      <form method="post" action="${escapeHtml(action)}">
        <label>Company</label>
        <select name="companyId" required>
          ${companyOptions}
        </select>

        <label>Quarter</label>
        <input type="number" name="quarter" min="1" max="4" required value="${report?.quarter ?? ''}" />

        <label>Year</label>
        <input type="number" name="year" min="2000" max="2100" required value="${report?.year ?? ''}" />

        <label>Report type</label>
        <input type="text" name="reportType" required value="${escapeHtml(report?.reportType ?? '')}" />

        <label>Indicators (one per line: name;value;currency)</label>
        <textarea name="indicators">${escapeHtml(report?.indicatorsText ?? '')}</textarea>
        <div class="hint">Example: revenue;380204.22;EUR</div>

        <div class="actions" style="margin-top: 16px;">
          <button class="btn btn-primary" type="submit">${escapeHtml(submitLabel)}</button>
          <a class="btn" href="/reports">Cancel</a>
        </div>
      </form>
    </div>
  `;

  return renderLayout(title, content);
}

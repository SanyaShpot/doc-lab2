import { renderLayout } from './layout.view';

export function renderHomePage(): string {
  const content = `
    <div class="card">
      <h1>Financial Reporting Analytics</h1>
      <p>The web app shows company reports, indicators, and basic CRUD operations.</p>
      <div class="actions">
        <a class="btn btn-primary" href="/reports">Open reports</a>
      </div>
    </div>
  `;

  return renderLayout('Financial Reporting', content);
}

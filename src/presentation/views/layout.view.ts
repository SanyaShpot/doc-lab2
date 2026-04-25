import { escapeHtml } from './view-helpers';

export function renderLayout(title: string, body: string): string {
  const safeTitle = escapeHtml(title);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: Arial, sans-serif; margin: 0; background: #f5f6f8; color: #1f2937; }
      header { background: #0f172a; color: #fff; padding: 16px 32px; }
      header a { color: #fff; text-decoration: none; font-weight: bold; }
      main { padding: 24px 32px 48px; }
      h1 { margin-top: 0; }
      table { width: 100%; border-collapse: collapse; background: #fff; }
      th, td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: left; }
      th { background: #f3f4f6; font-weight: 600; }
      tr:hover td { background: #f9fafb; }
      .actions { display: flex; gap: 8px; flex-wrap: wrap; }
      .btn { display: inline-block; padding: 8px 12px; border-radius: 6px; border: 1px solid #1d4ed8; color: #1d4ed8; background: #fff; text-decoration: none; cursor: pointer; font-size: 14px; }
      .btn-primary { background: #1d4ed8; color: #fff; }
      .btn-danger { border-color: #dc2626; color: #dc2626; }
      .card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.08); margin-bottom: 20px; }
      label { display: block; margin-top: 12px; font-weight: 600; }
      input, select, textarea { width: 100%; padding: 8px 10px; margin-top: 6px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }
      textarea { min-height: 120px; }
      .hint { color: #6b7280; font-size: 13px; margin-top: 4px; }
      footer { padding: 12px 32px; color: #6b7280; font-size: 13px; }
    </style>
  </head>
  <body>
    <header>
      <a href="/">Financial Reporting</a>
    </header>
    <main>
      ${body}
    </main>
    <footer>Lab 3 · MVC</footer>
  </body>
</html>`;
}

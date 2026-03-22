import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

const INDICATORS = ['revenue', 'expenses', 'profit', 'tax', 'operating_cost'];
const INDUSTRIES = ['Tech', 'Finance', 'Healthcare', 'Retail', 'Manufacturing'];
const REPORT_TYPES = ['quarterly', 'annual'];
const CURRENCIES = ['USD', 'EUR', 'UAH'];

function generateCsv(rowCount = 1000) {
  const headers = [
    'company_name', 'industry',
    'quarter', 'year', 'report_type',
    'indicator_name', 'value', 'currency'
  ];

  const rows: string[][] = [headers];

  for (let i = 0; i < rowCount; i++) {
    rows.push([
      faker.company.name().replace(/,/g, ''),
      faker.helpers.arrayElement(INDUSTRIES),
      String(faker.number.int({ min: 1, max: 4 })),
      String(faker.number.int({ min: 2018, max: 2024 })),
      faker.helpers.arrayElement(REPORT_TYPES),
      faker.helpers.arrayElement(INDICATORS),
      faker.finance.amount({ min: 10000, max: 9999999, dec: 2 }),
      faker.helpers.arrayElement(CURRENCIES),
    ]);
  }

  const csv = rows.map(r => r.join(',')).join('\n');
  const outputPath = path.resolve('data/financial_data.csv');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, csv, 'utf-8');
  console.log(`Generated ${rowCount} rows → ${outputPath}`);
}

generateCsv(1000);
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

export class CsvReader {
  async read(filePath: string): Promise<Record<string, string>[]> {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`CSV file not found at: ${absolutePath}`);
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
    }) as Record<string, string>[];

    console.log(`Read ${records.length} records from ${filePath}`);
    return records;
  }
}

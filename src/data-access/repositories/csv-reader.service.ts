import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { ICsvReader } from '../interfaces/csv-reader.interface';

@Injectable()
export class CsvReaderService implements ICsvReader {
  async readFromFile(filePath: string): Promise<Record<string, string>[]> {
    const absolutePath = path.resolve(filePath);
    const content = fs.readFileSync(absolutePath, 'utf-8');
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
    });
  }
}
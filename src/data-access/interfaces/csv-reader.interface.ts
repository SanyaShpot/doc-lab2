export interface ICsvReader {
  readFromFile(filePath: string): Promise<Record<string, string>[]>;
}

export const CSV_READER = 'ICsvReader';
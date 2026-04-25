export interface IImportController {
  importData(filePath: string): Promise<{ message: string }>;
}
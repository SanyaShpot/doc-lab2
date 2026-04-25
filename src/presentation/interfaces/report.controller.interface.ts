export interface IReportController {
  getAll(): Promise<any[]>;
  getByCompany(companyId: number): Promise<any[]>;
}
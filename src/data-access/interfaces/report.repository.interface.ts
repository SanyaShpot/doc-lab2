import { FinancialReport } from '../entities/financial-report.entity';

export interface IReportRepository {
  save(report: Partial<FinancialReport>): Promise<FinancialReport>;
  findAll(): Promise<FinancialReport[]>;
  findByCompanyId(companyId: number): Promise<FinancialReport[]>;
  findById(id: number): Promise<FinancialReport | null>;
  delete(id: number): Promise<void>;
}

export const REPORT_REPOSITORY = 'IReportRepository';

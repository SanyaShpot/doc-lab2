import { FinancialReport } from '../entities/financial-report.entity';

export interface IReportRepository {
  save(report: Partial<FinancialReport>): Promise<FinancialReport>;
  findAll(): Promise<FinancialReport[]>;
  findByCompanyId(companyId: number): Promise<FinancialReport[]>;
}

export const REPORT_REPOSITORY = 'IReportRepository';
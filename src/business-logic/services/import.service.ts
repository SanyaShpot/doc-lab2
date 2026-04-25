import { Injectable, Inject } from '@nestjs/common';
import type { ICompanyRepository } from '../../data-access/interfaces/company.repository.interface';
import { COMPANY_REPOSITORY } from '../../data-access/interfaces/company.repository.interface';

import type { IReportRepository } from '../../data-access/interfaces/report.repository.interface';
import { REPORT_REPOSITORY } from '../../data-access/interfaces/report.repository.interface';

import type { ICsvReader } from '../../data-access/interfaces/csv-reader.interface';
import { CSV_READER } from '../../data-access/interfaces/csv-reader.interface';
import { Company } from '../../data-access/entities/company.entity';
import { FinancialReport } from '../../data-access/entities/financial-report.entity';
import { FinancialIndicator } from '../../data-access/entities/financial-indicator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class ImportService {
  constructor(
    @Inject(COMPANY_REPOSITORY) private companyRepo: ICompanyRepository,
    @Inject(REPORT_REPOSITORY) private reportRepo: IReportRepository,
    @Inject(CSV_READER) private csvReader: ICsvReader,
    @InjectRepository(FinancialIndicator)
    private indicatorRepo: Repository<FinancialIndicator>,
  ) {}

  async importFromCsv(filePath: string): Promise<void> {
    const rows = await this.csvReader.readFromFile(filePath);

    const companyCache = new Map<string, Company>();
    const reportCache = new Map<string, FinancialReport>();

    for (const row of rows) {
      const companyKey = row.company_name;
      let company = companyCache.get(companyKey);
      if (!company) {
        company = await this.companyRepo.save({
          name: row.company_name,
          industry: row.industry,
        });
        companyCache.set(companyKey, company);
      }

      const reportKey = `${companyKey}-${row.quarter}-${row.year}-${row.report_type}`;
      let report = reportCache.get(reportKey);
      if (!report) {
        report = await this.reportRepo.save({
          quarter: parseInt(row.quarter),
          year: parseInt(row.year),
          reportType: row.report_type,
          company,
        });
        reportCache.set(reportKey, report);
      }

      await this.indicatorRepo.save({
        name: row.indicator_name,
        value: parseFloat(row.value),
        currency: row.currency,
        report,
      });
    }

    console.log(`Imported ${rows.length} records`);
  }

  async importIfEmpty(filePath: string): Promise<boolean> {
    const existing = await this.indicatorRepo.count();
    if (existing > 0) {
      return false;
    }

    await this.importFromCsv(filePath);
    return true;
  }
}

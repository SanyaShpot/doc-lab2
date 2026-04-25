import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { FinancialReport } from './entities/financial-report.entity';
import { FinancialIndicator } from './entities/financial-indicator.entity';
import { CompanyRepository } from './repositories/company.repository';
import { ReportRepository } from './repositories/report.repository';
import { CsvReaderService } from './repositories/csv-reader.service';
import { COMPANY_REPOSITORY } from './interfaces/company.repository.interface';
import { REPORT_REPOSITORY } from './interfaces/report.repository.interface';
import { CSV_READER } from './interfaces/csv-reader.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Company, FinancialReport, FinancialIndicator])],
  providers: [
    { provide: COMPANY_REPOSITORY, useClass: CompanyRepository },
    { provide: REPORT_REPOSITORY, useClass: ReportRepository },
    { provide: CSV_READER, useClass: CsvReaderService },
  ],
  exports: [COMPANY_REPOSITORY, REPORT_REPOSITORY, CSV_READER,
            TypeOrmModule],
})
export class DataAccessModule {}
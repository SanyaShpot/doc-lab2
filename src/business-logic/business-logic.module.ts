import { Module } from '@nestjs/common';
import { DataAccessModule } from '../data-access/data-access.module';
import { ImportService } from './services/import.service';
import { FinancialIndicator } from '../data-access/entities/financial-indicator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './services/report.service';
import { CompanyService } from './services/company.service';

@Module({
  imports: [DataAccessModule, TypeOrmModule.forFeature([FinancialIndicator])],
  providers: [ImportService, ReportService, CompanyService],
  exports: [ImportService, ReportService, CompanyService],
})
export class BusinessLogicModule {}

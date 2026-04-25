import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IReportRepository } from '../../data-access/interfaces/report.repository.interface';
import { REPORT_REPOSITORY } from '../../data-access/interfaces/report.repository.interface';
import { FinancialReport } from '../../data-access/entities/financial-report.entity';
import { FinancialIndicator } from '../../data-access/entities/financial-indicator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyService } from './company.service';
import { Company } from '../../data-access/entities/company.entity';

export interface ReportFormInput {
  companyId: string;
  quarter: string;
  year: string;
  reportType: string;
  indicators?: string;
}

interface IndicatorInput {
  name: string;
  value: number;
  currency: string;
}

@Injectable()
export class ReportService {
  constructor(
    @Inject(REPORT_REPOSITORY) private readonly reportRepo: IReportRepository,
    private readonly companyService: CompanyService,
    @InjectRepository(FinancialIndicator)
    private readonly indicatorRepo: Repository<FinancialIndicator>,
  ) {}

  async getAll(): Promise<FinancialReport[]> {
    return this.reportRepo.findAll();
  }

  async getById(reportId: number): Promise<FinancialReport> {
    const report = await this.reportRepo.findById(reportId);
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found`);
    }
    return report;
  }

  async createFromForm(input: ReportFormInput): Promise<FinancialReport> {
    const parsed = await this.parseForm(input);
    const report = await this.reportRepo.save({
      quarter: parsed.quarter,
      year: parsed.year,
      reportType: parsed.reportType,
      company: parsed.company,
    });

    if (parsed.indicators.length > 0) {
      await this.indicatorRepo.save(
        parsed.indicators.map(indicator => ({
          ...indicator,
          report,
        })),
      );
    }

    return this.getById(report.id);
  }

  async updateFromForm(reportId: number, input: ReportFormInput): Promise<FinancialReport> {
    const report = await this.getById(reportId);
    const parsed = await this.parseForm(input);

    report.quarter = parsed.quarter;
    report.year = parsed.year;
    report.reportType = parsed.reportType;
    report.company = parsed.company;

    await this.reportRepo.save(report);
    await this.replaceIndicators(report.id, parsed.indicators);

    return this.getById(report.id);
  }

  async delete(reportId: number): Promise<void> {
    await this.getById(reportId);
    await this.replaceIndicators(reportId, []);
    await this.reportRepo.delete(reportId);
  }

  private async parseForm(input: ReportFormInput): Promise<{
    company: Company;
    quarter: number;
    year: number;
    reportType: string;
    indicators: IndicatorInput[];
  }> {
    const companyId = this.parsePositiveInt(input.companyId, 'companyId');
    const quarter = this.parseRangeInt(input.quarter, 1, 4, 'quarter');
    const year = this.parsePositiveInt(input.year, 'year');
    const reportType = this.parseRequiredString(input.reportType, 'reportType');
    const indicators = this.parseIndicators(input.indicators ?? '');

    const company = await this.companyService.getById(companyId);

    return {
      company,
      quarter,
      year,
      reportType,
      indicators,
    };
  }

  private async replaceIndicators(reportId: number, indicators: IndicatorInput[]): Promise<void> {
    await this.indicatorRepo.delete({ report: { id: reportId } });

    if (indicators.length === 0) {
      return;
    }

    await this.indicatorRepo.save(
      indicators.map(indicator => ({
        ...indicator,
        report: { id: reportId },
      })),
    );
  }

  private parseRequiredString(value: string, field: string): string {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new BadRequestException(`${field} is required`);
    }
    return trimmed;
  }

  private parsePositiveInt(value: string, field: string): number {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException(`${field} must be a positive integer`);
    }
    return parsed;
  }

  private parseRangeInt(value: string, min: number, max: number, field: string): number {
    const parsed = this.parsePositiveInt(value, field);
    if (parsed < min || parsed > max) {
      throw new BadRequestException(`${field} must be between ${min} and ${max}`);
    }
    return parsed;
  }

  private parseIndicators(raw: string): IndicatorInput[] {
    const lines = raw
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return [];
    }

    return lines.map((line, index) => {
      const parts = line.split(';').map(part => part.trim());
      if (parts.length < 3) {
        throw new BadRequestException(`Indicator line ${index + 1} must contain 3 values`);
      }

      const value = Number(parts[1]);
      if (!Number.isFinite(value)) {
        throw new BadRequestException(`Indicator line ${index + 1} has invalid value`);
      }

      return {
        name: this.parseRequiredString(parts[0], `indicator name at line ${index + 1}`),
        value,
        currency: this.parseRequiredString(parts[2], `indicator currency at line ${index + 1}`),
      };
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialReport } from '../entities/financial-report.entity';
import { IReportRepository } from '../interfaces/report.repository.interface';

@Injectable()
export class ReportRepository implements IReportRepository {
  constructor(
    @InjectRepository(FinancialReport)
    private readonly repo: Repository<FinancialReport>,
  ) {}

  async save(report: Partial<FinancialReport>): Promise<FinancialReport> {
    return this.repo.save(report);
  }

  async findAll(): Promise<FinancialReport[]> {
    return this.repo.find({ relations: ['company', 'indicators'] });
  }

  async findByCompanyId(companyId: number): Promise<FinancialReport[]> {
    return this.repo.find({
      where: { company: { id: companyId } },
      relations: ['indicators'],
    });
  }

  async findById(id: number): Promise<FinancialReport | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['company', 'indicators'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}

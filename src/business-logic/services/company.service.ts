import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICompanyRepository } from '../../data-access/interfaces/company.repository.interface';
import { COMPANY_REPOSITORY } from '../../data-access/interfaces/company.repository.interface';
import { Company } from '../../data-access/entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(COMPANY_REPOSITORY) private readonly companyRepo: ICompanyRepository,
  ) {}

  async getAll(): Promise<Company[]> {
    return this.companyRepo.findAll();
  }

  async getById(companyId: number): Promise<Company> {
    const company = await this.companyRepo.findById(companyId);
    if (!company) {
      throw new NotFoundException(`Company ${companyId} not found`);
    }
    return company;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { ICompanyRepository } from '../interfaces/company.repository.interface';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(
    @InjectRepository(Company)
    private readonly repo: Repository<Company>,
  ) {}

  async save(company: Partial<Company>): Promise<Company> {
    return this.repo.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.repo.find({ relations: ['reports'] });
  }

  async findById(id: number): Promise<Company | null> {
    return this.repo.findOne({ where: { id }, relations: ['reports'] });
  }
}
import { Company } from '../entities/company.entity';

export interface ICompanyRepository {
  save(company: Partial<Company>): Promise<Company>;
  findAll(): Promise<Company[]>;
  findById(id: number): Promise<Company | null>;
}

export const COMPANY_REPOSITORY = 'ICompanyRepository';
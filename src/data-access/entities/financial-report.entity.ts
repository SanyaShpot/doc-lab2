import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Company } from './company.entity';
import { FinancialIndicator } from './financial-indicator.entity';

@Entity()
export class FinancialReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quarter: number;

  @Column()
  year: number;

  @Column()
  reportType: string;

  @ManyToOne(() => Company, company => company.reports)
  company: Company;

  @OneToMany(() => FinancialIndicator, indicator => indicator.report)
  indicators: FinancialIndicator[];
}
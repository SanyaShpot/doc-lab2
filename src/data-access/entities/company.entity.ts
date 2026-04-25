import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FinancialReport } from './financial-report.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  industry: string;

  @OneToMany(() => FinancialReport, report => report.company)
  reports: FinancialReport[];
}
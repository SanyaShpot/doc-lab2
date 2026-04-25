import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FinancialReport } from './financial-report.entity';

@Entity()
export class FinancialIndicator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 15, scale: 2 })
  value: number;

  @Column()
  currency: string;

  @ManyToOne(() => FinancialReport, report => report.indicators, { onDelete: 'CASCADE' })
  report: FinancialReport;
}

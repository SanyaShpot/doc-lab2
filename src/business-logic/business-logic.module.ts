import { Module } from '@nestjs/common';
import { DataAccessModule } from '../data-access/data-access.module';
import { ImportService } from './services/import.service';
import { FinancialIndicator } from '../data-access/entities/financial-indicator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [DataAccessModule, TypeOrmModule.forFeature([FinancialIndicator])],
  providers: [ImportService],
  exports: [ImportService],
})
export class BusinessLogicModule {}
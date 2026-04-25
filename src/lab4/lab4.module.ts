import { Module } from '@nestjs/common';
import { DataProcessor } from './data-processor';

@Module({
  providers: [DataProcessor],
  exports: [DataProcessor],
})
export class Lab4Module {}

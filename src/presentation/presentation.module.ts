import { Module } from '@nestjs/common';
import { BusinessLogicModule } from '../business-logic/business-logic.module';
import { ReportsController } from './controllers/reports.controller';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';

@Module({
  imports: [BusinessLogicModule],
  controllers: [AppController, ReportsController],
  providers: [AppService],
})
export class PresentationModule {}

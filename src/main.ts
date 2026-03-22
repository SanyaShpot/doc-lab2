import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ImportService } from './business-logic/services/import.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const importService = app.get(ImportService);
  await importService.importFromCsv('data/financial_data.csv');
  
  await app.close();
}
bootstrap();
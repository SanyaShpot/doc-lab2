import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ImportService } from './business-logic/services/import.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const importService = app.get(ImportService);
  await importService.importIfEmpty('data/financial_data.csv');

  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ImportService } from './business-logic/services/import.service';
import { runLab4 } from './lab4/lab4.runner';

async function bootstrap() {
  // Check if Lab 4 should be run
  if (process.env.RUN_LAB4 === 'true') {
    await runLab4();
    process.exit(0);
  }

  const app = await NestFactory.create(AppModule);

  const importService = app.get(ImportService);
  await importService.importIfEmpty('data/financial_data.csv');

  await app.listen(3000);
}
bootstrap();

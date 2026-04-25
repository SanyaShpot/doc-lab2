import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataAccessModule } from './data-access/data-access.module';
import { BusinessLogicModule } from './business-logic/business-logic.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'financial_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    DataAccessModule,
    BusinessLogicModule,
    PresentationModule,
  ],
})
export class AppModule {}

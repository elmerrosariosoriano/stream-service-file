import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { DatabaseService } from './database/database.service';
import { ExportService } from './export/export.service';
import { CsvExportStrategy } from './export/strategies/csv-export.strategy';
import { ExcelExportStrategy } from './export/strategies/excel-export.strategy';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    DatabaseService,
    UserService,
    ExportService,
    CsvExportStrategy,
    ExcelExportStrategy,
  ],
})
export class AppModule {}
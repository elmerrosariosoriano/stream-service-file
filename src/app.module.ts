import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { PinotService } from './pinot/pinot.service';
import { KafkaService } from './kafka/kafka.service';
import { ExportService } from './export/export.service';
import { CsvExportStrategy } from './export/strategies/csv-export.strategy';
import { ExcelExportStrategy } from './export/strategies/excel-export.strategy';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    KafkaService,
    UserService,
    PinotService,
    ExportService,
    CsvExportStrategy,
    ExcelExportStrategy,
  ],
})
export class AppModule {}
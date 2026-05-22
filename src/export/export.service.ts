import { BadRequestException,  Injectable,} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CsvExportStrategy } from './strategies/csv-export.strategy';
import { ExcelExportStrategy } from './strategies/excel-export.strategy';
import type { Response } from 'express';

@Injectable()
export class ExportService {
  private readonly strategies: Record<string, any>;

  constructor(
    private readonly userService: UserService,
    private readonly csvStrategy: CsvExportStrategy,
    private readonly excelStrategy: ExcelExportStrategy
  ) {
    this.strategies = {csv: this.csvStrategy, excel: this.excelStrategy,};
  }

  async exportUsers(type: string,  res: Response,): Promise<void> {

    const strategy = this.strategies[type];
    if (!strategy) {
      throw new BadRequestException('Invalid export type',);
    }

    const stream = await this.userService.streamUsers();
    await strategy.export(stream, res);
  }
}
import {  Injectable,  Logger,} from '@nestjs/common';
import { Readable } from 'stream';
import ExcelJS from 'exceljs';
import { ExportStrategy } from '../interfaces/export-strategy.interface';
import { logMemoryUsage } from '../../utils/memory.util';
import { HEADERS_EXCEL } from '../../utils/constants';
import type { Response } from 'express';

@Injectable()
export class ExcelExportStrategy implements ExportStrategy {
  private readonly logger = new Logger(ExcelExportStrategy.name);

  async export(stream: Readable,  res: Response,): Promise<void> {

    res.setHeader('Content-Type',  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',);
    res.setHeader('Content-Disposition',  'attachment; filename="users.xlsx"',);

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res,    useStyles: false,    useSharedStrings: false });
    const worksheet = workbook.addWorksheet('Users');
    worksheet.columns = HEADERS_EXCEL

    let processed = 0;
    return new Promise((resolve, reject) => {
        stream.on('data', async (row) => {

            worksheet.addRow(row).commit();
            processed++;
            if (processed % 5000 ===0) {
              logMemoryUsage(`EXCEL STREAM`, processed);
            }
          },
        );

        stream.on('end',async () => {
          await workbook.commit();

            this.logger.log('Excel export completed');
            resolve();
          },
        );

        stream.on('error', async (error) => {
            this.logger.error('Excel export failed', error.stack);

            await workbook.commit();
            reject(error);
          },
        );
      },
    );
  }
}
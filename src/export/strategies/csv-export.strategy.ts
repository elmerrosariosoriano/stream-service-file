import { Injectable,  Logger,} from '@nestjs/common';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { format } from '@fast-csv/format';
import { ExportStrategy } from '../interfaces/export-strategy.interface';
import { logMemoryUsage } from '../../utils/memory.util';
import type { Response } from 'express';

@Injectable()
export class CsvExportStrategy implements ExportStrategy {

  private readonly logger = new Logger(CsvExportStrategy.name);

  async export(stream: Readable,  res: Response,): Promise<void> {

    res.setHeader('Content-Type',  'text/csv',);
    res.setHeader('Content-Disposition',  'attachment; filename="users.csv"',);

    let processed = 0;
    stream.on('data', () => {

      processed++;
      if (processed % 10000 === 0) {
        logMemoryUsage(`CSV STREAM`, processed);
      }
    });

    const csvStream = format({ headers: true,});
    await pipeline( stream,  csvStream,  res,);

    this.logger.log('CSV export completed',);
  }
}
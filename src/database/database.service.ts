import {
  Injectable,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';

import { Pool } from 'pg';
import QueryStream from 'pg-query-stream';

import { Readable } from 'stream';

@Injectable()
export class DatabaseService
  implements OnModuleDestroy
{
  private readonly logger = new Logger(DatabaseService.name);

  private readonly pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT || 5432),
    user: process.env.POSTGRES_USER || 'rosario',
    password: process.env.POSTGRES_PASSWORD || 'rosario123456789',
    database: process.env.POSTGRES_DB || 'azure_rosario',
    max: 10,
  });

  async query<T = any>(
    text: string,
    params: unknown[] = [],
  ) {
    return this.pool.query<T>(text, params);
  }

  async stream(
    text: string,
    params: unknown[] = [],
  ): Promise<Readable> {
    const client = await this.pool.connect();

    this.logger.log(
      'Opening PostgreSQL stream',
    );

    const query = new QueryStream(
      text,
      params,
      {
        batchSize: 1000,
      },
    );

    const stream = client.query(query);

    stream.on('end', () => {
      this.logger.log(
        'PostgreSQL stream completed',
      );

      client.release();
    });

    stream.on('error', (error) => {
      this.logger.error(
        'PostgreSQL stream error',
        error.stack,
      );

      client.release();
    });

    return stream as Readable;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
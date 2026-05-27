import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Readable } from 'stream';

@Injectable()
export class PinotService {

  private readonly logger = new Logger(PinotService.name);

  async streamUsers(): Promise<Readable> {
    const stream = new Readable({  objectMode: true,  read() {},});

    const batchSize = 1000;
    let lastCreatedAt = 0;
    let lastId = '';
    try {
      while (true) {
        const sql = `
          SELECT id, first_name, last_name, email, created_at
          FROM users_REALTIME
          WHERE created_at > ${lastCreatedAt} OR (   created_at = ${lastCreatedAt}   AND id > '${lastId}' )
          ORDER BY created_at ASC, id ASC
          LIMIT ${batchSize}
        `;

        const response = await axios.post(  'http://localhost:8099/query/sql', { sql }, { timeout: 30000 },);
        const rows = response.data?.resultTable?.rows || [];
        if (!rows.length) break;

        for (const row of rows) {
          const [id,  first_name,  last_name,  email,  created_at,] = row;

          lastCreatedAt = created_at;
          lastId = id;
          stream.push({ id,  first_name,  last_name,  email,  created_at,});
        }

        if (rows.length < batchSize) break;
      }

      this.logger.log('Stream completed');
      stream.push(null);

    } catch (error) {
      this.logger.error('Failed to stream users',  error,);
      stream.destroy(error as Error);
    }

    return stream;
  }
}
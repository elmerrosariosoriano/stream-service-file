import type { Response } from 'express';
import { Readable } from 'stream';

export interface ExportStrategy {
  export(stream: Readable, res: Response): Promise<void>;
}
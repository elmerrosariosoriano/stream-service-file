import { Injectable, Logger } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { PinotService } from '../pinot/pinot.service';
import { UserMessage } from './interfaces/user-message.interface';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';
import { getRandomFirstName, getRandomLastName } from '../utils/memory.util';

@Injectable()
export class UserService {

  private readonly logger =
    new Logger(UserService.name);

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly pinotService: PinotService,
  ) {}

  async generateUsers( totalUsers = 100000,  batchSize = 5000,) {

    let inserted = 0;
    for (let offset = 0;  offset < totalUsers;  offset += batchSize) {

      const users: UserMessage[] = [];
      const currentBatch = Math.min(batchSize,  totalUsers - offset,);

      for (let index = 0;  index < currentBatch;  index++) {

        const id = randomUUID();
        const first_name = getRandomFirstName();
        const last_name = getRandomLastName();
        users.push({ id, first_name,  last_name,  email: `user_${last_name}_${Date.now()}@gmail.com`,  created_at: Date.now(),});
      }

      await this.kafkaService.publishUsers(users);

      inserted += currentBatch;
      this.logger.log(`Inserted ${inserted}/${totalUsers}`,);
    }

    return {success: true,  inserted,};
  }

  async streamUsers(): Promise<Readable> {
    return this.pinotService.streamUsers();
  }
}


/*
import {  Injectable,  Logger,} from '@nestjs/common';

import { randomBytes } from 'crypto';
import { Readable } from 'stream';
import { DatabaseService } from '../database/database.service';
import { FIRST_NAMES } from '../utils/constants';


export interface UserRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date;
}

export interface CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name,);

  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  async createUser(user: CreateUserDto,): Promise<UserRow> {
    const result = await this.databaseService.query<UserRow>(`
        INSERT INTO users (first_name,  last_name,  email)
        VALUES ($1, $2, $3)
        RETURNING  id,  first_name,  last_name,  email,  created_at`,
        [user.first_name,  user.last_name,  user.email,],
      );
    return result.rows[0];
  }

  async streamUsers(): Promise<Readable> {
    return this.databaseService.stream(`
      SELECT id, first_name, last_name, email, created_at
      FROM users
      ORDER BY id
    `);
  }


  async generateUsers(totalUsers = 50000,  batchSize = 1000,) {
    let inserted = 0;
    for (let offset = 0;  offset < totalUsers;  offset += batchSize) {
    
      const values: unknown[] = [];
      const placeholders: string[] = [];
      const currentBatchSize = Math.min(batchSize,  totalUsers - offset);

      for (let index = 0;  index < currentBatchSize;  index++) {

        const firstName =this.randomFirstName();
        const lastName =this.randomLastName();
        const email =`${lastName}_${Date.now()}_${index}@gmail.com`;
        const base = index * 3;

        placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3})`,);
        values.push(firstName,  lastName,  email,);
      }

      const query = `INSERT INTO users (first_name,  last_name,  email) VALUES ${placeholders.join(',')}`;
      await this.databaseService.query(query,  values,);

      inserted += currentBatchSize;
      this.logger.log(`Inserted ${inserted}/${totalUsers}`,);
    }

    return {success: true,  inserted,};
  }

  private randomFirstName(): string {
    const index = Math.floor(Math.random() *    FIRST_NAMES.length,);
    return FIRST_NAMES[index];
  }

  private randomLastName(): string {
    return randomBytes(6).toString('hex',);
  }
}
*/
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private producer!: Producer;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'nestjs-app',
      brokers: ['localhost:29092'],
    });

    this.producer = kafka.producer();
    try {
      await this.producer.connect();
      this.logger.log('Kafka connected');
    } catch (error) {
      this.logger.error('Kafka connection failed', error);
    }
  }

  async onModuleDestroy() {
    await this.producer?.disconnect();
  }

  async publishUsers(users: any[]) {
    await this.producer.send({
      topic: 'users-topic',
      messages: users.map((user) => ({ value: JSON.stringify(user) })),
    });
  }
}
import {  Body,  Controller,  Get,  Post,  Query,  Res,} from '@nestjs/common';
import { ExportService } from './export/export.service';
import { UserService } from './user/user.service';
import type { Response } from 'express';


@Controller()
export class AppController {
  constructor(
    private readonly exportService: ExportService,
    private readonly userService: UserService,
  ) {}

  @Get()
  healthCheck(): string {
    return 'Streaming service running';
  }

  @Post('/users')
  async createUser() {
    return this.userService.createUser({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
    });
  }

  @Post('/users/generate')
  async generateUsers(@Body() body: any) {

    const { totalUsers = 50000, batchSize = 1000 } = body;
    return this.userService.generateUsers(totalUsers,  batchSize,);
  }

  @Get('/export')
  async exportUsers(@Query('type') type: string,  @Res() res: Response,): Promise<void> {
    return this.exportService.exportUsers(type,  res,);
  }
}
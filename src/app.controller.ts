import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { FlatCategory } from 'schemas/category';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getCategories() {
    return this.appService.getCategories();
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Category } from 'schemas/category';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/flat")
  async getFlatCategories(): Promise<Category[]> {
    return this.appService.getFlatCategories();
  }

  @Get("/childrens")
  async getCategoriesWithChildrens(): Promise<Category[]> {
    return this.appService.getCategoriesWithChildrens();
  }

  @Get("/ancestors")
  async getCategoriesWithAncestors(): Promise<Category[]> {
    return this.appService.getCategoriesWithAncestors();
  }
}

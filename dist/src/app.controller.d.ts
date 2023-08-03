import { AppService } from './app.service';
import { Category } from 'schemas/category';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getFlatCategories(): Promise<Category[]>;
    getCategoriesWithChildrens(): Promise<Category[]>;
    getCategoriesWithAncestors(): Promise<Category[]>;
}

import { AppService } from './app.service';
import { FlatCategory } from 'schemas/category';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getCategories(): Promise<FlatCategory[]>;
}

import { Category } from 'schemas/category';
export declare class AppService {
    getFlatCategories(): Promise<Category[]>;
    getCategoriesWithChildrens(): Promise<Category[]>;
    getCategoriesWithAncestors(): Promise<Category[]>;
    getCategoriesWithSearchVolume(): Promise<Category[]>;
}

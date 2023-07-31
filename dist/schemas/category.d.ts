export interface Category {
    id: number;
    name: string;
    childrens?: Category[];
}

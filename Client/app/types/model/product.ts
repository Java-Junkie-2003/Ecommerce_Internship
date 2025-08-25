import { Brand } from "./brand";
import { Category } from "./category";

export interface ProductAttributes {
    fragrance_family: string;
    top_note: string;
    base_note: string;
    concentration: string;
    volume: number;
    gender: string;
    longevity_hours: string;
    sillage: string;
    launch_year: number;
}

export interface Product {
    _id: string;
    product_name: string;
    product_thumb: string;
    product_description: string;
    product_price: number;
    product_type: string;
    product_attributes: ProductAttributes;
    product_ratingAverage: number;
    product_categories: Category[];
    product_brand: Brand;
    isDraft?: boolean;
    isPublished?: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
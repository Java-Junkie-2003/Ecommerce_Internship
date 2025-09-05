import { DefaultDTO } from ".";
import { FilteredProduct, Product } from "../model/product";

export interface ProductDTO extends DefaultDTO {
    metadata: Product;
}

export interface GetAllProductAdminDTO extends DefaultDTO {
    metadata: {
        products: Partial<Product>[];
        pagination: {
            totalProducts: number;
            count: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
            nextPage: number | null;
            prevPage: number | null;
        }
    }
}

export interface FilteredProductDTO extends DefaultDTO {
    metadata: {
        products: FilteredProduct[];
        pagination: {
            totalResult: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        }
    }
}
export interface RelatedProductDTO extends DefaultDTO {
    metadata: FilteredProduct[];
}

export interface SearchProductDTO extends DefaultDTO {
    metadata: {
        _id: string;
        product_name: string;
        product_thumb: string;
        product_price: number;
        score: number;
    }[];
}
import { DefaultDTO } from ".";
import { Product } from "../model/product";

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

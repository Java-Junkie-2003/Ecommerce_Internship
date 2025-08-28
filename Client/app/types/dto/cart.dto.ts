import { DefaultDTO } from ".";
import { Cart } from "../model/cart";

export interface CartDTO extends DefaultDTO {
    metadata: {
        _id: string;
        cart_userId: string;
        __v: number;
        cart_count_products: number;
        cart_products: Cart[];
        createdAt: Date;
        updatedAt: Date;
    }
}

// {
//   "message": "Delete product in cart",
//   "statusCode": 200,
//   "metadata": {
//     "acknowledged": true,
//     "modifiedCount": 1,
//     "upsertedId": null,
//     "upsertedCount": 0,
//     "matchedCount": 1
//   }
// }

export interface DeleteCartDTO extends DefaultDTO {
    metadata: {
        productId?: string;
        acknowledged: boolean;
        modifiedCount: number;
        upsertedId: null;
        upsertedCount: number;
        matchedCount: number;
    }
}
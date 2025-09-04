import { DefaultDTO } from ".";

export interface CheckoutDTO extends DefaultDTO {
    metadata: {
        item_products: {
            price: number;
            quantity: number;
            productId: string;
        }[];
        checkout_order: {
            totalPrice: number;
            feeShip: number;
            totalCheckout: number;
        };
    };
}
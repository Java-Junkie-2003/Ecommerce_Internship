import { AddressType } from "./address";

export enum OrderStatus {
    PENDING = 'PENDING',
    DELIVERING = 'DELIVERING',
    DELIVERIED = 'DELIVERIED',
    CANCELED = 'CANCELED'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID'
}

export interface Order {
    order_userId: {
        user_name: string;
        phone: string;
    };
    order_checkout: {
        totalPrice: number;
        feeShip: number;
        totalCheckout: number;
    };
    order_shipping: {
        address: string;
        address_type: AddressType;
        _id: string;
    };
    order_payment: string;
    order_products: Array<{
        price: number;
        quantity: number;
        productId: string;
    }>;
    order_status: OrderStatus;
    payment_status: PaymentStatus;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}
import { DefaultDTO } from ".";
import { Order } from "../model/order";

export interface CreateOrderDTO extends DefaultDTO {
    metadata: Order;
}

export interface OrderDTO extends DefaultDTO {
    metadata: {
        orders: Order[];
        pagination: {
            totalOrders: number;
            count: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
            nextPage: number | null;
            prevPage: number | null;
        }
    };
}
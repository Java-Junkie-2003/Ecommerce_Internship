import { DefaultDTO } from ".";
import { Customer } from "../model/customer";

export interface CustomerDTO extends DefaultDTO {
    metadata: {
        results: Customer[];
        pagination: {
            totalResults: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        }
    };

}
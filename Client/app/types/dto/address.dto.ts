import { DefaultDTO } from ".";
import { Address } from "../model/address";

export interface AddressDTO extends DefaultDTO {
    metadata: {
        _id: string;
        addresses: Address[];
    };
}

// {
//   "message": "Insert more address",
//   "statusCode": 200,
//   "metadata": {
//     "_id": "68b00f615b16ccc97b22835f",
//     "user_id": "689471fc659ad34ec9a2cc6b",
//     "__v": 0,
//     "addresses": [
//       {
//         "address": "97F1, ABC Street, District 1, HCMC",
//         "address_type": "COMPANY",
//         "_id": "68b00f63e7cddaba2687e2f2"
//       }
//     ],
//     "createdAt": "2025-08-28T08:12:19.712Z",
//     "updatedAt": "2025-08-28T08:12:19.712Z"
//   }
// }

export interface AddressCreateDTO extends DefaultDTO {
    metadata: {
        _id: string;
        user_id: string;
        __v: number;
        addresses: Address[];
        createdAt: string;
        updatedAt: string;
    }
}
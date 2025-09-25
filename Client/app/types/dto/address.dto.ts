import { DefaultDTO } from ".";
import { Address } from "../model/address";

export interface AddressDTO extends DefaultDTO {
    metadata: {
        _id: string;
        addresses: Address[];
    };
}


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

export interface AddressUpdateDTO extends DefaultDTO {
    metadata: {
        _id: string;
        user_id: string;
        __v: number;
        addresses: Address[];
        createdAt: string;
        updatedAt: string;
    }
}

// {
//   "message": "Removed address",
//   "statusCode": 200,
//   "metadata": {
//     "acknowledged": true,
//     "modifiedCount": 1,
//     "upsertedId": null,
//     "upsertedCount": 0,
//     "matchedCount": 1
//   }
// }
export interface AddressDeleteDTO extends DefaultDTO {
    metadata: {
        acknowledged: boolean;
        modifiedCount: number;
        upsertedId: null;
        upsertedCount: number;
        matchedCount: number;
    };
}

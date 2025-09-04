export enum AddressType {
  HOME = "HOME",
  COMPANY = "COMPANY"
}

export interface Address {
  address: string;
  address_type: AddressType;
  _id?: string;
}

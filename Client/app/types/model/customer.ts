export interface Customer {
    _id: string;
    user_name: string;
    email: string;
    phone: string;
    roles?: string[];
}
// "user": {
//     "_id": "689471fc659ad34ec9a2cc6d",
//     "user_name": "DemoAccount1",
//     "email": "user1@example.com",
//     "phone": "0111111111",
//     "isActive": true,
//     "roles": [
//         "USER"
//     ]
// }

export interface User {
  _id: string;
  user_name: string;
  email: string;
  phone: string;
  isActive: boolean;
  roles: string[];
}
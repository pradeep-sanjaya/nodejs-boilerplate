import { IUser } from '@/interfaces/IUser';

export interface ITokenUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    currentUser: IUser;
    token: ITokenUser;
  }
}

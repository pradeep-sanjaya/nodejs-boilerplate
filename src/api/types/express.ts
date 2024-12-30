import { Request } from 'express';
import { IUser } from '@/interfaces/IUser';

interface ITokenUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface RequestWithUser extends Request {
  token: ITokenUser;
  currentUser: IUser;
}

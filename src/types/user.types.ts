import { statusEnum } from "./common-types";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: string;
  status?: statusEnum;
}
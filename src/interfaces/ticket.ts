import { User } from "./user";

export interface Ticket {
    id: number;
    user: User;
    status: "OPEN" | "CLOSE";
    dateCreate:Date;
    dateUpdate:Date;
  }
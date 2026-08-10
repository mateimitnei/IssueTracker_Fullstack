import { PriorityEnum } from "../enums/priority.enum";
import { StatusEnum } from "../enums/status.enum";

export interface Ticket {
    id: number;
    ticketKey: string;
    title: string;
    description: string;
    createdAt: Date;
    status: StatusEnum;
    priority: PriorityEnum;
}

import { PriorityEnum } from "../enums/priority.enum";
import { StatusEnum } from "../enums/status.enum";

export interface Audit {
    id: number;
    ticketId: number;
    ticketKey: string;
    ticketTitle: string;
    ticketDescription: string;
    ticketModifiedAt: Date;
    ticketModificationType: string;
    status: StatusEnum;
    priority: PriorityEnum;
}
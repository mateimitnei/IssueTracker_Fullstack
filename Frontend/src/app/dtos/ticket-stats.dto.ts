import { PriorityEnum } from "../enums/priority.enum";
import { StatusEnum } from "../enums/status.enum";

export interface TicketStatsDto {
    status: StatusEnum;
    priority: PriorityEnum;
    totalTickets: number;
}

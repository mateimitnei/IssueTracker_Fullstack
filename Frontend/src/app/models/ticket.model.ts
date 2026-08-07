export interface Ticket {
    id: number;
    ticketKey: string;
    title: string;
    description: string;
    createdAt: Date;
    status: string;
    priority: string;
}

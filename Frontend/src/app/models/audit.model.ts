export interface Audit {
    id: number;
    ticketId: number;
    ticketKey: string;
    ticketTitle: string;
    ticketDescription: string;
    ticketModifiedAt: Date;
    ticketModificationType: string;
    status: string;
    priority: string;
}
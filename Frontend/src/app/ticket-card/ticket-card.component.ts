import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Ticket } from '../models/ticket.model';

@Component({
    selector: 'app-ticket-card',
    imports: [CommonModule, RouterLink],
    templateUrl: './ticket-card.component.html',
    styleUrl: './ticket-card.component.css',
})
export class TicketCardComponent {
    @Input() ticket!: Ticket;
    @Output() delete = new EventEmitter<string>();

    deleteTicket() {
        this.delete.emit(this.ticket.ticketKey);
    }
}
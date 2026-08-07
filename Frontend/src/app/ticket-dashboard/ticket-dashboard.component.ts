import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable, reduce } from 'rxjs';

import { TicketService } from '../services/ticket.service';
import { StatusEnum } from '../enums/status.enum';

@Component({
    selector: 'app-ticket-dashboard',
    imports: [RouterLink, AsyncPipe],
    templateUrl: './ticket-dashboard.component.html',
    styleUrl: './ticket-dashboard.component.css',
})
export class TicketDashboardComponent implements OnInit {
    ticketsCountObs!: Observable<number[]>;
    readonly StatusEnum = StatusEnum;

    constructor(private ticketService: TicketService) { }

    ngOnInit() {
        this.ticketsCountObs = this.ticketService.getTicketsCountByStatus();
    }

    setFilter(status: string) {
        this.ticketService.updateFilter(status);
    }
}

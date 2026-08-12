import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable, map } from 'rxjs';

import { TicketService } from '../services/ticket.service';
import { StatusEnum } from '../enums/status.enum';

@Component({
    selector: 'app-ticket-dashboard',
    imports: [RouterLink, AsyncPipe],
    templateUrl: './ticket-dashboard.component.html',
    styleUrl: './ticket-dashboard.component.css',
})
export class TicketDashboardComponent implements OnInit {
    ticketsCountObs!: Observable<Record<StatusEnum, number>>;

    readonly StatusEnum = StatusEnum;

    constructor(private ticketService: TicketService) { }

    ngOnInit() {
        this.ticketsCountObs = this.ticketService.getTicketsCountByStatus().pipe(
            map(stats => ({
                [StatusEnum.TODO]: stats.find(s => s.status === StatusEnum.TODO)?.totalTickets ?? 0,
                [StatusEnum.IN_PROGRESS]: stats.find(s => s.status === StatusEnum.IN_PROGRESS)?.totalTickets ?? 0,
                [StatusEnum.IN_REVIEW]: stats.find(s => s.status === StatusEnum.IN_REVIEW)?.totalTickets ?? 0,
                [StatusEnum.DONE]: stats.find(s => s.status === StatusEnum.DONE)?.totalTickets ?? 0,
            }))
        );
    }

    setFilter(status: string) {
        this.ticketService.updateFilter(status);
    }
}

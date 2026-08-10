import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';
import { RouterLink } from '@angular/router';

import { Ticket } from '../models/ticket.model';
import { TicketService } from '../services/ticket.service';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import { CreateTicketDto } from '../dtos/ticket-create.dto';
import { PriorityEnum } from '../enums/priority.enum';
import { StatusEnum } from '../enums/status.enum';

@Component({
    selector: 'app-ticket-list',
    imports: [TicketCardComponent, FormsModule, AsyncPipe, ReactiveFormsModule, RouterLink],
    templateUrl: './ticket-list.component.html',
    styleUrl: './ticket-list.component.css',
})
export class TicketListComponent implements OnInit {
    searchText = '';
    filteredTicketsObs!: Observable<Ticket[]>;
    pressedSubmit = false;
    readonly StatusEnum = StatusEnum;
    readonly PriorityEnum = PriorityEnum;
    selectedStatus = '';

    ticketForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        priorityId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(3)]),
        description: new FormControl('', [Validators.maxLength(1000)])
    });

    constructor(private ticketService: TicketService) { }

    private filterTickets(): Observable<Ticket[]> {
        return combineLatest([this.ticketService.ticketsObs, this.ticketService.getFilter()])
            .pipe(
                map(([tickets, filter]) => {
                    if (filter === '') {
                        return tickets;
                    }
                    return tickets.filter(ticket => ticket.status === filter);
                })
            );
    }

    ngOnInit() {
        this.filteredTicketsObs = this.filterTickets();
        this.ticketService.loadTickets().subscribe();
        this.ticketService.getFilter().subscribe(f => this.selectedStatus = f);
    }

    displayTickets() {
        if (this.searchText.trim() === '') {
            this.filteredTicketsObs = this.filterTickets();
        } else {
            this.filteredTicketsObs = this.filterTickets().pipe(
                map(tickets =>
                    tickets.filter(ticket =>
                        ticket.title.toLowerCase().includes(this.searchText.toLowerCase())
                    )
                )
            );
        }
    }

    addTicket() {
        this.pressedSubmit = true;

        if (this.ticketForm.invalid) {
            this.ticketForm.markAllAsTouched();
            return;
        }

        const formValue = this.ticketForm.value;
        formValue.title = formValue.title?.trim();
        formValue.description = formValue.description?.trim();

        this.ticketService.addTicket(formValue as CreateTicketDto).subscribe(() => {
            this.displayTickets();
            this.ticketForm.reset({ title: '', priorityId: 0, description: '' });
            this.pressedSubmit = false;
        });
    }

    deleteTicketByKey(ticketKey: string) {
        this.ticketService.deleteTicket(ticketKey).subscribe();
    }

    setFilter(status: string) {
        this.ticketService.updateFilter(status);
    }

}

import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, tap, of, BehaviorSubject } from 'rxjs';

import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket.model';
import { Audit } from '../models/audit.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatusEnum } from '../enums/status.enum';
import { PriorityEnum } from '../enums/priority.enum';
import { PatchTicketDto } from '../dtos/ticket-patch.dto';
import { STATUS_MAP } from '../maps/status.map';
import { PRIORITY_MAP } from '../maps/priority.map';

@Component({
    selector: 'app-ticket-details',
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    templateUrl: './ticket-details.component.html',
    styleUrl: './ticket-details.component.css'
})
export class TicketDetailsComponent implements OnInit, OnDestroy {
    key: string | undefined;
    ticketSubject = new BehaviorSubject<Ticket | null>(null);
    audits: Audit[] = [];
    loadingAudits = signal<boolean>(true);
    private auditsSubscription!: Subscription;

    readonly StatusEnum = StatusEnum;
    readonly PriorityEnum = PriorityEnum;

    editState = signal<boolean>(false);
    editForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        statusId: new FormControl(0, [Validators.required]),
        priorityId: new FormControl(0, [Validators.required]),
        description: new FormControl('', [Validators.maxLength(1000)])
    });

    constructor(
        private ticketService: TicketService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.key = this.route.snapshot.params['ticketKey'];

        if (this.key) {
            this.ticketService.getTicketByKey(this.key).subscribe(ticket => {
                this.ticketSubject.next(ticket);
                this.initForm();
            });
            this.loadAudits();
        }
    }

    loadAudits() {
        if (this.key) {
            this.loadingAudits.set(true);
            if (this.auditsSubscription) {
                this.auditsSubscription.unsubscribe();
            }
            this.auditsSubscription = this.ticketService.getAuditForTicket(this.key)
                .subscribe(audits => {
                    this.audits = audits;
                    this.loadingAudits.set(false);
                });
        }
    }

    initForm() {
        const ticket = this.ticketSubject.value;
        if (ticket) {
            this.editForm.patchValue({
                title: ticket.title,
                statusId: STATUS_MAP[ticket.status as StatusEnum],
                priorityId: PRIORITY_MAP[ticket.priority as PriorityEnum],
                description: ticket.description
            });
        }
    }

    deleteTicket(key: string) {
        this.ticketService.deleteTicket(key).subscribe(() => {
            this.router.navigate(['/tickets']);
        });
    }

    startEdit() {
        this.editState.set(true);
    }

    cancelEdit() {
        this.initForm();
        this.editState.set(false);
    }

    submitEdit() {
        if (this.editForm.valid) {
            const currentTicket = this.ticketSubject.value;
            const formValue = this.editForm.value;
            formValue.title = formValue.title?.trim();
            formValue.description = formValue.description?.trim();

            // Check if there are any changes to be made
            if (!currentTicket ||
                formValue.title === currentTicket.title &&
                formValue.description === currentTicket.description &&
                formValue.statusId === STATUS_MAP[currentTicket.status] &&
                formValue.priorityId === PRIORITY_MAP[currentTicket.priority]) {

                return;
            }

            this.ticketService.patchTicket(this.key!, formValue as PatchTicketDto)
                .subscribe((updatedTicket) => {
                    this.ticketSubject.next(updatedTicket);
                    this.loadAudits();
                    this.editState.set(false);
                });
        }
    }

    ngOnDestroy() {
        if (this.auditsSubscription) {
            this.auditsSubscription.unsubscribe();
        }
    }
}
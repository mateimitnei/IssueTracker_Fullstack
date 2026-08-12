import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, delay, map, tap } from 'rxjs';

import { Ticket } from '../models/ticket.model';
import { Audit } from '../models/audit.model';
import { CreateTicketDto } from '../dtos/ticket-create.dto';
import { TicketStatsDto } from '../dtos/ticket-stats.dto';
import { StatusEnum } from '../enums/status.enum';
import { PatchTicketDto } from '../dtos/ticket-patch.dto';

@Injectable({
    providedIn: 'root',
})
export class TicketService {
    private apiUrl = 'http://localhost:5051/tickets';

    private statusFilter = new BehaviorSubject<string>('');

    constructor(private httpClient: HttpClient) { }

    loadTickets(): Observable<Ticket[]> {
        return this.httpClient.get<Ticket[]>(this.apiUrl);
    }

    getFilter(): Observable<string> {
        return this.statusFilter.asObservable();
    }

    updateFilter(status: string) {
        this.statusFilter.next(status);
    }

    addTicket(formValues: CreateTicketDto): Observable<Ticket> {
        return this.httpClient.post<Ticket>(this.apiUrl, formValues);
    }

    patchTicket(key: string, dto: PatchTicketDto): Observable<Ticket> {
        return this.httpClient.patch<Ticket>(`${this.apiUrl}/${key}`, dto);
    }

    deleteTicket(key: string): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiUrl}/${key}`);
    }

    getTicketByKey(key: string): Observable<Ticket> {
        return this.httpClient.get<Ticket>(`${this.apiUrl}/${key}`);
    }

    getAuditForTicket(key: string): Observable<Audit[]> {
        return this.httpClient.get<Audit[]>(`${this.apiUrl}/${key}/audit`);
    }

    getTicketsCountByStatus(): Observable<{status: StatusEnum; totalTickets: number}[]> {
        return this.httpClient.get<TicketStatsDto[]>(`${this.apiUrl}/stats/status`);
    }
}
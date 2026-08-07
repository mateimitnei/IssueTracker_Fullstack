import { Routes } from '@angular/router';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { TicketDashboardComponent } from './ticket-dashboard/ticket-dashboard.component';

export const routes: Routes = [
    { path: '', component: TicketDashboardComponent },
    { path: 'tickets', component: TicketListComponent },
    { path: 'tickets/:ticketKey', component: TicketDetailsComponent }
];

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDashboardComponent } from './ticket-dashboard.component';

describe('TicketDashboardComponent', () => {
  let component: TicketDashboardComponent;
  let fixture: ComponentFixture<TicketDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversPayoutRequestsComponent } from './drivers-payout-requests.component';

describe('DriversPayoutRequestsComponent', () => {
  let component: DriversPayoutRequestsComponent;
  let fixture: ComponentFixture<DriversPayoutRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversPayoutRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversPayoutRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

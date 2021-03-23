import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversProcessedRequestsComponent } from './drivers-processed-requests.component';

describe('DriversProcessedRequestsComponent', () => {
  let component: DriversProcessedRequestsComponent;
  let fixture: ComponentFixture<DriversProcessedRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversProcessedRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversProcessedRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledTripsComponent } from './cancelled-trips.component';

describe('CancelledTripsComponent', () => {
  let component: CancelledTripsComponent;
  let fixture: ComponentFixture<CancelledTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelledTripsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelledTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

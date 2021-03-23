import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiddlemenComponent } from './middlemen.component';

describe('MiddlemenComponent', () => {
  let component: MiddlemenComponent;
  let fixture: ComponentFixture<MiddlemenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiddlemenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiddlemenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmiddlemanComponent } from './addmiddleman.component';

describe('AddmiddlemanComponent', () => {
  let component: AddmiddlemanComponent;
  let fixture: ComponentFixture<AddmiddlemanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmiddlemanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmiddlemanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

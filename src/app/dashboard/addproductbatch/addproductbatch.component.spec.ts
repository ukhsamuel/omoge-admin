import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddproductbatchComponent } from './addproductbatch.component';

describe('AddproductbatchComponent', () => {
  let component: AddproductbatchComponent;
  let fixture: ComponentFixture<AddproductbatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddproductbatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddproductbatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

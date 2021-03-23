import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductbatchesComponent } from './productbatches.component';

describe('ProductbatchesComponent', () => {
  let component: ProductbatchesComponent;
  let fixture: ComponentFixture<ProductbatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductbatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductbatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

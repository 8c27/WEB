import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDropComponent } from './delivery-drop.component';

describe('DeliveryDropComponent', () => {
  let component: DeliveryDropComponent;
  let fixture: ComponentFixture<DeliveryDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

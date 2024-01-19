import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionCardComponent } from './subscription-card.component';

describe('SubscriptionCardComponent', () => {
  let component: SubscriptionCardComponent;
  let fixture: ComponentFixture<SubscriptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

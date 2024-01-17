import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSubscriptionListComponent } from './sidebar-subscription-list.component';

describe('SidebarSubscriptionListComponent', () => {
  let component: SidebarSubscriptionListComponent;
  let fixture: ComponentFixture<SidebarSubscriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarSubscriptionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarSubscriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

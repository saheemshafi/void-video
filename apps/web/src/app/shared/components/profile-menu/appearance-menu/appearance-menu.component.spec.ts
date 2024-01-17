import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppearanceMenuComponent } from './appearance-menu.component';

describe('AppearanceMenuComponent', () => {
  let component: AppearanceMenuComponent;
  let fixture: ComponentFixture<AppearanceMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppearanceMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppearanceMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

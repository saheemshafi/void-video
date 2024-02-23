import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfSessionComponent } from './if-session.component';

describe('IfSessionComponent', () => {
  let component: IfSessionComponent;
  let fixture: ComponentFixture<IfSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IfSessionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IfSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

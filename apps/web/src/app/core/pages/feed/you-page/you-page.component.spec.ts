import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YouPageComponent } from './you-page.component';

describe('YouPageComponent', () => {
  let component: YouPageComponent;
  let fixture: ComponentFixture<YouPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YouPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YouPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

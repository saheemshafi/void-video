import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenInfoComponent } from './fullscreen-info.component';

describe('FullscreenInfoComponent', () => {
  let component: FullscreenInfoComponent;
  let fixture: ComponentFixture<FullscreenInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullscreenInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullscreenInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

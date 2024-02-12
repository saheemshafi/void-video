import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosPageComponent } from './videos-page.component';

describe('VideosPageComponent', () => {
  let component: VideosPageComponent;
  let fixture: ComponentFixture<VideosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideosPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

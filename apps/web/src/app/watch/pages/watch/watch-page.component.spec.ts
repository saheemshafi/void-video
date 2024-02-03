import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchPageComponent } from './watch-page.component';

describe('WatchComponent', () => {
  let component: WatchPageComponent;
  let fixture: ComponentFixture<WatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WatchPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

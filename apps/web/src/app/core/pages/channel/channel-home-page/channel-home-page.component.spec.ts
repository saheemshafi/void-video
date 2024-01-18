import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelHomePageComponent } from './channel-home-page.component';

describe('ChannelHomePageComponent', () => {
  let component: ChannelHomePageComponent;
  let fixture: ComponentFixture<ChannelHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelHomePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

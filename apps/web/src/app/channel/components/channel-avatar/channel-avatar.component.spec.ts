import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelAvatarComponent } from './channel-avatar.component';

describe('ChannelAvatarComponent', () => {
  let component: ChannelAvatarComponent;
  let fixture: ComponentFixture<ChannelAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelAvatarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

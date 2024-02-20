import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelNavComponent } from './channel-nav.component';

describe('ChannelNavComponent', () => {
  let component: ChannelNavComponent;
  let fixture: ComponentFixture<ChannelNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

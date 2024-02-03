import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchPageChannelBarComponent } from './watch-page-channel-bar.component';

describe('WatchPageChannelBarComponent', () => {
  let component: WatchPageChannelBarComponent;
  let fixture: ComponentFixture<WatchPageChannelBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WatchPageChannelBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WatchPageChannelBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

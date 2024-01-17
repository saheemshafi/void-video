import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelPageComponent } from './channel-page.component';

describe('ChannelPageComponent', () => {
  let component: ChannelPageComponent;
  let fixture: ComponentFixture<ChannelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

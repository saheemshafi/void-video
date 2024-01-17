import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelLayoutComponent } from './channel-layout.component';

describe('ChannelLayoutComponent', () => {
  let component: ChannelLayoutComponent;
  let fixture: ComponentFixture<ChannelLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

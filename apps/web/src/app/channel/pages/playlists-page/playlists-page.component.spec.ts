import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsPageComponent } from './playlists-page.component';

describe('PlaylistsPageComponent', () => {
  let component: PlaylistsPageComponent;
  let fixture: ComponentFixture<PlaylistsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaylistsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaylistsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

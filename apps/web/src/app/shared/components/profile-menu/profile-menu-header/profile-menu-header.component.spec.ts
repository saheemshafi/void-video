import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMenuHeaderComponent } from './profile-menu-header.component';

describe('ProfileMenuHeaderComponent', () => {
  let component: ProfileMenuHeaderComponent;
  let fixture: ComponentFixture<ProfileMenuHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileMenuHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileMenuHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

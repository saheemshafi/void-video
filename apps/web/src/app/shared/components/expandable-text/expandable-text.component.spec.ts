import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableTextComponent } from './expandable-text.component';

describe('ExpandableTextComponent', () => {
  let component: ExpandableTextComponent;
  let fixture: ComponentFixture<ExpandableTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpandableTextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpandableTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

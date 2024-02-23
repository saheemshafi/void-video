import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateRendererComponent } from './template-renderer.component';

describe('TemplateRendererComponent', () => {
  let component: TemplateRendererComponent;
  let fixture: ComponentFixture<TemplateRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateRendererComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

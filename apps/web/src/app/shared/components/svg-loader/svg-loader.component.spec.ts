import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgLoaderComponent } from './svg-loader.component';

describe('SvgLoaderComponent', () => {
  let component: SvgLoaderComponent;
  let fixture: ComponentFixture<SvgLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgLoaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SvgLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgLoaderComponent } from './components/svg-loader/svg-loader.component';
import { FieldErrorComponent } from './components/field-error/field-error.component';

@NgModule({
  declarations: [SvgLoaderComponent, FieldErrorComponent],
  imports: [CommonModule],
  exports: [SvgLoaderComponent, FieldErrorComponent],
})
export class SharedModule {}

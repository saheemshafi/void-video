import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgLoaderComponent } from './components/svg-loader/svg-loader.component';

@NgModule({
  declarations: [SvgLoaderComponent],
  imports: [CommonModule],
  exports: [SvgLoaderComponent],
})
export class SharedModule {}

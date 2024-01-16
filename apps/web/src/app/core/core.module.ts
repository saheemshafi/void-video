import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './pages/home/home.component';

import { CdkMenuModule } from '@angular/cdk/menu';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CoreComponent,
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    NgOptimizedImage,
    SharedModule,
    CdkMenuModule,
  ],
})
export class CoreModule {}

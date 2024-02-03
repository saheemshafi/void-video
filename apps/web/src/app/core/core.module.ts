import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { HomeComponent } from './pages/home/home.component';

import { CdkMenuModule } from '@angular/cdk/menu';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { SidebarSubscriptionListComponent } from './components/sidebar-subscription-list/sidebar-subscription-list.component';
import { ChannelHomePageComponent } from './pages/channel/channel-home-page/channel-home-page.component';
import { ChannelLayoutComponent } from './pages/channel/channel-layout/channel-layout.component';

import { CdkListboxModule } from '@angular/cdk/listbox';

@NgModule({
  declarations: [
    CoreComponent,
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
    ChannelLayoutComponent,
    ChannelHomePageComponent,
    SidebarSubscriptionListComponent,
    SearchbarComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule,
    CdkMenuModule,
    FormsModule,
    CdkListboxModule,
  ],
  providers: [],
})
export class CoreModule {}

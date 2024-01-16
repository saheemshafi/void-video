import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './pages/home/home.component';

import { CdkMenuModule } from '@angular/cdk/menu';
import { SharedModule } from '../shared/shared.module';
import { ChannelPageComponent } from './pages/channel-page/channel-page.component';
import { SubscriptionsPageComponent } from './pages/feed/subscriptions-page/subscriptions-page.component';
import { HistoryPageComponent } from './pages/feed/history-page/history-page.component';
import { YouPageComponent } from './pages/feed/you-page/you-page.component';

@NgModule({
  declarations: [
    CoreComponent,
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
    ChannelPageComponent,
    SubscriptionsPageComponent,
    HistoryPageComponent,
    YouPageComponent,
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

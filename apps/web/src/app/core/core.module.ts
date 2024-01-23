import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';

import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { HomeComponent } from './pages/home/home.component';

import { CdkMenuModule } from '@angular/cdk/menu';
import { SharedModule } from '../shared/shared.module';
import { ChannelHomePageComponent } from './pages/channel/channel-home-page/channel-home-page.component';
import { ChannelLayoutComponent } from './pages/channel/channel-layout/channel-layout.component';
import { HistoryPageComponent } from './pages/feed/history-page/history-page.component';
import { SubscriptionsPageComponent } from './pages/feed/subscriptions-page/subscriptions-page.component';
import { YouPageComponent } from './pages/feed/you-page/you-page.component';
import { SidebarSubscriptionListComponent } from './components/sidebar-subscription-list/sidebar-subscription-list.component';
import { SubscriptionListComponent } from './components/feed/subscription-list/subscription-list.component';
import { SubscriptionCardComponent } from './components/feed/subscription-card/subscription-card.component';
import { VideoCardComponent } from './components/video-card/video-card.component';
import { WatchComponent } from './pages/watch/watch.component';

@NgModule({
  declarations: [
    CoreComponent,
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
    SubscriptionsPageComponent,
    HistoryPageComponent,
    YouPageComponent,
    ChannelLayoutComponent,
    ChannelHomePageComponent,
    SidebarSubscriptionListComponent,
    SubscriptionListComponent,
    SubscriptionCardComponent,
    VideoCardComponent,
    WatchComponent,
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

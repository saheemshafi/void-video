import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CdkMenuModule } from '@angular/cdk/menu';
import { FormsModule } from '@angular/forms';
import { CdkListboxModule } from '@angular/cdk/listbox';

import { HeaderComponent } from '~core/components/header/header.component';
import { SidebarComponent } from '~core/components/sidebar/sidebar.component';
import { CoreRoutingModule } from '~core/core-routing.module';
import { CoreComponent } from '~core/core.component';
import { HomeComponent } from '~core/pages/home/home.component';
import { SearchbarComponent } from '~core/components/searchbar/searchbar.component';
import { SidebarSubscriptionListComponent } from '~core/components/sidebar-subscription-list/sidebar-subscription-list.component';
import { ChannelHomePageComponent } from '~core/pages/channel/channel-home-page/channel-home-page.component';
import { ChannelLayoutComponent } from '~core/pages/channel/channel-layout/channel-layout.component';

import { SharedModule } from '~shared/shared.module';

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

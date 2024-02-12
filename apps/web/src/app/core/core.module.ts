import { CdkListboxModule } from '@angular/cdk/listbox';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '~core/components/header/header.component';
import { SearchbarComponent } from '~core/components/searchbar/searchbar.component';
import { SidebarSubscriptionListComponent } from '~core/components/sidebar-subscription-list/sidebar-subscription-list.component';
import { SidebarComponent } from '~core/components/sidebar/sidebar.component';
import { CoreRoutingModule } from '~core/core-routing.module';
import { CoreComponent } from '~core/core.component';
import { HomeComponent } from '~core/pages/home/home.component';

import { SharedModule } from '~shared/shared.module';

@NgModule({
  declarations: [
    CoreComponent,
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
    SidebarSubscriptionListComponent,
    SearchbarComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule,
    FormsModule,
    CdkListboxModule,
  ],
  providers: [],
})
export class CoreModule {}

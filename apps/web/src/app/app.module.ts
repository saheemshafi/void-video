import { APP_INITIALIZER, NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { provideCloudinaryLoader } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { provideHotToastConfig } from '@ngneat/hot-toast';

import { AppRoutingModule } from '~/app/app-routing.module';
import { AppComponent } from '~/app/app.component';

import { ThemeService } from '~shared/services/theme.service';

import { environment } from '~/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideCloudinaryLoader(environment.cloudinaryUrl),
    provideHotToastConfig({
      position: 'bottom-right',
      dismissible: true,
      duration: 1800,
      stacking: 'depth',
      visibleToasts: 3,
    }),
    {
      provide: APP_INITIALIZER,
      deps: [ThemeService],
      useFactory: () => {},
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

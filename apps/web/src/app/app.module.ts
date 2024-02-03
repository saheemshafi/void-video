import { APP_INITIALIZER, NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { provideCloudinaryLoader } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { AppRoutingModule } from '~/app/app-routing.module';
import { AppComponent } from '~/app/app.component';

import { environment } from '~/environments/environment';

import { ThemeService } from '~shared/services/theme.service';

import { provideHotToastConfig } from '@ngneat/hot-toast';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideCloudinaryLoader(environment.cloudinaryUrl),
    provideHotToastConfig({
      position: 'bottom-right',
      dismissible: true,
      duration: 1500,
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

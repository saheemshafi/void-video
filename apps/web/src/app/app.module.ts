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

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideCloudinaryLoader(environment.cloudinaryUrl),
    {
      provide: APP_INITIALIZER,
      deps: [ThemeService],
      useFactory: () => {},
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

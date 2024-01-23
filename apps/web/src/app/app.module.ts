import { APP_INITIALIZER, NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThemeService } from './shared/services/theme.service';
import { provideCloudinaryLoader } from '@angular/common';
import { environment } from '../environments/environment';

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

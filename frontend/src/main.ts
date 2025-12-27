import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';

const AppComponent = App;


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient() // ✅ REQUIRED
  ]
});

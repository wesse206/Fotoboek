import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {MsalModule, MsalRedirectComponent, MsalGuard, MsalInterceptor, MsalInterceptorConfiguration, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalService,} from "@azure/msal-angular"; // Import MsalInterceptor
import {InteractionType, PublicClientApplication, IPublicClientApplication, BrowserCacheLocation} from "@azure/msal-browser";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: "ae87628e-acd1-414d-b004-275ffe43e2d1",
      authority: "https://login.microsoftonline.com/4073cc9b-b7f3-4d1c-bac6-19cbe891b0a2",
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200'
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage
    },
    system: {
      allowNativeBroker: false, // Disables WAM Broker
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ["user.read"]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MsalModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
  ],
  bootstrap: [LoginComponent, AppComponent, MsalRedirectComponent]
})
export class AppModule { }

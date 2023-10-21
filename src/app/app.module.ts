import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {MsalModule, MsalRedirectComponent, MsalGuard, MsalInterceptor,} from "@azure/msal-angular"; // Import MsalInterceptor
import {InteractionType, PublicClientApplication} from "@azure/msal-browser";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MsalInterceptor,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: "ae87628e-acd1-414d-b004-275ffe43e2d1", // Application (client) ID from the app registration
          authority:
            "https://login.microsoftonline.com/4073cc9b-b7f3-4d1c-bac6-19cbe891b0a2", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
          redirectUri: "http://localhost:4200", // This is your redirect URI
        },
        cache: {
          cacheLocation: "localStorage",
        },
        
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ["user.read"],
        },
      },
      {
        interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
        protectedResourceMap: new Map([
          ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
        ]),
      }
    ),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
  ],
  bootstrap: [LoginComponent, AppComponent, MsalRedirectComponent]
})
export class AppModule { }

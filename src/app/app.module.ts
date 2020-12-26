import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS as FIRESTORE_SETTINGS, USE_EMULATOR as FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { AngularFireAuthModule, USE_EMULATOR as AUTH_EMULATOR } from '@angular/fire/auth';
import { USE_EMULATOR as DATABASE_EMULATOR } from '@angular/fire/database';
import { AngularFireFunctionsModule, ORIGIN as FUNCTIONS_ORIGIN, USE_EMULATOR as FUNCTIONS_EMULATOR  } from '@angular/fire/functions';

import { environment } from 'src/environments/environment';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: '__fireionic2',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
    // These settings are to use firestore emulators:start
    // connect to the local firestore db
    {
      provide: FIRESTORE_SETTINGS,
      useValue: environment.emulator ? {
        host: 'localhost:8080',
        ssl: false
      } : undefined
    },
    // connect to the local firestore functions 
    { provide: FUNCTIONS_ORIGIN, 
      useValue: environment.emulator ? {
        host: 'localhost:5001',
        ssl: false
      } : undefined
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

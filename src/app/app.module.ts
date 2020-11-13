import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS as FIRESTORE_SETTINGS } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule, ORIGIN } from '@angular/fire/functions';

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
    /*
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
    // WARNING: This does not work because it goes to http://localhost:5001/[Object%20Object]/moving...
    { provide: ORIGIN, 
      useValue: environment.emulator ? {
        host: 'localhost:5001',
        ssl: false
      } : undefined
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

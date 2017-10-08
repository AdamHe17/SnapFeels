import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FIREBASE_CONFIG } from "./app.firebase.config";
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {ProfilePage} from "../pages/profile/profile";
import {TabsPage} from "../pages/tabs/tabs";
import {CaptureEmotionPage} from "../pages/capture-emotion/capture-emotion";
import {DataPage} from "../pages/data/data";
import {HttpModule} from '@angular/http';

import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    TabsPage,
    CaptureEmotionPage,
    ProfilePage,
    DataPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG)

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    TabsPage,
    CaptureEmotionPage,
    ProfilePage,
    DataPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    // {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

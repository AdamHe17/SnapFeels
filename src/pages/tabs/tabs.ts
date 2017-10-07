import { Component } from '@angular/core';

import {DataPage} from "../data/data";
import {CaptureEmotionPage} from "../capture-emotion/capture-emotion";
import {ProfilePage} from "../profile/profile";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  captureEmotionPage = CaptureEmotionPage;
  dataPage = DataPage;
  profilePage = ProfilePage;

  constructor() {

  }
}

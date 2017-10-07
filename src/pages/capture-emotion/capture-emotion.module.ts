import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CaptureEmotionPage } from './capture-emotion';

@NgModule({
  declarations: [
    CaptureEmotionPage,
  ],
  imports: [
    IonicPageModule.forChild(CaptureEmotionPage),
  ],
})
export class CaptureEmotionPageModule {}

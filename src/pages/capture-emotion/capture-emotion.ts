import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the CaptureEmotionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-capture-emotion',
  templateUrl: 'capture-emotion.html',
})
export class CaptureEmotionPage {
  cameraOptions: CameraOptions;
  base64Image: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera) {
    this.cameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaptureEmotionPage');
  }

  takePicture() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  uploadPicture() {

  }

}

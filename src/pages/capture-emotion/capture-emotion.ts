import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

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
  localImageUri: string;
  result: JSON;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public http: Http) {
    this.cameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: 1,
      saveToPhotoAlbum: true
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaptureEmotionPage');
  }

  takePicture() {
    this.camera.getPicture(this.cameraOptions).then((imageUri) => {
      this.localImageUri = imageUri;
    }, (err) => {
      console.log(err);
    });
  }

  uploadPicture() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': '8a4acf70affb43fda17efdb209a8cda7'
    });
    const options = new RequestOptions({ headers });
    const emotion_api_url = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize';

    console.log(this.localImageUri);

    this.http.post(emotion_api_url, { url: this.localImageUri }, options)
      .map(data => data.json())
      .subscribe(result => {
        this.result = result;
        console.log(result);
      }, error => {
        console.log(error);
      });
  }

}

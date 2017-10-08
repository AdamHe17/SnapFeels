import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import {FirestoreProvider} from "../../providers/firestore-provider/firestore-provider";
import {Feel} from "../../models/feel";
import * as firebase from 'firebase';

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
  blob;
  face;
  emotion_api_url: string;
  submitted: boolean;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, private camera: Camera, public http: Http, private fsp: FirestoreProvider) {
    this.cameraOptions = {
      quality: 20,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: 1,
      saveToPhotoAlbum: true
    }

    this.emotion_api_url = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize';
    this.submitted = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaptureEmotionPage');
  }

  takePicture() {
    this.camera.getPicture(this.cameraOptions).then((imageUri) => {
      this.localImageUri = 'data:image/jpeg;base64,' + imageUri;
      this.blob = this.b64toBlob(imageUri, 'image/jpeg', 512);
      console.log(this.localImageUri);
    }, (err) => {
      console.log(err);
    });
  }

  uploadPicture() {
    const headers = new Headers({
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': '8a4acf70affb43fda17efdb209a8cda7'
    });

    const options = new RequestOptions({ headers });
    const uid = firebase.auth().currentUser.uid;

    this.http.post(this.emotion_api_url, this.blob, options)
      .map(data => data.json())
      .subscribe(result => {
        this.result = result;
        this.setFace();
        let feel = new Feel(this.face.scores);
        this.fsp.setData(uid);
        this.fsp.saveFeel(feel);
        console.log(this.face);
        console.log(this.fsp.getData(uid));
        this.submitted = true;
      }, error => {
        console.log(error);
      });


  }

  setFace() {
    const alert = this.alertCtrl.create({
      title: 'No face found!',
      message: "I couldn't find your face in the picture :(",
      buttons: ['Try again']
    });

    if (!this.result) {
      alert.present();
    } else {
      for(let i in this.result) {
        if (!this.face || this.result[i].faceRectangle.width > this.face.faceRectangle.width)
          this.face = this.result[i];
      }
    }

    if (!this.face) {
      alert.present();
    }
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

}

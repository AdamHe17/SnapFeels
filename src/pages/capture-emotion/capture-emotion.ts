import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import {FirestoreProvider} from "../../providers/firestore-provider/firestore-provider";
import {Feel} from "../../models/feel";
import * as firebase from 'firebase';
import { Chart } from 'chart.js';

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
  @ViewChild('pieChart') pieChart;
  feelingToColor;

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

    this.feelingToColor = {
      anger: 'rgba(237, 33, 33, 1)', //red
      contempt: 'rgba(170, 92, 249, 1)', //purple
      disgust: 'rgba(132, 75, 31, 1)', //brown
      fear: 'rgba(17, 1, 34, 1)', //black
      happiness: 'rgba(237, 237, 42, 1)', //yellow
      neutral: 'rgba(170, 217, 83, 1)', //greyish green
      sadness: 'rgba(26, 126, 233, 1)', //navy
      surprise: 'rgba(233, 26, 230, 1)' //pink
    }

    this.emotion_api_url = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize';
    this.submitted = false;
  }

  messageAlert(message: string) {
    const alert = this.alertCtrl.create({
      title: "Face detected!",
      message: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  ionViewWillEnter() {
    if (this.submitted) {
      this.localImageUri = null;
      this.submitted = false;
    }
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
        let s = "Your face was detected. Check out the stats page!";
        this.messageAlert(s);

        this.submitted = true;

        /*
        this.pieChart = new Chart(this.pieChart.nativeElement,{
          type: 'pie',
          data: {
            datasets: [{
              data: feel.getValues(),
              backgroundColor: [
                this.feelingToColor['anger'], this.feelingToColor['contempt'], this.feelingToColor['disgust'], this.feelingToColor['fear'],
                this.feelingToColor['happiness'], this.feelingToColor['neutral'], this.feelingToColor['sadness'], this.feelingToColor['surprise']
              ]
            }],

            labels: [
              "anger", "contempt", "disgust", "fear",
              "happiness", "neutral", "sadness", "surprise"
            ]
          },
          options: {
            responsive: true
          }
        });
        */

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

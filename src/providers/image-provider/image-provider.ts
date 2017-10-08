import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;

/*
  Generated class for the ImageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageProvider {

  constructor(public http: Http) {
    console.log('Hello ImageProvider Provider');



  }

  uploadImage(image: string, userId: string, successCb: (a: UploadTaskSnapshot) => any): any {
    let storageRef = firebase.storage().ref();
    let imageName = this.generateUUID();
    let imageRef = storageRef.child(`images/${userId}/${imageName}`);
    console.log(imageRef);
    imageRef.putString(image, 'data_url')
      .then( successCb, error => {
        console.log(error);
      })
  }

  getImage(userId: string, imageId: string): any {
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child(`${userId}/${imageId}`);
    return imageRef.getDownloadURL();
  }

  private generateUUID(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4() + '.jpg';
  }

}

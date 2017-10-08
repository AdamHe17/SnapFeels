import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Feel} from "../../models/feel";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";


/*
  Generated class for the FirestoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreProvider {

  userData: AngularFireList<Feel>;

  constructor(public http: Http, private afdb: AngularFireDatabase) {
    console.log('Hello FirestoreProvider Provider');
  }

  setData(uid: string) {
    this.userData = this.afdb.list<Feel>('users/' + uid + '/');
  }

  getData(uid: string) {
    if (!this.userData) {
      this.setData(uid);
    }

    return this.userData.valueChanges();
  }

  saveFeel(feel: Feel) {
    this.userData.push({ scores: feel.scores, timestamp: feel.timestamp });
  }

}

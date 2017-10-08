import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth'
import { AlertController } from 'ionic-angular';
import {FirestoreProvider} from "../../providers/firestore-provider/firestore-provider";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    user = {} as User;
    //show: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController,
    public alertCtrl: AlertController,
    private fsp: FirestoreProvider
  ) {
      //this.show = false;
  }

  messageAlert(message: string) {
      const alert = this.alertCtrl.create({
          title: message,
          buttons: ['Dismiss']
      });
      alert.present();
  }

  async login(user: User) {
    //try {
      const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
        .then(result => {
          console.log(result);
          this.viewController.dismiss();
        }, error => {
            console.log(error);
            if (error.code == "auth/invalid-email") {
                this.messageAlert("Invalid Email Address");
            } else if (error.code == "auth/wrong-password") {
                this.messageAlert("Incorrect Password");
            }
          })

    //} catch (e) {
      //throw (e);
    //}

  }

  register() {
    this.navCtrl.push('RegisterPage');
  }

}

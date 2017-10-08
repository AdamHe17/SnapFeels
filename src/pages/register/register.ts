import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../models/user";
import { AlertController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(
      private afAuth: AngularFireAuth,
      public navCtrl: NavController,
      public navParams: NavParams,
      public alertCtrl: AlertController) {
  }

  messageAlert(message: string) {
      const alert = this.alertCtrl.create({
          title: message,
          buttons: ['Dismiss']
      });
      alert.present();
  }

  async register(user: User) {
      try {
      const result = this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
          .then(result => {
              console.log(result);
              this.navCtrl.pop();
          }, error => {
              console.log(error);
              if (error.code == "auth/invalid-email") {
                  this.messageAlert("Invalid Email Address");
              } else if (error.code == "auth/weak-password") {
                  //this.show = true;
                  this.messageAlert('Password Must Be At Least 6 Characters');
              } else if (error.code == "auth/email-already-in-use") {
                  this.messageAlert("Email Already In Use");
              }
          })

      } catch (error) {
          console.log(error)
          if (error.code == "auth/argument-error") {
              this.messageAlert('Empty Forms Detected');
          }
      }

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}

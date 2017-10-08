import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth'
import { AlertController } from 'ionic-angular';

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
    public alertCtrl: AlertController
  ) {
      //this.show = false;
  }

  presentAlert() {
      const alert = this.alertCtrl.create({
          title: 'Incorrect Password',
          //subTitle: 'Incorrect Password',
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
            if (error.code == "auth/wrong-password") {
                //this.show = true;
                this.presentAlert();
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

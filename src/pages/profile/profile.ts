import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth';
import { Chart } from 'chart.js';
import { FirestoreProvider } from "../../providers/firestore-provider/firestore-provider";
import * as firebase from 'firebase';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  @ViewChild('stackedBarCanvas') stackedBarCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  lineChart: any;
  stackedBarChart: any;
  selectedFeeling: string;
  feelingToColor: {};
  data: any;

  constructor(public navCtrl: NavController, public firestoreProvider: FirestoreProvider) {
    this.selectedFeeling = "happiness";
    this.feelingToColor = {
      anger: 'rgba(170, 57, 57, 1)',
      contempt: 'rgba(24, 45, 8, 1)',
      disgust: 'rgba(132, 75, 31, 1)',
      fear: 'rgba(15, 17, 19, 1)',
      happiness: 'rgba(67, 67, 22, 1)',
      neutral: 'rgba(63, 63, 60, 1)',
      sadness: 'rgba(11, 13, 36, 1)',
      surprise: 'rgba(79, 18, 42, 1)'
    }
    // this.data = [{
    //   "scores": {
    //     "anger": 2.56436469E-5,
    //     "contempt": 0.00132533628,
    //     "disgust": 4.94384767E-5,
    //     "fear": 9.397171E-6,
    //     "happiness": 1.935962E-4,
    //     "neutral": 0.9948919,
    //     "sadness": 0.00185261923,
    //     "surprise": 0.00165209966
    //   },
    //   "timestamp": "Sun Oct 08 2017 02:31:41 GMT-0500 (CDT)"
    // }];
    const uid = firebase.auth().currentUser.uid;
    this.data = firestoreProvider.getData(uid);
  }

  ionViewDidLoad() {
    var barDatasets = [];
    var labels = [];
    this.data.subscribe(d => {
      for (var i = 0; i < 8; i++) {
        var feeling = Object.keys(this.feelingToColor)[i];
        var data = d.map(_d => _d['scores'][feeling]);
        barDatasets.push({
          label: feeling,
          data: data,
          backgroundColor: this.feelingToColor[feeling].replace('1)', '0.2)'),
          borderColor: this.feelingToColor[feeling],
          borderWidth: 2
        });
      }

      this.stackedBarChart = new Chart(this.stackedBarCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: d.map(_d => new Date(_d['timestamp']).toISOString()),
          datasets: barDatasets
        },
        options: {
          scales: {
            yAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true
              }
            }],
            xAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true
              },
              type: 'time',
              time: {
                displayFormats: {
                  day: 'MM/DD'
                }
              }
            }]
          }
        }
      });

      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: d.map(_d => new Date(_d['timestamp']).toISOString()),
          datasets: [
            {
              label: this.selectedFeeling,
              fill: false,
              lineTension: 0.1,
              borderColor: this.feelingToColor[this.selectedFeeling],
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: this.feelingToColor[this.selectedFeeling],
              pointBackgroundColor: "#fff",
              pointBorderWidth: 3,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: this.feelingToColor[this.selectedFeeling],
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: d.map(_d => _d['scores'][this.selectedFeeling]),
              spanGaps: true,
            }
          ],
          options: {
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  displayFormats: {
                    day: 'MM/DD'
                  }
                }
              }]
            }
          }
        }
      });
    });
  }
}

import { Component, ViewChild } from '@angular/core';
import {IonicPage, NavController, PopoverController} from 'ionic-angular';
import { Chart } from 'chart.js';
import { FirestoreProvider } from "../../providers/firestore-provider/firestore-provider";
import * as firebase from 'firebase';
import * as moment from 'moment';


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

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public firestoreProvider: FirestoreProvider) {
    this.selectedFeeling = "happiness";
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
    const uid = firebase.auth().currentUser.uid;
    this.data = firestoreProvider.getData(uid);
  }

  updateSelectedFeeling() {
    const barDatasets = [];
    this.data.subscribe(d => {
      if (barDatasets.length == 0) {
        for (let i = 0; i < 8; i++) {
          let feeling = Object.keys(this.feelingToColor)[i];
          barDatasets.push({
            label: feeling,
            data: d.map(_d => _d['scores'][feeling]),
            backgroundColor: this.feelingToColor[feeling].replace('1)', '0.2)'),
            borderColor: this.feelingToColor[feeling],
            borderWidth: 2
          });
        }
      }

      console.log("Bar:");

      this.stackedBarChart = new Chart(this.stackedBarCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: d.map(_d => moment(_d['timestamp']).fromNow()),
          datasets: barDatasets
        },
        options: {
          scales: {
            yAxes: [{
              stacked: true,
              ticks: {
                min: 0,
                max: 1,
              }
            }],
            xAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true
              },
              // type: 'time', // THIS causes the x-axis string formatting bug.
              time: {
                displayFormats: {
                  day: 'MM/DD'
                }
              }
            }]
          }
        }
      });

      console.log("Line:");

      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: d.map(_d => moment(_d['timestamp']).fromNow()),
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
              yAxes: [{
                ticks: {
                  min: 0,
                  max: 1,
                }
              }],
              xAxes: [{
                // type: 'time',
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

  ionViewDidLoad() {
    this.updateSelectedFeeling();
  }
}

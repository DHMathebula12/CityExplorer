import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HotelsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hotels',
  templateUrl: 'hotels.html',
})
export class HotelsPage {

   hotels : Array<any> ;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  this.hotels = this.navParams.get('places');
  }

  ionViewDidLoad() {
     this.hotels = this.navParams.get('places');
    console.log('ionViewDidLoad HotelsPage');


  }

}

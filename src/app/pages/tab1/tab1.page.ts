import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from 'src/app/services/data-local.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public dontSwipe: object = {
      allowSlidePrev: false,
      allowSlideNext: false,
  };

  constructor(
    private barCodeScanner: BarcodeScanner,
    private dataLocal: DataLocalService,
  ) {

  }
  ionViewWillEnter() {
    this.scan();
  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }
  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }
  ionViewDidLoad() {

  }

  scan() {
    this.barCodeScanner.scan()
      .then( barCodeData => {
        if (!barCodeData.cancelled) {
          this.dataLocal.guardarRegistros(barCodeData.format, barCodeData.text);
        }
      })
      .catch(err => {
        console.log(err);
        // to test on web
        // this.dataLocal.guardarRegistros('QrTest', 'http://platzi.com');
        this.dataLocal.guardarRegistros('QrTest', 'geo:40.73151796986687,-74.06087294062502');
      });
  }
}

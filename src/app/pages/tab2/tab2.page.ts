import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public dataLocal: DataLocalService) {}
  enviarCorreo() {
    console.log('Enviando correo...');
    this.dataLocal.enviarCorreo();
  }
  openRegister(registro) {
    console.log('abriendo...');
    this.dataLocal.abrirRegistro(registro);
  }

}

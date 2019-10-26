import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registers: Registro[] = [];

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    private file:File,
    private emailComposer: EmailComposer,
  ) {
   this.loadStorage();
  }
  async loadStorage() {
    this.registers = await this.storage.get('registers') || [];
  }

  guardarRegistros(format: string, text: string) {
    const newRegister = new Registro(format, text);
    if (this.registers) {
      this.registers.unshift(newRegister);
    }
    this.storage.set('registers', this.registers);
    this.abrirRegistro(newRegister);
  }


  abrirRegistro(registro: Registro) {
    this.navCtrl.navigateForward('tabs/tab2');
    let registroFormat = {...registro}.text;
    registroFormat = registroFormat.split(':')[0];
    registroFormat.includes('htto')
    console.log(registroFormat);
    switch (registroFormat) {
      case ('https'):
        console.log('entro aca');
        this.iab.create(registro.text, '_system');
        break;
      case 'geo':
        this.navCtrl.navigateForward('tabs/tab2/mapas/' + registro.text);
        break;
      default:
    }
  }
  enviarCorreo() {
    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';
    arrTemp.push( titulos );
    this.registers.forEach( registro =>{
      const linea = registro.format + ', ' + registro.format + ', ' + registro.created + ', ' + registro.text.replace(',', ' ')+'\n';
      arrTemp.push(linea);
    });

    const text = arrTemp.join('');
    this.crearArchivoFisico(text);
  }

  crearArchivoFisico( text:string ) {
    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
      .then((existe) => {
        console.log('existe el archivo solo hay que modificarlo');
        return this.escribirArchivo( text);
      })
      .catch((err) =>{
        return this.file.createFile(this.file.dataDirectory, 'registros.csv', false)
          .then( creado => this.escribirArchivo(text))
          .catch(err2 => console.log('no se pudo crear el archivo'));
      })
  }

  async escribirArchivo(text:string) {
    await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text)
    console.log('Archivo creado');
    this.sendInfoToMail();
  }
  sendInfoToMail() {
    const archivo = this.file.dataDirectory + 'registros.csv';
    console.log(archivo);
    const email = {
      to: 'dacevedojaramillo@gmail.com',
    attachments: [
     archivo,
    ],
    subject: 'QRCODE',
    body: 'Reporte de qr Codes testeados ',
    isHtml: true,
    }
    this.emailComposer.open(email);
  }

}

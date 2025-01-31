import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../servicio/acceso.service';
import { ModalController } from '@ionic/angular';
import { LoadingService } from "../servicio/loading.service";
import { filterid, formatUrl, PERSON_API, VALIDATION_API } from 'src/interfaces/constantes';
import { usuarioDto } from 'src/interfaces/usuario';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
  standalone: false,
})
export class CuentaPage {

  cid: string = ''; nombre: string = ''; apellido: string = '';
  mail: string = ''; pass: string = ''; repite_pass: string = '';
  mensaje: string = ''; mensajeClave: string = '';

  constructor(
    private servicio: AccesoService, private modalView: ModalController, private loadingService: LoadingService
  ) { }

  validarCID() {
    if(this.cid.toString().length ===10) {
    const API = VALIDATION_API

    const endPoint = formatUrl(API,this.cid,filterid)
      this.servicio.getData(endPoint).subscribe((response: any) => {
        if (response.value) {
          this.cid = "";
          this.loadingService.showToast("El usuario ya se encuentra registrado", 3000,'primary')
        }
      });
    }

  }

  comprobarPass() {
    if (this.pass !== this.repite_pass) {
      this.mensajeClave = 'Las claves no coinciden';
    } else {
      this.mensajeClave = '';
    }
  }

  retornarLogin() {
    this.modalView.dismiss();
  }

  signUp() {
    if ( this.cid != "" && this.nombre != "" && this.apellido != "" && this.mail != "" && this.pass != "" ) {

      const datos:usuarioDto = {
        ci:this.cid,
        nombre_persona:this.nombre,
        apellido_persona:this.apellido,
        clave_persona:this.pass,
        correo_persona:this.mail,
        id:"0"
      };

      this.servicio.postData(datos, PERSON_API).subscribe({
        next: (res: any) => {
          this.modalView.dismiss();
          this.loadingService.showToast(res.message || 'Registro exitoso', 3000, 'primary');
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Ocurrió un error en el registro';
          this.loadingService.showToast(errorMessage, 3000, 'danger');
        },
        complete: () => {
          console.log('Registro completado');
        }
      });

    }else {
      this.loadingService.showToast('Faltan campor por llenar', 3000,'danger');
    }
  }
}

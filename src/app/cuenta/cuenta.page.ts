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
export class CuentaPage implements OnInit {

  txt_cedula: string = '';
  txt_nombre: string = '';
  txt_apellido: string = '';
  txt_correo: string = '';
  txt_clave: string = '';
  txt_cclave: string = '';
  mensaje: string = '';
  mensajeClave: string = '';


  constructor(
    private servicio: AccesoService,
    private modalView: ModalController,
    private loadingService: LoadingService

  ) { }

  ngOnInit() {
  }

  validaCedula() {
    if(this.txt_cedula.toString().length ===10) {
    const API = VALIDATION_API

    const endPoint = formatUrl(API,this.txt_cedula,filterid)
      this.servicio.getData(endPoint).subscribe((response: any) => {
        if (response.value) {
          this.txt_cedula = "";
          this.loadingService.showToast("El usuario ya se encuentra registrado", 3000,'primary')
        }
      });
    }

  }

  vclave() {
    if (this.txt_clave !== this.txt_cclave) {
      this.mensajeClave = 'Las claves no coinciden';
    } else {
      this.mensajeClave = '';
    }
  }

  cancelar() {
    this.modalView.dismiss();
  }

  registrar() {

    if (this.txt_cedula != "" &&
        this.txt_nombre != "" &&
        this.txt_apellido != "" &&
        this.txt_correo != "" &&
        this.txt_clave != "") {

      const datos:usuarioDto = {
        ci:this.txt_cedula,
        nombre_persona:this.txt_nombre,
        apellido_persona:this.txt_apellido,
        clave_persona:this.txt_clave,
        correo_persona:this.txt_correo,
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

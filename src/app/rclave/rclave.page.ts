import { SessionService } from './../servicio/session.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { filtermail, formatUrl, PERSON_API, VALIDATION_API } from 'src/interfaces/constantes';
import { AccesoService } from '../servicio/acceso.service';
import { LoadingService } from '../servicio/loading.service';
import { recuperaClave } from 'src/interfaces/usuario';

@Component({
  selector: 'app-rclave',
  templateUrl: './rclave.page.html',
  styleUrls: ['./rclave.page.scss'],
  standalone: false,
})
export class RclavePage implements OnInit {

  txt_correo:string="";
  txt_clave:string="";
  txt_cclave:string="";
  bloquearEmail:boolean=false;
  bloquearCampos: boolean = false;
  bloqueaRecuperar:boolean = false;
  mensajeClave: string="";

  constructor(private navController: NavController,
              private servicio: AccesoService,
              private sessionService:SessionService,
              private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.bloquearCampos = true;
    this.bloqueaRecuperar=true;
  }

  validarEmail() {
    if(this.txt_correo.toString().length !=0) {
      const API = VALIDATION_API

      const endPoint = formatUrl(API,this.txt_correo,filtermail)
      this.servicio.getData(endPoint).subscribe(
        (response: any) => {
          if (response.value) {
            this.bloquearCampos = false;
            this.bloqueaRecuperar=false;
            this.bloquearEmail = true;
            this.sessionService.createSesion("user-id",response.value);
          } else {
            this.loadingService.showToast("Usuario no existente", 3000, 'alert');
          }
        },
        (err) => {
          const errorMessage = err.error?.message || 'Usuario no existente';
          this.loadingService.showToast(errorMessage, 3000, 'danger');
          this.txt_correo = "";
        }
      );
    }
  }


  validarclave() {
    if (this.txt_clave !== this.txt_cclave) {
      this.mensajeClave = 'Las claves no coinciden';
      this.bloqueaRecuperar = true;
    } else {
      this.mensajeClave = '';
      this.bloquearCampos = false;
    }
  }


  async recuperar() {

    if(this.txt_cclave.toString.length == 0 && this.txt_clave.toString().length == 0)
    {
      this.mensajeClave = 'Debe ingresar una clave';
    }else{
      const id = await this.sessionService.getSesion("user-id") ?? "";

      let datos: recuperaClave = {
        id: id,
        clave_persona: this.txt_cclave
      };

      this.servicio.patchData(datos,PERSON_API ).subscribe((res: any) => {
        if (res) {
          this.loadingService.showToast("Clave actualizada exitosamente", 3000,'success')
          this.txt_clave="";
          this.txt_cclave="";
          this.txt_correo="";
          this.navController.navigateBack(["/home"])
        }
      });
    }
  }

  cancelar(){
    this.navController.navigateBack(["/home"]);
  }

}

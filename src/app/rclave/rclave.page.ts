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

  mail: string="";
  pass: string="";
  repite_pass: string="";
  mail_block: boolean=false;
  sect_block: boolean = false;
  rec_block: boolean = false;
  message: string="";

  constructor(
    private navController: NavController, private servicio: AccesoService, private sessionService:SessionService, private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.sect_block = true;
    this.rec_block=true;
  }

  ComprobarCorreo() {
    if(this.mail.toString().length !=0) {
      const API = VALIDATION_API

      const endPoint = formatUrl(API,this.mail,filtermail)
      this.servicio.getData(endPoint).subscribe(
        (response: any) => {
          if (response.value) {
            this.sect_block = false;
            this.rec_block=false;
            this.mail_block = true;
            this.sessionService.createSesion("user-id",response.value);
          } else {
            this.loadingService.showToast("Usuario no existente", 3000, 'alert');
          }
        },
        (err) => {
          const errorMessage = err.error?.message || 'Usuario no existente';
          this.loadingService.showToast(errorMessage, 3000, 'danger');
          this.mail = "";
        }
      );
    }
  }


  ComprobarClave() {
    if (this.pass !== this.repite_pass) {
      this.message = 'Las claves no coinciden';
      this.rec_block = true;
    } else {
      this.message = '';
      this.sect_block = false;
    }
  }


  async recuperar() {

    if(this.repite_pass.toString.length == 0 && this.pass.toString().length == 0)
    {
      this.message = 'Debe ingresar una clave';
    }else{
      const id = await this.sessionService.getSesion("user-id") ?? "";

      let datos: recuperaClave = {
        id: id,
        clave_persona: this.repite_pass
      };

      this.servicio.patchData(datos,PERSON_API ).subscribe((res: any) => {
        if (res) {
          this.loadingService.showToast("Clave actualizada exitosamente", 3000,'success')
          this.pass="";
          this.repite_pass="";
          this.mail="";
          this.navController.navigateBack(["/home"])
        }
      });
    }
  }

  CerrarSesion(){
    this.navController.navigateBack(["/home"]);
  }

}

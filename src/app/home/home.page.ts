import { SessionService } from './../servicio/session.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AccesoService } from '../servicio/acceso.service';
import { CuentaPage } from '../cuenta/cuenta.page';
import { LoadingService } from '../servicio/loading.service';
import { loginDto } from 'src/interfaces/usuario';
import { LOGIN_API } from 'src/interfaces/constantes';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  txt_clave: string = '';
  txt_usuario: string = '';
  isPasswordVisible: boolean = false;


  constructor(
    private loadingService: LoadingService,
    private accessService: AccesoService,
    private navController: NavController,
    private modalControler: ModalController,
    private sessionService: SessionService
  ) {}
  ngOnInit(): void {
    this.sessionService.closeSession();
    this.txt_clave = "";
    this.txt_usuario= "";
  }

  login() {
    const dto: loginDto = {
      email: this.txt_usuario,
      password: this.txt_clave,
    };
    this.accessService.postData(dto, LOGIN_API).
    subscribe({
      next: async (res: any) => {
        if (res.success) {
          await this.sessionService.createName("data-user-name",res.data.nombre_persona);
          await this.sessionService.createName("user-id",res.data.id);
          await this.loadingService.showLoading('Cargando...',5000,'circles');
          setTimeout(async () => {
            await this.loadingService.hideLoading();
            this.navController.navigateRoot(['/menu']);
          }, 5000);
        } else {
          this.loadingService.showToast(res.message || 'Usuario no encontrado', 3000, 'danger');
        }
      },
      error: (err) => {
        this.loadingService.showToast(err.error.message, 3000, 'danger');
      }
    });

  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async registrarse() {
    const modalView = await this.modalControler.create({
      component: CuentaPage,
      componentProps: {
        nombre: 'Fernando',
        pais: 'Ecuador',
      },
    });
    await modalView.present();
  }

  recuperar() {
    this.navController.navigateForward(["/rclave"])
  }

}

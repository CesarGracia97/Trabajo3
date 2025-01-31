import { SessionService } from './../servicio/session.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage implements OnInit {
  
  nombre: string = '';

  constructor(
    private navCtrl: NavController, private sessionService: SessionService
  ) {}

  async ngOnInit() {
    this.nombre = await this.sessionService.getSesion("data-user-name") ?? "";
    let c = this.nombre;
  }

  iraPerfil() {
    this.navCtrl.navigateForward('/perfil');
  }

  CerrarSesion() {
    this.sessionService.closeSession();
    console.log('Cerrando sesión...');
    this.navCtrl.navigateRoot('/home');
  }
}

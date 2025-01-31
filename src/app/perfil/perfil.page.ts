import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AccesoService } from '../servicio/acceso.service';
import { SessionService } from './../servicio/session.service';
import { LoadingService } from '../servicio/loading.service';
import { formatUrl, GETUSER_API, VALIDATION_API } from 'src/interfaces/constantes';
import { usuarioDto } from 'src/interfaces/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  ci: string = ''; name: string = ''; apeliido: string = '';
  mail: string = ''; pass: string = ''; repite_pass: string = '';
  ci_block: boolean = true; message: string | null = null;

  constructor(
    private navController: NavController, private sessionService: SessionService, private servicio: AccesoService, private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private ComprobarCorreo(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  async save() {
    if (!this.name || !this.apeliido || !this.ci || !this.mail) {
      this.loadingService.showToast("Todos los campos son obligatorios", 3000, "danger");
      return;
    }

    if (!this.ComprobarCorreo(this.mail)) {
      this.loadingService.showToast("Correo electrónico inválido", 3000, "danger");
      return;
    }

    if (this.pass !== this.repite_pass) {
      this.loadingService.showToast("Las contraseñas no coinciden", 3000, "danger");
      return;
    }

    try {
      const API = VALIDATION_API;
      const id = await this.sessionService.getSesion("user-id") ?? "";
      const endPoint = formatUrl(API, id);

      const usuarioActualizado: usuarioDto = {
        ci: this.ci,
        nombre_persona: this.name,
        apellido_persona: this.apeliido,
        correo_persona: this.mail,
        clave_persona: this.pass,
        id: id
      };

      this.servicio.putData(usuarioActualizado, endPoint).subscribe(
        () => {
          this.loadingService.showToast("Datos guardados con éxito", 3000, "success");
        },
        (err) => {
          const errorMessage = err.error?.message || "Error al guardar los datos";
          this.loadingService.showToast(errorMessage, 3000, "danger");
        }
      );
    } catch (error) {
      this.loadingService.showToast("Error inesperado", 3000, "danger");
    }
  }

  CerrarSesion() {
    this.navController.navigateBack(["/home"]);
  }

  ComprobarContrasena() {
    if (this.pass !== this.repite_pass) {
      this.message = 'Las claves no coinciden';
    } else {
      this.message = '';
    }
  }

  async loadData() {
    const API = GETUSER_API;
    const id = await this.sessionService.getSesion("user-id") ?? "";
    const endPoint = formatUrl(API, id);

    this.servicio.getData(endPoint).subscribe(
      (response: usuarioDto) => {
        if (response && response.nombre_persona) {

          this.ci = response.ci;
          this.name = response.nombre_persona;
          this.apeliido = response.apellido_persona;
          this.mail = response.correo_persona;
          this.pass = response.clave_persona;
          this.loadingService.showToast("Información cargada exitosamente", 3000, "success");
        } else {
          this.loadingService.showToast("Usuario no encontrado", 3000, "danger");
        }
      },
      (err) => {
        const errorMessage = err.error?.message || "Error al obtener los datos";
        this.loadingService.showToast(errorMessage, 3000, "danger");
      }
    );
  }
}

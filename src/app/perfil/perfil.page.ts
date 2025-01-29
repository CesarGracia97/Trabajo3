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

  cedula: string = '';
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  clave: string = '';
  repetirClave: string = '';
  bloquearId: boolean = true;
  mensaje:string="";

  constructor(
    private navController: NavController,
    private sessionService: SessionService,
    private servicio: AccesoService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private validarCorreo(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  async guardar() {
    // Validaciones antes de guardar
    if (!this.nombre || !this.apellido || !this.cedula || !this.correo) {
      this.loadingService.showToast("Todos los campos son obligatorios", 3000, "danger");
      return;
    }

    if (!this.validarCorreo(this.correo)) {
      this.loadingService.showToast("Correo electrónico inválido", 3000, "danger");
      return;
    }

    if (this.clave !== this.repetirClave) {
      this.loadingService.showToast("Las contraseñas no coinciden", 3000, "danger");
      return;
    }

    try {
      const API = VALIDATION_API;
      const id = await this.sessionService.getSesion("user-id") ?? "";
      const endPoint = formatUrl(API, id);

      const usuarioActualizado: usuarioDto = {
        ci: this.cedula,
        nombre_persona: this.nombre,
        apellido_persona: this.apellido,
        correo_persona: this.correo,
        clave_persona: this.clave,
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

  cancelar() {
    this.navController.navigateBack(["/home"]);
  }

  verificarclave() {
    if (this.clave !== this.repetirClave) {
      this.mensaje = 'Las claves no coinciden';
    } else {
      this.mensaje = '';
    }
  }

  async loadData() {
    const API = GETUSER_API;
    const id = await this.sessionService.getSesion("user-id") ?? "";
    const endPoint = formatUrl(API, id);

    this.servicio.getData(endPoint).subscribe(
      (response: usuarioDto) => {
        if (response && response.nombre_persona) {

          this.cedula = response.ci;
          this.nombre = response.nombre_persona;
          this.apellido = response.apellido_persona;
          this.correo = response.correo_persona;
          this.clave = response.clave_persona;
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

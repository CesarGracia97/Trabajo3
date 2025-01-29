import { Injectable } from "@angular/core";
import { LoadingController, ToastController } from "@ionic/angular";


@Injectable({
  providedIn:"root"
})

export class LoadingService {

  constructor(public toastController:ToastController,
              public loadingController: LoadingController
  ){}

  async showToast(mensaje: string, tiempo: number, color: string) {

  const currentToast = await this.toastController.getTop();
  if (currentToast) {
    currentToast.dismiss();
  }
    const toast = await this.toastController.create({
        message: mensaje,
        duration: tiempo,
        position: 'bottom',
        color: color
      });
     toast.present();
  }

  async showLoading(message: string, duration: number, spinner: any) {
    const loading = await this.loadingController.create({
      message: message,
      duration: duration,
      spinner: spinner
    });
    await loading.present();
  }

  async hideLoading() {
    await this.loadingController.dismiss();
  }


}

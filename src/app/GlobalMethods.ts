import { LoadingController, AlertController } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class CustomMethods{

    loader:any;
    
  constructor(
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController
  ){}

    exibirLoading() {
        this.loader = this.loadingCtrl.create({
            spinner: "hide",
            content: "<div class='align-middle flex'><img src='/assets/imgs/proleadLoading.gif' height='50' /><span class='height-50 flex align-center'>Carregando...</span></div>",
        });
        this.loader.present();
    }

    okAlert(Mensagem:string){
        let alert = this.alertCtrl.create({
            title: 'Aviso!',
            message: Mensagem,
            buttons: ['OK'],
            cssClass: 'alertCustomCss'
        });
        alert.present();
    }

    AlertReload(Mensagem:string){
        let alert = this.alertCtrl.create({
            title: 'Aviso!',
            message: Mensagem,
            buttons: [{text: 'Recarregar',         
            handler: () => {
                location.reload();
              }
            }],
            cssClass: 'alertCustomCss'
        });
        alert.present();
    }

    dataHoje(){
        let data;
        data = new Date();
        let dd = data.getDate();
        let mm = data.getMonth() + 1; //Janeiro é 0!
        let yyyy = data.getFullYear();
  
        if (dd < 10) {
          dd = '0' + dd
        }
  
        if (mm < 10) {
          mm = '0' + mm
        }
  
        data = yyyy + '-' + mm + '-' + dd;//Formato que o date-time reconhece

        return(data)
    }
    dataMenosMes(mes: number){
        mes = Math.floor(mes);
        let data;
        data = new Date();
        data.setMonth(data.getMonth() - mes)
        let dd = data.getDate();
        let mm = data.getMonth() + 1; //Janeiro é 0!
        let yyyy = data.getFullYear();
  
        
        if (dd < 10) {
          dd = '0' + dd;
        }

        if (mm < 10) {
          mm = '0' + mm
        }
  
        data = yyyy + '-' + mm + '-' + dd;//Formato que o date-time reconhece

        return(data)
    }
}
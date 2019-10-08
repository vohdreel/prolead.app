import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { URL_BASE, URL_LoadNotifications } from '../../app/app.url';
import { Http } from '@angular/http';
import { CustomMethods } from '../../app/GlobalMethods';
import { Colaborador } from '../../models/Colaborador';
import { VisualizarFeedbackPage } from '../diario-de-bordo/visualizar-feedback/visualizar-feedback';
import { DiarioDeBordoPage } from '../diario-de-bordo/diario-de-bordo';
import { HomePage } from '../home/home';
import { SelecionarAvaliacaoPage } from '../competencias/selecionar-avaliacao/selecionar-avaliacao';
import { CompetenciasPage } from '../competencias/competencias';


@IonicPage()
@Component({
  selector: 'page-notificacoes',
  templateUrl: 'notificacoes.html',
})
export class NotificacoesPage {

  Notificacoes: any[];
  Colaborador = new Colaborador;

  constructor(public navCtrl: NavController,
    public http: Http,
    public navParams: NavParams,
    public CustomMethods: CustomMethods) {
      this.CustomMethods.exibirLoading();
    this.loadNotificacoes();
  }

  autosize(Id: string){
    let height = document.getElementById(Id).scrollHeight;
    document.getElementById(Id).style.height = height + 'px'
  }; 

  defineBorda(tipo){
    if (tipo == 1){
      return "border-diario1";
    }else if (tipo == 2){
      return "border-competencias1";
    }else if (tipo == 2){
      return "border-desempenho1";
    }else{
      return "border-estrutura1";
    }
  }

  defineTipo(tipo, lido){
    let classe = "";
    if (lido){
      classe = "lido ";
    }

    if (tipo == 1){
      return (classe + "custom-diario");
    }else if (tipo == 2){
      return (classe + "custom-competencias");
    }else if (tipo == 3){
      return (classe + "custom-desempenho");
    }else{
      return (classe + "ion-ios-notifications");
    }
  }

  async loadNotificacoes(){
    let ultimo:number = null;

    if (this.Notificacoes){
      ultimo = this.Notificacoes[this.Notificacoes.length - 1].Id;
    }
    this.http.get(URL_BASE + URL_LoadNotifications + "?last=" + ultimo + "&idColab=" + this.Colaborador.id)
    .map(res => res.json()).subscribe(
      resp => {

        if(resp.Ok){
          if (this.Notificacoes){
            if (resp.data){
              resp.data.forEach(element => {
                this.Notificacoes.push(element);        
              });
            }
          }else{
            this.Notificacoes = resp.data;
          }
          this.CustomMethods.loader.dismiss();          
        }else{
          this.CustomMethods.okAlert(
            "Ocorreu um erro ao carregar as notificações, por favor tente novamente."
          );
          this.CustomMethods.loader.dismiss();
        }
      },
      err => {
        this.navCtrl.setRoot(HomePage);
        this.CustomMethods.okAlert(
          "Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente"
        );
        this.CustomMethods.loader.dismiss();
      }
    );
  }

  async infinityLoad(infiniteScroll){    
    let antes = this.Notificacoes.length;
    await this.loadNotificacoes();
    let depois = this.Notificacoes.length;

    if (antes == depois){
      infiniteScroll.enable(false);
    }
    infiniteScroll.complete();
  }

  async refresh(refresher){
    this.Notificacoes = undefined;

    await this.loadNotificacoes();

    refresher.complete();
  }

  redirect(idRedirect:number){

    // this.navCtrl.push(SelecionarAvaliacaoPage, {tit: 'Auto Avaliação'});
    // this.navCtrl.push(SelecionarAvaliacaoPage, {tit: 'Avaliação dos Liderados'});
    // this.navCtrl.push(SelecionarAvaliacaoPage, {tit: 'Avaliação de Pares'});
    // this.navCtrl.push(SelecionarAvaliacaoPage, {tit: 'Avaliação de Lider'});

    switch (idRedirect) {

      // case 1:
      //   this.navCtrl.push(SelecionarAvaliacaoPage, {tit: 'Auto Avaliação'});
      // break;

      // case 2:
      //   this.navCtrl.push(SelecionarAvaliacaoPage, {tit: 'Avaliação dos Liderados'});
      // break;

      // case 3:
      //   this.navCtrl.push(CompetenciasPage);
      // break;

      // case 4:
      //   this.navCtrl.push(VisualizarFeedbackPage, {tit: 'Meus Feedbacks'});
      // break;

      // case 5:
      //    this.navCtrl.push(VisualizarFeedbackPage, {tit: 'Feedback dos Liderados'});
      // break;
      
      // case 6:
      //    this.navCtrl.push(VisualizarFeedbackPage, {tit: 'Meus Feedbacks'});
      // break;

      // case 12:
      //   this.navCtrl.push(SelecionarAvaliacaoPage, {tit: 'Auto Avaliação'});
      // break;

      // case 13:
      //   this.navCtrl.push(SelecionarAvaliacaoPage, {tit: 'Avaliação dos Liderados'});
      // break;

      // case 19:
      // case 20:
      //   this.navCtrl.push(DiarioDeBordoPage);
      // break;

      // case 45:
      //   this.navCtrl.push(SelecionarAvaliacaoPage, {tit: 'Auto Avaliação'});
      // break;

      // case 47:
      //   this.navCtrl.push(SelecionarAvaliacaoPage, {tit: 'Avaliação de Lider'});
      // break;

      // case 48:
      //   this.navCtrl.push(SelecionarAvaliacaoPage, {tit: 'Avaliação de Pares'});
      // break;

      default: break;
    }

  }

}

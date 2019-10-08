import { Component } from '@angular/core';
import { MenuController, NavController, Events } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';

import { CompetenciasPage } from '../competencias/competencias';
import { DiarioDeBordoPage } from '../diario-de-bordo/diario-de-bordo';
import { CustomMethods } from '../../app/GlobalMethods';
import { Http } from '@angular/http';
import { URL_BASE, URL_Menu, URL_FcmToken } from '../../app/app.url';
import { Colaborador } from '../../models/Colaborador';

import { Firebase } from '@ionic-native/firebase';
import { FCM } from '@ionic-native/fcm';
import { NotificacoesPage } from '../notificacoes/notificacoes';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  Colaborador = new Colaborador();
  IdColaborador = this.Colaborador.id;
  AcessaAvaliacaoDiaria;
  AcessaDesempenho;
  AcessaObjetivos;
  AcessaCompetencias;
  AcessaMatrizInformacao;
  AcessaSucessao;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public CustomMethods: CustomMethods,
    public http: Http,
    private firebase: Firebase,
    public events: Events,
    public platform: Platform,
    public FCM: FCM
  ) {
    this.CustomMethods.exibirLoading();
    this.menuCtrl.enable(true);
    this.loadPermicoes();
  }

  loadPermicoes() {
    this.http.get(URL_BASE + URL_Menu + "?idColab=" + this.IdColaborador)
      .map(res => res.json()).subscribe(
        resp => {
          this.AcessaAvaliacaoDiaria = resp.AvaliacaoDiaria;
          this.AcessaDesempenho = resp.Desempenho;
          this.AcessaObjetivos = resp.Objetivos;
          this.AcessaCompetencias = resp.Competencias;
          this.AcessaMatrizInformacao = resp.MatrizInformacao;
          this.AcessaSucessao = resp.Sucessao;
          this.CustomMethods.loader.dismiss();
          this.ColocarBarraPagina('HomePage');
        }, err => {
          this.CustomMethods.loader.dismiss();
          this.CustomMethods.AlertReload("Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente");
        });

    if (this.platform.is('cordova')) {      
      this.http
        .get(
          URL_BASE +
          URL_FcmToken +
          "?idColaborador=" +
          localStorage.getItem("idColaborador") +
          "&token=" +
          localStorage.getItem("FCMDeviceToken")
          //localStorage.getItem('FCMTokenPhonegap')
        )
        .map(res => res.json())
        .subscribe(resp => {
          this.CustomMethods.okAlert(
            resp
          );

        }, err => { });
    }
  }

  Competencias() {
    this.ColocarBarraPagina('CompetenciasPage');
    this.navCtrl.setRoot(CompetenciasPage)
  }

  DiarioDeBordo() {
    this.ColocarBarraPagina('DiarioDeBordoPage');
    this.navCtrl.setRoot(DiarioDeBordoPage)
  }

  AbrirNotificacoes() {
    this.navCtrl.push(NotificacoesPage)
  }

  ColocarBarraPagina(seletor: string) {
    this.events.publish('colocarBarra', seletor)
  }

}

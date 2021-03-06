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
import { ConfiguracoesPage } from '../configuracoes/configuracoes';
import { LogInPage } from '../log-in/log-in';
import { PesquisaPontualPage } from '../pesquisa-pontual/pesquisa';

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
  AcessaPesquisaPontual
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
          this.AcessaPesquisaPontual = true;
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

        }, err => { });
    }
  }

  Competencias() {
    this.ColocarBarraPagina('CompetenciasPage');
    this.navCtrl.push(CompetenciasPage)
  }

  DiarioDeBordo() {
    this.ColocarBarraPagina('DiarioDeBordoPage');
    this.navCtrl.push(DiarioDeBordoPage)
    
  }

  PesquisaPontual() {
    this.ColocarBarraPagina('PesquisaPontualPage');
    this.navCtrl.push(PesquisaPontualPage)
    
  }

  AbrirNotificacoes() {
    this.navCtrl.push(NotificacoesPage)
  }

  AbrirConfiguracao(config: string, FromHome: boolean){
    this.navCtrl.push(ConfiguracoesPage, {type: config, isFromHome: FromHome})
  }

  ColocarBarraPagina(seletor: string) {
    this.events.publish('colocarBarra', seletor)
  }

  SairSistema(){
      localStorage.setItem("ManterConectado", "false");
      localStorage.setItem("Senha", "");
      this.navCtrl.setRoot(LogInPage);
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";

import { URL_BASE, URL_Competencias } from '../../app/app.url';
import { permissoesCompetencias } from '../../models/Permissoes';
import { HomePage } from '../home/home';
import { CustomMethods } from '../../app/GlobalMethods';

import "rxjs/add/operator/map";
import { SelecionarAvaliacaoPage } from './selecionar-avaliacao/selecionar-avaliacao';
import { Colaborador } from '../../models/Colaborador';

@IonicPage()
@Component({
  selector: 'page-competencias',
  templateUrl: 'competencias.html',
})

export class CompetenciasPage {

  permissoes =  {} as permissoesCompetencias;
  Colaborador = new Colaborador;
  IdColaborador = this.Colaborador.id;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private http: Http,
              private CustomMethods:CustomMethods
             ){ 
              this.CustomMethods.exibirLoading();
               this.load(this.IdColaborador) 
              }

  load(IdUsuario){

    this.http.get(URL_BASE + URL_Competencias + "?idColab=" + IdUsuario)
    .map(res => res.json()).subscribe(
    resp => {
      this.CustomMethods.loader.dismiss();

      this.permissoes.temAutoAvaliacao = resp.temAutoAvaliacao;
      this.permissoes.temAvaliacaoLiderados = resp.temAvaliacaoLiderados;
      this.permissoes.temAvaliacaoPares = resp.temAvaliacaoPares;
      this.permissoes.temAvaliacaoConsenso = resp.temAvaliacaoConsenso;
      this.permissoes.temAvaliacaoEquipe = resp.temAvaliacaoEquipe;
      this.permissoes.deveHabilitarResponderAvaliacao = resp.temAvaliacaoEquipe || resp.temAvaliacaoConsenso || resp.temAvaliacaoPares || resp.temAvaliacaoLiderados || resp.temAutoAvaliacao;
      this.permissoes.deveHabilitarResultadosLiderados = resp.deveHabilitarResultadosLiderados;
      this.permissoes.deveHabilitarMeusResultados = resp.deveHabilitarMeusResultados;


    },err=>{
    this.CustomMethods.loader.dismiss();

    this.navCtrl.setRoot(HomePage);
    this.CustomMethods.okAlert("Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente");
    });
  }
  

  onClickResponderQuestionario(titulo) {
    this.navCtrl.push(SelecionarAvaliacaoPage, {tit: titulo});
  }

}

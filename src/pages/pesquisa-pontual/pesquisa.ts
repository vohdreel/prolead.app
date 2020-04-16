import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";

import { URL_BASE, URL_Competencias } from '../../app/app.url';
import { permissoesCompetencias } from '../../models/Permissoes';
import { HomePage } from '../home/home';
import { CustomMethods } from '../../app/GlobalMethods';

import "rxjs/add/operator/map";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ResponderPesquisaPage } from './responder-pesquisa/responder-pesquisa';
import { ListaDePesquisasPage } from './lista-de-pesquisas/lista-de-pesquisas';

@IonicPage()
@Component({
  selector: 'page-pesquisa-pontual',
  templateUrl: 'pesquisa.html',
})

export class PesquisaPontualPage {

  permissoes =  {} as permissoesCompetencias;
  IdColaborador = 0;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private http: Http,
              private CustomMethods:CustomMethods
             ){ 
              //this.CustomMethods.exibirLoading();
               //this.load(this.IdColaborador) 
              }

  load(IdUsuario){

    this.http.get(URL_BASE + URL_Competencias + "?idColab=" + IdUsuario)
    .map(res => res.json()).subscribe(
    resp => {
      this.CustomMethods.loader.dismiss();

    },err=>{
    this.CustomMethods.loader.dismiss();

    this.navCtrl.setRoot(HomePage);
    this.CustomMethods.okAlert("Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente");
    });
  }
  

  onClickResponderQuestionario(titulo) {
  }

  Lista(tipo: string){
    this.navCtrl.push(ListaDePesquisasPage, {type: tipo})



  }

}

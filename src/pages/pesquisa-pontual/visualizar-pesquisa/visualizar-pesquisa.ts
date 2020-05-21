import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CustomMethods } from '../../../app/GlobalMethods';
import { URL_BASE, URL_CarregarPesquisaPontual } from '../../../app/app.url';
import * as $ from 'jquery';




@IonicPage()
@Component({
  selector: 'page-visualizar-pesquisa',
  templateUrl: 'visualizar-pesquisa.html',
})

export class VisualizarPesquisaPage {

  rate: number = 0;
  tipo: number;
  titulo: string;
  loopNumbers: any;

  //PesquisaPontual: any;
  PerguntasFormulario = [];

  success = undefined;

  PesquisaPontual = {
    Id: 0,
    IdPesquisaColaborador: 0,
    Data: "",
    IdFormularioResposta: 0,
    NomePesquisa: "",
    Respostas: []

  };

  RespostaPesquisaPontual: any;

  Aviso = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private CustomMethods: CustomMethods
  ) {

    this.tipo = navParams.get("type");
    this.titulo = this.tipo == 1 ? this.titulo = 'Em Andamento' : 'Histórico'
    this.loopNumbers = Array(5).fill(0).map((x, i) => (i + 1));

    this.PesquisaPontual = navParams.get("pesquisa");

    this.CustomMethods.exibirLoading();

    this.loadPesquisa();

  }

  loadPesquisa() {
    this.http.get(URL_BASE + URL_CarregarPesquisaPontual + "?idPesquisaColaborador=" + this.PesquisaPontual.IdPesquisaColaborador)
      .map(res => res.json()).subscribe(
        resp => {

          console.log(resp)
          this.success = true;
          this.RespostaPesquisaPontual = resp.Result;
          this.CustomMethods.loader.dismiss();
        }, err => {
          this.success = false;
          this.CustomMethods.loader.dismiss();
          //this.CustomMethods.okAlert("Não foi possivel carregar feedback, verifique sua conexão com a internet e tente novamente");

        }
      );
  }


  mudarEstado(e: any) {

    $(".radio-group-ambiente").removeClass("selecionado");
    let _parentDiv = $(e.target).parent().parent();
    _parentDiv.addClass("selecionado");


  }



  onRateChange(event) {
    console.log('Your rate:', event);
    console.log('Binded Value:', this.rate);
  }


  Cancelar() {
    this.navCtrl.pop();
  }

  AbrirPesquisa(tipo: string) { }


}

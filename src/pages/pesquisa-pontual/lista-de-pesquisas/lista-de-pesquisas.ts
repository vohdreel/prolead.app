import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomMethods } from "../../../app/GlobalMethods"
import { Http } from '@angular/http';
import { ResponderPesquisaPage } from '../responder-pesquisa/responder-pesquisa';
import { Colaborador } from '../../../models/Colaborador';
import { URL_BASE, URL_ListarPesquisasPontuais } from '../../../app/app.url';
import { VisualizarPesquisaPage } from '../visualizar-pesquisa/visualizar-pesquisa';

/**
 * Generated class for the ListaDePesquisasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-de-pesquisas',
  templateUrl: 'lista-de-pesquisas.html',
})
export class ListaDePesquisasPage {

  rate: number = 0;
  tipo: number;
  titulo: string;
  loopNumbers: any;

  Colaborador = new Colaborador;
  IdColaborador = this.Colaborador.id;
  PesquisasPontuais = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private CustomMethods: CustomMethods
  ) {

    this.tipo = this.navParams.get('type');
    this.titulo = this.tipo == 1 ? 'Em Andamento' : 'Histórico'
    this.loopNumbers = Array(5).fill(0).map((x, i) => i);

    console.log(this.loopNumbers)
    this.CarregarPesquisasPontuais(this.ParametrosBusca());


  }

  AbrirPesquisa(pesquisa: any) {

    if (this.tipo == 1) {
      this.navCtrl.push(ResponderPesquisaPage, { pesquisa: pesquisa })
    }
    if (this.tipo == 2) {
      this.navCtrl.push(VisualizarPesquisaPage, { pesquisa: pesquisa })
    }
  }



  ParametrosBusca(): string {
    let parametros = "?idColaborador=" + this.IdColaborador;
    if (this.tipo == 1) {
      parametros = parametros.concat("&finalizado=false");
    } else if (this.tipo == 2) {
      parametros = parametros.concat("&finalizado=true");
    } else {
      this.navCtrl.pop();
      this.CustomMethods.okAlert("Página inválida");
    }
    return parametros;
  }

  CarregarPesquisasPontuais(parametros) {
    this.CustomMethods.exibirLoading();
    this.http.get(URL_BASE + URL_ListarPesquisasPontuais + parametros)
      .map(res => res.json()).subscribe(
        resp => {
          console.log(resp)
          this.PesquisasPontuais = resp.result;
          this.CustomMethods.loader.dismiss();

        }, err => {
          console.log(err)
          this.CustomMethods.okAlert("Não foi possivel carregar os feedbacks, verifique sua conexão e tente novamente");
          this.CustomMethods.loader.dismiss();

        }
      );
  }





}


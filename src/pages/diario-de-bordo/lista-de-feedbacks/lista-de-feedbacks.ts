import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { CustomMethods } from '../../../app/GlobalMethods';
import { Colaborador } from '../../../models/Colaborador';
import { URL_BASE, URL_ListarFeedbacks } from '../../../app/app.url';
import { VisualizarFeedbackPage } from '../visualizar-feedback/visualizar-feedback';

@IonicPage()
@Component({
  selector: 'page-lista-de-feedbacks',
  templateUrl: 'lista-de-feedbacks.html',
})
export class ListaDeFeedbacksPage {

  titulo = "";
  contador = 10;
  width = 60

  Feedbacks = [];

  data; Inicio; Fim; semResult = true;

  //Pensar em um modo de puxar esses dados na 
  totalBom = localStorage.getItem('totalAvaliacoesBoa')
  totalMeh = localStorage.getItem('totalAvaliacoesMeh')
  totalRuim = localStorage.getItem('totalAvaliacoesRuim')
  Colaborador = new Colaborador;
  IdColaborador = this.Colaborador.id;
  UtilizaReplica: boolean; UtilizaTreplica: boolean;
  infiniteScroll;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private CustomMethods: CustomMethods
  ) {

    this.data = this.CustomMethods.dataHoje();
    this.Inicio = this.data;
    this.Fim = this.CustomMethods.dataMenosMes(24);

    this.titulo = navParams.get("tit");
    this.Filtrar();
  }




  Filtrar() {
    this.CustomMethods.exibirLoading();
    let parametros = "?idColab=" + this.IdColaborador + "&dataInicio=" + this.Inicio + "&dataFim=" + this.Fim + "&contador=" + this.contador;
    if (this.titulo == "atribuidos") {
      parametros = parametros.concat("&atribuidos=true");
      this.CarregarFeedbacksInicial(parametros);
    } else if (this.titulo == "recebidos") {
      parametros = parametros.concat("&atribuidos=false");
      this.CarregarFeedbacksInicial(parametros);
    } else {
      this.navCtrl.pop();
      this.CustomMethods.okAlert("Página inválida");
    }
  }

  Data(data: string): Date{
    //console.log(new Date(data.replace('/')));
    return new Date(data);
  }

  Filtrar2(): string {
    let parametros = "?idColab=" + this.IdColaborador + "&dataInicio=" + this.Inicio + "&dataFim=" + this.Fim + "&contador=" + this.contador;
    if (this.titulo == "atribuidos") {
      parametros = parametros.concat("&atribuidos=true");
    } else if (this.titulo == "recebidos") {
      parametros = parametros.concat("&atribuidos=false");
    } else {
      this.navCtrl.pop();
      this.CustomMethods.okAlert("Página inválida");
    }
    return parametros;
  }

  async Refresh(refresher) {
    this.contador = 10;
    this.Feedbacks = []
    await this.Filtrar();

    refresher.complete();
  }

  async InfinityLoad(infiniteScroll) {
    infiniteScroll.enable(false);
    this.contador += 10;
    this.infiniteScroll = infiniteScroll
    await this.CarregarFeedbacks(this.Filtrar2());
    infiniteScroll.complete();
  }

  CarregarFeedbacks(parametros) {
    this.http.get(URL_BASE + URL_ListarFeedbacks + parametros)
      .map(res => res.json()).subscribe(
        resp => {
          this.UtilizaReplica = resp.UtilizaReplica;
          this.UtilizaTreplica = resp.UtilizaTreplica;

          if (resp.feedbacks.length == 0) {
            this.infiniteScroll.enable(false);
            this.contador = this.contador - 10
          } else {
            this.Feedbacks = this.Feedbacks.concat(resp.feedbacks);
            
          }

          this.VerificarResultados();
          this.infiniteScroll.enable(true);
        }, err => {
          this.CustomMethods.okAlert("Não foi possivel carregar os feedbacks, verifique sua conexão e tente novamente");
          this.VerificarResultados();
          this.infiniteScroll.enable(true);
          this.contador = this.contador - 10
        }
      );
  }

  CarregarFeedbacksInicial(parametros) {
    this.http.get(URL_BASE + URL_ListarFeedbacks + parametros)
      .map(res => res.json()).subscribe(
        resp => {
          this.UtilizaReplica = resp.UtilizaReplica;
          this.UtilizaTreplica = resp.UtilizaTreplica;
          this.Feedbacks = [];
          if (resp.feedbacks.length == 0) {
            this.contador = this.contador - 10
          } else {
            this.Feedbacks = this.Feedbacks.concat(resp.feedbacks);
            console.log(resp.feedbacks)
           
          }

          this.VerificarResultados();
          this.CustomMethods.loader.dismiss();
        }, err => {
          this.CustomMethods.okAlert("Não foi possivel carregar os feedbacks, verifique sua conexão e tente novamente");
          this.VerificarResultados();
          this.contador = this.contador - 10
          this.CustomMethods.loader.dismiss();
        }
      );
  }

  VerificarResultados() {
    if (this.Feedbacks.length == 0) {
      this.semResult = true;
    } else {
      this.semResult = false;
    }
  }

  abrirFeedback(id: number) {
    this.navCtrl.push(VisualizarFeedbackPage, { tit: 'Visualizar feedback', idFeed: id });
  }

}

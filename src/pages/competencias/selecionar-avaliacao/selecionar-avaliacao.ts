import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ResponderQuestionarioPage } from '../responder/responder-questionario/responder-questionario';
import { URL_ListarAvaliacaoLiderados, URL_BASE, URL_ListarAutoAvaliacao, URL_ListarAvaliacaoPares, URL_ListarMembros } from '../../../app/app.url';
import { Http } from '@angular/http';
import { CustomMethods } from '../../../app/GlobalMethods';
import { Colaborador } from '../../../models/Colaborador';
import 'rxjs/add/operator/map';
import { PreWorkPage } from '../responder/pre-work/pre-work';

@IonicPage()
@Component({
  selector: 'page-selecionar-avaliacao',
  templateUrl: 'selecionar-avaliacao.html',
})
export class SelecionarAvaliacaoPage {

  Avaliacoes = []

  titulo;
  Parametros: string;
  Colaborador = new Colaborador;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public CustomMethods: CustomMethods
  ) {
    this.titulo = navParams.get('tit');
  }

  ResponderAvaliacao(avaliacao) {
    if (avaliacao.TemPreWork){
      this.navCtrl.push(PreWorkPage, { tit: 'Pré Work', periodo: avaliacao.IdAvaliacao, prework: avaliacao.IdPreWork, tituloAvaliacao: this.titulo });
    }else{
      this.navCtrl.push(ResponderQuestionarioPage, { tit: this.titulo, periodo: avaliacao.IdAvaliacao });
    }
  }

  ionViewWillEnter() {
    this.CustomMethods.exibirLoading();
    if (this.titulo == "Avaliação dos Liderados") {
      this.Parametros = URL_ListarAvaliacaoLiderados + "?idColab=" + this.Colaborador.id;
    } else if (this.titulo == "Auto Avaliação") {
      this.Parametros = URL_ListarAutoAvaliacao + "?idColab=" + this.Colaborador.id;
    } else if (this.titulo == "Avaliação de Pares") {
      this.Parametros = URL_ListarAvaliacaoPares + "?idColab=" + this.Colaborador.id;
    } else if (this.titulo == "Avaliação de Lider") {
      this.Parametros = URL_ListarMembros + "?idColab=" + this.Colaborador.id;
    }
    this.http.get(URL_BASE + this.Parametros)
      .map(res => res.json()).subscribe(
        resp => {
          this.Avaliacoes = resp.liderados;
          this.CustomMethods.loader.dismiss();
        }, err => {
          this.navCtrl.pop();
          this.CustomMethods.okAlert("Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente");
          this.CustomMethods.loader.dismiss();
        }
      );
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LancarFeedbackPage } from './lancar-feedback/lancar-feedback';
import { VisualizarFeedbackPage } from './visualizar-feedback/visualizar-feedback';
import { Http } from '@angular/http';
import { CustomMethods } from '../../app/GlobalMethods';
import { permissoesFeedback } from '../../models/Permissoes';
import { URL_BASE, URL_FeedBack } from '../../app/app.url';
import { HomePage } from '../home/home';

import 'rxjs/add/operator/map'
import { Colaborador } from '../../models/Colaborador';
import { NovoFeedbackPage } from './novo-feedback/novo-feedback';
import { ListaDeFeedbacksPage } from './lista-de-feedbacks/lista-de-feedbacks';

@IonicPage()
@Component({
  selector: 'page-diario-de-bordo',
  templateUrl: 'diario-de-bordo.html',
})
export class DiarioDeBordoPage {

  permissoes =  {} as permissoesFeedback;
  Colaborador = new Colaborador;
  IdColaborador = this.Colaborador.id;

  
  totalRecebidas = 0;
  totalAtribuidos = 0;
  totalAvaliacoesBoa = 0;
  totalAvaliacoesMeh = 0;
  totalAvaliacoesRuim = 0;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private http: Http,
    private CustomMethods:CustomMethods
   ) {
    this.CustomMethods.exibirLoading();
    this.load(this.IdColaborador) 
  }

  load(IdUsuario){
    this.http.get(URL_BASE + URL_FeedBack + "?idColab=" + IdUsuario)
    .map(res => res.json()).subscribe(
    resp => {
      this.CustomMethods.loader.dismiss();

      this.permissoes.podeAtribuirAutoFeedback = resp.podeAtribuirAutoFeedback;
      this.permissoes.podeAtribuirFeedbackColaborador = resp.podeAtribuirFeedbackColaborador;
      this.permissoes.podeAtribuirFeedbackLiderado = resp.podeAtribuirFeedbackLiderado;
      this.permissoes.podeAtribuirFeedbackLider = resp.podeAtribuirFeedbackLider;

      this.permissoes.podeVisualizarAutoFeedbackLiderado = resp.podeVisualizarAutoFeedbackLiderado;
      this.permissoes.podeVisualizarFeedbackColaborador = resp.podeVisualizarFeedbackColaborador;
      this.permissoes.podeVisualizarFeedbackLider = resp.podeVisualizarFeedbackLider;
      this.permissoes.PodeLideradoVisualizarFeedbackColpaborador = resp.PodeLideradoVisualizarFeedbackColpaborador;

      this.permissoes.podeAtribuir = resp.podeAtribuir;
      this.permissoes.podeVisualizar = resp.podeVisualizar;

      this.totalRecebidas = resp.totalRecebidas;
      this.totalAtribuidos = resp.totalAtribuidos;
      this.totalAvaliacoesBoa = resp.totalAvaliacoesBoa;
      this.totalAvaliacoesMeh = resp.totalAvaliacoesMeh;
      this.totalAvaliacoesRuim = resp.totalAvaliacoesRuim;

      localStorage.setItem('totalAvaliacoesBoa',resp.totalAvaliacoesBoa)
      localStorage.setItem('totalAvaliacoesMeh',resp.totalAvaliacoesMeh)
      localStorage.setItem('totalAvaliacoesRuim',resp.totalAvaliacoesRuim)



    },err=>{
    this.CustomMethods.loader.dismiss();

    this.navCtrl.setRoot(HomePage);
    this.CustomMethods.okAlert("Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente");
    });
  }

  Lancar(titulo) {
    this.navCtrl.push(LancarFeedbackPage, {tit: titulo});
  }

  Lista(titulo){
    this.navCtrl.push(ListaDeFeedbacksPage, {tit: titulo});
  }

  Novo() {
    this.navCtrl.push(NovoFeedbackPage, {perm: this.permissoes});
  }

  Visualizar(titulo) {
    this.navCtrl.push(VisualizarFeedbackPage, {tit: titulo});
  }

}

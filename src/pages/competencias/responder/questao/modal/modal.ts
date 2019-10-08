import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomMethods } from '../../../../../app/GlobalMethods';
import { Http } from '@angular/http';
import { URL_BASE, URL_AutoFeedBack } from '../../../../../app/app.url';
import { Colaborador } from '../../../../../models/Colaborador';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {


  Feedbacks = [];
  data; Inicio; Fim; IdUsuario; IdCompetencia; semResult;
  RespostasComboBox = [{Id: 0, IdAlternativa: 0}];
  UtilizaReplica: boolean; UtilizaTreplica:boolean;
  Colaborador = new Colaborador;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private http: Http,
    private CustomMethods:CustomMethods
    ) {
    this.IdUsuario = navParams.get("idColab");    
    this.IdCompetencia = navParams.get("idComp");

    this.data = this.CustomMethods.dataHoje();
    this.Inicio = this.data;
    this.Fim = this.CustomMethods.dataMenosMes(12);

    this.loadAutoFeedback(this.IdUsuario, this.Inicio, this.Fim)
  }

  tratatamentoComboBox(){
    this.RespostasComboBox = []
    // Percorre o array procurando duplicatas (respostas do combo box)
    this.Feedbacks.forEach(o => {
      o.FeedBack.forEach((b, i) => { 
        let filtrado =  o.FeedBack.filter(x => x.IdPerguntaFormulario == b.IdPerguntaFormulario)
        if (filtrado.length > 1){
          //Passa pelos elementos filtraodos
          let cont = 0;
          filtrado.forEach((a) => {
            cont++;
            if (cont > 1)
            {
              //Declara um protótipo
              let RespostaComboBox = {Id: 0, IdAlternativa: 0};
              //Preenche o protótipo
              RespostaComboBox.Id = a.Id
              RespostaComboBox.IdAlternativa = a.IdAlternativaPerguntaFormulario
              //Junta o protótipo com a variavel global que será usada para checkar as combo box
              this.RespostasComboBox.push(RespostaComboBox);    
              o.FeedBack.splice((o.FeedBack.findIndex(x => x.Id == a.Id)), 1)
            }
          });
        }
      });
    });
  }
  verificarChecked(IdCorreto:any, IdAlternativa:number):boolean{
    let checked = false;
    //Verifica se existe a resposta no array de respostas repetidas
    if (IdCorreto == IdAlternativa){
      checked = true;
      return checked;
    }

      this.RespostasComboBox.forEach(e => {
        if (e.IdAlternativa == IdAlternativa){
          checked = true;
        }
      });

    return checked;
  }

  

  VerificarResultados(){
    if (this.Feedbacks.length == 0){
      this.semResult = true;
    }else{
      this.semResult = false;
    }
  }

  loadAutoFeedback(IdUsuario, inicio, fim){
    let parametros = "?idColab=" + IdUsuario + "&dataAtual=" + inicio + "&inicioPeriodo=" + fim + "&IdComp=" + this.IdCompetencia;
    this.http.get(URL_BASE + URL_AutoFeedBack + parametros)
    .map(res => res.json()).subscribe(
      resp => {
        this.Feedbacks = resp.feedbacks;  
        this.UtilizaReplica = resp.UtilizaReplica;
        this.UtilizaTreplica = resp.UtilizaTreplica;
        this.CustomMethods.loader.dismiss();
        this.tratatamentoComboBox();       
        this.VerificarResultados();      
        this.CustomMethods.loader.dismiss();      
      }, err=> {
        this.CustomMethods.loader.dismiss();
        this.navCtrl.pop();
        this.CustomMethods.okAlert("Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente");
      }
    );
  }

}

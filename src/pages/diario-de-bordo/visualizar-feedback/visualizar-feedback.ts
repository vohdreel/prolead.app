import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomMethods } from '../../../app/GlobalMethods';
import { URL_BASE, URL_SalvarReplicaFeedback, URL_SalvarTreplicaFeedback, URL_CarregarFeedback } from '../../../app/app.url';
import { Http } from '@angular/http';
import { DiarioDeBordoPage } from '../diario-de-bordo';
import 'rxjs/add/operator/map'
import { Colaborador } from '../../../models/Colaborador';

@IonicPage()
@Component({
  selector: 'page-visualizar-feedback',
  templateUrl: 'visualizar-feedback.html',
})
export class VisualizarFeedbackPage {

  feedback = {
    CompetenciaAvaliada: "",
    FotoAvaliador: "",
    FotoAvaliado: "",
    NomeAvaliador: "",
    NomeAvaliado: "",
    Data: "",
    IdCompetenciaAvaliada: 0,
    IdAvaliador: 0,
    IdAvaliado: 0,
    DataLido: "",
    Id: 0,
    FeedBack: []
  };
  RespostasComboBox = [{ Id: 0, IdAlternativa: 0 }];
  avaliacao: any;
  observacao: any;

  stringTipoResposta: string;
  PodeResponder: boolean;

  titulo; data; Inicio; Fim; semResult = true;
  Colaborador = new Colaborador;
  IdColaborador = this.Colaborador.id;
  UtilizaReplica: boolean; UtilizaTreplica: boolean;
  contador = 5;
  infiniteScroll;
  idFeedback = 0;
  ultimaQuestao = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private CustomMethods: CustomMethods
  ) {
    this.titulo = navParams.get('tit');
    this.idFeedback = navParams.get('idFeed');

    this.data = this.CustomMethods.dataHoje();
    this.Inicio = this.data;
    this.Fim = this.CustomMethods.dataMenosMes(1);

    this.loadFeedback();
  }

  getIconeResultadoAvaliacao(valor: number): string {
    switch (valor) {
      case 1:
        return "custom-prolead-positive"
      case 2:
        return "custom-prolead-neutral"
      case 3:
        return "custom-prolead-negative"
    }
  }


  habilitarResposta() {
    if (this.feedback.IdAvaliador == this.feedback.IdAvaliado) {
      this.PodeResponder = false
      return;
    }

    //se eu sou um cara que espera por uma replica
    if (this.observacao.Replica == null && this.UtilizaReplica && (this.IdColaborador == this.feedback.IdAvaliado)) {
      this.stringTipoResposta = 'replica';
      this.PodeResponder = true;
      return;
    }

    if (this.observacao.Replica != null && this.observacao.Treplica == null && this.UtilizaTreplica && (this.IdColaborador == this.feedback.IdAvaliador)) {
      this.PodeResponder = true
      this.stringTipoResposta = 'treplica';
      return;
    }


  }

  getIconeColor(value: number): string {
    switch (value) {
      case 1:
        return 'boa-avaliacao'
      case 2:
        return 'meh-avaliacao'
      case 3:
        return 'ruim-avaliacao'
    }
  }

  tratatamentoComboBox() {
    this.RespostasComboBox = []
    // Percorre o array procurando duplicatas (respostas do combo box)
    this.feedback.FeedBack.forEach((b, i) => {
      let filtrado = this.feedback.FeedBack.filter(x => x.IdPerguntaFormulario == b.IdPerguntaFormulario)
      if (filtrado.length > 1) {
        //Passa pelos elementos filtraodos
        let cont = 0;
        filtrado.forEach((a) => {
          cont++;
          if (cont > 1) {
            //Declara um protótipo
            let RespostaComboBox = { Id: 0, IdAlternativa: 0 };
            //Preenche o protótipo
            RespostaComboBox.Id = a.Id
            RespostaComboBox.IdAlternativa = a.IdAlternativaPerguntaFormulario
            //Junta o protótipo com a variavel global que será usada para checkar as combo box
            this.RespostasComboBox.push(RespostaComboBox);
            this.feedback.FeedBack.splice((b.findIndex(x => x.Id == a.Id)), 1)
          }
        });
      }
    });
  }
  verificarChecked(IdCorreto: any, IdAlternativa: number): boolean {
    let checked = false;
    //Verifica se existe a resposta no array de respostas repetidas
    if (IdCorreto == IdAlternativa) {
      checked = true;
      return checked;
    }

    this.RespostasComboBox.forEach(e => {
      if (e.IdAlternativa == IdAlternativa) {
        checked = true;
      }
    });

    return checked;
  }


  loadFeedback() {
    this.CustomMethods.exibirLoading();
    this.http.get(URL_BASE + URL_CarregarFeedback + "?idFeedback=" + this.idFeedback + "&idColab=" + this.Colaborador.id)
      .map(res => res.json()).subscribe(
        resp => {
          this.feedback = resp.Avaliacao;
          this.UtilizaReplica = resp.UtilizaReplica;
          this.UtilizaTreplica = resp.UtilizaTreplica;
          this.tratatamentoComboBox();
          this.ultimaQuestao = this.feedback.FeedBack[this.feedback.FeedBack.length - 1];
          
          this.avaliacao = Object.assign({}, this.feedback.FeedBack[0]); console.log(this.avaliacao);
          this.observacao = Object.assign({}, this.feedback.FeedBack[1]); console.log(this.observacao);

          this.habilitarResposta();
          this.CustomMethods.loader.dismissAll();


        }, err => {
          this.CustomMethods.loader.dismissAll();
          this.CustomMethods.okAlert("Não foi possivel carregar feedback, verifique sua conexão com a internet e tente novamente");
        }
      );
  }


  mostrarCompetencia() {
    this.CustomMethods.AlertWithText('Competência:',this.feedback.CompetenciaAvaliada);
  }


  SalvarReplica(questao, id) {
    this.CustomMethods.exibirLoading();

    if (questao.Replica != null) {

      this.http.get(URL_BASE + URL_SalvarReplicaFeedback + "?replica=" + questao.Replica + "&id=" + questao.Id + "&idQuestao=" + id + "&idColab=" + this.Colaborador.id)
        .map(res => res.json()).subscribe(
          resp => {
            this.CustomMethods.loader.dismiss();
            if (resp.sucesso) {
              this.CustomMethods.okAlert("Réplica enviada com sucesso");
              this.loadFeedback();
              this.PodeResponder = false;
            } else {
              this.CustomMethods.okAlert("Não foi possivel enviar réplica, verifique sua conexão com a internet e tente novamente");
            }
          }, err => {
            this.CustomMethods.loader.dismiss();
            this.CustomMethods.okAlert("Não foi possivel enviar réplica, verifique sua conexão com a internet e tente novamente");
          }
        );

    } else {
      this.CustomMethods.loader.dismiss();
      this.CustomMethods.okAlert("Preencha a Réplica antes de enviar");
    }

  }

  SalvarTreplica(questao, id) {
    this.CustomMethods.exibirLoading();

    if (questao.Replica != null) {

      this.http.get(URL_BASE + URL_SalvarTreplicaFeedback + "?replica=" + questao.Treplica + "&id=" + questao.Id + "&idQuestao=" + id + "&idColab=" + this.Colaborador.id)
        .map(res => res.json()).subscribe(
          resp => {
            this.CustomMethods.loader.dismiss();
            if (resp.sucesso) {
              this.CustomMethods.okAlert("Tréplica enviada com sucesso");
              this.loadFeedback();
              this.PodeResponder = false;
            } else {
              this.CustomMethods.okAlert("Não foi possivel enviar tréplica, verifique sua conexão com a internet e tente novamente");
            }
          }, err => {
            this.CustomMethods.loader.dismiss();
            this.CustomMethods.okAlert("Não foi possivel enviar tréplica, verifique sua conexão com a internet e tente novamente");
          }
        );

    } else {
      this.CustomMethods.loader.dismiss();
      this.CustomMethods.okAlert("Preencha a Tréplica antes de enviar");
    }

  }

}

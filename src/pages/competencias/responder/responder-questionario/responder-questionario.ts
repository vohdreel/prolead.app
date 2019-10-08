import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { QuestaoPage } from '../questao/questao';
import { CustomMethods } from '../../../../app/GlobalMethods';
import { Http } from '@angular/http';
import { Colaborador } from '../../../../models/Colaborador';
import { URL_BASE, URL_ListarRespostasAvaliacao, URL_ConcluirQuestionario, URL_SalvarResposta } from '../../../../app/app.url';
import 'rxjs/add/operator/map';
import { InfoColaborador } from '../../../../models/Permissoes';

@IonicPage()
@Component({
  selector: 'page-responder-questionario',
  templateUrl: 'responder-questionario.html',
})
export class ResponderQuestionarioPage {

  Questoes: any[];
  TiposCompetencia: any[];

  Colaborador = new Colaborador;

  titulo;
  IdAvaliacaoParcial;
  Status;
  idAvaliacao;
  control: boolean = false;
  confirmar: boolean = false;
  avaliado = {} as InfoColaborador;
  consideracoes: string = "";
  UtilizaFormulario: boolean;
  isAgrupamento: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public CustomMethods: CustomMethods,
  ) {
    this.titulo = navParams.get('tit');
    this.IdAvaliacaoParcial = navParams.get('periodo');
  }

  onResponderPergunta(Questao) {
    if (Questao.NomeAgrupamento == null) {
      let Parametro = "?idAvaliacaoParcial=" + this.IdAvaliacaoParcial;
      this.navCtrl.push(QuestaoPage, { Id: Questao.IdQuestao, idAvaliacao: Parametro })
    } else {
      if (this.Status == 1) {
      if (Questao.Observacao == null) {
        Questao.Observacao = "";
      };      
      this.CustomMethods.exibirLoading();
      let ParametrosQuestao: string = "?idAvaliacaoParcial=" + this.IdAvaliacaoParcial + "&idCompetencia=" + Questao.IdQuestao + "&idNota=" + Questao.IdAgrupamento + "&observacao=" + Questao.Observacao + "&utilizaFormulario=" + this.UtilizaFormulario;
      this.http.get(URL_BASE + URL_SalvarResposta + ParametrosQuestao).map(res => res.json()).subscribe(
        resp => {
          if (resp.Sucesso){
            this.Questoes.forEach(Quest => {
              Quest.forEach(Alternativa => {
                if (Questao.Competencia == Alternativa.Competencia){
                  if(Alternativa.IdNota != null){
                    Alternativa.IdNota = null;
                  }
                }
              });
            });
            Questao.IdNota = Questao.IdAgrupamento;
            this.colocarBarraLateral(Questao.Competencia);
            this.CustomMethods.loader.dismiss();
            this.verificarCompletude();
          }else{
            this.CustomMethods.loader.dismiss();
            this.CustomMethods.okAlert("Falha ao salvar questão.");
          }
        },
        err => {
          this.CustomMethods.loader.dismiss();
          this.CustomMethods.okAlert("Não foi possivel salvar resposta, verifique sua conexão com a internet e tente novamente.");
        }
      );
      }
    }
  }

  colocarBarraLateral(idCompetencia){
    this.TiposCompetencia.find(x => x.Id == idCompetencia).Class = "respondido";
  }

  async verificarCompletude(){
    let ContadorCompetencias: number = 0;
    let ContadorAlternativa: number = 0;

    await this.Questoes.forEach(Quest => {
      ContadorCompetencias++
      Quest.forEach(Alternativa => {
          if(Alternativa.IdNota != null){
            ContadorAlternativa++;
          }
      });
    });

    if (ContadorCompetencias == ContadorAlternativa){
      this.control = false;
    }

  }

  ionViewWillEnter() {
    this.CustomMethods.exibirLoading();
    this.http.get(URL_BASE + URL_ListarRespostasAvaliacao + "?idAvaliacaoParcial=" + this.IdAvaliacaoParcial)
      .map(res => res.json()).subscribe(
        resp => {
          this.Questoes = resp.Questoes;
          this.TiposCompetencia = resp.TiposCompetencia;
          this.Status = resp.Status;
          this.idAvaliacao = resp.idAvaliacao;
          this.avaliado = resp.Colaborador;
          this.control = false;
          this.UtilizaFormulario = resp.utilizaFormulario
          this.isAgrupamento = resp.isAgrupamento
          this.Questoes.forEach(a => {
            a.forEach(b => {
              if (b.IdNota == null && !this.isAgrupamento) {
                this.control = true;              
              }
              if (this.isAgrupamento && b.IdNota != null){
                this.colocarBarraLateral(b.Competencia)
              }
            });
          });
          this.verificarCompletude();

          this.CustomMethods.loader.dismiss();
        }, err => {
          this.navCtrl.pop();
          this.CustomMethods.okAlert("Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente");
          this.CustomMethods.loader.dismiss();
        }
      );
  }

  Sair() {
    this.navCtrl.pop();
  }

  Voltar() {
    this.confirmar = false;
  }

  Concluir() {
    if (this.Status == 1) {
      if (this.confirmar) {
        if (this.consideracoes == null) {
          this.consideracoes = "";
        };
        this.CustomMethods.exibirLoading();

        this.http.get(URL_BASE + URL_ConcluirQuestionario + "?idAvaliacaoParcial=" + this.IdAvaliacaoParcial + "&consideracoesFinais=" + this.consideracoes + "&idColab=" + this.Colaborador.id)
          .map(res => res.json()).subscribe(
            resp => {
              if (!resp.Sucesso) {
                this.CustomMethods.okAlert("Falha ao concluir questionário!");
                this.CustomMethods.loader.dismiss();
              } else {
                this.CustomMethods.okAlert("Avaliação concluida com sucesso");
                this.CustomMethods.loader.dismiss();
                this.navCtrl.pop()
              }
            }, err => {
              this.CustomMethods.okAlert("Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente");
              this.CustomMethods.loader.dismiss();
            }
          );
      } else {
        this.confirmar = true;
      }
    } else {
      this.navCtrl.pop();
    }
  }

  PreencherTexto(texto: string, id: string) {
    var elemento = document.getElementById(id);
    elemento.innerHTML = texto;
  }


}

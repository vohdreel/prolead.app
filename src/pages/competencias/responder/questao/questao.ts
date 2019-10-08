import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

import { ModalPage } from "./modal/modal";
import "rxjs/add/operator/map";
import { CustomMethods } from "../../../../app/GlobalMethods";
import { Http } from "@angular/http";
import { URL_BASE, URL_ListarRespostasAvaliacao, URL_SalvarResposta } from "../../../../app/app.url";
import { Questao } from "../../../../models/Permissoes";
import { Colaborador } from "../../../../models/Colaborador";

@IonicPage()
@Component({
  selector: "page-questao",
  templateUrl: "questao.html"
})
export class QuestaoPage {
  Colaborador = new Colaborador;
  Questoes: any[];
  Notas: any[];
  UsaAvaliacaoDiaria: boolean;
  TiposCompetencia: any[];

  Id: number;
  CompetenciaAtual: string;
  IdCompetenciaAtual: number;
  IdColaboradorAvaliado: number;
  Questao = {} as Questao;
  Status: number;
  QuestaoAgora: number;
  totalQuestoes: number = 0;
  IdAvaliacaoParcial: number;
  UtilizaFormulario: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public CustomMethods: CustomMethods
  ) {
    this.Id = navParams.get("Id");
    this.IdAvaliacaoParcial = navParams.get("idAvaliacao");
    this.CustomMethods.exibirLoading();
    this.CarregarQuestoes();
  }

  ChecarCompetencia() {
    this.Questoes.forEach(a => {
      a.forEach(b => {
        if (b.IdQuestao == this.Id) {
          this.CompetenciaAtual = b.Competencia;
          this.Questao = b;
          this.QuestaoAgora = b.IdControle;
          this.IdColaboradorAvaliado = b.ColaboradorAvaliado
        }
      });
    });

    this.TiposCompetencia.forEach(a => {
      if (this.CompetenciaAtual == a.Id) {
        this.CompetenciaAtual = a.Nome;
        this.IdCompetenciaAtual = a.Id;
      }
    });
  }

  AlterarQuestao() {
    this.Questoes.forEach(a => {
      a.forEach(b => {
        if (b.IdControle == this.QuestaoAgora) {
          this.CompetenciaAtual = b.Competencia;
          this.Questao = b;
        }
      });
    });

    this.TiposCompetencia.forEach(a => {
      if (this.CompetenciaAtual == a.Id) {
        this.CompetenciaAtual = a.Nome;
        this.IdCompetenciaAtual = a.Id;
      }
    });
  }

  AtribuirControle() {

    this.TiposCompetencia.forEach(x => {
      this.Questoes.forEach(a => {
        a.forEach(b => {
          if (x.Id == b.Competencia) {
            b.IdControle = this.totalQuestoes;
            this.totalQuestoes++;
          }
        });
      });
    });
    this.totalQuestoes--;
  }

  CarregarQuestoes() {
    this.http.get(URL_BASE + URL_ListarRespostasAvaliacao + this.IdAvaliacaoParcial)
      .map(res => res.json()).subscribe(
        resp => {
          this.Questoes = resp.Questoes;
          this.Notas = resp.Notas;
          this.TiposCompetencia = resp.TiposCompetencia;
          this.UsaAvaliacaoDiaria = resp.UsaAvaliacaoDiaria;
          this.Status = resp.Status
          this.UtilizaFormulario = resp.utilizaFormulario
          this.AtribuirControle();
          this.ChecarCompetencia();
          this.CustomMethods.loader.dismiss();
        },
        err => {
          this.navCtrl.pop();
          this.CustomMethods.okAlert(
            "Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente"
          );
          this.CustomMethods.loader.dismiss();
        }
      );
  }

  SalvarAlteracao(btn: number) {
    if (this.Status == 1 ) {
      if (this.Questao.IdNota != null) {
        this.CustomMethods.exibirLoading();
        if (this.Questao.Observacao == null) {
          this.Questao.Observacao = "";
        };
        let ParametrosQuestao: string = "&idCompetencia=" + this.Questao.IdQuestao + "&idNota=" + this.Questao.IdNota + "&observacao=" + this.Questao.Observacao + "&utilizaFormulario=" + this.UtilizaFormulario;
        this.http.get(URL_BASE + URL_SalvarResposta + this.IdAvaliacaoParcial + ParametrosQuestao).map(res => res.json()).subscribe(
          resp => {
            if (resp.Sucesso){
            this.CustomMethods.loader.dismiss();

            switch (btn) {
              case 1: this.ProximaPergunta(); break;
              case 2: this.PerguntaAnterior(); break;
              case 3: this.Finalizar(); break;
            }
          }
          else
          {
            this.CustomMethods.loader.dismiss();
            this.CustomMethods.okAlert("Falha ao salvar questão.");            
          }
        },
          err => {
            this.CustomMethods.loader.dismiss();
            this.CustomMethods.okAlert("Não foi possivel salvar resposta, verifique sua conexão com a internet e tente novamente.");
          }
        );
      } else {
        this.CustomMethods.okAlert("Responda a pergunta antes de prosseguir");
      }
    } else {
      switch (btn) {
        case 1: this.ProximaPergunta(); break;
        case 2: this.PerguntaAnterior(); break;
        case 3: this.Finalizar(); break;
      }
    }

  }

  FeedBacks() {
    this.navCtrl.push(ModalPage, {idComp: this.IdCompetenciaAtual, idColab: this.IdColaboradorAvaliado});
  }

  ProximaPergunta() {
    this.QuestaoAgora++;
    this.AlterarQuestao();
  }

  PerguntaAnterior() {
    this.QuestaoAgora--;
    this.AlterarQuestao();
  }

  Finalizar() {
    this.navCtrl.pop();
  }

  PreencherTexto(id: number, texto:string){
    if (id){
      var elemento = document.getElementById(""+id);
      elemento.innerHTML = texto;
    }
  }
}

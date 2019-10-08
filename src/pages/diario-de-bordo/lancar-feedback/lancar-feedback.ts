import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CustomMethods } from "../../../app/GlobalMethods";
import {
  URL_BASE,
  URL_ResponderAvaliacao,
  URL_SalvarFeedback,
  URL_GetColaborador
} from "../../../app/app.url";
import { Http, Headers, RequestOptions } from "@angular/http";
import { Colaborador } from "../../../models/Colaborador";
import { DiarioDeBordoPage } from "../diario-de-bordo";
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: "page-lancar-feedback",
  templateUrl: "lancar-feedback.html"
})
export class LancarFeedbackPage {
  colaboradores = [];
  perguntas = [];
  competencias = [];

  titulo = "";
  data;
  colaborador = new Colaborador();
  avaliado;
  input = "";
  CompetenciaAvaliada;
  Aviso = false;
  fotoColab = "";
  depColab = "";
  nomeColab = "";
  mostrar: Boolean = true;
  valorAvaliacao: number;

  RespostaPerguntaFormulario = {
    AlternativaDaPerguntaFormulario: [],
    TipoPergunta: 0,
    IdPerguntaFormulario: 0,
    IdAlternativaPerguntaFormulario: 0,
    ValorTexto: "",
    ValorInteiro: 0
  };

  FormularioResposta = {
    IdFormulario: 0,
    RespostaPerguntaFormulario: [this.RespostaPerguntaFormulario]
  };

  Formulario = {
    IdColaboradorAvaliador: 0,
    IdColaboradorAvaliado: 0,
    Data: Date,
    IdFormularioResposta: 0,
    IdCompetencia: 0,
    FormularioResposta: this.FormularioResposta
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private CustomMethods: CustomMethods
  ) {
    this.titulo = navParams.get("tit");
    this.avaliado = navParams.get("idColab");
    this.CustomMethods.exibirLoading();
    this.data = this.CustomMethods.dataHoje();
    this.loadAvaliado();
    this.CarregarFormulario();
  }

  loadAvaliado() {
    this.http
      .get(
        URL_BASE + URL_GetColaborador + "?idColab=" + this.avaliado
      )
      .map(res => res.json())
      .subscribe(
        resp => {
          this.nomeColab = resp.nome;
          this.fotoColab = resp.foto;
          this.depColab = resp.departamento;
        },
        err => {
        }
      );
  }

 

  CarregarFormulario() {
    this.http
      .get(
        URL_BASE + URL_ResponderAvaliacao + "?idColab=" + this.colaborador.id
      )
      .map(res => res.json())
      .subscribe(
        resp => {
          this.perguntas = resp.Perguntas;
          this.competencias = resp.Competencias;
          this.CustomMethods.loader.dismiss();
        },
        err => {
          this.CustomMethods.loader.dismiss();
          this.CustomMethods.okAlert(
            "Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente"
          );
          this.navCtrl.pop();
        }
      );
  }

  Cancelar() {
    this.navCtrl.pop();
  }

  mudarEstado(e: any) {

    $("#respRuim,#respMeh,#respBom").removeClass("selecionado");
    
    switch (e.target.value) {
      case '1': {
        $("#respRuim").addClass("selecionado");
        break;
      }
      case '2': {
        $("#respMeh").addClass("selecionado");
        break;
      }
      case '3': {
        $("#respBom").addClass("selecionado");
      }
        break;
    }

  }

  Mapper() {
    this.CustomMethods.exibirLoading();
    this.Aviso = false;
    this.Formulario.IdColaboradorAvaliador = +this.colaborador.id;
    this.Formulario.IdColaboradorAvaliado = +this.avaliado;
    this.Formulario.Data = this.data;
    this.Formulario.IdFormularioResposta = +this.perguntas[0].IdFormulario;
    this.Formulario.IdCompetencia = +this.CompetenciaAvaliada;
    this.FormularioResposta.IdFormulario = +this.perguntas[0].IdFormulario;
    this.FormularioResposta.RespostaPerguntaFormulario = this.MapRespostas();

    if (!this.Formulario.IdCompetencia) {
      this.Aviso = true;
    }

    if (this.Aviso) {
      this.CustomMethods.okAlert(
        "Por favor preencha todos os dados antes de enviar"
      );
      this.CustomMethods.loader.dismiss();
    } else {
      this.EnviarRespostas();
    }
  }

  MapRespostas() {
    let resposta = this.RespostaPerguntaFormulario;
    let respostas = [];
    for (let i = 0; i < this.perguntas.length; i++) {
      if (this.perguntas[i].TipoPergunta == 4) {
        let obrigatorio = false;
        if (this.perguntas[i].Obrigatoria) {
          obrigatorio = true;
        }
        for (
          let j = 0;
          j < this.perguntas[i].AlternativaDaPerguntaFormulario.length;
          j++
        ) {
          if (
            this.perguntas[i].AlternativaDaPerguntaFormulario[j].ValorInteiro ==
            1
          ) {
            resposta = {
              AlternativaDaPerguntaFormulario: this.perguntas[i]
                .AlternativaDaPerguntaFormulario[j],
              IdAlternativaPerguntaFormulario: +this.perguntas[i]
                .AlternativaDaPerguntaFormulario[j].Id,
              IdPerguntaFormulario: +this.perguntas[i].Id,
              ValorTexto: this.perguntas[i].ValorTexto,
              TipoPergunta: this.perguntas[i].TipoPergunta,
              ValorInteiro: 0
            };
            respostas = respostas.concat(resposta);
            obrigatorio = false;
          }
        }
        if (obrigatorio) {
          this.Aviso = true;
        }
      } else if (this.perguntas[i].TipoPergunta == 3) {
        let obrigatorio = false;
        if (this.perguntas[i].Obrigatoria) {
          obrigatorio = true;
        }
        for (
          let j = 0;
          j < this.perguntas[i].AlternativaDaPerguntaFormulario.length;
          j++
        ) {
          if (
            this.perguntas[i].AlternativaDaPerguntaFormulario[j].Id ==
            +this.perguntas[i].IdAlternativaPerguntaFormulario
          ) {
            resposta = {
              AlternativaDaPerguntaFormulario: this.perguntas[i]
                .AlternativaDaPerguntaFormulario[j],
              IdAlternativaPerguntaFormulario: +this.perguntas[i]
                .AlternativaDaPerguntaFormulario[j].Id,
              IdPerguntaFormulario: +this.perguntas[i].Id,
              ValorTexto: this.perguntas[i].ValorTexto,
              TipoPergunta: this.perguntas[i].TipoPergunta,
              ValorInteiro: 0
            };
            respostas = respostas.concat(resposta);
            obrigatorio = false;
          }
        }
        if (obrigatorio && !this.perguntas[i].IdAlternativaPerguntaFormulario) {
          this.Aviso = true;
        }
      } else if (this.perguntas[i].TipoPergunta == 7) {
        resposta = {
          AlternativaDaPerguntaFormulario: this.perguntas[i]
            .AlternativaDaPerguntaFormulario,
          IdAlternativaPerguntaFormulario: +this.perguntas[i]
            .IdAlternativaPerguntaFormulario,
          IdPerguntaFormulario: +this.perguntas[i].Id,
          ValorTexto: this.perguntas[i].ValorTexto,
          TipoPergunta: this.perguntas[i].TipoPergunta,
          ValorInteiro: this.perguntas[i].ValorInteiro
        };

        respostas = respostas.concat(resposta);

        if (resposta.ValorInteiro == 0 && this.perguntas[i].Obrigatoria) {
          this.Aviso = true;
        }
      } else {
        resposta = {
          AlternativaDaPerguntaFormulario: this.perguntas[i]
            .AlternativaDaPerguntaFormulario,
          IdAlternativaPerguntaFormulario: +this.perguntas[i]
            .IdAlternativaPerguntaFormulario,
          IdPerguntaFormulario: +this.perguntas[i].Id,
          ValorTexto: this.perguntas[i].ValorTexto,
          TipoPergunta: this.perguntas[i].TipoPergunta,
          ValorInteiro: 0
        };

        respostas = respostas.concat(resposta);

        if (
          !resposta.ValorTexto &&
          !resposta.IdAlternativaPerguntaFormulario &&
          this.perguntas[i].Obrigatoria
        ) {
          this.Aviso = true;
        }
      }
    }
    return respostas;
  }

  EnviarRespostas() {
    let headers = new Headers({
      "Content-Type": "application/json; charset=utf-8"
    });
    let options = new RequestOptions({ headers: headers });
    let strData = JSON.stringify({ model: this.Formulario });

    this.http
      .post(URL_BASE + URL_SalvarFeedback, strData, options)
      .map(res => res.json())
      .subscribe(
        resp => {
          if (!resp.Ok) {
            this.CustomMethods.okAlert(
              "Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente"
            );
            this.CustomMethods.loader.dismiss();
          } else {
            this.CustomMethods.okAlert("Feedback enviado com sucesso");
            this.CustomMethods.loader.dismiss();
            this.navCtrl.setRoot(DiarioDeBordoPage);
          }
        },
        err => {
          this.CustomMethods.okAlert(
            "Não foi possivel salvar as respostas, verifique sua conexão com a internet e tente novamente"
          );
          this.CustomMethods.loader.dismiss();
        }
      );
  }

  Buscar() {
    var filter, competencia, i;
    filter = this.input.toUpperCase();
    competencia = $(".competencia");
    console.log(competencia);

    for (i = 0; i < competencia.length; i++) {
      if (this.competencias[i].Nome.toUpperCase().indexOf(filter) > -1) {
        competencia.eq(i).show();
      } else {
        competencia.eq(i).hide();
      }
    }
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { CustomMethods } from '../../../../app/GlobalMethods';
import { Colaborador } from '../../../../models/Colaborador';
import { URL_BASE, URL_ResponderPreWork, URL_SalvarPreWork } from '../../../../app/app.url';
import { ResponderQuestionarioPage } from '../responder-questionario/responder-questionario';

/**
 * Generated class for the PreWorkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pre-work',
  templateUrl: 'pre-work.html',
})
export class PreWorkPage {

  colaboradores = [];
  perguntas = [];
  competencias = [];

  titulo: string; data; colaborador = new Colaborador; Avaliado; input = ""; Aviso = false; IdAvaliacaoParcial: number; IdPreAvaliacao: number; tituloAvaliacao;

  mostrar: Boolean = true;



  RespostaPerguntaFormulario = {
    //Id: 0,
    AlternativaDaPerguntaFormulario: [],
    TipoPergunta: 0,
    IdPerguntaFormulario: 0,
    IdAlternativaPerguntaFormulario: 0,
    ValorTexto: "",
    ValorInteiro: 0
  }

  FormularioResposta = {
    IdFormulario: 0,
    RespostaPerguntaFormulario: [this.RespostaPerguntaFormulario]
  }

  Formulario = {
    IdColaboradorAvaliador: 0,
    IdColaboradorAvaliado: 0,
    Data: Date,
    IdFormularioResposta: 0,
    IdCompetencia: 0,
    FormularioResposta: this.FormularioResposta
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private CustomMethods: CustomMethods
  ) {
    this.CustomMethods.exibirLoading();
    this.data = this.CustomMethods.dataHoje();
    this.titulo = navParams.get('tit');
    this.IdAvaliacaoParcial = navParams.get('periodo');
    this.IdPreAvaliacao = navParams.get('prework');
    this.tituloAvaliacao = navParams.get('tituloAvaliacao');
    this.CarregarFormulario();
  }

  CarregarFormulario() {
    this.http.get(URL_BASE + URL_ResponderPreWork + "?idColab=" + this.colaborador.id + "&idPreAvaliacao=" + this.IdPreAvaliacao + "&idAvaliacaoParcial=" + this.IdAvaliacaoParcial)
      .map(res => res.json()).subscribe(
        resp => {
          this.perguntas = resp.Perguntas;
          this.competencias = resp.Competencias;
          this.Avaliado = resp.Avaliado
          this.CustomMethods.loader.dismiss();
        }, err => {
          this.CustomMethods.loader.dismiss();
          this.CustomMethods.okAlert("Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente");
          this.navCtrl.pop()
        }
      );
  }

  Mapper() {
    this.CustomMethods.exibirLoading();
    this.Aviso = false
    this.Formulario.IdColaboradorAvaliador = +this.colaborador.id;
    this.Formulario.IdColaboradorAvaliado = +this.Avaliado;
    this.Formulario.Data = this.data;
    this.Formulario.IdFormularioResposta = +this.perguntas[0].IdResposta;
    this.FormularioResposta.IdFormulario = +this.perguntas[0].IdFormulario;
    this.FormularioResposta.RespostaPerguntaFormulario = this.MapRespostas();

    if (this.Aviso) {
      this.CustomMethods.okAlert("Por favor preencha todos os dados antes de enviar")
      this.CustomMethods.loader.dismiss();
    } else {
      this.EnviarRespostas()
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
        for (let j = 0; j < this.perguntas[i].AlternativaDaPerguntaFormulario.length; j++) {
          if (this.perguntas[i].AlternativaDaPerguntaFormulario[j].ValorInteiro == 1) {
            resposta = {
              AlternativaDaPerguntaFormulario: this.perguntas[i].AlternativaDaPerguntaFormulario[j],
              IdAlternativaPerguntaFormulario: +this.perguntas[i].AlternativaDaPerguntaFormulario[j].Id,
              IdPerguntaFormulario: +this.perguntas[i].Id,
              ValorTexto: this.perguntas[i].ValorTexto,
              TipoPergunta: this.perguntas[i].TipoPergunta,
              ValorInteiro: 0,
              //Id: this.perguntas[i].IdResposta
            };
            respostas = respostas.concat(resposta);
            obrigatorio = false;
          }
        }
        if (obrigatorio) {
          this.Aviso = true
        }
      } else if (this.perguntas[i].TipoPergunta == 3) {
        let obrigatorio = false;
        if (this.perguntas[i].Obrigatoria) {
          obrigatorio = true;
        }
        for (let j = 0; j < this.perguntas[i].AlternativaDaPerguntaFormulario.length; j++) {
          if (this.perguntas[i].AlternativaDaPerguntaFormulario[j].Id == +this.perguntas[i].IdAlternativaPerguntaFormulario) {
            resposta = {
              AlternativaDaPerguntaFormulario: this.perguntas[i].AlternativaDaPerguntaFormulario[j],
              IdAlternativaPerguntaFormulario: +this.perguntas[i].AlternativaDaPerguntaFormulario[j].Id,
              IdPerguntaFormulario: +this.perguntas[i].Id,
              ValorTexto: this.perguntas[i].ValorTexto,
              TipoPergunta: this.perguntas[i].TipoPergunta,
              ValorInteiro: 0,
              //Id: this.perguntas[i].IdResposta
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
          AlternativaDaPerguntaFormulario: this.perguntas[i].AlternativaDaPerguntaFormulario,
          IdAlternativaPerguntaFormulario: +this.perguntas[i].IdAlternativaPerguntaFormulario,
          IdPerguntaFormulario: +this.perguntas[i].Id,
          ValorTexto: this.perguntas[i].ValorTexto,
          TipoPergunta: this.perguntas[i].TipoPergunta,
          ValorInteiro: this.perguntas[i].ValorInteiro,
          //Id: this.perguntas[i].IdResposta
        };

        respostas = respostas.concat(resposta);

        if (resposta.ValorInteiro == 0 && this.perguntas[i].Obrigatoria) {
          this.Aviso = true;
        }
      } else {
        resposta = {
          AlternativaDaPerguntaFormulario: this.perguntas[i].AlternativaDaPerguntaFormulario,
          IdAlternativaPerguntaFormulario: +this.perguntas[i].IdAlternativaPerguntaFormulario,
          IdPerguntaFormulario: +this.perguntas[i].Id,
          ValorTexto: this.perguntas[i].ValorTexto,
          TipoPergunta: this.perguntas[i].TipoPergunta,
          ValorInteiro: 0,
          //Id: this.perguntas[i].IdResposta
        };

        respostas = respostas.concat(resposta);

        if ((!resposta.ValorTexto && !resposta.IdAlternativaPerguntaFormulario) && this.perguntas[i].Obrigatoria) {
          this.Aviso = true;
        }
      }
    }
    return respostas;
  };

  EnviarRespostas() {
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
    let options = new RequestOptions({ headers: headers });
    let strData = JSON.stringify({ 'model': this.Formulario, "idPreAvaliacao": this.IdPreAvaliacao })

    this.http.post(URL_BASE + URL_SalvarPreWork, strData, options)
      .map(res => res.json()).subscribe(
        resp => {
          if (!resp.Ok) {
            this.CustomMethods.okAlert("Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente");
            this.CustomMethods.loader.dismiss();
          } else {
            this.CustomMethods.okAlert("Avaliação salva com sucesso!");
            this.CustomMethods.loader.dismiss();

            this.navCtrl.pop()
            this.navCtrl.push(ResponderQuestionarioPage, { tit: this.tituloAvaliacao, periodo: this.IdAvaliacaoParcial });
          }
        }, err => {
          this.CustomMethods.okAlert("Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente");
          this.CustomMethods.loader.dismiss();
        }
      );
  }
  Cancelar() {
    this.navCtrl.pop();
  }

}
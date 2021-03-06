import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CustomMethods } from '../../../app/GlobalMethods';
import { URL_BASE, URL_AbrirFormularioPesquisaEmAndamento, URL_SalvarPesquisaPontual } from '../../../app/app.url';
import { ListaDePesquisasPage } from '../lista-de-pesquisas/lista-de-pesquisas';
import { PesquisaPontualPage } from '../pesquisa';
import * as $ from 'jquery';





@IonicPage()
@Component({
  selector: 'page-responder-pesquisa',
  templateUrl: 'responder-pesquisa.html',
})

export class ResponderPesquisaPage {

  rate: number = 0;
  tipo: number;
  titulo: string;
  loopNumbers: any;
  Carregado: boolean = false;

  PesquisaPontual: any;
  PerguntasFormulario = [];

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

  RespostaPesquisaPontual = {
    Data: Date,
    IdFormularioResposta: 0,
    IdPesquisaColaborador: 0,
    TipoAmbiente: 0,
    FormularioResposta: this.FormularioResposta
  };

  Aviso = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private CustomMethods: CustomMethods,
    private alertCtrl: AlertController
  ) {

    this.tipo = navParams.get("type");
    this.titulo = this.tipo == 1 ? this.titulo = 'Em Andamento' : 'Histórico'
    this.loopNumbers = Array(5).fill(0).map((x, i) => (i + 1));  
    this.PesquisaPontual = this.navParams.get("pesquisa");
    
    this.CustomMethods.exibirLoading();
    this.CarregarFormulario();

  }


  CarregarFormulario() {
    this.http
      .get(
        URL_BASE + URL_AbrirFormularioPesquisaEmAndamento
        + "?idPesquisaColaborador=" + this.PesquisaPontual.IdPesquisaColaborador
        + "&visualizado=" + this.PesquisaPontual.Visualizado
        + "&idFormulario=" + this.PesquisaPontual.IdFormulario
      )
      .map(res => res.json())
      .subscribe(
        resp => {
          console.log(resp.Perguntas);
          this.PerguntasFormulario = resp.Perguntas;
          console.log(this.GroupBy(resp.Perguntas, "Categorias"));          
          this.CustomMethods.loader.dismiss();
          this.Carregado = true;

          if (!this.navParams.get("pesquisa")["MostrarInstrucoes"]) {            
            this.mostrasInstrucoes();
            this.PesquisaPontual["MostrarInstrucoes"] = true;
            this.PesquisaPontual["Visualizado"] = true;
          }
      
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

  Mapper() {
    /*informacoes da RespostaPesquisaPontual:*/
    this.Aviso = false;
    this.CustomMethods.exibirLoading();
    this.RespostaPesquisaPontual.IdPesquisaColaborador = this.PesquisaPontual.IdPesquisaColaborador;
    this.RespostaPesquisaPontual.Data = this.CustomMethods.dataHoje();
    this.FormularioResposta.IdFormulario = this.PesquisaPontual.IdFormulario;
    this.FormularioResposta.RespostaPerguntaFormulario = this.MapRespostas();

    if(!this.RespostaPesquisaPontual.TipoAmbiente)
      {
        this.Aviso = true;
        this.CustomMethods.okAlert(
          "Por favor preencha todos os dados antes de enviar"
        );

        console.log(this.RespostaPesquisaPontual.TipoAmbiente)

      }

    if (this.Aviso) {
      this.CustomMethods.okAlert(
        "Por favor preencha todos os dados antes de enviar"
      );
      this.CustomMethods.loader.dismiss();
    } else {
      //this.EnviarRespostas();
      console.log(this.RespostaPesquisaPontual.FormularioResposta)
      this.EnviarRespostas();
    }

  }

  mostrasInstrucoes() {
    this.CustomMethods.AlertWithTextCustomCSS('Legenda', `
    6★ = Concordo totalmente <br>

    5★ = Concordo <br>
    
    4★ = Concordo ligeiramente <br>
    
    3★ = Discordo ligeiramente <br>
    
    2★ = Discordo <br>
    
    1★ = Discordo totalmente <br>
    `, 'justifyContent')
  }

  EnviarRespostas() {
    let headers = new Headers({
      "Content-Type": "application/json; charset=utf-8"
    });
    let options = new RequestOptions({ headers: headers });
    let strData = JSON.stringify({ model: this.RespostaPesquisaPontual });

    this.http
      .post(URL_BASE + URL_SalvarPesquisaPontual, strData, options)
      .map(res => res.json())
      .subscribe(
        resp => {
          if (!resp.Ok) {
            this.CustomMethods.okAlert(
              "Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente"
            );
            this.CustomMethods.loader.dismiss();
          } else {
            this.CustomMethods.okAlert("Pesquisa respondida com sucesso!");
            this.CustomMethods.loader.dismiss();
            this.navCtrl.setRoot(PesquisaPontualPage);
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

  onRateChange(event) {
    console.log('Your rate:', event);
    console.log('Binded Value:', this.rate);
  }

  mudarEstado(e: any) {

    $(".radio-group-ambiente").removeClass("selecionado");
    let _parentDiv = $(e.target).parent().parent();
    _parentDiv.addClass("selecionado");


  }

  GroupBy(array: any, prop: string): any {
    return array.reduce((r, a) => {
      console.log(a[prop])
      r[a[prop]["nome"]] = r[a[prop]["nome"]] || [];
      r[a[prop]["nome"]].push(a);
      return r;
    }, Object.create(null));
  }


  Enviar() {
    let alert = this.alertCtrl.create({
      title: 'Aviso!',
      message: `Ao responder a pesquisa, estou ciente que meus resultados serão compartilhados com 
                meu gestor imediato. Da mesma forma, os meus dados podem ser utilizados de maneira individual.`,
      buttons: [{
        text: "Aceitar",
        handler: () => {
          this.Mapper();
        }
      },
      {
        text: "Recusar",
        handler: () => {
        }
      }],
      cssClass: 'alertCustomCss'
    });
    alert.present();

  }


  Cancelar() {
    this.navCtrl.pop();
  }

  AbrirPesquisa(tipo: string) { }

  MapRespostas() {
    let resposta = this.RespostaPerguntaFormulario;
    let respostas = [];

    for (let i = 0; i < this.PerguntasFormulario.length; i++) {
      resposta = {
        AlternativaDaPerguntaFormulario: this.PerguntasFormulario[i]
          .AlternativaDaPerguntaFormulario,
        IdAlternativaPerguntaFormulario: +this.PerguntasFormulario[i]
          .IdAlternativaPerguntaFormulario,
        IdPerguntaFormulario: +this.PerguntasFormulario[i].Id,
        ValorTexto: this.PerguntasFormulario[i].ValorTexto,
        TipoPergunta: this.PerguntasFormulario[i].TipoPergunta,
        ValorInteiro: this.PerguntasFormulario[i].ValorInteiro
      };

      respostas = respostas.concat(resposta);

      if ((resposta.ValorInteiro == 0 || resposta.ValorInteiro == undefined) && this.PerguntasFormulario[i].Obrigatoria) {
        this.Aviso = true;
      }
    }
    return respostas;


  }

}

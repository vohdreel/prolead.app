import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { permissoesFeedback } from "../../../models/Permissoes";
import { CustomMethods } from "../../../app/GlobalMethods";
import { Http } from "@angular/http";
import {
  URL_BASE,
  URL_ListarLiderados,
  URL_ListarColabores
} from "../../../app/app.url";
import { Colaborador } from "../../../models/Colaborador";
import { LancarFeedbackPage } from "../lancar-feedback/lancar-feedback";
import * as $ from 'jquery';

/**
 * Generated class for the NovoFeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-novo-feedback",
  templateUrl: "novo-feedback.html"
})
export class NovoFeedbackPage {
  permissoes = {} as permissoesFeedback;
  colaborador = new Colaborador();
  mostrarColab:Boolean = true;
  mostrarLidera:Boolean = true;
  input = "";
  inputLiderado = "";
  inputColaborador = "";

  liderados = [];
  colaboradores = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private CustomMethods: CustomMethods
  ) {
    this.permissoes = navParams.get("perm");
    this.ListarColaboradores();
  }

  MostrarColaboradores(){
    this.mostrarColab = !this.mostrarColab;
  }

  
  MostrarLiderados(){
    this.mostrarLidera = !this.mostrarLidera;
  }

  ListarColaboradores() {
    let Parametros = "";

    if (this.permissoes.podeAtribuirFeedbackColaborador) {
      Parametros =
        URL_BASE + URL_ListarColabores + "?idColab=" + this.colaborador.id;
      this.http
        .get(Parametros)
        .map(res => res.json())
        .subscribe(
          resp => {
            this.colaboradores = resp.Lista;
            console.log(resp.Lista);
          },
          err => {
            this.CustomMethods.okAlert(
              "Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente"
            );
            this.navCtrl.pop();
          }
        );
    }

    
    if (this.permissoes.podeAtribuirFeedbackLiderado) {      
        Parametros =
          URL_BASE + URL_ListarLiderados + "?idColab=" + this.colaborador.id;
        this.http
          .get(Parametros)
          .map(res => res.json())
          .subscribe(
            resp => {
              this.liderados = resp.Lista;
            },
            err => {
              this.CustomMethods.okAlert(
                "Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente"
              );
              this.navCtrl.pop();
            }
          );
      }

      
  }

  BuscarColaboradores() {
    var filter, colaborador, i;
    filter = this.inputColaborador.toUpperCase();
    colaborador = $(".colaborador");
    console.log(colaborador);

    for (i = 0; i < colaborador.length; i++) {
      if (this.colaboradores[i].Nome.toUpperCase().indexOf(filter) > -1) {
        
        colaborador.eq(i).show();
      } else {
        console.log(filter);
        colaborador.eq(i).hide();
      }
    }
  }

  BuscarLiderados() {
    var filter, liderado, i;
    filter = this.inputLiderado.toUpperCase();
    liderado = $(".liderados");
    console.log(liderado);

    for (i = 0; i < liderado.length; i++) {
      if (this.liderados[i].Nome.toUpperCase().indexOf(filter) > -1) {
        
        liderado.eq(i).show();
      } else {
        console.log(filter);
        liderado.eq(i).hide();
      }
    }
  }
  Lancar(titulo, id) {
    this.navCtrl.push(LancarFeedbackPage, {tit: titulo, idColab: id});
  }
}

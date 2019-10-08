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
  mostrar:Boolean = false;
  input = "";
  inputLiderado = "";

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

  Mostrar(){
    this.mostrar = !this.mostrar;
  }
  ListarColaboradores() {
    let Parametros = "";

    if (this.permissoes.podeAtribuirFeedbackColaborador) {
      this.mostrar = true;
      Parametros =
        URL_BASE + URL_ListarColabores + "?idColab=" + this.colaborador.id;
      this.http
        .get(Parametros)
        .map(res => res.json())
        .subscribe(
          resp => {
            this.colaboradores = resp.Lista;
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
      this.mostrar = false;
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

  BuscarLiderado() {
    var filter, colaborador, i;
    filter = this.inputLiderado.toUpperCase();
    colaborador = document.getElementsByClassName("colaboradorLiderado");

    for (i = 0; i < colaborador.length; i++) {
      if (this.liderados[i].Nome.toUpperCase().indexOf(filter) > -1) {
        colaborador[i].style.display = "";
      } else {
        colaborador[i].style.display = "none";
      }
    }
  }

  Buscar() {
    var filter, colaborador, i;
    filter = this.input.toUpperCase();
    colaborador = document.getElementsByClassName("colaborador");

    for (i = 0; i < colaborador.length; i++) {
      if (this.colaboradores[i].Nome.toUpperCase().indexOf(filter) > -1) {
        colaborador[i].style.display = "";
      } else {
        colaborador[i].style.display = "none";
      }
    }
  } 

  Lancar(titulo, id) {
    this.navCtrl.push(LancarFeedbackPage, {tit: titulo, idColab: id});
  }
}

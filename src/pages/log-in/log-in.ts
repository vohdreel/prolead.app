import { CustomMethods } from "./../../app/GlobalMethods";
import { Network } from "@ionic-native/network";
import { URL_BASE, URL_Foto, URL_FcmToken } from "./../../app/app.url";
import { Component } from "@angular/core";
import { MenuController, Events } from "ionic-angular";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Http, URLSearchParams } from "@angular/http";
import { HTTP } from "@ionic-native/http/ngx"


import { EsqueciMinhaSenhaPage } from "./../esqueci-minha-senha/esqueci-minha-senha";
import { HomePage } from "./../home/home";
import { Usuario } from "../../models/Usuario";
import { Storage } from "@ionic/storage";

import CryptoJS from "crypto-js";

@IonicPage()
@Component({
  selector: "page-log-in",
  templateUrl: "log-in.html"
})
export class LogInPage {
  usuario = {} as Usuario;
  key = "proleadshapeness";

  email: string;
  senha: string;
  EmailValid = true;
  PasswordValid = true;
  ManterConectado = false;
  show = false;
  type = "password";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public menuCtrl: MenuController,
    private customMethods: CustomMethods,
    private network: Network,
    private storage: Storage,
    public events: Events
  ) {
    this.usuario.email = localStorage.getItem("Usuario");
    if (localStorage.getItem("ManterConectado") == "true") {
      this.ManterConectado = localStorage.getItem("ManterConectado") == "true";
      this.usuario.senha = localStorage.getItem("Senha");
      this.login(this.usuario);
    }


  }

  MostrarSenha() {
    if (this.show) {
      this.show = false;
      this.type = "password";
    } else {
      this.show = true;
      this.type = "text";
    }
  }

  onEsqueciMinhaSenha() {
    this.navCtrl.push(EsqueciMinhaSenhaPage);
  }

  ionViewDidLoad() {
    this.menuCtrl.enable(false);
  }
  encrypt(data) {
    let key = this.key;
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  }

  login(usuario: Usuario) {
    this.
    customMethods.exibirLoading();

    let data = new URLSearchParams();
    data.append("username", usuario.email);
    data.append("password", usuario.senha);
    data.append("grant_type", "password");

    return this.http
      .post(URL_BASE + "api/token", data)
      .map(res => res.json())
      .subscribe(
        resp => {
          //Cria o token pela API;
          this.customMethods.loader.dismiss();
          let token = this.encrypt(resp.access_token);
          let claims = resp.claims.split(",");
          //Armazena e Redireciona para a Home
          this.armazenarPermissoes(claims, token);
        },
        err => {
          this.customMethods.loader.dismiss();
          if (this.network.type == "unknown" || this.network.type == "none") {
            this.customMethods.okAlert(
              "Verifique a sua conexão com a internet e tente novamente"
            );
          } else {
            if (err.type == 3) {
              this.customMethods.okAlert(
                "\nA aplicação esta offline por algum motivo inesperado, tente novamente mais tarde"
              );
            } else if (err.type == 2) {
              this.customMethods.okAlert("Usuário e/ou senha inválido(s)");
            } else {
              let erro = JSON.parse(err._body);
              this.customMethods.okAlert(1 + "----" + erro.error_description);
            }
          }
        }
      );
  }

  armazenarPermissoes(permissoes, token) {
    let idColaborador = "";
    let idSuperior = "";
    let perfil = "";
    let idUnidade = "";
    let nome = "";
    let cargo = "";

    console.log(permissoes);

    permissoes.forEach(element => {
      let keyValues = element.split(":");
      if (keyValues[0] == "idColaborador") {
        idColaborador = keyValues[1].trim();
        localStorage.setItem("idColaborador", idColaborador);
      }

      if (keyValues[0] == "idSuperior") {
        idSuperior = keyValues[1].trim();
        localStorage.setItem("idSuperior", idSuperior);
      }

      if (keyValues[0] == "perfil") {
        perfil = keyValues[1].trim();
        localStorage.setItem("perfil", perfil);
      }
      if (keyValues[0] == "NomeColaborador") {
        nome = keyValues[1].trim();
        localStorage.setItem("NomeColaborador", nome);
      }
      if (keyValues[0] == "Cargo") {
        cargo = keyValues[1].trim();
        localStorage.setItem("Cargo", cargo);
      }
    });

    if (this.ManterConectado) {
      localStorage.setItem("Usuario", this.usuario.email);
      localStorage.setItem("Senha", this.usuario.senha);
    } else {
      localStorage.setItem("Usuario", this.usuario.email);
      localStorage.setItem("Senha", "");
      // localStorage.setItem("perfil", "");
      // localStorage.setItem("foto", "");
    }
    localStorage.setItem("ManterConectado", this.ManterConectado.toString());

    this.storage.set("token", token).then(() => {
      this.storage.set("perfil", perfil).then(() => {
        this.storage.set("idColaborador", idColaborador).then(() => {
          this.storage.set("idUnidade", idUnidade).then(() => {
            this.goHome();
          });
        });
      });
    });
  }

  goHome() {
    
    this.events.publish("user:login");
    this.http
      .get(
        URL_BASE +
        URL_Foto +
        "?idColab=" +
        localStorage.getItem("idColaborador")
      )
      .map(res => res.json())
      .subscribe(
        resp => {
          localStorage.setItem("foto", resp.foto);
          this.navCtrl.setRoot(HomePage);
        },
        err => {
          localStorage.setItem("foto", "assets/imgs/avatar.png");
          this.navCtrl.setRoot(HomePage);
        }
      );   

  }
}




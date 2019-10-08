import { Component } from '@angular/core';
import { IonicPage, Platform, MenuController, NavController } from 'ionic-angular';
import { URL_BASE, URL_EsqueciSenha } from '../../app/app.url';
import { Http } from '@angular/http';
import { CustomMethods } from '../../app/GlobalMethods';

@IonicPage()
@Component({
  selector: 'page-esqueci-minha-senha',
  templateUrl: 'esqueci-minha-senha.html',
})
export class EsqueciMinhaSenhaPage {

  usuario;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public menuCtrl: MenuController,
    public http: Http,
    public CustomMethods: CustomMethods
  ) {

  }


  onUserSubmit() {
    this.http.get(URL_BASE + URL_EsqueciSenha + "?UserName=" + this.usuario )
    .map(res => res.json()).subscribe(
      resp => {
        if (resp.sucesso){
          this.CustomMethods.okAlert(resp.menssagem);
          this.navCtrl.pop();
        }else{
            this.CustomMethods.okAlert(resp.menssagem);
        }
      }, err => {
        this.CustomMethods.okAlert("Erro ao se conectar com o servidor, verifique a conexão com a internet e tente novamente");
      }
      );    
  }
    
};
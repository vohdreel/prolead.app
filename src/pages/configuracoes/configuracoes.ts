import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from "ionic-angular/platform/platform";
import { URL_BASE, URL_SalvarConfiguracoes, URL_Configuracoes, URL_SalvarFoto, URL_Foto, URL_AlterarSenha } from '../../app/app.url';
import { Http, RequestOptions, Headers } from '@angular/http';
import { CustomMethods } from '../../app/GlobalMethods';
import { Colaborador } from '../../models/Colaborador';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { Crop } from '@ionic-native/crop';
import { DomSanitizer } from '@angular/platform-browser';
import { HomePage } from '../home/home';
import { data, parseHTML } from 'jquery';
import { File } from '@ionic-native/file/ngx';

@IonicPage()
@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage {

  Colaborador = new Colaborador;
  RecebeEmail = 0; RecebePush = 0; fotoColab;
  ativo: string = 'gerais';
  fromHome: Boolean;
  imageSrc: string;
  senhaAntiga = ""; senhaNova = ""; confirmarSenha = ""; requisitos = 'Sua senha precisa de: 8 Caracteres 1 Letra maiúscula 1 Letra minúscula 1 Número 1 caractere especial';
  salvar = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private CustomMethods: CustomMethods,
    private Camera: Camera,
    private base64: Base64,
    private crop: Crop,
    private domSanitizer: DomSanitizer,
    private platform: Platform,
    private file: File
  ) {
    this.CarregarConfiguracoes();
    this.fotoColab = this.Colaborador.foto;
    this.ativo = this.navParams.get('type');
    this.fromHome = this.navParams.get('isFromHome')
  }

  CarregarConfiguracoes() {
    this.CustomMethods.exibirLoading()
    this.http.get(URL_BASE + URL_Configuracoes + "?idColab=" + this.Colaborador.id)
      .map(res => res.json()).subscribe(
        resp => {
          this.RecebeEmail = resp.RecebeEmail;
          this.RecebePush = resp.RecebePush;

          this.CustomMethods.loader.dismiss();
        }, err => {
          this.CustomMethods.okAlert("Não foi possivel carregar a página, verifique sua conexão com a internet e tente novamente");
          this.CustomMethods.loader.dismiss();
        }
      );
  }

  SalvarConfiguracoes() {
    this.http.get(URL_BASE + URL_SalvarConfiguracoes + "?idColab=" + this.Colaborador.id + "&RecebeEmail=" + this.RecebeEmail + "&RecebePush=" + this.RecebePush)
      .map(res => res.json()).subscribe(
        resp => {
          var ok = resp.sucesso
          if (!ok) {
            this.CustomMethods.okAlert("Falha ao salvar alteração, verifique o problema com o RH da empresa");
          }
        }, err => {
          this.CustomMethods.okAlert("Não foi possivel conectar ao servidor, verifique a conexão e tente novamente");
        }
      );
  }

  Carregar() {
    let cameraOptions = {
      sourceType: this.Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.platform.is('ios') ? this.Camera.DestinationType.DATA_URL : this.Camera.DestinationType.FILE_URI,
      quality: 100,
      targetWidth: 500,
      targetHeight: 500,
      encodingType: this.Camera.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit: true,
    }

    if (this.platform.is('ios')) {
      this.CustomMethods.exibirLoading();
      this.Camera.getPicture(cameraOptions)
        .then(async file_uri => {

          this.imageSrc = file_uri;
          this.fotoColab = "data:image/jpeg;base64," + file_uri;
          this.fotoColab = this.domSanitizer.bypassSecurityTrustUrl(this.fotoColab);
          this.CustomMethods.loader.dismiss();

        },
          err => console.log(err))
    } else {
      this.Camera.getPicture(cameraOptions)
        .then(file_uri => {
          this.TratarFoto(file_uri);
          this.CustomMethods.loader.dismiss();
        },
          err => console.log(err))
    }
  }

  async TratarFoto(file_uri) {
    this.imageSrc = await this.crop.crop(file_uri);


    this.imageSrc = (await this.base64.encodeFile(this.imageSrc)).split(',')[1];
    //this.imageSrc = await this.base64.encodeFile(this.imageSrc);
    //this.imageSrc = await this.base64.encodeFile(this.imageSrc);


    //this.imageSrc = btoa(this.imageSrc);


    //this.fotoColab = this.imageSrc;

    this.fotoColab = "data:image/jpeg;base64," + this.imageSrc;
    this.fotoColab = this.domSanitizer.bypassSecurityTrustUrl(this.fotoColab);


    //this.fotoColab = this.imageSrc;
    //this.fotoColab = teste;

    // this.fotoColab = this.imageSrc;
    //this.CustomMethods.okAlert("" + this.fotoColab);


  }

  SalvarFoto() {
    this.CustomMethods.exibirLoading()
    if (this.imageSrc != null && this.imageSrc != "") {

      let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
      let options = new RequestOptions({ headers: headers });
      let strData = JSON.stringify({ 'idColab': this.Colaborador.id, 'Foto': this.imageSrc });

      this.http.post(URL_BASE + URL_SalvarFoto, strData, options)
        .map(res => res.json()).subscribe(
          resp => {
            var ok = resp.sucesso
            if (!ok) {
              this.CustomMethods.okAlert("Falha ao salvar Foto, verifique o problema com o RH da empresa");
            } else {
              this.http.get(URL_BASE + URL_Foto + "?idColab=" + this.Colaborador.id)
                .map(res => res.json()).subscribe(
                  resp => {
                    localStorage.setItem('foto', resp.foto);
                    this.CustomMethods.loader.dismiss();
                  }, err => {
                    localStorage.setItem('foto', "assets/imgs/avatar.png");
                    this.CustomMethods.loader.dismiss();
                  }
                );
            }
            this.ativo = 'gerais';
          }, err => {
            this.CustomMethods.okAlert("Falha ao alterar foto, verifique a conexão com a internet e tente novamente");
            this.CustomMethods.loader.dismiss();
          }
        );
    } else {
      this.CustomMethods.okAlert("Selecione uma novo foto para poder altera-la");
      this.CustomMethods.loader.dismiss();
    }
  }

  VerificarSenha(): boolean {
    let password = this.senhaNova
    let senhaForte = false;

    if (this.senhaAntiga == this.senhaNova) {
      this.requisitos = 'Sua nova senha não pode ser igual a anterior';
      this.salvar = false;
    } else {
      var strength = 0;
      var Caracteres = false, Maiuscula = false, Minuscula = false, Numeros = false, Especiais = false;
      if (password.length >= 8) {
        strength += 1;
        Caracteres = true;
      }

      // If password contains both lower and uppercase characters, increase strength value.
      if (password.match(/[A-Z]/)) {
        strength += 1;
        Maiuscula = true;
      }

      if (password.match(/[a-z]/)) {
        strength += 1;
        Minuscula = true;
      }

      // If it has numbers and characters, increase strength value.
      if (password.match(/([0-9])/)) {
        strength += 1;
        Numeros = true;
      }
      // If it has one special character, increase strength value.
      if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
        strength += 1;
        Especiais = true;
      }
      // Calculated strength value, we can return messages
      // If value is less than 2
      if (strength <= 4) {

        var restantes = 'Sua senha precisa de: ';
        if (!Caracteres) restantes += '8 Caracteres ';
        if (!Maiuscula) restantes += '1 Letra maiúscula ';
        if (!Minuscula) restantes += '1 Letra minúscula ';
        if (!Numeros) restantes += '1 Número ';
        if (!Especiais) restantes += '1 caractere especial ';
        this.requisitos = restantes;

      } else if (this.confirmarSenha != this.senhaNova) {
        this.requisitos = 'Senhas não conferem';
        this.salvar = false;
      } else {
        this.requisitos = 'Senha segura';
        senhaForte = true;
      }
    }

    return senhaForte;
  }

  SenhaConfere() {
    if (this.senhaAntiga == "") {
      this.requisitos = 'Digite sua senha';
      this.salvar = false;
    } else if (this.senhaAntiga == this.senhaNova) {
      this.requisitos = 'Sua nova senha não pode ser igual a anterior';
      this.salvar = false;
    } else if (this.confirmarSenha != this.senhaNova) {
      this.requisitos = 'Senhas não conferem';
      this.salvar = false;
    } else if (!this.VerificarSenha()) {
      this.requisitos = 'Senha não atende ao padrão';
      this.salvar = false;
    }
    else {
      this.salvar = true;
    }
  }

  VoltarConfiguracao() {
    if (this.fromHome)
      this.navCtrl.pop();
    else
      this.ativo = 'gerais'


  }

  async SalvarSenha() {
    this.CustomMethods.exibirLoading()
    let data = new URLSearchParams();
    data.append('username', localStorage.getItem('Usuario'));
    data.append('password', this.senhaAntiga);
    data.append('grant_type', "password");

    this.http.get(URL_BASE + URL_AlterarSenha + "?idColab=" + this.Colaborador.id + "&senhaAtual=" + this.senhaAntiga + "&senhaNova=" + this.senhaNova)
      .map(respos => respos.json()).subscribe(
        resposta => {
          this.CustomMethods.okAlert(resposta.mensagem);
          if (resposta.status) {
            this.ativo = 'gerais';
          }
          this.CustomMethods.loader.dismiss();
        }, erro => {
          this.CustomMethods.okAlert("Não foi possivel conectar ao servidor, verifique a conexão e tente novamente");
          this.CustomMethods.loader.dismiss();
        }
      );


  }
  Inicio() {
    this.navCtrl.setRoot(HomePage);
  }
}

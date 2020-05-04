import { Component, ViewChild } from "@angular/core";
import { Nav, MenuController, Events } from "ionic-angular";
import { Platform } from "ionic-angular/platform/platform";
import { StatusBar } from "@ionic-native/status-bar";
import { CustomMethods } from '../app/GlobalMethods';
import { SplashScreen } from "@ionic-native/splash-screen";
import * as $ from "jquery";

import { HomePage } from "../pages/home/home";
import { CompetenciasPage } from "../pages/competencias/competencias";
import { LogInPage } from "../pages/log-in/log-in";
import { DiarioDeBordoPage } from "../pages/diario-de-bordo/diario-de-bordo";
import { URL_BASE, URL_Menu, URL_FcmToken } from "./app.url";
import { Http } from "@angular/http";
import { Colaborador } from "../models/Colaborador";
import { ConfiguracoesPage } from "../pages/configuracoes/configuracoes";


import { Firebase } from '@ionic-native/firebase';
//import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { FCM } from '@ionic-native/fcm'
import { VisualizarFeedbackPage } from "../pages/diario-de-bordo/visualizar-feedback/visualizar-feedback";
import { PesquisaPontualPage } from "../pages/pesquisa-pontual/pesquisa";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LogInPage;
  pages: Array<{
    title: string;
    icon: string;
    component: any;
    seletor: string;
  }>;
  Colaborador = new Colaborador();

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    public http: Http,
    private firebase: Firebase,
    public events: Events,
    private push: Push,
    private custom: CustomMethods,
    private fcm: FCM
  ) {
    this.initializeApp();

    this.events.subscribe("colocarBarra", seletor => {
      this.changeColor(seletor);
    });

    this.events.subscribe("user:login", () => {
      this.Colaborador = new Colaborador();
      let IdColaborador = this.Colaborador.id;

      this.http
        .get(URL_BASE + URL_Menu + "?idColab=" + IdColaborador)
        .map(res => res.json())
        .subscribe(
          resp => {
            this.pages = [
              {
                title: "Início",
                icon: "ion-md-home",
                component: HomePage,
                seletor: "HomePage"
              }
            ];
            if (resp.AvaliacaoDiaria) {
              this.pages.push({
                title: "Diário de Feedback",
                icon: "custom-prolead-diario",
                component: DiarioDeBordoPage,
                seletor: "DiarioDeBordoPage"
              });
            }

            resp.Desempenho;
            resp.Objetivos;

            // if (resp.Competencias && false) {
            //   this.pages.push({
            //     title: "Competências",
            //     icon: "custom-competencias",
            //     component: CompetenciasPage,
            //     seletor: "CompetenciasPage"
            //   });
            // }
            this.pages.push({
              title: "Pesquisa Pontual",
              icon: "custom-prolead-pesquisa-history",
              component: PesquisaPontualPage,
              seletor: "PesquisaPontualPage"
            });
            this.pages.push({
              title: "Configurações",
              icon: "ion-md-cog",
              component: ConfiguracoesPage,
              seletor: "ConfiguracoesPage"
            });
            this.pages.push({
              title: "Sair",
              icon: "ion-md-exit",
              component: LogInPage,
              seletor: "LogInPage"
            });
          },
          err => { }
        );
    });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.menuCtrl.enable(false);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // push usando FCM
      if (this.platform.is("cordova") || this.platform.is("ios")) {
        this.notificationPushFirebase();
        // this.windowsAzureNotify();
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title == "Sair") {
      //logout firebase

      if (this.platform.is("cordova") || this.platform.is("ios")) {
        localStorage.setItem("FcmToken", "");
        this.http
          .get(
            URL_BASE +
            URL_FcmToken +
            "?idColaborador=" +
            localStorage.getItem("idColaborador")
          )
          .map(res => res.json())
          .subscribe(resp => { }, err => { });
      }
      localStorage.setItem("ManterConectado", "false");
      localStorage.setItem("Senha", "");
      this.nav.setRoot(page.component);
      return;

    }
    this.changeColor(page.seletor);
    if (page.title == 'Configurações')
      this.nav.push(page.component, { type: 'gerais', isFromHome: false })
    else
      this.nav.push(page.component);
  }

  changeColor(title: string) {
    $("#ConteudoMenu button.ativo").removeClass("ativo");
    $("#ConteudoMenu button." + title).addClass("ativo");
  }


  //azure dev ops Push System;

  notificationPushFirebase() {
    this.fcm.getToken().then(token => {
      localStorage.setItem('FCMDeviceToken', token);
    });
    this.fcm.subscribeToTopic('all');

    this.fcm.onTokenRefresh().subscribe(token => {
      localStorage.setItem('FCMDeviceToken', token);
    });

    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        console.log("Received in background");
        this.nav.push(VisualizarFeedbackPage, { tit: 'Visualizar feedback', idFeed: data.id });
      } else {
        console.log("Received in foreground");
        this.nav.push(VisualizarFeedbackPage, { tit: 'Visualizar feedback', idFeed: data.id });
      };
    });
  }


  windowsAzureNotify() {

    const options: PushOptions = {
      android: {
        senderID: "10073927576",
        forceShow: 'true',
        sound: 'true',

      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    }

    const pushObject: PushObject = this.push.init(options);


    pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
    pushObject.on('registration').subscribe((data: any) => {
      console.log('Registered', data)
      localStorage.setItem('registrationId', data.registrationId)

    });
    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

  }




}

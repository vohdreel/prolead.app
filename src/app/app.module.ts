import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { Base64 } from "@ionic-native/base64";
import { Camera } from "@ionic-native/camera";
import { Crop } from "@ionic-native/crop";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { LogInPage } from "../pages/log-in/log-in";
import { EsqueciMinhaSenhaPage } from "../pages/esqueci-minha-senha/esqueci-minha-senha";
import { CompetenciasPage } from "../pages/competencias/competencias";
import { ResponderQuestionarioPage } from "../pages/competencias/responder/responder-questionario/responder-questionario";
import { QuestaoPage } from "../pages/competencias/responder/questao/questao";
import { ModalPage } from "../pages/competencias/responder/questao/modal/modal";
import { DiarioDeBordoPage } from "../pages/diario-de-bordo/diario-de-bordo";
import { VisualizarFeedbackPage } from "../pages/diario-de-bordo/visualizar-feedback/visualizar-feedback";
import { LancarFeedbackPage } from "../pages/diario-de-bordo/lancar-feedback/lancar-feedback";
import { NovoFeedbackPage } from "../pages/diario-de-bordo/novo-feedback/novo-feedback";
import { ListaDeFeedbacksPage } from "../pages/diario-de-bordo/lista-de-feedbacks/lista-de-feedbacks";
import { SelecionarAvaliacaoPage } from "../pages/competencias/selecionar-avaliacao/selecionar-avaliacao";
import { PesquisaPontualPage } from "../pages/pesquisa-pontual/pesquisa"
import { ResponderPesquisaPage } from "../pages/pesquisa-pontual/responder-pesquisa/responder-pesquisa"
import {ListaDePesquisasPage} from '../pages/pesquisa-pontual/lista-de-pesquisas/lista-de-pesquisas'
import {VisualizarPesquisaPage} from '../pages/pesquisa-pontual/visualizar-pesquisa/visualizar-pesquisa'
import { FeedBackFilterPipe } from '../pipes/FeedbackFilterPipe'


import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { HttpModule } from "@angular/http";
import { CustomMethods } from "./GlobalMethods";
import { IonicStorageModule } from "@ionic/storage";
import { Network } from "@ionic-native/network";
import { RequestService } from "./../Serivices/request.service";
import { ConfiguracoesPage } from "../pages/configuracoes/configuracoes";
import { StarRatingModule } from 'ionic3-star-rating';


import { Firebase } from '@ionic-native/firebase';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { NotificacoesPage } from "../pages/notificacoes/notificacoes";
import { PreWorkPage } from "../pages/competencias/responder/pre-work/pre-work";
import { FCM } from '@ionic-native/fcm'
import { File } from "@ionic-native/file/ngx";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LogInPage,
    EsqueciMinhaSenhaPage,
    CompetenciasPage,
    ResponderQuestionarioPage,
    QuestaoPage,
    ModalPage,
    DiarioDeBordoPage,
    LancarFeedbackPage,
    VisualizarFeedbackPage,
    SelecionarAvaliacaoPage,
    ConfiguracoesPage,
    NotificacoesPage,
    PreWorkPage,
    NovoFeedbackPage,
    ListaDeFeedbacksPage,
    FeedBackFilterPipe,
    PesquisaPontualPage,
    ListaDePesquisasPage,
    ResponderPesquisaPage,
    VisualizarPesquisaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
      backButtonIcon: "arrow-back",
      iconMode: "md",
      mode: "ios"
    }),
    HttpModule,
    StarRatingModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LogInPage,
    EsqueciMinhaSenhaPage,
    CompetenciasPage,
    ResponderQuestionarioPage,
    QuestaoPage,
    ModalPage,
    DiarioDeBordoPage,
    LancarFeedbackPage,
    VisualizarFeedbackPage,
    SelecionarAvaliacaoPage,
    ConfiguracoesPage,
    NotificacoesPage,
    PreWorkPage,
    NovoFeedbackPage,
    ListaDeFeedbacksPage,
    PesquisaPontualPage,
    ListaDePesquisasPage,
    ResponderPesquisaPage,
    VisualizarPesquisaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CustomMethods,
    Network,
    RequestService,
    Base64,
    Camera,
    Crop,
    File,
    Firebase,
    Push,
    FCM,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

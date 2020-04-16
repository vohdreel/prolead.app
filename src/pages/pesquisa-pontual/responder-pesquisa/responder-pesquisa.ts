import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { CustomMethods } from '../../../app/GlobalMethods';




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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private CustomMethods: CustomMethods
  ) {

    this.tipo = navParams.get("type");
    this.titulo = this.tipo == 1 ? this.titulo = 'Em Andamento' : 'Histórico'
    this.loopNumbers = Array(5).fill(0).map((x, i) => (i + 1));

    console.log(this.loopNumbers)

  }

  onRateChange(event) {
    console.log('Your rate:', event);
    console.log('Binded Value:', this.rate);
  }


  AbrirPesquisa(tipo: string){
    



  }


}

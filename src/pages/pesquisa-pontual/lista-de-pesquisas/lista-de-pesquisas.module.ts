import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaDePesquisasPage } from './lista-de-pesquisas';

@NgModule({
  declarations: [
    ListaDePesquisasPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaDePesquisasPage),
  ],
})
export class ListaDePesquisasPageModule {}

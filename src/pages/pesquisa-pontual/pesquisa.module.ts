import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PesquisaPontualPage } from './pesquisa';

@NgModule({
  declarations: [
    PesquisaPontualPage,
  ],
  imports: [
    IonicPageModule.forChild(PesquisaPontualPage),
  ],
})
export class CompetenciasPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiarioDeBordoPage } from './diario-de-bordo';

@NgModule({
  declarations: [
    DiarioDeBordoPage,
  ],
  imports: [
    IonicPageModule.forChild(DiarioDeBordoPage),
  ],
})
export class DiarioDeBordoPageModule {}

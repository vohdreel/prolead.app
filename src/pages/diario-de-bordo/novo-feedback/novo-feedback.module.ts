import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NovoFeedbackPage } from './novo-feedback';

@NgModule({
  declarations: [
    NovoFeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(NovoFeedbackPage),
  ],
})
export class NovoFeedbackPageModule {}

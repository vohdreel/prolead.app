import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaDeFeedbacksPage } from './lista-de-feedbacks';

@NgModule({
  declarations: [
    ListaDeFeedbacksPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaDeFeedbacksPage),
  ],
})
export class ListaDeFeedbacksPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchChallengePageRoutingModule } from './search-challenge-routing.module';

import { SearchChallengePage } from './search-challenge.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchChallengePageRoutingModule
  ],
  declarations: [SearchChallengePage]
})
export class SearchChallengePageModule {}

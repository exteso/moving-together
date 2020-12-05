import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaunchChallengePageRoutingModule } from './launch-challenge-routing.module';

import { LaunchChallengePage } from './launch-challenge.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaunchChallengePageRoutingModule
  ],
  declarations: [LaunchChallengePage]
})
export class LaunchChallengePageModule {}

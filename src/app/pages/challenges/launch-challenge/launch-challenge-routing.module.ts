import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaunchChallengePage } from './launch-challenge.page';

const routes: Routes = [
  {
    path: '',
    component: LaunchChallengePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaunchChallengePageRoutingModule {}

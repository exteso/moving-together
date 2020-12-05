import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchChallengePage } from './search-challenge.page';

const routes: Routes = [
  {
    path: '',
    component: SearchChallengePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchChallengePageRoutingModule {}

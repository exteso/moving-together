import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-search-team',
  templateUrl: './search-team.page.html',
  styleUrls: ['./search-team.page.scss'],
})
export class SearchTeamPage implements OnInit {

  teams$ : Observable<Team[]>

  constructor(public teamService: TeamService) { }

  ngOnInit() {
    this.teams$ = this.teamService.getTeams().valueChanges();
  }

}

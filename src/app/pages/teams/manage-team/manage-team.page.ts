import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.page.html',
  styleUrls: ['./manage-team.page.scss'],
})
export class ManageTeamPage implements OnInit {

  teamId: string;
  team$ : Observable<Team>;
  
  constructor(private teamService: TeamService, private route: ActivatedRoute,) { }

  ngOnInit() {

    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.teamId = params.get('teamId');
        this.team$ = this.teamService.getTeamById(this.teamId);
      });
  }

  changeTeamName(teamName){
    this.teamService.updateTeam({teamId: this.teamId, name: teamName});
  }

}

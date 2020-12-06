import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { take } from 'rxjs/operators';

import { User} from '../../models';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(
    private afs: AngularFirestore
  ) {
  }

    // Get all teams on Firestore ordered by their names.
  public getTeams(): AngularFirestoreCollection<Team> {
    return this.afs.collection('/teams', ref => ref.orderBy('name'));
  }

  public getTeamById(teamId: string): Observable<Team> {
    return this.afs.doc<Team>('/teams/'+teamId).valueChanges()
  }

  public updateTeam(team: Partial<Team>): Promise<void> {
    return this.afs.doc<Team>('/teams/'+team.teamId).update(team);
  }

}

import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { take } from 'rxjs/operators';

import { User} from '../../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private afs: AngularFirestore
  ) {
  }

  // Get an object from Firestore by its path. For eg: firestore.get('users/' + userId) to get a user object.
  public get(path: string): Promise<AngularFirestoreDocument<{}>> {
    return new Promise(resolve => {
      resolve(this.afs.doc(path));
    });
  }

  public getUser(userId: string): Observable<User> {
    return this.afs.doc<User>(`users/${userId}`).valueChanges();
  }

  // Check if the object exists on Firestore. Returns a boolean promise with true/false.
  public exists(path: string): Promise<boolean> {
    return new Promise(resolve => {
      this.afs.doc(path).valueChanges().pipe(take(1)).subscribe(res => {
        if (res) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  // Get all users on Firestore ordered by their firstNames.
  public getUsers(): AngularFirestoreCollection<User> {
    return this.afs.collection('users', ref => ref.orderBy('firstName'));
  }

  public getUserByUID(uid: string): Promise<User> {
    return new Promise(resolve => {
      this.afs.collection('users', ref => ref.where('userId', '==', uid)).valueChanges().pipe(take(1)).subscribe((res: User[]) => {
        if (res.length > 0) {
          resolve(res[0]);
        } else {
          resolve();
        }
      });
    });
  }

}

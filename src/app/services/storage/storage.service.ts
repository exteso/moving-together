import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
// import { finalize } from 'rxjs/operators';


import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class StorageService implements OnDestroy {
  profileURL: Promise<any>;

  constructor(
    public storage: Storage,
  ) {}

  // Clean up the camera
  ngOnDestroy() {
  }

  public set(name: string, value: string | boolean) {
    this.storage.set(name, value);
  }

  public get(name: string): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.get(name).then((val) => {
        resolve(val);
      }).catch(err => {
        reject();
      });
    });
  }

  public keys(): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.keys().then((val) => {
        resolve(val);
      }).catch(err => {
        reject();
      });
    });
  }

  public remove(name: string): Promise<any> | void {
    return new Promise((resolve, reject) => {
      this.storage.remove(name).then((val) => {
        resolve(val);
      }).catch(err => {
        reject();
      });
    });
  }

  // Append the current date as string to the file name.
  private appendDateString(fileName: string): string {
    const name = fileName.substr(0, fileName.lastIndexOf('.')) + '_' + Date.now();
    const extension = fileName.substr(fileName.lastIndexOf('.'), fileName.length);
    return name + '' + extension;
  }

}


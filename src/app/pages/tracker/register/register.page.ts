import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services';
import { User } from 'src/app/models';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { filter, tap, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user$: Observable<User>;
  steps$: Observable<any>;
  token: string;
  providerId: string;
  providerUserId: string;
  
  constructor(private fns: AngularFireFunctions, private authService: AuthService, private afs: AngularFirestore, private route: ActivatedRoute, @Inject(DOCUMENT) readonly document: Document) { }

  /** The Window object from Document defaultView */
  get window(): Window { return this.document.defaultView; }

  ngOnInit() {

    this.user$ = this.authService.user$;
    this.steps$ = this.user$.pipe(
      tap(user => console.log(user)),
      switchMap(user => 
       this.afs.collection<any>('/fitbit/'+user.userId+'/steps', 
                                ref => ref.orderBy('dateTime', 'desc').limit(31))
                                .valueChanges()
      ),
      tap(steps => {
        console.log(steps)
      })
    );
    this.route.fragment.subscribe(
      (fragment) => {
        let searchParam = new URLSearchParams(fragment);
        let token = searchParam.get('access_token');
        if (token) {
          this.token = token;
          let providerId = 'fitbit';
          let providerUserId = searchParam.get('user_id');
          this.providerUserId = providerUserId;
          return this.authService.user$.pipe(
            filter(user => !!user)
          ).subscribe(user => {
            const callable = this.fns.httpsCallable('subscribeToTrackerProvider');
            return callable({ token, providerId, providerUserId }).subscribe(subscription => console.log(subscription));
          });
        }
      });
  }

  removeSubscription(token, providerId, providerUserId){
    const callable = this.fns.httpsCallable('subscribeToTrackerProvider');
    return callable({ token, providerId, providerUserId:'unsubscribe' }).subscribe(subscription => console.log(subscription));

  }

  public linkWithFitbitServerSide(): void {
    // Authorization Code Grant Flow:
    // https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22942C&redirect_uri=https%3A%2F%2Fexample.com%2Ffitbit_auth&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight

    // Authorization Code Grant Flow with PKCE:
    // https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22942C&redirect_uri=https%3A%2F%2Fexample.com%2Ffitbit_auth&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight

    const clientId="22C2GT";
    let fitbitLoginUrl = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id='+clientId;
    if (environment.production) {
      //fitbitLoginUrl += '&redirect_uri=https%3A%2F%2Fus-central1-movingtogether-fll.cloudfunctions.net%2FlinkFitbitUser'
      fitbitLoginUrl += '&redirect_uri=https%3A%2F%2Fmovingtogether-fll.web.app%2Fmovingtogether-fll%2Fus-central1%2FlinkFitbitUser'
    } else {
      fitbitLoginUrl += '&redirect_uri=http%3A%2F%2Flocalhost:5001%2Fmovingtogether-fll%2Fus-central1%2FlinkFitbitUser';
    }
    fitbitLoginUrl += '&scope=activity%20profile&expires_in=604800'
    this.redirect(fitbitLoginUrl, '_self');
  }


  public linkWithFitbit(): void {
    //https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22942C&redirect_uri=https%3A%2F%2Fexample.com%2Ffitbit_auth&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800
    const clientId="22BZT8";
    let fitbitLoginUrl = 'https://www.fitbit.com/oauth2/authorize?response_type=token&client_id='+clientId;
    if (environment.production) {
      //fitbitLoginUrl += '&redirect_uri=https%3A%2F%2Fus-central1-movingtogether-fll.cloudfunctions.net%2FlinkFitbitUser'
      fitbitLoginUrl += '&redirect_uri=https%3A%2F%2Fmovingtogether-fll.web.app%2Ftracker%2Fregister'
    } else {
      //fitbitLoginUrl += '&redirect_uri=http%3A%2F%2Flocalhost:5001%2Fmovingtogether-fll%2Fus-central1%2FlinkFitbitUser';
      fitbitLoginUrl += '&redirect_uri=http%3A%2F%2Flocalhost:8100%2Ftracker%2Fregister';
    }
    fitbitLoginUrl += '&scope=activity%20profile&expires_in=604800'
    this.redirect(fitbitLoginUrl, '_self');
  }

    /** Redirects to the specified external link with the mediation of the router */
  public redirect(url: string, target = '_blank'): Promise<boolean> {

    return new Promise<boolean>( (resolve, reject) => {
      
      try { resolve(!!this.window.open(url, target)); }
      catch(e) { reject(e); }
    });
  }
}

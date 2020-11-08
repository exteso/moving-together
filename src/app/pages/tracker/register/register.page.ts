import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  providerId: string;
  providerUserId: string;
  
  constructor(@Inject(DOCUMENT) readonly document: Document) { }

  /** The Window object from Document defaultView */
  get window(): Window { return this.document.defaultView; }
  ngOnInit() {
  }

  public linkWithFitbit(): void {
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
      //fitbitLoginUrl += '&redirect_uri=http%3A%2F%2Flocalhost:5001%2Fmovingtogether-fll%2Fus-central1%2FlinkFitbitUser';
      fitbitLoginUrl += '&redirect_uri=http%3A%2F%2Flocalhost:5001%2Fmovingtogether-fll%2Fus-central1%2FlinkFitbitUser';
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

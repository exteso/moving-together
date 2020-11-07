import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, AlertController, ActionSheetController } from '@ionic/angular';

import { User } from '../../models';
// import * as firebase from 'firebase';

import {
  AuthService,
  LoadingService,
  StorageService,
  ToastService,
  FirestoreService
} from '../../services';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  public profileForm: FormGroup;
  photo = 'assets/img/profile.png';
  userId: string;
  hasError: boolean;
  public subscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loading: LoadingService,
    public toast: ToastService,
    public formBuilder: FormBuilder,
    public menuCtrl: MenuController,
    public asCtrl: ActionSheetController,
    private storage: StorageService,
    private firestore: FirestoreService,
    private auth: AuthService,
    @Inject(DOCUMENT) readonly document: Document
  ) { }

  /** The Window object from Document defaultView */
  get window(): Window { return this.document.defaultView; }

  ionViewWillEnter() {
    // console.log(this.network.platforms());
    this.menuCtrl.enable(false);

    this.auth.getUser().then((user) => {
      // Check if user is logged in using email and password and show the change password button.
      this.userId = user.uid;

      // Get userData from Firestore and update the form accordingly.
      this.firestore.get('users/' + this.userId).then(ref => {
        this.subscription = ref.valueChanges().subscribe((user: User) => {
          if (user.photo) {
            this.photo = user.photo;
          }

          this.profileForm.setValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            providerId: user.providerId ? user.providerId : 'fitbit',
            providerUserId: user.providerUserId ? user.providerUserId : '',
            teamId: user.teamId ? user.teamId : ''
          });
        });
      }).catch(() => { });    
    });
  }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.compose([
        Validators.required
      ])],
      lastName: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      providerId: ['', Validators.compose([
        Validators.required
      ])],
      providerUserId: [''],
      teamId: ['']
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  keyDownFunction(event) {
    // User pressed return on keypad, proceed with creating profile.
    if (event.keyCode === 13) {
      //this.keyboard.hide();
      this.editProfile(this.profileForm);
    }
  }

  public editProfile(profileForm: FormGroup): void {
    // Check if profileForm is valid and proceed with creating the profile.
    if (!profileForm.valid) {
      this.hasError = true;
    } else {

        this.loading.showLoading('Creating profile...');
        // Edit userData on Firestore.
        this.firestore.get('users/' + this.userId).then(ref => {
          // Formatting the first and last names to capitalized.
          const firstName = profileForm.value['firstName'].charAt(0).toUpperCase()
                            + profileForm.value['firstName'].slice(1).toLowerCase();

          const lastName = profileForm.value['lastName'].charAt(0).toUpperCase()
                           + profileForm.value['lastName'].slice(1).toLowerCase();

          const user = new User(
            this.userId,
            profileForm.value['email'].toLowerCase(),
            firstName,
            lastName,
            profileForm.value['providerId'],
            profileForm.value['providerUserId'],
            profileForm.value['teamId'],
            this.photo
          );

          ref.set(Object.assign({}, user)).then(() => {
            this.loading.dismiss();
          }).catch((e) => {
            console.log('first e: ', e);
          });
        }).catch((e) => {
          console.log('second e: ', e);
        });
      }
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
      fitbitLoginUrl += '&redirect_uri=http%3A%2F%2Flocalhost:8100%2Fmovingtogether-fll%2Fus-central1%2FlinkFitbitUser';
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

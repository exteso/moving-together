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
    private auth: AuthService
  ) { }

  ionViewWillEnter() {
    // console.log(this.network.platforms());
    //this.menuCtrl.enable(false);

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

}

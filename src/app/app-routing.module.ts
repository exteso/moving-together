import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['/home']);
const belongsToAccount = (next) => hasCustomClaim(`account-${next.params.id}`);

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { 
    path: 'folder/:id', 
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule), 
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }  
  },
  { 
    path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule), canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToHome } },
  { 
    path: 'register', 
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule) 
  },
  { 
    path: 'edit-profile', 
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule), 
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } 
  },
  { 
    path: 'tracker/register', 
    loadChildren: () => import('./pages/tracker/register/register.module').then( m => m.RegisterPageModule) 
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule), 
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'teams/manage-team',
    loadChildren: () => import('./pages/teams/manage-team/manage-team.module').then( m => m.ManageTeamPageModule), 
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'teams/search-team',
    loadChildren: () => import('./pages/teams/search-team/search-team.module').then( m => m.SearchTeamPageModule), 
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'challenges/search-challenge',
    loadChildren: () => import('./pages/challenges/search-challenge/search-challenge.module').then( m => m.SearchChallengePageModule), 
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'challenges/launch-challenge',
    loadChildren: () => import('./pages/challenges/launch-challenge/launch-challenge.module').then( m => m.LaunchChallengePageModule), 
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  }
  //{ path: 'admin', component: AdminComponent,        canActivate: [AngularFireAuthGuard], data: { authGuardPipe: adminOnly }},
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

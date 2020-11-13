// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  emulator: true,
  firebase: {
    apiKey: "AIzaSyAfrYP7bHYnvH2yECcBFG9pD34C0D6v-8w",
    authDomain: "movingtogether-fll.firebaseapp.com",
    databaseURL: "https://movingtogether-fll.firebaseio.com",
    projectId: "movingtogether-fll",
    storageBucket: "movingtogether-fll.appspot.com",
    messagingSenderId: "347301417362",
    appId: "1:347301417362:web:5965c3adea1121d210714b",
    measurementId: "G-72ZT397JG7"
  },
  googleWebClientId: '525845878170-4nkapa764tg54c7ub4dqeroj56dumukk.apps.googleusercontent.com',
    // Loading Configuration.
  // Please refer to the official Loading documentation here: https://ionicframework.com/docs/api/components/loading/LoadingController/
  loading: {
    spinner: 'circles',
    duration: 3000
  },
  // Toast Configuration.
  // Please refer to the official Toast documentation here: https://ionicframework.com/docs/api/components/toast/ToastController/
  toast: {
    position: 'bottom',
    duration: 3000
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

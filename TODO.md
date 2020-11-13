# MovingTogether PENDING TASKS

- (v) configure fitbit client id and secret as firebase config

- setup CI/CD as github action or gitlab?

- (v) create a movingtogether account (support Google, facebook, email link?)

- (v) link fitbit userId to your account

- The user can manually trigger the download of the last 7d of data from fitbit

- when a user link fitbit account, call the fitbit subscription api

- verify user identity when linking a fitbit account
  is CORS a problem to send real user account to cloud functions? maybe see here https://github.com/angular/angularfire/blob/master/docs/functions/functions.md#firebase-hosting-integration
  secure functions. see https://jsmobiledev.com/article/secure-functions

- implement the subscription api

- backup firestore data
  see export/import here https://jsmobiledev.com/article/firebase-emulator

- secure firestore
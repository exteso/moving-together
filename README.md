# MovingTogether

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

## Environment variables
Firbase Cloud functions use some environment variables to access external apis and to redirect to the application in the correct environment.

You have to set them using Firebase CLI with this command (for local dev env):
firebase functions:config:set stepsprovider.fitbit.key="<YOUR_FITBIT_CLIENT_SECRET>" stepsprovider.fitbit.id="<YOUR_FITBIT_CLIENT_ID>" stepsprovider.fitbit.authorizationcode.redirecturl="http://localhost:5001/movetogether-fll/us-central1/addFitbitUser" website.homepage="http://localhost:8100"

when running firebase emulators you can also set these variables in functions/.runtimeconfig.json file

## Development server
Run `firebase emulators:start`
Run `ionic serve` for a dev server. Navigate to `http://localhost:8100/`. The app will automatically reload if you change any of the source files.

## Deploy on firebase hosting

Run `ionic build --prod`
Run `firebase deploy` or `firebase deploy --only hosting` if you only changed the frontend

## Code scaffolding

Run `ionic g page pages/page-name` to generate a new component. You can also use `ionmic generate component|directive|pipe|service|class|guard|interface|enum|module`.

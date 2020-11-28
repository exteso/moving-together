import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as qs from 'qs';
import axios, { AxiosRequestConfig } from 'axios';
import { HttpsError } from 'firebase-functions/lib/providers/https';

var tools = require('firebase-tools');

/**
 * This is an asynchronous function that uses async-await with request-promise
 * to fetch a result from Fitbit web server.
 * @returns {Promise<string>}
 */
async function getToken(code: any, redirectUri: string): Promise<any> {

    const clientId = functions.config().stepsprovider.fitbit.id;
    const clientSecret = functions.config().stepsprovider.fitbit.key;
  
    const buff = Buffer.from(clientId+":"+clientSecret);
    const base64data = buff.toString('base64');
  
    let response = {};
    // Here we go!
    const data = {
      clientId: clientId,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code,
    };
    const options: AxiosRequestConfig =  
                {
                  headers: { 
                    Authorization: `Basic ${base64data}`,
                    'content-type': 'application/x-www-form-urlencoded' },
                };
  
    functions.logger.info(qs.stringify(data));
    await axios.post("https://api.fitbit.com/oauth2/token", qs.stringify(data), options)
        .then((body) => response = body.data)
        .catch ((err) => { 
          functions.logger.error(err);
          response = { "err": err.toString() }; });
    
    return response;
  }
  
  async function subscribeToFitbit(uid: string, data: any, token: any){
    return postToFitbitApi(`https://api.fitbit.com/1/user/-/activities/apiSubscriptions/${uid}.json?subscriberId=1`, data, token);
  }

  async function unsubscribeFromFitbit(uid: string, token: any){
    return deleteToFitbitApi(`https://api.fitbit.com/1/user/-/activities/apiSubscriptions/${uid}.json?subscriberId=1`, token);
  }
  
  /*
  async function getFitbitProfile(token: any): Promise<any> {
    return callFitbitApi("https://api.fitbit.com/1/user/-/profile.json", token);
  }
 */
  async function getFitbitSteps(providerUserId: string, token: any): Promise<any> {
    return callFitbitApi(`https://api.fitbit.com/1/user/${providerUserId}/activities/steps/date/today/7d.json`, token);
  }

  async function callFitbitApi(url: string, token: any): Promise<any> {

    let response = {};

    const options: AxiosRequestConfig =  
                {
                  headers: { 
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/x-www-form-urlencoded' },
                };
  
    await axios.get(url, options)
        .then((body) => response = body.data)
        .catch ((err) => { 
          functions.logger.error(err);
          response = { "err": err.toString() }; });
    
    return response;
  }
 
  async function postToFitbitApi(url: string, data: any, token: any): Promise<any> {

    let response = {};

    const options: AxiosRequestConfig =  
                {
                  headers: { 
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/x-www-form-urlencoded' },
                };
  
    await axios.post(url, data, options)
        .then((body) => response = body.data)
        .catch ((err) => { 
          functions.logger.error(err);
          response = { "err": err.toString() }; });
    
    return response;
  }

  async function deleteToFitbitApi(url: string, token: any): Promise<any> {

    let response = {};

    const options: AxiosRequestConfig =  
                {
                  headers: { 
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/x-www-form-urlencoded' },
                };
  
    await axios.delete(url, options)
        .then((body) => response = body.data)
        .catch ((err) => { 
          functions.logger.error(err);
          response = { "err": err.toString() }; });
    
    return response;
  }

  // As described in https://dev.fitbit.com/build/reference/web-api/subscriptions/
  // FITBIT servers POST to https://us-central1-movetogether-fll.cloudfunctions.net/addFitbitSubscriptionMessage
  export const addFitbitSubscriptionMessage = functions.https.onRequest(async (req, res) => {
    // Check for POST request
    if(req.method !== "POST"){
      // fitbit servers verify the subscription API with a special GET call 
      // see https://dev.fitbit.com/build/reference/web-api/subscriptions/#verify-a-subscriber
      const verifyCode = req.query.verify;
      if (verifyCode) {
          if (verifyCode === '492d17818760969fb6b63415c019a8884d7f2b8facea0d619cec492b39d87eff') {
              res.status(204).send('VerifyCode OK'); 
              return;       
          }else{
              res.status(404).send('Wrong VerifyCode');
              return;
          }
      } 

      res.status(400).send('Please send a POST request');
      return;
    }
    // Grab the request payload.
    const data = req.body[0];

    functions.logger.info("Received a new message from FITBIT server (see next log message): ", {structuredData: true});
    functions.logger.info(data, {structuredData: true});

    const uid = data.subscriptionId;
    const providerUserId = data.ownerId
    const userSnapshot: any = await admin.firestore().doc('users/'+uid).get();
    const user = userSnapshot.data();
    const steps = await getFitbitSteps(providerUserId, user.token);
    functions.logger.info(`Received steps for subscription ${uid} from FITBIT server (see next log message): `, {structuredData: true});
    functions.logger.info( steps, {structuredData: true});

    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    await steps['activities-steps'].forEach((doc:any) => {
      return admin.firestore().doc('fitbit/'+uid+'/steps/'+doc.dateTime).set(doc);
    });

    // Send back a message that we've succesfully written the message
    res.status(204).json({result: `Refresh data for user ${uid} with FitBit steps: ${steps}.`});
  });

  export const linkFitbitUser = functions.https.onRequest(async (req, res) => {
    // Grab the request payload.
    const code: any = req.query.code;
    functions.logger.info(req.query);
    functions.logger.info(`Received an Authorization code from Fitbit server: ${code}, I'm going to exchange it for a token`, {structuredData: true});
    const redirectUrl = functions.config().stepsprovider.fitbit.authorizationcode.redirecturl;
    functions.logger.info(`Using ${redirectUrl} as redirectUrl`, {structuredData: true});
      
    const token = await getToken(code, redirectUrl);
  
    functions.logger.info("Received the token from Fitbit server");
    functions.logger.info(token);
  
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    await admin.firestore().collection('fitbit').add(token);
    // After having stored the fitbit token in firestore we redirect to the client application
    const homepageUrl = functions.config().website.homepage;
    functions.logger.info(`Using ${homepageUrl} as redirect to homepage Url`, {structuredData: true});
   
    res.redirect(301, homepageUrl);
  });

  export const subscribeToTrackerProvider = functions.https.onCall(async (data, context) => {

    // Message text passed from the client.
    const token = data.token;
    const providerId = data.providerId;
    const providerUserId = data.providerUserId;
    functions.logger.info(`Token ${token}, ProviderID ${providerId}, ProviderUserID ${providerUserId}`, {structuredData: true});
      
    // Authentication / user information is automatically added to the request.
    
    if (context.auth) {
      const uid = context.auth.uid;
      const email = context.auth.token.email || null;

      //const userProfile = await getFitbitProfile(token);  
      functions.logger.info(`Linked User ${email} with ${providerId} profile ${providerUserId}`);
    
      //const name = context.auth.token.name || null;
      //const picture = context.auth.token.picture || null;
      //const email = context.auth.token.email || null;
       // Push the new message into Cloud Firestore using the Firebase Admin SDK.
       let subscription;
       switch(providerUserId){
        case 'unsubscribe': {
          subscription = await unsubscribeFromFitbit(uid, token);
          await tools.firestore.delete('/fitbit/'+uid, {
            project: process.env.GCLOUD_PROJECT,
            recursive: true,
            yes: true,
          }); 
          break;
        }
        default : {
          subscription = await subscribeToFitbit(uid, null, token);
          const steps: any = await getFitbitSteps(providerUserId, token);
          functions.logger.info(`Received steps for subscription ${uid} from FITBIT server (see next log message): `, {structuredData: true});
          functions.logger.info( steps, {structuredData: true});
      
          const stepsArray: [] = steps['activities-steps'];
          // Push the new message into Cloud Firestore using the Firebase Admin SDK.
          await admin.firestore().doc('fitbit/'+uid).set({uid});
          await stepsArray.forEach((doc:any) => {
            return admin.firestore().doc('fitbit/'+uid+'/steps/'+doc.dateTime).set(doc);
          });
          break;
        }
      }
      functions.logger.info(`Subscription received for profile ${providerUserId} from Fitbit server`);
      functions.logger.info(subscription);
      await admin.firestore().doc('users/'+uid).update({token, providerUserId, subscription});

      return { subscription };
    }else{
      functions.logger.error("Received userProfile but no user logged in MovingTogether");
      
      throw new HttpsError("unauthenticated", "Request had invalid credentials.");
    }
    
    
    
  });
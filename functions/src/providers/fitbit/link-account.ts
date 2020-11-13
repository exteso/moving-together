import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as qs from 'qs';
import axios, { AxiosRequestConfig } from 'axios';
import { HttpsError } from 'firebase-functions/lib/providers/https';

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

  export const getFitbitUserProfile = functions.https.onCall(async (data, context) => {

    // Message text passed from the client.
    const token = data.token;
    const providerUserId = data.providerUserId;
    functions.logger.info(`Token ${token} & ProviderUserID ${providerUserId}`, {structuredData: true});
      
    // Authentication / user information is automatically added to the request.
    
    if (context.auth) {
      const uid = context.auth.uid;
      const email = context.auth.token.email || null;

      //const userProfile = await getFitbitProfile(token);  
      await admin.firestore().doc('users/'+uid).update({providerUserId});
      functions.logger.info(`Linked User ${email} with fitbit profile ${providerUserId}`);
    
      //const name = context.auth.token.name || null;
      //const picture = context.auth.token.picture || null;
      //const email = context.auth.token.email || null;
       // Push the new message into Cloud Firestore using the Firebase Admin SDK.
      
      const steps = await getFitbitSteps(providerUserId, token)
      functions.logger.info(`Steps received for profile ${providerUserId} from Fitbit server`);
      functions.logger.info(steps);

      return { steps };
    }else{
      functions.logger.error("Received userProfile but no user logged in MovingTogether");
      
      throw new HttpsError("unauthenticated", "Request had invalid credentials.");
    }
    
    
    
  });
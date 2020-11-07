import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as qs from 'qs';
import axios, { AxiosRequestConfig } from 'axios';

/**
 * This is an asynchronous function that uses async-await with request-promise
 * to fetch a result from Fitbit web server.
 * @returns {Promise<string>}
 */
async function getToken(code: any, redirectUri: string): Promise<any> {

    let clientId = functions.config().stepsprovider.fitbit.id;
    let clientSecret = functions.config().stepsprovider.fitbit.key;
  
    let buff = Buffer.from(clientId+":"+clientSecret);
    let base64data = buff.toString('base64');
  
    let response = {};
    // Here we go!
    let data = {
      clientId: clientId,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code,
    };
    let options: AxiosRequestConfig =  
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
  
  
  export const linkFitbitUser = functions.https.onRequest(async (req, res) => {
    // Grab the request payload.
    const code: any = req.query.code;
    functions.logger.info(req.query);
    functions.logger.info(`Received an Authorization code from Fitbit server: ${code}, I'm going to exchange it for a token`, {structuredData: true});
    let redirectUrl = functions.config().stepsprovider.fitbit.authorizationcode.redirecturl;
    functions.logger.info(`Using ${redirectUrl} as redirectUrl`, {structuredData: true});
      
    let token = await getToken(code, redirectUrl);
  
    functions.logger.info("Received the token from Fitbit server");
    functions.logger.info(token);
  
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    await admin.firestore().collection('fitbit').add(token);
    // After having stored the fitbit token in firestore we redirect to the client application
    let homepageUrl = functions.config().website.homepage;
    functions.logger.info(`Using ${homepageUrl} as redirect to homepage Url`, {structuredData: true});
   
    res.redirect(301, homepageUrl);
  });
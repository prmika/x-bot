import { https } from "firebase-functions";
import { initializeApp, firestore } from "firebase-admin";
initializeApp();

const dbRef = firestore().doc("tokens/demo");

import TwitterApi from "twitter-api-v2";


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  console.log('Using .env file to supply config environment variables');
}

const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID, // || functions.config().twitter.client_id,
  clientSecret: process.env.TWITTER_CLIENT_SECRET, // || functions.config().twitter.client_secret,
});

const callbackURL = process.env.TWITTER_CALLBACK_URL; // || functions.config().twitter.callback_url;


export const auth = https.onRequest(async (request, response) => {
  const {url, codeVerifier, state} = twitterClient.generateOAuth2AuthLink(
      callbackURL,
      {scope: ["tweet.read", "tweet.write", "users.read", "offline.access"]},
  );

  await dbRef.set({codeVerifier, state});
  console.log(url);
  response.redirect(url);
});
export const callback = https.onRequest(async (request, response) => {
  const {state, code} = request.query;

  const dbSnapshot = await dbRef.get();
  const {codeVerifier, state: storedState} = dbSnapshot.data();

  if (state !== storedState) {
    response.status(400).send("Invalid state parameter");
  }

  const {
    client: loggedClient,
    accessToken,
    refreshToken,
  } = await twitterClient.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: callbackURL,
  });

  await dbRef.set({accessToken, refreshToken});

  const {data} = await loggedClient.v2.me();

  response.send(data);
});

export const tweet = https.onRequest(async (request, response) => {
  const {refreshToken} = (await dbRef.get()).data();

  const {
    client: refreshedClient,
    accessToken,
    refreshToken: newRefreshToken,
  } = await twitterClient.refreshOAuth2Token(refreshToken);

  await dbRef.set({accessToken, refreshToken: newRefreshToken});

  const nextTweet = "Testing";

  console.log("Tweeting:", nextTweet);

  const {data} = await refreshedClient.v2.tweet(nextTweet);

  response.send(data);
});

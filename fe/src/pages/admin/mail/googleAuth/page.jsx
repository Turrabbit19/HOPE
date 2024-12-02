// GoogleAuth.js
import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "507652758087-875j3iau0sd2run8tltjcmp35iiis1k8.apps.googleusercontent.com";
const API_KEY = "AIzaSyD3HVVoNSxTD0a6A8uHdhaIRsBJmcmhmrw";
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

const GoogleAuth = ({ onSignIn, onSignOut }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance.isSignedIn.get()) {
          setIsAuthenticated(true);
          setUserProfile(authInstance.currentUser.get().getBasicProfile());
        }
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const signIn = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      setIsAuthenticated(true);
      const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
      setUserProfile(profile);
      onSignIn(profile);
    });
  };

  const signOut = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      setIsAuthenticated(false);
      setUserProfile(null);
      onSignOut();
    });
  };

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={signIn}>Sign In with Google</button>
      ) : (
        <div>
          <h3>Welcome, {userProfile?.getName()}</h3>
          <button onClick={signOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default GoogleAuth;

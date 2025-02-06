// src/authConfig.ts
export const b2cConfig = {
    auth: {
      clientId: "cb3c5a3a-de39-4130-8d07-5d4aa0089708",
      authority: "https://leaguerb2c.b2clogin.com/leaguerb2c.onmicrosoft.com/b2c_1_signupsignin",
      knownAuthorities: ["leaguerb2c.b2clogin.com"],
      redirectUri: window.location.origin + "/redirect",
      navigateToLoginRequestUrl: false
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    }
  };
  
  export const apiScopes = ["api.access"];
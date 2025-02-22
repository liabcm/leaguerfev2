import { Configuration } from '@azure/msal-browser';

export const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_SIGN_IN_SIGN_UP',
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://leaguerappb2c.b2clogin.com/leaguerappb2c.onmicrosoft.com/B2C_1_SIGN_IN_SIGN_UP',
    },
  },
  authorityDomain: 'leaguerappb2c.b2clogin.com',
};

export const msalConfig: Configuration = {
  auth: {
    clientId: '579d1dfc-158e-4e3e-823b-ac839557bde9',
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: window.location.origin,
    navigateToLoginRequestUrl: false, // Important for B2C
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
};

// API Scopes should be formatted differently for B2C
export const apiScopes = {
  scopes: [
    'https://leaguerappb2c.onmicrosoft.com/99d9f3f8-f488-4c49-a327-c92fa9b1f5f5/api-access',
  ], // Replace with your API scope
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'email'],
};

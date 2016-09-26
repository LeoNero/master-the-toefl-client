let baseUrl;
let clientIdFace;

if (window.location.hostname === 'localhost') {
  baseUrl = 'http://localhost:3000/';
  clientIdFace = '1546232092069197';
} else {
  baseUrl = 'https://api.masterthetoefl.xyz';
  clientIdFace = '1530259873666419';
}

export default {
  baseUrl: baseUrl,
  httpInterceptor: true,
  tokenRoot: false,
  tokenName: 'token',
  tokenPrefix: 'aurelia',
  responseTokenProp: 'access_token',
  authHeader: 'Authorization',
  authToken: 'Bearer',
  withCredentials: true,
  loginRedirect: '/#/home/1',  
  providers: {      
    facebook:{
      url: '/auth/facebook',
      scope: ['email'],
      clientId: clientIdFace,
      authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth'
    }
  }
};

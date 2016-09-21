export default {
  baseUrl: 'http://localhost:3000/',
  httpInterceptor: true,
  tokenRoot: false,
  tokenName: 'token',
  tokenPrefix: 'aurelia',
  responseTokenProp: 'access_token',
  authHeader: 'Authorization',
  authToken: 'Bearer',
  withCredentials: true,
  loginRedirect: '/#/hidden',  
  providers: {      
    facebook:{
      url: '/auth/facebook',
      scope: ['email'],
      clientId:'1530259873666419',
      authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth'
    }
  }
};

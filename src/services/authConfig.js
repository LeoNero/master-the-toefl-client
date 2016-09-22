let baseUrl;

if (window.location.hostname === 'localhost') {
  baseUrl = 'http://localhost:3000/';
} else {
  baseUrl = 'http://api.masterthetoefl.xyz';
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
      clientId:'1530259873666419',
      authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth'
    }
  }
};

import {inject}           from 'aurelia-framework';
import {CustomHttpClient} from '../../../customHttpClient';
import {AuthService}      from 'aurelia-auth';
import {Router}           from 'aurelia-router';

@inject(CustomHttpClient, AuthService, Router)

export class Show {
  constructor(http, authService, router) {
    this.http = http;
    this.authService = authService;
    this.router = router;

    this.user = null;
  }

  activate() {
    this.authService.getMe().then(data => {
      this.user = data;
    });
  }

  goToSpeaking(shortId) {
    this.router.navigateToRoute('show-speaking', { shortId: shortId});
  }
}
import {inject}         from 'aurelia-framework';
import {Router}         from 'aurelia-router';
import AppRouterConfig  from './app.router.config';
import {FetchConfig}    from 'aurelia-auth';

@inject(Router, FetchConfig, AppRouterConfig)

export class App {
  constructor(router, fetchConfig, appRouterConfig) {
    this.router = router;
    this.appRouterConfig = appRouterConfig;
    this.fetchConfig = fetchConfig;
  }

  activate() {
    this.fetchConfig.configure();
    this.appRouterConfig.configure();
  }
}
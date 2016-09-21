import {inject}       from 'aurelia-framework';
import {AuthService}  from 'aurelia-auth';

@inject(AuthService)

export class Hidden {
  heading = 'EAEE';
  _isAuthenticated = false;

  constructor(authService) {
    this.authService = authService;
    this._isAuthenticated = this.authService.isAuthenticated();
  }

}
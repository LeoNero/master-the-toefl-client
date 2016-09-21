import {AuthService}  from 'aurelia-auth';
import {inject}       from 'aurelia-framework';

@inject(AuthService)

export class Logout {
  constructor(authService) {
    this.authService = authService;
  }
  
  activate() {
    this.authService.logout("#/")
      .then(response => {
        console.log("Logged out!");
      })
      .catch(err => {
        console.log("Error to logout");
      });
  }
}
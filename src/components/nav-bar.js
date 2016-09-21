import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';
import {BindingEngine} from 'aurelia-framework'; 
import {Router}     from 'aurelia-router';

@inject(AuthService, BindingEngine, Router)

export class NavBar {
  _isAuthenticated = false;

  user = null;

  subscription = {};

  constructor(auth, bindingEngine, router) {
    this.router = router;
    this.auth = auth;
    this._isAuthenticated = this.auth.isAuthenticated();

    if (this._isAuthenticated) {
      this.auth.getMe().then(data => {
        this.user = data;
      });
    }

    this.subscription = bindingEngine.propertyObserver(this, 'isAuthenticated')
      .subscribe((newValue, oldValue) => {
        if (this.isAuthenticated) {
          this.auth.getMe().then(data => {
            this.user = data;
          });
        }
      });
  }

  goToInitialPage() {
    this.router.navigateToRoute('home', {page: 1});
  }

  get isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  authenticate(name) {
    return this.auth.authenticate(name, false, null)
      .then(response => {
        console.log("auth response " + response);
      })
  }

  deactivate() {
    this.subscription.dispose();
  }
}
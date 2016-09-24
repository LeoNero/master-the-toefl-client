import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';
import {BindingEngine} from 'aurelia-framework'; 
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router}     from 'aurelia-router';
import $                  from 'jquery';

@inject(AuthService, BindingEngine, EventAggregator, Router)

export class NavBar {
  _isAuthenticated = false;

  user = null;

  subscription = {};

  constructor(auth, bindingEngine, eventAggregator, router) {
    this.router = router;
    this.auth = auth;
    this.eventAggregator = eventAggregator;
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

  navigationSuccess(event) {
    let instruction = event.instruction; 

    if (this.isAuthenticated) {
      this.auth.getMe().then(data => {
        this.user = data;
      });
    }
  }

  attached() {
    this.subscriptionC = this.eventAggregator.subscribe(
      'router:navigation:success',
      this.navigationSuccess.bind(this));

    $(".button-collapse").sideNav();
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
    this.subscriptionC.dispose();
  }
}
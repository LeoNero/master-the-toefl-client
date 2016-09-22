import {AuthorizeStep} from 'aurelia-auth';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export default class {
  constructor(router) {
    this.router = router;
  }

  configure() {
    var appRouterConfig = (config) => {
      config.title = 'Master the TOEFL';
      config.addPipelineStep('authorize', AuthorizeStep);

      config.map([
        { route: ['', 'home', 'home/:page'],  name: 'home',   moduleId: 'views/home/index',   nav: true },
        { route: 'logout',          name: 'logout',          moduleId: 'views/logout/index' },
        { route: 'speaking/new',    name: 'new-speaking', moduleId: 'views/speaking/new/index', title: 'New Speaking', auth: true },
        { route: 'speaking/:shortId',   name: 'show-speaking', moduleId: 'views/speaking/show/index' },
        { route: 'profile/me',          name: 'profile-me', moduleId: 'views/profile/show/index', auth: true },
        { route: 'contact',             name: 'contact', moduleId: 'views/contact/index' }
      ]);
    }

    this.router.configure(appRouterConfig); 
  }
}

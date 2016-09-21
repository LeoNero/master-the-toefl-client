import {inject, BindingEngine} from 'aurelia-framework';
import {CustomHttpClient} from '../../customHttpClient';
import {Router}     from 'aurelia-router';
import $            from 'jquery';

@inject(BindingEngine, CustomHttpClient, Router)

export class Home {
  totalPages = null;
  activePage = 1;

  page = 1;

  constructor(bindingEngine, http, router) {
    this.http = http;
    this.router = router;

    this.audios = [];
  }

  activate(params) {
    if (params.page === undefined) {
      this.page = 1;
    } else {
      this.page = parseInt(params.page);
    }

    this.activePage = this.page;

    this.http.fetch('api/audios/' + this.activePage)
      .then(response => response.json())
      .then(data => {
        this.audios = data.audios;
        this.totalPages = parseInt(data.total_pages);
      });
  }

  onPageChanged(e) {
    this.page = e.detail;
    this.router.navigateToRoute('home', {page: e.detail});
  }

  redirectToAudio(shortId) {
    this.router.navigateToRoute('show-speaking', { shortId: shortId});
  }

}
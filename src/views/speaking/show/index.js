import {inject}           from 'aurelia-framework';
import {json}             from 'aurelia-fetch-client';
import {CustomHttpClient} from '../../../customHttpClient';
import {AuthService}      from 'aurelia-auth';
import {Router}           from 'aurelia-router';
import $                  from 'jquery';
import plyr               from 'resources/third/plyr';

@inject(CustomHttpClient, AuthService, Router)

export class Show {

  scoreGiven = null;
  commentGiven = '';

  shortId = null;

  constructor(http, authService, router) {
    this.http = http;
    this.authService = authService;
    this.router = router;

    this.user = null;
    this.audio = null;
    this.feedbacks = [];
    this.plyr = plyr;
  }

  activate(params) {
    this.shortId = params.shortId;

    this.authService.getMe().then(data => {
      this.user = data;
    });

    this.http.fetch('api/audio/' + params.shortId)
      .then(response => response.json())
      .then(data => {
        this.audio = data;
      });

    this.http.fetch('api/audio/' + params.shortId + '/feedbacks')
      .then(response => response.json())
      .then(data => {
        this.feedbacks = data;
      });
  } 

  attached() {
    this.plyr.setup();
  }

  deleteAudio(id) {
    this.http
      .fetch('api/audio/' + id, {
        method: 'delete'
      })
      .then(response => response.json())
      .then(data => {
        this.router.navigateToRoute('home', {page: '1'});
      });
  }

  deleteFeedback(id) {
    this.http
      .fetch('api/feedback/' + id, {
        method: 'delete'
      })
      .then(response => response.json())
      .then(data => {
        this.http.fetch('api/audio/' + this.shortId + '/feedbacks')
          .then(response => response.json())
          .then(data => {
            this.feedbacks = data;
          });

        this.router.navigateToRoute('show-speaking', { shortId: this.shortId});
      });
  }

  giveFeedback() {
    let self = this;

    if ((this.scoreGiven != null) && (this.scoreGiven != '') && !(isNaN(this.scoreGiven))) {
      if (!(this.scoreGiven < 0) && !(this.scoreGiven > 4) && !(this.commentGiven == '')) {
        let feedbackGiven = {
          user_id: this.user._id,
          audio_id: this.audio._id,
          scoreGiven: this.scoreGiven,
          commentGiven: this.commentGiven
        };

        this.http
          .fetch('api/feedback/new', {
            method: 'post',
            body: json(feedbackGiven)
          })
          .then(response => response.json())
          .then(data => {
            $(self.giveFeedbackModal).closeModal();
            self.scoreGiven = null;
            self.commentGiven = '';

            this.http
              .fetch('api/user/change_pontuation', {
                method: 'post',
                body: json({user_id: self.user._id, type: 'add_point'})
              })
              .then(response => response.json())
              .then(data => console.log(data));

            this.http.fetch('api/audio/' + self.shortId + '/feedbacks')
              .then(response => response.json())
              .then(data => {
                this.feedbacks = data;
              });

            this.router.navigateToRoute('show-speaking', { shortId: this.shortId}, {replace: true});
          });
      }
    }
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }
} 
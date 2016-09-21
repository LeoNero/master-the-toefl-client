import {inject} from 'aurelia-framework';
import {json}   from 'aurelia-fetch-client';
import {CustomHttpClient} from '../../customHttpClient';

@inject(CustomHttpClient)

export class Contact {
  contactText = '';
  sent = false;

  constructor(http) {
    this.http = http;
  }

  sendContact() {
    if (this.contactText != '') {
      this.http
        .fetch('api/contact/new', {
          method: 'post',
          body: json({contactText: this.contactText})
        })
        .then(response => response.json())
        .then(data => {
          this.sent = true;
          this.contactText = '';
        });
    }
  }
}
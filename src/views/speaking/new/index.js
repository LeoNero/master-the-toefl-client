import {inject}           from 'aurelia-framework';
import {CustomHttpClient} from '../../../customHttpClient';
import {AuthService}      from 'aurelia-auth';
import {Router}           from 'aurelia-router';
import $                  from 'jquery';
import plyr               from 'resources/third/plyr';
import 'resources/third/francium';

@inject(CustomHttpClient, AuthService, Router)

export class NewSpeaking {
  tasksType = 
    [
      {number: 1, type: 'Personal Preference'},
      {number: 2, type: 'Paired Choice'},
      {number: 3, type: 'Announcement/Discussion'},
      {number: 4, type: 'General/Specific'},
      {number: 5, type: 'Problem/Solution'},
      {number: 6, type: 'Summary'}
    ];

  tasks = [];
  
  selectedTask = null;
  selectedTaskType = null;

  postAnonymously = false;

  stepOne = true;
  stepTwo = false;

  showPlayer = false;

  counter = null;
  timer = null;

  constructor(http, authService, router) {
    this.http = http;
    this.authService = authService;
    this.router = router;
    
    this.user = null;
    this.plyr = plyr;
  }

  activate() {
    this.authService.getMe().then(data => {
      return this.user = data;
    });
  }

  attached() {
    this.plyr.setup();
  }

  startRecording() {
    let self = this;

    if (!($("#record").hasClass("disabled"))) {
      Fr.voice.record(false, () => {
        $("#record").addClass("red darken-1");
        $("#record").html("Recording...");
        $("#reset").removeClass("disabled");
        $("#play").removeClass("disabled");
        $("#save").addClass("disabled");

        self.showPlayer = false;

        self.timer = setInterval(() => { 
          self.counter--;

          if (self.counter == 0) {
            clearInterval(self.timer);
            self.playRecording();
          }
        }, 1000);
      });
    }
  }

  resetRecording() {
    if (!($("#reset").hasClass("disabled"))) {
      Fr.voice.stop();
      
      $("#reset").addClass("disabled");
      $("#play").addClass("disabled");
      $("#save").addClass("disabled");

      $("#record").removeClass("disabled");

      $("#record").removeClass("red darken-1");
      $("#record").html("Record");

      this.showPlayer = false;

      clearInterval(this.timer);
      this.counter = this.selectedTask.time;
    }
  }

  playRecording() {
    $("#save").removeClass("disabled");

    if (!($("#play").hasClass("disabled"))) {
      if (!($("#record").hasClass("disabled"))) {
        Fr.voice.export((url) => {
          $("#audioRecording").attr("src", url);
          $("#audioRecording")[0].play();
        }, "URL");

        Fr.voice.pause();
      }

      $("#record").removeClass("red darken-1");
      $("#record").html("Record");
      $("#record").addClass("disabled");

      this.showPlayer = true;

      clearInterval(this.timer);
    }
  }

  saveRecording() {
    let self = this;

    if (!($("#save").hasClass("disabled"))) {
      Fr.voice.export((blob) => {
        let formData = new FormData();

        formData.append('file', blob);
        formData.append('user_id', self.user._id);
        formData.append('task_id', self.selectedTask._id);

        if (self.postAnonymously) {
          formData.append('anonymous', 1);
        } else {
          formData.append('anonymous', 0);
        }

        self.http
          .fetch('api/audio/new', {
            method: 'post',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            self.router.navigateToRoute('show-speaking', { shortId: data.shortId});
          });

        Fr.voice.stop();
      }, "blob");
    }
  }

  onChangeTaskType() {
    this.http.fetch('api/tasks/' + this.selectedTaskType.number)
      .then(response => response.json())
      .then(t => {
        this.tasks = t
        this.selectedTask = null;
        this.selectTaskHTML.refresh();
      });
  }

  goToNextStep() {
    this.stepOne = false;
    this.stepTwo = true;

    this.counter = this.selectedTask.time;
  }

  returnStep() {
    this.stepOne = true;
    this.stepTwo = false;
  }
}
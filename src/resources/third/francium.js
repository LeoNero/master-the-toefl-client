import Recorder from 'resources/third/recorder';

(function(window){
  window.Fr = window.Fr || {};
  Fr.voice = {
    
    /**
     * Path to mp3Worker.js
     * Only needed if you're gonna use MP3 conversion
     * You should also include libmp3lame.min.js
     * You can get both files from https://github.com/subins2000/Francium-voice/blob/master/js/
     */
    mp3WorkerPath: "src/mp3Worker.js",
    
    stream: false,
    input: false,
    
    init_called: false,
    
    /**
     * Initialize. Set up variables.
     */
    init: function(){
      try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL;
        if(navigator.getUserMedia === false){
          alert('getUserMedia() is not supported in your browser');
        }
        this.context = new AudioContext();
      }catch(e) {
        alert('Web Audio API is not supported in this browser');
      }
    },
    
    /**
     * Start recording audio
     */
    record: function(output, finishCallback, recordingCallback){
      var finishCallback = finishCallback || function(){};
      var recordingCallback = recordingCallback || function(){};
      
      if(this.init_called === false){
        this.init();
        this.init_called = true;
      }
      
      var $that = this;
      navigator.getUserMedia({audio: true}, function(stream){
        
        /**
         * Live Output
         */
        $that.input = $that.context.createMediaStreamSource(stream);
        if(output === true){
          $that.input.connect($that.context.destination);
        }
        
        $that.recorder = new Recorder($that.input, {
          'mp3WorkerPath': $that.mp3WorkerPath,
          'recordingCallback': recordingCallback
        });
        
        $that.stream = stream;
        $that.recorder.record();
        finishCallback(stream);
      }, function() {
        alert('No live audio input');
      });
    },
    
    pause: function(){
      this.recorder.stop();
    },
    
    resume: function(){
      this.recorder.record();
    },
    
    /**
     * Stop recording audio
     */
    stop: function(){
      this.recorder.stop();
      this.recorder.clear();
      this.stream.getTracks().forEach(function (track) {
        track.stop();
      });
      return this;
    },
    
    /**
     * Export the recorded audio to different formats :
     * BLOB, MP3, Base64, BLOB URL
     */
    export: function(callback, type){
        this.recorder.exportWAV(function(blob) {
          if(type == "" || type == "blob"){
            callback(blob);
          }else if (type == "base64"){
            var reader = new window.FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = function() {      
              callback(reader.result);
            };
          }else if(type == "URL"){
            var url = URL.createObjectURL(blob);
            callback(url);
          }
        });
      
    }
  };
})(window);
function InlineWorker(func, self) {
  var _this = this;
  var functionBody;

  self = self || {};

  if (true) {
    var functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
    var url = URL.createObjectURL(new Blob([functionBody], { type: "text/javascript" }));

    return new Worker(url);
  }

  this.self = self;
  this.self.postMessage = function (data) {
    setTimeout(function () {
      _this.onmessage({ data: data });
    }, 0);
  };

  setTimeout(function () {
    func.call(self);
  }, 0);
}

InlineWorker.prototype.postMessage = function postMessage(data) {
  var _this = this;

  setTimeout(function() {
    _this.self.onmessage({ data: data });
  }, 0);
};

module.exports = InlineWorker;

"use strict";

var phantom = require('node-phantom');

function Fetcher() {
  this.que = [];
  phantom.create(function(err, phantomInstance) {
    this.phantomInstance = phantomInstance;
    for (var i in this.que) {
      this.fetch(this.que[i]);
    }
  }.bind(this));
}

Fetcher.prototype.options = function(options) {
  options = options || {};
  this.verbose = options.verbose || this.verbose || false;
  this.interval = options.interval || this.interval || 100;
  this.timeout = options.timeout || this.timeout || 10000;
}

Fetcher.prototype.log = function(str) {
  if (this.verbose) console.log(str);
}

Fetcher.prototype.fetch = function(fetchItem) {
  if (!this.phantomInstance) {
    this.que.push(fetchItem);
    return;
  }
  var log = this.log.bind(this);
  var interval = this.interval; //var interval = fetchItem.interval || this.interval; //TODO: Check and implement commented out code
  var timeout = this.timeout; //var timeout = fetchItem.timeout || this.timeout; //TODO: Check and implement commented out code
  var instance = this.phantomInstance;
  log("#" + fetchItem.id + ": Fetching...");
  instance.createPage(function(err, page) {
    log("#" + fetchItem.id + ": Created page");
    page.open(fetchItem.url, function(err, status) {
      log("#" + fetchItem.id + ": Opened site with status:", status);
      var runningFor = 0;
      var intervalId = setInterval(function() {
        page.evaluate(
          fetchItem.pollingFunction,
          function(err, result) {
            if (result) {
              log("#" + fetchItem.id + ": Result found!");
              fetchItem.callback(null, fetchItem.id, result, instance.exit);
              clearInterval(intervalId);
            } else {
              runningFor += interval;
              if (runningFor > timeout) {
                log("#" + fetchItem.id + ": Timeout (" + timeout + "ms) reached, aborting.");
                fetchItem.callback("Timeout reached", fetchItem.id, null, instance.exit);
                clearInterval(intervalId);
              } else {
                log("#" + fetchItem.id + ": Results null. retrying in " + interval + "ms...");
              }
            }
          }
        );
      }, interval);
    });
  });
}

module.exports = new Fetcher();


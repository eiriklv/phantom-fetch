"use strict";

var phantom = require('node-phantom');

function Fetcher(options) {
  this.que = [];
  this.options(options);
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

Fetcher.prototype.fetch = function(fetchItem) {
  if (!this.phantomInstance) {
    this.que.push(fetchItem);
    return;
  }
  var verbose = this.verbose;
  var interval = this.interval;
  var timeout = this.timeout;
  var instance = this.phantomInstance;
  if (verbose) console.log("#" + fetchItem.id + ": Fetching...");
  instance.createPage(function(err, page) {
    if (verbose) console.log("#" + fetchItem.id + ": Created page");
    page.open(fetchItem.url, function(err, status) {
      if (verbose) console.log("#" + fetchItem.id + ": Opened site with status:", status);
      var runningFor = 0;
      var intervalId = setInterval(function() {
        page.evaluate(
          fetchItem.pollingFunction,
          function(err, result) {
            if (result) {
              if (verbose) console.log("#" + fetchItem.id + ": Result found!");
              fetchItem.callback(null, fetchItem.id, result, instance.exit);
              clearInterval(intervalId);
            } else {
              runningFor += interval;
              if (runningFor > timeout) {
                if (verbose) console.log("#" + fetchItem.id + ": Timeout (" + timeout + "ms) reached, aborting.");
                fetchItem.callback("Timeout reached", fetchItem.id, null, instance.exit);
                clearInterval(intervalId);
              } else {
                if (verbose) console.log("#" + fetchItem.id + ": Results null. retrying in " + interval + "ms...");
              }
            }
          }
        );
      }, interval);
    });
  });
}

module.exports = Fetcher;

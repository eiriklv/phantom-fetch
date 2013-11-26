
var Fetcher = require('phantom-fetch');

var fetcher = new Fetcher();

function pollingFunction() {
  return document.querySelector('title').innerHTML;
}

var urls = ["http://oct82.com", "http://io0j.com"];

function callback(err, id, result, exit) {
  urls[id] = '';
  console.log(result);
  if (urls.filter(Boolean).length == 0) {
    exit();
  }
}

// fetcher.options({ verbose: true });

for (var i in urls) {
  fetcher.fetch({
    id: i,
    url: urls[i],
    pollingFunction: pollingFunction,
    callback: callback
  });
}





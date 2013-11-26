
var fetcher = require('phantom-fetch');

function pollingFunction() {
  return document.querySelector('title').innerHTML;
}



function callback(err, id, result, exit) {
  console.log(result);
  exit();
}




// fetcher.options({ verbose: true });

fetcher.fetch({
  id: 1,
  url: "http://github.com",
  pollingFunction: pollingFunction,
  callback: callback
});





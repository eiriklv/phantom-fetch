phantom-fetch
=============

'phantom-fetch' is a wrapper for PhantomJS for simple data fetching from the web.

This is by no means production ready! It was meant mainly for hackish things. Beware!


Installation
-------------
To install, type
> ```npm install phantom-fetch```

or add it to your ```package.json``` as a dependency.


Usage
-----------------

require phantom-fetch:
```
var fetcher = require('phantom-fetch');
```

Set the polling function that will be run on the site:
```
function pollingFunction() {
  return document.querySelector('title').innerHTML;
}
```
The polling function should return a falsy value while the wanted value is not available.

Set a callback for when the wanted value is returned, or when the timeout is reached:
```
function callback(err, id, result, exit) {
  console.log(result);
  exit();
}
```

And initiate the fetcher:
```
fetcher.fetch({
  id: 1,
  url: "http://github.com",
  pollingFunction: pollingFunction,
  callback: callback
});
```

Also, options could be set with:
```
fetcher.options({
  verbose: true, //def false
  interval: 500, //def 100
  timeout: 4000 //def 10000
});
```


For more examples, see [here][devFolder]


Issues
-------
If you are having any problems, requests or criticism, don't hesitate to open an [issue, here][issue]

[devFolder]:https://github.com/danyshaanan/phantom-fetch/tree/master/dev
[issue]:https://github.com/danyshaanan/phantom-fetch/issues

# Express response transformer middleware [![Build Status](https://travis-ci.org/sinisavukovic/express-response-transformer-middleware.svg?branch=master)](https://travis-ci.org/sinisavukovic/express-response-transformer-middleware)

## Install

```sh
npm i express-response-transformer-middleware
```

## Setup

#### 1. Create transformer folder in project

#### 2. Apply middleware and set location (absolute path is required) to your transformer folder

```js
var transformer = require('express-response-transformer-middleware')
var app = express();
app.use(transformer(__dirname + '/transformers'));
```

#### 3. Call transformers 

##### 3.1 Handling object responses

```js
app.get('/', function (req, res) {
  res.transformItem('SUCCESS_MESSAGE', 'TransformerName', {
    example_data: "data"
  });
});
```

##### 3.2 Handling array responses
```js
app.get('/', function (req, res) {
  res.transformItems('SUCCESS_MESSAGE', 'TransformerName', [{
    example_data: "data"
  },{
    example_data: "data two"
  }]);
});
```

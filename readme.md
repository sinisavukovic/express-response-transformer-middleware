# Express response transformer middleware

## Install

```sh
$ npm install express-response-transformer-middleware
```

## Setup

1.Create transformer folder in project

2.Apply middleware and set location (absolute path is required) to your transformer folder

```js
var app = express();
app.use(transformer(__dirname + '/transformers'));
```

3.Call transformers 

3.1 Handling object responses
```js
app.get('/', function (req, res) {
  res.transformItem('SUCCESS_MESSAGE', 'TransformerName', {
    example_data: "data"
  });
});
```

3.2 Handling array responses
```js
app.get('/', function (req, res) {
  res.transformItem('SUCCESS_MESSAGE', 'TransformerName', [
  {
    example_data: "data"
  },
  {
    example_data: "data two"
  }
  ]);
});
```

Todo:

Improve this documentation

 
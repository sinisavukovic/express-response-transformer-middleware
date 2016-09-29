# Express response transformer middleware

## Install

```sh
npm i express-response-transformer-middleware
```

## NOTE

If you're using version 0.1.1 there are breaking changes in 0.2.0 

## Setup

1.Create a transformer: 
```js
export default function (data) {
	return {...}
}
```

**Note: Transformer must accept data and must return object**


2.Apply middleware and require transformer files you want to use

```js
var transformer = require('express-response-transformer-middleware')
var app = express();
app.use(transformer({
    'TransformerName': require('MyTransformer.js')
}));
```

## Calling transformers 

1.Handling object responses

```js
app.get('/', function (req, res) {
  res.transformItem('SUCCESS_MESSAGE', 'TransformerName', {
    example_data: "data"
  });
});
```

2.Handling array responses
```js
app.get('/', function (req, res) {
  res.transformItems('SUCCESS_MESSAGE', 'TransformerName', [
  {
    example_data: "data"
  },
  {
    example_data: "data two"
  }
  ]);
});
```

3.Handling response without transformer

```js
app.get('/', function (req, res) {
  res.transformItem('SUCCESS_MESSAGE', {...});
});
```

you can pass array as well

```js
app.get('/', function (req, res) {
  res.transformItem('SUCCESS_MESSAGE', [...]);
});
```

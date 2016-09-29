import express from 'express';
import transformer from '../src';

const app = express();

app.use(transformer({
  'PostTransformer': require(__dirname + '/transformers/PostTransformer.js')
}));

app.get('/', function (req, res) {
  res.transformItem('SUCCESS', {
    'example-1': '/get-post',
    'example-2': '/get-posts'
  });
});

app.get('/get-post', function (req, res) {
  res.transformItem('SUCCESS', 'PostTransformer', {
    title: 'Test title',
    slug: 'first-title-slug',
    description: 'Some test description'
  })
});

app.get('/get-posts', function (req, res) {
  res.transformItems('SUCCESS', 'PostTransformer', [
    {
      title: 'First title',
      slug: 'test-slug',
      description: 'Some test description'
    },
    {
      title: 'Second title',
      slug: 'first-title-slug',
      description: 'Some test description'
    }
  ])
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
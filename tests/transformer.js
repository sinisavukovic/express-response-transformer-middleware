import transformer from '../src';
import express from 'express';
import request from 'supertest';
import util from 'util';
import { expect } from 'chai';

describe('transformer', () => {
  let server;
  let response;
  before(() => {
    server = createServer(__dirname + '/transformers')
  });

  it('it should transform one item', (done) => {
    request(server)
      .get('/get-item')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        response = res;
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("SUCCESS");
        expect(res.body.body).to.have.property("title");
        expect(res.body.body.title).to.equal("Test title");
        expect(res.body.body).to.have.property("slug");
        expect(res.body.body.slug).to.equal("test-slug");
        expect(res.body.body).to.have.property("description");
        expect(res.body.body.description).to.equal("Some test description");
        done();
      });
  });

  it('it should transform various items', (done) => {
    request(server)
      .get('/get-items')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        response = res;
        expect(res.body.body.length).to.equal(2);
        done();
      });
  });

  it('it should throw error when transforming items with object', (done) => {
    request(server)
      .get('/get-item-with-items')
      .set('Accept', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) throw err;
        response = res;
        expect(res.status).to.equal(500);
        expect(res.body.message).to.equal('DATA_NEEDS_TO_BE_AN_ARRAY');
        done();
      });
  });

  it('it should throw error when transforming item with array', (done) => {
    request(server)
      .get('/get-items-with-item')
      .set('Accept', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) throw err;
        response = res;
        expect(res.status).to.equal(500);
        expect(res.body.message).to.equal('DATA_NEEDS_TO_BE_AN_OBJECT');
        done();
      });
  });

  it('it should throw error when transformer not found', (done) => {
    request(server)
      .get('/get-items-with-no-transformer')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        response = res;
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('TRANSFORMER_NOT_FOUND');
        done();
      });
  });

  it('it should throw error when location is not set', (done) => {
    expect(() => {
      server = createServer();
    }).to.throw(Error);

    done();
  });

  afterEach(function () {
    if (this.currentTest.state == 'failed') {
      console.log("Response body: " + util.inspect(response.body, { depth: null, colors: true }) + "\n");
    }
  })
});

const createServer = (location) => {
  const app = express();

  app.use(transformer(location));

  app.get('/get-item', (req, res) => {
    res.transformItem('SUCCESS', 'TestTransformer', {
      title: 'Test title',
      slug: 'test-slug',
      description: 'Some test description'
    })
  });

  app.get('/get-items', (req, res) => {
    res.transformItems('SUCCESS', 'TestTransformer', [
      {
        title: 'Test title 1',
        slug: 'test-slug-1',
        description: 'Some test description 1'
      },
      {
        title: 'Test title 2',
        slug: 'test-slug-2',
        description: 'Some test description 2'
      }
    ])
  });

  app.get('/get-item-with-items', (req, res) => {
    res.transformItems('SUCCESS', 'TestTransformer', {
      title: 'Test title',
      slug: 'test-slug',
      description: 'Some test description'
    })
  });

  app.get('/get-items-with-item', (req, res) => {
    res.transformItem('SUCCESS', 'TestTransformer', [ {
      title: 'Test title',
      slug: 'test-slug',
      description: 'Some test description'
    } ])
  });

  app.get('/get-items-with-no-transformer', (req, res) => {
    res.transformItem('SUCCESS', 'TestTransformerNotCreated', {
      title: 'Test title',
      slug: 'test-slug',
      description: 'Some test description'
    })
  });

  app.use((err, req, res, next) =>		// eslint-disable-line no-unused-vars
    res.status(err.status).json({
      message: err.message,
      body: err.body
    })
  );

  return app;
};

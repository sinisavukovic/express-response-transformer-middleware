import fs from 'fs';
import TransformerError from './TransformerError';

export default function ($location) {
  if (typeof $location === 'undefined') {
    throw new TransformerError('TRANSFORMER_LOCATION_NOT_SET', 500)
  }
  return function transformer(req, res, next) {
    res.transformItem = (message, transformerType, data) => {
      const location = `${$location}/${transformerType}.js`;
      let body = [];
      if (data.constructor == Array) {
        throw new TransformerError('DATA_NEEDS_TO_BE_AN_OBJECT', 500)
      }

      if (null === transformerType) {
        body = data;
      } else {
        try {
          fs.accessSync(location, fs.F_OK);
        } catch (e) {
          throw new TransformerError('TRANSFORMER_NOT_FOUND', 404)
        }

        body = require(location).default(data);
      }

      return res.status(200).json({
        "message": message,
        "body": body
      });
    };
    res.transformItems = (message, transformerType, data) => {
      const location = `${$location}/${transformerType}.js`;
      let body = [];
      if (data.constructor !== Array) {
        throw new TransformerError('DATA_NEEDS_TO_BE_AN_ARRAY', 500)
      }

      try {
        fs.accessSync(location, fs.F_OK);
      } catch (e) {
        throw new TransformerError('TRANSFORMER_NOT_FOUND', 404);
      }

      const transformer = require(location).default;

      data.forEach((item) => {
        body.push(transformer(item));
      });

      return res.status(200).json({
        "message": message,
        "body": body
      });
    };
    next();
  }
}

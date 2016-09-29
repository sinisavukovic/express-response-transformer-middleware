import fs from 'fs';
import TransformerError from './TransformerError';

export default function ($transformers) {
  if (typeof $transformers === 'undefined') {
    throw new TransformerError('TRANSFORMERS_NOT_SET', 500)
  }

  return function transformer(req, res, next) {
    res.transformItem = (message, transformerType, data) => {
      let body = [];
      if (typeof data !== 'undefined' && data.constructor == Array) {
        throw new TransformerError('DATA_NEEDS_TO_BE_AN_OBJECT', 500)
      }

      //If transformer type is not a string, transformer is not defined so will dump whatever is in the second argument
      if (typeof transformerType !== 'string') {
        body = transformerType;
      } else {
        if (!$transformers.hasOwnProperty(transformerType)) {
          throw new TransformerError('TRANSFORMER_NOT_FOUND', 404);
        }

        body = $transformers[ transformerType ].default(data);
      }

      return res.status(200).json({
        "message": message,
        "body": body
      });
    };
    res.transformItems = (message, transformerType, data) => {
      let body = [];
      if (typeof data !== 'undefined' && data.constructor !== Array) {
        throw new TransformerError('DATA_NEEDS_TO_BE_AN_ARRAY', 500)
      }

      if (!$transformers.hasOwnProperty(transformerType)) {
        throw new TransformerError('TRANSFORMER_NOT_FOUND', 404);
      }

      const transformer = $transformers[ transformerType ].default;

      //If transformer type is not a string, transformer is not defined so will dump whatever is in the second argument
      if (typeof transformerType !== 'string') {
        body = transformerType;
      } else {
        data.forEach((item) => {
          body.push(transformer(item));
        });
      }

      return res.status(200).json({
        "message": message,
        "body": body
      });
    };
    next();
  }
}

export default class TransformerError extends Error {
  constructor(message, status) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'TransformerError';
    this.message = message;
    this.status = status
  }
}
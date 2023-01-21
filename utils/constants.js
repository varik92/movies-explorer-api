const statusBadRequest = 400;
const statusNotFound = 404;
const statusInternalServerError = 500;

const allowedCors = [
  'https://movies-explorer.v92.nomoredomains.club',
  'http://movies-explorer.v92.nomoredomains.club',
  'localhost:3000',
  'http://localhost:3000',
  'http://localhost:3010',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  statusBadRequest,
  statusNotFound,
  statusInternalServerError,
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};

/**********************************************************
 *          E01XXX: Generic errors class                  *
 *********************************************************/

import { ServiceError } from './GenericError';

export class SessionAlreadyExistError extends ServiceError {
    code = 'E04001';
    httpStatusCode = 400;
}
export class SessionNotFoundError extends ServiceError {
    code = 'E04002';
    httpStatusCode = 404;
}

/**********************************************************
 *          E01XXX: Generic errors class                  *
 *********************************************************/

import { ServiceError } from './GenericError';

export class UserAlreadyExistError extends ServiceError {
    code = 'E01001';
    httpStatusCode = 400;
}
export class UserNotFoundError extends ServiceError {
    code = 'E01002';
    httpStatusCode = 404;
}

/**********************************************************
 *          E01XXX: Generic errors class                  *
 *********************************************************/

import { ServiceError } from './GenericError';

export class SubjectAlreadyExistError extends ServiceError {
    code = 'E05001';
    httpStatusCode = 400;
}
export class SubjectNotFoundError extends ServiceError {
    code = 'E05002';
    httpStatusCode = 404;
}

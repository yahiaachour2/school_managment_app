/**********************************************************
 *          E01XXX: Generic errors class                  *
 *********************************************************/

import { ServiceError } from './GenericError';

export class SchoolAlreadyExistError extends ServiceError {
    code = 'E02001';
    httpStatusCode = 400;
}
export class SchoolNotFoundError extends ServiceError {
    code = 'E02002';
    httpStatusCode = 404;
}

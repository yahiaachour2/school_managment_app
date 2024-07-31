/**********************************************************
 *          E01XXX: Generic errors class                  *
 *********************************************************/

import { ServiceError } from './GenericError';

export class StudentAlreadyExistError extends ServiceError {
    code = 'E06001';
    httpStatusCode = 400;
}
export class StudentNotFoundError extends ServiceError {
    code = 'E06002';
    httpStatusCode = 404;
}

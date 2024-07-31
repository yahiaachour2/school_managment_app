/**********************************************************
 *          E01XXX: Generic errors class                  *
 *********************************************************/

import { ServiceError } from './GenericError';

export class CalendarAlreadyExistError extends ServiceError {
    code = 'E09001';
    httpStatusCode = 400;
}
export class CalendarNotFoundError extends ServiceError {
    code = 'E09002';
    httpStatusCode = 404;
}

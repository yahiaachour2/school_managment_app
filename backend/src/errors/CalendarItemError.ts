/**********************************************************
 *          E01XXX: Generic errors class                  *
 *********************************************************/

import { ServiceError } from './GenericError';

export class CalendarItemAlreadyExistError extends ServiceError {
    code = 'E10001';
    httpStatusCode = 400;
}
export class CalendarItemNotFoundError extends ServiceError {
    code = 'E10002';
    httpStatusCode = 404;
}

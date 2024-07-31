/**********************************************************
 *          E01XXX: Generic errors class                  *
 *********************************************************/

import { ServiceError } from './GenericError';

export class ScheduleAlreadyExistError extends ServiceError {
    code = 'E08001';
    httpStatusCode = 400;
}
export class ScheduleNotFoundError extends ServiceError {
    code = 'E08002';
    httpStatusCode = 404;
}

export class InvalidStatusError extends ServiceError {
    code = 'E08003';
    httpStatusCode = 404;
}


export class RoomConflictsError extends ServiceError {
    code = 'E08004';
    httpStatusCode = 404;
}
export class InvalidTimeRangeError extends ServiceError {
    code = 'E08005';
    httpStatusCode = 404;
}


/**********************************************************
 *          E01XXX: Generic errors class                  *
 *********************************************************/

import { ServiceError } from './GenericError';

export class RoomAlreadyExistError extends ServiceError {
    code = 'E03001';
    httpStatusCode = 400;
}
export class RoomNotFoundError extends ServiceError {
    code = 'E03002';
    httpStatusCode = 404;
}

export class InvalidStatusError extends ServiceError {
    code = 'E03003';
    httpStatusCode = 404;
}
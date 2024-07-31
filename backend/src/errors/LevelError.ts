/**********************************************************
 *          E01XXX: Generic errors class                  *
 *********************************************************/

import { ServiceError } from './GenericError';

export class LevelAlreadyExistError extends ServiceError {
    code = 'E07001';
    httpStatusCode = 400;
}
export class LevelNotFoundError extends ServiceError {
    code = 'E07002';
    httpStatusCode = 404;
}


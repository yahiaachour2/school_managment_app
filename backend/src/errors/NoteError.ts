/**********************************************************
 *          E01XXX: Generic errors class                  *
 *********************************************************/

import { ServiceError } from './GenericError';

export class NoteNotFoundError extends ServiceError {
    code = 'E11001';
    httpStatusCode = 404;
}

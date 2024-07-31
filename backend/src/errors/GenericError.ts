export class ServiceError extends Error {
    code?: string;
    httpStatusCode?: number;
    message: string; // Make it required
    metas?: any;

    constructor(message?: string) {
        super();
        this.name = this.constructor.name;
        this.message = message || ''; // Assign default value here
    }
}



/**********************************************************
 *          E00XXX: Generic errors class                  *
 *********************************************************/


export class BadParametersError extends ServiceError {
    code = 'E00001';
    httpStatusCode = 400;

    constructor(parameters?: string[]) {
        super(`Parameters are required ${parameters?.join(' ').trim()}`);
    }
}

export class InvalidUuidError extends ServiceError {
    code = 'E00002';
    httpStatusCode = 400;
}


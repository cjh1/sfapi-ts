/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Changelog } from '../models/Changelog';
import type { Config } from '../models/Config';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class MetaService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Read Changelog
     * Get the API's changelog.
     * @returns Changelog Successful Response
     * @throws ApiError
     */
    public getChangelog(): CancelablePromise<Array<Changelog>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/meta/changelog',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Read Config
     * See how this API instance is configured.
     * @returns Config Successful Response
     * @throws ApiError
     */
    public getConfig(): CancelablePromise<Array<Config>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/meta/config',
            errors: {
                404: `Not found`,
            },
        });
    }

}

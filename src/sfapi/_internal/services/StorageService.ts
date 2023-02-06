/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransferStorageBody } from '../models/TransferStorageBody';
import type { TransferResult } from '../models/TransferResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class StorageService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Start Transfer
     * Initiate a Globus transfer.
     *
     * Before calling this method, make sure you have a valid [globus token](https://docs.nersc.gov/services/globus/#generate-a-globus-token-for-use-at-nersc)
     * and have activated the endpoints you want to use.
     *
     * - **source**: source endpoint UUID
     * - **target**: target endpoint UUID
     * - **outdir**: target endpoint output directory
     * - **infile**: file containing list of full path of input files
     * - **username**: (optional) run this operation as another user (needs special permission)
     *
     * You can use special UUID-s of "dtn", "hpss" or "cori".
     * @param formData
     * @returns TransferResult Successful Response
     * @throws ApiError
     */
    public startTransfer(
        formData: TransferStorageBody,
    ): CancelablePromise<TransferResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/storage/transfer',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}

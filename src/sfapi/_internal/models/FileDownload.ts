/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UtilitiesStatus } from './UtilitiesStatus';

export type FileDownload = {
    status: UtilitiesStatus;
    file?: string;
    is_binary?: boolean;
    error?: string;
};


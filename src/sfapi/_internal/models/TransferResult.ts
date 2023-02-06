/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StorageStatus } from './StorageStatus';

export type TransferResult = {
    task_id: string;
    status: StorageStatus;
    reason?: string;
};


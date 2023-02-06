/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ComputeStatus } from './ComputeStatus';

export type ComputeCommandOutput = {
    task_id: string;
    status: ComputeStatus;
    error?: string;
};


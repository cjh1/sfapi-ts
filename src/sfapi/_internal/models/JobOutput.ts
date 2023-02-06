/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ComputeStatus } from './ComputeStatus';

export type JobOutput = {
    status: ComputeStatus;
    output: Array<Record<string, string>>;
    error?: string;
};


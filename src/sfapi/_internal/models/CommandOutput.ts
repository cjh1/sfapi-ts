/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UtilitiesStatus } from './UtilitiesStatus';

export type CommandOutput = {
    task_id: string;
    status: UtilitiesStatus;
    error?: string;
};


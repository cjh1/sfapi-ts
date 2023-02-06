/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StatusValue } from './StatusValue';

export type Status = {
    name: string;
    full_name?: string;
    description?: string;
    system_type?: string;
    notes?: Array<string>;
    status: StatusValue;
    updated_at?: string;
};


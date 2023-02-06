/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UtilitiesStatus } from './UtilitiesStatus';
import type { DirectoryEntry } from './DirectoryEntry';

export type DirectoryOutput = {
    status: UtilitiesStatus;
    entries: Array<DirectoryEntry>;
    error?: string;
    file?: string;
    is_binary?: boolean;
};


/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserStats } from './UserStats';

export type GroupStats = {
    gid: number;
    name: string;
    users?: Array<UserStats>;
};


/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StorageStats } from './StorageStats';

export type ProjectStats = {
    id: number;
    description: string;
    repo_name: string;
    iris_role?: string;
    hours_given?: number;
    hours_used?: number;
    project_hours_given?: number;
    project_hours_used?: number;
    projdir_usage?: Array<StorageStats>;
    project_projdir_usage?: StorageStats;
    hpss_usage?: Array<StorageStats>;
};


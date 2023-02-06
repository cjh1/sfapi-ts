/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ComputeCommandOutput } from '../models/ComputeCommandOutput';
import type { SubmitJobBody } from '../models/SubmitJobBody';
import type { JobOutput } from '../models/JobOutput';
import type { PublicHost } from '../models/PublicHost';
import type { QueueOutput } from '../models/QueueOutput';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ComputeService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Read Jobs
     * Get information about jobs running on NERSC compute resources.
     *
     * - **machine**: the NERSC compute resource
     * - **index**: the index of the first job info to retrieve
     * - **limit**: (optional) how many job infos to retrieve
     * - **sacct**: (optional) if true, use `sacct` otherwise `squeue` to get the job info
     * - **kwargs**: (optional) a list of key/value pairs (in the form of `name=value`) to filter job results by
     * @param machine
     * @param index
     * @param limit
     * @param sacct
     * @param kwargs
     * @returns QueueOutput Successful Response
     * @throws ApiError
     */
    public getJobs(
        machine: PublicHost,
        index?: number,
        limit?: number,
        sacct: boolean = false,
        kwargs?: Array<string>,
    ): CancelablePromise<QueueOutput> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/compute/jobs/{machine}',
            path: {
                'machine': machine,
            },
            query: {
                'index': index,
                'limit': limit,
                'sacct': sacct,
                'kwargs': kwargs,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Submit Job
     * Submit a job to run on a NERSC compute resource.
     *
     * - **machine**: the machine to run the job on.
     * - **job**: either a path to the job script, or the job script itself
     * - **isPath**: if true, the job parameter is a path
     *
     * If successful this api will return a task_id which you can look up via the /tasks/task api.
     * Once the job has been scheduled, the task body will contain the job id.
     * @param machine
     * @param formData
     * @returns app__routers__compute__models__CommandOutput Successful Response
     * @throws ApiError
     */
    public submitJob(
        machine: PublicHost,
        formData: SubmitJobBody,
    ): CancelablePromise<ComputeCommandOutput> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/compute/jobs/{machine}',
            path: {
                'machine': machine,
            },
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Job
     * Get information about a job running on NERSC compute resources.
     *
     * - **machine**: the NERSC compute resource
     * - **jobid**: the id of the job
     * - **sacct**: (optional) if true, use `sacct` otherwise `squeue` to get the job info
     * @param machine
     * @param jobid
     * @param sacct
     * @returns JobOutput Successful Response
     * @throws ApiError
     */
    public getJob(
        machine: PublicHost,
        jobid: string,
        sacct: boolean = false,
    ): CancelablePromise<JobOutput> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/compute/jobs/{machine}/{jobid}',
            path: {
                'machine': machine,
                'jobid': jobid,
            },
            query: {
                'sacct': sacct,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Cancel Job
     * Cancel a scheduled job
     *
     * - **machine**: the NERSC compute resource
     * - **jobid**: the id of the job
     * @param machine
     * @param jobid
     * @returns app__routers__compute__models__CommandOutput Successful Response
     * @throws ApiError
     */
    public cancelJob(
        machine: PublicHost,
        jobid: string,
    ): CancelablePromise<ComputeCommandOutput> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/compute/jobs/{machine}/{jobid}',
            path: {
                'machine': machine,
                'jobid': jobid,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}

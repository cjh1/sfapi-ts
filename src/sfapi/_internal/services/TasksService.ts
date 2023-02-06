/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Task } from '../models/Task';
import type { Tasks } from '../models/Tasks';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TasksService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Read Task
     * Get the status of a schedule task.
     *
     * - **id**: the id of the task
     * @param id
     * @returns Task Successful Response
     * @throws ApiError
     */
    public getTask(
        id: string,
    ): CancelablePromise<Task> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/tasks/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Tasks
     * Get the status of schedule tasks.
     * @returns Tasks Successful Response
     * @throws ApiError
     */
    public getTasks(): CancelablePromise<Tasks> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/tasks',
            errors: {
                404: `Not found`,
            },
        });
    }

}

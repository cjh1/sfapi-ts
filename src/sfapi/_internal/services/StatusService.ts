/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Status } from '../models/Status';
import type { Note } from '../models/Note';
import type { Outage } from '../models/Outage';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class StatusService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Read Statuses
     * Get the NERSC system statuses.
     * @returns app__routers__status__models__Status Successful Response
     * @throws ApiError
     */
    public getStatus(): CancelablePromise<Array<Status>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/status/',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Read Notes
     * Get NERSC system status notes.
     * @returns Note Successful Response
     * @throws ApiError
     */
    public getNotes(): CancelablePromise<Array<Array<Note>>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/status/notes',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Read Outages
     * Get information about NERSC system outages.
     * @returns Outage Successful Response
     * @throws ApiError
     */
    public getOutages(): CancelablePromise<Array<Array<Outage>>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/status/outages',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Read Planned Outages
     * Get information about NERSC planned system outages.
     * @returns Outage Successful Response
     * @throws ApiError
     */
    public getPlannedOutages(): CancelablePromise<Array<Array<Outage>>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/status/outages/planned',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Read Note
     * Get information about NERSC system status notes for a specific system.
     *
     * - **name**: the name of the NERSC resource to query
     * @param name
     * @returns Note Successful Response
     * @throws ApiError
     */
    public getNotesBySystem(
        name: string,
    ): CancelablePromise<Array<Note>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/status/notes/{name}',
            path: {
                'name': name,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Outage
     * Get information about NERSC outages for a specific system.
     *
     * - **name**: the name of the NERSC resource to query
     * @param name
     * @returns Outage Successful Response
     * @throws ApiError
     */
    public getOutagesBySystem(
        name: string,
    ): CancelablePromise<Array<Outage>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/status/outages/{name}',
            path: {
                'name': name,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Planned Outages
     * Get information about NERSC planned outages for a specific system.
     *
     * - **name**: the name of the NERSC resource to query
     * @param name
     * @returns Outage Successful Response
     * @throws ApiError
     */
    public getPlannedOutagesBySystem(
        name: string,
    ): CancelablePromise<Array<Outage>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/status/outages/planned/{name}',
            path: {
                'name': name,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Status
     * Get the status of a specific NERSC system.
     *
     * - **name**: the name of the NERSC resource to query
     *
     * Return values for **status** are:
     *
     * - **"active"**: system is fully functional
     * - **"degraded"**: system functional but possibly with degraded performance
     * - **"unavailable"**: system is down, e.g. during a maintenance
     * - **"other"**: status undefined (rare)
     * @param name
     * @returns app__routers__status__models__Status Successful Response
     * @throws ApiError
     */
    public getStatusBySystem(
        name: string,
    ): CancelablePromise<Status> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/status/{name}',
            path: {
                'name': name,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}

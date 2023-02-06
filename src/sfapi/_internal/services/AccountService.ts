/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateGroupBody } from '../models/CreateGroupBody';
import type { UpdateGroupBody } from '../models/UpdateGroupBody';
import type { GroupList } from '../models/GroupList';
import type { GroupStats } from '../models/GroupStats';
import type { ProjectStats } from '../models/ProjectStats';
import type { UserInfo } from '../models/UserInfo';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AccountService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Read Projects
     * Get the authenticated user's NERSC projects.
     * @returns ProjectStats Successful Response
     * @throws ApiError
     */
    public getProjects(): CancelablePromise<Array<ProjectStats>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/account/projects',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Read User
     * Get the a user's account information. (If none give, defaults to the authenticated user.)
     * @param username
     * @returns UserInfo Successful Response
     * @throws ApiError
     */
    public getUser(
        username?: string,
    ): CancelablePromise<UserInfo> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/account/',
            query: {
                'username': username,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Roles
     * Get the authenticated user's NERSC (Iris) roles.
     * @returns ProjectStats Successful Response
     * @throws ApiError
     */
    public getRoles(): CancelablePromise<Array<ProjectStats>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/account/roles',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Read Groups
     * Get the authenticated user's file groups.
     * @returns GroupList Successful Response
     * @throws ApiError
     */
    public getGroups(): CancelablePromise<GroupList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/account/groups',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Create Group
     * Create a filegroup.
     *
     * - **name**: the group's name (max 8 characters, no unicode)
     * - **repo_name**: the name of the project the group should belong to
     * @param formData
     * @returns GroupStats Successful Response
     * @throws ApiError
     */
    public createGroup(
        formData: CreateGroupBody,
    ): CancelablePromise<GroupStats> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/account/groups',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Group
     * Get information about a filegroup.
     *
     * - **group**: the name of the group
     * @param group
     * @returns GroupStats Successful Response
     * @throws ApiError
     */
    public getGroup(
        group: string,
    ): CancelablePromise<GroupStats> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/account/groups/{group}',
            path: {
                'group': group,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Group Membership
     * Update a group's membership.
     *
     * - **group**: the name of the group
     * - **usernames**: a comma-delimited list of usernames
     * - **action**: the action to take: either `batch_add` or `batch_remove`
     * @param group
     * @param formData
     * @returns GroupStats Successful Response
     * @throws ApiError
     */
    public updateGroup(
        group: string,
        formData: UpdateGroupBody,
    ): CancelablePromise<GroupStats> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/account/groups/{group}',
            path: {
                'group': group,
            },
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}

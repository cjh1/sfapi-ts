/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommandOutput } from '../models/CommandOutput';
import type { RunCommandBody } from '../models/RunCommandBody';
import type { UploadFileBody } from '../models/UploadFileBody';
import type { DirectoryOutput } from '../models/DirectoryOutput';
import type { FileDownload } from '../models/FileDownload';
import type { PublicHost } from '../models/PublicHost';
import type { UploadResult } from '../models/UploadResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UtilitiesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Upload File
     * Upload a _small_ file to a NERSC system.
     *
     * - **machine**: the name of the machine to use
     * - **path**: the remote path of the file
     * - **file**: the file uploaded from your local machine
     * @param machine
     * @param path
     * @param formData
     * @returns UploadResult Successful Response
     * @throws ApiError
     */
    public uploadFile(
        machine: PublicHost,
        path: string,
        formData: UploadFileBody,
    ): CancelablePromise<UploadResult> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/utilities/upload/{machine}/{path}',
            path: {
                'machine': machine,
                'path': path,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Download File
     * Download a _small_ file from a NERSC system.
     *
     * - **machine**: the name of the machine to use
     * - **path**: the remote path of the file
     * - **binary**: (optional) If true the file will be returned base64-encoded
     * @param machine
     * @param path
     * @param binary
     * @returns FileDownload Successful Response
     * @throws ApiError
     */
    public downloadFile(
        machine: PublicHost,
        path: string,
        binary: boolean = false,
    ): CancelablePromise<FileDownload> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/utilities/download/{machine}/{path}',
            path: {
                'machine': machine,
                'path': path,
            },
            query: {
                'binary': binary,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Directory
     * List a directory on a NERSC system
     *
     * - **machine**: the name of the machine to use
     * - **path**: the remote path of the directory
     * @param machine
     * @param path
     * @returns DirectoryOutput Successful Response
     * @throws ApiError
     */
    public listDirectory(
        machine: PublicHost,
        path: string,
    ): CancelablePromise<DirectoryOutput> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/utilities/ls/{machine}/{path}',
            path: {
                'machine': machine,
                'path': path,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Run Command
     * Run a command on a NERSC system
     *
     * - **machine**: the name of the machine to use
     * - **executable**: the executable to run. Note that if you want to run a bash command, you must first run bash. Eg.: `bash -c "echo $PWD"`
     *
     * This command will return a task id that can be looked up via the /tasks/task api. The body of the task will be the result of the executable.
     * @param machine
     * @param formData
     * @returns app__routers__utils__models__CommandOutput Successful Response
     * @throws ApiError
     */
    public runCommand(
        machine: PublicHost,
        formData: RunCommandBody,
    ): CancelablePromise<CommandOutput> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/utilities/command/{machine}',
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

}

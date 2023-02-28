import type { UploadFileBody } from "../_internal/models/UploadFileBody";
import type { PublicHost } from "../_internal/models/PublicHost";
import type { UploadResult } from "../_internal/models/UploadResult";
import { CancelablePromise } from "../_internal/core/CancelablePromise";
import { UtilitiesService as UtilitiesServiceBase } from "../_internal/services/UtilitiesService";
import { BaseHttpRequest } from "../_internal/core/BaseHttpRequest";
import { OAuth2AuthCodePKCE } from "@bity/oauth2-auth-code-pkce";
import { ApiError } from "../_internal";
import { ApiRequestOptions } from "../_internal/core/ApiRequestOptions";
import { ApiResult } from "../_internal/core/ApiResult";

export class UtilitiesService extends UtilitiesServiceBase {

    constructor(httpRequest: BaseHttpRequest, private oauth: OAuth2AuthCodePKCE) {
        super(httpRequest);
    }

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
     * @param onProgress
     * @returns UploadResult Successful Response
     * @throws ApiError
     */
    public uploadFileWithProgress(
        machine: PublicHost,
        path: string,
        data: UploadFileBody,
        onProgress: (event: ProgressEvent) => void
    ): CancelablePromise<UploadResult> {
        path = encodeURIComponent(path);

        const options: ApiRequestOptions = {
            method: 'PUT',
            url: '/utilities/upload/{machine}/{path}',
            path: {
                'machine': machine,
                'path': path,
            },
            formData: data,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            }
        };

        return new CancelablePromise<UploadResult>(async (resolve, reject, onCancel) => {
            const token = await this.oauth.getAccessToken();
            const accessToken = token.token?.value;

            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", onProgress);

            const base = this.httpRequest.config.BASE;
            const url = `${base}/utilities/upload/${machine}/${path}`

            xhr.open("put", url);

            xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

            const onload = (xhr: XMLHttpRequest) => {
                return JSON.parse(xhr.responseText) as UploadResult;
             }

            xhr.onload = _ => {
                resolve(onload(xhr));
            };

            const onerror = (msg: string|undefined) => {

                return () => {
                    const status =  xhr.status;
                    const statusText = xhr.statusText;

                    const response: ApiResult = {
                        url: options.url,
                        ok: status === 200,
                        status,
                        statusText,
                        body: null
                    }

                    if (!msg) {
                        msg = statusText;
                    }

                    reject(new ApiError(options, response, msg));
                };
            };

            xhr.onerror = onerror(undefined)

            xhr.ontimeout = onerror("Upload timeout");

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    const status = xhr.status;
                    if (!(status === 0 || (status >= 200 && status < 400))) {
                        const response: ApiResult = {
                            url: options.url,
                            ok: false,
                            status,
                            statusText: xhr.statusText,
                            body: null
                        }
                        reject(new ApiError(options, response, xhr.statusText));
                    }
                }
            };

            onCancel(()=>xhr.abort())

            const file = (data as any).get("file");
            const formData = new FormData();
            formData.append("file", file)

            xhr.send(formData);
        });
    }
}

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { AccountService } from './services/AccountService';
import { ComputeService } from './services/ComputeService';
import { MetaService } from './services/MetaService';
import { StatusService } from './services/StatusService';
import { StorageService } from './services/StorageService';
import { TasksService } from './services/TasksService';
import { UtilitiesService } from './services/UtilitiesService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class ClientBase {

    public readonly account: AccountService;
    public readonly compute: ComputeService;
    public readonly meta: MetaService;
    public readonly status: StatusService;
    public readonly storage: StorageService;
    public readonly tasks: TasksService;
    public readonly utilities: UtilitiesService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '/api/v1.2',
            VERSION: config?.VERSION ?? '1.2',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.account = new AccountService(this.request);
        this.compute = new ComputeService(this.request);
        this.meta = new MetaService(this.request);
        this.status = new StatusService(this.request);
        this.storage = new StorageService(this.request);
        this.tasks = new TasksService(this.request);
        this.utilities = new UtilitiesService(this.request);
    }
}


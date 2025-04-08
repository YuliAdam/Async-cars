import {
    IEngineDriveRequest,
    IEngineStartStop,
} from "../app/service/engine-service/engine-service";
import {
    ICreateCarParams,
    IGetGarageParams,
} from "../app/service/garage-service/garage-service";
import {
    ICreateWinnerParams,
    IUpdateWinnerParams,
    IWinnersParams,
} from "../app/service/winners-service/winners-service";

export class ServiceCreator {
    protected url: string;
    protected requestParams: {
        method: string;
        body: string;
        headers: { "Content-Type": string };
    };
    protected deleteRequestParams: {
        method: string;
    };
    constructor(url: string) {
        this.url = url;
        this.requestParams = {
            method: "POST",
            body: "",
            headers: {
                "Content-Type": "application/json",
            },
        };

        this.deleteRequestParams = {
            method: "DELETE",
        };
    }
    protected addParamsToUrl(
        param:
            | IGetGarageParams
            | IWinnersParams
            | IEngineStartStop
            | IEngineDriveRequest
    ): string {
        return this.url.concat(
            "?",
            Object.entries(param)
                .map((p) => `${p[0]}=${p[1]}`)
                .join("&")
        );
    }
    protected createErrorMessage(e: Error, errorMessage: string = "Error") {
        return `${errorMessage}: ${e}`;
    }

    protected stringifyBody(
        params:
            | ICreateCarParams
            | ICreateWinnerParams
            | IUpdateWinnerParams
            | IEngineStartStop
            | IEngineDriveRequest
    ) {
        return JSON.stringify(params);
    }

    protected setBodyRequestParams(strParams: string) {
        this.requestParams.body = strParams;
    }
    protected setMethod(method: string) {
        this.requestParams.method = method;
    }

    protected async getRequest(
        requestParams: IGetGarageParams | IWinnersParams,
        errorMessage: string
    ) {
        return await fetch(this.addParamsToUrl(requestParams))
            .then((response) => response.json())
            .catch((e) => this.createErrorMessage(e, errorMessage));
    }

    protected async getCountRequest(
        requestParams: IGetGarageParams | IWinnersParams,
        errorMessage: string
    ) {
        return await fetch(this.addParamsToUrl(requestParams))
            .then((response) => response.headers.get("X-Total-Count"))
            .catch((e) => this.createErrorMessage(e, errorMessage));
    }

    protected async createRequest(
        params: ICreateCarParams | ICreateWinnerParams,
        errorMessage: string
    ) {
        const method: string = "POST";
        this.setBodyRequestParams(this.stringifyBody(params));
        this.setMethod(method);
        return await fetch(this.url, this.requestParams)
            .then((response) => response.json())
            .catch((e) => this.createErrorMessage(e, errorMessage));
    }

    protected async deleteRequest(id: number, errorMessage: string) {
        return await fetch(`${this.url}/${id}`, this.deleteRequestParams)
            .then((response) => response.json())
            .catch((e) => this.createErrorMessage(e, errorMessage));
    }

    protected async getByIdRequest(id: number, errorMessage: string) {
        return await fetch(`${this.url}/${id}`)
            .then((response) => response.json())
            .catch((e) => this.createErrorMessage(e, errorMessage));
    }
    protected async updateRequest(
        params: ICreateCarParams | ICreateWinnerParams | IUpdateWinnerParams,
        id: number,
        errorMessage: string
    ) {
        const method: string = "PUT";
        this.setBodyRequestParams(this.stringifyBody(params));
        this.setMethod(method);
        return await fetch(`${this.url}/${id}`, this.requestParams)
            .then((response) => response.json())
            .catch((e) => this.createErrorMessage(e, errorMessage));
    }
}

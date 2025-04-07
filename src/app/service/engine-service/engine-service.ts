import { ServiceCreator } from "../../../util/service-creator";

export enum ICarState {
    "started" = "started",
    "stopped" = "stopped",
}

export interface IEngineResponse {
    velocity: number;
    distance: number;
}
export interface IEngineStartStop {
    id: number;
    state: ICarState;
}

export interface IEngineDriveRespons {
    success: boolean;
}
export interface IEngineDriveRequest {
    id: number;
    state: "drive";
}

export class EngineService extends ServiceCreator {
    constructor(url: string) {
        super(url);
    }

    public async setState(params: IEngineStartStop): Promise<IEngineResponse> {
        const errorMessage: string = "Fail state setting";
        const method: string = "PATCH";
        this.setBodyRequestParams(this.stringifyBody(params));
        this.setMethod(method);
        return await fetch(`${this.url}/${params.id}`, this.requestParams)
            .then((response) => response.json())
            .catch((e) => this.createErrorMessage(e, errorMessage));
    }

    public async drive(
        params: IEngineDriveRequest
    ): Promise<IEngineDriveRespons> {
        const errorMessage: string = "Fail drive";
        const method: string = "PATCH";
        this.setBodyRequestParams(this.stringifyBody(params));
        this.setMethod(method);
        return await fetch(`${this.url}/${params.id}`, this.requestParams)
            .then((response) => response.json())
            .catch((e) => this.createErrorMessage(e, errorMessage));
    }
}

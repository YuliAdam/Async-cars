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
    status: ICarState;
}

export interface IEngineDriveRespons {
    success: boolean;
}
export interface IEngineDriveRequest {
    id: number;
    status: "drive";
}

export class EngineService extends ServiceCreator {
    constructor(url: string) {
        super(url);
    }

    public async setState(params: IEngineStartStop): Promise<IEngineResponse> {
        const errorMessage: string = "Fail state setting";
        const method: string = "PATCH";
        this.setMethod(method);
        return await fetch(
            this.addParamsToUrl({ id: params.id, status: params.status }),
            this.requestParams
        )
            .then((response) => response.json())
            .catch((e) => this.createErrorMessage(e, errorMessage));
    }

    public async setStateAll(params: IEngineStartStop[]) {
        const errorMessage: string = "Fail state setting";
        const method: string = "PATCH";
        this.setMethod(method);
        let responseArr: Promise<IEngineResponse>[] = [];
        let request: Promise<Response>[] = [];
        params.forEach((el) => {
            request.push(
                fetch(
                    this.addParamsToUrl({ id: el.id, status: el.status }),
                    this.requestParams
                )
            );
        });
        return await Promise.all(request)
            .then((response) => {
                response.forEach((r) => responseArr.push(r.json()));
                return responseArr;
            })
            .catch((e) => this.createErrorMessage(e, errorMessage));
    }

    public async drive(id: number): Promise<IEngineDriveRespons> {
        const errorMessage: string = "Fail drive";
        const method: string = "PATCH";
        this.setMethod(method);
        return await fetch(
            this.addParamsToUrl({ id: id, status: "drive" }),
            this.requestParams
        )
            .then((response) => {
                if (!response.ok && response.status === 500) {
                    console.log(
                        "Car has been stopped suddenly. It's engine was broken down."
                    );
                    return { success: false };
                }
                return response.json();
            })
            .catch((e) => this.createErrorMessage(e, errorMessage));
    }
}

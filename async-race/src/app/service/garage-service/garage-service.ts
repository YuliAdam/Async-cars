import { ServiceCreator } from "../../../util/service-creator";

export interface ICarParam {
    name: string;
    color: string;
    id: number;
}

export interface ICreateCarParams {
    name: string;
    color: string;
}

export interface IGetGarageParams {
    _page?: number;
    _limit: number;
}

export class GarageService extends ServiceCreator {
    public carsNumber: number;
    constructor(url: string) {
        super(url);
        this.carsNumber = 0;
    }

    public async getGarage(param: IGetGarageParams) {
        const errorMessage: string = "Imposible get cars";
        return this.getRequest(param, errorMessage);
    }

    public async getGarageTotalCount() {
        const param: IGetGarageParams = {
            _limit: 1,
        };
        const errorMessage: string = "Imposible get total cars count: ";
        const carsNumberStr: string | null = await this.getCountRequest(
            param,
            errorMessage
        );
        return carsNumberStr;
    }

    public async createCar(params: ICreateCarParams) {
        const errorMessage: string = "Fail car creation";
        this.carsNumber += 1;
        return this.createRequest(params, errorMessage);
    }

    public async deleteCar(id: number) {
        const errorMessage: string = "Fail car deleting";
        this.carsNumber -= 1;
        return await this.deleteRequest(id, errorMessage);
    }
    public async updateCar(params: ICarParam) {
        const errorMessage: string = "Fail car updating";
        const newBody: ICreateCarParams = {
            name: params.name,
            color: params.color,
        };
        return await this.updateRequest(newBody, params.id, errorMessage);
    }

    public async getCar(id: number) {
        const errorMessage: string = "Can't get car";
        return await this.getByIdRequest(id, errorMessage);
    }
}

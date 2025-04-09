import { ServiceCreator } from "../../../util/service-creator";

enum IOrderOption {
    ASC = "ASC",
    DESC = "DESC",
}
enum ISortOption {
    id = "id",
    name = "name",
}

export interface IWinnersParams {
    _page: number;
    _limit: number;
    _sort?: ISortOption;
    _order?: IOrderOption;
}
export interface IResponseWinnerParams {
    id: number;
    wins: number;
    time: number;
}
export interface ICreateWinnerParams {
    id: number;
    time: number;
}

export interface IUpdateWinnerParams {
    wins: number;
    time: number;
}

export class WinnersService extends ServiceCreator {
    public winnersId: number[];
    public winnersCount: number;
    constructor(url: string) {
        super(url);
        this.winnersId = [];
        this.winnersCount = 0;
        this.setAllWinnersId();
    }

    private async setAllWinnersId() {
        const errorMessage: string = "Imposible get winners";
        const data: Promise<IResponseWinnerParams[]> = await fetch(this.url)
            .then((response) => response.json())
            .catch((e) => this.createErrorMessage(e, errorMessage));
        const dataArr = await data;
        dataArr.forEach((el) => this.winnersId.push(el.id));
    }

    public async getWinners(params: IWinnersParams) {
        const errorMessage: string = "Imposible get winners";
        return this.getRequest(params, errorMessage);
    }

    public async getWinnersTotalCount() {
        const param: IWinnersParams = {
            _page: 1,
            _limit: 1,
        };
        const errorMessage: string = "Imposible get total winners count: ";
        const winnersNumberStr: string | null = await this.getCountRequest(
            param,
            errorMessage
        );
        return winnersNumberStr;
    }

    public async createWinner(params: ICreateWinnerParams) {
        const errorMessage: string = "Fail winner creation";
        if (!this.winnersId.includes(params.id)) {
            this.winnersCount++;
            this.winnersId.push(params.id);
            const newWinnerParams: IResponseWinnerParams = {
                id: params.id,
                wins: 1,
                time: parseFloat(params.time.toFixed(1)),
            };
            return await this.createRequest(newWinnerParams, errorMessage);
        } else {
            const winnerParams = await this.getWinner(params.id);
            console.log(winnerParams);
            const newWinsNum: number = winnerParams.wins + 1;
            let time: number = winnerParams.time;
            if (time > params.time) {
                time = params.time;
            }
            const newParams: IResponseWinnerParams = {
                id: params.id,
                time: time,
                wins: newWinsNum,
            };
            return await this.updateWinner(newParams);
        }
    }

    public async deleteWinner(id: number) {
        this.winnersCount--;
        const errorMessage: string = "Fail winner deleting";
        if (this.winnersId.includes(id)) {
            this.winnersId.splice(this.winnersId.indexOf(id), 1);
            return await this.deleteRequest(id, errorMessage);
        }
    }

    private async getWinner(id: number): Promise<IResponseWinnerParams> {
        const errorMessage: string = "Fail winner creation";
        return await this.getByIdRequest(id, errorMessage);
    }

    private async updateWinner(params: IResponseWinnerParams) {
        const errorMessage: string = "Fail winner updating";
        const newBody: IUpdateWinnerParams = {
            wins: params.wins,
            time: parseFloat(params.time.toFixed(1)),
        };
        return await this.updateRequest(newBody, params.id, errorMessage);
    }
}

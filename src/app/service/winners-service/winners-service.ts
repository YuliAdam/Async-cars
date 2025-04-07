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
export interface ICreateWinnerParams {
    id: number;
    wins: number;
    time: number;
}

export interface IUpdateWinnerParams {
    wins: number;
    time: number;
}

export class WinnersService extends ServiceCreator {
    public winnersId: number[];
    constructor(url: string) {
        super(url);
        this.winnersId = [];
        this.setAllWinnersId();
    }

    public async setAllWinnersId() {
        const errorMessage: string = "Imposible get winners";
        const data: Promise<ICreateWinnerParams[]> = await fetch(this.url)
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
            this.winnersId.push(params.id);
            return await this.createRequest(params, errorMessage);
        } else {
            const winnerParams = await this.getWinner(params.id);
            const newWinsNum: number = winnerParams.wins + 1;
            let time: number = winnerParams.time;
            if (time < params.time) {
                time = params.time;
            }
            const newParams: ICreateWinnerParams = {
                id: params.id,
                time: time,
                wins: newWinsNum,
            };
            return await this.updateWinner(newParams);
        }
    }

    public async deleteWinner(id: number) {
        const errorMessage: string = "Fail winner deleting";
        if (this.winnersId.includes(id)) {
            this.winnersId.splice(this.winnersId.indexOf(id), 1);
            return await this.deleteRequest(id, errorMessage);
        }
    }

    public async getWinner(id: number): Promise<ICreateWinnerParams> {
        const errorMessage: string = "Fail winner creation";
        return await this.getByIdRequest(id, errorMessage);
    }

    public async updateWinner(params: ICreateWinnerParams) {
        const errorMessage: string = "Fail winner updating";
        const newBody: IUpdateWinnerParams = {
            wins: params.wins,
            time: params.time,
        };
        return await this.updateRequest(newBody, params.id, errorMessage);
    }
}

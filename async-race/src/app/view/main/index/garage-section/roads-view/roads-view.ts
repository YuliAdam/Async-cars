import "./road-view.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../../util/base-component";
import { View } from "../../../../view";
import { Service } from "../../../../../service/service";
import { CarPanelView } from "./car-panel-view/car-panel-view";
import {
    ICarParam,
    IGetGarageParams,
} from "../../../../../service/garage-service/garage-service";
import { IndexView } from "../../index-view";

const CssClasses: { road: string[] } = {
    road: ["garage_road"],
};

export const CARS_LIMIT: number = 7;

export class GarageRoadView extends View {
    constructor(service: Service, page: number, indexView: IndexView) {
        const garageRoad: IBaseComponentParam = {
            classList: CssClasses.road,
        };
        super(garageRoad);
        this.configView(service, page, indexView);
    }

    public addNewCarPanelView(
        service: Service,
        carParams: ICarParam,
        indexView: IndexView
    ) {
        this.viewComponent.prependChildComponents([
            new CarPanelView(service, carParams, indexView).viewComponent,
        ]);
        const garageRoadEl: HTMLElement | null =
            this.viewComponent.getElement();
        if (garageRoadEl) {
            if (garageRoadEl.children.length > CARS_LIMIT) {
                garageRoadEl.removeChild(garageRoadEl.children[7]);
            }
        }
    }

    private async configView(
        service: Service,
        page: number,
        indexView: IndexView
    ) {
        this.viewComponent.appendChildComponents(
            await this.createCarsPanels(service, page, indexView)
        );
    }

    public async createCarsPanels(
        service: Service,
        page: number,
        indexView: IndexView
    ): Promise<BaseComponent[]> {
        const childArr: BaseComponent[] = [];
        const carParams = await this.getCarsParams(service, page);
        const count: number = carParams.length;
        for (let i = 0; i < count; i++) {
            childArr.push(
                new CarPanelView(service, carParams[i], indexView).viewComponent
            );
        }
        return childArr;
    }

    private async getCarsParams(
        service: Service,
        page: number
    ): Promise<ICarParam[]> {
        const param: IGetGarageParams = { _limit: CARS_LIMIT, _page: page };
        return await service.garageService.getGarage(param);
    }
}

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
    public carsParams: ICarParam[];
    public carPanelViewArr: CarPanelView[];
    constructor(service: Service, page: number, indexView: IndexView) {
        const garageRoad: IBaseComponentParam = {
            classList: CssClasses.road,
        };
        super(garageRoad);
        this.carsParams = [];
        this.carPanelViewArr = [];
        this.configView(service, page, indexView);
    }

    public addNewCarPanelView(
        service: Service,
        carParams: ICarParam,
        indexView: IndexView
    ) {
        const newCarPanel = new CarPanelView(service, carParams, indexView);
        this.viewComponent.prependChildComponents([newCarPanel.viewComponent]);
        const garageRoadEl: HTMLElement | null =
            this.viewComponent.getElement();
        if (garageRoadEl) {
            if (garageRoadEl.children.length > CARS_LIMIT) {
                this.carsParams.pop();
                this.carPanelViewArr.pop();
                garageRoadEl.removeChild(garageRoadEl.children[7]);
            }
        }
        this.carPanelViewArr.push(newCarPanel);
        this.carsParams.push(carParams);
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
        this.carPanelViewArr = [];
        this.carsParams = await this.getCarsParams(service, page);
        const count: number = this.carsParams.length;
        for (let i = 0; i < count; i++) {
            const newCarPanel = new CarPanelView(
                service,
                this.carsParams[i],
                indexView
            );
            this.carPanelViewArr.push(newCarPanel);
            childArr.push(newCarPanel.viewComponent);
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

    public removeCarParams(carParams: ICarParam) {
        this.carsParams.splice(this.carsParams.indexOf(carParams), 1);
    }

    public removeCarPanelView(carPanel: CarPanelView) {
        this.carPanelViewArr.splice(this.carPanelViewArr.indexOf(carPanel), 1);
    }
}

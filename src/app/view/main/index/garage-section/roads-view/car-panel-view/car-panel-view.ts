import "./car-panel-view.css";
import { IBaseComponentParam } from "../../../../../../../util/base-component";
import { View } from "../../../../../view";
import { Service } from "../../../../../../service/service";
import { CarPanelControllerView } from "./panel-controller/panel-controller";
import { CarMoveView } from "./car-move-view/car-move-view";
import { ICarParam } from "../../../../../../service/garage-service/garage-service";
import { IndexView } from "../../../index-view";

const CssClasses: { panel: string[] } = {
    panel: ["roads_car-panel"],
};

export class CarPanelView extends View {
    public controllerComponent: CarPanelControllerView;
    public moveComponent: CarMoveView;
    constructor(service: Service, carParams: ICarParam, indexView: IndexView) {
        const carPanelParam: IBaseComponentParam = {
            classList: CssClasses.panel,
        };
        super(carPanelParam);
        this.controllerComponent = this.getPanelControllerComponent(
            service,
            carParams,
            indexView
        );
        this.moveComponent = this.getPanelMoveComponent(service, carParams);
        this.configView();
    }

    private configView() {
        this.viewComponent.appendChildComponents([
            this.controllerComponent.viewComponent,
            this.moveComponent.viewComponent,
        ]);
    }

    private getPanelControllerComponent(
        service: Service,
        carParams: ICarParam,
        indexView: IndexView
    ): CarPanelControllerView {
        return new CarPanelControllerView(service, carParams, this, indexView);
    }

    private getPanelMoveComponent(
        service: Service,
        carParams: ICarParam
    ): CarMoveView {
        return new CarMoveView(service, carParams);
    }
}

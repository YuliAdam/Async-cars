import "./panel-controller.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../../../../util/base-component";
import { Service } from "../../../../../../../service/service";
import { View } from "../../../../../../view";
import { RoadCarNameComponent } from "./panel-controller-children/panel-controller-car-name";
import { RoadRemoveComponent } from "./panel-controller-children/panel-controller-remove";
import { RoadSelectComponent } from "./panel-controller-children/panel-controller-select";
import { ICarParam } from "../../../../../../../service/garage-service/garage-service";
import { CarPanelView } from "../car-panel-view";
import { IndexView } from "../../../../index-view";

const CssClasses: { controller: string[] } = {
    controller: ["car-panel_controller"],
};

export class CarPanelControllerView extends View {
    public carNameComponent: RoadCarNameComponent;
    constructor(
        service: Service,
        carParams: ICarParam,
        carPanelView: CarPanelView,
        indexView: IndexView
    ) {
        const panelControllerParam: IBaseComponentParam = {
            classList: CssClasses.controller,
        };
        super(panelControllerParam);
        this.carNameComponent = new RoadCarNameComponent(carParams.name);
        this.configView(service, carParams, carPanelView, indexView);
    }
    private configView(
        service: Service,
        carParams: ICarParam,
        carPanelView: CarPanelView,
        indexView: IndexView
    ) {
        this.viewComponent.appendChildComponents(
            this.getChildrenComponents(
                service,
                carParams,
                carPanelView,
                indexView
            )
        );
    }

    private getChildrenComponents(
        service: Service,
        carParams: ICarParam,
        carPanelView: CarPanelView,
        indexView: IndexView
    ): (BaseComponent | RoadCarNameComponent)[] {
        return [
            new RoadSelectComponent(indexView, carParams, carPanelView),
            new RoadRemoveComponent(carParams, service, carPanelView, indexView),
            this.carNameComponent,
        ];
    }

    public setCarName(name: string) {
        const oldCarNameElement: HTMLElement | null =
            this.carNameComponent.getElement();
        const parenElement: HTMLElement | null =
            this.carNameComponent.getParentComponent();
        const newCareName: RoadCarNameComponent = new RoadCarNameComponent(
            name
        );
        const newCarNameElement: HTMLElement | null = newCareName.getElement();
        if (parenElement && newCarNameElement && oldCarNameElement) {
            this.carNameComponent = newCareName;
            parenElement.replaceChild(newCarNameElement, oldCarNameElement);
        }
    }
}

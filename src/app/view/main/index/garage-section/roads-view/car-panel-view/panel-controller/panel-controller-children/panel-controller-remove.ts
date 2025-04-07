import { IBaseComponentParam } from "../../../../../../../../../util/base-component";
import { ButtonComponent } from "../../../../../../../../../util/components/button-component";
import { ICarParam } from "../../../../../../../../service/garage-service/garage-service";
import { Service } from "../../../../../../../../service/service";
import { IndexView } from "../../../../../index-view";
import { GarageView } from "../../../../garage-view";
import { CarPanelView } from "../../car-panel-view";

const CssClasses: { remove: string[] } = {
    remove: ["controller_remove"],
};

const REMOVE_BUTTON_TEXT = "Remove";

export class RoadRemoveComponent extends ButtonComponent {
    constructor(
        carParams: ICarParam,
        service: Service,
        carPanelView: CarPanelView,
        indexView: IndexView
    ) {
        const roadRemoveParam: IBaseComponentParam = {
            classList: CssClasses.remove,
            textContent: REMOVE_BUTTON_TEXT,
        };
        super(roadRemoveParam);
        this.configComponent(service, carPanelView, carParams, indexView);
    }
    private configComponent(
        service: Service,
        carPanelView: CarPanelView,
        carParams: ICarParam,
        indexView: IndexView
    ) {
        this.addComponentEventListener("click", async function () {
            indexView.garageSection.garageHeader.changeCountCarNumber(
                indexView.garageSection.garageHeader.carsNumber - 1
            );
            carPanelView.viewComponent.removeComponent();
            Promise.all([
                await service.garageService.deleteCar(carParams.id),
                await service.winnersService.deleteWinner(carParams.id),
            ]);
        });
    }
}

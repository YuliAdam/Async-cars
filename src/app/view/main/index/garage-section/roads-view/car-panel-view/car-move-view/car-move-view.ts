import "./car-move-view.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../../../../util/base-component";
import { Service } from "../../../../../../../service/service";
import { View } from "../../../../../../view";
import { Car } from "./car-move-children/car";
import { CarMoveControllerView } from "./car-move-children/car-move-controller";
import { Finish } from "./car-move-children/finish";
import { ICarParam } from "../../../../../../../service/garage-service/garage-service";

const CssClasses: { carMove: string[] } = {
    carMove: ["car-panel_car-move"],
};

export class CarMoveView extends View {
    public car: Car;
    public carController: CarMoveControllerView;
    constructor(service: Service, carParams: ICarParam) {
        const carMoveParam: IBaseComponentParam = {
            classList: CssClasses.carMove,
        };
        super(carMoveParam);
        this.car = new Car(carParams);
        this.carController = new CarMoveControllerView(service, this.car);
        this.configView();
    }
    private configView() {
        this.viewComponent.appendChildComponents(
            this.getChildrenComponents()
        );
    }
    private getChildrenComponents(): BaseComponent[] {
        return [this.carController.viewComponent, this.car, new Finish()];
    }

    public setCarColor(carParams: ICarParam) {
        const parent: HTMLElement | null = this.car.getParentComponent();
        const oldCar: HTMLElement | null = this.car.getElement();
        const newCar: Car = new Car(carParams);
        const newCarElement: HTMLElement | null = newCar.getElement();
        if (parent && oldCar && newCarElement) {
            this.car = newCar;
            parent.replaceChild(newCarElement, oldCar);
        }
    }
}

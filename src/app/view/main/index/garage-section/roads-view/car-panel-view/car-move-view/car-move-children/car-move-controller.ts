import "./care-move-children.css";
import { IBaseComponentParam } from "../../../../../../../../../util/base-component";
import { ButtonComponent } from "../../../../../../../../../util/components/button-component";
import { Service } from "../../../../../../../../service/service";
import { View } from "../../../../../../../view";
import { Car } from "./car";

const CssClasses: {
    moveController: string[];
    start: string[];
    stop: string[];
} = {
    moveController: ["car-move_controller"],
    start: ["controller_start"],
    stop: ["controller_stop", "opacity"],
};

const START_BUTTON_TEXT: string = "A";
const STOP_BUTTON_TEXT: string = "B";

export class CarMoveControllerView extends View {
    public startButton: ButtonComponent;
    public stopButton: ButtonComponent;
    constructor(service: Service, car: Car) {
        const moveControllerParam: IBaseComponentParam = {
            classList: CssClasses.moveController,
        };
        super(moveControllerParam);
        this.startButton = this.createStartButtonComponent(service, car);
        this.stopButton = this.createStopButtonComponent(service, car);
        this.configView(service, car);
    }
    private configView(service: Service, car: Car) {
        this.viewComponent.appendChildComponents([
            this.startButton,
            this.stopButton,
        ]);
        console.log(service, car);
    }
    private createStartButtonComponent(
        service: Service,
        car: Car
    ): ButtonComponent {
        const stratButtonParam: IBaseComponentParam = {
            classList: CssClasses.start,
            textContent: START_BUTTON_TEXT,
        };
        const startButton: ButtonComponent = new ButtonComponent(
            stratButtonParam
        );
        startButton.addComponentEventListener("click", () =>
            this.addStartEvent(service, car)
        );
        return startButton;
    }
    private createStopButtonComponent(service: Service, car: Car) {
        const stopButtonParam: IBaseComponentParam = {
            classList: CssClasses.stop,
            textContent: STOP_BUTTON_TEXT,
        };
        const stopButton: ButtonComponent = new ButtonComponent(
            stopButtonParam
        );
        stopButton.addComponentEventListener("click", () =>
            this.addStopEvent(service, car)
        );
        return stopButton;
    }

    public addStartEvent(service: Service, car: Car) {
        car.addClassIfHasNot("driveMood");
        const carElement: HTMLElement | null = car.getElement();
        if (carElement) {
            carElement.style.animationDuration = "5s";
        }
        this.startButton.addClassIfHasNot("opacity");
        this.stopButton.removeClass("opacity");
        console.log(service);
    }

    public addStopEvent(service: Service, car: Car) {
        car.removeClass("driveMood");
        this.startButton.removeClass("opacity");
        this.stopButton.addClassIfHasNot("opacity");

        console.log(service);
    }
}

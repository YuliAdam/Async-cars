import "./care-move-children.css";
import { IBaseComponentParam } from "../../../../../../../../../util/base-component";
import { ButtonComponent } from "../../../../../../../../../util/components/button-component";
import { Service } from "../../../../../../../../service/service";
import { View } from "../../../../../../../view";
import { Car } from "./car";
import {
    ICarState,
    IEngineDriveRespons,
    IEngineResponse,
    IEngineStartStop,
} from "../../../../../../../../service/engine-service/engine-service";

const CssClasses: {
    moveController: string[];
    start: string[];
    stop: string[];
} = {
    moveController: ["car-move_controller"],
    start: ["controller_start"],
    stop: ["controller_stop"],
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
        this.configView();
    }
    private configView() {
        this.viewComponent.appendChildComponents([
            this.startButton,
            this.stopButton,
        ]);
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

    public async addStartEvent(service: Service, car: Car) {
        const params: IEngineStartStop = {
            id: car.carParams.id,
            status: ICarState.started,
        };
        const driveParams: IEngineResponse =
            await service.engineService.setState(params);
        car.addClassIfHasNot("driveMood");
        const time: number = driveParams.distance / driveParams.velocity;
        const carElement: HTMLElement | null = car.getElement();
        if (carElement) {
            carElement.style.animationDuration = `${time}ms`;
        }
        this.startButton.setComponentAttribute("disabled", "true");
        const driveResponse: IEngineDriveRespons =
            await service.engineService.drive(car.carParams.id);
        if (!driveResponse.success && carElement) {
            carElement.style.animationPlayState = "paused";
        }
    }

    public async addStopEvent(service: Service, car: Car) {
        const params: IEngineStartStop = {
            id: car.carParams.id,
            status: ICarState.stopped,
        };
        if (car.hasClass("driveMood")) {
            await service.engineService.setState(params);
            car.removeClass("driveMood");
            this.startButton.removeComponentAttribute("disabled");
            const carElement: HTMLElement | null = car.getElement();
            if (carElement) {
                carElement.style.animationPlayState = "running";
            }
        }
    }

}

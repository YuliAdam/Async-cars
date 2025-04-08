import "./button-children.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../../../util/base-component";
import { ComponentChildren } from "../../../../../../../util/child-component-array";
import { ButtonComponent } from "../../../../../../../util/components/button-component";
import { Service } from "../../../../../../service/service";
import { GarageView } from "../../../garage-section/garage-view";
import {
    ICarState,
    IEngineDriveRespons,
    IEngineStartStop,
} from "../../../../../../service/engine-service/engine-service";
import { DialogView } from "../dialog-view/dialog-view";
import { ICarParam } from "../../../../../../service/garage-service/garage-service";

const CssClasses: { race: string[]; reset: string[] } = {
    race: ["controll_race"],
    reset: ["controll_reset"],
};

const buttonText: { RACE: string; RESET: string } = {
    RACE: "Race",
    RESET: "Reset",
};

export class RaceResetChildren extends ComponentChildren<ButtonComponent> {
    public raceButton: BaseComponent;
    public resetButton: BaseComponent;
    constructor(
        service: Service,
        garageSection: GarageView,
        dialogComponent: DialogView
    ) {
        super();
        this.raceButton = this.createRaceButton(
            service,
            garageSection,
            dialogComponent
        );
        this.resetButton = this.createResetButton(service, garageSection);
        this.childArray.push(this.raceButton, this.resetButton);
    }

    protected getComponentArr(): ButtonComponent[] {
        return [];
    }

    private createRaceButton(
        service: Service,
        garageSection: GarageView,
        dialogComponent: DialogView
    ) {
        const raceButtonParam: IBaseComponentParam = {
            classList: CssClasses.race,
            textContent: buttonText.RACE,
        };
        const raceButton = new ButtonComponent(raceButtonParam);
        raceButton.addComponentEventListener("click", () =>
            this.addRaceEvent(service, garageSection, dialogComponent)
        );
        return raceButton;
    }
    private createResetButton(service: Service, garageSection: GarageView) {
        const resetButtonParam: IBaseComponentParam = {
            classList: CssClasses.reset,
            textContent: buttonText.RESET,
        };
        const resetButton = new ButtonComponent(resetButtonParam);
        resetButton.addComponentEventListener("click", () =>
            this.addResetEvent(service, garageSection)
        );
        return resetButton;
    }

    private async addRaceEvent(
        service: Service,
        garageSection: GarageView,
        dialogComponent: DialogView
    ) {
        const params: IEngineStartStop[] = [];
        garageSection.garageRoad.carsParams.forEach((p) => {
            params.push({ id: p.id, status: ICarState.started });
        });
        const driveParams = await service.engineService.setStateAll(params);
        this.raceButton.setComponentAttribute("disabled", "true");
        const timesArray: { id: number; time: number }[] = [];
        garageSection.garageRoad.carPanelViewArr.forEach(async (panel, i) => {
            const car = panel.moveComponent.car;
            await garageSection.garageRoad.carPanelViewArr[
                i
            ].moveComponent.carController.addStopEvent(service, car);
            const promise = await driveParams[i];
            let time: number = 0;
            if (typeof promise !== "string") {
                time = promise.distance / promise.velocity;
                timesArray.push({ id: car.carParams.id, time: time / 1000 });
            }
            const carElement: HTMLElement | null = car.getElement();
            if (carElement) {
                carElement.style.animationDuration = `${time}ms`;
            }
            car.addClassIfHasNot("driveMood");
            garageSection.garageRoad.carPanelViewArr[
                i
            ].moveComponent.carController.startButton.setComponentAttribute(
                "disabled",
                "true"
            );
            garageSection.garageRoad.carPanelViewArr[
                i
            ].moveComponent.carController.stopButton.removeComponentAttribute(
                "disabled"
            );
            const driveResponse: IEngineDriveRespons =
                await service.engineService.drive(car.carParams.id);
            if (!driveResponse.success && carElement) {
                carElement.style.animationPlayState = "paused";
                timesArray.pop();
            }
        });
        setTimeout(
            async () => this.showWinner(timesArray, service, dialogComponent),
            200
        );
    }

    private async showWinner(
        timesArray: { id: number; time: number }[],
        service: Service,
        dialogComponent: DialogView
    ) {
        console.log(timesArray);
        const winnerResult = await this.getWinnerResult(timesArray, service);
        console.log(winnerResult);
        setTimeout(
            () => this.openDialog(winnerResult, dialogComponent),
            timesArray[timesArray.length - 1].time * 1000
        );
    }

    private async getWinnerResult(
        timesArray: { id: number; time: number }[],
        service: Service
    ): Promise<{ winnerParams: ICarParam; time: number }> {
        timesArray.sort((a, b) => a.time - b.time);
        const winner = timesArray[0];
        const winnerParams: ICarParam = await service.garageService.getCar(
            winner.id
        );
        return { winnerParams: winnerParams, time: winner.time };
    }

    private openDialog(
        winnerParams: {
            winnerParams: ICarParam;
            time: number;
        },
        dialogComponent: DialogView
    ) {
        dialogComponent.setDialog(
            winnerParams.winnerParams.name,
            winnerParams.time
        );
        console.log(dialogComponent);
        dialogComponent.showDialog();
    }

    private async addResetEvent(service: Service, garageSection: GarageView) {
        const params: IEngineStartStop[] = [];
        garageSection.garageRoad.carsParams.forEach((p) => {
            params.push({ id: p.id, status: ICarState.stopped });
        });
        await service.engineService.setStateAll(params);
        this.raceButton.removeComponentAttribute("disabled");
        garageSection.garageRoad.carPanelViewArr.forEach((panel, i) => {
            const car = panel.moveComponent.car;
            car.removeClass("driveMood");
            garageSection.garageRoad.carPanelViewArr[
                i
            ].moveComponent.carController.startButton.removeClass("opacity");
            garageSection.garageRoad.carPanelViewArr[
                i
            ].moveComponent.carController.startButton.removeComponentAttribute(
                "disabled"
            );
            const carElement: HTMLElement | null = car.getElement();
            if (carElement) {
                carElement.style.animationPlayState = "running";
            }
        });
    }
}

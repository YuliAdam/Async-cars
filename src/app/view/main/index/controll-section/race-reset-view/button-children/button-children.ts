import "./button-children.css";
import { IBaseComponentParam } from "../../../../../../../util/base-component";
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
import { Car } from "../../../garage-section/roads-view/car-panel-view/car-move-view/car-move-children/car";
import { ICreateWinnerParams } from "../../../../../../service/winners-service/winners-service";

const CssClasses: { race: string[]; reset: string[] } = {
    race: ["controll_race"],
    reset: ["controll_reset"],
};

const buttonText: { RACE: string; RESET: string } = {
    RACE: "Race",
    RESET: "Reset",
};

export class RaceResetChildren extends ComponentChildren<ButtonComponent> {
    public raceButton: ButtonComponent;
    public resetButton: ButtonComponent;
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
        const timesArray: { id: number; time: number }[] = [];
        this.raceButton.doDisabled();
        this.resetButton.doDisabled();
        garageSection.garageRoad.carsParams.forEach((p) => {
            params.push({ id: p.id, status: ICarState.started });
        });
        const driveParams = await service.engineService.setStateAll(params);
        garageSection.garageRoad.carPanelViewArr.forEach(async (panel, i) => {
            const car: Car = panel.moveComponent.car;
            await garageSection.garageRoad.carPanelViewArr[
                i
            ].moveComponent.carController.addStopEvent(service, car);
            const promise = await driveParams[i];
            let time: number = 0;
            if (typeof promise !== "string") {
                time = promise.distance / promise.velocity;
                timesArray.push({ id: car.carParams.id, time: time / 1000 });
            }
            car.setAnimationDuration(time);
            car.addClassIfHasNot("driveMood");
            garageSection.garageRoad.carPanelViewArr[
                i
            ].moveComponent.carController.startButton.doDisabled();
            garageSection.garageRoad.carPanelViewArr[
                i
            ].moveComponent.carController.stopButton.removeDisabled();
            this.doDriveRequest(service, car, timesArray);
        });
        setTimeout(async () => {
            this.showWinner(timesArray, service, dialogComponent);
        }, 200);
    }

    private async doDriveRequest(
        service: Service,
        car: Car,
        timesArray: { id: number; time: number }[]
    ) {
        const driveResponse: IEngineDriveRespons =
            await service.engineService.drive(car.carParams.id);
        if (!driveResponse.success) {
            car.setAnimationPlayState("paused");
            timesArray.pop();
        }
    }

    private async showWinner(
        timesArray: { id: number; time: number }[],
        service: Service,
        dialogComponent: DialogView
    ) {
        const winnerResult = await this.getWinnerResult(timesArray, service);
        this.addResultInWinnersTable(service, {
            id: winnerResult.winnerParams.id,
            time: winnerResult.time,
        });
        setTimeout(
            () => {
                this.openDialog(winnerResult, dialogComponent);
                this.resetButton.removeDisabled();
            },
            timesArray[timesArray.length - 1].time * 100 + 200
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
        dialogComponent.showDialog();
    }

    private async addResetEvent(service: Service, garageSection: GarageView) {
        const params: IEngineStartStop[] = [];
        garageSection.garageRoad.carsParams.forEach((p) => {
            params.push({ id: p.id, status: ICarState.stopped });
        });
        await service.engineService.setStateAll(params);
        this.raceButton.removeDisabled();
        garageSection.garageRoad.carPanelViewArr.forEach((panel, i) => {
            const car = panel.moveComponent.car;
            car.removeClass("driveMood");
            garageSection.garageRoad.carPanelViewArr[
                i
            ].moveComponent.carController.startButton.removeDisabled();
            car.setAnimationPlayState("running");
        });
    }

    public async addResultInWinnersTable(
        service: Service,
        params: ICreateWinnerParams
    ) {
        await service.winnersService.createWinner(params);
    }
}

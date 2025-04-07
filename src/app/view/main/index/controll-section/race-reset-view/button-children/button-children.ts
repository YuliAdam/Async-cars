import './button-children.css'
import { IBaseComponentParam } from "../../../../../../../util/base-component";
import { ComponentChildren } from "../../../../../../../util/child-component-array";
import { ButtonComponent } from "../../../../../../../util/components/button-component";

const CssClasses: { race: string[]; reset: string[] } = {
    race: ["controll_race"],
    reset: ["controll_reset"],
};

const buttonText: { RACE: string; RESET: string } = {
    RACE: "Race",
    RESET: "Reset",
};

export class RaceResetChildren extends ComponentChildren<ButtonComponent> {
    constructor() {
        super();
    }

    protected getComponentArr(): ButtonComponent[] {
        return [this.createRaceButton(), this.createResetButton()];
    }

    private createRaceButton() {
        const raceButtonParam: IBaseComponentParam = {
            classList: CssClasses.race,
            textContent: buttonText.RACE,
        };
        return new ButtonComponent(raceButtonParam);
    }
    private createResetButton() {
        const resetButtonParam: IBaseComponentParam = {
            classList: CssClasses.reset,
            textContent: buttonText.RESET,
        };
        return new ButtonComponent(resetButtonParam);
    }
}

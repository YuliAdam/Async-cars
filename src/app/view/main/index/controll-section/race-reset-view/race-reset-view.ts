import "./race-reset-view.css";
import { IBaseComponentParam } from "../../../../../../util/base-component";
import { View } from "../../../../view";
import { RaceResetChildren } from "./button-children/button-children";
import { ButtonComponent } from "../../../../../../util/components/button-component";

const CssClasses: { raceResetWrap: string[] } = {
    raceResetWrap: ["controll_race-reset_wrapper"],
};

export class RaceResetView extends View {
    constructor() {
        const raceResetParam: IBaseComponentParam = {
            classList: CssClasses.raceResetWrap,
        };
        super(raceResetParam);
        this.configView();
    }

    private configView() {
        this.viewComponent.appendChildComponents(
            this.createChildrenComponents()
        );
    }

    private createChildrenComponents(): ButtonComponent[] {
        return new RaceResetChildren().childArray;
    }
}

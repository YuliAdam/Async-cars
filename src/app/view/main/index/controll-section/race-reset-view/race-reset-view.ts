import "./race-reset-view.css";
import { IBaseComponentParam } from "../../../../../../util/base-component";
import { View } from "../../../../view";
import { RaceResetChildren } from "./button-children/button-children";
import { ButtonComponent } from "../../../../../../util/components/button-component";
import { Service } from "../../../../../service/service";
import { GarageView } from "../../garage-section/garage-view";

const CssClasses: { raceResetWrap: string[] } = {
    raceResetWrap: ["controll_race-reset_wrapper"],
};

export class RaceResetView extends View {
    constructor(service: Service, garageSection: GarageView) {
        const raceResetParam: IBaseComponentParam = {
            classList: CssClasses.raceResetWrap,
        };
        super(raceResetParam);
        this.configView(service, garageSection);
    }

    private configView(service: Service, garageSection: GarageView) {
        this.viewComponent.appendChildComponents(
            this.createChildrenComponents(service, garageSection)
        );
    }

    private createChildrenComponents(
        service: Service,
        garageSection: GarageView
    ): ButtonComponent[] {
        return new RaceResetChildren(service, garageSection).childArray;
    }
}

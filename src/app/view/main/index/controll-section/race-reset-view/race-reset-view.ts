import "./race-reset-view.css";
import { IBaseComponentParam } from "../../../../../../util/base-component";
import { View } from "../../../../view";
import { RaceResetChildren } from "./button-children/button-children";
import { ButtonComponent } from "../../../../../../util/components/button-component";
import { Service } from "../../../../../service/service";
import { GarageView } from "../../garage-section/garage-view";
import { DialogView } from "./dialog-view/dialog-view";

const CssClasses: { raceResetWrap: string[] } = {
    raceResetWrap: ["controll_race-reset_wrapper"],
};

export class RaceResetView extends View {
    private dialogComponent: DialogView;
    constructor(service: Service, garageSection: GarageView) {
        const raceResetParam: IBaseComponentParam = {
            classList: CssClasses.raceResetWrap,
        };
        super(raceResetParam);
        this.dialogComponent = this.createDialog();
        this.configView(service, garageSection);
    }

    private configView(service: Service, garageSection: GarageView) {
        this.viewComponent.appendChildComponents([
            ...this.createChildrenComponents(
                service,
                garageSection,
                this.dialogComponent
            ),
            this.dialogComponent.viewComponent,
        ]);
    }

    private createChildrenComponents(
        service: Service,
        garageSection: GarageView,
        dialogComponent: DialogView
    ): ButtonComponent[] {
        return new RaceResetChildren(service, garageSection, dialogComponent)
            .childArray;
    }

    private createDialog() {
        return new DialogView();
    }
}

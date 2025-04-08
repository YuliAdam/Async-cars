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
    public childComponents: RaceResetChildren;
    constructor(service: Service, garageSection: GarageView) {
        const raceResetParam: IBaseComponentParam = {
            classList: CssClasses.raceResetWrap,
        };
        super(raceResetParam);
        this.dialogComponent = this.createDialog();
        this.childComponents = this.createChildrenComponents(
            service,
            garageSection,
            this.dialogComponent
        );
        this.configView();
    }

    private configView() {
        this.viewComponent.appendChildComponents([
            ...this.childComponents.childArray,
            this.dialogComponent.viewComponent,
        ]);
    }

    private createChildrenComponents(
        service: Service,
        garageSection: GarageView,
        dialogComponent: DialogView
    ): RaceResetChildren {
        return new RaceResetChildren(service, garageSection, dialogComponent);
    }

    private createDialog() {
        return new DialogView();
    }
}

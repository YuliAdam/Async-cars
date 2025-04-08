import "./controll-view.css";
import { IBaseComponentParam } from "../../../../../util/base-component";
import { View } from "../../../view";
import { UpdateGarageView } from "./update-garage-view/update-garage-view";
import { RaceResetView } from "./race-reset-view/race-reset-view";
import { Service } from "../../../../service/service";
import { GarageView } from "../garage-section/garage-view";
import { PaginationView } from "../pagination-section/pagination-view";
import { IndexView } from "../index-view";

const CssClasses: { controllSection: string[] } = {
    controllSection: ["index_controll"],
};

export class ControllView extends View {
    public updateGarageView: UpdateGarageView;
    public raceResetView: RaceResetView;
    constructor(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ) {
        const garageViewParam: IBaseComponentParam = {
            tag: "section",
            classList: CssClasses.controllSection,
        };
        super(garageViewParam);
        this.updateGarageView = this.createUpdateGarageWrap(
            service,
            garageSection,
            paginationSection,
            indexView
        );
        this.raceResetView = this.createRaceResetWrap(service, garageSection);
        this.configView();
    }

    private configView(): void {
        this.viewComponent.appendChildComponents([
            this.updateGarageView.viewComponent,
            this.raceResetView.viewComponent,
        ]);
    }

    private createUpdateGarageWrap(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ): UpdateGarageView {
        return new UpdateGarageView(
            service,
            garageSection,
            paginationSection,
            indexView
        );
    }
    private createRaceResetWrap(
        service: Service,
        garageSection: GarageView
    ): RaceResetView {
        return new RaceResetView(service, garageSection);
    }
}

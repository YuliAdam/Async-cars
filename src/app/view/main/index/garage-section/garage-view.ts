import "./garage-view.css";
import { type IBaseComponentParam } from "../../../../../util/base-component";
import { View } from "../../../view";
import { Service } from "../../../../service/service";
import { GarageHeaderView } from "./header-view/header-view";
import { GarageRoadView } from "./roads-view/roads-view";
import { IndexView } from "../index-view";

const CssClasses: { garageSection: string[] } = {
    garageSection: ["index_garage"],
};

export class GarageView extends View {
    public garageHeader: GarageHeaderView;
    public garageRoad: GarageRoadView;
    constructor(service: Service, indexView: IndexView) {
        const garageViewParam: IBaseComponentParam = {
            tag: "section",
            classList: CssClasses.garageSection,
        };
        super(garageViewParam);
        const initialPage: number = 1;
        this.garageHeader = this.getGarageHeaderComponent(service);
        this.garageRoad = this.getGarageRoadsComponent(
            service,
            initialPage,
            indexView
        );
        this.configView();
    }

    private configView(): void {
        this.viewComponent.appendChildComponents([
            this.garageHeader.viewComponent,
            this.garageRoad.viewComponent,
        ]);
    }

    private getGarageHeaderComponent(service: Service): GarageHeaderView {
        return new GarageHeaderView(service);
    }

    private getGarageRoadsComponent(
        service: Service,
        page: number,
        indexView: IndexView
    ): GarageRoadView {
        return new GarageRoadView(service, page, indexView);
    }
}

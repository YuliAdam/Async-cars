import "./index-view.css";
import { type IBaseComponentParam } from "../../../../util/base-component";
import { View } from "../../view";
import { ControllView } from "./controll-section/controll-view";
import { GarageView } from "./garage-section/garage-view";
import { Service } from "../../../service/service";
import { PaginationView } from "./pagination-section/pagination-view";

const CssClasses: { index: string[]; controll: string[] } = {
    index: ["main_index"],
    controll: ["index_controll"],
};

export class IndexView extends View {
    public controllSection: ControllView;
    public garageSection: GarageView;
    public paginationSection: PaginationView;
    constructor(service: Service) {
        const indexParam: IBaseComponentParam = {
            classList: CssClasses.index,
        };
        super(indexParam);
        this.garageSection = this.getGarageSectionComponent(service);
        this.paginationSection = this.getPaginationSectionComponent(service);
        this.controllSection = this.getControllSectionComponent(service);
        this.configView();
    }

    private configView() {
        this.viewComponent.appendChildComponents([
            this.controllSection.viewComponent,
            this.garageSection.viewComponent,
            this.paginationSection.viewComponent,
        ]);
    }

    private getControllSectionComponent(service: Service): ControllView {
        return new ControllView(
            service,
            this.garageSection,
            this.paginationSection,
            this
        );
    }
    private getGarageSectionComponent(service: Service): GarageView {
        return new GarageView(service, this);
    }
    private getPaginationSectionComponent(service: Service): PaginationView {
        return new PaginationView(service, this.garageSection, this);
    }
}

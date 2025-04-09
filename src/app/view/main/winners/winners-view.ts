import "./winners-view.css";
import { IBaseComponentParam } from "../../../../util/base-component";
import { Service } from "../../../service/service";
import { View } from "../../view";
import { WinnersHeaderView } from "./header/winners-header";
import { WinnersTableView } from "./wins-table/wins-table";
import { PaginationView } from "./pagination/pagination-view";

const CssClasses: { winners: string[] } = {
    winners: ["main_winners"],
};

export class WinnersView extends View {
    public headerComponent: WinnersHeaderView;
    public tableComponent: WinnersTableView;
    public paginationComponent: PaginationView;
    constructor(service: Service) {
        const winnersParam: IBaseComponentParam = {
            classList: CssClasses.winners,
        };
        super(winnersParam);
        this.headerComponent = this.getHeaderComponent(service);
        this.tableComponent = this.getTableComponent(service);
        this.paginationComponent = this.getPaginationView(service, this);
        this.configView();
    }
    private configView() {
        this.viewComponent.appendChildComponents([
            this.headerComponent.viewComponent,
            this.tableComponent.viewComponent,
            this.paginationComponent.viewComponent,
        ]);
    }

    private getHeaderComponent(service: Service): WinnersHeaderView {
        return new WinnersHeaderView(service);
    }

    private getTableComponent(service: Service): WinnersTableView {
        return new WinnersTableView(service, this.headerComponent);
    }
    private getPaginationView(service: Service, winnerView: WinnersView) {
        return new PaginationView(service, winnerView);
    }
}
